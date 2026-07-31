"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = "primary", size = "md", className, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "font-sans font-medium inline-flex items-center justify-center transition-colors duration-seek-fast ease-seek-default rounded-seek-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none",
          {
            "bg-primary text-primary-foreground hover:bg-primary-hover":
              variant === "primary",
            "bg-surface text-foreground hover:bg-surface-hover border border-border":
              variant === "secondary",
            "bg-transparent text-foreground hover:bg-surface-hover border border-border":
              variant === "outline",
            "bg-danger text-primary-foreground hover:bg-danger-hover":
              variant === "danger",
            "px-seek-3 py-seek-1.5 text-sm": size === "sm",
            "px-seek-4 py-seek-2 text-base": size === "md",
            "px-seek-6 py-seek-3 text-lg": size === "lg",
          },
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
