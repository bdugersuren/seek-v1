import type { ReactNode } from "react";
import { Card, Text } from "@seek/ui";

export function RuntimeShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-muted-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-seek-4 py-seek-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Text className="text-lg font-bold text-primary">seek.mn Assessment</Text>
            <Text variant="muted" className="text-sm">
              High-concurrency quiz runtime
            </Text>
          </div>
          <div className="rounded-seek-md border border-border bg-muted-background px-seek-3 py-seek-2 text-sm font-semibold text-foreground">
            Runtime app
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-seek-4 py-seek-5">
        <div className="mb-seek-4">
          <h1 className="font-sans text-2xl font-bold text-foreground sm:text-3xl">
            {title}
          </h1>
          <Text variant="muted" className="mt-1">
            {subtitle}
          </Text>
        </div>
        {children}
      </div>
    </main>
  );
}

export function RuntimeNotice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "warning" | "danger";
  title: string;
  children: ReactNode;
}) {
  const toneClass = {
    info: "border-primary/30 bg-primary/5",
    success: "border-success bg-success-background",
    warning: "border-warning bg-warning-background",
    danger: "border-danger bg-danger-background",
  }[tone];

  return (
    <Card className={`border p-seek-4 ${toneClass}`}>
      <Text className="font-bold">{title}</Text>
      <div className="mt-1 text-sm text-muted-foreground">{children}</div>
    </Card>
  );
}
