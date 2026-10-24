import ArticleCta from '@/components/site/article-cta';
import Breadcrumbs from '@/components/site/breadcrumbs';
import GuideCard from '@/components/site/guide-card';
import Seo from '@/components/site/seo';
import { home } from '@/routes';
import type { GuideCard as GuideCardData, SitePageProps } from '@/types';

type GuidesIndexProps = SitePageProps & {
    guides: GuideCardData[];
};

export default function GuidesIndex({ seo, guides }: GuidesIndexProps) {
    return (
        <>
            <Seo seo={seo} />
            <Breadcrumbs
                items={[
                    { label: 'Početna', href: home.url() },
                    { label: 'Vodiči' },
                ]}
            />

            <section className="page-hero">
                <div className="wrap">
                    <p className="kicker mb-6">Vodiči</p>
                    <h1>Odgovori na pitanja koja dobijamo svaki put</h1>
                    <p className="lede">
                        Pre nego što uzmete bilo koga da vam pravi sajt, korisno
                        je da znate kako se formira cena, koliko posao realno
                        traje i šta se traži od vas. Ovi tekstovi su pisani da
                        budu korisni i ako posao ne poverite nama.
                    </p>
                </div>
            </section>

            <section
                className="tint ruled pt-[clamp(46px,5vw,70px)]"
                aria-labelledby="svi-vodici"
            >
                <div className="wrap">
                    <h2 className="vh" id="svi-vodici">
                        Svi vodiči
                    </h2>
                    <div className="cards two">
                        {guides.map((guide) => (
                            <GuideCard
                                key={guide.slug}
                                guide={guide}
                                variant="full"
                            />
                        ))}
                    </div>

                    <ArticleCta
                        className="mt-[clamp(44px,5vw,68px)]"
                        title="Niste našli odgovor?"
                        text="Pitajte direktno. Odgovaramo istog ili sledećeg radnog dana, i kada od toga nemamo nikakvu korist."
                        button="Postavite pitanje"
                        href="/#kontakt"
                    />
                </div>
            </section>
        </>
    );
}
