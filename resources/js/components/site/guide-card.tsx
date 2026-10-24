import { Link } from '@inertiajs/react';
import { ArrowIcon } from '@/components/site/icons';
import { show as showGuide } from '@/routes/guides';
import type { GuideCard as GuideCardData } from '@/types';

type GuideCardProps = {
    guide: GuideCardData;
    label?: string;
    variant?: 'compact' | 'full';
};

export default function GuideCard({
    guide,
    label,
    variant = 'compact',
}: GuideCardProps) {
    const isFull = variant === 'full';

    return (
        <Link href={showGuide.url(guide.slug)} className="card" prefetch>
            <span className="n">
                {label ??
                    `${String(guide.number).padStart(2, '0')} / ${guide.category}`}
            </span>
            <h3>{isFull ? guide.title : guide.cardTitle}</h3>
            <p>{guide.excerpt}</p>
            {isFull && (
                <span className="go">
                    Pročitajte &middot; {guide.readingMinutes} minuta{' '}
                    <ArrowIcon />
                </span>
            )}
        </Link>
    );
}
