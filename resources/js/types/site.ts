export type SiteInfo = {
    name: string;
    tagline: string;
    email: string;
    phone: string;
    phoneDisplay: string;
    areaServed: string;
    city: string;
    footerGuides: { slug: string; title: string }[];
};

export type Seo = {
    title: string;
    description: string;
    canonical: string;
    robots: string;
    type: 'website' | 'article';
    image: string;
    siteName: string;
    locale: string;
    publishedAt: string | null;
    modifiedAt: string | null;
    jsonLd: Record<string, unknown>;
};

export type FaqItem = {
    question: string;
    answer: string;
};

export type GuideCard = {
    number: number;
    slug: string;
    title: string;
    cardTitle: string;
    excerpt: string;
    category: string;
    readingMinutes: number;
};

export type Guide = GuideCard & {
    lead: string;
    breadcrumb: string;
    publishedAt: string;
    updatedAt: string;
    wasUpdated: boolean;
    toc: { id: string; label: string }[];
    tocButton: { label: string; href: string } | null;
    cta: { title: string; text: string; button: string; href: string };
};

export type SitePageProps = {
    seo: Seo;
};
