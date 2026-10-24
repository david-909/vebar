@if ($seo)
    <title>{{ $seo['title'] }}</title>
    <meta name="description" content="{{ $seo['description'] }}">
    <meta name="robots" content="{{ $seo['robots'] }}">
    <link rel="canonical" href="{{ $seo['canonical'] }}">
    <meta property="og:type" content="{{ $seo['type'] }}">
    <meta property="og:site_name" content="{{ $seo['siteName'] }}">
    <meta property="og:locale" content="{{ $seo['locale'] }}">
    <meta property="og:title" content="{{ $seo['title'] }}">
    <meta property="og:description" content="{{ $seo['description'] }}">
    <meta property="og:url" content="{{ $seo['canonical'] }}">
    <meta property="og:image" content="{{ $seo['image'] }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    @if ($seo['publishedAt'])
        <meta property="article:published_time" content="{{ $seo['publishedAt'] }}">
        <meta property="article:modified_time" content="{{ $seo['modifiedAt'] }}">
    @endif
    <meta name="twitter:card" content="summary_large_image">
    <script type="application/ld+json">{!! json_encode($seo['jsonLd'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG) !!}</script>
@else
    <title>{{ config('site.name') }}</title>
@endif
