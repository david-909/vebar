import { useHttp, usePage } from '@inertiajs/react';
import { createContext, use, useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { ArrowIcon } from '@/components/site/icons';
import SiteLink from '@/components/site/site-link';
import { track } from '@/lib/analytics';
import { readAttribution } from '@/lib/attribution';
import { privacy } from '@/routes';
import { store as storeInquiry } from '@/routes/inquiries';

type InquiryData = {
    ime: string;
    firma: string;
    kontakt: string;
    sajt: string;
    poruka: string;
    veb_adresa: string;
};

type Prefill = {
    website?: string;
    message?: string;
    estimatedValue?: number;
};

type InquiryFormContextValue = {
    form: ReturnType<typeof useHttp<InquiryData, { message: string }>>;
    estimatedValue: number | null;
    prefill: (draft: Prefill) => void;
};

const InquiryFormContext = createContext<InquiryFormContextValue | null>(null);

/**
 * Owns the contact form state so other homepage sections (speed check,
 * self-check, price calculator) can hand their results over to the form.
 */
export function InquiryFormProvider({ children }: { children: ReactNode }) {
    const form = useHttp<InquiryData, { message: string }>({
        ime: '',
        firma: '',
        kontakt: '',
        sajt: '',
        poruka: '',
        veb_adresa: '',
    });
    const [estimatedValue, setEstimatedValue] = useState<number | null>(null);

    const prefill = ({ website, message, estimatedValue: value }: Prefill) => {
        form.setData((data) => ({
            ...data,
            sajt: website && !data.sajt ? website : data.sajt,
            poruka:
                message && !data.poruka.includes(message)
                    ? message + (data.poruka ? `\n\n${data.poruka}` : '')
                    : data.poruka,
        }));

        if (value !== undefined) {
            setEstimatedValue(value);
        }

        window.setTimeout(() => {
            document.getElementById('f-ime')?.focus({ preventScroll: true });
        }, 400);
    };

    return (
        <InquiryFormContext value={{ form, estimatedValue, prefill }}>
            {children}
        </InquiryFormContext>
    );
}

export function useInquiryForm(): InquiryFormContextValue {
    const context = use(InquiryFormContext);

    if (!context) {
        throw new Error(
            'useInquiryForm must be used within <InquiryFormProvider>.',
        );
    }

    return context;
}

type Status =
    | { type: 'idle' }
    | { type: 'success'; message: string }
    | { type: 'error'; message: ReactNode };

export function ContactForm() {
    const { site } = usePage().props;
    const { form, estimatedValue } = useInquiryForm();
    const [status, setStatus] = useState<Status>({ type: 'idle' });
    const renderedAt = useRef(0);
    const errors = form.errors as Partial<
        Record<keyof InquiryData | 'form', string>
    >;

    useEffect(() => {
        renderedAt.current = Math.floor(Date.now() / 1000);
    }, []);

    const focusField = (field: string) =>
        document.getElementById(`f-${field}`)?.focus();

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.clearErrors();

        const missing = (['ime', 'kontakt'] as const).filter(
            (field) => !form.data[field].trim(),
        );

        if (missing.length > 0) {
            missing.forEach((field) =>
                form.setError(
                    field,
                    field === 'ime'
                        ? 'Unesite ime i prezime.'
                        : 'Unesite telefon ili mejl adresu, da bismo mogli da vam odgovorimo.',
                ),
            );
            setStatus({
                type: 'error',
                message: 'Molimo popunite ime i kontakt.',
            });
            focusField(missing[0]);

            return;
        }

        setStatus({ type: 'idle' });

        form.transform((data) => ({
            ...data,
            ts: renderedAt.current,
            attribution: readAttribution() ?? {},
        }));

        void form
            .post(storeInquiry.url(), {
                onSuccess: (response) => {
                    setStatus({ type: 'success', message: response.message });
                    track('generate_lead', {
                        form_location: 'kontakt',
                        has_website: form.data.sajt.trim() !== '',
                        ...(estimatedValue
                            ? { value: estimatedValue, currency: 'RSD' }
                            : {}),
                    });
                    form.reset();
                    renderedAt.current = Math.floor(Date.now() / 1000);
                },
                onError: (validationErrors) => {
                    const fields = Object.keys(validationErrors);
                    const formError = (
                        validationErrors as Record<string, string>
                    ).form;

                    setStatus({
                        type: 'error',
                        message: formError ?? 'Proverite označena polja.',
                    });

                    if (fields[0] && fields[0] !== 'form') {
                        focusField(fields[0]);
                    }
                },
                onHttpException: () => {
                    setStatus({
                        type: 'error',
                        message: <FallbackMessage email={site.email} />,
                    });

                    return false;
                },
                onNetworkError: () => {
                    setStatus({
                        type: 'error',
                        message: <FallbackMessage email={site.email} />,
                    });

                    return false;
                },
            })
            .catch(() => {
                // Handled by the callbacks above.
            });
    };

    const fieldProps = (field: keyof InquiryData) => ({
        id: `f-${field}`,
        name: field,
        value: form.data[field],
        onChange: (event: { target: { value: string } }) => {
            form.setData(field, event.target.value);

            if (status.type === 'success') {
                setStatus({ type: 'idle' });
            }
        },
        'aria-invalid': errors[field] ? true : undefined,
        'aria-describedby': errors[field] ? `f-${field}-err` : undefined,
    });

    const fieldError = (field: keyof InquiryData) =>
        errors[field] && (
            <p className="fld-err" id={`f-${field}-err`}>
                {errors[field]}
            </p>
        );

    const isSent = status.type === 'success';

    return (
        <form
            action={storeInquiry.url()}
            method="post"
            onSubmit={submit}
            noValidate
            aria-label="Upit za besplatnu analizu"
        >
            <div className="fld">
                <label htmlFor="f-ime">Ime i prezime</label>
                <input
                    {...fieldProps('ime')}
                    type="text"
                    autoComplete="name"
                    placeholder="Petar Petrović"
                    required
                />
                {fieldError('ime')}
            </div>
            <div className="fld">
                <label htmlFor="f-firma">
                    Naziv firme <span className="opt-l">(nije obavezno)</span>
                </label>
                <input
                    {...fieldProps('firma')}
                    type="text"
                    autoComplete="organization"
                    placeholder="Naziv vaše firme"
                />
                {fieldError('firma')}
            </div>
            <div className="fld">
                <label htmlFor="f-kontakt">Telefon ili mejl</label>
                <input
                    {...fieldProps('kontakt')}
                    type="text"
                    autoComplete="on"
                    placeholder="060 123 4567"
                    required
                />
                {fieldError('kontakt')}
            </div>
            <div className="fld">
                <label htmlFor="f-sajt">
                    Adresa sadašnjeg sajta{' '}
                    <span className="opt-l">(nije obavezno)</span>
                </label>
                <input
                    {...fieldProps('sajt')}
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="www.vasafirma.rs"
                />
                {fieldError('sajt')}
            </div>
            <div className="fld">
                <label htmlFor="f-poruka">Šta vam treba?</label>
                <textarea
                    {...fieldProps('poruka')}
                    placeholder="Ukratko: čime se bavite i šta očekujete od sajta."
                    rows={4}
                />
                {fieldError('poruka')}
            </div>

            <div className="hp" aria-hidden="true">
                <label htmlFor="f-veb_adresa">Ostavite ovo polje prazno</label>
                <input
                    {...fieldProps('veb_adresa')}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                />
            </div>

            <button
                type="submit"
                className={
                    isSent
                        ? 'btn btn-ok btn-block btn-lg'
                        : 'btn btn-ink btn-block btn-lg'
                }
                disabled={form.processing}
                aria-busy={form.processing}
            >
                {form.processing ? (
                    'Slanje…'
                ) : isSent ? (
                    'Upit je poslat ✓'
                ) : (
                    <>
                        Pošalji upit <ArrowIcon />
                    </>
                )}
            </button>
            <p
                className={
                    status.type === 'idle'
                        ? 'fnote'
                        : `fnote ${status.type === 'success' ? 'ok' : 'err'}`
                }
                role="status"
                aria-live="polite"
            >
                {status.type === 'idle' ? (
                    <>
                        Podaci se koriste isključivo da bismo vam odgovorili na
                        upit. Više u{' '}
                        <SiteLink href={privacy.url()}>
                            politici privatnosti
                        </SiteLink>
                        .
                    </>
                ) : (
                    status.message
                )}
            </p>
        </form>
    );
}

function FallbackMessage({ email }: { email: string }) {
    return (
        <>
            Slanje trenutno ne radi. Pišite na{' '}
            <a href={`mailto:${email}`}>{email}</a>.
        </>
    );
}
