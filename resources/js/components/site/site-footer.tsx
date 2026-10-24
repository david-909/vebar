import { usePage } from '@inertiajs/react';
import { LogoMark } from '@/components/site/icons';
import SiteLink from '@/components/site/site-link';
import { privacy } from '@/routes';
import { index as guidesIndex, show as showGuide } from '@/routes/guides';

const SERVICES = [
    'Prezentacioni sajt',
    'Web prodavnica',
    'Katalog za veleprodaju',
    'Domen i mejl',
];

export default function SiteFooter() {
    const { site } = usePage().props;

    return (
        <footer className="site-footer">
            <div className="wrap">
                <div className="fgrid">
                    <div>
                        <div className="logo">
                            <LogoMark inverted />
                            {site.name}
                        </div>
                        <p className="m-0 max-w-[32ch] text-[0.9rem]">
                            {site.tagline}
                        </p>
                    </div>
                    <nav aria-labelledby="footer-usluge">
                        <h2 id="footer-usluge" className="fh">
                            Usluge
                        </h2>
                        <ul>
                            {SERVICES.map((service) => (
                                <li key={service}>
                                    <SiteLink href="/#usluge">
                                        {service}
                                    </SiteLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <nav aria-labelledby="footer-vodici">
                        <h2 id="footer-vodici" className="fh">
                            Vodiči
                        </h2>
                        <ul>
                            {site.footerGuides.map((guide) => (
                                <li key={guide.slug}>
                                    <SiteLink href={showGuide.url(guide.slug)}>
                                        {guide.title}
                                    </SiteLink>
                                </li>
                            ))}
                            <li>
                                <SiteLink
                                    href={guidesIndex.url()}
                                    className="strong"
                                >
                                    Svi vodiči &rarr;
                                </SiteLink>
                            </li>
                        </ul>
                    </nav>
                    <div>
                        <h2 className="fh">Kontakt</h2>
                        <ul>
                            <li>
                                <a href={`mailto:${site.email}`}>
                                    {site.email}
                                </a>
                            </li>
                            <li>
                                <a href={`tel:${site.phone}`}>
                                    {site.phoneDisplay}
                                </a>
                            </li>
                            <li>
                                <SiteLink href={privacy.url()}>
                                    Politika privatnosti
                                </SiteLink>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="fbot">
                    <span>
                        &copy; {new Date().getFullYear()} {site.name}
                    </span>
                    <span>{site.city}, Srbija</span>
                </div>
            </div>
        </footer>
    );
}
