import React from "react";
import clsx from "clsx";
import { Spinner } from "./Spinner";

export interface LoadingOverlayProps {
  visible: boolean;
  className?: string;
}

/**
 * LoadingOverlay Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Focus trapping on active overlay
 * - aria-hidden on background content
 * - Keyboard escape to dismiss (where applicable)
 */
export function LoadingOverlay({ visible, className }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuetext="Уншиж байна"
      className={clsx(
        "fixed inset-0 z-modal bg-black/50 flex items-center justify-center backdrop-blur-sm",
        className,
      )}
    >
      <Spinner size="lg" />
    </div>
  );
}
