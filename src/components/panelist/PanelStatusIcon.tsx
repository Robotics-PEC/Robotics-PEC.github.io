export interface PanelStatusIconProps {
    isOccupied: boolean;
    size?: "sm" | "lg";
}

const PanelStatusIcon = ({
    isOccupied,
    size = "lg",
}: PanelStatusIconProps) => {
    const dimensions = size === "lg" ? 100 : 40;
    const color = isOccupied ? "#ef4444" : "#22c55e";

    return (
        <svg
            width={dimensions}
            height={dimensions}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label={isOccupied ? "Panel occupied" : "Panel free"}
        >
            {/* Monitor */}
            <rect
                x="12"
                y="15"
                width="76"
                height="52"
                rx="6"
                stroke={color}
                strokeWidth="6"
            />

            {/* Screen */}
            <rect
                x="22"
                y="25"
                width="56"
                height="32"
                rx="2"
                fill={color}
                opacity="0.15"
            />

            {/* Stand */}
            <path
                d="M40 67V78H60V67"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
            />

            {/* Base */}
            <path
                d="M32 84H68"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
            />

            {/* Status light */}
            <circle
                cx="50"
                cy="41"
                r="7"
                fill={color}
            />
        </svg>
    );
};

export default PanelStatusIcon;