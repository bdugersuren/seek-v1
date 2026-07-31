import React from "react";
import clsx from "clsx";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export function Spinner({ size = "md", className, ...props }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-label="Уншиж байна"
      className={clsx(
        "animate-spin rounded-full border-2 border-border border-t-primary",
        {
          "w-4 h-4": size === "sm",
          "w-8 h-8": size === "md",
          "w-12 h-12": size === "lg",
        },
        className,
      )}
      {...props}
    >
      <span className="sr-only">Уншиж байна...</span>
    </div>
  );
}
