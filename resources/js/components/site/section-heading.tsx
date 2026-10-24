import type { ReactNode } from 'react';
import Reveal from '@/components/site/reveal';

type SectionHeadingProps = {
    number: string;
    label: string;
    title: ReactNode;
    id?: string;
    children?: ReactNode;
};

export default function SectionHeading({
    number,
    label,
    title,
    id,
    children,
}: SectionHeadingProps) {
    return (
        <Reveal className="shead">
            <div className="snum" aria-hidden="true">
                {number} / {label}
            </div>
            <div>
                <h2 className="up" id={id}>
                    {title}
                </h2>
                {children && <p className="lede">{children}</p>}
            </div>
        </Reveal>
    );
}
