import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
}

export const TrueFalse = ({ size, ...props }: IconProps) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        width={size ?? props.width ?? 24}
        height={size ?? props.height ?? 24}
        {...props}
    >
        <circle cx="15" cy="12" r="3" /><rect width="20" height="14" x="2" y="5" rx="7" />
    </svg>
);











