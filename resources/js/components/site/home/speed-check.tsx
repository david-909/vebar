import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, FormEvent } from 'react';
import { useInquiryForm } from '@/components/site/home/inquiry-form';
import { ArrowIcon } from '@/components/site/icons';
import { track } from '@/lib/analytics';

type Result = {
    url: string;
    score: number;
    lcp: number | null;
    fcp: number | null;
    tbt: number | null;
};

type Status =
    | { type: 'idle' }
    | { type: 'checking'; step: number }
    | { type: 'invalid' }
    | { type: 'failed'; url: string }
    | { type: 'done'; result: Result };

const WAITING_MESSAGES = [
    'Učitavamo vaš sajt kao telefon…',
    'Merimo kada se pojavljuje sadržaj…',
    'Još nekoliko sekundi…',
];

const FACTS = [
    { title: 'Fiksna cena', text: 'Dogovorena unapred, u pisanoj ponudi' },
    { title: 'Sve na vaše ime', text: 'Domen, sajt i pristupni podaci' },
    { title: 'Brz odgovor', text: 'Istog ili sledećeg radnog dana' },
];

function normalizeUrl(value: string): string | null {
    let url = value.trim().replace(/\s+/g, '');

    if (!url) {
        return null;
    }

    if (!/^https?:\/\//i.test(url)) {
        url = `https://${url}`;
    }

    try {
        const parsed = new URL(url);

        return parsed.hostname.includes('.')
            ? parsed.origin + parsed.pathname
            : null;
    } catch {
        return null;
    }
}

function seconds(milliseconds: number | null): string {
    return milliseconds === null
        ? '–'
        : `${(milliseconds / 1000).toFixed(1).replace('.', ',')} s`;
}

function verdict(score: number): string {
    if (score >= 90) {
        return 'Odlično. Brzina nije problem vašeg sajta, pa vredi pogledati ostale stavke ispod.';
    }

    if (score >= 50) {
        return 'Prosečno. Sajt radi, ali posetioci sa telefona čekaju duže nego što bi trebalo, a deo njih odustane.';
    }

    return 'Sporo. Veliki deo posetilaca sa telefona ode pre nego što se stranica učita, i Google to uzima u obzir.';
}

function scoreClass(score: number): string {
    return score >= 90 ? 'ok' : score >= 50 ? 'mid' : 'bad';
}

function reportUrl(url: string): string {
    return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&form_factor=mobile`;
}

/**
 * Mobile speed check via Google PageSpeed Insights, run from the browser.
 * Without an API key Google rejects most anonymous requests, so the block
 * becomes a plain call to action instead.
 */
export default function SpeedCheck({ apiKey }: { apiKey: string | null }) {
    const { prefill } = useInquiryForm();
    const [address, setAddress] = useState('');
    const [status, setStatus] = useState<Status>({ type: 'idle' });
    const inputRef = useRef<HTMLInputElement>(null);
    const isChecking = status.type === 'checking';

    useEffect(() => {
        if (!isChecking) {
            return;
        }

        const timer = window.setInterval(() => {
            setStatus((current) =>
                current.type === 'checking'
                    ? {
                          type: 'checking',
                          step: Math.min(
                              current.step + 1,
                              WAITING_MESSAGES.length - 1,
                          ),
                      }
                    : current,
            );
        }, 7000);

        return () => window.clearInterval(timer);
    }, [isChecking]);

    const check = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const url = normalizeUrl(address);

        if (!url || !apiKey) {
            setStatus({ type: 'invalid' });
            inputRef.current?.focus();

            return;
        }

        setStatus({ type: 'checking', step: 0 });
        track('provera_brzine', { sajt: url });

        const endpoint = new URL(
            'https://www.googleapis.com/pagespeedonline/v5/runPagespeed',
        );
        endpoint.search = new URLSearchParams({
            category: 'performance',
            strategy: 'mobile',
            locale: 'sr',
            url,
            key: apiKey,
        }).toString();

        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            const lighthouse = data?.lighthouseResult;
            const performance = lighthouse?.categories?.performance;

            if (!performance || typeof performance.score !== 'number') {
                throw new Error(
                    data?.error?.message ?? 'Missing performance score',
                );
            }

            const audit = (id: string): number | null =>
                lighthouse.audits?.[id]?.numericValue ?? null;
            const score = Math.round(performance.score * 100);

            setStatus({
                type: 'done',
                result: {
                    url,
                    score,
                    lcp: audit('largest-contentful-paint'),
                    fcp: audit('first-contentful-paint'),
                    tbt: audit('total-blocking-time'),
                },
            });
            track('provera_brzine_rezultat', { ocena: score });
        } catch {
            setStatus({ type: 'failed', url });
            track('provera_brzine_greska', { sajt: url });
        }
    };

    if (!apiKey) {
        return (
            <div className="chk" id="provera">
                <div className="chk-main">
                    <div className="chk-k">Besplatno · Bez obaveze</div>
                    <h2 className="chk-h">Koliko upita gubi vaš sajt?</h2>
                    <p className="chk-p">
                        Pošaljite adresu i dobijate pisanu analizu: brzinu na
                        telefonu, prikaz, Google i kontakt formu, uz tri
                        konkretna prioriteta.
                    </p>
                    <div className="hero-cta">
                        <a href="#kontakt" className="btn btn-ink">
                            Pošaljite adresu sajta
                        </a>
                        <a href="#predlog" className="btn btn-out">
                            Kako izgleda analiza
                        </a>
                    </div>
                </div>
                <Facts />
            </div>
        );
    }

    const result = status.type === 'done' ? status.result : null;

    return (
        <div className="chk" id="provera">
            <div className="chk-main">
                <div className="chk-k">Proverite odmah</div>
                <h2 className="chk-h">Koliko je brz vaš sajt na telefonu?</h2>
                <p className="chk-p">
                    Unesite adresu i za 20 do 30 sekundi dobijate ocenu iz
                    Google-ovog alata PageSpeed Insights, istog koji Google
                    koristi kada procenjuje sajtove.
                </p>
                <form className="chk-form" onSubmit={check} noValidate>
                    <label htmlFor="chk-url" className="vh">
                        Adresa sajta
                    </label>
                    <input
                        ref={inputRef}
                        id="chk-url"
                        type="text"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="www.vasafirma.rs"
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        aria-invalid={
                            status.type === 'invalid' ? true : undefined
                        }
                        aria-describedby="chk-msg"
                        required
                    />
                    <button
                        type="submit"
                        className="btn btn-ink"
                        disabled={isChecking}
                        aria-busy={isChecking}
                    >
                        {isChecking ? 'Proveravamo…' : 'Proverite'}{' '}
                        <ArrowIcon />
                    </button>
                </form>
                <p
                    className={
                        status.type === 'invalid' || status.type === 'failed'
                            ? 'chk-msg err'
                            : 'chk-msg'
                    }
                    id="chk-msg"
                    role="status"
                    aria-live="polite"
                >
                    {status.type === 'checking' &&
                        WAITING_MESSAGES[status.step]}
                    {status.type === 'invalid' &&
                        'Unesite ispravnu adresu, na primer www.vasafirma.rs'}
                    {status.type === 'failed' && (
                        <>
                            Provera trenutno nije uspela (sajt se ne otvara ili
                            je Google preopterećen). Probajte direktno na{' '}
                            <a
                                href={reportUrl(status.url)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                pagespeed.web.dev
                            </a>{' '}
                            ili nam pošaljite adresu.
                        </>
                    )}
                </p>
            </div>

            {result ? (
                <div className="chk-res">
                    <div className="chk-score">
                        <div
                            className={`ring ${scoreClass(result.score)}`}
                            style={{ '--p': result.score } as CSSProperties}
                            role="img"
                            aria-label={`Ocena brzine: ${result.score} od 100`}
                        >
                            <b aria-hidden="true">{result.score}</b>
                            <span aria-hidden="true">/100</span>
                        </div>
                        <div>
                            <div className="chk-lab">Brzina na telefonu</div>
                            <p className="chk-verdict">
                                {verdict(result.score)}
                            </p>
                        </div>
                    </div>
                    <dl className="chk-metrics">
                        <div>
                            <dt>
                                <span>Glavni sadržaj se prikazuje za</span>
                            </dt>
                            <dd>
                                <b>{seconds(result.lcp)}</b>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <span>Prvi prikaz posle</span>
                            </dt>
                            <dd>
                                <b>{seconds(result.fcp)}</b>
                            </dd>
                        </div>
                        <div>
                            <dt>
                                <span>Stranica blokirana</span>
                            </dt>
                            <dd>
                                <b>{seconds(result.tbt)}</b>
                            </dd>
                        </div>
                    </dl>
                    <div className="chk-cta">
                        <a
                            href="#kontakt"
                            className="btn btn-acc"
                            onClick={() =>
                                prefill({
                                    website: result.url
                                        .replace(/^https?:\/\//, '')
                                        .replace(/\/$/, ''),
                                    message: `Molim besplatnu analizu sajta. Ocena brzine na telefonu: ${result.score}/100.`,
                                })
                            }
                        >
                            Pošaljite sajt na besplatnu analizu <ArrowIcon />
                        </a>
                        <a
                            href={reportUrl(result.url)}
                            className="ulink"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Ceo izveštaj na pagespeed.web.dev
                        </a>
                    </div>
                </div>
            ) : (
                <Facts />
            )}
        </div>
    );
}

function Facts() {
    return (
        <ul className="chk-facts">
            {FACTS.map((fact) => (
                <li key={fact.title}>
                    <b>{fact.title}</b>
                    <span>{fact.text}</span>
                </li>
            ))}
        </ul>
    );
}
