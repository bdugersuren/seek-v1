"use client";

import React from "react";
import { Input, Icons } from "@seek/ui";
import { RichEditor } from "../editor/RichEditor";
import type { EditorOption } from "../types";

interface TrueFalseBuilderProps {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
  totalPoints?: number;
}

/**
 * TrueFalseBuilder - Үнэн / Худал хариулттай асуултын хувилбарыг тохируулах компонент.
 * Энэ компонент нь Үнэн ба Худал гэсэн 2 сонголтын оноо болон тайлбар бичвэрийг удирдана.
 */
export function TrueFalseBuilder({
  options,
  onChange,
  totalPoints = 1,
}: TrueFalseBuilderProps) {
  const trueOpt = options[0] || { id: "A", label: "TRUE", content: "Үнэн", isCorrect: true, score: 1, matchValue: "" };
  const falseOpt = options[1] || { id: "B", label: "FALSE", content: "Худал", isCorrect: false, score: 0, matchValue: "" };

  const updateTrueOpt = (patch: Partial<EditorOption>) => {
    const nextScore = patch.score !== undefined ? patch.score : trueOpt.score;
    const nextIsCorrect = nextScore > 0;
    const finalValue = patch.value !== undefined ? patch.value : (patch.content !== undefined ? patch.content : trueOpt.value);
    const finalContent = patch.content !== undefined ? patch.content : (patch.value !== undefined ? patch.value : trueOpt.content);
    
    const nextTrue = { ...trueOpt, ...patch, value: finalValue, content: finalContent, isCorrect: nextIsCorrect, score: nextScore };
    const nextFalse = {
      ...falseOpt,
      isCorrect: !nextIsCorrect,
      score: nextIsCorrect ? (falseOpt.score > 0 ? 0 : falseOpt.score) : falseOpt.score,
    };
    
    if (!nextIsCorrect && nextFalse.score > 0) {
      nextFalse.isCorrect = true;
    }
    
    onChange([nextTrue, nextFalse]);
  };

  const updateFalseOpt = (patch: Partial<EditorOption>) => {
    const nextScore = patch.score !== undefined ? patch.score : falseOpt.score;
    const nextIsCorrect = nextScore > 0;
    const finalValue = patch.value !== undefined ? patch.value : (patch.content !== undefined ? patch.content : falseOpt.value);
    const finalContent = patch.content !== undefined ? patch.content : (patch.value !== undefined ? patch.value : falseOpt.content);
    
    const nextFalse = { ...falseOpt, ...patch, value: finalValue, content: finalContent, isCorrect: nextIsCorrect, score: nextScore };
    const nextTrue = {
      ...trueOpt,
      isCorrect: !nextIsCorrect,
      score: nextIsCorrect ? (trueOpt.score > 0 ? 0 : trueOpt.score) : trueOpt.score,
    };
    
    if (!nextIsCorrect && nextTrue.score > 0) {
      nextTrue.isCorrect = true;
    }
    
    onChange([nextTrue, nextFalse]);
  };

  return (
    <div className="grid gap-seek-4 md:grid-cols-2">
      {/* TRUE Option */}
      <div className={`rounded-seek-lg border overflow-hidden transition-all duration-200 shadow-seek-xs ${
        trueOpt.score > 0
          ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/15"
          : trueOpt.score < 0
          ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/15"
          : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/20"
      }`}>
        <div className="flex">
          <div className={`w-14 flex items-center justify-center font-bold text-xs tracking-wider flex-shrink-0 select-none ${
            trueOpt.score > 0 ? "bg-emerald-500 text-white" : trueOpt.score < 0 ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            ҮНЭН
          </div>
          <div className="flex-1 p-seek-4 space-y-seek-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-border rounded-seek-md px-2 h-9 w-28 shadow-seek-xs">
                <Icons.Ad />
                <Input
                  className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-xs font-semibold text-center"
                  type="number"
                  step="any"
                  value={trueOpt.score}
                  onChange={(e) => updateTrueOpt({ score: Number(e.target.value) })}
                />
              </div>
            </div>
            <RichEditor
              compact
              minHeight="4rem"
              value={trueOpt.content}
              placeholder="Үнэн хариултын тодотгол текст..."
              onChange={(content) => updateTrueOpt({ content })}
            />
          </div>
        </div>
      </div>

      {/* FALSE Option */}
      <div className={`rounded-seek-lg border overflow-hidden transition-all duration-200 shadow-seek-xs ${
        falseOpt.score > 0
          ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/15"
          : falseOpt.score < 0
          ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/15"
          : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/20"
      }`}>
        <div className="flex">
          <div className={`w-14 flex items-center justify-center font-bold text-xs tracking-wider flex-shrink-0 select-none ${
            falseOpt.score > 0 ? "bg-emerald-500 text-white" : falseOpt.score < 0 ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            ХУДАЛ
          </div>
          <div className="flex-1 p-seek-4 space-y-seek-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-border rounded-seek-md px-2 h-9 w-28 shadow-seek-xs">
                <Icons.Ad />
                <Input
                  className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-xs font-semibold text-center"
                  type="number"
                  step="any"
                  value={falseOpt.score}
                  onChange={(e) => updateFalseOpt({ score: Number(e.target.value) })}
                />
              </div>
            </div>
            <RichEditor
              compact
              minHeight="4rem"
              value={falseOpt.content}
              placeholder="Худал хариултын тодотгол текст..."
              onChange={(content) => updateFalseOpt({ content })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
