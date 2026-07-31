"use client";

import React from "react";
import clsx from "clsx";

interface Step {
  id: string;
  label: string;
}

export interface StepIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
  className?: string;
}

/**
 * StepIndicator Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - WAI-ARIA status/progress role context
 * - Visual contrast for current vs upcoming steps
 * - Hidden helper text for screen readers (e.g., "Алхам 1/3")
 */
export function StepIndicator({
  steps,
  currentStepIndex,
  className,
}: StepIndicatorProps) {
  return (
    <div className={clsx("flex items-center gap-seek-4 w-full", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div key={step.id} className="flex items-center gap-seek-2">
            <span
              className={clsx(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono border",
                {
                  "bg-primary text-primary-foreground border-primary":
                    isCurrent || isCompleted,
                  "bg-surface text-muted border-border":
                    !isCurrent && !isCompleted,
                },
              )}
            >
              {index + 1}
            </span>
            <span
              className={clsx("text-sm font-sans", {
                "text-foreground font-semibold": isCurrent,
                "text-muted": !isCurrent,
              })}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
