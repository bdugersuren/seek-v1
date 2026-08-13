import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CodeIcon = ({ size, ...props }: IconProps) => (
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
    <path d="m16 18 6-6-6-6"/>
    <path d="m8 6-6 6 6 6"/>

  </svg>
);
