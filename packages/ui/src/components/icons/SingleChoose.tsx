import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const SingleChoose = ({ size, ...props }: IconProps) => (
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
    <circle cx="6" cy="6" r="3" />

    <path d="M13 6h10" />
    <path d="M13 18h10" />

    <path d="M10 15 L6 19 L3 16" />
  </svg>
);
