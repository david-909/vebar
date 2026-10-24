import { ArrowIcon } from '@/components/site/icons';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import { track } from '@/lib/analytics';

const STEPS = [
    { title: 'Pošaljete adresu', text: 'Dovoljna je jedna rečenica u poruci.' },
    {
        title: 'Pregledamo sajt',
        text: 'Proveravamo brzinu, mobilni prikaz, SSL i greške u kodu.',
    },
    {
        title: 'Dobijate predlog',
        text: 'U roku od tri do pet radnih dana, na linku koji možete proslediti kome želite.',
    },
];

const SAMPLE_REPORT = [
    { label: 'Brzina na telefonu', value: '38 / 100', tone: 'bad' },
    {
        label: 'Prikaz na telefonu',
        value: 'Sitan tekst, dugmad preblizu',
        tone: 'mid',
    },
    { label: 'Google', value: 'Stranice bez naslova i opisa', tone: 'mid' },
    { label: 'Kontakt forma', value: 'Nema potvrde slanja', tone: 'bad' },
    { label: 'Bezbednost', value: 'SSL ispravan', tone: 'ok' },
];

export default function FreeAnalysis() {
    return (
        <section
            className="tint ruled"
            id="predlog"
            aria-labelledby="predlog-h"
        >
            <div className="wrap">
                <SectionHeading
                    number="03"
                    label="Besplatna analiza"
                    id="predlog-h"
                    title="Ne verujte nam na reč"
                >
                    Pre bilo kakvog dogovora i bez naknade: pošaljite adresu
                    sajta i dobijate pisanu analizu i predlog nove početne
                    strane. Odluku donosite tek kada vidite rezultat.
                </SectionHeading>

                <Reveal className="offer">
                    <div className="offer-main">
                        <div className="oh">
                            <div>
                                <span className="tag">
                                    Besplatno · Bez obaveze
                                </span>
                                <h3 className="ohead">
                                    Analiza i predlog za vaš sajt
                                </h3>
                            </div>
                            <div className="oprice" aria-label="Cena: 0 dinara">
                                0<span>RSD</span>
                            </div>
                        </div>
                        <p className="omute">
                            Dobijate kratak pisani izveštaj o tome gde sajt gubi
                            posetioce i link na kojem stoji nova verzija vaše
                            početne strane, sa vašim tekstovima, slikama i
                            podacima. Nije reč o šablonu, nego o vašem sajtu.
                            Ukoliko predlog ne ispuni očekivanja, nemate nikakvu
                            obavezu.
                        </p>
                        <ol className="osteps">
                            {STEPS.map((step, index) => (
                                <li key={step.title}>
                                    <span className="on" aria-hidden="true">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <b>{step.title}</b>
                                    <span className="ot">{step.text}</span>
                                </li>
                            ))}
                        </ol>
                        <a
                            href="#kontakt"
                            className="btn btn-acc btn-lg"
                            onClick={() =>
                                track('cta_click', { location: 'predlog' })
                            }
                        >
                            Pošalji adresu sajta <ArrowIcon />
                        </a>
                    </div>

                    <aside className="offer-side" aria-labelledby="primer-h">
                        <h3 className="eyebrow" id="primer-h">
                            Primer izgleda izveštaja
                        </h3>
                        <div className="rep">
                            <dl>
                                {SAMPLE_REPORT.map((row) => (
                                    <div key={row.label} className="rep-row">
                                        <dt>{row.label}</dt>
                                        <dd className={row.tone}>
                                            {row.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                            <div className="rep-pri">
                                <div className="rep-ph">Tri prioriteta</div>
                                <ol>
                                    <li>Smanjiti slike na početnoj strani</li>
                                    <li>Dugme za poziv vidljivo na telefonu</li>
                                    <li>Naslov i opis za svaku uslugu</li>
                                </ol>
                            </div>
                        </div>
                        <p className="onote">
                            Vrednosti su primer. Vaš izveštaj se odnosi na vaš
                            sajt i dobijate ga uz predlog nove početne strane.
                        </p>
                    </aside>
                </Reveal>
            </div>
        </section>
    );
}
