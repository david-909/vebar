<!DOCTYPE html>
<html lang="sr-Latn" class="no-js" data-theme="site">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="{{ config('site.theme_color') }}">
        <meta name="color-scheme" content="light">
        <meta name="format-detection" content="telephone=no">
        <script>document.documentElement.classList.replace('no-js', 'js')</script>

        @include('partials.analytics-head')

        <link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/space-grotesk-ext.woff2" as="font" type="font/woff2" crossorigin>
        <link rel="preload" href="/fonts/inter-ext.woff2" as="font" type="font/woff2" crossorigin>

        <link rel="icon" href="/favicon.ico" sizes="48x48">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">
        <link rel="sitemap" type="application/xml" href="/sitemap.xml">

        @viteReactRefresh
        @vite(['resources/css/site.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            {{-- Rendered only when the SSR server is unavailable, so crawlers always get full metadata. --}}
            @include('partials.seo-head', ['seo' => $page['props']['seo'] ?? null])
        </x-inertia::head>
    </head>
    <body>
        @include('partials.analytics-body')
        <x-inertia::app />
    </body>
</html>
