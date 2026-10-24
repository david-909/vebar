import ArticleCta from '@/components/site/article-cta';
import Breadcrumbs from '@/components/site/breadcrumbs';
import GuideCard from '@/components/site/guide-card';
import HtmlContent from '@/components/site/html-content';
import Seo from '@/components/site/seo';
import SiteLink from '@/components/site/site-link';
import { useActiveSection } from '@/hooks/use-active-section';
import { formatDate } from '@/lib/dates';
import { home } from '@/routes';
import { index as guidesIndex } from '@/routes/guides';
import type { Guide, GuideCard as GuideCardData, SitePageProps } from '@/types';

type GuideShowProps = SitePageProps & {
    guide: Guide;
    body: string;
    related: GuideCardData[];
};

export default function GuideShow({
    seo,
    guide,
    body,
    related,
}: GuideShowProps) {
    const activeSection = useActiveSection(guide.toc.map((item) => item.id));

    return (
        <>
            <Seo seo={seo} />
            <Breadcrumbs
                items={[
                    { label: 'Početna', href: home.url() },
                    { label: 'Vodiči', href: guidesIndex.url() },
                    { label: guide.category },
                ]}
            />

            <article aria-labelledby="art-h">
                <header className="wrap art-hero">
                    <p className="kicker acc mb-[22px]">{guide.category}</p>
                    <h1 id="art-h">{guide.title}</h1>
                    <p className="sub">{guide.lead}</p>
                    <div className="art-meta">
                        <span>
                            Vreme čitanja: {guide.readingMinutes} minuta
                        </span>
                        <span>
                            {guide.wasUpdated ? 'Ažurirano' : 'Objavljeno'}{' '}
                            <time
                                dateTime={
                                    guide.wasUpdated
                                        ? guide.updatedAt
                                        : guide.publishedAt
                                }
                            >
                                {formatDate(
                                    guide.wasUpdated
                                        ? guide.updatedAt
                                        : guide.publishedAt,
                                )}
                            </time>
                        </span>
                    </div>
                </header>

                <div className="wrap art-wrap">
                    <div>
                        <HtmlContent html={body} className="art" />
                        <ArticleCta {...guide.cta} />
                    </div>

                    <aside className="toc" aria-labelledby="toc-h">
                        <h2 className="toc-h" id="toc-h">
                            Na ovoj strani
                        </h2>
                        <nav aria-labelledby="toc-h">
                            <ul>
                                {guide.toc.map((item) => (
                                    <li key={item.id}>
                                        <a
                                            href={`#${item.id}`}
                                            aria-current={
                                                activeSection === item.id
                                                    ? 'true'
                                                    : undefined
                                            }
                                        >
                                            {item.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        {guide.tocButton && (
                            <div className="toc-foot">
                                <SiteLink
                                    href={guide.tocButton.href}
                                    className="btn btn-out w-full"
                                >
                                    {guide.tocButton.label}
                                </SiteLink>
                            </div>
                        )}
                    </aside>
                </div>

                {related.length > 0 && (
                    <section className="wrap rel" aria-labelledby="rel-h">
                        <h2 className="eyebrow" id="rel-h">
                            Pročitajte i ovo
                        </h2>
                        <div className="cards three">
                            {related.map((item, index) => (
                                <GuideCard
                                    key={item.slug}
                                    guide={item}
                                    label={`${String(index + 1).padStart(2, '0')} / ${item.category}`}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </>
    );
}
