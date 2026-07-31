import React from "react";
import clsx from "clsx";

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function PageContainer({
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={clsx(
        "seek-container py-seek-6 md:py-seek-8 flex flex-col gap-seek-6 min-h-screen",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
