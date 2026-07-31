import React from "react";
import clsx from "clsx";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "success" | "danger" | "warning" | "info";
  title?: string;
}

export function Alert({
  type = "info",
  title,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={clsx(
        "p-seek-4 rounded-seek-md border flex flex-col gap-seek-1 w-full",
        {
          "bg-success-background border-success text-success-foreground":
            type === "success",
          "bg-danger-background border-danger text-danger-foreground":
            type === "danger",
          "bg-warning-background border-warning text-warning-foreground":
            type === "warning",
          "bg-surface border-border text-foreground": type === "info",
        },
        className,
      )}
      {...props}
    >
      {title && <span className="font-sans font-bold text-sm">{title}</span>}
      <div className="font-sans text-sm">{children}</div>
    </div>
  );
}
