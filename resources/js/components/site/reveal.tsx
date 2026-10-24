import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type RevealProps = {
    as?: ElementType;
    className?: string;
    children: ReactNode;
    [attribute: string]: unknown;
};

/**
 * Fades content in when it scrolls into view. The hidden state is gated
 * behind the `js` class on <html>, so server-rendered content is always
 * visible without JavaScript. Don't wrap above-the-fold content.
 */
export default function Reveal({
    as: Component = 'div',
    className,
    children,
    ...rest
}: RevealProps) {
    const ref = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        const prefersReducedMotion = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        ).matches;

        if (
            !element ||
            prefersReducedMotion ||
            !('IntersectionObserver' in window)
        ) {
            setIsVisible(true);

            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    return (
        <Component
            ref={ref}
            className={cn('rv', isVisible && 'in', className)}
            {...rest}
        >
            {children}
        </Component>
    );
}
