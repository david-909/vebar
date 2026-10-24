import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import SiteLink from '@/components/site/site-link';
import { track } from '@/lib/analytics';

type MobileActionBarProps = {
    /** Id of the section holding the form; the bar hides while it is on screen. */
    formId?: string;
    href?: string;
    label?: string;
    location?: string;
};

/**
 * Sticky call / inquiry bar on phones. Appears once the visitor scrolls past
 * the hero and hides while the contact form itself is on screen.
 */
export default function MobileActionBar({
    formId = 'kontakt',
    href = '/#kontakt',
    label = 'Besplatna analiza',
    location = 'mobile_bar',
}: MobileActionBarProps) {
    const { site } = usePage().props;
    const { url } = usePage();
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isContactVisible, setIsContactVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setHasScrolled(window.scrollY > 560);

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const contact = document.getElementById(formId);
        setIsContactVisible(false);

        if (!contact || !('IntersectionObserver' in window)) {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setIsContactVisible(entry.isIntersecting),
            {
                threshold: 0.1,
            },
        );

        observer.observe(contact);

        return () => observer.disconnect();
    }, [url, formId]);

    const isShown = hasScrolled && !isContactVisible;

    return (
        <div
            className={isShown ? 'mbar show' : 'mbar'}
            aria-hidden={!isShown}
            inert={!isShown}
        >
            <a href={`tel:${site.phone}`} className="btn btn-out">
                Pozovite
            </a>
            <SiteLink
                href={href}
                className="btn btn-acc"
                onClick={() => track('cta_click', { location })}
            >
                {label} <ArrowIcon />
            </SiteLink>
        </div>
    );
}
