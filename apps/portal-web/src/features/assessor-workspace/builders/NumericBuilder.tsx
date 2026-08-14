"use client";

import React from "react";
import { Input } from "@seek/ui";
import type { EditorOption } from "../types";

interface NumericBuilderProps {
  option: EditorOption;
  onChange: (opt: EditorOption) => void;
  totalPoints?: number;
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

/**
 * NumericBuilder - Тоон хариулттай асуултын зөв хариулт, хүлцэх алдаа ба оноог тохируулах компонент.
 */
export function NumericBuilder({
  option,
  onChange,
  totalPoints = 1,
}: NumericBuilderProps) {
  return (
    <div className="space-y-seek-4">
      <div className="grid gap-seek-4 md:grid-cols-3">
        <FieldLabel label="Зөв тоон хариулт">
          <Input
            type="number"
            step="any"
            placeholder="Жишээ нь: 12.5"
            value={option?.content || ""}
            onChange={(e) =>
              onChange({
                id: option?.id || "num-ans",
                label: "Хариулт",
                content: e.target.value,
                isCorrect: true,
                score: option?.score !== undefined ? option.score : totalPoints,
                matchValue: option?.matchValue || "0",
              })
            }
          />
        </FieldLabel>
        <FieldLabel label="Хүлцэх алдаа (Tolerance ±)">
          <Input
            type="number"
            step="any"
            placeholder="Жишээ нь: 0.1"
            value={option?.matchValue || ""}
            onChange={(e) =>
              onChange({
                id: option?.id || "num-ans",
                label: "Хариулт",
                content: option?.content || "",
                isCorrect: true,
                score: option?.score !== undefined ? option.score : totalPoints,
                matchValue: e.target.value,
              })
            }
          />
        </FieldLabel>
        <FieldLabel label="Авах дээд оноо">
          <Input
            type="number"
            step="any"
            value={option?.score !== undefined ? option.score : totalPoints}
            onChange={(e) =>
              onChange({
                id: option?.id || "num-ans",
                label: "Хариулт",
                content: option?.content || "",
                isCorrect: true,
                score: Number(e.target.value),
                matchValue: option?.matchValue || "0",
              })
            }
          />
        </FieldLabel>
      </div>
    </div>
  );
}
