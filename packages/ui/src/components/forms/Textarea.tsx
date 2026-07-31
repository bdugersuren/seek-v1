"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={clsx(
          "font-sans w-full px-seek-4 py-seek-2 rounded-seek-md bg-surface text-foreground border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px]",
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

Textarea.displayName = "Textarea";
