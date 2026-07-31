import React from "react";
import clsx from "clsx";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-surface text-foreground border border-border rounded-seek-lg p-seek-6 shadow-seek-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
