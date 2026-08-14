"use client";

import React from "react";
import { Button, Input, Icons } from "@seek/ui";
import { RichEditor } from "../editor/RichEditor";
import type { EditorOption } from "../types";

interface SjtBuilderProps {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}

/**
 * SjtBuilder - Нөхцөлт даалгаврын (Situational Judgment) сонголтууд, 
 * үр дүнгийн түвшнүүд болон харгалзах оноог удирдах компонент.
 */
export function SjtBuilder({
  options,
  onChange,
}: SjtBuilderProps) {
  const effectivenessLevels = [
    { value: "best", label: "Хамгийн үр дүнтэй (+2 оноо)", defaultScore: 2 },
    { value: "effective", label: "Үр дүнтэй (+1 оноо)", defaultScore: 1 },
    { value: "neutral", label: "Саармаг (0 оноо)", defaultScore: 0 },
    { value: "ineffective", label: "Үр дүнгүй (-1 оноо)", defaultScore: -1 },
    { value: "counterproductive", label: "Сөрөг нөлөөтэй (-2 оноо)", defaultScore: -2 },
  ];

  const addOption = () => {
    const nextIdx = options.length + 1;
    onChange([
      ...options,
      {
        id: `sjt_${Date.now()}_${nextIdx}`,
        label: String.fromCharCode(64 + nextIdx),
        content: "",
        isCorrect: false,
        score: 1,
        matchValue: "effective",
      },
    ]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="space-y-seek-3">
        {options.map((opt, idx) => {
          const isPositive = opt.score > 0;
          const isNegative = opt.score < 0;
          return (
            <div
              key={opt.id || idx}
              className={`rounded-seek-lg border overflow-hidden shadow-seek-xs ${
                isPositive
                  ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/10"
                  : isNegative
                  ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/10"
                  : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/10"
              }`}
            >
              <div className="flex">
                <div className={`w-12 flex items-center justify-center font-bold text-base flex-shrink-0 select-none ${
                  isPositive ? "bg-emerald-500 text-white" : isNegative ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {opt.label || String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 p-seek-4 space-y-seek-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Үр дүнтэй байдлын түвшин:</span>
                      <select
                        value={opt.matchValue || "effective"}
                        onChange={(e) => {
                          const level = effectivenessLevels.find((l) => l.value === e.target.value);
                          updateOption(idx, {
                            matchValue: e.target.value,
                            score: level ? level.defaultScore : opt.score,
                          });
                        }}
                        className="rounded-seek-md border border-input bg-background px-seek-3 py-1.5 text-xs outline-none focus:border-primary"
                      >
                        {effectivenessLevels.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white border border-border rounded-seek-md px-2 h-8 w-24">
                        <Icons.Ad />
                        <Input
                          type="number"
                          value={opt.score}
                          onChange={(e) => updateOption(idx, { score: Number(e.target.value) })}
                          className="w-full border-0 bg-transparent p-0 text-center text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeOption(idx)}
                          className="h-8 w-8 p-0 text-xs"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                  <RichEditor
                    value={opt.content}
                    placeholder={`Нөхцөлт хариу үйлдэл / сонголт ${opt.label}-ийн агуулга...`}
                    onChange={(content) => updateOption(idx, { content })}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" onClick={addOption}>
        + Шинэ сонголт нэмэх
      </Button>
    </div>
  );
}
