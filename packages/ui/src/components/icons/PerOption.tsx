import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const PerOption = ({ size, ...props }: IconProps) => (
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
    <path d="M22 8.9V7H16l4 5-4 5h6v-1.9"/>

  <path d="m3 17 2 2 4-4" />
  <path d="m3 7 2 2 4-4" />
  
  </svg>
);
