import React from "react";
import clsx from "clsx";

type ContentContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function ContentContainer({
  className,
  children,
  ...props
}: ContentContainerProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-4xl mx-auto flex flex-col gap-seek-4",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
