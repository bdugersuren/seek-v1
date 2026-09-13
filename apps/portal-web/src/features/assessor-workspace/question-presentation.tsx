import { Icons } from "@seek/ui";
import type { QuestionType } from "./types";
import { questionTypeLabels } from "./mock-data";
export const questionTypeIcons: Record<
  QuestionType,
  React.ComponentType<any>
> = {
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
export function QuestionTypeBadge({ type }: { type: QuestionType }) {
  const Icon = questionTypeIcons[type] || Icons.ShortText;
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-4 w-4 shrink-0" />
      <span>{questionTypeLabels[type] || "Тодорхойгүй төрөл"}</span>
    </span>
  );
}

export function QuestionStatistics({
  question,
}: {
  question: import("./types").QuestionBankItem;
}) {
  const stats = question.statistics;
  if (!stats)
    return (
      <span className="text-xs text-muted-foreground">
        Статистик түр боломжгүй
      </span>
    );
  const rate = stats.gradedCount
    ? Math.round((100 * stats.correctCount) / stats.gradedCount)
    : null;
  return (
    <span
      className="block text-xs"
      title={`Бүрэн оноо авсан, эцэслэн үнэлэгдсэн хариултын хувь. Шинэчилсэн: ${new Date(stats.asOf).toLocaleString("mn-MN")}`}
    >
      <span className="block">
        {question.type === "LIKERT"
          ? "Хамаарахгүй"
          : rate === null
            ? "Өгөгдөлгүй"
            : `${rate}% · n=${stats.gradedCount}`}
      </span>
      <span className="block text-muted-foreground">
        {stats.usageCount} удаа ашигласан
      </span>
    </span>
  );
}

export function QuestionDifficulty({
  question,
}: {
  question: import("./types").QuestionBankItem;
}) {
  const palette = ["#047857", "#0369a1", "#a16207", "#c2410c", "#be123c"];
  const color =
    question.difficultyColor && /^#[0-9a-f]{6}$/i.test(question.difficultyColor)
      ? question.difficultyColor
      : question.difficultyName
        ? palette[Math.min(4, Math.max(0, (question.difficultyRank || 1) - 1))]
        : "#64748b";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <span
        className="h-2 w-2 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
      />
      {question.difficultyName || "Түвшин сонгоогүй"}
    </span>
  );
}
