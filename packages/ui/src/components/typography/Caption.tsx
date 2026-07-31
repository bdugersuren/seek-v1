import React from "react";
import clsx from "clsx";

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  error?: boolean;
}

export function Caption({
  error,
  className,
  children,
  ...props
}: CaptionProps) {
  return (
    <span
      className={clsx(
        "font-sans text-xs",
        error ? "text-danger" : "text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
