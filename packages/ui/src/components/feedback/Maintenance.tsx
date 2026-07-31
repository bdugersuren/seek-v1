import React from "react";
import clsx from "clsx";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

export interface MaintenanceProps {
  className?: string;
}

/**
 * Maintenance Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Proper heading hierarchy (H1 primary announcement)
 * - Contrast checks for dark/light themes
 */
export function Maintenance({ className }: MaintenanceProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-seek-8 text-center min-h-screen bg-background gap-seek-4",
        className,
      )}
    >
      <div className="flex flex-col gap-seek-2 max-w-md">
        <Heading level={1}>Засвар үйлчилгээтэй байна</Heading>
        <Text variant="muted">
          Платформыг илүү сайжруулахын тулд түр хугацаанд засвар үйлчилгээ хийж
          байна. Түр хүлээнэ үү.
        </Text>
      </div>
    </div>
  );
}
