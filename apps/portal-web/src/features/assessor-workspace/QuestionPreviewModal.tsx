"use client";

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
import { getNextWorkflowActions } from "./api";
import {
  bloomLabels,
  competencyLabels,
  difficultyLabels,
  questionTypeLabels,
  statusLabels,
} from "./mock-data";
import type { QuestionBankItem, QuestionWorkflowStatus } from "./types";

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
  const nextActions = getNextWorkflowActions(question.status);

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-slate-900/60 backdrop-blur-sm p-seek-4 transition-all duration-300">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-6 shadow-2xl relative border-slate-200">
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

        <div className="flex items-start justify-between gap-seek-4 pr-seek-6">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant={statusVariant[question.status]}>
                {statusLabels[question.status]}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                {questionTypeLabels[question.type]}
              </Badge>
            </div>
            <Text className="mt-seek-2.5 text-xl font-extrabold text-slate-900">
              {question.code} · {question.title}
            </Text>
            <Text variant="muted" className="mt-1 text-sm">
              Ангилал: {competencyLabels[question.competencyType]}
            </Text>
          </div>
        </div>

        <div className="mt-seek-4 rounded-seek-lg border border-slate-100 bg-slate-50/50 p-seek-4 shadow-sm">
          <div className="mb-seek-3 flex flex-wrap items-center gap-2 border-b border-slate-100 pb-seek-3">
            <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700">{bloomLabels[question.bloomLevel]}</Badge>
            <Badge variant="secondary" className="bg-white border-slate-200 text-slate-700">{question.topicName}</Badge>
            <Badge variant="warning" className="bg-amber-50 border-amber-200 text-amber-800">{difficultyLabels[question.difficulty]}</Badge>
            <Badge variant="secondary" className="bg-primary/5 border-primary/20 text-primary font-semibold">{question.points} оноо</Badge>
          </div>
          <LearnerQuestionPreview question={question} />
        </div>

        <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-3">
          <InfoPanel 
            title="Зөв хариулт" 
            body={question.answerKey} 
          />
          <InfoPanel 
            title="Зөв хариултын feedback" 
            body={question.feedbackCorrect || question.feedback || "Тайлбар тохируулаагүй."} 
            rich 
          />
          <InfoPanel 
            title="Буруу хариултын feedback" 
            body={question.feedbackIncorrect || "Тайлбар тохируулаагүй."} 
            rich 
          />
        </div>

        <div className="mt-seek-4">
          <Text className="mb-2 font-semibold">Workflow comments</Text>
          <div className="space-y-2">
            {question.workflowHistory.map((entry) => (
              <div
                key={entry.id}
                className="rounded-seek-md border border-border p-seek-3 text-sm"
              >
                <Text className="font-semibold">
                  {statusLabels[entry.status]} · {entry.actorName}
                </Text>
                <Text variant="muted">{entry.comment}</Text>
                <Text variant="muted" className="text-xs">
                  {entry.createdAt}
                </Text>
              </div>
            ))}
          </div>
        </div>

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
  return (
    <div className="space-y-seek-4">
      <div className="prose max-w-none rounded-seek-md bg-muted-background p-seek-4 text-foreground">
        <RichTextPreview value={question.stem} isFillBlank={question.type === "FILL_BLANK"} />
      </div>
      <MediaPreview question={question} />
      <QuestionTypePreview question={question} />
    </div>
  );
}

function RichTextPreview({ value, isFillBlank }: { value: string; isFillBlank?: boolean }) {
  return (
    <div className="space-y-seek-3 text-base leading-7">
      {parseMarkdownBlocks(value).map((block, index) => {
        if (block.type === "table") {
          return <MarkdownTable key={`table-${index}`} rows={block.rows} isFillBlank={isFillBlank} />;
        }

        return (
          <p key={`paragraph-${index}`} className="text-foreground">
            <InlineMath value={block.text} isFillBlank={isFillBlank} />
          </p>
        );
      })}
    </div>
  );
}

type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "table"; rows: string[][] };

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
    const line = lines[index].trim();
    const nextLine = lines[index + 1]?.trim();

    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }

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
  const [header, ...body] = rows;

  return (
    <div className="overflow-x-auto rounded-seek-md border border-border bg-surface">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <thead className="bg-muted-background">
          <tr>
            {header.map((cell, index) => (
              <th key={`${cell}-${index}`} className="p-seek-3 font-semibold">
                <InlineMath value={cell} isFillBlank={isFillBlank} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="p-seek-3">
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
          const parts = segment.split(/(__+)/g);
          return (
            <span key={`${segment}-${index}`}>
              {parts.map((part, pIdx) => {
                if (part.startsWith("_")) {
                  blankCounter++;
                  return (
                    <input
                      key={pIdx}
                      type="text"
                      placeholder={`blank${blankCounter}`}
                      className="mx-1 px-2 py-0.5 w-24 h-7 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:border-blue-500 focus:outline-none inline-block align-middle font-semibold text-center shadow-inner"
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
    return (
      <Textarea
        rows={7}
        disabled
        placeholder="Суралцагч энд бичгийн хариултаа оруулна..."
      />
    );
  }

  if (question.type === "FILL_BLANK" || question.type === "NUMERIC") {
    return (
      <div className="rounded-seek-md border border-border bg-surface p-seek-4">
        <Text variant="muted" className="mb-2 text-sm">
          {question.type === "NUMERIC"
            ? "Тоон хариултаа оруулна уу"
            : "Хоосон зайг нөхнө үү"}
        </Text>
        <Input
          disabled
          placeholder={question.type === "NUMERIC" ? "Жишээ: 24" : "Хариулт"}
        />
      </div>
    );
  }

  if (question.type === "MATCHING") {
    return (
      <div className="space-y-seek-4">
        <div className="space-y-seek-3">
          <Text variant="muted" className="text-sm">Дараах утгуудыг зөв харгалзуулна уу:</Text>
          <div className="grid gap-seek-3 md:grid-cols-2">
            <div className="space-y-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase">Зүүн тал</Text>
              {question.options.map((option, idx) => (
                <div key={`left-${option.id}-${idx}`} className="rounded-seek-md border border-border bg-muted-background/40 p-seek-3">
                  {idx + 1}. <InlineMath value={option.content} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Text className="text-xs font-semibold text-muted-foreground uppercase">Баруун тал</Text>
              {(
                question.scoringConfig?.rightOptions || 
                (question.contentJson as any)?.scoringConfig?.rightOptions ||
                (question.contentJson as any)?.payload?.scoringConfig?.rightOptions ||
                question.options.map(o => ({ id: o.id, value: o.matchValue })).filter(o => o.value)
              )
                .map((valObj: any, idx: number) => (
                  <div key={`right-${valObj.id || idx}`} className="rounded-seek-md border border-border bg-surface p-seek-3 cursor-pointer hover:border-slate-800">
                    {String.fromCharCode(65 + idx)}. <InlineMath value={valObj.value || ""} />
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

  return (
    <div className="space-y-seek-4">
      <div className="space-y-2">
        {question.options.map((option) => {
          const hasScore = option.score !== undefined && option.score !== null;
          const isPositive = hasScore && Number(option.score) > 0;
          const isNegative = hasScore && Number(option.score) < 0;

          let cardStyles = "border-border bg-surface hover:bg-slate-50/50";
          if (isPositive) {
            cardStyles = "border-success/30 bg-success/5 text-success-foreground hover:bg-success/10";
          } else if (isNegative) {
            cardStyles = "border-danger/30 bg-danger/5 text-danger-foreground hover:bg-danger/10";
          }

          return (
            <label
              key={option.id}
              className={`flex items-center justify-between gap-3 rounded-seek-md border p-seek-3 transition-all cursor-not-allowed select-none ${cardStyles}`}
            >
              <div className="flex items-center gap-3">
                <span className={`grid h-5 w-5 place-items-center rounded-full border ${isPositive ? "border-success/40 bg-success/10 text-success" : isNegative ? "border-danger/40 bg-danger/10 text-danger" : "border-border bg-muted-background"}`}>
                  {isPositive && "✓"}
                  {isNegative && "✕"}
                </span>
                <span>
                  {option.label}. <InlineMath value={option.content} />
                </span>
              </div>
              {hasScore && Number(option.score) !== 0 && (
                <Badge
                  variant={isPositive ? "success" : "danger"}
                  className="font-mono text-xs shrink-0"
                >
                  {isPositive ? `+${option.score}` : `${option.score}`} оноо
                </Badge>
              )}
            </label>
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
      <Text className="text-sm font-semibold text-foreground mb-seek-3 flex items-center gap-2">
        <Icons.OneOption className="h-4 w-4 text-primary" />
        <span>Хослолын онооны тохиргоо (Combination Scores)</span>
      </Text>
      <div className="grid gap-seek-3 sm:grid-cols-2">
        {combinations.map((combo: any, idx: number) => {
          const isPositive = Number(combo.score) > 0;
          const isNegative = Number(combo.score) < 0;
          
          let comboDescription = "";
          if (question.type === "MULTIPLE_CHOICE") {
            const selectedLabels = (combo.ids || [])
              .map((id: string) => {
                const opt = question.options.find((o) => o.id === id);
                return opt ? opt.label : "";
              })
              .filter(Boolean)
              .join(", ");
            comboDescription = `Сонголтууд: [${selectedLabels || "Хоосон"}]`;
          } else if (question.type === "MATCHING") {
            const pairs = (combo.ids || [])
              .map((pairStr: string) => {
                const [leftId, rightId] = pairStr.split(":");
                const leftOpt = question.options.find((o) => o.id === leftId);
                const rightOptions = 
                  question.scoringConfig?.rightOptions || 
                  (question.contentJson as any)?.scoringConfig?.rightOptions || 
                  (question.contentJson as any)?.payload?.scoringConfig?.rightOptions || 
                  [];
                const rightOpt = rightOptions.find((r: any) => r.id === rightId);
                
                if (leftOpt && rightOpt) {
                  return `${leftOpt.label} ↔ ${rightOpt.value}`;
                }
                return "";
              })
              .filter(Boolean)
              .join(" | ");
            comboDescription = `Харгалзаа: ${pairs || "Хоосон"}`;
          }

          return (
            <div
              key={idx}
              className={`flex items-center justify-between rounded-seek-md border px-seek-4 py-seek-2.5 text-sm transition-all ${
                isPositive
                  ? "border-success/20 bg-success/5 text-success-foreground"
                  : isNegative
                  ? "border-danger/20 bg-danger/5 text-danger-foreground"
                  : "border-border bg-muted-background text-muted-foreground"
              }`}
            >
              <span className="font-medium truncate mr-2" title={comboDescription}>
                {comboDescription}
              </span>
              <Badge variant={isPositive ? "success" : isNegative ? "danger" : "secondary"} className="shrink-0 font-mono">
                {isPositive ? `+${combo.score}` : combo.score} оноо
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoPanel({
  title,
  body,
  rich = false,
}: {
  title: string;
  body: string;
  rich?: boolean;
}) {
  return (
    <div className="rounded-seek-md border border-border p-seek-3">
      <Text className="text-sm font-semibold">{title}</Text>
      <div className="mt-1 text-sm text-muted-foreground">
        {rich ? <RichTextPreview value={body} /> : body}
      </div>
    </div>
  );
}
