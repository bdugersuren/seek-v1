import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const Sjt = ({ size, ...props }: IconProps) => (
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
    <circle cx="3" cy="12" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="21" cy="12" r="2" />
    <path d="M19 8 L15 14 L13 12" />
  </svg>
);
