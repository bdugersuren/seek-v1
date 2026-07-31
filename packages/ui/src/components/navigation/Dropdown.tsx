"use client";

import React, { useState } from "react";
import clsx from "clsx";

interface DropdownItem {
  id: string;
  label: string;
  onClick?: () => void;
}

export interface DropdownProps {
  label: string;
  items: DropdownItem[];
  className?: string;
}

/**
 * Dropdown Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Keyboard navigation (Up/Down arrow keys)
 * - Enter/Space to select item
 * - Escape key to close menu
 * - Focus management on open/close
 */
export function Dropdown({ label, items, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={clsx("relative inline-block text-left", className)}>
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          padding: "var(--seek-space-2) var(--seek-space-4)",
          borderRadius: "var(--seek-radius-md)",
          border: "1px solid var(--seek-color-border)",
          backgroundColor: "var(--seek-color-surface)",
          color: "var(--seek-color-foreground)",
          cursor: "pointer",
        }}
      >
        {label}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label={label}
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            zIndex: "var(--seek-z-dropdown)",
            backgroundColor: "var(--seek-color-surface)",
            border: "1px solid var(--seek-color-border)",
            borderRadius: "var(--seek-radius-md)",
            boxShadow: "var(--seek-shadow-md)",
            marginTop: "var(--seek-space-1)",
            minWidth: "160px",
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              style={{
                width: "100%",
                padding: "var(--seek-space-2) var(--seek-space-4)",
                textAlign: "left",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--seek-color-foreground)",
              }}
              className="hover:bg-surface-hover"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
