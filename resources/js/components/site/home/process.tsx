import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';

const STEPS = [
    {
        title: 'Razgovor',
        text: 'Kratak razgovor telefonom: čime se bavite, ko su vaše mušterije i šta vam smeta na postojećem sajtu.',
    },
    {
        title: 'Fiksna ponuda',
        text: 'Dobijate pisanu ponudu sa cenom i rokom. Ugovorena cena se ne menja ni ako se posao pokaže obimnijim od procenjenog.',
    },
    {
        title: 'Izrada',
        text: 'Sajt pratite na linku dok nastaje. Dva kruga izmena uračunata su u cenu.',
    },
    {
        title: 'Puštanje i obuka',
        text: 'Sajt se postavlja na vaš domen, zajedno sa poslovnim mejlom i SSL sertifikatom. Sledi kratka obuka za samostalno uređivanje sadržaja.',
    },
];

export default function Process() {
    return (
        <section className="dark" id="proces" aria-labelledby="proces-h">
            <div className="wrap">
                <SectionHeading
                    number="04"
                    label="Proces"
                    id="proces-h"
                    title={
                        <>
                            Četiri koraka,
                            <br />
                            bez iznenađenja
                        </>
                    }
                >
                    Unapred znate šta plaćate, kada preuzimate sajt i šta se
                    dešava ako predlog ne odgovara.
                </SectionHeading>
                <Reveal as="ol" className="steps">
                    {STEPS.map((step, index) => (
                        <li key={step.title} className="stp">
                            <div className="n" aria-hidden="true">
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </li>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
