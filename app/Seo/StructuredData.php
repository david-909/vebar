<?php

namespace App\Seo;

use App\Content\Guide;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;

/**
 * Builders for schema.org JSON-LD nodes. Nodes reference each other by
 *
 * @id so the whole page is described as one connected @graph.
 */
final class StructuredData
{
    /**
     * @param  array<string, mixed>  ...$nodes
     * @return array{'@context': string, '@graph': list<array<string, mixed>>}
     */
    public static function graph(array ...$nodes): array
    {
        return [
            '@context' => 'https://schema.org',
            '@graph' => array_values($nodes),
        ];
    }

    public static function id(string $fragment, string $path = '/'): string
    {
        return SeoData::absolute($path).'#'.$fragment;
    }

    /**
     * The business itself. Used as author and publisher everywhere.
     *
     * @return array<string, mixed>
     */
    public static function organization(): array
    {
        return [
            '@type' => 'ProfessionalService',
            '@id' => self::id('organization'),
            'name' => config('site.name'),
            'description' => config('site.tagline'),
            'url' => SeoData::absolute('/'),
            'logo' => [
                '@type' => 'ImageObject',
                '@id' => self::id('logo'),
                'url' => SeoData::absolute(config('site.logo')),
            ],
            'image' => SeoData::absolute(config('site.og_image')),
            'email' => config('site.email'),
            'telephone' => config('site.phone'),
            'priceRange' => config('site.price_range'),
            'address' => [
                '@type' => 'PostalAddress',
                'addressLocality' => config('site.city'),
                'addressCountry' => config('site.country'),
            ],
            'areaServed' => [
                ['@type' => 'Country', 'name' => 'Srbija'],
                ['@type' => 'City', 'name' => config('site.city')],
            ],
            'contactPoint' => [
                '@type' => 'ContactPoint',
                'contactType' => 'customer service',
                'email' => config('site.email'),
                'telephone' => config('site.phone'),
                'areaServed' => config('site.country'),
                'availableLanguage' => ['sr'],
            ],
            'hasOfferCatalog' => [
                '@type' => 'OfferCatalog',
                'name' => 'Usluge izrade sajtova',
                'itemListElement' => collect(Config::array('site.services'))
                    ->map(fn (array $service): array => [
                        '@type' => 'Offer',
                        'itemOffered' => [
                            '@type' => 'Service',
                            'name' => $service['name'],
                            'description' => $service['description'],
                        ],
                        'priceSpecification' => array_filter([
                            '@type' => isset($service['unit']) ? 'UnitPriceSpecification' : 'PriceSpecification',
                            'minPrice' => $service['price'],
                            'priceCurrency' => 'RSD',
                            'unitCode' => $service['unit'] ?? null,
                        ]),
                    ])
                    ->all(),
            ],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function website(): array
    {
        return [
            '@type' => 'WebSite',
            '@id' => self::id('website'),
            'url' => SeoData::absolute('/'),
            'name' => config('site.name'),
            'inLanguage' => config('site.locale'),
            'publisher' => ['@id' => self::id('organization')],
        ];
    }

    /**
     * @param  array<string, mixed>  $extra
     * @return array<string, mixed>
     */
    public static function webPage(SeoData $seo, string $type = 'WebPage', bool $withBreadcrumb = true, array $extra = []): array
    {
        return array_filter([
            '@type' => $type,
            '@id' => $seo->canonical().'#webpage',
            'url' => $seo->canonical(),
            'name' => $seo->title,
            'description' => $seo->description,
            'inLanguage' => config('site.locale'),
            'isPartOf' => ['@id' => self::id('website')],
            'about' => ['@id' => self::id('organization')],
            'breadcrumb' => $withBreadcrumb ? ['@id' => $seo->canonical().'#breadcrumb'] : null,
            ...$extra,
        ]);
    }

    /**
     * @param  list<array{0: string, 1: string}>  $items  Pairs of [name, path].
     * @return array<string, mixed>
     */
    public static function breadcrumbs(SeoData $seo, array $items): array
    {
        return [
            '@type' => 'BreadcrumbList',
            '@id' => $seo->canonical().'#breadcrumb',
            'itemListElement' => collect($items)
                ->values()
                ->map(fn (array $item, int $index): array => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'name' => $item[0],
                    'item' => SeoData::absolute($item[1]),
                ])
                ->all(),
        ];
    }

    /**
     * @param  iterable<array{question: string, answer: string}>  $questions
     * @return array<string, mixed>
     */
    public static function faq(SeoData $seo, iterable $questions): array
    {
        return [
            '@type' => 'FAQPage',
            '@id' => $seo->canonical().'#faq',
            'mainEntity' => collect($questions)
                ->map(fn (array $item): array => [
                    '@type' => 'Question',
                    'name' => $item['question'],
                    'acceptedAnswer' => ['@type' => 'Answer', 'text' => $item['answer']],
                ])
                ->values()
                ->all(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public static function article(SeoData $seo, Guide $guide, int $wordCount): array
    {
        return [
            '@type' => 'Article',
            '@id' => $seo->canonical().'#article',
            'headline' => $guide->schemaHeadline,
            'description' => $guide->description,
            'articleSection' => $guide->category,
            'inLanguage' => config('site.locale'),
            'wordCount' => $wordCount,
            'timeRequired' => "PT{$guide->readingMinutes}M",
            'datePublished' => $guide->publishedAt->toDateString(),
            'dateModified' => $guide->updatedAt->toDateString(),
            'image' => SeoData::absolute(config('site.og_image')),
            'author' => ['@id' => self::id('organization')],
            'publisher' => ['@id' => self::id('organization')],
            'mainEntityOfPage' => ['@id' => $seo->canonical().'#webpage'],
            'isPartOf' => ['@id' => self::id('website')],
        ];
    }

    /**
     * @param  Collection<string, Guide>  $guides
     * @return array<string, mixed>
     */
    public static function guideList(SeoData $seo, Collection $guides): array
    {
        return [
            '@type' => 'ItemList',
            '@id' => $seo->canonical().'#list',
            'numberOfItems' => $guides->count(),
            'itemListElement' => $guides
                ->values()
                ->map(fn (Guide $guide, int $index): array => [
                    '@type' => 'ListItem',
                    'position' => $index + 1,
                    'url' => SeoData::absolute($guide->path()),
                    'name' => $guide->schemaHeadline,
                ])
                ->all(),
        ];
    }
}
