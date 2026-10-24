import type { Auth } from '@/types/auth';
import type { SiteInfo } from '@/types/site';

declare module 'react' {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            sidebarOpen: boolean;
            site: SiteInfo;
            [key: string]: unknown;
        };
    }
}

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
        vebarAnalytics?: { mode: 'gtm' | 'gtag' };
        vebarConsent?: {
            update: (state: Record<string, 'granted' | 'denied'>) => void;
        };
    }
}
