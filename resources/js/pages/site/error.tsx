import { ArrowIcon } from '@/components/site/icons';
import Seo from '@/components/site/seo';
import SiteLink from '@/components/site/site-link';
import { home } from '@/routes';
import { index as guidesIndex } from '@/routes/guides';
import type { SitePageProps } from '@/types';

const MESSAGES: Record<number, { title: string; text: string }> = {
    403: {
        title: 'Pristup nije dozvoljen',
        text: 'Nemate dozvolu da otvorite ovu stranicu.',
    },
    404: {
        title: 'Ova stranica ne postoji',
        text: 'Adresa je verovatno pogrešno uneta ili je stranica u međuvremenu uklonjena.',
    },
    500: {
        title: 'Nešto nije u redu',
        text: 'Došlo je do greške na serveru. Pokušajte ponovo za nekoliko trenutaka.',
    },
    503: {
        title: 'Sajt se trenutno ažurira',
        text: 'Vraćamo se za nekoliko minuta. Hvala na strpljenju.',
    },
};

export default function ErrorPage({
    seo,
    status,
}: SitePageProps & { status: number }) {
    const message = MESSAGES[status] ?? MESSAGES[500];

    return (
        <>
            <Seo seo={seo} />
            <div className="nf wrap">
                <div>
                    <div className="code" aria-hidden="true">
                        {status}
                    </div>
                    <h1>{message.title}</h1>
                    <p>{message.text}</p>
                    <div className="hero-cta justify-center">
                        <SiteLink
                            href={home.url()}
                            className="btn btn-acc btn-lg"
                        >
                            Nazad na početnu <ArrowIcon />
                        </SiteLink>
                        {status === 404 && (
                            <SiteLink
                                href={guidesIndex.url()}
                                className="btn btn-out btn-lg"
                            >
                                Vodiči
                            </SiteLink>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
