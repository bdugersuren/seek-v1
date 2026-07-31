import React from "react";
import clsx from "clsx";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded bg-muted-background w-full h-4",
        className,
      )}
      {...props}
    />
  );
}
