"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Checkbox, Radio, Text, Textarea } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";
import { useAssessmentRuntime } from "@/features/runtime/useAssessmentRuntime";
import type { RuntimeQuestion } from "@/features/runtime/types";

export default function TakeRuntimePage() {
  const params = useParams<{ attemptId: string }>();
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
      subtitle="Timer server authoritative, answer local buffer + autosave contract."
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
              label="Autosave"
              value={runtime.lastSavedAt ? "SAVED" : "LOCAL"}
            />
            <StatusPill label="Network" value={runtime.online ? "ON" : "OFF"} />
            <StatusPill
              label="Fullscreen"
              value={runtime.fullscreenActive ? "ON" : "OFF"}
            />
          </div>
        </Card>

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
                <Text className="mt-1 font-bold">{question.points} оноо</Text>
              </div>
              <Button type="button" variant="secondary" onClick={runtime.requestFullscreen}>
                Fullscreen
              </Button>
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
              <div className="flex gap-seek-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={runtime.currentIndex === 0}
                  onClick={() => runtime.setCurrentIndex(runtime.currentIndex - 1)}
                >
                  Өмнөх
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={runtime.currentIndex === attempt.questions.length - 1}
                  onClick={() => runtime.setCurrentIndex(runtime.currentIndex + 1)}
                >
                  Дараах
                </Button>
              </div>
              <Button type="button" onClick={() => runtime.submitAttempt("user_submit")}>
                Тест дуусгах
              </Button>
            </div>
          </Card>

          <Card className="p-seek-4">
            <Text className="font-bold">Асуултын навигац</Text>
            <div className="mt-seek-4 grid grid-cols-5 gap-seek-2">
              {attempt.questions.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`h-10 rounded-seek-md border text-sm font-bold ${
                    index === runtime.currentIndex
                      ? "border-primary bg-primary text-primary-foreground"
                      : runtime.answers[item.id]
                        ? "border-success bg-success-background text-success"
                        : "border-border bg-surface text-foreground"
                  }`}
                  onClick={() => runtime.setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="mt-seek-5 space-y-seek-2 text-sm text-muted-foreground">
              <p>Autosave interval: {attempt.session.autosaveIntervalSeconds}s</p>
              <p>Heartbeat interval: {attempt.session.heartbeatIntervalSeconds}s</p>
              <p>Result release: {attempt.session.resultVisibilityPolicy.resultReleaseMode}</p>
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
