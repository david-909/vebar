import { usePage } from '@inertiajs/react';
import { ContactForm } from '@/components/site/home/inquiry-form';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';

export default function ContactSection() {
    const { site } = usePage().props;

    return (
        <section id="kontakt" aria-labelledby="kontakt-h">
            <div className="wrap">
                <SectionHeading
                    number="08"
                    label="Kontakt"
                    id="kontakt-h"
                    title="Javite se"
                />
                <Reveal className="ct">
                    <div>
                        <p className="lede">
                            Pošaljite adresu vašeg sajta i u roku od nekoliko
                            dana dobijate besplatnu analizu i predlog nove
                            početne strane. Bez obaveze.
                        </p>
                        <p className="cbig">
                            Pišite na{' '}
                            <a href={`mailto:${site.email}`} className="ulink">
                                {site.email}
                            </a>
                        </p>
                        <dl className="cmeta">
                            <div>
                                <dt>Telefon</dt>
                                <dd>
                                    <a href={`tel:${site.phone}`}>
                                        {site.phoneDisplay}
                                    </a>
                                </dd>
                            </div>
                            <div>
                                <dt>Radimo za</dt>
                                <dd>{site.areaServed}</dd>
                            </div>
                            <div>
                                <dt>Odgovor</dt>
                                <dd>Isti ili sledeći radni dan</dd>
                            </div>
                        </dl>
                    </div>
                    <ContactForm />
                </Reveal>
            </div>
        </section>
    );
}
