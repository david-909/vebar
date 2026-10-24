import type { ReactNode } from 'react';
import MobileActionBar from '@/components/site/mobile-action-bar';
import SiteFooter from '@/components/site/site-footer';
import SiteHeader from '@/components/site/site-header';
import { useContactTracking } from '@/hooks/use-contact-tracking';

/**
 * Persistent layout for all public pages (resources/js/pages/site/*).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
    useContactTracking();

    return (
        <>
            <a href="#sadrzaj" className="skip">
                Preskoči na sadržaj
            </a>
            <SiteHeader />
            <main id="sadrzaj" tabIndex={-1} className="outline-none">
                {children}
            </main>
            <SiteFooter />
            <MobileActionBar />
        </>
    );
}
