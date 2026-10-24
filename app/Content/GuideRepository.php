<?php

namespace App\Content;

use Carbon\CarbonImmutable;
use Illuminate\Container\Attributes\Singleton;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

/**
 * File-backed store for guides: metadata in resources/content/guides.php,
 * article bodies as HTML fragments in resources/content/guides/{slug}.html.
 */
#[Singleton]
class GuideRepository
{
    /** @var Collection<string, Guide>|null */
    private ?Collection $guides = null;

    /**
     * All guides in their editorial order, keyed by slug.
     *
     * @return Collection<string, Guide>
     */
    public function all(): Collection
    {
        return $this->guides ??= collect($this->definitions())
            ->map(fn (array $guide, int $index): Guide => new Guide(
                number: $index + 1,
                slug: $guide['slug'],
                metaTitle: $guide['meta_title'],
                headline: $guide['headline'],
                schemaHeadline: $guide['schema_headline'],
                cardTitle: $guide['card_title'],
                description: $guide['description'],
                excerpt: $guide['excerpt'],
                lead: $guide['lead'],
                category: $guide['category'],
                breadcrumb: $guide['breadcrumb'],
                readingMinutes: $guide['reading_minutes'],
                publishedAt: CarbonImmutable::parse($guide['published_at']),
                updatedAt: CarbonImmutable::parse($guide['updated_at']),
                toc: $guide['toc'],
                tocButton: $guide['toc_button'],
                cta: $guide['cta'],
                faq: $guide['faq'],
                related: $guide['related'],
            ))
            ->keyBy('slug');
    }

    /**
     * @return list<array{slug: string, meta_title: string, headline: string, schema_headline: string, card_title: string, description: string, excerpt: string, lead: string, category: string, breadcrumb: string, reading_minutes: int, published_at: string, updated_at: string, toc: list<array{id: string, label: string}>, toc_button: array{label: string, href: string}|null, cta: array{title: string, text: string, button: string, href: string}, faq: list<array{question: string, answer: string}>, related: list<string>}>
     */
    private function definitions(): array
    {
        return require resource_path('content/guides.php');
    }

    public function find(string $slug): ?Guide
    {
        return $this->all()->get($slug);
    }

    public function body(Guide $guide): string
    {
        return File::get(resource_path("content/guides/{$guide->slug}.html"));
    }

    /**
     * @return Collection<int, Guide>
     */
    public function related(Guide $guide): Collection
    {
        return collect($guide->related)
            ->map(fn (string $slug): ?Guide => $this->find($slug))
            ->filter()
            ->values();
    }

    public function lastModified(): CarbonImmutable
    {
        return $this->all()->max(fn (Guide $guide): CarbonImmutable => $guide->updatedAt);
    }
}
