import { Link } from '@inertiajs/react';
import type { AriaAttributes, MouseEvent, ReactNode } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';

type SiteLinkProps = {
    href: string;
    className?: string;
    children?: ReactNode;
    onClick?: (event: MouseEvent<Element>) => void;
    'aria-current'?: AriaAttributes['aria-current'];
};

/**
 * Internal link that picks the right element: a plain in-page anchor when the
 * target section is on the current page, an Inertia <Link> (prefetched on
 * hover) for other pages, and a regular <a> for external, mail and phone links.
 */
export default function SiteLink({ href, ...props }: SiteLinkProps) {
    const { currentUrl } = useCurrentUrl();

    if (/^(https?:|mailto:|tel:)/.test(href)) {
        return <a href={href} {...props} />;
    }

    const [path, hash] = href.split('#');

    if (hash !== undefined && (path === '' || path === currentUrl)) {
        return <a href={`#${hash}`} {...props} />;
    }

    return <Link href={href} prefetch {...props} />;
}
