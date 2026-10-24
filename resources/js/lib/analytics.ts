/**
 * Thin wrapper around Google tags. Works with either loading mode set up in
 * resources/views/partials/analytics-head.blade.php and is a no-op when
 * analytics is disabled (local development, missing IDs).
 *
 * - GTM mode: events are pushed to the dataLayer as `{ event, ...params }`;
 *   create Custom Event triggers in the container for the names below.
 * - gtag mode: events are sent straight to GA4.
 *
 * Mark `generate_lead` as a key event in GA4 and import it into Google Ads
 * as the primary conversion.
 */
export type AnalyticsEvent =
    | 'generate_lead'
    | 'contact_click'
    | 'cta_click'
    | 'calculator_to_form'
    | 'self_check_to_form'
    | 'provera_brzine'
    | 'provera_brzine_rezultat'
    | 'provera_brzine_greska'
    | 'virtual_page_view';

type Params = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, params: Params = {}): void {
    if (typeof window === 'undefined' || !window.vebarAnalytics) {
        return;
    }

    if (window.vebarAnalytics.mode === 'gtm') {
        window.dataLayer?.push({ event, ...params });

        return;
    }

    window.gtag?.('event', event, params);
}

/**
 * Inertia navigations don't reload the page. GA4 (gtag mode) records them
 * through enhanced measurement's history-change page views; in GTM mode we
 * push a `virtual_page_view` event for a GA4 page_view tag to listen to.
 */
export function trackPageView(): void {
    if (window.vebarAnalytics?.mode !== 'gtm') {
        return;
    }

    track('virtual_page_view', {
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search,
        page_title: document.title,
    });
}
