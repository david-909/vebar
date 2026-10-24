type IconProps = {
    size?: number;
};

export function ArrowIcon({ size = 14 }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden="true"
            focusable="false"
        >
            <path d="M2 8h11M9 4l4 4-4 4" />
        </svg>
    );
}

export function LogoMark({ inverted = false }: { inverted?: boolean }) {
    return (
        <svg
            width="26"
            height="26"
            viewBox="0 0 32 32"
            aria-hidden="true"
            focusable="false"
        >
            <rect width="32" height="32" fill={inverted ? '#fff' : '#0A0A0B'} />
            <path
                d="M7 9.5L16 24l9-14.5"
                stroke={inverted ? '#0A0A0B' : '#fff'}
                strokeWidth="3"
                fill="none"
            />
        </svg>
    );
}
