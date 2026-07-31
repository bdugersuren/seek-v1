"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, options = [], children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={clsx(
          "font-sans w-full px-seek-4 py-seek-2 rounded-seek-md bg-surface text-foreground border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
          error
            ? "border-danger focus:ring-danger"
            : "border-border hover:border-border-hover focus:ring-primary",
          className,
        )}
        {...props}
      >
        {children}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  },
);

Select.displayName = "Select";
