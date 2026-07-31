import React from "react";
import clsx from "clsx";

type SidebarProps = React.HTMLAttributes<HTMLElement>;

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <aside
      className={clsx(
        "hidden md:flex w-64 bg-surface border-r border-border h-screen sticky top-16 flex-col p-seek-4 gap-seek-2",
        className,
      )}
      {...props}
    >
      {children}
    </aside>
  );
}
