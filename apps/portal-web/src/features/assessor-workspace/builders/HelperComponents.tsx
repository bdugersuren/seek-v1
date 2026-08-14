"use client";

import React, { useState } from "react";
import { Card, Text, Icons } from "@seek/ui";

interface FieldLabelProps {
  label: string;
  children: React.ReactNode;
}

export function FieldLabel({ label, children }: FieldLabelProps) {
  return (
    <label className="block">
      <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">
        {label}
      </Text>
      {children}
    </label>
  );
}

interface CollapsibleCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  defaultExpanded?: boolean;
}

/**
 * CollapsibleCard - Windows цонхтой ижил төстэй саарал толгойтой, 
 * баруун талын Chevron toggle товчлуураар нээгдэж хаагддаг collapsible карт компонент.
 */
export function CollapsibleCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  headerActions,
  defaultExpanded = true,
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`overflow-hidden border border-border shadow-seek-sm p-0 ${className}`}>
      {/* Header with gray background */}
      <div
        className="flex items-center justify-between bg-slate-50 px-seek-5 py-seek-2 border-b border-border select-none"
      >
        <div className="flex items-center gap-seek-3">
          {Icon && (
            <div className="rounded-seek-md bg-white p-1 text-primary border border-border shadow-seek-sm flex items-center justify-center">
              <Icon className="h-4 w-4 stroke-[1.8]" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <Text className="font-bold text-slate-800 text-sm leading-tight">{title}</Text>
            {subtitle && (
              <Text variant="muted" className="text-[11px] leading-none mt-0.5">
                {subtitle}
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center gap-seek-3">
          {headerActions}
          <button
            type="button"
            className="rounded-full p-seek-1 text-slate-500 hover:bg-slate-200 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icons.ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-seek-4 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </Card>
  );
}

export function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="flex items-start gap-seek-3">
      {Icon && (
        <div className="mt-0.5 rounded-seek-md bg-primary/5 p-seek-1.5 text-primary">
          <Icon className="h-4 w-4 stroke-[1.8]" />
        </div>
      )}
      <div>
        <Text className="font-semibold text-slate-800">{title}</Text>
        {subtitle && (
          <Text variant="muted" className="text-sm">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
}

export function CollapsibleTitle({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-seek-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground stroke-[1.8]" />}
        <Text className="text-sm font-bold uppercase text-muted-foreground">{title}</Text>
      </div>
      <Icons.ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
    </div>
  );
}

export function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-seek-lg border border-border bg-muted-background p-seek-4">
      <Text variant="muted" className="text-xs uppercase">
        {label}
      </Text>
      <Text className="mt-1 font-bold">{value}</Text>
    </div>
  );
}
