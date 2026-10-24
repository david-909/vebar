import type { ReactNode } from 'react';
import { useEffect } from 'react';
import MobileActionBar from '@/components/site/mobile-action-bar';
import SiteFooter from '@/components/site/site-footer';
import SiteHeader from '@/components/site/site-header';
import { track } from '@/lib/analytics';

/**
 * Persistent layout for all public pages (resources/js/pages/site/*).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const anchor = (event.target as HTMLElement | null)?.closest('a');
            const href = anchor?.getAttribute('href') ?? '';

            if (href.startsWith('tel:')) {
                track('contact_click', { method: 'phone' });
            } else if (href.startsWith('mailto:')) {
                track('contact_click', { method: 'email' });
            }
        };

        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, []);

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
