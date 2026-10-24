import { ArrowIcon } from '@/components/site/icons';
import ContactSection from '@/components/site/home/contact-section';
import Faq from '@/components/site/home/faq';
import FreeAnalysis from '@/components/site/home/free-analysis';
import GuidesTeaser from '@/components/site/home/guides-teaser';
import { InquiryFormProvider } from '@/components/site/home/inquiry-form';
import PriceCalculator from '@/components/site/home/price-calculator';
import Process from '@/components/site/home/process';
import SelfCheck from '@/components/site/home/self-check';
import Services from '@/components/site/home/services';
import SpeedCheck from '@/components/site/home/speed-check';
import Seo from '@/components/site/seo';
import { track } from '@/lib/analytics';
import type { FaqItem, GuideCard, SitePageProps } from '@/types';

type HomeProps = SitePageProps & {
    faq: FaqItem[];
    guides: GuideCard[];
    guideCount: number;
    pagespeedKey: string | null;
};

const STRIP_ITEMS = [
    'Prezentacioni sajtovi',
    'Katalozi za veleprodaju',
    'Web prodavnice',
    'Redizajn zastarelih sajtova',
    'Domen i poslovni mejl',
    'Hosting i održavanje',
    'Brzina i mobilni prikaz',
];

export default function Home({
    seo,
    faq,
    guides,
    guideCount,
    pagespeedKey,
}: HomeProps) {
    return (
        <InquiryFormProvider>
            <Seo seo={seo} />

            <section className="hero" id="top" aria-labelledby="hero-h">
                <div className="wrap">
                    <div className="hero-top">
                        <div>
                            <p className="kicker mb-[26px]">
                                Sajtovi, katalozi i web prodavnice
                            </p>
                            <h1 id="hero-h">
                                Sajt koji donosi upite, a ne samo
                                <em> postoji.</em>
                            </h1>
                        </div>
                        <div className="hero-side">
                            <p>
                                Za firme kojima sajt treba da radi: da ga kupac
                                nađe na Google-u, snađe se na telefonu i javi se
                                bez čekanja na vezi.
                            </p>
                            <div className="hero-cta">
                                <a
                                    href="#predlog"
                                    className="btn btn-acc"
                                    onClick={() =>
                                        track('cta_click', { location: 'hero' })
                                    }
                                >
                                    Besplatna analiza <ArrowIcon />
                                </a>
                                <a href="#ponuda" className="btn btn-out">
                                    Izračunajte cenu
                                </a>
                            </div>
                        </div>
                    </div>

                    <SpeedCheck apiKey={pagespeedKey} />
                </div>
            </section>

            <div className="strip" aria-label="Šta radimo">
                <div className="mq">
                    <ul className="contents">
                        {STRIP_ITEMS.map((item) => (
                            <li key={item} className="contents">
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                    {STRIP_ITEMS.map((item) => (
                        <span key={`${item}-loop`} aria-hidden="true">
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            <SelfCheck />
            <Services />
            <FreeAnalysis />
            <Process />
            <PriceCalculator />
            <Faq items={faq} />
            <GuidesTeaser guides={guides} total={guideCount} />
            <ContactSection />
        </InquiryFormProvider>
    );
}
