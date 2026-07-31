"use client";

import type { ReactNode } from "react";
import { Badge, Card, Checkbox, Icons, Text } from "@seek/ui";

export interface ExplorerTopicNode {
  id: string;
  label: string;
  count?: number;
  children?: ExplorerTopicNode[];
}

export function WorkspaceFilterSection({
  title,
  subtitle,
  selectedCount,
  open = true,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  selectedCount?: number;
  open?: boolean;
  onToggle?: () => void;
  children: ReactNode;
}) {
  const explorerHeader = Boolean(subtitle);
  const headerClassName = explorerHeader
    ? "mb-seek-3 flex w-full items-start justify-between gap-2 border-b border-border pb-seek-3 text-left"
    : "mb-seek-3 flex w-full items-center justify-between gap-2 text-left";
  const headerContent = (
    <>
      <div>
        <Text
          className={
            explorerHeader
              ? "text-lg font-bold"
              : "text-xs font-bold uppercase text-muted-foreground"
          }
        >
          {title}
        </Text>
        {subtitle && (
          <Text variant="muted" className="mt-1 text-sm">
            {subtitle}
          </Text>
        )}
      </div>
      <span className="flex shrink-0 items-center gap-2">
        {Boolean(selectedCount) &&
          (explorerHeader ? (
            <span className="grid h-7 min-w-7 place-items-center rounded-seek-sm bg-muted-background px-2 text-sm font-bold text-foreground">
              {selectedCount}
            </span>
          ) : (
            <Badge variant="secondary">{selectedCount}</Badge>
          ))}
        {onToggle && (
          <Icons.ChevronRight
            className={`${explorerHeader ? "mt-1" : ""} h-4 w-4 text-muted-foreground transition-transform ${
              open ? "rotate-90" : ""
            }`}
          />
        )}
      </span>
    </>
  );

  return (
    <section className="border-t border-border py-seek-3 first:border-t-0 first:pt-0">
      {onToggle ? (
        <button type="button" className={headerClassName} onClick={onToggle}>
          {headerContent}
        </button>
      ) : (
        <div className={headerClassName}>{headerContent}</div>
      )}
      {open && <div className="space-y-2">{children}</div>}
    </section>
  );
}

export function ExplorerTopicTree({
  nodes,
  selectedIds,
  openIds,
  onToggle,
  onToggleOpen,
  depth = 0,
}: {
  nodes: ExplorerTopicNode[];
  selectedIds: string[];
  openIds: string[];
  onToggle: (id: string) => void;
  onToggleOpen: (id: string) => void;
  depth?: number;
}) {
  return (
    <div className="space-y-1">
      {nodes.map((node) => {
        const open = openIds.includes(node.id);
        const selected = selectedIds.includes(node.id);
        return (
          <div key={node.id}>
            <div
              className={`grid grid-cols-[1.25rem_1.25rem_1.1rem_minmax(0,1fr)_auto] items-center gap-1 rounded-seek-sm px-2 py-1.5 text-sm text-foreground hover:bg-surface-hover ${
                selected ? "bg-primary/10 text-primary" : ""
              }`}
              style={{ paddingLeft: depth * 16 + 8 }}
            >
              {node.children ? (
                <button
                  type="button"
                  className="grid h-5 w-5 place-items-center rounded-seek-sm text-muted-foreground hover:bg-muted-background"
                  onClick={() => onToggleOpen(node.id)}
                  aria-label={`${node.label} ${open ? "хураах" : "нээх"}`}
                >
                  <Icons.ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      open ? "rotate-90" : ""
                    }`}
                  />
                </button>
              ) : (
                <span />
              )}
              <label className="grid h-5 w-5 place-items-center">
                <Checkbox
                  checked={selected}
                  onChange={() => onToggle(node.id)}
                  aria-label={`${node.label} сонгох`}
                />
              </label>
              <span aria-hidden="true" className="text-amber-500">
                ▣
              </span>
              <button
                type="button"
                className="min-w-0 truncate text-left"
                onClick={() =>
                  node.children ? onToggleOpen(node.id) : onToggle(node.id)
                }
                title={node.label}
              >
                {node.label}
              </button>
              <span className="text-xs text-muted-foreground">
                {node.count ? node.count : ""}
              </span>
            </div>
            {node.children && open && (
              <ExplorerTopicTree
                nodes={node.children}
                selectedIds={selectedIds}
                openIds={openIds}
                onToggle={onToggle}
                onToggleOpen={onToggleOpen}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DataViewToggle<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-seek-md border border-border bg-muted-background p-1">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`rounded-seek-sm px-seek-3 py-seek-1.5 text-sm font-semibold ${
            value === option.value
              ? "bg-surface text-primary shadow-seek-sm"
              : "text-muted-foreground"
          }`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  if (accent) {
    return (
      <Card className="flex items-center justify-between p-seek-4">
        <div>
          <Text variant="muted" className="text-sm">
            {label}
          </Text>
          <Text className="mt-1 text-3xl font-bold">{value}</Text>
        </div>
        <span className={`h-10 w-2 rounded-seek-full ${accent}`} />
      </Card>
    );
  }

  return (
    <div className="rounded-seek-md bg-muted-background p-seek-3">
      <Text variant="muted" className="text-xs">
        {label}
      </Text>
      <Text className="text-xl font-bold">{value}</Text>
    </div>
  );
}

export function buildTopicDescendantMap(nodes: ExplorerTopicNode[]) {
  const map: Record<string, string[]> = {};
  const walk = (node: ExplorerTopicNode): string[] => {
    const children = node.children?.flatMap(walk) ?? [];
    map[node.id] = children;
    return [node.id, ...children];
  };
  nodes.forEach(walk);
  return map;
}
