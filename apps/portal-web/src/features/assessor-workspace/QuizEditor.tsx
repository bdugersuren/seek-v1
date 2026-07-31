"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, Input, PageTitle, Select, Text, useToast } from "@seek/ui";
import { getBlueprintSummary, validateQuizOverrides } from "./api";
import { mockBlueprints, mockQuestionBank, mockQuizzes } from "./mock-data";
import type {
  Blueprint,
  QuizOverrideMode,
  QuizQuestionOverride,
} from "./types";

const defaultBlueprint = mockBlueprints[0];

export function QuizEditor({
  blueprint = defaultBlueprint,
  mode = "edit",
}: {
  blueprint?: Blueprint;
  mode?: "new" | "edit";
}) {
  const existing = mockQuizzes[0];
  const [overrides, setOverrides] = useState<QuizQuestionOverride[]>(
    mode === "edit" ? existing.questionOverrides : [],
  );
  const { showToast } = useToast();
  const summary = getBlueprintSummary(blueprint);
  const errors = useMemo(
    () => validateQuizOverrides(blueprint, overrides),
    [blueprint, overrides],
  );

  const setOverride = (questionId: string, overrideMode: QuizOverrideMode) => {
    setOverrides((current) => {
      const next = current.filter((item) => item.questionId !== questionId);
      if (overrideMode === "none") return next;
      return [...next, { questionId, mode: overrideMode }];
    });
  };

  return (
    <div className="grid gap-seek-4 xl:grid-cols-[1fr_20rem]">
      <main className="space-y-seek-4">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
          <PageTitle
            title={mode === "new" ? "Quiz үүсгэх" : "Quiz засах"}
            subtitle="Blueprint дээр үндэслэн тестийн хугацаа болон заавал/хасах асуултын override тохируулна."
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
              onClick={() => showToast("Quiz хуваарь хадгалагдлаа.", "success")}
            >
              Хадгалах
            </Button>
          </div>
        </div>

        <Card className="p-seek-4">
          <div className="grid gap-seek-3 md:grid-cols-2 xl:grid-cols-4">
            <Input
              defaultValue={mode === "edit" ? existing.title : `${blueprint.title} quiz`}
              placeholder="Quiz нэр"
            />
            <Select
              defaultValue={blueprint.id}
              options={mockBlueprints.map((item) => ({
                value: item.id,
                label: item.title,
              }))}
            />
            <Input defaultValue="2026-08-01 09:00" placeholder="Эхлэх хугацаа" />
            <Input defaultValue="2026-08-07 18:00" placeholder="Дуусах хугацаа" />
            <Input type="number" defaultValue={blueprint.totalDurationMinutes} placeholder="Хугацаа минут" />
            <Input type="number" defaultValue={1} placeholder="Оролдох тоо" />
          </div>
        </Card>

        {errors.length > 0 && (
          <Card className="border-danger bg-danger-background p-seek-4">
            <Text className="font-semibold text-danger-foreground">Validation алдаа</Text>
            {errors.map((error) => (
              <Text key={error} className="text-sm text-danger-foreground">
                {error}
              </Text>
            ))}
          </Card>
        )}

        <Card className="p-seek-4">
          <div className="mb-seek-4">
            <Text className="font-bold">Blueprint question-pool override</Text>
            <Text variant="muted" className="text-sm">
              Заавал оруулах болон quiz-д оруулахгүй асуултыг section бүрээр
              тэмдэглэнэ.
            </Text>
          </div>
          <div className="space-y-seek-4">
            {blueprint.sections.map((section) => (
              <div key={section.id} className="rounded-seek-lg border border-border p-seek-4">
                <div className="mb-seek-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <Text className="font-semibold">{section.name}</Text>
                  <Badge variant="secondary">
                    Pool {section.selectedQuestionIds.length} · Сонгох{" "}
                    {section.randomPickCount}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {section.selectedQuestionIds.map((questionId) => {
                    const question = mockQuestionBank.find((item) => item.id === questionId);
                    const currentMode =
                      overrides.find((item) => item.questionId === questionId)?.mode ||
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
                          <Text variant="muted" className="text-xs">
                            {question?.stem}
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
            ))}
          </div>
        </Card>
      </main>

      <aside className="space-y-seek-4">
        <Card className="bg-gradient-to-br from-primary to-purple-600 p-seek-5 text-primary-foreground">
          <Text className="font-bold">Quiz preview</Text>
          <div className="mt-seek-4 grid grid-cols-2 gap-seek-3">
            <SummaryCell label="Pool" value={summary.pooledQuestions} />
            <SummaryCell label="Quiz-д орох" value={summary.pickedQuestions} />
            <SummaryCell
              label="Mandatory"
              value={overrides.filter((item) => item.mode === "mandatory").length}
            />
            <SummaryCell
              label="Excluded"
              value={overrides.filter((item) => item.mode === "excluded").length}
            />
          </div>
        </Card>
        <Card className="p-seek-4">
          <Text className="font-semibold">Сонголтын дүрэм</Text>
          <Text variant="muted" className="mt-2 text-sm">
            Эцсийн асуулт = mandatory + excluded биш үлдсэн pool-оос section-ийн
            m тоо хүртэл санамсаргүй сонгоно.
          </Text>
          <Badge className="mt-seek-3" variant={errors.length > 0 ? "danger" : "success"}>
            {errors.length > 0 ? "Засвар шаардлагатай" : "Хуваарь гаргахад бэлэн"}
          </Badge>
        </Card>
      </aside>
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

function SummaryCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-seek-md bg-white/15 p-seek-3">
      <Text className="text-xs opacity-80">{label}</Text>
      <Text className="text-2xl font-bold">{value}</Text>
    </div>
  );
}
