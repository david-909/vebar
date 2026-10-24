import { useInquiryForm } from '@/components/site/home/inquiry-form';
import { ArrowIcon } from '@/components/site/icons';
import {
    formatPrice,
    MAINTENANCE,
    PACKAGES,
} from '@/components/site/landing/packages-data';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import { track } from '@/lib/analytics';

const INCLUDED = [
    'Fiksna cena u pisanoj ponudi',
    'Predlog izgleda pre izrade',
    'Dva kruga izmena',
    'Prilagođeno telefonu',
    'SSL sertifikat',
    'Kratka obuka za uređivanje',
];

export default function LandingPackages() {
    const { prefill } = useInquiryForm();

    return (
        <section className="tint ruled" id="paketi" aria-labelledby="paketi-h">
            <div className="wrap">
                <SectionHeading id="paketi-h" title="Tri paketa, cena unapred">
                    Izaberite paket koji odgovara vašoj firmi. Ako niste
                    sigurni, napišite čime se bavite i predložićemo jedan.
                </SectionHeading>

                <Reveal className="pk">
                    {PACKAGES.map((item) => (
                        <article
                            key={item.id}
                            id={`paket-${item.id}`}
                            className={
                                item.isFeatured ? 'pk-i featured' : 'pk-i'
                            }
                            aria-labelledby={`paket-${item.id}-h`}
                        >
                            <div className="pk-top">
                                <h3 id={`paket-${item.id}-h`}>{item.name}</h3>
                                {item.isFeatured && (
                                    <span className="tag">Preporučujemo</span>
                                )}
                            </div>
                            <p className="pk-for">{item.audience}</p>
                            <p className="pk-pr">
                                {item.isFrom && <small>od</small>}
                                <b>{formatPrice(item.price)}</b>
                                <span>RSD</span>
                            </p>
                            <p className="pk-sum">
                                {item.summary}
                                <br />
                                Gotovo za {item.duration}
                            </p>
                            <ul>
                                {item.features.map((feature) => (
                                    <li key={feature}>{feature}</li>
                                ))}
                            </ul>
                            <a
                                href="#upit"
                                className={
                                    item.isFeatured
                                        ? 'btn btn-acc btn-block'
                                        : 'btn btn-out btn-block'
                                }
                                onClick={() => {
                                    prefill({
                                        packageName: item.name,
                                        estimatedValue: item.price,
                                    });
                                    track('cta_click', {
                                        location: 'landing_package',
                                        package: item.name,
                                    });
                                }}
                            >
                                Izaberite {item.name} <ArrowIcon />
                            </a>
                        </article>
                    ))}
                </Reveal>

                <Reveal className="incl">
                    <h3>U svaki paket uključeno</h3>
                    <ul>
                        {INCLUDED.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <p>
                        Plaćanje u dva dela: pola po prihvatanju ponude, pola
                        kada sajt proradi.
                    </p>
                </Reveal>

                <Reveal className="mnt">
                    <div className="mnt-head">
                        <h3>Održavanje posle puštanja</h3>
                        <p>
                            Posle izrade plaća se samo mesečno održavanje.
                            Osnovno pokriva sve što je sajtu potrebno da radi;
                            veći paket birate ako želite da izmene radimo mi.
                        </p>
                    </div>
                    <dl className="mnt-list">
                        {MAINTENANCE.map((plan) => (
                            <div key={plan.name}>
                                <dt>{plan.name}</dt>
                                <dd className="mnt-inc">{plan.includes}</dd>
                                <dd className="mnt-pr">
                                    <b>{formatPrice(plan.price)}</b> RSD / mes.
                                </dd>
                            </div>
                        ))}
                    </dl>
                </Reveal>
            </div>
        </section>
    );
}
