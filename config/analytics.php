<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Analytics
    |--------------------------------------------------------------------------
    |
    | Tracking is only rendered when enabled (production by default). If a
    | Google Tag Manager container is set, GTM is loaded and GA4 / Google
    | Ads tags are expected to be configured inside the container. If only
    | a GA4 measurement ID is set, gtag.js is loaded directly instead.
    |
    */

    'enabled' => (bool) env('ANALYTICS_ENABLED', env('APP_ENV') === 'production'),

    'gtm_id' => env('GTM_CONTAINER_ID'),

    'ga4_id' => env('GA4_MEASUREMENT_ID'),

    /*
    |--------------------------------------------------------------------------
    | Consent Mode v2
    |--------------------------------------------------------------------------
    |
    | Default consent state sent before any tag fires. Everything starts
    | denied; the cookie banner (resources/js/components/site/cookie-consent.tsx)
    | calls window.vebarConsent.update({...}) once the visitor accepts.
    |
    */

    'consent' => [
        'analytics_storage' => env('CONSENT_ANALYTICS_DEFAULT', 'denied'),
        'ad_storage' => env('CONSENT_ADS_DEFAULT', 'denied'),
        'ad_user_data' => env('CONSENT_ADS_DEFAULT', 'denied'),
        'ad_personalization' => env('CONSENT_ADS_DEFAULT', 'denied'),
    ],

];
