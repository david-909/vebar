{{--
    Google tags. GTM takes precedence: configure GA4, Google Ads conversions
    and remarketing inside the container. Without GTM, GA4 is loaded directly.
    The frontend reports events through resources/js/lib/analytics.ts.
--}}
@php
    $gtmId = config('analytics.gtm_id');
    $ga4Id = config('analytics.ga4_id');
    $analyticsMode = ! config('analytics.enabled') ? null : ($gtmId ? 'gtm' : ($ga4Id ? 'gtag' : null));
@endphp
@if ($analyticsMode)
    <link rel="preconnect" href="https://www.googletagmanager.com">
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('consent', 'default', @json([...config('analytics.consent'), 'wait_for_update' => 500]));
        window.vebarAnalytics = { mode: @json($analyticsMode) };
        window.vebarConsent = {
            update: function (state) {
                gtag('consent', 'update', state);
                dataLayer.push({ event: 'consent_update' });
            },
        };
    </script>
    @if ($analyticsMode === 'gtm')
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',@json($gtmId));</script>
    @else
        <script async src="https://www.googletagmanager.com/gtag/js?id={{ urlencode($ga4Id) }}"></script>
        <script>
            gtag('js', new Date());
            gtag('config', @json($ga4Id));
        </script>
    @endif
@endif
