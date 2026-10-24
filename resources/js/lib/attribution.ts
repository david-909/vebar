/**
 * Remembers how the visitor arrived (UTM tags, Google Ads click IDs, landing
 * page and referrer) for the duration of the browser session, so it can be
 * attached to a contact form inquiry. This lets leads be matched to ad
 * campaigns, including offline conversion import via gclid.
 */
export type Attribution = Partial<
    Record<
        | 'utm_source'
        | 'utm_medium'
        | 'utm_campaign'
        | 'utm_term'
        | 'utm_content'
        | 'gclid'
        | 'gbraid'
        | 'wbraid'
        | 'landing_page'
        | 'referrer',
        string
    >
>;

const STORAGE_KEY = 'vebar_attribution';

const CAMPAIGN_PARAMS = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'gbraid',
    'wbraid',
] as const;

/**
 * Store the first touch of the session; a later visit with new campaign
 * parameters (e.g. a second ad click) replaces it.
 */
export function captureAttribution(): void {
    if (typeof window === 'undefined') {
        return;
    }

    const query = new URLSearchParams(window.location.search);
    const campaign: Attribution = {};

    CAMPAIGN_PARAMS.forEach((key) => {
        const value = query.get(key);

        if (value) {
            campaign[key] = value.slice(0, 500);
        }
    });

    const hasCampaign = Object.keys(campaign).length > 0;

    if (!hasCampaign && readAttribution()) {
        return;
    }

    const referrer =
        document.referrer &&
        !document.referrer.startsWith(window.location.origin)
            ? document.referrer
            : undefined;

    write({
        ...campaign,
        landing_page: (window.location.pathname + window.location.search).slice(
            0,
            500,
        ),
        referrer: referrer?.slice(0, 500),
    });
}

export function readAttribution(): Attribution | null {
    try {
        const stored = window.sessionStorage.getItem(STORAGE_KEY);

        return stored ? (JSON.parse(stored) as Attribution) : null;
    } catch {
        return null;
    }
}

function write(attribution: Attribution): void {
    try {
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    } catch {
        // Storage can be unavailable (private mode, blocked site data).
    }
}
