"use client";

import React from "react";
import clsx from "clsx";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  className?: string;
}

/**
 * Pagination Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Next/Prev buttons must have accessible names if they are icons
 * - Active page should have aria-current="page"
 * - Navigation container should have aria-label="Pagination"
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={clsx("flex items-center gap-seek-2", className)}
    >
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{
          padding: "var(--seek-space-2) var(--seek-space-4)",
          borderRadius: "var(--seek-radius-md)",
          border: "1px solid var(--seek-color-border)",
          cursor: "pointer",
        }}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Өмнөх
      </button>
      <span className="font-sans text-sm text-foreground">
        Хуудас {currentPage} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{
          padding: "var(--seek-space-2) var(--seek-space-4)",
          borderRadius: "var(--seek-radius-md)",
          border: "1px solid var(--seek-color-border)",
          cursor: "pointer",
        }}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Дараах
      </button>
    </nav>
  );
}
