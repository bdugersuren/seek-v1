import React from "react";
import clsx from "clsx";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "column";
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16;
  align?: "stretch" | "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

export function Stack({
  direction = "column",
  gap = 4,
  align = "stretch",
  justify = "start",
  className,
  children,
  ...props
}: StackProps) {
  return (
    <div
      className={clsx(
        "display flex",
        {
          "flex-col": direction === "column",
          "flex-row": direction === "row",
          "gap-seek-1": gap === 1,
          "gap-seek-2": gap === 2,
          "gap-seek-3": gap === 3,
          "gap-seek-4": gap === 4,
          "gap-seek-5": gap === 5,
          "gap-seek-6": gap === 6,
          "gap-seek-8": gap === 8,
          "gap-seek-10": gap === 10,
          "gap-seek-12": gap === 12,
          "gap-seek-16": gap === 16,
          "items-stretch": align === "stretch",
          "items-start": align === "start",
          "items-center": align === "center",
          "items-end": align === "end",
          "items-baseline": align === "baseline",
          "justify-start": justify === "start",
          "justify-center": justify === "center",
          "justify-end": justify === "end",
          "justify-between": justify === "between",
          "justify-around": justify === "around",
          "justify-evenly": justify === "evenly",
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
