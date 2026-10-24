import { usePage } from '@inertiajs/react';
import { ArrowIcon } from '@/components/site/icons';
import {
    formatPrice,
    MAINTENANCE,
    PACKAGES,
} from '@/components/site/landing/packages-data';
import { track } from '@/lib/analytics';

const PROOF = [
    'Predlog izgleda pre izrade',
    'Domen i sajt na vaše ime',
    'Firme iz cele Srbije',
];

/**
 * First viewport: the promise on the left, the full price list on the right,
 * so a visitor searching for "izrada sajta cena" has the answer at once.
 */
export default function LandingHero() {
    const { site } = usePage().props;

    return (
        <section className="lhero" aria-labelledby="hero-h">
            <div className="wrap lhero-grid">
                <div>
                    <h1 id="hero-h">
                        Izrada sajta po ceni koju znate <em>unapred.</em>
                    </h1>
                    <p className="lede">
                        Sajt za vašu firmu, gotov za dve do tri nedelje. Cenu i
                        rok dobijate u pisanoj ponudi, pre prve uplate.
                    </p>
                    <div className="hero-cta">
                        <a
                            href="#upit"
                            className="btn btn-acc btn-lg"
                            onClick={() =>
                                track('cta_click', { location: 'landing_hero' })
                            }
                        >
                            Pošaljite upit <ArrowIcon />
                        </a>
                        <a
                            href={`tel:${site.phone}`}
                            className="btn btn-out btn-lg"
                        >
                            Pozovite {site.phoneDisplay}
                        </a>
                    </div>
                    <ul className="lhero-proof">
                        {PROOF.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </div>

                <aside className="ledger" aria-labelledby="ledger-h">
                    <div className="ledger-top">
                        <h2 id="ledger-h">Cenovnik izrade</h2>
                        <span>RSD, jednokratno</span>
                    </div>
                    <ol>
                        {PACKAGES.map((item) => (
                            <li
                                key={item.id}
                                className={
                                    item.isFeatured ? 'featured' : undefined
                                }
                            >
                                <a href={`#paket-${item.id}`}>
                                    <span className="ledger-nm">
                                        <b>{item.name}</b>
                                        <small>{item.summary}</small>
                                    </span>
                                    <span className="ledger-pr">
                                        {item.isFrom && <small>od</small>}
                                        {formatPrice(item.price)}
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ol>
                    <p className="ledger-mnt">
                        <span>Održavanje posle puštanja</span>
                        <span>
                            od {formatPrice(MAINTENANCE[0].price)} / mesečno
                        </span>
                    </p>
                    <p className="ledger-note">
                        Cena iz ponude je konačna. Ne menja se ni ako se posao
                        pokaže obimnijim od procenjenog.
                    </p>
                </aside>
            </div>
        </section>
    );
}
