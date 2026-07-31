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
  if (question.media.length === 0) return null;

  return (
    <div className="grid gap-seek-3 md:grid-cols-2">
      {question.media.map((item) => (
        <div
          key={`${item.type}-${item.name}`}
          className="rounded-seek-md border border-border bg-surface p-seek-3"
        >
          {item.type === "image" && (
            <div className="grid aspect-video place-items-center rounded-seek-md bg-gradient-to-br from-primary/10 to-cyan-100 text-primary">
              <div className="text-center">
                <Icons.Info className="mx-auto h-8 w-8" />
                <Text className="mt-2 text-sm font-semibold">{item.name}</Text>
              </div>
            </div>
          )}
          {item.type === "video" && (
            <div className="grid aspect-video place-items-center rounded-seek-md bg-slate-900 text-white">
              <Text className="font-semibold">Видео preview · {item.name}</Text>
            </div>
          )}
          {item.type === "audio" && (
            <div className="rounded-seek-md bg-muted-background p-seek-4">
              <Text className="font-semibold">Аудио файл</Text>
              <div className="mt-seek-3 h-2 rounded-seek-full bg-primary/30" />
              <Text variant="muted" className="mt-2 text-sm">
                {item.name}
              </Text>
            </div>
          )}
          {item.type === "file" && (
            <div className="flex items-center gap-3 rounded-seek-md bg-muted-background p-seek-4">
              <Icons.Calendar className="h-8 w-8 text-primary" />
              <div>
                <Text className="font-semibold">Хавсралт файл</Text>
                <Text variant="muted" className="text-sm">
                  {item.name}
                </Text>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function QuestionTypePreview({ question }: { question: QuestionBankItem }) {
  if (question.type === "essay") {
    return (
      <Textarea
        rows={7}
        disabled
        placeholder="Суралцагч энд бичгийн хариултаа оруулна..."
      />
    );
  }

  if (question.type === "fill_blank" || question.type === "numeric") {
    return (
      <div className="rounded-seek-md border border-border bg-surface p-seek-4">
        <Text variant="muted" className="mb-2 text-sm">
          {question.type === "numeric"
            ? "Тоон хариултаа оруулна уу"
            : "Хоосон зайг нөхнө үү"}
        </Text>
        <Input
          disabled
          placeholder={question.type === "numeric" ? "Жишээ: 24" : "Хариулт"}
        />
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
