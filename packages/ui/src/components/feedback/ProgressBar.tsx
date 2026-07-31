import React from "react";
import clsx from "clsx";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
}

export function ProgressBar({
  value,
  max = 100,
  className,
  ...props
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      className={clsx(
        "w-full h-2 bg-muted-background rounded-seek-full overflow-hidden",
        className,
      )}
      {...props}
    >
      <div
        className="h-full bg-primary transition-all duration-seek-normal ease-seek-default"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
