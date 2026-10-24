import { createInertiaApp, router } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import SiteLayout from '@/layouts/site-layout';
import { trackPageView } from '@/lib/analytics';
import { captureAttribution } from '@/lib/attribution';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    // Public pages send complete, SEO-tuned titles that already name the site.
    title: (title) =>
        title
            ? title.includes(appName)
                ? title
                : `${title} - ${appName}`
            : appName,
    layout: (name) => {
        switch (true) {
            case name.startsWith('site/'):
                return SiteLayout;
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#2138F5',
        delay: 150,
    },
});

if (typeof window !== 'undefined') {
    // The public site (site.blade.php) is light-only; the app shell follows the user's theme.
    if (document.documentElement.dataset.theme !== 'site') {
        // This will set light / dark mode on load...
        initializeTheme();
    }

    captureAttribution();

    // "navigate" also fires for the initial page load, which tags count on their own.
    let lastTrackedUrl = window.location.href;

    router.on('navigate', () => {
        if (window.location.href === lastTrackedUrl) {
            return;
        }

        lastTrackedUrl = window.location.href;

        captureAttribution();
        trackPageView();
    });
}
