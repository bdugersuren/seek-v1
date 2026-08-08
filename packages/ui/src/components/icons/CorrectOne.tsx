import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const CorrectOne = ({ size, ...props }: IconProps) => (
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

  <circle cx="6" cy="7" r="3" />
  <circle cx="6" cy="7" r="0.2"/>
  <circle cx="6" cy="18" r="3" />
  
  <path d="M21 10h2" />
  <path d="M21 14h2" />

  {/* <path d="M21 7v6h-6"/> */}
  {/* <path d="M8 12a9 9 0 0 0 9 9"/> */}
  <path d="M10 10a9 9 0 0 0 7 2" />
  <path d="M14 10 17 12 14 13.8" />
  
  </svg>
);
