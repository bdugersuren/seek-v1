import React from "react";
import clsx from "clsx";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({ required, className, children, ...props }: LabelProps) {
  return (
    <label
      className={clsx(
        "font-sans text-sm font-medium text-foreground select-none flex items-center gap-1",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
