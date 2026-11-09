import { useEffect, useState } from 'react';
import SiteLink from '@/components/site/site-link';
import { privacy } from '@/routes';

type Choice = 'sve' | 'neophodni';

const STORAGE_KEY = 'vebar-kolacici';
const OPEN_EVENT = 'vebar:kolacici';

const GRANTED = {
    analytics_storage: 'granted',
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
} as const;

const DENIED = {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
} as const;

function readChoice(): Choice | null {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);

        return value === 'sve' || value === 'neophodni' ? value : null;
    } catch {
        return null;
    }
}

function applyChoice(choice: Choice): void {
    window.vebarConsent?.update(choice === 'sve' ? GRANTED : DENIED);
}

/** Reopens the banner, e.g. from the "Podešavanja kolačića" footer link. */
export function openCookieSettings(): void {
    window.dispatchEvent(new Event(OPEN_EVENT));
}

/** True once analytics (and so the consent banner) is active on the page. */
export function useCookieConsentAvailable(): boolean {
    const [isAvailable, setIsAvailable] = useState(false);

    useEffect(() => setIsAvailable(Boolean(window.vebarConsent)), []);

    return isAvailable;
}

/**
 * Consent banner for Google tags (Consent Mode v2). Tags start with every
 * storage denied (config/analytics.php); this banner grants them only after
 * the visitor accepts. The choice is kept in localStorage, not a cookie.
 * Renders nothing when analytics is disabled.
 */
export default function CookieConsent() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!window.vebarConsent) {
            return;
        }

        const choice = readChoice();

        if (choice) {
            applyChoice(choice);
        } else {
            setIsOpen(true);
        }

        const onOpen = () => setIsOpen(true);
        window.addEventListener(OPEN_EVENT, onOpen);

        return () => window.removeEventListener(OPEN_EVENT, onOpen);
    }, []);

    if (!isOpen) {
        return null;
    }

    const choose = (choice: Choice) => {
        try {
            window.localStorage.setItem(STORAGE_KEY, choice);
        } catch {
            // Private mode: the choice holds for this page view only.
        }

        applyChoice(choice);
        setIsOpen(false);
    };

    return (
        <section
            className="ck"
            role="region"
            aria-labelledby="ck-h"
            aria-describedby="ck-p"
        >
            <h2 id="ck-h" className="ck-h">
                Kolačići
            </h2>
            <p id="ck-p">
                Uz vašu dozvolu koristimo kolačiće Google Analyticsa i Google
                Ads-a, da vidimo kako se sajt koristi i koliko upita stiže preko
                oglasa. Sajt i forma rade isto i bez njih.{' '}
                <SiteLink href={privacy.url() + '#kolacici'}>
                    Više o kolačićima
                </SiteLink>
            </p>
            <div className="ck-btns">
                <button
                    type="button"
                    className="btn btn-acc"
                    onClick={() => choose('sve')}
                >
                    Prihvatam
                </button>
                <button
                    type="button"
                    className="btn btn-out"
                    onClick={() => choose('neophodni')}
                >
                    Odbijam
                </button>
            </div>
        </section>
    );
}
