"use client";

import React from "react";
import { Button, Input, Badge } from "@seek/ui";
import type { EditorOption } from "../types";

interface LikertBuilderProps {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}

/**
 * LikertBuilder - Ликерт хэмжүүрийн 5 болон 7 түвшний сонголтуудыг тохируулах компонент.
 */
export function LikertBuilder({
  options,
  onChange,
}: LikertBuilderProps) {
  const setScale = (scaleCount: 5 | 7) => {
    if (scaleCount === 5) {
      onChange([
        { id: "likert_1", label: "1", content: "Огт зөвшөөрөхгүй", isCorrect: false, score: 1 },
        { id: "likert_2", label: "2", content: "Зөвшөөрөхгүй", isCorrect: false, score: 2 },
        { id: "likert_3", label: "3", content: "Саармаг", isCorrect: false, score: 3 },
        { id: "likert_4", label: "4", content: "Зөвшөөрч байна", isCorrect: false, score: 4 },
        { id: "likert_5", label: "5", content: "Бүрэн зөвшөөрч байна", isCorrect: false, score: 5 },
      ]);
    } else {
      onChange([
        { id: "likert_1", label: "1", content: "Огт үгүй", isCorrect: false, score: 1 },
        { id: "likert_2", label: "2", content: "Үгүй", isCorrect: false, score: 2 },
        { id: "likert_3", label: "3", content: "Бага зэрэг үгүй", isCorrect: false, score: 3 },
        { id: "likert_4", label: "4", content: "Саармаг", isCorrect: false, score: 4 },
        { id: "likert_5", label: "5", content: "Бага зэрэг тийм", isCorrect: false, score: 5 },
        { id: "likert_6", label: "6", content: "Тийм", isCorrect: false, score: 6 },
        { id: "likert_7", label: "7", content: "Бүрэн тийм", isCorrect: false, score: 7 },
      ]);
    }
  };

  const updateItem = (idx: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="flex items-center gap-seek-2">
        <span className="text-xs font-bold text-slate-700">Түвшний тоо:</span>
        <Button
          type="button"
          size="sm"
          variant={options.length === 5 ? "primary" : "outline"}
          onClick={() => setScale(5)}
          className="text-xs h-7"
        >
          5 түвшин
        </Button>
        <Button
          type="button"
          size="sm"
          variant={options.length === 7 ? "primary" : "outline"}
          onClick={() => setScale(7)}
          className="text-xs h-7"
        >
          7 түвшин
        </Button>
      </div>

      <div className="grid gap-seek-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {options.map((opt, idx) => (
          <div key={opt.id || idx} className="rounded-seek-md border border-border bg-white p-seek-3 space-y-2 shadow-seek-xs">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Түвшин {opt.label}</Badge>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500">Оноо:</span>
                <Input
                  type="number"
                  value={opt.score}
                  onChange={(e) => updateItem(idx, { score: Number(e.target.value) })}
                  className="w-12 h-6 text-center text-xs p-0"
                />
              </div>
            </div>
            <Input
              value={opt.content}
              onChange={(e) => updateItem(idx, { content: e.target.value })}
              className="text-xs"
              placeholder="Түвшний тайлбар"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
