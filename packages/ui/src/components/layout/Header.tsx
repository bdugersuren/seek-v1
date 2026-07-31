import React from "react";
import clsx from "clsx";

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  actions?: React.ReactNode;
}

export function Header({ logo, actions, className, ...props }: HeaderProps) {
  return (
    <header
      className={clsx(
        "sticky top-0 z-header w-full h-16 bg-surface border-b border-border flex items-center justify-between px-seek-6 shadow-seek-sm",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-seek-4">
        {logo || (
          <span className="font-sans font-bold text-lg text-primary">
            seek.mn
          </span>
        )}
      </div>
      {actions && <div className="flex items-center gap-seek-3">{actions}</div>}
    </header>
  );
}
