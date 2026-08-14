"use client";

import React from "react";
import { Button, Input, Icons } from "@seek/ui";
import type { EditorOption } from "../types";

interface CombinationEntry {
  ids: string[];
  score: number;
}

// ==============================================================================================
// 1. CombinationMCBuilder - Олон сонголттой асуултын хувьд сонголтын хослолд оноо өгөх логик.
// ==============================================================================================

interface CombinationMCBuilderProps {
  options: EditorOption[];
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
  function toggleOption(combIdx: number, optId: string) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const newIds = combo.ids.includes(optId)
      ? combo.ids.filter((id) => id !== optId)
      : [...combo.ids, optId];
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, ids: newIds } : c)));
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800">Хослолын оноо тохируулах (Combination Scores)</span>
      <div className="space-y-seek-2">
        {combinations.map((combo, combIdx) => (
          <div key={combIdx} className={`rounded-seek-md border p-seek-3 ${combo.score > 0 ? "border-success/20 bg-success/5" : combo.score < 0 ? "border-danger/20 bg-danger/5" : "border-slate-200 bg-slate-50"}`}>
            <div className="mb-seek-2 flex items-center justify-between">
              <span className={`text-xs font-semibold ${combo.score > 0 ? "text-success" : combo.score < 0 ? "text-danger" : "text-slate-500"}`}>Хослол {combIdx + 1}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
            </div>
            <div className="space-y-seek-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Сонголтууд:</span>
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => toggleOption(combIdx, opt.id)}
                    className={`rounded border px-2.5 py-0.5 text-xs font-bold transition-all ${
                      combo.ids.includes(opt.id)
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
                <div className={`flex items-center gap-1 bg-slate-50 border rounded-seek-md px-2 h-10 w-32 ${
                  combo.score > 0 ? "border-success/30" : combo.score < 0 ? "border-danger/30" : "border-border"
                }`}>
                  <Icons.MaxValue className={`h-4 w-4 stroke-[1.8] flex-shrink-0 ${
                    combo.score > 0 ? "text-success" : combo.score < 0 ? "text-danger" : "text-slate-400"
                  }`} />
                  <Input
                    type="number"
                    step="any"
                    value={combo.score}
                    onChange={(e) => setScore(combIdx, Number(e.target.value))}
                    className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm font-semibold text-center"
                  />
                </div>
              </div>
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
// 2. CombinationMatchingBuilder - Харгалзуулах асуултын хувьд зүүн, баруун хослолын оноо тохируулах логик.
// ==============================================================================================

interface CombinationMatchingBuilderProps {
  options: EditorOption[];
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
  rightOptions?: any[];
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
  function setPair(combIdx: number, leftId: string, rightId: string) {
    const combo = combinations[combIdx];
    if (!combo || !Array.isArray(combo.ids)) return;
    const newIds = combo.ids.filter((id) => !id.startsWith(`${leftId}:`));
    newIds.push(`${leftId}:${rightId}`);
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, ids: newIds } : c)));
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }
  function getPairRight(combo: CombinationEntry, leftId: string): string {
    if (!combo || !Array.isArray(combo.ids)) return "";
    const entry = combo.ids.find((id) => id.startsWith(`${leftId}:`));
    return entry ? entry.split(":")[1] ?? "" : "";
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800">Хослолын оноо тохируулах (Combination Scores)</span>
      <div className="space-y-seek-2">
        {combinations.map((combo, combIdx) => (
          <div key={combIdx} className="rounded-seek-md border border-primary/20 bg-primary/5 p-seek-3">
            <div className="mb-seek-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Хослол {combIdx + 1}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
            </div>
            <div className="space-y-2">
              {leftItems.map((leftOpt, index) => (
                <div key={leftOpt.id} className="flex items-center gap-2">
                  <span className="w-24 truncate text-xs font-medium text-foreground">L{index + 1}: → </span>
                  {/* <span className="text-xs text-muted-foreground">{leftOpt.content || "(хоосон)"}</span> */}
                  {/* <span className="text-xs text-muted-foreground">→</span> */}
                  <select
                    value={getPairRight(combo, leftOpt.id)}
                    onChange={(e) => setPair(combIdx, leftOpt.id, e.target.value)}
                    className="flex-1 rounded-seek-md border border-border bg-surface px-seek-2 py-1 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Сонгоно уу</option>
                    {rightItems.map((r) => (
                      <option key={r.id} value={r.id}>{r.id}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground">Оноо:</span>
              <Input
                type="number"
                value={combo.score}
                onChange={(e) => setScore(combIdx, Number(e.target.value))}
                className="w-16 h-8 text-center text-sm"
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
  combinations: any[];
  onChange: (c: any[]) => void;
}

export function CombinationFITBBuilder({
  blankCount,
  combinations,
  onChange,
}: CombinationFITBBuilderProps) {
  function addCombination() {
    onChange([...combinations, { answers: Array(blankCount).fill(""), score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setAnswer(combIdx: number, blankIdx: number, value: string) {
    onChange(
      combinations.map((c, i) =>
        i === combIdx ? { ...c, answers: c.answers.map((a: any, bi: number) => (bi === blankIdx ? value : a)) } : c
      )
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <div className="grid gap-seek-3 md:grid-cols-2">
        {combinations.map((combo, combIdx) => {
          const answers = combo.answers || combo.ids || [];
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
                      value={answers[bi] ?? ""}
                      onChange={(e) => setAnswer(combIdx, bi, e.target.value)}
                      placeholder={`Хоосон зайны утга`}
                      className="flex-1 h-8 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-seek-2 border-t border-slate-100 flex items-center justify-end gap-seek-2">
                <span className="text-xs text-slate-500">Оноо:</span>
                <Input
                  type="number"
                  value={combo.score}
                  onChange={(e) => setScore(combIdx, Number(e.target.value))}
                  className="w-16 h-8 text-center text-xs bg-white"
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
