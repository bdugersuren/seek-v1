import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const OneOption = ({ size, ...props }: IconProps) => (
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
  <path d="M21 10h2" />
  <path d="M21 14h2" />
  <path d="m3 17 2 2 4-4" />
  <path d="m3 7 2 2 4-4" />
  <path d="M12 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>
  
  </svg>
);
