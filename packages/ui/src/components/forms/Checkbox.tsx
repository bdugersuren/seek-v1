"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label className="flex items-center gap-seek-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          id={id}
          className={clsx(
            "w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer",
            className,
          )}
          {...props}
        />
        {label && (
          <span className="font-sans text-sm text-foreground">{label}</span>
        )}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
