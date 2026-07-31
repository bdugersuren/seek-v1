"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, id, checked, onChange, ...props }, ref) => {
    return (
      <label
        className={clsx(
          "flex items-center gap-seek-2 cursor-pointer select-none",
          className,
        )}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="sr-only peer"
            {...props}
          />
          <div className="w-10 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-seek-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
        </div>
        {label && (
          <span className="font-sans text-sm text-foreground">{label}</span>
        )}
      </label>
    );
  },
);

Switch.displayName = "Switch";
