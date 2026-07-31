import React from "react";
import clsx from "clsx";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

export interface NotFoundProps {
  className?: string;
  backHref?: string;
}

/**
 * NotFound Placeholder Component
 *
 * Future Implementation Status: DEFERRED TO SPRINT 4
 * Accessibility Expectation:
 * - Direct keyboard back navigation link
 * - H1 primary announcement context
 */
export function NotFound({ className, backHref = "/" }: NotFoundProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-seek-8 text-center min-h-[400px] bg-background gap-seek-4",
        className,
      )}
    >
      <div className="flex flex-col gap-seek-2 max-w-md">
        <Heading level={1}>Хуудас олдсонгүй</Heading>
        <Text variant="muted">
          Таны хандсан хуудас олдсонгүй эсвэл шилжсэн байна.
        </Text>
      </div>
      <a
        href={backHref}
        style={{
          padding: "var(--seek-space-2) var(--seek-space-4)",
          borderRadius: "var(--seek-radius-md)",
          backgroundColor: "var(--seek-color-primary)",
          color: "var(--seek-color-primary-foreground)",
          textDecoration: "none",
          fontWeight: "medium",
        }}
      >
        Нүүр хуудас руу буцах
      </a>
    </div>
  );
}
