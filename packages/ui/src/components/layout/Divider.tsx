import React from "react";
import clsx from "clsx";

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export function Divider({
  orientation = "horizontal",
  className,
  ...props
}: DividerProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={clsx(
        "bg-border",
        {
          "h-[1px] w-full": orientation === "horizontal",
          "w-[1px] h-full self-stretch": orientation === "vertical",
        },
        className,
      )}
      {...props}
    />
  );
}
