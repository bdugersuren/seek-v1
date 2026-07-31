import React from "react";
import clsx from "clsx";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 12;
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
}

export function Grid({
  cols = 1,
  gap = 4,
  className,
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={clsx(
        "grid",
        {
          "grid-cols-1": cols === 1,
          "grid-cols-2": cols === 2,
          "grid-cols-3": cols === 3,
          "grid-cols-4": cols === 4,
          "grid-cols-12": cols === 12,
          "gap-seek-1": gap === 1,
          "gap-seek-2": gap === 2,
          "gap-seek-3": gap === 3,
          "gap-seek-4": gap === 4,
          "gap-seek-5": gap === 5,
          "gap-seek-6": gap === 6,
          "gap-seek-8": gap === 8,
        },
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
