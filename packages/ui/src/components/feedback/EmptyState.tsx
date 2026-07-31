import React from "react";
import clsx from "clsx";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center p-seek-8 text-center border border-dashed border-border rounded-seek-lg bg-surface gap-seek-4",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-seek-1">
        <Heading level={3}>{title}</Heading>
        <Text variant="muted">{description}</Text>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
