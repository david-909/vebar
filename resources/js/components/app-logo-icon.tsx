import type { SVGAttributes } from 'react';

/** One-colour Vebar mark (brand package: svg/vebar-znak-crni.svg). */
export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fillRule="evenodd"
                d="M0 0H100V100H0Z M16 28L28 28L39 56.9L50 28L62 28L44.5 74L33.5 74Z M68 64L86 64L86 74L68 74Z"
            />
        </svg>
    );
}
