import { useEffect, useState } from 'react';

/** Distance from the top of the viewport at which a heading counts as "being read". */
const READING_LINE = 120;

/**
 * Returns the id of the section currently being read (the last heading that
 * has scrolled past the reading line), for highlighting the table of contents.
 */
export function useActiveSection(ids: string[]): string | null {
    const [activeId, setActiveId] = useState<string | null>(null);
    const key = ids.join(',');

    useEffect(() => {
        const headingIds = key.split(',').filter(Boolean);
        let frame = 0;

        const update = () => {
            frame = 0;
            const passed = headingIds.filter((id) => {
                const heading = document.getElementById(id);

                return (
                    heading !== null &&
                    heading.getBoundingClientRect().top <= READING_LINE
                );
            });

            setActiveId(passed.at(-1) ?? null);
        };

        const onScroll = () => {
            if (!frame) {
                frame = requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
        };
    }, [key]);

    return activeId;
}
