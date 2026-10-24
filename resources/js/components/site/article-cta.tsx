import { ArrowIcon } from '@/components/site/icons';
import SiteLink from '@/components/site/site-link';
import { track } from '@/lib/analytics';

type ArticleCtaProps = {
    title: string;
    text: string;
    button: string;
    href: string;
    className?: string;
};

export default function ArticleCta({
    title,
    text,
    button,
    href,
    className,
}: ArticleCtaProps) {
    return (
        <aside
            className={className ? `art-cta ${className}` : 'art-cta'}
            aria-label={title}
        >
            <div>
                <h2>{title}</h2>
                <p>{text}</p>
            </div>
            <SiteLink
                href={href}
                className="btn btn-acc btn-lg"
                onClick={() => track('cta_click', { location: 'article' })}
            >
                {button} <ArrowIcon />
            </SiteLink>
        </aside>
    );
}
