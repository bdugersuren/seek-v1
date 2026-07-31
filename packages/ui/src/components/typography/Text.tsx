import React from "react";
import clsx from "clsx";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: "body" | "muted" | "lead";
}

export function Text({
  variant = "body",
  className,
  children,
  ...props
}: TextProps) {
  const textClass = clsx(
    "font-sans text-base",
    {
      "text-foreground": variant === "body",
      "text-muted": variant === "muted",
      "text-lg text-foreground font-medium": variant === "lead",
    },
    className,
  );

  return (
    <p className={textClass} {...props}>
      {children}
    </p>
  );
}
