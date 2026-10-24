<?php

namespace App\Http\Controllers;

use App\Content\Guide;
use App\Content\GuideRepository;
use App\Seo\SeoData;
use App\Seo\StructuredData;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Show the homepage.
     */
    public function home(GuideRepository $guides): Response
    {
        /** @var list<array{question: string, answer: string}> $faq */
        $faq = require resource_path('content/faq.php');

        $seo = SeoData::make(
            title: 'Izrada sajtova i web prodavnica — Vebar | Beograd',
            description: 'Izrada i redizajn sajtova i web prodavnica za mala i srednja preduzeća u Srbiji. Domen, hosting i poslovni mejl na jednom mestu.',
            path: '/',
        );

        $seo->schema(
            StructuredData::webPage($seo, withBreadcrumb: false),
            StructuredData::faq($seo, $faq),
        );

        return Inertia::render('site/home', [
            'seo' => $seo,
            'faq' => $faq,
            'guides' => $guides->all()->take(3)->map(fn (Guide $guide): array => $guide->toCard())->values(),
            'guideCount' => $guides->all()->count(),
            'pagespeedKey' => config('site.pagespeed_key'),
        ]);
    }

    /**
     * Show the privacy policy.
     */
    public function privacy(): Response
    {
        $seo = SeoData::make(
            title: 'Politika privatnosti — Vebar',
            description: 'Koje podatke prikuplja sajt vebar.rs, zašto, koliko dugo se čuvaju i kako da tražite brisanje.',
            path: '/politika-privatnosti',
        );

        $seo->schema(
            StructuredData::webPage($seo),
            StructuredData::breadcrumbs($seo, [['Početna', '/'], ['Politika privatnosti', '/politika-privatnosti']]),
        );

        return Inertia::render('site/privacy', [
            'seo' => $seo,
            'updatedAt' => '2026-10-18',
            'body' => File::get(resource_path('content/pages/politika-privatnosti.html')),
        ]);
    }

    /**
     * Show the confirmation page after a natively submitted inquiry.
     */
    public function thanks(): Response
    {
        $seo = SeoData::make(
            title: 'Hvala na poruci — Vebar',
            description: 'Potvrda da je upit sa sajta vebar.rs uspešno poslat.',
            path: '/hvala',
        )->noindex();

        return Inertia::render('site/thanks', [
            'seo' => $seo,
        ]);
    }
}
