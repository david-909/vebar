import { router } from '@inertiajs/react';
import type { MouseEvent } from 'react';

type HtmlContentProps = {
    html: string;
    className?: string;
};

/**
 * Renders trusted, repository-owned article HTML (resources/content) and
 * turns its internal links into Inertia visits.
 */
export default function HtmlContent({ html, className }: HtmlContentProps) {
    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        const anchor = (event.target as HTMLElement).closest('a');
        const href = anchor?.getAttribute('href');

        if (!anchor || !href || !href.startsWith('/') || anchor.target) {
            return;
        }

        event.preventDefault();
        router.visit(href);
    };

    return (
        <div
            className={className}
            onClick={handleClick}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
