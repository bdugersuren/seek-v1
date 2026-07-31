import React from "react";
import clsx from "clsx";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Heading({
  level = 2,
  className,
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  // Custom styled classes based on our prefix variables
  const headingClass = clsx(
    "font-sans font-bold text-foreground",
    {
      "text-4xl": level === 1,
      "text-3xl": level === 2,
      "text-2xl": level === 3,
      "text-xl": level === 4,
      "text-lg": level === 5,
      "text-base": level === 6,
    },
    className,
  );

  return (
    <Tag className={headingClass} {...props}>
      {children}
    </Tag>
  );
}
