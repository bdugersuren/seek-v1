"use client";

import React from "react";
import { Button, Input, Icons } from "@seek/ui";
import type { QuestionOption, RightMatchingOption } from "../types";

interface CombinationEntry {
  ids: string[];
  score: number;
}

// Оноо оруулах хэсгийг нэг стандартад оруулах туслах компонент
interface ScoreInputProps {
  score: number;
  onChange: (score: number) => void;
  className?: string;
}

function ScoreInput({ score, onChange, className = "w-32" }: ScoreInputProps) {
  const isPositive = score > 0;
  const isNegative = score < 0;
  
  return (
    <div className={`flex items-center gap-1 bg-slate-50 border rounded-seek-md px-2 h-10 ${className} ${
      isPositive ? "border-success/30" : isNegative ? "border-danger/30" : "border-border"
    }`}>
      <Icons.MaxValue className={`h-4 w-4 stroke-[1.8] flex-shrink-0 ${
        isPositive ? "text-success" : isNegative ? "text-danger" : "text-slate-400"
      }`} />
      <Input
        type="number"
        step="any"
        value={score}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm font-semibold text-center text-slate-700"
      />
    </div>
  );
}

// ==============================================================================================
// 1. CombinationMCBuilder - Олон сонголттой асуултын хувьд сонголтын хослолд оноо өгөх логик.
// ==============================================================================================

interface CombinationMCBuilderProps {
  options: QuestionOption[];
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
}

export function CombinationMCBuilder({
  options,
  combinations,
  onChange,
}: CombinationMCBuilderProps) {
  function addCombination() {
    onChange([...combinations, { ids: [], score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function isOptionSelected(comboIds: string[], opt: QuestionOption): boolean {
    if (!Array.isArray(comboIds)) return false;
    const cleanOptId = opt.id.trim().toUpperCase();
    return comboIds.some((id) => id.trim().toUpperCase() === cleanOptId);
  }

  function toggleOption(combIdx: number, opt: QuestionOption) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const comboIds = combo.ids || [];
    
    const isSel = isOptionSelected(comboIds, opt);
    const newIds = isSel
      ? comboIds.filter((id) => id.trim().toUpperCase() !== opt.id.trim().toUpperCase())
      : [...comboIds, opt.id];
      
    onChange(
      combinations.map((c, i) =>
        i === combIdx ? { ...c, ids: newIds } : c
      )
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800 font-sans">Хослолын оноо тохируулах</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-seek-4">
        {combinations.map((combo, combIdx) => {
          const comboIds = combo.ids || [];
          return (
            <div key={combIdx} className={`rounded-seek-md border p-seek-3 ${combo.score > 0 ? "border-success/20 bg-success/5" : combo.score < 0 ? "border-danger/20 bg-danger/5" : "border-slate-200 bg-slate-50"}`}>
              <div className="mb-seek-2 flex items-center justify-between">
                <span className={`text-xs font-semibold ${combo.score > 0 ? "text-success" : combo.score < 0 ? "text-danger" : "text-slate-500"}`}>Хослол {combIdx + 1}</span>
                <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
              </div>
              <div className="space-y-seek-3">
                <div className="flex flex-wrap items-center gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleOption(combIdx, opt)}
                      className={`rounded border px-2.5 py-0.5 text-xs font-bold transition-all ${
                        isOptionSelected(comboIds, opt)
                          ? "border-primary bg-primary text-white"
                          : "border-border bg-surface text-foreground hover:border-primary/50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-slate-200">
                  <span className="text-xs font-semibold text-slate-700">Оноо:</span>
                  <ScoreInput
                    score={combo.score}
                    onChange={(score) => setScore(combIdx, score)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}

// ==============================================================================================
// 2. CombinationMatchingBuilder - Харгалзуулах асуултын хувьд зүүн, баруун хослолын оноо тохируулах логик.
// ==============================================================================================

interface CombinationMatchingBuilderProps {
  options: QuestionOption[];
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
  rightOptions?: RightMatchingOption[];
}

export function CombinationMatchingBuilder({
  options,
  combinations,
  onChange,
  rightOptions = [],
}: CombinationMatchingBuilderProps) {
  const leftItems = options;
  const rightItems = rightOptions;

  function addCombination() {
    const defaultPairs = leftItems.map((l) => `${l.id}:${rightItems[0]?.id || ""}`);
    onChange([...combinations, { ids: defaultPairs, score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setPair(combIdx: number, leftIdx: number, rightId: string) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const comboIds = combo.ids || [];
    const newIds = leftItems.map((l, index) => {
      if (index === leftIdx) {
        return `${l.id}:${rightId}`;
      }
      const existing = comboIds.find(idStr => {
        if (typeof idStr !== "string" || !idStr.includes(":")) return false;
        return idStr.split(":")[0].trim().toLowerCase() === l.id.trim().toLowerCase();
      });
      return existing || `${l.id}:${rightItems[0]?.id || ""}`;
    });
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, ids: newIds } : c)));
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }
  function getPairRight(combo: CombinationEntry, leftIdx: number, leftId: string): string {
    if (!combo) return "";
    const comboIds = combo.ids || [];
    
    // 1. Try exact index lookup first
    const entry = comboIds[leftIdx];
    if (entry && typeof entry === "string" && entry.includes(":")) {
      const parts = entry.split(":");
      if (parts[0].trim().toLowerCase() === leftId.trim().toLowerCase()) {
        return parts[1] ?? "";
      }
    }
    
    // 2. Fallback to strict ID matching
    const found = comboIds.find((idStr: string) => {
      if (typeof idStr !== "string" || !idStr.includes(":")) return false;
      const parts = idStr.split(":");
      return parts[0].trim().toLowerCase() === leftId.trim().toLowerCase();
    });
    
    if (found) {
      return found.split(":")[1] ?? "";
    }
    return "";
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800 font-sans">Хослолын оноо тохируулах (Combination Scores)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-seek-4">
        {combinations.map((combo, combIdx) => (
          <div key={combIdx} className="rounded-seek-md border border-primary/20 bg-primary/5 p-seek-3">
            <div className="mb-seek-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Хослол {combIdx + 1}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
            </div>
            <div className="space-y-2">
              {leftItems.map((leftOpt, index) => (
                <div key={leftOpt.id} className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold text-slate-600">
                    L{index + 1}:
                  </span>
                  <select
                    value={getPairRight(combo, index, leftOpt.id)}
                    onChange={(e) => setPair(combIdx, index, e.target.value)}
                    className="flex-1 rounded-seek-md border border-border bg-surface px-seek-2 py-1 text-xs outline-none focus:border-primary text-slate-700"
                  >
                    <option value="">Сонгоно уу</option>
                    {rightItems.map((r) => (
                      <option key={r.id} value={r.id}>{r.id}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-dashed border-slate-200">
              <span className="text-xs text-slate-700 font-semibold">Оноо:</span>
              <ScoreInput
                score={combo.score}
                onChange={(score) => setScore(combIdx, score)}
              />
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}

// ==============================================================================================
// 3. CombinationFITBBuilder - Хоосон бөглөх асуултад зориулсан хослолын оноо бодох логик.
// ==============================================================================================

interface CombinationFITBBuilderProps {
  blankCount: number;
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
}

export function CombinationFITBBuilder({
  blankCount,
  combinations,
  onChange,
}: CombinationFITBBuilderProps) {
  function addCombination() {
    onChange([...combinations, { ids: Array(blankCount).fill(""), score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setAnswer(combIdx: number, blankIdx: number, value: string) {
    onChange(
      combinations.map((c, i) => {
        if (i !== combIdx) return c;
        const currentIds = c.ids || [];
        const newIds = [...currentIds];
        // blankCount хэмжээтэй массив биш бол дүүргэнэ
        while (newIds.length < blankCount) {
          newIds.push("");
        }
        newIds[blankIdx] = value;
        return { ...c, ids: newIds };
      })
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <div className="grid gap-seek-3 md:grid-cols-2">
        {combinations.map((combo, combIdx) => {
          const comboIds = combo.ids || [];
          return (
            <div key={combIdx} className="rounded-seek-md border border-border bg-slate-50/50 p-seek-3 space-y-seek-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Хослол {combIdx + 1}</span>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeCombination(combIdx)}
                  className="h-6 w-6 p-0 flex items-center justify-center text-xs"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-seek-2">
                {Array.from({ length: blankCount }, (_, bi) => (
                  <div key={bi} className="flex items-center gap-seek-2">
                    <span className="w-16 text-xs text-slate-500 font-mono">blank{bi + 1}:</span>
                    <Input
                      type="text"
                      value={comboIds[bi] ?? ""}
                      onChange={(e) => setAnswer(combIdx, bi, e.target.value)}
                      placeholder={`Хоосон зайны утга`}
                      className="flex-1 h-8 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-seek-2 border-t border-slate-100 flex items-center justify-end gap-seek-2">
                <span className="text-xs text-slate-700 font-semibold">Оноо:</span>
                <ScoreInput
                  score={combo.score}
                  onChange={(score) => setScore(combIdx, score)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}

// ==============================================================================================
// 4. CombinationOrderingBuilder - Эрэмбэлэх асуултад зориулсан хослолын оноо бодох логик.
// ==============================================================================================

export interface CombinationOrderingBuilderProps {
  options: QuestionOption[];
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
}

export function CombinationOrderingBuilder({
  options,
  combinations,
  onChange,
}: CombinationOrderingBuilderProps) {
  const stepsCount = options.length;

  function addCombination() {
    const defaultSeq = options.map((o) => o.id);
    onChange([...combinations, { ids: defaultSeq, score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setStepOption(combIdx: number, stepIdx: number, optId: string) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const comboIds = combo.ids || [];
    const newIds = [...comboIds];
    newIds[stepIdx] = optId;
    onChange(
      combinations.map((c, i) =>
        i === combIdx ? { ...c, ids: newIds } : c
      )
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  function getStepOption(comboIds: string[], stepIdx: number): string {
    const val = comboIds[stepIdx] || "";
    const opt = options.find((o) => o.id.trim().toLowerCase() === val.trim().toLowerCase());
    return opt ? opt.id : val;
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800 font-sans">Хослолын оноо тохируулах (Combination Scores)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-seek-4">
        {combinations.map((combo, combIdx) => {
          const comboIds = combo.ids || [];
          return (
            <div key={combIdx} className="rounded-seek-md border border-amber-200 bg-amber-50/5 p-seek-3">
              <div className="mb-seek-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-700">Хослол {combIdx + 1}</span>
                <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
              </div>
              <div className="space-y-2">
                {Array.from({ length: stepsCount }, (_, stepIdx) => (
                  <div key={stepIdx} className="flex items-center gap-1">
                    <span className="truncate text-xs font-medium text-slate-600">{stepIdx + 1}: </span>
                    <select
                      value={getStepOption(comboIds, stepIdx)}
                      onChange={(e) => setStepOption(combIdx, stepIdx, e.target.value)}
                      className="flex-1 rounded-seek-md border border-border bg-surface px-seek-2 py-1 text-xs outline-none focus:border-primary text-slate-700"
                    >
                      <option value="">Сонгоно уу</option>
                      {options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-dashed border-slate-200">
                <span className="text-xs text-slate-700 font-semibold">Оноо:</span>
                <ScoreInput
                  score={combo.score}
                  onChange={(score) => setScore(combIdx, score)}
                />
              </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}
