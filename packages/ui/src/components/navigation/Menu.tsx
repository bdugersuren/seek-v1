"use client";

import React from "react";
import clsx from "clsx";

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
}

export interface MenuProps {
  items: MenuItem[];
  className?: string;
}

/**
 * Menu Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - WAI-ARIA role="navigation" context
 * - Screen reader friendly link announcements
 * - Focus ring indicator styles
 */
export function Menu({ items, className }: MenuProps) {
  return (
    <nav className={clsx("flex flex-col gap-seek-1 w-full", className)}>
      {items.map((item) => (
        <a
          key={item.id}
          href={item.href || "#"}
          className={clsx(
            "px-seek-4 py-seek-2 rounded-seek-md text-sm font-medium transition-colors select-none",
            item.active
              ? "bg-primary text-primary-foreground"
              : "text-foreground hover:bg-surface-hover",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
