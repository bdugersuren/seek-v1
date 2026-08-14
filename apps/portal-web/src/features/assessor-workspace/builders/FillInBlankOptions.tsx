"use client";

import React from "react";
import { Button, Input, Badge } from "@seek/ui";
import { CombinationFITBBuilder } from "./CombinationBuilders";
import type { EditorOption } from "../types";

interface FillInBlankOptionsProps {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
  scoringMode: string;
  combinations: any[];
  onCombinationsChange: (c: any[]) => void;
}

/**
 * FillInBlankOptions - Хоосон бөглөх асуултын хувилбаруудыг тохируулах компонент.
 * Хоосон зай бүрд зөвшөөрөгдөх хариултууд, оноо, том/жижиг үсэг ялгах эсэхийг тохируулна.
 */
export function FillInBlankOptions({
  options,
  onChange,
  scoringMode,
  combinations,
  onCombinationsChange,
}: FillInBlankOptionsProps) {
  function addBlank() {
    const n = options.length + 1;
    onChange([
      ...options,
      {
        id: `blank${n}`,
        label: `blank${n}`,
        content: "",
        isCorrect: true,
        score: 1,
        matchValue: "insensitive",
        acceptedValues: [{ value: "", score: 1, caseSensitive: false }],
      },
    ]);
  }

  function removeBlank(idx: number) {
    if (options.length <= 1) return;
    onChange(
      options
        .filter((_, i) => i !== idx)
        .map((o, i) => ({
          ...o,
          id: `blank${i + 1}`,
          label: `blank${i + 1}`,
        }))
    );
  }

  function addAcceptedValue(blankIdx: number) {
    onChange(
      options.map((o, i) =>
        i === blankIdx
          ? {
              ...o,
              acceptedValues: [...(o.acceptedValues ?? []), { value: "", score: 1, caseSensitive: false }],
            }
          : o
      )
    );
  }

  function removeAcceptedValue(blankIdx: number, valIdx: number) {
    onChange(
      options.map((o, i) =>
        i === blankIdx
          ? {
              ...o,
              acceptedValues: (o.acceptedValues ?? []).filter((_, vi) => vi !== valIdx),
            }
          : o
      )
    );
  }

  function updateAcceptedValue(blankIdx: number, valIdx: number, field: "value" | "score" | "caseSensitive", val: any) {
    onChange(
      options.map((o, i) =>
        i === blankIdx
          ? {
              ...o,
              acceptedValues: (o.acceptedValues ?? []).map((av, vi) => (vi === valIdx ? { ...av, [field]: val } : av)),
            }
          : o
      )
    );
  }

  return (
    <div className="space-y-seek-4">
      {/* Help Banner */}
      <div className="rounded-seek-md border border-teal-200 bg-teal-50/50 p-seek-3 text-xs text-teal-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <span>ℹ️ Нөхөх асуултын заавар:</span>
        </div>
        <div>
          Асуултын их бие (Stem) дотор <code>{`{{blank_1}}`}</code> эсвэл <code>{`[[1]]`}</code>, <code>{`{{blank_2}}`}</code> эсвэл <code>{`[[2]]`}</code> гэж бичиж хоосон зайг үүсгэнэ. Нүд тус бүрд олон зөвшөөрөгдөх хариулт болон ялгаатай оноо тохируулах боломжтой.
        </div>
      </div>

      {scoringMode === "per_option" ? (
        <>
          <div className="space-y-seek-4">
            {options.map((opt, idx) => {
              const maxBlankScore = (opt.acceptedValues ?? []).length > 0
                ? Math.max(...(opt.acceptedValues ?? []).map((av: any) => Number(av.score) || 0))
                : (opt.score || 1);

              return (
                <div key={opt.id || idx} className="overflow-hidden rounded-seek-lg border border-border border-l-[5px] border-l-teal-500 bg-white shadow-seek-xs">
                  <div className="flex items-center justify-between border-b border-border bg-teal-50/40 px-seek-4 py-seek-3">
                    <div className="flex items-center gap-seek-2">
                      <Badge variant="success">Хоосон зай #{idx + 1}</Badge>
                      <code className="text-xs font-mono font-bold text-teal-800 bg-teal-100/60 px-1.5 py-0.5 rounded">
                        {`{{blank_${idx + 1}}}`} / {`[[${idx + 1}]]`}
                      </code>
                      <span className="text-xs text-slate-500 font-medium ml-2">
                        (Авах дээд оноо: <strong>{maxBlankScore}</strong> оноо, {(opt.acceptedValues ?? []).length} хувилбартай)
                      </span>
                    </div>
                    {options.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeBlank(idx)}
                        className="h-7 px-seek-2 text-xs"
                      >
                        ✕ Нүд хасах
                      </Button>
                    )}
                  </div>
                  <div className="space-y-seek-3 p-seek-4 bg-white">
                    {(opt.acceptedValues ?? []).map((av: any, valIdx: number) => (
                      <div key={valIdx} className="flex flex-wrap items-center gap-seek-3 pb-seek-2 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex-1 min-w-[200px]">
                          <Input
                            placeholder="Зөвшөөрөгдөх хариулт (жишээ нь: 4, дөрөв, four)..."
                            value={av.value}
                            onChange={(e) => updateAcceptedValue(idx, valIdx, "value", e.target.value)}
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-seek-2 bg-slate-50 border border-border rounded-seek-md px-seek-3 h-10 w-32">
                          <span className="text-xs font-semibold text-slate-500">Оноо:</span>
                          <Input
                            type="number"
                            step="any"
                            value={av.score}
                            onChange={(e) => updateAcceptedValue(idx, valIdx, "score", Number(e.target.value))}
                            className="w-full border-0 bg-transparent p-0 text-center text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(av.caseSensitive)}
                            onChange={(e) => updateAcceptedValue(idx, valIdx, "caseSensitive", e.target.checked)}
                            className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                          />
                          <span>Том/жижиг үсэг ялгах</span>
                        </label>
                        {(opt.acceptedValues ?? []).length > 1 && (
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeAcceptedValue(idx, valIdx)}
                            className="shrink-0 h-8 w-8 p-0 text-xs flex items-center justify-center"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className="pt-seek-2 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addAcceptedValue(idx)}
                        className="text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        + Хариултын хувилбар нэмэх
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button type="button" variant="outline" onClick={addBlank} className="flex items-center gap-2">
            <span>+ Дараагийн хоосон нүд (Blank) нэмэх</span>
          </Button>
        </>
      ) : (
        <>
          <div className="mb-seek-3 flex flex-wrap items-center gap-seek-2 border-b border-border pb-seek-3">
            <span className="text-xs font-semibold text-slate-500">Хоосон нүднүүд:</span>
            {options.map((_, idx) => (
              <Badge key={idx} variant="secondary">
                {`{{blank_${idx + 1}}}`}
              </Badge>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addBlank}>
              + Нүд нэмэх
            </Button>
            {options.length > 1 && (
              <Button type="button" variant="danger" size="sm" onClick={() => removeBlank(options.length - 1)}>
                − Хасах
              </Button>
            )}
          </div>
          <CombinationFITBBuilder
            blankCount={options.length}
            combinations={combinations}
            onChange={onCombinationsChange}
          />
        </>
      )}
    </div>
  );
}
