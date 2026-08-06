"use client";

import { type DragEvent, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Button,
  Checkbox,
  Icons,
  Input,
  PageContainer,
  Radio,
  Text,
  Textarea,
  useToast,
} from "@seek/ui";
import { mockCandidateAttempt } from "@/features/candidate-attempt/mock-data";
import { getAnsweredCount, isAnswered } from "@/features/candidate-attempt/api";
import type {
  CandidateAnswerValue,
  CandidateAnswers,
  CandidateQuestion,
  CandidateAttempt,
} from "@/features/candidate-attempt/types";

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function processAttempt(source: CandidateAttempt): CandidateAttempt {
  if (!source.shuffleAnswers) {
    return source;
  }
  return {
    ...source,
    questions: source.questions.map((q) => {
      if (q.options) {
        return {
          ...q,
          options: shuffleArray(q.options),
        };
      }
      return q;
    }),
  };
}

const typeLabels: Record<CandidateQuestion["type"], string> = {
  single_choice: "SINGLE CHOICE",
  multiple_choice: "MULTIPLE CHOICE",
  matching: "MATCHING",
  ordering: "ORDERING",
  fill_blank: "FILL IN THE BLANK",
  matrix: "MATRIX",
  numeric: "NUMERIC",
  likert: "LIKERT SCALE",
  sjt: "SJT",
  case_bundle: "CASE BUNDLE",
  essay: "ESSAY",
};

function getStringAnswer(answer: CandidateAnswerValue | undefined) {
  return typeof answer === "string" ? answer : "";
}

function getStringArrayAnswer(answer: CandidateAnswerValue | undefined) {
  return Array.isArray(answer) ? answer : [];
}

function getMapAnswer(answer: CandidateAnswerValue | undefined) {
  return answer && !Array.isArray(answer) && typeof answer === "object"
    ? answer
    : {};
}

function reorderItems(items: string[], fromIndex: number, toIndex: number) {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(fromIndex, 1);

  if (!movedItem) {
    return items;
  }

  nextItems.splice(toIndex, 0, movedItem);

  return nextItems;
}

export default function TakeAssessmentPage() {
  const params = useParams<{ attemptId: string }>();
  const { showToast } = useToast();
  const [attempt] = useState<CandidateAttempt>(() => processAttempt(mockCandidateAttempt));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<CandidateAnswers>({});
  const [visited, setVisited] = useState<Record<string, boolean>>({
    [attempt.questions[0]?.id ?? ""]: true,
  });
  const [marked, setMarked] = useState<Record<string, boolean>>({});
  const [submitOpen, setSubmitOpen] = useState(false);
  const [navigatorView, setNavigatorView] = useState<"grid" | "list">("grid");
  const [connectionStatus, setConnectionStatus] =
    useState("Холбогдож байна...");

  const currentQuestion = attempt.questions[currentIndex];
  const answeredCount = useMemo(() => getAnsweredCount(answers), [answers]);
  const unansweredQuestions = useMemo(
    () =>
      attempt.questions
        .map((question, index) => ({ question, index }))
        .filter(({ question }) => !isAnswered(answers[question.id])),
    [answers, attempt.questions],
  );

  const answeredMarkedCount = attempt.questions.filter(
    (question) => isAnswered(answers[question.id]) && marked[question.id],
  ).length;
  const markedCount = Object.values(marked).filter(Boolean).length;
  const notVisitedCount = attempt.questions.filter(
    (question) => !visited[question.id],
  ).length;
  const unansweredCount = attempt.questions.length - answeredCount;

  const navigateToQuestion = (index: number) => {
    const question = attempt.questions[index];
    if (!question) {
      return;
    }

    setCurrentIndex(index);
    setVisited((current) => ({ ...current, [question.id]: true }));
  };

  const updateAnswer = (
    questionId: string,
    value: CandidateAnswerValue | undefined,
  ) => {
    setAnswers((current) => {
      const next = { ...current };

      if (!value || !isAnswered(value)) {
        delete next[questionId];
      } else {
        next[questionId] = value;
      }

      return next;
    });
    setConnectionStatus("Local draft хадгалагдлаа");
  };

  const clearAnswer = () => {
    updateAnswer(currentQuestion.id, undefined);
  };

  const saveAndMove = () => {
    if (currentIndex === attempt.questions.length - 1) {
      setSubmitOpen(true);
      return;
    }

    navigateToQuestion(currentIndex + 1);
    showToast("Хариулт хадгалагдлаа.", "success");
  };

  const toggleMark = () => {
    setMarked((current) => ({
      ...current,
      [currentQuestion.id]: !current[currentQuestion.id],
    }));
  };

  const submitAttempt = () => {
    setSubmitOpen(false);
    showToast("Тест илгээх demo workflow ажиллалаа.", "success");
  };

  if (params.attemptId !== attempt.id) {
    return (
      <PageContainer>
        <div className="rounded-seek-lg border border-border bg-surface p-seek-6">
          <h1 className="font-sans text-2xl font-bold text-foreground">
            Attempt олдсонгүй
          </h1>
          <Text variant="muted" className="mt-seek-2">
            Сонгосон attempt mock candidate data дотор байхгүй байна.
          </Text>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-none bg-muted-background px-seek-2 py-seek-2 sm:px-seek-4">
      <div className="space-y-seek-4">
        <section className="rounded-seek-lg border border-warning bg-warning-background px-seek-4 py-seek-3 text-sm text-warning">
          Энэ `/take` route нь зөвхөн portal prototype fallback/demo юм. Production
          шалгалтын runtime нь `assessment-web` дээр ажиллана.
        </section>

        <section className="flex min-h-28 items-center justify-between gap-seek-4 rounded-seek-lg border border-border bg-surface px-seek-5 py-seek-4 shadow-seek-sm">
          <div>
            <h1 className="font-sans text-xl font-bold text-foreground">
              {attempt.assessmentTitle}
            </h1>
            <div className="mt-seek-2 flex flex-wrap items-center gap-seek-2 text-sm text-muted-foreground">
              <span>
                {currentIndex + 1} / {attempt.questions.length} асуулт
              </span>
              <span className="h-2 w-2 rounded-full bg-warning" />
              <span>{connectionStatus}</span>
            </div>
          </div>
          <div
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full"
            style={{
              background: "conic-gradient(#f59e0b 0 78%, #e5e7eb 78% 100%)",
            }}
            aria-label="Үлдсэн хугацаа 3 минут 52 секунд"
          >
            <div className="grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full bg-surface font-mono text-sm font-bold text-warning">
              03:52
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-seek-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="flex min-h-[42rem] flex-col overflow-hidden rounded-seek-lg border border-border bg-surface shadow-seek-sm">
            <div className="flex flex-wrap items-center justify-between gap-seek-3 border-b border-border px-seek-4 py-seek-3 sm:px-seek-5">
              <div className="flex flex-wrap items-center gap-seek-3">
                <Button type="button" variant="outline" size="sm">
                  <Icons.Close className="h-4 w-4" aria-hidden="true" />
                  Focus Mode
                </Button>
                <div className="font-sans text-sm text-foreground">
                  <span className="text-muted-foreground">
                    {currentQuestion.code} of {attempt.questions.length}
                  </span>{" "}
                  | {typeLabels[currentQuestion.type]}
                </div>
              </div>
              <Text variant="muted" className="text-sm">
                {currentQuestion.points} оноо
              </Text>
            </div>

            <div className="flex-1 px-seek-4 py-seek-8 sm:px-seek-6">
              <QuestionRenderer
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onChange={(value) => updateAnswer(currentQuestion.id, value)}
              />
            </div>

            <div className="flex flex-col gap-seek-3 border-t border-border px-seek-4 py-seek-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-seek-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-danger text-danger hover:bg-danger-background"
                  onClick={clearAnswer}
                >
                  Clear Answer
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-warning text-warning hover:bg-warning-background"
                  onClick={toggleMark}
                >
                  Mark for Review
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={() => navigateToQuestion(currentIndex - 1)}
                >
                  <Icons.ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  Өмнөх
                </Button>
              </div>

              <Button
                type="button"
                className="bg-slate-950 text-white hover:bg-slate-800"
                disabled={
                  currentIndex === attempt.questions.length - 1 &&
                  unansweredCount > 0
                }
                onClick={saveAndMove}
              >
                {currentIndex === attempt.questions.length - 1
                  ? "Save & Finish"
                  : "Save & Next ->"}
              </Button>
            </div>
          </div>

          <aside className="overflow-hidden rounded-seek-lg border border-border bg-surface shadow-seek-sm xl:sticky xl:top-seek-4">
            <div className="flex items-center justify-between border-b border-border px-seek-5 py-seek-4">
              <div className="flex items-center gap-seek-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <h2 className="font-sans text-lg font-bold text-foreground">
                  {answeredCount}/{attempt.questions.length} Хариулсан
                </h2>
              </div>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-seek-md text-muted-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
                aria-label={
                  navigatorView === "grid"
                    ? "Асуултын жагсаалт харах"
                    : "Асуултын grid харах"
                }
                onClick={() =>
                  setNavigatorView((current) =>
                    current === "grid" ? "list" : "grid",
                  )
                }
              >
                {navigatorView === "grid" ? (
                  <span className="grid grid-cols-2 gap-0.5" aria-hidden="true">
                    <span className="h-1.5 w-1.5 rounded-sm border border-current" />
                    <span className="h-1.5 w-1.5 rounded-sm border border-current" />
                    <span className="h-1.5 w-1.5 rounded-sm border border-current" />
                    <span className="h-1.5 w-1.5 rounded-sm border border-current" />
                  </span>
                ) : (
                  <Icons.Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>

            <div className="min-h-80 px-seek-4 py-seek-4">
              {navigatorView === "grid" ? (
                <div className="grid grid-cols-6 gap-seek-2 xl:grid-cols-5">
                  {attempt.questions.map((question, index) => (
                    <QuestionNumberButton
                      key={question.id}
                      index={index}
                      active={index === currentIndex}
                      answered={isAnswered(answers[question.id])}
                      marked={Boolean(marked[question.id])}
                      onClick={() => navigateToQuestion(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="max-h-80 space-y-seek-2 overflow-y-auto pr-seek-1">
                  {attempt.questions.map((question, index) => (
                    <QuestionListButton
                      key={question.id}
                      question={question}
                      index={index}
                      active={index === currentIndex}
                      answered={isAnswered(answers[question.id])}
                      marked={Boolean(marked[question.id])}
                      onClick={() => navigateToQuestion(index)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-border px-seek-4 py-seek-4">
              <div className="grid grid-cols-1 gap-seek-2 text-xs text-muted-foreground sm:grid-cols-2 xl:grid-cols-2">
                <Legend
                  color="bg-success"
                  label={`${answeredCount} Хариулсан`}
                />
                <Legend
                  color="bg-danger"
                  label={`${unansweredCount} Хариулаагүй`}
                />
                <Legend
                  color="bg-violet-500"
                  label={`${markedCount} Тэмдэглэсэн`}
                />
                <Legend
                  color="bg-warning"
                  label={`${answeredMarkedCount} Хариулж тэмдэглэсэн`}
                />
                <Legend
                  color="bg-surface border border-border"
                  label={`${notVisitedCount} Үзээгүй`}
                />
              </div>
            </div>

            <div className="border-t border-border px-seek-4 py-seek-4">
              <Button
                type="button"
                className="w-full bg-danger text-danger-foreground hover:bg-danger/90"
                onClick={() => setSubmitOpen(true)}
              >
                <Icons.Check className="h-4 w-4" aria-hidden="true" />
                Тест дуусгах
              </Button>
            </div>
          </aside>
        </section>
      </div>

      {submitOpen && (
        <SubmitModal
          answeredCount={answeredCount}
          total={attempt.questions.length}
          unansweredNumbers={unansweredQuestions.map(({ index }) => index + 1)}
          onClose={() => setSubmitOpen(false)}
          onSubmit={submitAttempt}
        />
      )}
    </PageContainer>
  );
}

interface QuestionRendererProps {
  question: CandidateQuestion;
  answer: CandidateAnswerValue | undefined;
  onChange: (value: CandidateAnswerValue) => void;
}

function QuestionRenderer({
  question,
  answer,
  onChange,
}: QuestionRendererProps) {
  return (
    <div className="space-y-seek-6">
      <div className="space-y-seek-4">
        <p className="font-sans text-xl leading-8 text-foreground">
          <MathText value={question.prompt} />
        </p>
        <Text variant="muted" className="italic">
          {question.instruction}
        </Text>
      </div>

      {question.media && question.media.length > 0 && (
        <MediaAttachments media={question.media} />
      )}

      {question.type === "single_choice" && (
        <div className="space-y-seek-3">
          {question.options?.map((option) => (
            <div
              key={option.id}
              className="flex min-h-14 items-center gap-seek-3 rounded-seek-md border border-border bg-surface px-seek-4 py-seek-3 text-lg transition-colors hover:bg-surface-hover"
            >
              <Radio
                name={question.id}
                checked={getStringAnswer(answer) === option.id}
                onChange={() => onChange(option.id)}
              />
              <span>
                <MathText value={option.label} />
              </span>
            </div>
          ))}
        </div>
      )}

      {question.type === "multiple_choice" && (
        <div className="space-y-seek-3">
          {question.options?.map((option) => {
            const current = getStringArrayAnswer(answer);
            const checked = current.includes(option.id);

            return (
              <div
                key={option.id}
                className="flex min-h-14 items-center gap-seek-3 rounded-seek-md border border-border bg-surface px-seek-4 py-seek-3 text-lg transition-colors hover:bg-surface-hover"
              >
                <Checkbox
                  checked={checked}
                  onChange={() =>
                    onChange(
                      checked
                        ? current.filter((item) => item !== option.id)
                        : [...current, option.id],
                    )
                  }
                />
                <span>
                  <MathText value={option.label} />
                </span>
              </div>
            );
          })}
        </div>
      )}

      {question.type === "matching" && (
        <MatchingQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      )}

      {question.type === "ordering" && (
        <OrderingQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      )}

      {question.type === "fill_blank" && (
        <div className="flex flex-col gap-seek-4 text-xl leading-10 text-foreground lg:flex-row lg:items-center lg:gap-seek-6">
          <span>
            <MathText value={question.prompt} />
          </span>
          <div className="flex items-end gap-seek-3">
            <Input
              value={getStringAnswer(answer)}
              placeholder="1-р хоосон"
              className="w-40 border-x-0 border-t-0 border-primary bg-transparent text-center text-lg font-semibold shadow-none focus:ring-0"
              onChange={(event) => onChange(event.target.value)}
            />
            <span className="font-sans text-lg font-semibold">тоог</span>
          </div>
        </div>
      )}

      {question.type === "matrix" && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="py-seek-3" />
                {question.columns?.map((column) => (
                  <th
                    key={column.id}
                    className="py-seek-3 text-center font-sans text-base font-bold text-foreground"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {question.rows?.map((row) => {
                const current = getMapAnswer(answer);

                return (
                  <tr
                    key={row.id}
                    className="border-b border-border odd:bg-surface even:bg-muted-background"
                  >
                    <td className="py-seek-4 font-sans text-lg text-foreground">
                      <MathText value={row.label} />
                    </td>
                    {question.columns?.map((column) => (
                      <td key={column.id} className="py-seek-4 text-center">
                        <Radio
                          name={`${question.id}-${row.id}`}
                          checked={current[row.id] === column.id}
                          onChange={() =>
                            onChange({ ...current, [row.id]: column.id })
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {question.type === "numeric" && (
        <div className="max-w-md space-y-seek-2">
          <Input
            type="number"
            inputMode="decimal"
            value={getStringAnswer(answer)}
            min={question.minValue}
            max={question.maxValue}
            placeholder="Тоон хариултаа бичнэ үү"
            className="text-lg font-semibold"
            onChange={(event) => onChange(event.target.value)}
          />
          <Text variant="muted" className="text-sm">
            {question.minValue !== undefined && question.maxValue !== undefined
              ? `${question.minValue} - ${question.maxValue} хооронд`
              : "Тоон утга"}{" "}
            {question.unit ? `(${question.unit})` : ""}
          </Text>
        </div>
      )}

      {question.type === "likert" && (
        <LikertQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      )}

      {question.type === "sjt" && (
        <div className="space-y-seek-3">
          {question.options?.map((option) => (
            <div
              key={option.id}
              className="flex min-h-16 items-start gap-seek-3 rounded-seek-md border border-border bg-surface px-seek-4 py-seek-3 transition-colors hover:bg-surface-hover"
            >
              <Radio
                name={question.id}
                checked={getStringAnswer(answer) === option.id}
                onChange={() => onChange(option.id)}
              />
              <span className="leading-6">{option.label}</span>
            </div>
          ))}
        </div>
      )}

      {question.type === "case_bundle" && (
        <CaseBundleQuestion
          question={question}
          answer={answer}
          onChange={onChange}
        />
      )}

      {question.type === "essay" && (
        <div className="space-y-seek-3">
          <Textarea
            value={getStringAnswer(answer)}
            placeholder="Бичгийн хариултаа энд бичнэ үү..."
            className="min-h-64 text-base leading-7"
            onChange={(event) => onChange(event.target.value)}
          />
          <Text variant="muted" className="text-sm">
            Draft нь local autosave status-д хадгалагдана. Production үед word
            count, rubric, file upload, plagiarism policy-г backend workflow-той
            холбоно.
          </Text>
        </div>
      )}
    </div>
  );
}

function MediaAttachments({
  media,
}: {
  media: NonNullable<CandidateQuestion["media"]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-seek-3 lg:grid-cols-2">
      {media.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-seek-md border border-border bg-muted-background"
        >
          <div className="border-b border-border px-seek-4 py-seek-3">
            <p className="font-sans text-sm font-bold text-foreground">
              {item.title}
            </p>
            {item.description && (
              <Text variant="muted" className="mt-seek-1 text-xs">
                {item.description}
              </Text>
            )}
          </div>
          <div className="p-seek-4">
            {item.type === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.title}
                className="aspect-[16/7] w-full rounded-seek-md border border-border object-cover"
              />
            )}
            {item.type === "audio" && (
              <audio controls className="w-full">
                <source src={item.url} />
              </audio>
            )}
            {item.type === "video" && (
              <video
                controls
                className="aspect-video w-full rounded-seek-md border border-border bg-black"
              >
                <source src={item.url} />
              </video>
            )}
            {item.type === "file" && (
              <a
                href={item.url}
                className="inline-flex min-h-12 items-center rounded-seek-md border border-border bg-surface px-seek-4 py-seek-2 font-sans text-sm font-semibold text-primary hover:bg-surface-hover"
              >
                Файл нээх: {item.title}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface LikertQuestionProps {
  question: CandidateQuestion;
  answer: CandidateAnswerValue | undefined;
  onChange: (value: CandidateAnswerValue) => void;
}

function LikertQuestion({ question, answer, onChange }: LikertQuestionProps) {
  const selected = getStringAnswer(answer);

  return (
    <div className="grid grid-cols-1 gap-seek-2 md:grid-cols-5">
      {question.options?.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`min-h-28 rounded-seek-md border px-seek-3 py-seek-4 text-center transition-colors ${
            selected === option.id
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-surface hover:bg-surface-hover"
          }`}
          onClick={() => onChange(option.id)}
        >
          <span className="mx-auto grid h-9 w-9 place-items-center rounded-full border border-current font-bold">
            {option.id}
          </span>
          <span className="mt-seek-3 block text-sm font-semibold leading-5">
            {option.label}
          </span>
        </button>
      ))}
    </div>
  );
}

interface CaseBundleQuestionProps {
  question: CandidateQuestion;
  answer: CandidateAnswerValue | undefined;
  onChange: (value: CandidateAnswerValue) => void;
}

function CaseBundleQuestion({
  question,
  answer,
  onChange,
}: CaseBundleQuestionProps) {
  const current = getMapAnswer(answer);

  const updateCaseAnswer = (caseItemId: string, value: string) => {
    onChange({ ...current, [caseItemId]: value });
  };

  return (
    <div className="space-y-seek-5">
      {question.caseText && (
        <div className="rounded-seek-md border border-border bg-muted-background px-seek-4 py-seek-4">
          <p className="font-sans text-base leading-7 text-foreground">
            {question.caseText}
          </p>
        </div>
      )}

      <div className="space-y-seek-4">
        {question.caseItems?.map((item, index) => (
          <div
            key={item.id}
            className="rounded-seek-md border border-border bg-surface px-seek-4 py-seek-4"
          >
            <p className="mb-seek-3 font-sans text-base font-bold text-foreground">
              {index + 1}. {item.prompt}
            </p>
            {item.type === "single_choice" && (
              <div className="space-y-seek-2">
                {item.options?.map((option) => (
                  <div
                    key={option.id}
                    className="flex min-h-12 items-start gap-seek-3 rounded-seek-md border border-border px-seek-3 py-seek-2"
                  >
                    <Radio
                      name={`${question.id}-${item.id}`}
                      checked={current[item.id] === option.id}
                      onChange={() => updateCaseAnswer(item.id, option.id)}
                    />
                    <span className="leading-6">{option.label}</span>
                  </div>
                ))}
              </div>
            )}
            {item.type === "short_text" && (
              <Textarea
                value={current[item.id] ?? ""}
                placeholder="Товч хариултаа бичнэ үү..."
                className="min-h-28"
                onChange={(event) =>
                  updateCaseAnswer(item.id, event.target.value)
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

interface MatchingQuestionProps {
  question: CandidateQuestion;
  answer: CandidateAnswerValue | undefined;
  onChange: (value: CandidateAnswerValue) => void;
}

function MatchingQuestion({
  question,
  answer,
  onChange,
}: MatchingQuestionProps) {
  const current = getMapAnswer(answer);
  const usedOptionIds = Object.values(current).filter(Boolean);
  const availableOptions =
    question.matchOptions?.filter(
      (option) => !usedOptionIds.includes(option.id),
    ) ?? [];

  const setMatch = (pairId: string, optionId: string) => {
    const nextAnswer = Object.fromEntries(
      Object.entries(current).filter(([, value]) => value !== optionId),
    );
    onChange({ ...nextAnswer, [pairId]: optionId });
  };

  const clearMatch = (pairId: string) => {
    const nextAnswer = { ...current };
    delete nextAnswer[pairId];
    onChange(nextAnswer);
  };

  return (
    <div className="grid grid-cols-1 gap-seek-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-seek-4">
        {question.pairs?.map((pair) => {
          const matched = current[pair.id];
          const matchedOption = question.matchOptions?.find(
            (option) => option.id === matched,
          );

          return (
            <div
              key={pair.id}
              className="grid min-h-20 w-full grid-cols-1 items-center gap-seek-3 rounded-seek-lg border border-border bg-surface px-seek-4 py-seek-3 text-left shadow-seek-sm sm:grid-cols-2"
            >
              <span className="rounded-seek-md bg-violet-50 px-seek-4 py-seek-3 font-sans text-base font-semibold text-foreground dark:bg-violet-950">
                <MathText value={pair.prompt} />
              </span>
              <button
                type="button"
                className={`min-h-16 rounded-seek-md border border-dashed px-seek-4 py-seek-3 text-left transition-colors ${
                  matchedOption
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:bg-surface-hover"
                }`}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const optionId = event.dataTransfer.getData(
                    "application/x-seek-match-option",
                  );
                  if (optionId) {
                    setMatch(pair.id, optionId);
                  }
                }}
                onClick={() => matchedOption && clearMatch(pair.id)}
              >
                {matchedOption ? matchedOption.label : "Энд чирч тавина уу"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="rounded-seek-lg border border-border bg-muted-background p-seek-4">
        <h3 className="mb-seek-3 font-sans text-sm font-bold uppercase text-muted-foreground">
          Сонгох утгууд
        </h3>
        <div className="space-y-seek-3">
          {availableOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              draggable
              className="w-full cursor-grab rounded-seek-md border border-border bg-surface px-seek-4 py-seek-3 text-left text-foreground shadow-seek-sm active:cursor-grabbing"
              onDragStart={(event) => {
                event.dataTransfer.setData(
                  "application/x-seek-match-option",
                  option.id,
                );
                event.dataTransfer.effectAllowed = "move";
              }}
              onClick={() => {
                const firstEmptyPair = question.pairs?.find(
                  (pair) => !current[pair.id],
                );
                if (firstEmptyPair) {
                  setMatch(firstEmptyPair.id, option.id);
                }
              }}
            >
              {option.label}
            </button>
          ))}
          {availableOptions.length === 0 && (
            <Text variant="muted" className="text-sm">
              Бүх утга байрласан байна. Буцаах бол байршуулсан утга дээр дарна.
            </Text>
          )}
        </div>
      </div>
    </div>
  );
}

interface OrderingQuestionProps {
  question: CandidateQuestion;
  answer: CandidateAnswerValue | undefined;
  onChange: (value: CandidateAnswerValue) => void;
}

function OrderingQuestion({
  question,
  answer,
  onChange,
}: OrderingQuestionProps) {
  const optionIds = question.options?.map((option) => option.id) ?? [];
  const order = getStringArrayAnswer(answer);
  const currentOrder =
    order.length === optionIds.length ? order : [...optionIds].sort(() => 0);
  const optionById = new Map(
    question.options?.map((option) => [option.id, option]) ?? [],
  );

  const moveItem = (fromId: string, toId: string) => {
    const fromIndex = currentOrder.indexOf(fromId);
    const toIndex = currentOrder.indexOf(toId);

    if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) {
      return;
    }

    onChange(reorderItems(currentOrder, fromIndex, toIndex));
  };

  const moveWithKeyboard = (optionId: string, direction: "up" | "down") => {
    const fromIndex = currentOrder.indexOf(optionId);
    const toIndex = direction === "up" ? fromIndex - 1 : fromIndex + 1;

    if (fromIndex === -1 || toIndex < 0 || toIndex >= currentOrder.length) {
      return;
    }

    onChange(reorderItems(currentOrder, fromIndex, toIndex));
  };

  return (
    <div className="space-y-seek-3">
      {currentOrder.map((optionId, index) => {
        const option = optionById.get(optionId);

        if (!option) {
          return null;
        }

        return (
          <div
            key={option.id}
            draggable
            className="flex min-h-14 w-full cursor-grab items-center gap-seek-4 rounded-seek-md border border-border bg-surface px-seek-4 py-seek-3 text-left text-lg transition-colors hover:bg-surface-hover active:cursor-grabbing"
            onDragStart={(event: DragEvent<HTMLDivElement>) => {
              event.dataTransfer.setData(
                "application/x-seek-order-option",
                option.id,
              );
              event.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const draggedId = event.dataTransfer.getData(
                "application/x-seek-order-option",
              );
              if (draggedId) {
                moveItem(draggedId, option.id);
              }
            }}
          >
            <span
              className="text-xl leading-none text-muted-foreground"
              aria-hidden="true"
            >
              ::
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
              {index + 1}
            </span>
            <span className="flex-1">
              <MathText value={option.label} />
            </span>
            <div className="flex gap-seek-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === 0}
                onClick={() => moveWithKeyboard(option.id, "up")}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={index === currentOrder.length - 1}
                onClick={() => moveWithKeyboard(option.id, "down")}
              >
                ↓
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MathText({ value }: { value: string }) {
  const segments = value.split(/(\$[^$]+\$)/g).filter(Boolean);

  return (
    <>
      {segments.map((segment, index) => {
        if (!segment.startsWith("$") || !segment.endsWith("$")) {
          return <span key={`${segment}-${index}`}>{segment}</span>;
        }

        return (
          <span
            key={`${segment}-${index}`}
            className="seek-math"
            aria-label={segment.slice(1, -1)}
          >
            {renderMath(segment.slice(1, -1))}
          </span>
        );
      })}
    </>
  );
}

function renderMath(expression: string) {
  const tokens: Array<string | JSX.Element> = [];
  let cursor = 0;
  const fractionPattern = /\\frac\{([^{}]+)\}\{([^{}]+)\}/g;
  let match: RegExpExecArray | null;

  while ((match = fractionPattern.exec(expression)) !== null) {
    if (match.index > cursor) {
      tokens.push(expression.slice(cursor, match.index));
    }

    tokens.push(
      <span
        key={`${match.index}-${match[1]}-${match[2]}`}
        className="seek-math-frac"
      >
        <span className="seek-math-num">{formatSimpleMath(match[1])}</span>
        <span className="seek-math-den">{formatSimpleMath(match[2])}</span>
      </span>,
    );

    cursor = match.index + match[0].length;
  }

  if (cursor < expression.length) {
    tokens.push(expression.slice(cursor));
  }

  return tokens.map((token, index) =>
    typeof token === "string" ? (
      <span key={`${token}-${index}`}>{formatSimpleMath(token)}</span>
    ) : (
      token
    ),
  );
}

function formatSimpleMath(expression: string) {
  return expression
    .replaceAll("\\times", "×")
    .split(/(\^[A-Za-z0-9]+)/g)
    .filter(Boolean)
    .map((part, index) =>
      part.startsWith("^") ? (
        <sup key={`${part}-${index}`}>{part.slice(1)}</sup>
      ) : (
        <span key={`${part}-${index}`}>{part}</span>
      ),
    );
}

function getPlainQuestionText(value: string) {
  return value
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replaceAll("\\times", "×")
    .replaceAll("$", "")
    .replace(/\s+/g, " ")
    .trim();
}

interface QuestionNumberButtonProps {
  index: number;
  active: boolean;
  answered: boolean;
  marked: boolean;
  onClick: () => void;
}

function QuestionNumberButton({
  index,
  active,
  answered,
  marked,
  onClick,
}: QuestionNumberButtonProps) {
  const stateClass = marked
    ? answered
      ? "border-warning bg-warning text-white"
      : "border-violet-500 bg-violet-500 text-white"
    : answered
      ? "border-success bg-success text-success-foreground"
      : "border-border bg-surface text-foreground";

  return (
    <button
      type="button"
      className={`h-12 rounded-seek-md border text-sm font-bold transition-colors hover:bg-surface-hover ${
        active ? "ring-2 ring-slate-800 ring-offset-2" : ""
      } ${stateClass}`}
      onClick={onClick}
    >
      {index + 1}
    </button>
  );
}

interface QuestionListButtonProps {
  question: CandidateQuestion;
  index: number;
  active: boolean;
  answered: boolean;
  marked: boolean;
  onClick: () => void;
}

function QuestionListButton({
  question,
  index,
  active,
  answered,
  marked,
  onClick,
}: QuestionListButtonProps) {
  const statusClass = answered
    ? "bg-success text-success-foreground"
    : marked
      ? "bg-violet-500 text-white"
      : "bg-danger/80 text-white";

  return (
    <button
      type="button"
      className={`grid w-full grid-cols-[2.25rem_minmax(0,1fr)] items-start gap-seek-3 rounded-seek-md border px-seek-3 py-seek-3 text-left transition-colors ${
        active
          ? "border-border-hover bg-surface shadow-seek-sm ring-2 ring-slate-800 ring-offset-1"
          : "border-transparent hover:bg-surface-hover"
      }`}
      onClick={onClick}
    >
      <span
        className={`grid h-7 w-7 place-items-center rounded-seek-sm text-sm font-bold ${
          active ? "bg-danger text-white" : statusClass
        }`}
      >
        {index + 1}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 block text-sm leading-5 text-foreground">
          {getPlainQuestionText(question.prompt)}
        </span>
        <span className="mt-seek-1 block text-xs text-muted-foreground">
          {typeLabels[question.type]}
        </span>
      </span>
    </button>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-seek-2">
      <span className={`h-4 w-4 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}

interface SubmitModalProps {
  answeredCount: number;
  total: number;
  unansweredNumbers: number[];
  onClose: () => void;
  onSubmit: () => void;
}

function SubmitModal({
  answeredCount,
  total,
  unansweredNumbers,
  onClose,
  onSubmit,
}: SubmitModalProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-seek-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-seek-xl bg-surface p-seek-6 shadow-2xl">
        <h2 className="font-sans text-2xl font-bold text-foreground">
          Тест илгээх үү?
        </h2>
        <div className="mt-seek-5 space-y-seek-3">
          <div className="flex items-center gap-seek-4 rounded-seek-md bg-success-background px-seek-4 py-seek-4 text-success-foreground">
            <Icons.Check className="h-6 w-6" aria-hidden="true" />
            <span className="text-lg">
              Хариулсан: {answeredCount} / {total}
            </span>
          </div>
          <div className="flex items-start gap-seek-4 rounded-seek-md bg-warning-background px-seek-4 py-seek-4 text-warning-foreground">
            <Icons.Warning className="mt-0.5 h-6 w-6" aria-hidden="true" />
            <div>
              <p className="text-lg">
                Хариулаагүй: {unansweredNumbers.length} асуулт
              </p>
              {unansweredNumbers.length > 0 && (
                <Text variant="muted" className="mt-seek-1">
                  Асуулт №: {unansweredNumbers.join(", ")}
                </Text>
              )}
            </div>
          </div>
        </div>
        <div className="mt-seek-6 grid grid-cols-1 gap-seek-3 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Буцах
          </Button>
          <Button
            type="button"
            className="bg-violet-600 text-white shadow-lg hover:bg-violet-700"
            onClick={onSubmit}
          >
            Тийм, илгээх
          </Button>
        </div>
      </div>
    </div>
  );
}
