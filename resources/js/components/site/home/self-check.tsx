import { useState } from 'react';
import { useInquiryForm } from '@/components/site/home/inquiry-form';
import { ArrowIcon } from '@/components/site/icons';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import { track } from '@/lib/analytics';

const SYMPTOMS = [
    {
        title: 'Na telefonu mora da se uvećava i traži',
        text: 'Većina posetilaca dolazi sa mobilnog. Ako se ne snađu za nekoliko sekundi, vraćaju se na pretragu i biraju sledeći rezultat.',
    },
    {
        title: 'Stranica se učitava duže od tri sekunde',
        text: 'Spor sajt gubi posetioce pre nego što vide ponudu, a lošije stoji i na Google-u. Brzinu možete da proverite iznad.',
    },
    {
        title: 'Na Google-u vas nema za ono što prodajete',
        text: 'Pojavljujete se kada neko ukuca ime firme, ali ne i kada traži vašu uslugu ili proizvod.',
    },
    {
        title: 'Kupac ne nalazi proizvod ili cenu bez poziva',
        text: 'Katalog je PDF, pretraga ne nalazi artikal ili su informacije samo u glavi prodavca.',
    },
    {
        title: 'Sajt izgleda starije od firme',
        text: 'Posetilac po sajtu procenjuje da li firma i dalje radi ozbiljno, i to za nekoliko sekundi.',
    },
    {
        title: 'Ne znate koliko upita sajt donosi',
        text: 'Posećenost se ne meri, a poruka sa forme ponekad završi u neželjenoj pošti.',
    },
    {
        title: 'Za svaku izmenu morate nekoga da molite',
        text: 'Cene, ponuda i kontakt podaci na sajtu kasne za onim što zaista radite.',
    },
];

function summary(count: number): string {
    if (count === 0) {
        return 'Označite stavke koje važe za vaš sajt.';
    }

    if (count <= 2) {
        return 'Nekoliko stvari koje se obično brzo rešavaju. Analiza pokazuje odakle da počnete.';
    }

    return 'Vaš sajt verovatno svakog dana gubi deo upita. Pošaljite adresu i pokazaćemo gde tačno.';
}

export default function SelfCheck() {
    const { prefill } = useInquiryForm();
    const [checked, setChecked] = useState<string[]>([]);

    const toggle = (title: string) =>
        setChecked((current) =>
            current.includes(title)
                ? current.filter((item) => item !== title)
                : [...current, title],
        );

    const sendToForm = () => {
        if (checked.length === 0) {
            return;
        }

        const selected = SYMPTOMS.filter((symptom) =>
            checked.includes(symptom.title),
        ).map(
            (symptom) =>
                symptom.title.charAt(0).toLowerCase() + symptom.title.slice(1),
        );

        prefill({ message: `Iz samoprovere: ${selected.join('; ')}.` });
        track('self_check_to_form', { items: checked.length });
    };

    return (
        <section className="tint" id="problem" aria-labelledby="problem-h">
            <div className="wrap">
                <SectionHeading
                    number="01"
                    label="Samoprovera"
                    id="problem-h"
                    title={
                        <>
                            Gde vaš sajt
                            <br />
                            gubi kupce
                        </>
                    }
                >
                    Označite šta važi za vaš sajt. Svaka stavka je mesto na kom
                    posetilac odustane, a da vi to nikada ne saznate.
                </SectionHeading>

                <Reveal as="fieldset" className="sym">
                    <legend className="vh">Šta važi za vaš sajt?</legend>
                    {SYMPTOMS.map((symptom, index) => {
                        const isChecked = checked.includes(symptom.title);
                        const id = `sym-${index}`;

                        return (
                            <label
                                key={symptom.title}
                                className={isChecked ? 'sym-row on' : 'sym-row'}
                                htmlFor={id}
                            >
                                <input
                                    id={id}
                                    type="checkbox"
                                    className="sym-cb"
                                    checked={isChecked}
                                    onChange={() => toggle(symptom.title)}
                                    aria-describedby={`${id}-d`}
                                />
                                <span className="i" aria-hidden="true">
                                    <span className="box" />
                                </span>
                                <span className="t">{symptom.title}</span>
                                <span className="d" id={`${id}-d`}>
                                    {symptom.text}
                                </span>
                            </label>
                        );
                    })}
                </Reveal>

                <Reveal
                    className={checked.length >= 3 ? 'sym-sum hot' : 'sym-sum'}
                >
                    <div aria-live="polite">
                        <b>
                            {checked.length} od {SYMPTOMS.length}
                        </b>
                        <span>{summary(checked.length)}</span>
                    </div>
                    <a
                        href="#kontakt"
                        className="btn btn-acc"
                        onClick={sendToForm}
                    >
                        Zatražite besplatnu analizu <ArrowIcon />
                    </a>
                </Reveal>
            </div>
        </section>
    );
}
