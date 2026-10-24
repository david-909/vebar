<?php

namespace App\Content;

use Carbon\CarbonImmutable;
use Illuminate\Contracts\Support\Arrayable;

/**
 * A long-form guide (vodič) published under /vodic/{slug}.
 *
 * @implements Arrayable<string, mixed>
 */
final readonly class Guide implements Arrayable
{
    /**
     * @param  list<array{id: string, label: string}>  $toc
     * @param  array{label: string, href: string}|null  $tocButton
     * @param  array{title: string, text: string, button: string, href: string}  $cta
     * @param  list<array{question: string, answer: string}>  $faq
     * @param  list<string>  $related
     */
    public function __construct(
        public int $number,
        public string $slug,
        public string $metaTitle,
        public string $headline,
        public string $schemaHeadline,
        public string $cardTitle,
        public string $description,
        public string $excerpt,
        public string $lead,
        public string $category,
        public string $breadcrumb,
        public int $readingMinutes,
        public CarbonImmutable $publishedAt,
        public CarbonImmutable $updatedAt,
        public array $toc,
        public ?array $tocButton,
        public array $cta,
        public array $faq,
        public array $related,
    ) {}

    public function path(): string
    {
        return "/vodic/{$this->slug}";
    }

    public function wasUpdated(): bool
    {
        return $this->updatedAt->gt($this->publishedAt);
    }

    /**
     * Compact representation used for guide cards and listings.
     *
     * @return array{number: int, slug: string, title: string, cardTitle: string, excerpt: string, category: string, readingMinutes: int}
     */
    public function toCard(): array
    {
        return [
            'number' => $this->number,
            'slug' => $this->slug,
            'title' => $this->headline,
            'cardTitle' => $this->cardTitle,
            'excerpt' => $this->excerpt,
            'category' => $this->category,
            'readingMinutes' => $this->readingMinutes,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            ...$this->toCard(),
            'lead' => $this->lead,
            'breadcrumb' => $this->breadcrumb,
            'publishedAt' => $this->publishedAt->toDateString(),
            'updatedAt' => $this->updatedAt->toDateString(),
            'wasUpdated' => $this->wasUpdated(),
            'toc' => $this->toc,
            'tocButton' => $this->tocButton,
            'cta' => $this->cta,
        ];
    }
}
