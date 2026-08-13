"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  PageTitle,
  Select,
  Switch,
  Text,
  useToast,
} from "@seek/ui";
import { getBlueprintSummary, validateQuiz } from "./api";
import {
  mockAssignableUsers,
  mockBlueprints,
  mockQuestionBank,
  mockQuizzes,
} from "./mock-data";
import type {
  Blueprint,
  Quiz,
  QuizAccessMode,
  QuizOverrideMode,
  QuizResultReleaseMode,
} from "./types";

const defaultBlueprint = mockBlueprints[0];

const accessModeLabels: Record<QuizAccessMode, string> = {
  public: "Нээлттэй",
  private_code: "Захиалгат кодтой",
  assigned_users: "Сонгосон хэрэглэгчид",
};

const releaseModeLabels: Record<QuizResultReleaseMode, string> = {
  immediate: "Дуусмагц",
  after_close: "Хугацаа хаагдсаны дараа",
  manual: "Гараар нийтлэх",
};

export function QuizEditor({
  blueprint = defaultBlueprint,
  mode = "edit",
}: {
  blueprint?: Blueprint;
  mode?: "new" | "edit";
}) {
  const existing = mockQuizzes[0];
  const { showToast } = useToast();
  const [quiz, setQuiz] = useState<Quiz>(() =>
    mode === "edit" ? existing : buildNewQuiz(blueprint),
  );
  const selectedBlueprint =
    mockBlueprints.find((item) => item.id === quiz.blueprintId) ?? blueprint;
  const summary = getBlueprintSummary(selectedBlueprint);
  const errors = useMemo(
    () => validateQuiz(selectedBlueprint, quiz),
    [selectedBlueprint, quiz],
  );
  const mandatoryCount = quiz.questionOverrides.filter(
    (item) => item.mode === "mandatory",
  ).length;
  const excludedCount = quiz.questionOverrides.filter(
    (item) => item.mode === "excluded",
  ).length;

  const patchQuiz = (patch: Partial<Quiz>) =>
    setQuiz((current) => {
      const next = { ...current, ...patch };
      if (patch.hideSolutions) {
        next.showCorrectAnswers = false;
        next.showExplanations = false;
      }
      return next;
    });

  const setOverride = (questionId: string, overrideMode: QuizOverrideMode) => {
    setQuiz((current) => {
      const next = current.questionOverrides.filter(
        (item) => item.questionId !== questionId,
      );
      return {
        ...current,
        questionOverrides:
          overrideMode === "none"
            ? next
            : [...next, { questionId, mode: overrideMode }],
      };
    });
  };

  const toggleAssignedUser = (userId: string) =>
    patchQuiz({
      assignedUserIds: toggleValue(quiz.assignedUserIds ?? [], userId),
    });

  return (
    <div className="grid gap-seek-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <main className="space-y-seek-4">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
          <PageTitle
            title={mode === "new" ? "Quiz үүсгэх" : "Quiz засах"}
            subtitle="Blueprint дээр үндэслэн төлбөр, хандалт, хугацаа, override болон result policy тохируулна."
          />
          <div className="flex gap-2">
            <Link href="/quizzes">
              <Button type="button" variant="secondary">
                Буцах
              </Button>
            </Link>
            <Button
              type="button"
              disabled={errors.length > 0}
              onClick={() => showToast("Quiz mock state-д хадгалагдлаа.", "success")}
            >
              Хадгалах
            </Button>
          </div>
        </div>

        <Card className="p-seek-4">
          <SectionHeader
            title="Ерөнхий тохиргоо"
            subtitle="Quiz нэр, blueprint, төлбөр, хугацаа болон оролдлогын тоо."
          />
          <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Quiz нэр">
              <Input
                value={quiz.title}
                onChange={(event) => patchQuiz({ title: event.target.value })}
              />
            </Field>
            <Field label="Blueprint">
              <Select
                value={quiz.blueprintId}
                onChange={(event) =>
                  patchQuiz({
                    blueprintId: event.target.value,
                    questionOverrides: [],
                  })
                }
                options={mockBlueprints.map((item) => ({
                  value: item.id,
                  label: item.title,
                }))}
              />
            </Field>
            <Field label="Төлбөр (MNT)">
              <Input
                type="number"
                min={0}
                value={quiz.priceMnt}
                onChange={(event) => patchQuiz({ priceMnt: Number(event.target.value) })}
              />
            </Field>
            <Field label="Эхлэх хугацаа">
              <Input
                value={quiz.startAt}
                onChange={(event) => patchQuiz({ startAt: event.target.value })}
              />
            </Field>
            <Field label="Дуусах хугацаа">
              <Input
                value={quiz.endAt}
                onChange={(event) => patchQuiz({ endAt: event.target.value })}
              />
            </Field>
            <Field label="Шалгалтын хугацаа (мин)">
              <Input
                type="number"
                min={1}
                value={quiz.durationMinutes}
                onChange={(event) =>
                  patchQuiz({ durationMinutes: Number(event.target.value) })
                }
              />
            </Field>
            <Field label="Оролдлогын тоо">
              <Input
                type="number"
                min={1}
                value={quiz.maxAttempts}
                onChange={(event) => patchQuiz({ maxAttempts: Number(event.target.value) })}
              />
            </Field>
          </div>
        </Card>

        <Card className="p-seek-4">
          <SectionHeader
            title="Хандалт"
            subtitle="Нээлттэй, кодтой захиалгат эсвэл зөвхөн сонгосон хэрэглэгчдэд харагдах байдлаар тохируулна."
          />
          <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-3">
            {(Object.keys(accessModeLabels) as QuizAccessMode[]).map((modeKey) => (
              <button
                key={modeKey}
                type="button"
                className={`rounded-seek-lg border p-seek-3 text-left ${
                  quiz.accessMode === modeKey
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-surface hover:bg-surface-hover"
                }`}
                onClick={() =>
                  patchQuiz({
                    accessMode: modeKey,
                    accessCode:
                      modeKey === "private_code"
                        ? quiz.accessCode || generateAccessCode(selectedBlueprint.id)
                        : quiz.accessCode,
                  })
                }
              >
                <Text className="font-bold">{accessModeLabels[modeKey]}</Text>
                <Text variant="muted" className="mt-1 text-xs">
                  {modeKey === "public"
                    ? "Каталог/жагсаалтад харагдана."
                    : modeKey === "private_code"
                      ? "Зөвхөн кодоор нэвтэрнэ."
                      : "Сонгосон хэрэглэгчид л харна."}
                </Text>
              </button>
            ))}
          </div>
          {quiz.accessMode === "private_code" && (
            <Field className="mt-seek-4 max-w-md" label="Нэвтрэх код">
              <Input
                value={quiz.accessCode ?? ""}
                onChange={(event) => patchQuiz({ accessCode: event.target.value })}
              />
            </Field>
          )}
          {quiz.accessMode === "assigned_users" && (
            <div className="mt-seek-4 grid gap-seek-2 md:grid-cols-2">
              {mockAssignableUsers.map((user) => (
                <label
                  key={user.id}
                  className="flex items-center justify-between gap-seek-3 rounded-seek-md border border-border p-seek-3"
                >
                  <span>
                    <Text className="font-semibold">{user.name}</Text>
                    <Text variant="muted" className="text-xs">{user.email}</Text>
                  </span>
                  <Checkbox
                    checked={(quiz.assignedUserIds ?? []).includes(user.id)}
                    onChange={() => toggleAssignedUser(user.id)}
                  />
                </label>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-seek-4">
          <SectionHeader
            title="Холих тохиргоо"
            subtitle="Бөөнөөр шалгалт авах үед section болон хариултын дарааллыг холих эсэх."
          />
          <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-2">
            <PolicyToggle
              title="Хэсгүүдийг холих"
              description="Section-үүдийн дарааллыг оролцогч бүрт өөрчилнө."
              checked={quiz.shuffleSections}
              onChange={(checked) => patchQuiz({ shuffleSections: checked })}
            />
            <PolicyToggle
              title="Хариултуудыг холих"
              description="Сонголтот асуултын хариултын дарааллыг холино."
              checked={quiz.shuffleAnswers}
              onChange={(checked) => patchQuiz({ shuffleAnswers: checked })}
            />
          </div>
        </Card>

        <Card className="p-seek-4">
          <SectionHeader
            title="Үр дүн ба тайлан"
            subtitle="Шалгалт дуусахад суралцагчид юуг харуулахыг тохируулна."
          />
          <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-2">
            <Field label="Result release">
              <Select
                value={quiz.resultReleaseMode}
                onChange={(event) =>
                  patchQuiz({
                    resultReleaseMode: event.target.value as QuizResultReleaseMode,
                  })
                }
                options={(Object.keys(releaseModeLabels) as QuizResultReleaseMode[]).map(
                  (value) => ({ value, label: releaseModeLabels[value] }),
                )}
              />
            </Field>
            <PolicyToggle
              title="Hide Solutions"
              description="Зөв хариу болон тайлбарыг суралцагчид нуух."
              checked={quiz.hideSolutions}
              onChange={(checked) => patchQuiz({ hideSolutions: checked })}
            />
            <PolicyToggle
              title="Show Leaderboard"
              description="Оролцогчдын ranking/leaderboard харуулах."
              checked={quiz.showLeaderboard}
              onChange={(checked) => patchQuiz({ showLeaderboard: checked })}
            />
            <PolicyToggle
              title="Оноо харуулах"
              description="Суралцагч нийт оноогоо харах эсэх."
              checked={quiz.showScore}
              onChange={(checked) => patchQuiz({ showScore: checked })}
            />
            <PolicyToggle
              title="Зөв/буруу харуулах"
              description="Асуулт бүрийн correctness төлөвийг харуулах."
              checked={quiz.showCorrectness}
              onChange={(checked) => patchQuiz({ showCorrectness: checked })}
            />
            <PolicyToggle
              title="Зөв хариу харуулах"
              description="Correct answer key-г result дээр харуулах."
              checked={quiz.showCorrectAnswers}
              disabled={quiz.hideSolutions}
              onChange={(checked) => patchQuiz({ showCorrectAnswers: checked })}
            />
            <PolicyToggle
              title="Тайлбар харуулах"
              description="Rubric, feedback, solution explanation харуулах."
              checked={quiz.showExplanations}
              disabled={quiz.hideSolutions}
              onChange={(checked) => patchQuiz({ showExplanations: checked })}
            />
          </div>
        </Card>

        {errors.length > 0 && (
          <Card className="border-danger bg-danger-background p-seek-4">
            <Text className="font-semibold text-danger-foreground">Validation алдаа</Text>
            <div className="mt-2 space-y-1">
              {errors.map((error) => (
                <Text key={error} className="text-sm text-danger-foreground">
                  {error}
                </Text>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-seek-4">
          <SectionHeader
            title="Асуултын pool"
            subtitle="Section бүр дээр заавал оруулах болон quiz-д оруулахгүй асуултыг тэмдэглэнэ."
          />
          <div className="mt-seek-4 space-y-seek-4">
            {selectedBlueprint.sections.map((section) => {
              const sectionOverrides = quiz.questionOverrides.filter((override) =>
                section.selectedQuestionIds.includes(override.questionId),
              );
              return (
                <div key={section.id} className="rounded-seek-lg border border-border p-seek-4">
                  <div className="mb-seek-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <Text className="font-semibold">{section.name}</Text>
                    <Badge variant="secondary">
                      Pool {section.selectedQuestionIds.length} · Сонгох{" "}
                      {section.randomPickCount} · Override {sectionOverrides.length}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {section.selectedQuestionIds.map((questionId) => {
                      const question = mockQuestionBank.find((item) => item.id === questionId);
                      const currentMode =
                        quiz.questionOverrides.find((item) => item.questionId === questionId)?.mode ||
                        "none";
                      return (
                        <div
                          key={questionId}
                          className="grid gap-seek-3 rounded-seek-md bg-muted-background p-seek-3 lg:grid-cols-[1fr_auto] lg:items-center"
                        >
                          <div>
                            <Text className="font-semibold">
                              {question?.code} · {question?.title}
                            </Text>
                            <Text variant="muted" className="line-clamp-2 text-xs">
                              {question?.body || question?.stem}
                            </Text>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <OverrideButton
                              active={currentMode === "mandatory"}
                              onClick={() =>
                                setOverride(
                                  questionId,
                                  currentMode === "mandatory" ? "none" : "mandatory",
                                )
                              }
                              tone="success"
                            >
                              Заавал
                            </OverrideButton>
                            <OverrideButton
                              active={currentMode === "excluded"}
                              onClick={() =>
                                setOverride(
                                  questionId,
                                  currentMode === "excluded" ? "none" : "excluded",
                                )
                              }
                              tone="danger"
                            >
                              Хасах
                            </OverrideButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </main>

      <QuizSummaryAside
        quiz={quiz}
        blueprint={selectedBlueprint}
        errors={errors}
        mandatoryCount={mandatoryCount}
        excludedCount={excludedCount}
        pickedQuestions={summary.pickedQuestions}
      />
    </div>
  );
}

function OverrideButton({
  active,
  onClick,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: "success" | "danger";
  children: React.ReactNode;
}) {
  const activeClass =
    tone === "success"
      ? "border-success bg-success-background text-success-foreground"
      : "border-danger bg-danger-background text-danger-foreground";
  return (
    <button
      type="button"
      className={`rounded-seek-md border px-seek-3 py-seek-1.5 text-sm font-semibold ${
        active ? activeClass : "border-border bg-surface text-foreground"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function QuizSummaryAside({
  quiz,
  blueprint,
  errors,
  mandatoryCount,
  excludedCount,
  pickedQuestions,
}: {
  quiz: Quiz;
  blueprint: Blueprint;
  errors: string[];
  mandatoryCount: number;
  excludedCount: number;
  pickedQuestions: number;
}) {
  return (
    <aside className="space-y-seek-4 xl:sticky xl:top-seek-4 xl:self-start">
      <Card className="bg-gradient-to-br from-primary to-purple-600 p-seek-5 text-primary-foreground">
        <Text className="font-bold">Quiz summary</Text>
        <div className="mt-seek-4 grid grid-cols-2 gap-seek-3">
          <SummaryCell label="Үнэ" value={quiz.priceMnt === 0 ? "Үнэгүй" : `${quiz.priceMnt.toLocaleString()}₮`} />
          <SummaryCell label="Access" value={accessModeLabels[quiz.accessMode]} />
          <SummaryCell label="Оролдлого" value={quiz.maxAttempts} />
          <SummaryCell label="Quiz-д орох" value={pickedQuestions} />
          <SummaryCell label="Mandatory" value={mandatoryCount} />
          <SummaryCell label="Excluded" value={excludedCount} />
        </div>
      </Card>
      <Card className="p-seek-4">
        <Text className="font-semibold">Сонголтын дүрэм</Text>
        <Text variant="muted" className="mt-2 text-sm">
          Blueprint: {blueprint.title}. Mandatory асуултууд заавал орно, excluded
          асуултууд хасагдана. Үлдсэн pool-оос section бүрийн m тоо хүртэл
          сонгоно.
        </Text>
        <Badge className="mt-seek-3" variant={errors.length > 0 ? "danger" : "success"}>
          {errors.length > 0 ? "Засвар шаардлагатай" : "Хуваарь гаргахад бэлэн"}
        </Badge>
      </Card>
      <Card className="p-seek-4">
        <Text className="font-semibold">Result policy</Text>
        <div className="mt-seek-3 space-y-2 text-sm">
          <PolicyLine label="Нээгдэх" value={releaseModeLabels[quiz.resultReleaseMode]} />
          <PolicyLine label="Solutions" value={quiz.hideSolutions ? "Нууна" : "Харуулж болно"} />
          <PolicyLine label="Оноо" value={quiz.showScore ? "Харуулна" : "Нууна"} />
          <PolicyLine label="Leaderboard" value={quiz.showLeaderboard ? "Харуулна" : "Нууна"} />
        </div>
      </Card>
    </aside>
  );
}

function PolicyToggle({
  title,
  description,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className={`rounded-seek-lg border border-border p-seek-3 ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-seek-3">
        <div>
          <Text className="font-semibold">{title}</Text>
          <Text variant="muted" className="mt-1 text-xs">{description}</Text>
        </div>
        <Switch
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">{label}</Text>
      {children}
    </label>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <Text className="font-bold">{title}</Text>
      <Text variant="muted" className="text-sm">{subtitle}</Text>
    </div>
  );
}

function SummaryCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-seek-md bg-white/15 p-seek-3">
      <Text className="text-xs opacity-80">{label}</Text>
      <Text className="text-lg font-bold">{value}</Text>
    </div>
  );
}

function PolicyLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-seek-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function buildNewQuiz(blueprint: Blueprint): Quiz {
  return {
    id: `quiz-${blueprint.id}`,
    title: `${blueprint.title} quiz`,
    blueprintId: blueprint.id,
    priceMnt: 0,
    accessMode: "private_code",
    accessCode: generateAccessCode(blueprint.id),
    assignedUserIds: [],
    startAt: "2026-08-01 09:00",
    endAt: "2026-08-07 18:00",
    durationMinutes: blueprint.totalDurationMinutes,
    maxAttempts: 1,
    shuffleSections: false,
    shuffleAnswers: true,
    hideSolutions: true,
    showLeaderboard: false,
    showScore: true,
    showCorrectness: false,
    showCorrectAnswers: false,
    showExplanations: false,
    resultReleaseMode: "after_close",
    status: "draft",
    questionOverrides: [],
  };
}

function generateAccessCode(blueprintId: string) {
  return blueprintId.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 12);
}

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
