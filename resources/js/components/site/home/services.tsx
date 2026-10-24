import type { ReactNode } from 'react';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import SiteLink from '@/components/site/site-link';
import { show as showGuide } from '@/routes/guides';

type Service = {
    title: string;
    text: ReactNode;
    features: string[];
    price: string;
    note: ReactNode;
    tag?: string;
};

const SERVICES: Service[] = [
    {
        title: 'Prezentacioni sajt',
        text: 'Osnovno predstavljanje firme na internetu: čime se bavite, šta nudite i kako vas kontaktirati.',
        features: [
            'Do 5–7 strana, na srpskom',
            'Radi na telefonu, tabletu i računaru',
            'Galerija radova i kontakt forma',
            'Google Maps i podaci o firmi',
        ],
        price: 'od 45.000 RSD',
        note: 'orijentaciono',
    },
    {
        title: 'Web prodavnica',
        text: 'Prodaja bez radnog vremena, sa korpom, plaćanjem i evidencijom porudžbina.',
        features: [
            'Neograničen broj proizvoda',
            'Kartično plaćanje i pouzeće',
            'Povezivanje sa kurirskom službom',
            'Obuka za samostalno unošenje robe',
        ],
        price: 'od 120.000 RSD',
        note: 'orijentaciono',
    },
    {
        title: 'Katalog za veleprodaju',
        tag: 'Za distributere',
        text: 'Kupac nalazi artikal po šifri ili tehničkim parametrima i šalje upit za ponudu, bez poziva i čekanja.',
        features: [
            'Pretraga po šifri, i kad nije ukucana savršeno',
            'Filteri po dimenzijama i parametrima',
            'Artikli i cene iz vašeg programa (Excel, CSV)',
            'Svaki artikal na posebnoj stranici za Google',
        ],
        price: 'od 80.000 RSD',
        note: (
            <>
                orijentaciono ·{' '}
                <SiteLink href={showGuide.url('online-katalog-za-veleprodaju')}>
                    kako radi
                </SiteLink>
            </>
        ),
    },
    {
        title: 'Domen, hosting i mejl',
        text: (
            <>
                Poslovna adresa oblika <b>ime@vasafirma.rs</b>, umesto
                besplatnog naloga na tuđem servisu.
            </>
        ),
        features: [
            'Registracija .rs domena na vaše ime',
            'Poslovni mejl sandučići',
            'Hosting sa SSL sertifikatom',
            'Redovne rezervne kopije',
        ],
        price: 'od 2.500 RSD / mesec',
        note: 'održavanje',
    },
];

export default function Services() {
    return (
        <section id="usluge" aria-labelledby="usluge-h">
            <div className="wrap">
                <SectionHeading
                    number="02"
                    label="Usluge"
                    id="usluge-h"
                    title="Šta radimo"
                >
                    Sve na jednom mestu: od registracije domena i poslovnog
                    mejla do gotovog sajta o kojem ne morate da brinete.
                </SectionHeading>
                <Reveal className="svc">
                    {SERVICES.map((service, index) => (
                        <article
                            key={service.title}
                            className={service.tag ? 'svc-i featured' : 'svc-i'}
                        >
                            <div className="h">
                                <h3>{service.title}</h3>
                                <span className="no" aria-hidden="true">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>
                            {service.tag && (
                                <span className="tag">{service.tag}</span>
                            )}
                            <p>{service.text}</p>
                            <ul>
                                {service.features.map((feature) => (
                                    <li key={feature}>{feature}</li>
                                ))}
                            </ul>
                            <div className="pr">
                                <b>{service.price}</b>
                                <small>{service.note}</small>
                            </div>
                        </article>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
