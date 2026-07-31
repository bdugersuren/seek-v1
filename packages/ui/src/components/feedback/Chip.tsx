import React from "react";
import clsx from "clsx";

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
}

export function Chip({ onRemove, className, children, ...props }: ChipProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-seek-1.5 px-seek-2.5 py-seek-1 rounded-seek-full bg-muted-background text-sm text-foreground font-sans select-none border border-border",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          aria-label="Remove"
          className="hover:text-danger text-muted flex items-center justify-center p-0.5 rounded-full"
        >
          &times;
        </button>
      )}
    </span>
  );
}
