import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MinValue = ({ size, ...props }: IconProps) => (
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
    <path d="M3 11 8 14 11 13 18 19" />
    <path d="M16 14 18 19 14 19" />
    <path d="M9 4 h4" />
  </svg>
);
