import React from "react";
import clsx from "clsx";

type CodeProps = React.HTMLAttributes<HTMLElement>;

export function Code({ className, children, ...props }: CodeProps) {
  return (
    <code
      className={clsx(
        "font-mono text-sm px-1.5 py-0.5 rounded bg-muted-background text-foreground border border-border",
        className,
      )}
      {...props}
    >
      {children}
    </code>
  );
}
