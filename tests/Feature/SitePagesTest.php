<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config()->set('app.url', 'https://vebar.rs');
});

/**
 * The schema.org types in the page's JSON-LD @graph, in order.
 *
 * @return list<string>
 */
function schemaTypes(TestResponse $response): array
{
    return collect($response->inertiaProps('seo.jsonLd.@graph'))->pluck('@type')->all();
}

test('the homepage renders with its metadata, faq and structured data', function () {
    $response = $this->get(route('home'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('site/home')
        ->where('seo.title', 'Izrada sajtova i web prodavnica — Vebar | Beograd')
        ->where('seo.canonical', 'https://vebar.rs/')
        ->where('seo.robots', 'index, follow, max-image-preview:large, max-snippet:-1')
        ->has('faq', 7)
        ->has('guides', 3)
        ->where('guideCount', 7)
    );
    expect(schemaTypes($response))->toBe(['ProfessionalService', 'WebSite', 'WebPage', 'FAQPage']);
});

test('the guide index lists every guide', function () {
    $response = $this->get(route('guides.index'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('site/guides/index')
        ->where('seo.canonical', 'https://vebar.rs/vodic')
        ->has('guides', 7)
        ->where('guides.0.slug', 'koliko-kosta-izrada-sajta')
    );
    expect(schemaTypes($response))->toBe(['ProfessionalService', 'WebSite', 'CollectionPage', 'BreadcrumbList', 'ItemList']);
});

test('a guide renders its article, related guides and article structured data', function () {
    $response = $this->get(route('guides.show', 'koliko-kosta-izrada-sajta'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('site/guides/show')
        ->where('seo.title', 'Izrada sajta cena 2026: koliko košta sajt u Srbiji — Vebar')
        ->where('seo.canonical', 'https://vebar.rs/vodic/koliko-kosta-izrada-sajta')
        ->where('seo.type', 'article')
        ->where('guide.updatedAt', '2026-10-18')
        ->where('body', fn (string $body) => str_contains($body, '<h2 id="rasponi">Realni rasponi po tipu sajta</h2>'))
        ->has('related', 3)
    );
    expect(schemaTypes($response))->toBe(['ProfessionalService', 'WebSite', 'WebPage', 'BreadcrumbList', 'Article', 'FAQPage']);
});

test('an unknown guide returns the not found page', function () {
    $response = $this->get('/vodic/ne-postoji');

    $response->assertNotFound()->assertInertia(fn (Assert $page) => $page
        ->component('site/error')
        ->where('status', 404)
        ->where('seo.robots', 'noindex, follow')
    );
});

test('the thank-you page is not indexed', function () {
    $response = $this->get(route('thanks'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('site/thanks')
        ->where('seo.robots', 'noindex, follow')
    );
});

test('the privacy policy renders its content', function () {
    $response = $this->get(route('privacy'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('site/privacy')
        ->where('body', fn (string $body) => str_contains($body, '<h2 id="kolacici">Kolačići</h2>'))
    );
});

test('public pages set no cookies', function (string $path) {
    $response = $this->get($path);

    $response->assertOk();
    expect($response->headers->getCookies())->toBe([]);
})->with(['/', '/vodic', '/vodic/koliko-traje-izrada-sajta', '/politika-privatnosti']);

test('urls with a trailing slash permanently redirect to the canonical url', function (string $from, string $to) {
    // The test client strips trailing slashes, so send the raw request through the kernel.
    $response = TestResponse::fromBaseResponse(app(Kernel::class)->handle(Request::create($from)));

    $response->assertMovedPermanently()->assertRedirect($to);
})->with([
    'guide index' => ['/vodic/', '/vodic'],
    'guide' => ['/vodic/koliko-kosta-izrada-sajta/', '/vodic/koliko-kosta-izrada-sajta'],
    'query string is kept' => ['/vodic/?utm_source=google', '/vodic?utm_source=google'],
    'old index file' => ['/index.html', '/'],
]);

test('the sitemap lists the indexable pages', function () {
    $response = $this->get(route('sitemap'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8')
        ->assertSee('<loc>https://vebar.rs/</loc>', false)
        ->assertSee('<loc>https://vebar.rs/vodic/online-katalog-za-veleprodaju</loc>', false)
        ->assertSee('<lastmod>2026-10-18</lastmod>', false)
        ->assertDontSee('/hvala', false);
});

test('analytics tags are rendered only when enabled', function (bool $enabled) {
    config()->set('analytics.enabled', $enabled);
    config()->set('analytics.gtm_id', 'GTM-TEST123');

    $response = $this->get(route('home'));

    $response->assertOk();
    $enabled
        ? $response->assertSee('GTM-TEST123', false)->assertSee("gtag('consent', 'default'", false)
        : $response->assertDontSee('googletagmanager.com', false);
})->with(['enabled' => true, 'disabled' => false]);
