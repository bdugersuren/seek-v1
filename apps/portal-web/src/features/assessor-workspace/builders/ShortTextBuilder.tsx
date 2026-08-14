"use client";

import React from "react";
import { Button, Input } from "@seek/ui";
import type { EditorOption } from "../types";

interface ShortTextBuilderProps {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}

/**
 * ShortTextBuilder - Богино хариулттай асуултын зөв түлхүүр үгсийг тохируулах компонент.
 * Түлхүүр үг бүрийн оноо болон тохирох хэлбэрийг (Exact, Contains, RegEx) тохируулна.
 */
export function ShortTextBuilder({
  options,
  onChange,
}: ShortTextBuilderProps) {
  const addKeyword = () => {
    onChange([
      ...options,
      {
        id: `st_${Date.now()}_${options.length + 1}`,
        label: `Хувилбар ${options.length + 1}`,
        content: "",
        isCorrect: true,
        score: 1,
        matchValue: "exact",
        acceptedValues: [],
      },
    ]);
  };

  const removeKeyword = (index: number) => {
    onChange(options.filter((_, idx) => idx !== index));
  };

  const updateKeyword = (index: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, idx) => (idx === index ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="space-y-seek-3">
        {options.map((opt, index) => (
          <div
            key={opt.id || index}
            className="rounded-seek-lg border border-slate-200 border-l-[5px] border-l-teal-500 bg-white p-seek-3 shadow-seek-xs space-y-seek-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900">Зөвшөөрөгдөх түлхүүр үг #{index + 1}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-50 border border-border rounded-seek-md px-2 h-8 w-28">
                  <span className="text-xs font-semibold text-slate-500">Оноо:</span>
                  <Input
                    type="number"
                    value={opt.score}
                    onChange={(e) => updateKeyword(index, { score: Number(e.target.value) })}
                    className="w-full border-0 bg-transparent p-0 text-center text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeKeyword(index)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="grid gap-seek-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  value={opt.content}
                  placeholder="Зөвшөөрөх үг / өгүүлбэр (жишээ нь: Улаанбаатар)..."
                  onChange={(e) => updateKeyword(index, { content: e.target.value })}
                />
              </div>
              <div>
                <select
                  value={opt.matchValue || "exact"}
                  onChange={(e) => updateKeyword(index, { matchValue: e.target.value })}
                  className="w-full rounded-seek-md border border-input bg-background px-seek-3 py-2 text-xs outline-none focus:border-primary"
                >
                  <option value="exact">Яг таарах (Exact Match)</option>
                  <option value="contains">Агуулсан байх (Contains)</option>
                  <option value="regex">RegEx илэрхийлэл</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addKeyword}>
        + Түлхүүр үг нэмэх
      </Button>
    </div>
  );
}
