"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Checkbox, Radio, Text, Textarea } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";
import { useAssessmentRuntime } from "@/features/runtime/useAssessmentRuntime";
import type { RuntimeQuestion } from "@/features/runtime/types";

export default function TakeRuntimePage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const runtime = useAssessmentRuntime(params.attemptId);
  const attempt = runtime.attempt;
  const question = runtime.currentQuestion;

  if (!runtime.isKnownAttempt || !attempt || !question) {
    return (
      <RuntimeShell title="Attempt олдсонгүй" subtitle="Runtime session шалгаж байна.">
        <RuntimeNotice tone="danger" title="Буруу attempt">
          Portal-оос дахин шалгалтад орох холбоос нээнэ үү.
        </RuntimeNotice>
      </RuntimeShell>
    );
  }

  if (runtime.submitted) {
    return (
      <RuntimeShell title="Шалгалт илгээгдсэн" subtitle="Submit receipt үүссэн.">
        <Link href={`/submitted/${attempt.session.attemptId}`}>
          <Button type="button">Receipt харах</Button>
        </Link>
      </RuntimeShell>
    );
  }

  if (!runtime.recovering && attempt.session.status !== "active") {
    return (
      <RuntimeShell
        title="Шалгалт хараахан эхлээгүй"
        subtitle="Waiting room unlock event ирсний дараа runtime нээгдэнэ."
      >
        <RuntimeNotice title="Waiting room шаардлагатай">
          Энэ attempt одоогоор {attempt.session.status} төлөвтэй байна.
        </RuntimeNotice>
        <div className="mt-seek-4">
          <Button
            type="button"
            onClick={() => router.replace(`/waiting/${attempt.session.attemptId}`)}
          >
            Waiting room рүү буцах
          </Button>
        </div>
      </RuntimeShell>
    );
  }

  if (runtime.violations.length >= runtime.maxWarningsBeforeLock) {
    return (
      <RuntimeShell
        title="Attempt lock policy"
        subtitle="Proctoring violation threshold reached."
      >
        <RuntimeNotice tone="danger" title="Шалгалт түгжих нөхцөл бүрдлээ">
          Browser-only prototype дээр {runtime.maxWarningsBeforeLock} warning хүрсэн тул
          production policy бол attempt lock эсвэл assessor review flag үүсгэнэ.
        </RuntimeNotice>
        <div className="mt-seek-4">
          <Link href="/locked">
            <Button type="button" variant="danger">
              Locked state харах
            </Button>
          </Link>
        </div>
      </RuntimeShell>
    );
  }

  return (
    <RuntimeShell
      title={attempt.session.assessmentTitle}
      subtitle="Server timer, saved answers, guarded navigation."
    >
      <div className="space-y-seek-4">
        <Card className="flex flex-col gap-seek-3 p-seek-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Text className="font-bold">{attempt.session.userDisplayName}</Text>
            <Text variant="muted" className="mt-1 text-sm">
              {runtime.answeredCount}/{attempt.questions.length} хариулсан · {runtime.statusLabel}
            </Text>
          </div>
          <div className="flex flex-wrap items-center gap-seek-2">
            <StatusPill label="Timer" value={runtime.formattedRemaining} />
            <StatusPill
              label="Heartbeat"
              value={runtime.lastHeartbeat ? "OK" : "WAIT"}
            />
            <StatusPill
              label="Save"
              value={saveStatusLabel(runtime.currentSaveStatus)}
            />
            <StatusPill label="Network" value={runtime.online ? "ON" : "OFF"} />
            <StatusPill
              label="Fullscreen"
              value={runtime.fullscreenActive ? "ON" : "OFF"}
            />
          </div>
        </Card>

        {(runtime.saveError || runtime.hasUnsavedAnswers || runtime.submitting) && (
          <RuntimeNotice
            tone={runtime.saveError ? "danger" : runtime.submitting ? "warning" : "info"}
            title={runtime.saveError ? "Хадгалалт амжилтгүй" : "Question policy"}
          >
            {runtime.saveError ||
              (runtime.submitting
                ? "Submit хийгдэж байна. Хугацаа болон хариултын snapshot server дээр түгжигдэнэ."
                : "Дараагийн асуулт руу шилжихээс өмнө одоогийн хариулт server дээр хадгалагдана.")}
          </RuntimeNotice>
        )}

        {runtime.violations.length > 0 && (
          <RuntimeNotice
            tone={
              runtime.violations.length >= runtime.maxWarningsBeforeLock
                ? "danger"
                : "warning"
            }
            title="Анхааруулга"
          >
            {runtime.violations.at(-1)?.message} Нийт зөрчил:{" "}
            {runtime.violations.length}/{runtime.maxWarningsBeforeLock}
          </RuntimeNotice>
        )}

        {!runtime.online && (
          <RuntimeNotice tone="warning" title="Offline local buffer">
            Сүлжээ тасарсан ч хугацаа сунгагдахгүй. Хариулт local buffer-т хадгалагдаж,
            online болох үед autosave/submit retry хийнэ.
          </RuntimeNotice>
        )}

        {runtime.pendingSubmit && (
          <RuntimeNotice tone="warning" title="Pending submit">
            Submit snapshot local-д хадгалагдсан. Online болмогц idempotent submit retry
            ажиллана.
          </RuntimeNotice>
        )}

        <div className="grid gap-seek-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
          <Card className="min-h-[34rem] p-seek-5">
            <div className="flex flex-wrap items-center justify-between gap-seek-3 border-b border-border pb-seek-3">
              <div>
                <Text variant="muted" className="text-sm">
                  {question.code} · {question.type}
                </Text>
                <Text className="mt-1 font-bold">
                  {question.points} оноо · {saveStatusText(runtime.currentSaveStatus)}
                </Text>
              </div>
              <div className="flex flex-wrap gap-seek-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => runtime.toggleMarkedForReview(question.id)}
                >
                  {runtime.markedForReview[question.id] ? "Flag авсан" : "Flag"}
                </Button>
                <Button type="button" variant="secondary" onClick={runtime.requestFullscreen}>
                  Fullscreen
                </Button>
              </div>
            </div>

            <div className="py-seek-6">
              <Text className="text-xl font-semibold">{question.prompt}</Text>
              <Text variant="muted" className="mt-seek-2">
                {question.instruction}
              </Text>
              <QuestionAnswer
                question={question}
                value={runtime.answers[question.id]}
                onChange={(value) => runtime.updateAnswer(question.id, value)}
              />
            </div>

            <div className="flex flex-col gap-seek-2 border-t border-border pt-seek-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-seek-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={runtime.currentIndex === 0 || Boolean(runtime.savingQuestionId)}
                  onClick={() => void runtime.goToQuestion(runtime.currentIndex - 1)}
                >
                  Өмнөх
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={Boolean(runtime.savingQuestionId)}
                  onClick={() => void runtime.saveQuestion(question.id)}
                >
                  Хадгалах
                </Button>
                <Button
                  type="button"
                  disabled={
                    runtime.currentIndex === attempt.questions.length - 1 ||
                    Boolean(runtime.savingQuestionId)
                  }
                  onClick={() => void runtime.saveAndNext()}
                >
                  Хадгалах ба Дараах
                </Button>
              </div>
              <Button
                type="button"
                variant={runtime.hasUnsavedAnswers || runtime.hasSaveErrors ? "secondary" : "primary"}
                disabled={Boolean(runtime.savingQuestionId) || runtime.submitting}
                onClick={() => {
                  if (runtime.hasUnsavedAnswers || runtime.hasSaveErrors) {
                    void runtime.saveQuestion(question.id);
                    return;
                  }
                  void runtime.submitAttempt("user_submit");
                }}
              >
                {runtime.hasUnsavedAnswers || runtime.hasSaveErrors
                  ? "Эхлээд хадгалах"
                  : runtime.submitting
                    ? "Илгээж байна"
                    : "Тест дуусгах"}
              </Button>
            </div>
          </Card>

          <Card className="p-seek-4">
            <Text className="font-bold">Асуултын навигац</Text>
            <div className="mt-seek-4 grid grid-cols-5 gap-seek-2">
              {attempt.questions.map((item, index) => {
                const state = runtime.getQuestionState(item.id, index);
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`Асуулт ${index + 1}: ${questionStateLabel(state)}`}
                    title={questionStateLabel(state)}
                    className={`h-10 rounded-seek-md border text-sm font-bold ${questionStateClass(state)}`}
                    disabled={Boolean(runtime.savingQuestionId) || runtime.submitting}
                    onClick={() => void runtime.goToQuestion(index)}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-seek-5 space-y-seek-2 text-sm text-muted-foreground">
              <p>Хадгалаагүй: {runtime.hasUnsavedAnswers ? "байна" : "байхгүй"}</p>
              <p>Алдаа: {runtime.hasSaveErrors ? "шалгах шаардлагатай" : "байхгүй"}</p>
              <p>Autosubmit: хугацаа дуусахад server submit хийнэ</p>
            </div>
          </Card>
        </div>
      </div>
    </RuntimeShell>
  );
}

function QuestionAnswer({
  question,
  value,
  onChange,
}: {
  question: RuntimeQuestion;
  value: unknown;
  onChange: (value: string | string[]) => void;
}) {
  if (question.type === "single_choice") {
    return (
      <div className="mt-seek-5 space-y-seek-3">
        {question.options?.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-seek-3 rounded-seek-md border border-border p-seek-3"
          >
            <Radio
              name={question.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  if (question.type === "multiple_choice") {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="mt-seek-5 space-y-seek-3">
        {question.options?.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-seek-3 rounded-seek-md border border-border p-seek-3"
          >
            <Checkbox
              checked={selected.includes(option.id)}
              onChange={() =>
                onChange(
                  selected.includes(option.id)
                    ? selected.filter((id) => id !== option.id)
                    : [...selected, option.id],
                )
              }
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    );
  }

  return (
    <Textarea
      className="mt-seek-5 min-h-40"
      value={typeof value === "string" ? value : ""}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Хариултаа бичнэ үү..."
    />
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-seek-md border border-border bg-muted-background px-seek-3 py-seek-2">
      <Text variant="muted" className="text-xs">
        {label}
      </Text>
      <Text className="font-mono text-sm font-bold">{value}</Text>
    </div>
  );
}

function saveStatusLabel(status: string) {
  const labels: Record<string, string> = {
    idle: "READY",
    unsaved: "UNSAVED",
    saving: "SAVING",
    saved: "SAVED",
    error: "ERROR",
  };
  return labels[status] || status.toUpperCase();
}

function saveStatusText(status: string) {
  const labels: Record<string, string> = {
    idle: "хадгалахад бэлэн",
    unsaved: "хадгалаагүй",
    saving: "хадгалж байна",
    saved: "server дээр хадгалсан",
    error: "дахин хадгална уу",
  };
  return labels[status] || status;
}

function questionStateLabel(state: string) {
  const labels: Record<string, string> = {
    not_visited: "ороогүй",
    current: "одоогийн",
    unsaved: "хадгалаагүй",
    saved: "хадгалсан",
    flagged: "flag хийсэн",
    error: "хадгалалтын алдаа",
  };
  return labels[state] || state;
}

function questionStateClass(state: string) {
  const classes: Record<string, string> = {
    current: "border-primary bg-primary text-primary-foreground",
    unsaved: "border-warning bg-warning-background text-foreground",
    saved: "border-success bg-success-background text-success",
    flagged: "border-primary bg-primary/10 text-primary",
    error: "border-danger bg-danger-background text-danger",
    not_visited: "border-border bg-surface text-foreground",
  };
  return classes[state] || classes.not_visited;
}
