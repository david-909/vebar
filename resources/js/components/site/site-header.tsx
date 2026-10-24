import { Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { ArrowIcon, LogoMark } from '@/components/site/icons';
import SiteLink from '@/components/site/site-link';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { home } from '@/routes';
import { index as guidesIndex } from '@/routes/guides';

const NAVIGATION = [
    { label: 'Usluge', href: '/#usluge' },
    { label: 'Besplatna analiza', href: '/#predlog' },
    { label: 'Vodiči', href: guidesIndex.url() },
    { label: 'Cena', href: '/#ponuda' },
    { label: 'Kontakt', href: '/#kontakt' },
];

export default function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const progressRef = useRef<HTMLDivElement>(null);
    const { isCurrentOrParentUrl } = useCurrentUrl();

    useEffect(() => {
        let frame = 0;

        const updateProgress = () => {
            frame = 0;
            const scrollable =
                document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
            progressRef.current?.style.setProperty(
                'transform',
                `scaleX(${progress})`,
            );
        };

        const onScroll = () => {
            if (!frame) {
                frame = requestAnimationFrame(updateProgress);
            }
        };

        updateProgress();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);

    useEffect(() => router.on('navigate', () => setIsMenuOpen(false)), []);

    useEffect(() => {
        if (!isMenuOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('keydown', onKeyDown);

        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isMenuOpen]);

    return (
        <header className="site-header">
            <div className="wrap nav">
                <Link
                    href={home.url()}
                    className="logo"
                    aria-label="Vebar, početna strana"
                >
                    <LogoMark />
                    Vebar
                </Link>
                <nav
                    id="glavni-meni"
                    className={isMenuOpen ? 'nlinks open' : 'nlinks'}
                    aria-label="Glavni meni"
                    onClick={(event) => {
                        if ((event.target as HTMLElement).closest('a')) {
                            setIsMenuOpen(false);
                        }
                    }}
                >
                    {NAVIGATION.map((item) => (
                        <SiteLink
                            key={item.href}
                            href={item.href}
                            aria-current={
                                !item.href.includes('#') &&
                                isCurrentOrParentUrl(item.href)
                                    ? 'page'
                                    : undefined
                            }
                        >
                            {item.label}
                        </SiteLink>
                    ))}
                    <SiteLink href="/#kontakt" className="btn btn-acc nav-cta">
                        Zatražite besplatnu analizu <ArrowIcon />
                    </SiteLink>
                </nav>
                <button
                    type="button"
                    className="burger"
                    aria-label={isMenuOpen ? 'Zatvori meni' : 'Otvori meni'}
                    aria-expanded={isMenuOpen}
                    aria-controls="glavni-meni"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <i />
                    <i />
                </button>
                <div className="prog" ref={progressRef} aria-hidden="true" />
            </div>
        </header>
    );
}
