"use client";

import React from "react";
import { Badge, Text, Input, Textarea, Icons } from "@seek/ui";
import { RichTextPreview } from "./RichTextPreviewer";
import { questionTypeLabels } from "../mock-data";
import type { QuestionBankItem } from "../types";

// -------------------------------------------------------------
// Options Preview: Styled with Left Indicator Strip & Color Borders
// (Positive -> Green, Negative -> Red, Neutral/0 -> Gray)
// -------------------------------------------------------------

/**
 * QuestionTypePreview - Асуултын төрлөөс хамааран хариултын сонголтууд, 
 * зөв хариулт ба онооны хуваарилалтыг харуулдаг read-only харагдац.
 *
 * @param question - Харагдах гэж буй асуултын объект
 */
export function QuestionTypePreview({ question }: { question: QuestionBankItem }) {
  const isCombinationScoring = 
    question.scoringMode === "combination" || 
    (question.scoringConfig as any)?.scoringMode === "combination" ||
    (question.contentJson as any)?.scoringMode === "combination" ||
    (question.contentJson as any)?.payload?.scoringMode === "combination";

  const combinations = 
    question.scoringConfig?.combinations || 
    (question.contentJson as any)?.scoringConfig?.combinations ||
    (question.contentJson as any)?.payload?.scoringConfig?.combinations ||
    (question.contentJson as any)?.combinations ||
    [];

  if (question.type === "ESSAY") {
    const rubrics = question.rubric && Array.isArray(question.rubric) ? question.rubric : [];

    return (
      <div className="space-y-seek-4">
        <Textarea
          rows={5}
          disabled
          placeholder="Суралцагч энд бичгийн хариултаа оруулна..."
          className="bg-slate-50/60"
        />
        {rubrics.length > 0 && (
          <div className="rounded-seek-md border border-slate-200 bg-slate-50/50 p-seek-4">
            <Text className="text-xs font-bold text-slate-800 mb-seek-3 uppercase tracking-wider">
              Үнэлгээний шалгуур (Grading Rubric)
            </Text>
            <div className="space-y-2">
              {rubrics.map((r: any, idx: number) => (
                <div key={r.id || idx} className="flex items-center justify-between bg-white border border-slate-200 rounded-seek-md p-seek-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{idx + 1}. {r.criteria}</span>
                    {r.description && <p className="text-slate-500 text-[11px] mt-0.5">{r.description}</p>}
                  </div>
                  <Badge variant="success" className="font-mono">Дээд: {r.maxScore} оноо</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (question.type === "FILL_BLANK" || question.type === "NUMERIC") {
    return (
      <div className="rounded-seek-md border border-border bg-surface p-seek-4">
        <Text variant="muted" className="mb-2 text-sm font-semibold">
          {question.type === "NUMERIC"
            ? "Тоон хариулт шалгах:"
            : "Хоосон зайг нөхөх тохиргоо ба хувилбарууд:"}
        </Text>
        {question.type === "NUMERIC" ? (
          <div className="flex items-center gap-3">
            <Input
              disabled
              value={question.options?.[0]?.value || ""}
              placeholder="Тоон хариулт"
              className="max-w-xs"
            />
            {question.options?.[0]?.matchValue && (
              <Badge variant="secondary" className="font-mono text-xs">
                Хүлцэх алдаа: ±{question.options[0].matchValue}
              </Badge>
            )}
            <Badge variant="success" className="font-mono text-xs">
              +{question.defaultMaxScore || question.points || 1} оноо
            </Badge>
          </div>
        ) : (
          <div className="space-y-3">
            {question.options.map((opt, idx) => {
              const accepted = opt.acceptedValues && opt.acceptedValues.length > 0
                ? opt.acceptedValues
                : [{ value: opt.value || "-", score: opt.score || 1, caseSensitive: false }];

              return (
                <div key={opt.id || idx} className="rounded-seek-md border border-slate-200 border-l-[4px] border-l-teal-500 bg-white p-3 text-xs shadow-seek-xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                    <span className="font-bold text-teal-900">
                      Хоосон зай #{idx + 1} ({`{{blank_${idx + 1}}}`} / {`[[${idx + 1}]]`})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {accepted.length} зөвшөөрөгдөх хувилбартай
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {accepted.map((av: any, aIdx: number) => (
                      <div key={aIdx} className="flex items-center gap-1.5 bg-slate-50 border border-border rounded-seek-md px-2.5 py-1">
                        <span className="font-semibold text-slate-800 font-mono">"{av.value}"</span>
                        <Badge variant="success" className="text-[10px] py-0 px-1 font-mono">
                          +{av.score || 1} оноо
                        </Badge>
                        {av.caseSensitive && (
                          <Badge variant="secondary" className="text-[9px] py-0 px-1" title="Том жижиг үсэг ялгана">
                            Aa
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  if (question.type === "MATCHING") {
    return (
      <div className="space-y-seek-4">
        <div className="space-y-seek-3">
          <Text variant="muted" className="text-sm font-semibold">Харгалзуулах хосуудын зөв тохиргоо:</Text>
          <div className="grid gap-seek-3 md:grid-cols-2">
            {/* Left Options */}
            <div className="space-y-2">
              <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">Зүүн тал (Сурвалжууд)</Text>
              {question.options.map((option, idx) => (
                <div key={`left-${option.id}-${idx}`} className="rounded-seek-md border border-emerald-200 border-l-[4px] border-l-emerald-500 bg-emerald-50/15 overflow-hidden flex shadow-seek-xs">
                  <div className="w-10 flex items-center justify-center font-bold text-xs bg-emerald-500 text-white shrink-0">
                    {option.label || `L${idx + 1}`}
                  </div>
                  <div className="flex-1 p-seek-3 flex items-center justify-between">
                    <div className="text-xs text-slate-800 flex-1 mr-2">
                      <RichTextPreview value={option.value || ""} compact />
                    </div>
                    <Badge variant="success" className="font-mono text-[11px] shrink-0">
                      +{option.score !== undefined ? option.score : 1} оноо
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Options */}
            <div className="space-y-2">
              <Text className="text-xs font-bold text-slate-700 uppercase tracking-wider">Баруун тал (Хариултууд)</Text>
              {(
                question.scoringConfig?.rightOptions || 
                (question.contentJson as any)?.scoringConfig?.rightOptions || 
                (question.contentJson as any)?.payload?.scoringConfig?.rightOptions || 
                question.options.map((o) => ({ id: o.id, value: o.matchValue })).filter((o) => o.value)
              )
                .map((valObj: any, idx: number) => (
                  <div key={`right-${valObj.id || idx}`} className="rounded-seek-md border border-indigo-200 border-l-[4px] border-l-indigo-500 bg-indigo-50/15 overflow-hidden flex shadow-seek-xs">
                    <div className="w-10 flex items-center justify-center font-bold text-xs bg-indigo-500 text-white shrink-0">
                      {`R${idx + 1}`}
                    </div>
                    <div className="flex-1 p-seek-3 text-xs text-slate-800">
                      <RichTextPreview value={valObj.value || ""} compact />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
        {isCombinationScoring && combinations.length > 0 && (
          <CombinationScoresDisplay question={question} combinations={combinations} />
        )}
      </div>
    );
  }

  if (question.type === "ORDERING") {
    return (
      <div className="space-y-seek-4">
        <div className="space-y-seek-3">
          <Text variant="muted" className="text-sm font-semibold">Алхмуудын зөв дараалал:</Text>
          <div className="space-y-2">
            {question.options.map((option, idx) => (
              <div key={option.id || idx} className="rounded-seek-md border border-amber-200 border-l-[4px] border-l-amber-500 bg-amber-50/15 overflow-hidden flex shadow-seek-xs">
                <div className="w-10 flex items-center justify-center font-bold text-xs bg-amber-500 text-white shrink-0">
                  {option.label || `O${idx + 1}`}
                </div>
                <div className="flex-1 p-seek-3 flex items-center justify-between text-xs text-slate-800 bg-white">
                  <div className="flex-1 mr-2 text-left">
                    <RichTextPreview value={option.value || ""} compact />
                  </div>
                  <Badge variant="success" className="font-mono text-[11px] shrink-0">
                    +{option.score !== undefined ? option.score : 1} оноо
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
        {isCombinationScoring && combinations.length > 0 && (
          <CombinationScoresDisplay question={question} combinations={combinations} />
        )}
      </div>
    );
  }

  // SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, LIKERT, MATRIX, etc.
  return (
    <div className="space-y-seek-4">
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const score = Number(option.score !== undefined && option.score !== null ? option.score : (option.isCorrect ? 1 : 0));
          const isPositive = score > 0;
          const isNegative = score < 0;

          const cardBorderClass = isPositive
            ? "border-emerald-500"
            : isNegative
            ? "border-rose-500"
            : "border-slate-200";

          const indicatorBgClass = isPositive
            ? "border-emerald-500 text-emerald-500"
            : isNegative
            ? "border-rose-500 text-rose-500"
            : "border-slate-300 text-slate-500";

          return (
            <div
              key={option.id || index}
              className={`rounded-seek-xl border p-seek-4 flex items-center gap-seek-4 transition-all duration-200 bg-white shadow-seek-xs ${cardBorderClass}`}
            >
              {/* Circular-like Rounded square Label Badge */}
              <div className={`w-8 h-8 rounded-seek-md flex items-center justify-center font-bold text-sm shrink-0 select-none bg-white border ${indicatorBgClass}`}>
                {option.label || String.fromCharCode(65 + index)}
              </div>

              {/* Content & Score Badge */}
              <div className="flex-1 flex items-center justify-between gap-3 min-w-0">
                <div className="text-sm text-slate-800 flex-1 min-w-0 font-medium">
                  <RichTextPreview value={option.value || ""} compact />
                </div>
                <div className="shrink-0">
                  <span
                    className={`font-bold text-sm px-2.5 py-1 rounded-seek-md border min-w-[2.5rem] inline-block text-center ${
                      isPositive
                        ? "text-emerald-500 bg-emerald-50 border-emerald-100"
                        : isNegative
                        ? "text-rose-500 bg-rose-50 border-rose-100"
                        : "text-slate-500 bg-slate-50 border-slate-100"
                    }`}
                  >
                    {isPositive ? `+${score}` : `${score}`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isCombinationScoring && combinations.length > 0 && (
        <CombinationScoresDisplay question={question} combinations={combinations} />
      )}
    </div>
  );
}

/**
 * CombinationScoresDisplay - Асуултын хариултуудад хослолын оноо тохируулсан үед 
 * тэдгээр хослолуудын онооны оноолтыг харуулдаг жижиг компонент.
 */
export function CombinationScoresDisplay({ 
  question, 
  combinations 
}: { 
  question: QuestionBankItem; 
  combinations: any[];
}) {
  return (
    <div className="mt-seek-5 space-y-seek-3">
      <Text className="text-sm font-bold text-slate-800">Combination Scoring Logic</Text>
      <div className="border border-slate-100 bg-white rounded-seek-lg divide-y divide-slate-100 shadow-seek-xs overflow-hidden">
        {combinations.map((combo: any, idx: number) => {
          const score = Number(combo.score);
          const isPositive = score > 0;
          const isNegative = score < 0;
          
          let comboDescription = "";
          if (question.type === "MULTIPLE_CHOICE") {
            const selectedLabels = (combo.ids || combo.answers || [])
              .map((id: string) => {
                const opt = question.options.find((o) => {
                  const cleanId = id.trim().toLowerCase();
                  const cleanOId = o.id.trim().toLowerCase();
                  const cleanKey = (o.optionKey || "").trim().toLowerCase();
                  return (
                    cleanOId === cleanId ||
                    cleanKey === cleanId ||
                    cleanId.endsWith(cleanOId) ||
                    cleanOId.endsWith(cleanId)
                  );
                });
                if (opt) return opt.label;
                const suffixMatch = id.match(/-opt-([a-zA-Z0-9]+)$/) || id.match(/-([a-zA-Z0-9]+)$/);
                return suffixMatch ? suffixMatch[1] : id;
              })
              .filter(Boolean)
              .join(", ");
            comboDescription = `[${selectedLabels || "Хоосон"}] selected`;
          } else if (question.type === "MATCHING") {
            const rightItems = question.scoringConfig?.rightOptions || (question as any).contentJson?.scoringConfig?.rightOptions || (question as any).contentJson?.payload?.scoringConfig?.rightOptions || [];
            const pairs = (combo.ids || combo.answers || [])
              .map((pairStr: string, pairIdx: number) => {
                const [leftId, rightId] = pairStr.split(":");
                
                // Зүүн талыг уян хатан хайж олох
                let leftOpt = question.options.find((o) => {
                  const cleanId = (leftId || "").trim().toLowerCase();
                  const cleanOId = o.id.trim().toLowerCase();
                  const cleanKey = (o.optionKey || "").trim().toLowerCase();
                  const cleanLabel = o.label.trim().toLowerCase();
                  return (
                    cleanOId === cleanId ||
                    cleanKey === cleanId ||
                    cleanLabel === cleanId ||
                    cleanId.endsWith(cleanOId) ||
                    cleanOId.endsWith(cleanId)
                  );
                });
                
                // Fallback: Хэрэв олдохгүй бол индексээр нь олох
                if (!leftOpt && question.options[pairIdx]) {
                  leftOpt = question.options[pairIdx];
                }
                const leftLabel = leftOpt ? leftOpt.label : leftId;
                
                // Баруун талыг уян хатан хайж олох
                let rightIdx = rightItems.findIndex((r: any) => {
                  const cleanRId = (rightId || "").trim().toLowerCase();
                  const cleanOptRId = r.id.trim().toLowerCase();
                  return cleanOptRId === cleanRId || cleanRId.endsWith(cleanOptRId) || cleanOptRId.endsWith(cleanRId);
                });
                
                // Fallback: Хэрэв олдохгүй бөгөөд "R1", "R2" хэлбэртэй байвал индекс рүү хөрвүүлэх
                if (rightIdx === -1 && typeof rightId === "string" && rightId.startsWith("R")) {
                  const rNum = parseInt(rightId.substring(1)) - 1;
                  if (!isNaN(rNum) && rightItems[rNum]) {
                    rightIdx = rNum;
                  }
                }
                
                const rightLabel = rightIdx !== -1 ? `R${rightIdx + 1}` : (rightId || "Хоосон");
                
                return `{${leftLabel}:${rightLabel}}`;
              })
              .filter(Boolean)
              .join(" ");
            comboDescription = `[${pairs || "Хоосон"}] matched`;
          } else if (question.type === "ORDERING") {
            const orderLabels = (combo.ids || combo.answers || [])
              .map((id: string) => {
                const opt = question.options.find((o) => {
                  const cleanId = id.trim().toLowerCase();
                  const cleanOId = o.id.trim().toLowerCase();
                  return cleanOId === cleanId || cleanId.endsWith(cleanOId);
                });
                return opt ? opt.label : id;
              })
              .filter(Boolean)
              .join(" ➔ ");
            comboDescription = `[${orderLabels || "Хоосон"}] ordered`;
          } else if (question.type === "FILL_BLANK") {
            const answers = combo.answers || combo.ids || [];
            const blankFmt = answers
              .map((ans: string, bIdx: number) => `blank${bIdx + 1}: "${ans || "_"}"`)
              .join(", ");
            comboDescription = `[${blankFmt}] filled`;
          } else {
            const genericIds = (combo.ids || combo.answers || []).join(", ");
            comboDescription = `[${genericIds || "Хоосон"}] selected`;
          }

          if (
            combo.isCorrect || 
            combo.label?.toLowerCase().includes("correct") || 
            (combo.score === question.defaultMaxScore && question.type === "MULTIPLE_CHOICE" && (combo.ids || combo.answers || []).length === 1)
          ) {
            comboDescription = comboDescription.replace(/selected|matched|ordered|filled/, "only (correct)");
          }

          return (
            <div
              key={idx}
              className="flex items-center justify-between p-seek-3 px-seek-4 text-xs hover:bg-slate-50/50 transition-colors"
            >
              <span className="font-semibold text-slate-500 font-mono">
                {comboDescription}
              </span>
              <span 
                className={`font-bold text-sm ${
                  isPositive 
                    ? "text-emerald-500" 
                    : isNegative 
                    ? "text-rose-500" 
                    : "text-slate-400"
                }`}
              >
                {isPositive ? `+${score}` : score}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
