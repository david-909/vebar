import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import type { FaqItem } from '@/types';

type FaqProps = {
    items: FaqItem[];
    /** Section number on the homepage; null leaves it out. */
    number?: string | null;
};

export default function Faq({ items, number = '06' }: FaqProps) {
    return (
        <section className="tint ruled" id="faq" aria-labelledby="faq-h">
            <div className="wrap">
                <SectionHeading
                    number={number ?? undefined}
                    label="Pitanja"
                    id="faq-h"
                    title="Česta pitanja"
                />
                <Reveal className="faq">
                    {items.map((item, index) => (
                        <details key={item.question} open={index === 0}>
                            <summary>
                                <h3 className="contents">{item.question}</h3>
                                <span className="chev" aria-hidden="true" />
                            </summary>
                            <p>{item.answer}</p>
                        </details>
                    ))}
                </Reveal>
            </div>
        </section>
    );
}
