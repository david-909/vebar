import { usePage } from '@inertiajs/react';
import ArticleCta from '@/components/site/article-cta';
import Breadcrumbs from '@/components/site/breadcrumbs';
import HtmlContent from '@/components/site/html-content';
import Seo from '@/components/site/seo';
import { formatDate } from '@/lib/dates';
import { home } from '@/routes';
import type { SitePageProps } from '@/types';

type PrivacyProps = SitePageProps & {
    body: string;
    updatedAt: string;
};

export default function Privacy({ seo, body, updatedAt }: PrivacyProps) {
    const { site } = usePage().props;

    return (
        <>
            <Seo seo={seo} />
            <Breadcrumbs
                items={[
                    { label: 'Početna', href: home.url() },
                    { label: 'Privatnost' },
                ]}
            />

            <article aria-labelledby="art-h">
                <header className="wrap art-hero">
                    <p className="kicker acc mb-[22px]">Privatnost</p>
                    <h1 id="art-h">Politika privatnosti</h1>
                    <p className="sub">
                        Kratko i bez pravničkog jezika: šta se prikuplja kroz
                        kontakt formu i merenje posećenosti, i šta se sa tim
                        dešava.
                    </p>
                    <div className="art-meta">
                        <span>
                            Ažurirano{' '}
                            <time dateTime={updatedAt}>
                                {formatDate(updatedAt)}
                            </time>
                        </span>
                    </div>
                </header>

                <div className="wrap art-body pb-[clamp(64px,7.6vw,112px)]">
                    <HtmlContent html={body} className="art" />
                    <div className="max-w-[70ch]">
                        <ArticleCta
                            title="Imate pitanje?"
                            text={`Pišite na ${site.email}. Odgovaramo istog ili sledećeg radnog dana.`}
                            button="Kontakt"
                            href="/#kontakt"
                        />
                    </div>
                </div>
            </article>
        </>
    );
}
