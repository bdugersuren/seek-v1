import React from "react";
import clsx from "clsx";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Алдаа гарлаа",
  message,
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-seek-8 text-center border border-danger bg-danger-background rounded-seek-lg gap-seek-4",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-seek-1">
        <Heading level={3} className="text-danger">
          {title}
        </Heading>
        <Text className="text-danger-foreground">{message}</Text>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "var(--seek-space-2) var(--seek-space-4)",
            borderRadius: "var(--seek-radius-md)",
            backgroundColor: "var(--seek-color-danger)",
            color: "var(--seek-color-primary-foreground)",
            border: "none",
            cursor: "pointer",
          }}
        >
          Дахин оролдох
        </button>
      )}
    </div>
  );
}
