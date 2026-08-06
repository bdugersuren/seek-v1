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
    <div className="fixed inset-0 z-modal grid place-items-center bg-black/45 p-seek-4">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-5">
        <div className="flex items-start justify-between gap-seek-4">
          <div>
            <Badge variant={statusVariant[question.status]}>
              {statusLabels[question.status]}
            </Badge>
            <Text className="mt-seek-3 text-xl font-bold">
              {question.code} · {question.title}
            </Text>
            <Text variant="muted" className="mt-1">
              {questionTypeLabels[question.type]} ·{" "}
              {competencyLabels[question.competencyType]}
            </Text>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Хаах
          </Button>
        </div>

        <div className="mt-seek-4 rounded-seek-lg border border-border bg-surface p-seek-4">
          <div className="mb-seek-3 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{bloomLabels[question.bloomLevel]}</Badge>
            <Badge variant="secondary">{question.topicName}</Badge>
            <Badge variant="warning">{difficultyLabels[question.difficulty]}</Badge>
            <Badge variant="secondary">{question.points} оноо</Badge>
          </div>
          <LearnerQuestionPreview question={question} />
        </div>

        <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-2">
          <InfoPanel title="Зөв хариулт" body={question.answerKey} />
          <InfoPanel title="Feedback" body={question.feedback} rich />
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
        <RichTextPreview value={question.stem} />
      </div>
      <MediaPreview question={question} />
      <QuestionTypePreview question={question} />
    </div>
  );
}

function RichTextPreview({ value }: { value: string }) {
  return (
    <div className="space-y-seek-3 text-base leading-7">
      {parseMarkdownBlocks(value).map((block, index) => {
        if (block.type === "table") {
          return <MarkdownTable key={`table-${index}`} rows={block.rows} />;
        }

        return (
          <p key={`paragraph-${index}`} className="text-foreground">
            <InlineMath value={block.text} />
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

function MarkdownTable({ rows }: { rows: string[][] }) {
  const [header, ...body] = rows;

  return (
    <div className="overflow-x-auto rounded-seek-md border border-border bg-surface">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <thead className="bg-muted-background">
          <tr>
            {header.map((cell, index) => (
              <th key={`${cell}-${index}`} className="p-seek-3 font-semibold">
                <InlineMath value={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-border">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="p-seek-3">
                  <InlineMath value={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineMath({ value }: { value: string }) {
  const segments = value.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$)/g);

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
    );
  }

  return (
    <div className="space-y-2">
      {question.options.map((option) => (
        <label
          key={option.id}
          className="flex items-center gap-3 rounded-seek-md border border-border bg-surface p-seek-3"
        >
          <span className="grid h-5 w-5 place-items-center rounded-full border border-border" />
          <span>
            {option.label}. <InlineMath value={option.content} />
          </span>
        </label>
      ))}
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
