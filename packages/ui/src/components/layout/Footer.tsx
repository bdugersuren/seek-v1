import React from "react";
import clsx from "clsx";

type FooterProps = React.HTMLAttributes<HTMLElement>;

export function Footer({ className, ...props }: FooterProps) {
  return (
    <footer
      className={clsx(
        "w-full py-seek-6 bg-surface border-t border-border flex items-center justify-center text-sm text-muted",
        className,
      )}
      {...props}
    >
      <div className="seek-container text-center">
        &copy; {new Date().getFullYear()} seek.mn платформыг vibe coding аргаар
        хөгжүүлэв.
      </div>
    </footer>
  );
}
