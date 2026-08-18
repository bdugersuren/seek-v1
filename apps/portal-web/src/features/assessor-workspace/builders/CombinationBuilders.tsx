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
  function isOptionSelected(comboIds: string[], opt: EditorOption): boolean {
    if (!Array.isArray(comboIds)) return false;
    return comboIds.some((id) => {
      const cleanId = id.trim().toLowerCase();
      const cleanOptId = opt.id.trim().toLowerCase();
      const cleanOptKey = (opt.optionKey || "").trim().toLowerCase();
      const cleanOptLabel = opt.label.trim().toLowerCase();
      return (
        cleanId === cleanOptId ||
        cleanId === cleanOptKey ||
        cleanId === cleanOptLabel ||
        cleanId.endsWith(cleanOptId) ||
        cleanOptId.endsWith(cleanId)
      );
    });
  }

  function toggleOption(combIdx: number, opt: EditorOption) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const comboIds = combo.ids || combo.answers || [];
    
    const isSel = isOptionSelected(comboIds, opt);
    const newIds = isSel
      ? comboIds.filter((id) => {
          const cleanId = id.trim().toLowerCase();
          const cleanOptId = opt.id.trim().toLowerCase();
          const cleanOptKey = (opt.optionKey || "").trim().toLowerCase();
          const cleanOptLabel = opt.label.trim().toLowerCase();
          return (
            cleanId !== cleanOptId &&
            cleanId !== cleanOptKey &&
            cleanId !== cleanOptLabel &&
            !cleanId.endsWith(cleanOptId) &&
            !cleanOptId.endsWith(cleanId)
          );
        })
      : [...comboIds, opt.label]; // Тогтвортой label утгыг нэмнэ
      
    onChange(
      combinations.map((c, i) =>
        i === combIdx ? { ...c, ids: newIds, answers: newIds } : c
      )
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800 font-sans">Хослолын оноо тохируулах (Combination Scores)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-seek-4">
        {combinations.map((combo, combIdx) => {
          const comboIds = combo.ids || combo.answers || [];
          return (
            <div key={combIdx} className={`rounded-seek-md border p-seek-3 ${combo.score > 0 ? "border-success/20 bg-success/5" : combo.score < 0 ? "border-danger/20 bg-danger/5" : "border-slate-200 bg-slate-50"}`}>
              <div className="mb-seek-2 flex items-center justify-between">
                <span className={`text-xs font-semibold ${combo.score > 0 ? "text-success" : combo.score < 0 ? "text-danger" : "text-slate-500"}`}>Хослол {combIdx + 1}</span>
                <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
              </div>
              <div className="space-y-seek-3">
                <div className="flex flex-wrap items-center gap-2">
                  {/* <span className="text-xs text-muted-foreground">Сонголтууд:</span> */}
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
  function setPair(combIdx: number, leftIdx: number, rightId: string) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const comboIds = combo.ids || combo.answers || [];
    const newIds = [...comboIds];
    newIds[leftIdx] = `${leftItems[leftIdx].id}:${rightId}`;
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, ids: newIds, answers: newIds } : c)));
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }
  function getPairRight(combo: any, leftIdx: number, leftId: string): string {
    if (!combo) return "";
    const comboIds = combo.ids || combo.answers || [];
    const leftOpt = leftItems[leftIdx];
    
    // 1. Try exact index lookup first
    const entry = comboIds[leftIdx];
    if (entry && typeof entry === "string" && entry.includes(":")) {
      const rId = entry.split(":")[1] ?? "";
      const rightOpt = rightItems.find(r => r.id === rId || rId.endsWith(r.id) || r.id.endsWith(rId));
      return rightOpt ? rightOpt.id : rId;
    }
    
    // 2. Fallback to flexible matching (using clean label too)
    const found = comboIds.find((idStr: string) => {
      if (typeof idStr !== "string" || !idStr.includes(":")) return false;
      const parts = idStr.split(":");
      const lId = parts[0] || "";
      const cleanLeftId = leftId.trim().toLowerCase();
      const cleanLId = lId.trim().toLowerCase();
      const cleanLabel = leftOpt ? leftOpt.label.trim().toLowerCase() : "";
      return (
        cleanLId === cleanLeftId ||
        cleanLId === cleanLabel ||
        cleanLeftId.endsWith(cleanLId) ||
        cleanLId.endsWith(cleanLeftId)
      );
    });
    
    if (found) {
      const rId = found.split(":")[1] ?? "";
      const rightOpt = rightItems.find(r => r.id === rId || rId.endsWith(r.id) || r.id.endsWith(rId));
      return rightOpt ? rightOpt.id : rId;
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
              <span className="text-xs text-muted-foreground font-semibold">Оноо:</span>
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

// ==============================================================================================
// 4. CombinationOrderingBuilder - Эрэмбэлэх асуултад зориулсан хослолын оноо бодох логик.
// ==============================================================================================

export interface CombinationOrderingBuilderProps {
  options: EditorOption[];
  combinations: any[];
  onChange: (c: any[]) => void;
}

export function CombinationOrderingBuilder({
  options,
  combinations,
  onChange,
}: CombinationOrderingBuilderProps) {
  const stepsCount = options.length;

  function addCombination() {
    const defaultSeq = options.map((o) => o.label);
    onChange([...combinations, { ids: defaultSeq, score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setStepOption(combIdx: number, stepIdx: number, optId: string) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const comboIds = combo.ids || combo.answers || [];
    const newIds = [...comboIds];
    const opt = options.find((o) => o.id === optId);
    newIds[stepIdx] = opt ? opt.label : optId;
    onChange(
      combinations.map((c, i) =>
        i === combIdx ? { ...c, ids: newIds, answers: newIds } : c
      )
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  function getStepOption(comboIds: string[], stepIdx: number): string {
    const val = comboIds[stepIdx] || "";
    const opt = options.find((o) => {
      const cleanVal = val.trim().toLowerCase();
      const cleanOId = o.id.trim().toLowerCase();
      const cleanKey = (o.optionKey || "").trim().toLowerCase();
      const cleanLabel = o.label.trim().toLowerCase();
      return (
        cleanOId === cleanVal ||
        cleanKey === cleanVal ||
        cleanLabel === cleanVal ||
        cleanVal.endsWith(cleanOId) ||
        cleanOId.endsWith(cleanVal)
      );
    });
    
    if (!opt) {
      const idx = parseInt(val) - 1;
      if (!isNaN(idx) && options[idx]) {
        return options[idx].id;
      }
    }
    
    return opt ? opt.id : val;
  }

  return (
    <div className="space-y-seek-3">
      <span className="block text-sm font-bold text-slate-800 font-sans">Хослолын оноо тохируулах (Combination Scores)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-seek-4">
        {combinations.map((combo, combIdx) => {
          const comboIds = combo.ids || combo.answers || [];
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
                      {options.map((opt, oIdx) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-end gap-2 pt-2 border-t border-dashed border-slate-200">
                <span className="text-xs text-muted-foreground font-semibold">Оноо:</span>
                <Input
                  type="number"
                  value={combo.score}
                  onChange={(e) => setScore(combIdx, Number(e.target.value))}
                  className="w-16 h-8 text-center text-sm"
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
