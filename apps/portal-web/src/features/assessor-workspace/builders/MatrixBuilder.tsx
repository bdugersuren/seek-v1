"use client";

import React from "react";
import { Button, Input } from "@seek/ui";
import type { EditorOption } from "../types";

interface MatrixBuilderProps {
  options: EditorOption[];
  scoringConfig: Record<string, any>;
  onChange: (opts: EditorOption[]) => void;
  onScoringConfigChange: (cfg: Record<string, any>) => void;
}

/**
 * MatrixBuilder - Матриц асуултын мөр, баганыг удирдах, зөв радио товчийг сонгох компонент.
 */
export function MatrixBuilder({
  options,
  scoringConfig,
  onChange,
  onScoringConfigChange,
}: MatrixBuilderProps) {
  const columns: Array<{ id: string; label: string }> = scoringConfig?.matrixColumns || [
    { id: "col_1", label: "Сайн" },
    { id: "col_2", label: "Дунд" },
    { id: "col_3", label: "Муу" },
  ];

  const addRow = () => {
    const nextIdx = options.length + 1;
    onChange([
      ...options,
      {
        id: `row_${Date.now()}_${nextIdx}`,
        label: `Мөр ${nextIdx}`,
        content: `Үнэлэх өгүүлбэр ${nextIdx}`,
        isCorrect: true,
        score: 1,
        matchValue: columns[0]?.id || "col_1",
      },
    ]);
  };

  const removeRow = (idx: number) => {
    if (options.length <= 1) return;
    onChange(options.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  };

  const addColumn = () => {
    const nextColIdx = columns.length + 1;
    const nextColumns = [...columns, { id: `col_${Date.now()}`, label: `Багана ${nextColIdx}` }];
    onScoringConfigChange({ ...scoringConfig, matrixColumns: nextColumns });
  };

  const removeColumn = (colIdx: number) => {
    if (columns.length <= 2) return;
    const nextColumns = columns.filter((_, i) => i !== colIdx);
    onScoringConfigChange({ ...scoringConfig, matrixColumns: nextColumns });
  };

  const updateColumnLabel = (colIdx: number, label: string) => {
    const nextColumns = columns.map((c, i) => (i === colIdx ? { ...c, label } : c));
    onScoringConfigChange({ ...scoringConfig, matrixColumns: nextColumns });
  };

  return (
    <div className="space-y-seek-4">
      {/* Column Headers Config */}
      <div className="rounded-seek-md border border-border bg-slate-50/50 p-seek-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Матрицын баганууд (Хэмжүүрийн утгууд):</span>
          <Button type="button" variant="outline" size="sm" onClick={addColumn} className="text-xs h-7">
            + Багана нэмэх
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {columns.map((col, cIdx) => (
            <div key={col.id} className="flex items-center gap-1 bg-white border border-border rounded-seek-md px-2 py-1">
              <Input
                value={col.label}
                onChange={(e) => updateColumnLabel(cIdx, e.target.value)}
                className="w-24 border-0 p-0 text-xs font-semibold focus-visible:ring-0"
              />
              {columns.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeColumn(cIdx)}
                  className="text-danger hover:text-danger-hover text-xs font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rows Matrix Table */}
      <div className="overflow-x-auto rounded-seek-lg border border-border bg-white shadow-seek-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-border text-slate-700 font-bold uppercase">
            <tr>
              <th className="p-seek-3 min-w-[200px]">Мөр (Үнэлэх өгүүлбэр)</th>
              {columns.map((col) => (
                <th key={col.id} className="p-seek-3 text-center min-w-[90px]">{col.label}</th>
              ))}
              <th className="p-seek-3 text-center w-24">Оноо</th>
              <th className="p-seek-3 text-center w-12">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {options.map((row, rIdx) => (
              <tr key={row.id}>
                <td className="p-seek-3">
                  <Input
                    value={row.content}
                    placeholder="Өгүүлбэр бичих..."
                    onChange={(e) => updateRow(rIdx, { content: e.target.value })}
                    className="text-xs"
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.id} className="p-seek-3 text-center">
                    <input
                      type="radio"
                      name={`matrix_row_${row.id}`}
                      checked={row.matchValue === col.id}
                      onChange={() => updateRow(rIdx, { matchValue: col.id })}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                ))}
                <td className="p-seek-3 text-center">
                  <Input
                    type="number"
                    value={row.score}
                    onChange={(e) => updateRow(rIdx, { score: Number(e.target.value) })}
                    className="w-16 h-8 text-center text-xs mx-auto"
                  />
                </td>
                <td className="p-seek-3 text-center">
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeRow(rIdx)}
                      className="h-7 w-7 p-0 text-xs mx-auto"
                    >
                      ✕
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" variant="outline" onClick={addRow}>
        + Шинэ мөр нэмэх
      </Button>
    </div>
  );
}
