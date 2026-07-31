import React from "react";
import clsx from "clsx";

interface SurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2;
}

export function Surface({
  level = 1,
  className,
  children,
  ...props
}: SurfaceProps) {
  return (
    <div
      className={clsx(
        "rounded-seek-md text-foreground",
        {
          "bg-background": level === 0,
          "bg-surface border border-border": level === 1,
          "bg-surface border border-border shadow-seek-md": level === 2,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
