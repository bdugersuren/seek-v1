"use client";

import React from "react";
import { Button, Input } from "@seek/ui";
import { RichEditor } from "../editor/RichEditor";
import type { EditorOption } from "../types";

interface OrderingBuilderProps {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}

/**
 * OrderingBuilder - Эрэмбэлэх даалгаврын алхмуудыг тохируулах компонент.
 * Алхмуудын дарааллыг дээш, доош зөөх, алхам нэмэх/хасах боломжтой.
 */
export function OrderingBuilder({
  options,
  onChange,
}: OrderingBuilderProps) {
  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === options.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const nextOptions = [...options];
    const temp = nextOptions[index];
    nextOptions[index] = nextOptions[targetIndex];
    nextOptions[targetIndex] = temp;
    onChange(nextOptions.map((o, idx) => ({ ...o, label: String(idx + 1) })));
  };

  const addStep = () => {
    const nextIndex = options.length + 1;
    onChange([
      ...options,
      {
        id: `ord_${Date.now()}_${nextIndex}`,
        label: String(nextIndex),
        content: "",
        isCorrect: true,
        score: 1,
        matchValue: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    if (options.length <= 2) return;
    onChange(
      options
        .filter((_, idx) => idx !== index)
        .map((o, idx) => ({ ...o, label: String(idx + 1) }))
    );
  };

  const updateStep = (index: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, idx) => (idx === index ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="space-y-seek-3">
        {options.map((option, index) => (
          <div
            key={option.id || index}
            className="rounded-seek-lg border border-slate-200 border-l-[5px] border-l-amber-500 bg-white overflow-hidden shadow-seek-xs transition-all"
          >
            <div className="flex">
              <div className="w-12 flex items-center justify-center font-bold text-base text-white bg-amber-500 flex-shrink-0 select-none">
                {index + 1}
              </div>
              <div className="flex-1 p-seek-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-900">Алхам {index + 1}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveItem(index, "up")}
                      className="h-7 w-7 p-0 text-xs"
                      title="Дээш зөөх"
                    >
                      ▲
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={index === options.length - 1}
                      onClick={() => moveItem(index, "down")}
                      className="h-7 w-7 p-0 text-xs"
                      title="Доош зөөх"
                    >
                      ▼
                    </Button>
                    <div className="flex items-center gap-1 bg-slate-50 border border-border rounded-seek-md px-1.5 h-7 w-24">
                      <span className="text-[10px] font-semibold text-slate-500">Оноо:</span>
                      <Input
                        className="w-full border-0 bg-transparent p-0 text-center text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        type="number"
                        value={option.score}
                        onChange={(e) => updateStep(index, { score: Number(e.target.value) })}
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeStep(index)}
                        className="h-7 w-7 p-0 text-xs"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
                <RichEditor
                  compact
                  minHeight="3.5rem"
                  value={option.content}
                  placeholder={`Алхам ${index + 1}-ийн агуулгыг оруулна уу...`}
                  onChange={(content) => updateStep(index, { content })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addStep} className="flex items-center gap-2">
        <span>+ Шинэ алхам нэмэх</span>
      </Button>
    </div>
  );
}
