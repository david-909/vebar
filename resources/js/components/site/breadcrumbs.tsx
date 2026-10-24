import SiteLink from '@/components/site/site-link';

type Crumb = { label: string; href?: string };

/** Visible breadcrumb trail; the BreadcrumbList JSON-LD is generated server-side. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <div className="wrap">
            <nav className="crumb" aria-label="Putanja">
                <ol>
                    {items.map((item, index) => (
                        <li key={item.label}>
                            {item.href && index < items.length - 1 ? (
                                <SiteLink href={item.href}>
                                    {item.label}
                                </SiteLink>
                            ) : (
                                <span aria-current="page">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
}
