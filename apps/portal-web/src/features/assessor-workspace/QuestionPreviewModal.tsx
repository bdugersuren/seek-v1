"use client";

import React, { useEffect, useRef, useState } from "react";
import katex from "katex";
import {
  Badge,
  Button,
  Card,
  Icons,
  Input,
  Text,
  Textarea,
} from "@seek/ui";
import { getNextWorkflowActions, getQuestionByIdAsync } from "./api";
import {
  bloomLabels,
  competencyLabels,
  difficultyLabels,
  questionTypeLabels,
  statusLabels,
} from "./mock-data";
import type { QuestionBankItem, QuestionWorkflowStatus, QuestionType } from "./types";

const questionTypeIcons: Record<QuestionType, React.ComponentType<any>> = {
  SINGLE_CHOICE: Icons.SingleChoose,
  MULTIPLE_CHOICE: Icons.MultiChoose,
  TRUE_FALSE: Icons.TrueFalse,
  ORDERING: Icons.Ordering,
  MATCHING: Icons.Matching,
  SHORT_TEXT: Icons.ShortText,
  FILL_BLANK: Icons.FillBlank,
  MATRIX: Icons.Matrix,
  NUMERIC: Icons.Numeric,
  LIKERT: Icons.Likert,
  SJT: Icons.Sjt,
  CASE_BUNDLE: Icons.CaseBundle,
  ESSAY: Icons.Essay,
};

const scoringModeLabels: Record<string, string> = {
  per_option: "Харгалзах оноо",
  combination: "Хослолын оноо",
  manual: "Гараар үнэлэх",
};

const statusVariant: Record<
  QuestionWorkflowStatus,
  "secondary" | "success" | "warning" | "danger"
> = {
  draft: "secondary",
  approval_requested: "warning",
  in_review: "warning",
  changes_requested: "danger",
  resubmitted: "warning",
  approved: "success",
  published: "success",
  archived: "secondary",
  rejected: "danger",
  deleted: "danger",
};

export function QuestionPreviewModal({
  question,
  onClose,
}: {
  question: QuestionBankItem;
  onClose: () => void;
}) {
  const [allVersions, setAllVersions] = useState<QuestionBankItem[]>(
    question.versions && question.versions.length > 0 ? question.versions : [question]
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loadingVersions, setLoadingVersions] = useState<boolean>(false);

  useEffect(() => {
    if (question.versions && question.versions.length > 1) {
      setAllVersions(question.versions);
      return;
    }

    if (question.id) {
      let active = true;
      async function loadFullHistory() {
        try {
          setLoadingVersions(true);
          const fullItem = await getQuestionByIdAsync(question.id);
          if (active && fullItem && fullItem.versions && fullItem.versions.length > 0) {
            setAllVersions(fullItem.versions);
          }
        } catch (err) {
          console.error("Failed to load question version history:", err);
        } finally {
          if (active) setLoadingVersions(false);
        }
      }
      loadFullHistory();
      return () => {
        active = false;
      };
    }
  }, [question.id, question.versions]);

  const activeQuestion = allVersions[selectedIndex] || question;
  const nextActions = getNextWorkflowActions(activeQuestion.status);
  const TypeIcon = questionTypeIcons[activeQuestion.type] || Icons.ListCheck;
  const scoringMode =
    activeQuestion.scoringMode ||
    (activeQuestion.scoringConfig as any)?.scoringMode ||
    (activeQuestion.contentJson as any)?.scoringMode ||
    (activeQuestion.contentJson as any)?.payload?.scoringMode ||
    "per_option";

  const totalPoints = activeQuestion.defaultMaxScore !== undefined ? activeQuestion.defaultMaxScore : (activeQuestion.points !== undefined ? activeQuestion.points : 1);
  const minPoints = activeQuestion.defaultMinScore !== undefined ? activeQuestion.defaultMinScore : (activeQuestion.minPoints !== undefined ? activeQuestion.minPoints : 0);
  const durationSeconds = activeQuestion.defaultTimeSeconds || activeQuestion.durationSeconds || 60;

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-slate-900/60 backdrop-blur-sm p-seek-4 transition-all duration-300">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-6 shadow-2xl relative border-slate-200">
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full flex items-center justify-center hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"
          >
            ✕
          </Button>
        </div>

        {/* Modal Title Section */}
        <div className="flex items-start justify-between gap-seek-4 pr-seek-6">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant[activeQuestion.status] || "secondary"}>
                {statusLabels[activeQuestion.status] || activeQuestion.status}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {activeQuestion.code}
              </Badge>

              {/* Version History Selector Combobox */}
              {allVersions.length > 1 && (
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-xs font-semibold text-slate-500">Хувилбар:</span>
                  <div className="relative inline-block">
                    <select
                      value={selectedIndex}
                      onChange={(e) => setSelectedIndex(Number(e.target.value))}
                      className="rounded-seek-md border border-slate-300 bg-white pl-2.5 pr-7 py-1 text-xs font-bold text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all hover:border-slate-400"
                    >
                      {allVersions.map((v, idx) => (
                        <option key={v.versionNumber || idx} value={idx}>
                          v{v.versionNumber || (allVersions.length - idx)} ({statusLabels[v.status] || v.status?.toUpperCase() || "DRAFT"}) {v.createdAt ? `• ${new Date(v.createdAt).toLocaleDateString()}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {selectedIndex > 0 && (
              <div className="flex items-center gap-2 rounded-seek-md bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-900 mt-1">
                <Icons.Info className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Та <strong>v{activeQuestion.versionNumber || (allVersions.length - selectedIndex)}</strong> өмнөх хувилбарыг үзэж байна. (Сүүлийн идэвхтэй хувилбар: v{allVersions[0]?.versionNumber || allVersions.length})
                </span>
              </div>
            )}

            <Text className="mt-seek-2 text-2xl font-extrabold text-slate-900">
              {activeQuestion.title || "Гарчиггүй даалгавар"}
            </Text>
          </div>
        </div>

        {/* Enhanced Metadata Card (Placed right below title and above question) */}
        <div className="mt-seek-4 rounded-seek-lg border border-slate-200 bg-slate-50/80 p-seek-4 shadow-seek-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-seek-3">
            {/* Type */}
            <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-2.5 border border-slate-200/80 shadow-seek-xs">
              <div className="h-8 w-8 rounded-seek-md bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <TypeIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <Text variant="muted" className="text-[11px] uppercase tracking-wider font-semibold">Төрөл</Text>
                <Text className="text-xs font-bold text-slate-800 truncate">{questionTypeLabels[activeQuestion.type]}</Text>
              </div>
            </div>

            {/* Scoring Mode */}
            <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-2.5 border border-slate-200/80 shadow-seek-xs">
              <div className="h-8 w-8 rounded-seek-md bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <Icons.OneOption className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <Text variant="muted" className="text-[11px] uppercase tracking-wider font-semibold">Оноо бодох</Text>
                <Text className="text-xs font-bold text-slate-800 truncate">{scoringModeLabels[scoringMode] || scoringMode}</Text>
              </div>
            </div>

            {/* Points (Max / Min) */}
            <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-2.5 border border-slate-200/80 shadow-seek-xs">
              <div className="h-8 w-8 rounded-seek-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Icons.MaxValue className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <Text variant="muted" className="text-[11px] uppercase tracking-wider font-semibold">Нийт оноо</Text>
                <Text className="text-xs font-bold text-slate-800">{totalPoints} оноо {minPoints < 0 ? `(${minPoints})` : ""}</Text>
              </div>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-2.5 border border-slate-200/80 shadow-seek-xs">
              <div className="h-8 w-8 rounded-seek-md bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                <Icons.Timer className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <Text variant="muted" className="text-[11px] uppercase tracking-wider font-semibold">Хугацаа</Text>
                <Text className="text-xs font-bold text-slate-800">{durationSeconds} сек</Text>
              </div>
            </div>
          </div>

          {/* Context Badges Bar */}
          <div className="mt-seek-3 pt-seek-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 text-xs">
              {activeQuestion.topicName || "Ерөнхий сэдэв"}
            </Badge>
            <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 text-xs">
              Блум: {bloomLabels[activeQuestion.bloomLevel] || activeQuestion.bloomLevel}
            </Badge>
            <Badge variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 text-xs">
              Хүндрэл: {difficultyLabels[activeQuestion.difficulty] || activeQuestion.difficulty}
            </Badge>
            <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700 text-xs">
              Чадамж: {competencyLabels[activeQuestion.competencyType] || activeQuestion.competencyType}
            </Badge>
          </div>
        </div>

        {/* Main Question Body & Interactive Learner Preview */}
        <div className="mt-seek-4 rounded-seek-lg border border-slate-200 bg-white p-seek-5 shadow-seek-xs">
          <LearnerQuestionPreview question={activeQuestion} />
        </div>

        {/* Feedback Cards Section (Designed to match QuestionEditor's feedback cards) */}
        <div className="mt-seek-5 space-y-seek-4">
          {/* Correct Feedback Card */}
          <div className="rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-success">
            <div className="flex">
              <div className="w-12 bg-success-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                <Icons.Check className="h-5 w-5 text-white bg-success rounded-full p-0.5" />
              </div>
              <div className="flex-1 p-seek-3">
                <Text className="text-xs font-bold text-success mb-1">Зөв хариулсан үеийн тайлбар:</Text>
                <div className="text-sm text-slate-700">
                  {activeQuestion.feedbackCorrect || activeQuestion.feedback ? (
                    <RichTextPreview value={activeQuestion.feedbackCorrect || activeQuestion.feedback} />
                  ) : (
                    <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Incorrect Feedback Card */}
          <div className="rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-danger">
            <div className="flex">
              <div className="w-12 bg-danger-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                <Icons.Close className="h-5 w-5 text-white bg-danger rounded-full p-0.5" />
              </div>
              <div className="flex-1 p-seek-3">
                <Text className="text-xs font-bold text-danger mb-1">Буруу хариулсан үеийн тайлбар:</Text>
                <div className="text-sm text-slate-700">
                  {activeQuestion.feedbackIncorrect ? (
                    <RichTextPreview value={activeQuestion.feedbackIncorrect} />
                  ) : (
                    <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Comments if exist */}
        {activeQuestion.workflowHistory && activeQuestion.workflowHistory.length > 0 && (
          <div className="mt-seek-5 border-t border-border pt-seek-4">
            <Text className="mb-2 font-semibold text-sm">Хяналтын түүх (Workflow comments)</Text>
            <div className="space-y-2">
              {activeQuestion.workflowHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-seek-md border border-border p-seek-3 text-sm bg-slate-50/40"
                >
                  <Text className="font-semibold text-xs">
                    {statusLabels[entry.status]} · {entry.actorName}
                  </Text>
                  <Text variant="muted" className="text-sm mt-1">{entry.comment}</Text>
                  <Text variant="muted" className="text-[11px] mt-1">
                    {entry.createdAt}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        )}

        {nextActions.length > 0 && (
          <div className="mt-seek-4 flex flex-wrap gap-2 border-t border-border pt-seek-4">
            {nextActions.map((action) => (
              <Badge key={action} variant={statusVariant[action]}>
                Дараагийн төлөв: {statusLabels[action]}
              </Badge>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function LearnerQuestionPreview({ question }: { question: QuestionBankItem }) {
  const stem = question.stem || question.body || "";

  return (
    <div className="space-y-seek-4">
      <div className="rounded-seek-md bg-slate-50/70 p-seek-4 border border-slate-100 text-slate-900">
        <RichTextPreview value={stem} isFillBlank={question.type === "FILL_BLANK"} />
      </div>
      <MediaPreview question={question} />
      <QuestionTypePreview question={question} />
    </div>
  );
}

// -------------------------------------------------------------
// Mermaid Diagram Renderer Component
// -------------------------------------------------------------
function MermaidViewer({ chart, compact = false }: { chart: string; compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderMermaid() {
      try {
        // Dynamically load mermaid from window or CDN if not present
        if (typeof window !== "undefined") {
          let mermaid = (window as any).mermaid;
          if (!mermaid) {
            await new Promise((resolve, reject) => {
              const existingScript = document.getElementById("mermaid-cdn-script");
              if (existingScript) {
                existingScript.addEventListener("load", resolve);
                return;
              }
              const script = document.createElement("script");
              script.id = "mermaid-cdn-script";
              script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
              script.onload = () => resolve(true);
              script.onerror = reject;
              document.head.appendChild(script);
            });
            mermaid = (window as any).mermaid;
          }

          if (mermaid) {
            mermaid.initialize({
              startOnLoad: false,
              theme: "neutral",
              securityLevel: "loose",
              fontFamily: "Inter, sans-serif",
            });

            const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
            const { svg } = await mermaid.render(id, chart.trim());
            if (isMounted) {
              setSvgHtml(svg);
              setError(null);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Диаграм зурахад алдаа гарлаа");
        }
      }
    }

    renderMermaid();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className={`${compact ? "my-1.5 p-2 text-[11px]" : "my-3 p-seek-3 text-xs"} rounded-seek-md border border-amber-200 bg-amber-50/60 text-amber-800`}>
        <div className="font-semibold flex items-center gap-1.5 mb-1">
          <span>❖ Mermaid диаграм</span>
        </div>
        <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-white/70 p-2 rounded border border-amber-200">{chart}</pre>
      </div>
    );
  }

  if (!svgHtml) {
    return (
      <div className={`${compact ? "my-1.5 p-2" : "my-3 p-seek-4"} rounded-seek-md border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-500`}>
        <span className="animate-pulse">❖ Диаграм ачаалж байна...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${compact ? "my-2 p-2 max-h-72" : "my-4 p-seek-4"} overflow-x-auto rounded-seek-lg border border-indigo-100 bg-indigo-50/20 flex justify-center shadow-seek-xs [&_svg]:max-w-full`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}

// -------------------------------------------------------------
// Comprehensive Markdown + KaTeX + Tables + Lists + Code Parser
// -------------------------------------------------------------
function RichTextPreview({ 
  value, 
  isFillBlank, 
  compact = false 
}: { 
  value: string; 
  isFillBlank?: boolean; 
  compact?: boolean;
}) {
  if (!value) return null;

  return (
    <div className={compact ? "space-y-1 text-sm leading-snug" : "space-y-seek-3 text-base leading-7"}>
      {parseMarkdownBlocks(value).map((block, index) => {
        if (block.type === "mermaid") {
          return <MermaidViewer key={`mermaid-${index}`} chart={block.content} compact={compact} />;
        }

        if (block.type === "code") {
          return (
            <div key={`code-${index}`} className="my-3 overflow-hidden rounded-seek-md border border-slate-800 bg-slate-900 text-slate-100 shadow-seek-sm">
              {block.lang && (
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] font-mono text-slate-400">
                  <span>{block.lang}</span>
                </div>
              )}
              <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-emerald-400">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        if (block.type === "table") {
          return <MarkdownTable key={`table-${index}`} rows={block.rows} isFillBlank={isFillBlank} />;
        }

        if (block.type === "heading") {
          const Tag = block.level === 1 ? "h2" : block.level === 2 ? "h3" : "h4";
          return (
            <Tag key={`heading-${index}`} className="font-bold text-slate-900 mt-2 mb-1">
              <InlineMath value={block.text} isFillBlank={isFillBlank} />
            </Tag>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote key={`quote-${index}`} className="my-2 border-l-4 border-primary/50 bg-primary/5 pl-4 py-1.5 italic text-slate-700 rounded-r">
              <InlineMath value={block.text} isFillBlank={isFillBlank} />
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="my-2 list-disc list-inside space-y-1 text-slate-800 pl-2">
              {block.items.map((item, i) => (
                <li key={i}>
                  <InlineMath value={item} isFillBlank={isFillBlank} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="text-slate-800">
            <InlineMath value={block.text} isFillBlank={isFillBlank} />
          </p>
        );
      })}
    </div>
  );
}

type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "table"; rows: string[][] }
  | { type: "mermaid"; content: string }
  | { type: "code"; lang: string; content: string }
  | { type: "heading"; level: number; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; items: string[] };

function parseMarkdownBlocks(value: string): MarkdownBlock[] {
  const lines = value.split("\n");
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let index = 0;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    const nextLine = lines[index + 1]?.trim();

    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }

    // 1. Mermaid Code Block
    if (line.startsWith("```mermaid")) {
      flushParagraph();
      index += 1;
      const mermaidLines: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        mermaidLines.push(lines[index]);
        index += 1;
      }
      index += 1; // skip closing ```
      blocks.push({ type: "mermaid", content: mermaidLines.join("\n") });
      continue;
    }

    // 2. Generic Code Block
    if (line.startsWith("```")) {
      flushParagraph();
      const lang = line.replace(/^```/, "").trim();
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1; // skip closing ```
      blocks.push({ type: "code", lang, content: codeLines.join("\n") });
      continue;
    }

    // 3. Headings (#, ##, ###)
    if (/^#{1,4}\s+/.test(line)) {
      flushParagraph();
      const level = line.match(/^(#{1,4})\s+/)?.[1].length || 1;
      const text = line.replace(/^#{1,4}\s+/, "");
      blocks.push({ type: "heading", level, text });
      index += 1;
      continue;
    }

    // 4. Blockquote (> ...)
    if (line.startsWith(">")) {
      flushParagraph();
      const quoteLines: string[] = [line.replace(/^>\s?/, "")];
      index += 1;
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // 5. Unordered List (- , * )
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [line.replace(/^[-*]\s+/, "")];
      index += 1;
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // 6. Markdown Table
    if (isMarkdownTableHeader(line, nextLine)) {
      flushParagraph();
      const rows: string[][] = [parseTableRow(line)];
      index += 2;

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(parseTableRow(lines[index].trim()));
        index += 1;
      }

      blocks.push({ type: "table", rows });
      continue;
    }

    paragraph.push(line);
    index += 1;
  }

  flushParagraph();
  return blocks;
}

function isMarkdownTableHeader(line: string, nextLine?: string) {
  return (
    line.startsWith("|") &&
    line.endsWith("|") &&
    Boolean(nextLine?.startsWith("|")) &&
    /^\|?[\s:-]+\|[\s|:-]+$/.test(nextLine || "")
  );
}

function parseTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function MarkdownTable({ rows, isFillBlank }: { rows: string[][]; isFillBlank?: boolean }) {
  if (!rows || rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="my-3 overflow-x-auto rounded-seek-md border border-slate-200 bg-white shadow-seek-xs">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {header.map((cell, index) => (
              <th key={`${cell}-${index}`} className="p-seek-3 font-semibold text-slate-800">
                <InlineMath value={cell} isFillBlank={isFillBlank} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50/50">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="p-seek-3 text-slate-700">
                  <InlineMath value={cell} isFillBlank={isFillBlank} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineMath({ value, isFillBlank }: { value: string; isFillBlank?: boolean }) {
  if (!value) return null;
  const segments = value.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$|!\[.*?\]\(.*?\))/g);
  let blankCounter = 0;

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.startsWith("$$") && segment.endsWith("$$")) {
          return (
            <MathExpression
              key={`${segment}-${index}`}
              expression={segment.slice(2, -2)}
              displayMode
            />
          );
        }

        if (segment.startsWith("$") && segment.endsWith("$")) {
          return (
            <MathExpression
              key={`${segment}-${index}`}
              expression={segment.slice(1, -1)}
            />
          );
        }

        if (segment.startsWith("![") && segment.endsWith(")")) {
          const match = segment.match(/!\[(.*?)\]\((.*?)\)/);
          if (match) {
            const [, alt, src] = match;
            return (
              <span 
                key={`${segment}-${index}`} 
                className="block my-seek-4 overflow-hidden rounded-seek-md border border-slate-200 bg-slate-50/50 p-1 flex justify-center"
              >
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-h-64 max-w-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </span>
            );
          }
        }

        if (isFillBlank) {
          const parts = segment.split(/(__+|{{blank_\d+}}|\[\[\d+\]\])/g);
          return (
            <span key={`${segment}-${index}`}>
              {parts.map((part, pIdx) => {
                if (part.startsWith("_") || part.startsWith("{{") || part.startsWith("[[")) {
                  blankCounter++;
                  return (
                    <input
                      key={pIdx}
                      type="text"
                      disabled
                      placeholder={`нүд ${blankCounter}`}
                      className="mx-1 px-2 py-0.5 w-24 h-7 text-xs border border-slate-300 rounded bg-white text-slate-800 inline-block align-middle font-semibold text-center shadow-inner"
                    />
                  );
                }
                return part;
              })}
            </span>
          );
        }

        return <span key={`${segment}-${index}`}>{segment}</span>;
      })}
    </>
  );
}

function MathExpression({
  expression,
  displayMode = false,
}: {
  expression: string;
  displayMode?: boolean;
}) {
  const html = renderLatex(expression, displayMode);

  return (
    <span className="mx-1 inline-flex items-center rounded-seek-sm bg-primary/10 px-2 py-1 align-middle text-primary">
      {html ? (
        <span
          className="text-current [&_.katex]:text-current"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <code className="font-mono">{expression}</code>
      )}
    </span>
  );
}

function renderLatex(expression: string, displayMode: boolean) {
  try {
    return katex.renderToString(expression.trim(), {
      displayMode,
      output: "html",
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return null;
  }
}

function MediaPreview({ question }: { question: QuestionBankItem }) {
  if (!question.media || question.media.length === 0) return null;

  return (
    <div className="grid gap-seek-3 md:grid-cols-2 mt-seek-4">
      {question.media.map((item, idx) => {
        const fileUrl = item.url;
        
        return (
          <div
            key={`${item.type}-${idx}`}
            className="rounded-seek-md border border-border bg-surface p-seek-3 flex flex-col justify-between"
          >
            {item.type === "image" && (
              <div className="overflow-hidden rounded-seek-md bg-muted-background flex items-center justify-center border border-border">
                <img
                  src={fileUrl}
                  alt={item.name}
                  className="max-h-64 max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            
            {item.type === "video" && (
              <div className="overflow-hidden rounded-seek-md bg-black border border-border flex items-center justify-center">
                <video
                  src={fileUrl}
                  controls
                  className="max-h-64 w-full"
                />
              </div>
            )}
            
            {item.type === "audio" && (
              <div className="rounded-seek-md bg-muted-background p-seek-3 border border-border">
                <Text className="font-semibold text-sm mb-2 truncate">{item.name}</Text>
                <audio
                  src={fileUrl}
                  controls
                  className="w-full"
                />
              </div>
            )}
            
            {item.type === "file" && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-seek-md bg-muted-background p-seek-3 border border-border hover:bg-muted-background/80"
              >
                <Icons.Calendar className="h-8 w-8 text-primary" />
                <div className="min-w-0 flex-1">
                  <Text className="font-semibold text-sm truncate">Хавсралт файл (Татах)</Text>
                  <Text variant="muted" className="text-xs truncate">
                    {item.name}
                  </Text>
                </div>
              </a>
            )}
            
            {item.type !== "file" && (
              <Text variant="muted" className="mt-2 text-xs truncate">
                {item.name}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
}

// -------------------------------------------------------------
// Options Preview: Styled with Left Indicator Strip & Color Borders
// (Positive -> Green, Negative -> Red, Neutral/0 -> Gray)
// -------------------------------------------------------------
function QuestionTypePreview({ question }: { question: QuestionBankItem }) {
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
              value={question.options?.[0]?.content || ""}
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
                : [{ value: opt.content || "-", score: opt.score || 1, caseSensitive: false }];

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
                      <RichTextPreview value={option.content || option.value || ""} compact />
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
                question.options.map(o => ({ id: o.id, value: o.matchValue })).filter(o => o.value)
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

  // SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, LIKERT, MATRIX, etc.
  return (
    <div className="space-y-seek-4">
      <div className="space-y-2.5">
        {question.options.map((option, index) => {
          const score = Number(option.score !== undefined && option.score !== null ? option.score : (option.isCorrect ? 1 : 0));
          const isPositive = score > 0;
          const isNegative = score < 0;
          const isNeutral = score === 0;

          const cardBorderClass = isPositive
            ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/15"
            : isNegative
            ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/15"
            : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/20";

          const indicatorBgClass = isPositive
            ? "bg-emerald-500 text-white shadow-sm font-bold"
            : isNegative
            ? "bg-rose-500 text-white shadow-sm font-bold"
            : "bg-slate-200 text-slate-700 font-bold";

          return (
            <div
              key={option.id || index}
              className={`rounded-seek-lg border overflow-hidden transition-all duration-200 shadow-seek-xs ${cardBorderClass}`}
            >
              <div className="flex">
                {/* Left Indicator Strip with Label */}
                <div className={`w-12 flex items-center justify-center font-bold text-sm tracking-wider flex-shrink-0 select-none ${indicatorBgClass}`}>
                  {option.label || String.fromCharCode(65 + index)}
                </div>

                {/* Content & Score Badge */}
                <div className="flex-1 p-seek-3.5 flex items-center justify-between gap-3">
                  <div className="text-sm text-slate-800 flex-1">
                    <RichTextPreview value={option.content || option.value || ""} compact />
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={isPositive ? "success" : isNegative ? "danger" : "secondary"}
                      className="font-mono text-xs"
                    >
                      {isPositive ? `+${score}` : `${score}`} оноо
                    </Badge>
                  </div>
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

function CombinationScoresDisplay({ 
  question, 
  combinations 
}: { 
  question: QuestionBankItem; 
  combinations: any[];
}) {
  return (
    <div className="mt-seek-4 border-t border-border pt-seek-4">
      <Text className="text-xs font-bold text-slate-800 mb-seek-3 flex items-center gap-2 uppercase tracking-wider">
        <Icons.OneOption className="h-4 w-4 text-purple-600" />
        <span>Хослолын онооны тохиргоо (Combination Scores)</span>
      </Text>
      <div className="grid gap-seek-3 sm:grid-cols-2">
        {combinations.map((combo: any, idx: number) => {
          const isPositive = Number(combo.score) > 0;
          const isNegative = Number(combo.score) < 0;
          
          let comboDescription = "";
          if (question.type === "MULTIPLE_CHOICE") {
            const selectedLabels = (combo.ids || combo.answers || [])
              .map((id: string) => {
                const opt = question.options.find((o) => o.id === id || o.label === id);
                return opt ? opt.label : id;
              })
              .filter(Boolean)
              .join(", ");
            comboDescription = `Сонголтууд: [${selectedLabels || "Хоосон"}]`;
          } else if (question.type === "MATCHING") {
            const pairs = (combo.ids || combo.answers || [])
              .map((pairStr: string) => {
                const [leftId, rightId] = pairStr.split(":");
                const leftOpt = question.options.find((o) => o.id === leftId || o.label === leftId);
                const rightOptions = 
                  question.scoringConfig?.rightOptions || 
                  (question.contentJson as any)?.scoringConfig?.rightOptions || 
                  (question.contentJson as any)?.payload?.scoringConfig?.rightOptions || 
                  [];
                const rightOpt = rightOptions.find((r: any) => r.id === rightId);
                
                if (leftOpt && rightOpt) {
                  return `${leftOpt.label} ↔ ${rightOpt.value}`;
                }
                return pairStr;
              })
              .filter(Boolean)
              .join(" | ");
            comboDescription = `Харгалзаа: ${pairs || "Хоосон"}`;
          } else {
            comboDescription = `Хослол ${idx + 1}`;
          }

          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-seek-md border px-seek-3.5 py-seek-2 text-xs transition-all ${
                isPositive
                  ? "border-emerald-200 bg-emerald-50/30 text-emerald-900"
                  : isNegative
                  ? "border-rose-200 bg-rose-50/30 text-rose-900"
                  : "border-border bg-slate-50 text-slate-700"
              }`}
            >
              <span className="font-semibold truncate mr-2" title={comboDescription}>
                {comboDescription}
              </span>
              <Badge variant={isPositive ? "success" : isNegative ? "danger" : "secondary"} className="shrink-0 font-mono text-xs">
                {isPositive ? `+${combo.score}` : combo.score} оноо
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionPreviewModal;
