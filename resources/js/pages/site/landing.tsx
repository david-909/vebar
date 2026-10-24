import { usePage } from '@inertiajs/react';
import Faq from '@/components/site/home/faq';
import {
    ContactForm,
    InquiryFormProvider,
} from '@/components/site/home/inquiry-form';
import type { PackageOption } from '@/components/site/home/inquiry-form';
import { STEPS } from '@/components/site/home/process';
import LandingHero from '@/components/site/landing/landing-hero';
import LandingPackages from '@/components/site/landing/landing-packages';
import LandingReference from '@/components/site/landing/landing-reference';
import {
    PACKAGES,
    packagePrice,
} from '@/components/site/landing/packages-data';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import Seo from '@/components/site/seo';
import type { FaqItem, SitePageProps } from '@/types';

type LandingProps = SitePageProps & {
    faq: FaqItem[];
};

const PACKAGE_OPTIONS: PackageOption[] = PACKAGES.map((item) => ({
    name: item.name,
    price: packagePrice(item),
    value: item.price,
}));

export default function Landing({ seo, faq }: LandingProps) {
    const { site } = usePage().props;

    return (
        <InquiryFormProvider>
            <Seo seo={seo} />

            <LandingHero />
            <LandingPackages />
            <LandingReference />

            <section id="proces" aria-labelledby="proces-h">
                <div className="wrap">
                    <SectionHeading id="proces-h" title="Kako izgleda saradnja">
                        Unapred znate šta plaćate, kada preuzimate sajt i šta se
                        dešava ako predlog ne odgovara.
                    </SectionHeading>
                    <Reveal as="ol" className="steps lt">
                        {STEPS.map((step, index) => (
                            <li key={step.title} className="stp">
                                <div className="n" aria-hidden="true">
                                    {index + 1}
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </li>
                        ))}
                    </Reveal>
                </div>
            </section>

            <Faq items={faq} number={null} />

            <section id="upit" aria-labelledby="upit-h">
                <div className="wrap">
                    <SectionHeading id="upit-h" title="Pošaljite upit" />
                    <Reveal className="ct">
                        <div>
                            <p className="lede">
                                Napišite čime se bavite i koji paket vas zanima.
                                Javljamo se istog ili sledećeg radnog dana, sa
                                pitanjima ili sa ponudom.
                            </p>
                            <p className="cbig">
                                Ili pozovite{' '}
                                <a href={`tel:${site.phone}`} className="ulink">
                                    {site.phoneDisplay}
                                </a>
                            </p>
                            <dl className="cmeta">
                                <div>
                                    <dt>Mejl</dt>
                                    <dd>
                                        <a href={`mailto:${site.email}`}>
                                            {site.email}
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
                        <ContactForm
                            variant="landing"
                            packages={PACKAGE_OPTIONS}
                        />
                    </Reveal>
                </div>
            </section>
        </InquiryFormProvider>
    );
}
