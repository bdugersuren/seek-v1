import React from "react";
import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "warning";
}

export function Badge({
  variant = "primary",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded-seek-full text-xs font-medium font-sans select-none",
        {
          "bg-primary text-primary-foreground": variant === "primary",
          "bg-muted-background text-foreground": variant === "secondary",
          "bg-success-background text-success-foreground border border-success":
            variant === "success",
          "bg-danger-background text-danger-foreground border border-danger":
            variant === "danger",
          "bg-warning-background text-warning-foreground border border-warning":
            variant === "warning",
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
