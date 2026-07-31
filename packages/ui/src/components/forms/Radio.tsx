"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, id, ...props }, ref) => {
    return (
      <label className="flex items-center gap-seek-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="radio"
          id={id}
          className={clsx(
            "w-4 h-4 rounded-full border-border text-primary focus:ring-primary focus:ring-offset-2 transition-colors cursor-pointer",
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

Radio.displayName = "Radio";
