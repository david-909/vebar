import { Link } from '@inertiajs/react';
import GuideCard from '@/components/site/guide-card';
import Reveal from '@/components/site/reveal';
import SectionHeading from '@/components/site/section-heading';
import { index as guidesIndex } from '@/routes/guides';
import type { GuideCard as GuideCardData } from '@/types';

function textsLabel(count: number): string {
    if (count === 1) {
        return 'jedan tekst';
    }

    const isFew =
        count % 10 >= 2 &&
        count % 10 <= 4 &&
        (count % 100 < 12 || count % 100 > 14);

    return `${count} ${isFew ? 'teksta' : 'tekstova'}`;
}

export default function GuidesTeaser({
    guides,
    total,
}: {
    guides: GuideCardData[];
    total: number;
}) {
    const remaining = total - guides.length;

    return (
        <section id="vodici" aria-labelledby="vodici-h">
            <div className="wrap">
                <SectionHeading
                    number="07"
                    label="Vodiči"
                    id="vodici-h"
                    title="Pre nego što bilo koga angažujete"
                >
                    Napisali smo nekoliko tekstova o tome kako se formira cena,
                    koliko posao traje i šta se traži od vas. Korisni su i ako
                    posao ne poverite nama.
                </SectionHeading>
                <Reveal className="cards">
                    {guides.map((guide) => (
                        <GuideCard key={guide.slug} guide={guide} />
                    ))}
                    <Link
                        href={guidesIndex.url()}
                        className="card all"
                        prefetch
                    >
                        <span className="n">Svi vodiči</span>
                        <h3>Još {textsLabel(remaining)}</h3>
                        <p>
                            Rokovi izrade, redizajn bez gubitka pozicija,
                            Instagram naspram sajta, priprema materijala.
                        </p>
                    </Link>
                </Reveal>
            </div>
        </section>
    );
}
