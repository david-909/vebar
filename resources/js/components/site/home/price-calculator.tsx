import { useEffect, useRef, useState } from 'react';
import { useInquiryForm } from '@/components/site/home/inquiry-form';
import { ArrowIcon } from '@/components/site/icons';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import { track } from '@/lib/analytics';

type SiteType = 'prezentacioni' | 'katalog' | 'prodavnica';
type PageCount = '1' | '5' | '10' | '20';

const SITE_TYPES: {
    value: SiteType;
    label: string;
    hint: string;
    base: number;
    weeks: number;
    scope: string;
}[] = [
    {
        value: 'prezentacioni',
        label: 'Prezentacioni sajt',
        hint: 'Predstavljanje firme i usluga',
        base: 45000,
        weeks: 2,
        scope: '',
    },
    {
        value: 'katalog',
        label: 'Katalog za veleprodaju',
        hint: 'Pretraga, filteri i upit za ponudu',
        base: 80000,
        weeks: 4,
        scope: 'katalog proizvoda',
    },
    {
        value: 'prodavnica',
        label: 'Web prodavnica',
        hint: 'Prodaja sa korpom i plaćanjem',
        base: 120000,
        weeks: 5,
        scope: 'web prodavnica',
    },
];

const PAGE_COUNTS: {
    value: PageCount;
    label: string;
    scope: string;
    price: number;
    weeks: number;
}[] = [
    {
        value: '1',
        label: 'Jedna strana',
        scope: 'jedna strana',
        price: -12000,
        weeks: 0,
    },
    {
        value: '5',
        label: 'Do 5 strana',
        scope: 'do 5 strana',
        price: 0,
        weeks: 0,
    },
    {
        value: '10',
        label: 'Do 10 strana',
        scope: 'do 10 strana',
        price: 22000,
        weeks: 1,
    },
    {
        value: '20',
        label: 'Više od 10',
        scope: 'više od 10 strana',
        price: 45000,
        weeks: 2,
    },
];

const ADDONS = [
    {
        value: 'tekstovi',
        label: 'Pisanje tekstova',
        price: 15000,
        hint: '+15.000',
    },
    { value: 'foto', label: 'Fotografisanje', price: 20000, hint: '+20.000' },
    { value: 'logo', label: 'Logo i identitet', price: 18000, hint: '+18.000' },
    {
        value: 'jezik',
        label: 'Engleska verzija',
        price: 12000,
        hint: '+12.000',
    },
    { value: 'seo', label: 'SEO podešavanje', price: 15000, hint: '+15.000' },
    {
        value: 'mejl',
        label: 'Domen i poslovni mejl',
        price: 6000,
        hint: '+6.000 prve godine',
    },
];

const MINIMUM_PRICE = 20000;

/** 45000 -> "45.000", rounded to whole thousands. */
function formatPrice(value: number): string {
    return String(Math.round(value / 1000) * 1000).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.',
    );
}

function weeksLabel(weeks: number): string {
    return weeks === 1 ? 'nedelja' : weeks < 5 ? 'nedelje' : 'nedelja';
}

function addonsLabel(count: number): string {
    if (count === 0) {
        return 'nema';
    }

    return `${count} ${count === 1 ? 'dodatak' : count < 5 ? 'dodatka' : 'dodataka'}`;
}

function useAnimatedNumber(target: number, durationMs = 380): number {
    const [value, setValue] = useState(target);
    const current = useRef(target);

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            current.current = target;
            setValue(target);

            return;
        }

        const from = current.current;
        let start: number | null = null;
        let frame = 0;

        const step = (timestamp: number) => {
            start ??= timestamp;
            const progress = Math.min(1, (timestamp - start) / durationMs);
            const eased = 1 - Math.pow(1 - progress, 3);
            current.current = from + (target - from) * eased;
            setValue(current.current);

            if (progress < 1) {
                frame = requestAnimationFrame(step);
            }
        };

        frame = requestAnimationFrame(step);

        return () => cancelAnimationFrame(frame);
    }, [target, durationMs]);

    return value;
}

export default function PriceCalculator() {
    const { prefill } = useInquiryForm();
    const [siteType, setSiteType] = useState<SiteType>('prezentacioni');
    const [pageCount, setPageCount] = useState<PageCount>('5');
    const [addons, setAddons] = useState<string[]>([]);

    const type = SITE_TYPES.find((option) => option.value === siteType)!;
    const hasPageChoice = siteType === 'prezentacioni';
    const pages = PAGE_COUNTS.find((option) => option.value === pageCount)!;
    const selectedAddons = ADDONS.filter((addon) =>
        addons.includes(addon.value),
    );

    const scope = hasPageChoice
        ? pages
        : { scope: type.scope, price: 0, weeks: 1 };
    const total = Math.max(
        MINIMUM_PRICE,
        type.base +
            scope.price +
            selectedAddons.reduce((sum, addon) => sum + addon.price, 0),
    );
    const weeks =
        type.weeks + scope.weeks + Math.floor(selectedAddons.length / 2);
    const animatedTotal = useAnimatedNumber(total);

    const toggleAddon = (value: string) =>
        setAddons((current) =>
            current.includes(value)
                ? current.filter((item) => item !== value)
                : [...current, value],
        );

    const sendToForm = () => {
        const addonNames = selectedAddons.map((addon) =>
            addon.label.toLowerCase(),
        );
        const message =
            `Iz kalkulatora: ${siteType}, ${scope.scope}` +
            (addonNames.length ? `, dodaci: ${addonNames.join(', ')}` : '') +
            `. Okvirno od ${formatPrice(total)} RSD.`;

        prefill({ message, estimatedValue: total });
        track('calculator_to_form', {
            site_type: siteType,
            value: total,
            currency: 'RSD',
        });
    };

    return (
        <section id="ponuda" aria-labelledby="ponuda-h">
            <div className="wrap">
                <SectionHeading
                    number="05"
                    label="Cena"
                    id="ponuda-h"
                    title="Koliko bi koštao vaš sajt?"
                >
                    Odaberite obim posla i odmah dobijate okvirnu procenu. Bez
                    ostavljanja ličnih podataka.
                </SectionHeading>

                <Reveal className="conf">
                    <div className="panel">
                        <fieldset className="fg">
                            <legend className="fl">
                                <span className="n">01</span>
                                <span className="t">Šta vam treba?</span>
                            </legend>
                            <div className="opts">
                                {SITE_TYPES.map((option) => (
                                    <label key={option.value} className="opt">
                                        <input
                                            type="radio"
                                            name="tip"
                                            value={option.value}
                                            checked={siteType === option.value}
                                            onChange={() =>
                                                setSiteType(option.value)
                                            }
                                        />
                                        <span className="mark" />
                                        <span>
                                            <span className="t">
                                                {option.label}
                                            </span>
                                            <small>{option.hint}</small>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        {hasPageChoice && (
                            <fieldset className="fg">
                                <legend className="fl">
                                    <span className="n">02</span>
                                    <span className="t">Koliko strana?</span>
                                </legend>
                                <div className="opts two">
                                    {PAGE_COUNTS.map((option) => (
                                        <label
                                            key={option.value}
                                            className="opt"
                                        >
                                            <input
                                                type="radio"
                                                name="strane"
                                                value={option.value}
                                                checked={
                                                    pageCount === option.value
                                                }
                                                onChange={() =>
                                                    setPageCount(option.value)
                                                }
                                            />
                                            <span className="mark" />
                                            <span className="t">
                                                {option.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        )}

                        <fieldset className="fg">
                            <legend className="fl">
                                <span className="n">
                                    {hasPageChoice ? '03' : '02'}
                                </span>
                                <span className="t">
                                    Treba li vam još nešto?
                                </span>
                            </legend>
                            <div className="opts two">
                                {ADDONS.map((addon) => (
                                    <label key={addon.value} className="opt">
                                        <input
                                            type="checkbox"
                                            name="dod"
                                            value={addon.value}
                                            checked={addons.includes(
                                                addon.value,
                                            )}
                                            onChange={() =>
                                                toggleAddon(addon.value)
                                            }
                                        />
                                        <span className="mark" />
                                        <span>
                                            <span className="t">
                                                {addon.label}
                                            </span>
                                            <small>{addon.hint}</small>
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>

                    <aside className="res" aria-labelledby="ponuda-rez">
                        <h3 className="lb" id="ponuda-rez">
                            Okvirna cena
                        </h3>
                        <div className="amt" aria-hidden="true">
                            <span className="od">od</span>
                            {formatPrice(animatedTotal)}
                            <span className="cur">dinara</span>
                        </div>
                        <p className="vh" aria-live="polite">
                            Okvirna cena od {formatPrice(total)} dinara, rok
                            izrade oko {weeks} {weeksLabel(weeks)}.
                        </p>
                        <p className="rok">
                            Rok izrade: oko {weeks} {weeksLabel(weeks)}
                        </p>
                        <div className="div" />
                        <dl>
                            <div className="rl">
                                <dt>Osnova</dt>
                                <dd>{formatPrice(type.base)}</dd>
                            </div>
                            <div className="rl">
                                <dt>Obim</dt>
                                <dd>{scope.scope}</dd>
                            </div>
                            <div className="rl">
                                <dt>Dodaci</dt>
                                <dd>{addonsLabel(selectedAddons.length)}</dd>
                            </div>
                        </dl>
                        <a
                            href="#kontakt"
                            className="btn btn-acc btn-block"
                            onClick={sendToForm}
                        >
                            Pošalji upit sa ovim izborom <ArrowIcon />
                        </a>
                        <p className="disc">
                            Reč je o početnoj ceni za izabrani obim, a ne o
                            obavezujućoj ponudi. Konačna cena zavisi od broja
                            proizvoda, funkcija i materijala, i utvrđuje se
                            posle kratkog razgovora. Imate stari sajt? Redizajn
                            se računa kao nov sajt istog obima.
                        </p>
                    </aside>
                </Reveal>
            </div>
        </section>
    );
}
