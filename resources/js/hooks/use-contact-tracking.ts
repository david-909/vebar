import { useEffect } from 'react';
import { track } from '@/lib/analytics';

/**
 * Records clicks on phone and e-mail links anywhere on the page.
 */
export function useContactTracking(): void {
    useEffect(() => {
        const onClick = (event: MouseEvent) => {
            const anchor = (event.target as HTMLElement | null)?.closest('a');
            const href = anchor?.getAttribute('href') ?? '';

            if (href.startsWith('tel:')) {
                track('contact_click', { method: 'phone' });
            } else if (href.startsWith('mailto:')) {
                track('contact_click', { method: 'email' });
            }
        };

        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, []);
}
