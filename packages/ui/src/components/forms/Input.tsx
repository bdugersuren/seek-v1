"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          "font-sans w-full px-seek-4 py-seek-2 rounded-seek-md bg-surface text-foreground border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          error
            ? "border-danger focus:ring-danger"
            : "border-border hover:border-border-hover focus:ring-primary",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
