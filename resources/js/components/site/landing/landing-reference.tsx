import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { ExternalIcon } from '@/components/site/icons';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';

const NEW_SITE_URL = 'https://kelco.vebar.rs';

const RESULTS = [
    'Pretraga delova po nazivu i šifri, odmah na vrhu strane',
    'Katalog od oko 10.000 artikala, pregledan i na telefonu',
    'Cene za 1, 10 i 100 komada vidljive na svakom artiklu',
];

/**
 * Old and new Kelco homepage in one frame. The divider sweeps once from
 * "before" to the middle when the frame scrolls into view, then follows the
 * visitor's slider.
 */
function CompareSlider() {
    const frameRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState(50);
    const [isSweeping, setIsSweeping] = useState(false);

    useEffect(() => {
        const frame = frameRef.current;
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (
            !frame ||
            prefersReducedMotion ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        setPosition(88);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsSweeping(true);
                    setPosition(50);
                    observer.disconnect();
                }
            },
            { threshold: 0.55 },
        );

        observer.observe(frame);

        return () => observer.disconnect();
    }, []);

    return (
        <figure className="cmp">
            <div
                ref={frameRef}
                className={isSweeping ? 'cmp-frame sweep' : 'cmp-frame'}
                style={{ '--pos': `${position}%` } as CSSProperties}
                onTransitionEnd={() => setIsSweeping(false)}
            >
                <img
                    src="/images/reference/kelco-new-desktop.webp"
                    alt="Novi Kelco sajt: tamno zaglavlje sa pretragom delova, naslov i kategorije proizvoda."
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                />
                <img
                    className="cmp-old"
                    src="/images/reference/kelco-old-desktop.webp"
                    alt="Stari Kelco sajt: bočni meni sa kategorijama, rotirajući baner i sitne kartice proizvoda."
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                />
                <span className="cmp-lb cmp-lb-old" aria-hidden="true">
                    Pre
                </span>
                <span className="cmp-lb cmp-lb-new" aria-hidden="true">
                    Posle
                </span>
                <span className="cmp-bar" aria-hidden="true" />
                <input
                    type="range"
                    min={0}
                    max={100}
                    value={position}
                    onChange={(event) => {
                        setIsSweeping(false);
                        setPosition(Number(event.target.value));
                    }}
                    aria-label="Uporedite stari i novi Kelco sajt"
                    aria-valuetext={`${position}% starog sajta`}
                />
            </div>
            <figcaption>
                Početna strana na računaru. Pomerite liniju da uporedite.
            </figcaption>
        </figure>
    );
}

export default function LandingReference() {
    return (
        <section className="dark" id="referenca" aria-labelledby="ref-h">
            <div className="wrap">
                <SectionHeading id="ref-h" title="Pre i posle: Kelco">
                    Kelco prodaje elektronske komponente u Beogradu od 1991.
                    Stari sajt je na telefonu bio umanjena verzija sajta za
                    računar. Novi je napravljen tako da se traženi deo nađe za
                    nekoliko sekundi, i na telefonu i na računaru.
                </SectionHeading>

                <Reveal className="ref">
                    <CompareSlider />

                    <div className="ref-side">
                        <div className="phones">
                            <figure>
                                <img
                                    src="/images/reference/kelco-old-mobile.webp"
                                    alt="Stari Kelco sajt na telefonu: cela strana za računar umanjena, tekst se ne može pročitati."
                                    width={780}
                                    height={1360}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <figcaption>Pre, na telefonu</figcaption>
                            </figure>
                            <figure>
                                <img
                                    src="/images/reference/kelco-new-mobile.webp"
                                    alt="Novi Kelco sajt na telefonu: velika pretraga, čitljiv naslov i dugmad."
                                    width={780}
                                    height={1360}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <figcaption>Posle, na telefonu</figcaption>
                            </figure>
                        </div>
                        <ul className="ref-res">
                            {RESULTS.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                        <a
                            href={NEW_SITE_URL}
                            className="ulink ref-link"
                            target="_blank"
                            rel="noopener"
                        >
                            Otvorite novi Kelco sajt <ExternalIcon />
                        </a>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
