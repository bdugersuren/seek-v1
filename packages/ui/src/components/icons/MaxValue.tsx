import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MaxValue = ({ size, ...props }: IconProps) => (
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
    <path d="M3 3v16"/>
    <path d="M3 11h16"/>
    <path d="M3 11 8 8 11 9 18 3 16 7" />
    <path d="M16 7 18 3 14 4" />
    <path d="M8 4 h4" />
    <path d="M10 2 v4" />
  </svg>
);
