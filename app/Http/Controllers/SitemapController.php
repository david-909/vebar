<?php

namespace App\Http\Controllers;

use App\Content\Guide;
use App\Content\GuideRepository;
use App\Seo\SeoData;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Render the XML sitemap of all indexable pages.
     */
    public function __invoke(GuideRepository $guides): Response
    {
        $urls = collect([
            ['path' => '/', 'lastmod' => $guides->lastModified()->toDateString(), 'priority' => '1.0'],
            ['path' => '/vodic', 'lastmod' => $guides->lastModified()->toDateString(), 'priority' => '0.8'],
            ...$guides->all()->map(fn (Guide $guide): array => [
                'path' => $guide->path(),
                'lastmod' => $guide->updatedAt->toDateString(),
                'priority' => '0.7',
            ]),
            ['path' => '/politika-privatnosti', 'lastmod' => '2026-10-18', 'priority' => '0.3'],
        ])->map(fn (array $url): array => [...$url, 'loc' => SeoData::absolute($url['path'])]);

        return response()
            ->view('sitemap', ['urls' => $urls], 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
