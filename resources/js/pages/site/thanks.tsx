import { usePage } from '@inertiajs/react';
import Breadcrumbs from '@/components/site/breadcrumbs';
import { ArrowIcon } from '@/components/site/icons';
import Seo from '@/components/site/seo';
import SiteLink from '@/components/site/site-link';
import { home } from '@/routes';
import type { SitePageProps } from '@/types';

export default function Thanks({ seo }: SitePageProps) {
    const { site } = usePage().props;

    return (
        <>
            <Seo seo={seo} />
            <Breadcrumbs
                items={[
                    { label: 'Početna', href: home.url() },
                    { label: 'Potvrda' },
                ]}
            />

            <article aria-labelledby="art-h">
                <header className="wrap art-hero">
                    <p className="kicker acc mb-[22px]">Potvrda</p>
                    <h1 id="art-h">Poruka je poslata</h1>
                    <p className="sub">Hvala što ste se javili.</p>
                </header>

                <div className="wrap art-body pb-[clamp(64px,7.6vw,112px)]">
                    <div className="art">
                        <p>
                            Poruka je stigla. Javljamo se istog ili sledećeg
                            radnog dana.
                        </p>
                        <p>
                            Ukoliko ste poslali adresu svog sajta, prvo ćemo ga
                            pregledati — brzinu, prikaz na telefonu, sertifikat
                            i greške u kodu — pa vam se javiti sa predlogom. To
                            obično traje tri do pet radnih dana.
                        </p>
                        <p>
                            Ako u međuvremenu imate nešto da dodate, samo
                            odgovorite na ovu adresu:{' '}
                            <a href={`mailto:${site.email}`}>{site.email}</a>.
                        </p>
                        <SiteLink
                            href={home.url()}
                            className="btn btn-acc btn-lg mt-4"
                        >
                            Nazad na početnu <ArrowIcon />
                        </SiteLink>
                    </div>
                </div>
            </article>
        </>
    );
}
