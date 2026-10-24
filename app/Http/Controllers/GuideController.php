<?php

namespace App\Http\Controllers;

use App\Content\Guide;
use App\Content\GuideRepository;
use App\Seo\SeoData;
use App\Seo\StructuredData;
use Inertia\Inertia;
use Inertia\Response;

class GuideController extends Controller
{
    /**
     * List all guides.
     */
    public function index(GuideRepository $guides): Response
    {
        $seo = SeoData::make(
            title: 'Vodiči o izradi sajtova — Vebar',
            description: 'Praktični vodiči o ceni i rokovima izrade sajta, domenu i hostingu, redizajnu bez gubitka pozicija, pripremi materijala i online katalogu za veleprodaju.',
            path: '/vodic',
        );

        $seo->schema(
            StructuredData::webPage($seo, 'CollectionPage', extra: [
                'mainEntity' => ['@id' => $seo->canonical().'#list'],
            ]),
            StructuredData::breadcrumbs($seo, [['Početna', '/'], ['Vodiči', '/vodic']]),
            StructuredData::guideList($seo, $guides->all()),
        );

        return Inertia::render('site/guides/index', [
            'seo' => $seo,
            'guides' => $guides->all()->map(fn (Guide $guide): array => $guide->toCard())->values(),
        ]);
    }

    /**
     * Show a single guide.
     */
    public function show(GuideRepository $guides, string $slug): Response
    {
        $guide = $guides->find($slug) ?? abort(404);
        $body = $guides->body($guide);

        $seo = SeoData::make(
            title: "{$guide->metaTitle} — Vebar",
            description: $guide->description,
            path: $guide->path(),
        )->article($guide->publishedAt, $guide->updatedAt);

        $seo->schema(
            StructuredData::webPage($seo),
            StructuredData::breadcrumbs($seo, [['Početna', '/'], ['Vodiči', '/vodic'], [$guide->breadcrumb, $guide->path()]]),
            StructuredData::article($seo, $guide, str_word_count(strip_tags($body), format: 0, characters: 'ČčĆćŽžŠšĐđ')),
        );

        if ($guide->faq !== []) {
            $seo->schema(StructuredData::faq($seo, $guide->faq));
        }

        return Inertia::render('site/guides/show', [
            'seo' => $seo,
            'guide' => $guide,
            'body' => $body,
            'related' => $guides->related($guide)->map(fn (Guide $related): array => $related->toCard()),
        ]);
    }
}
