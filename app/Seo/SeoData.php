<?php

namespace App\Seo;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Support\Arrayable;

/**
 * Everything a page needs in its <head> for search engines and social
 * previews. Shared with the frontend as the `seo` page prop.
 *
 * @implements Arrayable<string, mixed>
 */
final class SeoData implements Arrayable
{
    /** @var list<array<string, mixed>> */
    private array $schema = [];

    private bool $indexable = true;

    private string $type = 'website';

    private ?CarbonImmutable $publishedAt = null;

    private ?CarbonImmutable $modifiedAt = null;

    private ?string $image = null;

    public function __construct(
        public readonly string $title,
        public readonly string $description,
        public readonly string $path,
    ) {}

    public static function make(string $title, string $description, string $path): self
    {
        return new self($title, $description, $path);
    }

    /**
     * Turn a site-relative path into an absolute URL on the canonical host.
     */
    public static function absolute(string $path): string
    {
        $base = rtrim((string) config('app.url'), '/');

        return $path === '/' ? "{$base}/" : $base.'/'.ltrim($path, '/');
    }

    public function canonical(): string
    {
        return self::absolute($this->path);
    }

    public function noindex(): self
    {
        $this->indexable = false;

        return $this;
    }

    public function article(CarbonImmutable $publishedAt, CarbonImmutable $modifiedAt): self
    {
        $this->type = 'article';
        $this->publishedAt = $publishedAt;
        $this->modifiedAt = $modifiedAt;

        return $this;
    }

    public function image(string $path): self
    {
        $this->image = $path;

        return $this;
    }

    /**
     * Add JSON-LD nodes to this page's @graph (in addition to the site-wide ones).
     *
     * @param  array<string, mixed>  ...$nodes
     */
    public function schema(array ...$nodes): self
    {
        array_push($this->schema, ...array_values($nodes));

        return $this;
    }

    /**
     * @return array{title: string, description: string, canonical: string, robots: string, type: string, image: string, siteName: string, locale: string, publishedAt: string|null, modifiedAt: string|null, jsonLd: array<string, mixed>}
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'canonical' => $this->canonical(),
            'robots' => $this->indexable
                ? 'index, follow, max-image-preview:large, max-snippet:-1'
                : 'noindex, follow',
            'type' => $this->type,
            'image' => self::absolute($this->image ?? config('site.og_image')),
            'siteName' => config('site.name'),
            'locale' => config('site.og_locale'),
            'publishedAt' => $this->publishedAt?->toAtomString(),
            'modifiedAt' => $this->modifiedAt?->toAtomString(),
            'jsonLd' => StructuredData::graph(
                StructuredData::organization(),
                StructuredData::website(),
                ...$this->schema,
            ),
        ];
    }
}
