import React from "react";
import clsx from "clsx";

type DisplayProps = React.HTMLAttributes<HTMLHeadingElement>;

export function Display({ className, children, ...props }: DisplayProps) {
  return (
    <h1
      className={clsx(
        "font-sans text-5xl md:text-6xl font-extrabold tracking-tight text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}
