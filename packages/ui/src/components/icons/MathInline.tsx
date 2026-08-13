import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const MathInline = ({ size, ...props }: IconProps) => (
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
    <path d="M7 12h2l2 5 2-10h4"/><rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);
