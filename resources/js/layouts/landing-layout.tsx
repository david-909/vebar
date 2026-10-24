import { usePage } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { ArrowIcon, LogoMark } from '@/components/site/icons';
import MobileActionBar from '@/components/site/mobile-action-bar';
import SiteLink from '@/components/site/site-link';
import { useContactTracking } from '@/hooks/use-contact-tracking';
import { track } from '@/lib/analytics';
import { privacy } from '@/routes';

/**
 * Layout for the Google Ads landing page: no site navigation, so the only
 * ways forward are the inquiry form and the phone number.
 */
export default function LandingLayout({ children }: { children: ReactNode }) {
    const { site } = usePage().props;

    useContactTracking();

    return (
        <>
            <a href="#sadrzaj" className="skip">
                Preskoči na sadržaj
            </a>
            <header className="site-header">
                <div className="wrap nav">
                    <div className="logo">
                        <LogoMark />
                        {site.name}
                    </div>
                    <div className="lnav">
                        <a href={`tel:${site.phone}`} className="lnav-tel">
                            <span>Pozovite</span> {site.phoneDisplay}
                        </a>
                        <a
                            href="#upit"
                            className="btn btn-acc"
                            onClick={() =>
                                track('cta_click', {
                                    location: 'landing_header',
                                })
                            }
                        >
                            Pošaljite upit <ArrowIcon />
                        </a>
                    </div>
                </div>
            </header>
            <main id="sadrzaj" tabIndex={-1} className="outline-none">
                {children}
            </main>
            <footer className="site-footer lfoot">
                <div className="wrap">
                    <div className="fbot">
                        <span>
                            &copy; {new Date().getFullYear()} {site.name} ·{' '}
                            {site.city}, Srbija
                        </span>
                        <span className="lfoot-links">
                            <a href={`mailto:${site.email}`}>{site.email}</a>
                            <a href={`tel:${site.phone}`}>
                                {site.phoneDisplay}
                            </a>
                            <SiteLink href={privacy.url()}>
                                Politika privatnosti
                            </SiteLink>
                        </span>
                    </div>
                </div>
            </footer>
            <MobileActionBar
                formId="upit"
                href="#upit"
                label="Pošaljite upit"
                location="landing_mobile_bar"
            />
        </>
    );
}
