import React from "react";
import clsx from "clsx";
import { Heading } from "../typography/Heading";
import { Text } from "../typography/Text";

interface PageTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageTitle({ title, subtitle, className }: PageTitleProps) {
  return (
    <div className={clsx("flex flex-col gap-seek-1", className)}>
      <Heading level={1}>{title}</Heading>
      {subtitle && <Text variant="muted">{subtitle}</Text>}
    </div>
  );
}
