import { Head } from '@inertiajs/react';
import type { Seo as SeoData } from '@/types';

/**
 * Renders all SEO metadata for a page. Rendered on the server during SSR,
 * then kept in sync by Inertia on client-side navigation. The markup
 * mirrors resources/views/partials/seo-head.blade.php (the non-SSR fallback).
 */
export default function Seo({ seo }: { seo: SeoData }) {
    // Escape "<" so the JSON can never close the surrounding <script> tag.
    const jsonLd = JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c');

    return (
        <Head>
            <title>{seo.title}</title>
            <meta
                head-key="description"
                name="description"
                content={seo.description}
            />
            <meta head-key="robots" name="robots" content={seo.robots} />
            <link head-key="canonical" rel="canonical" href={seo.canonical} />
            <meta head-key="og:type" property="og:type" content={seo.type} />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={seo.siteName}
            />
            <meta
                head-key="og:locale"
                property="og:locale"
                content={seo.locale}
            />
            <meta head-key="og:title" property="og:title" content={seo.title} />
            <meta
                head-key="og:description"
                property="og:description"
                content={seo.description}
            />
            <meta head-key="og:url" property="og:url" content={seo.canonical} />
            <meta head-key="og:image" property="og:image" content={seo.image} />
            <meta
                head-key="og:image:width"
                property="og:image:width"
                content="1200"
            />
            <meta
                head-key="og:image:height"
                property="og:image:height"
                content="630"
            />
            {seo.publishedAt && (
                <meta
                    head-key="article:published_time"
                    property="article:published_time"
                    content={seo.publishedAt}
                />
            )}
            {seo.modifiedAt && (
                <meta
                    head-key="article:modified_time"
                    property="article:modified_time"
                    content={seo.modifiedAt}
                />
            )}
            <meta
                head-key="twitter:card"
                name="twitter:card"
                content="summary_large_image"
            />
            <script
                head-key="json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: jsonLd }}
            />
        </Head>
    );
}
