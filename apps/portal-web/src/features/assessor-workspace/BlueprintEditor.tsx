"use client";

import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Input,
  PageTitle,
  ProgressBar,
  Select,
  Text,
  Textarea,
  useToast,
} from "@seek/ui";
import { getBlueprintSummary, isBlueprintSectionValid } from "./api";
import { mockBlueprints, mockQuestionBank, topicTree } from "./mock-data";
import type { Blueprint, BlueprintSection } from "./types";

const defaultBlueprint = mockBlueprints[0];

export function BlueprintEditor({
  blueprint = defaultBlueprint,
  mode = "edit",
}: {
  blueprint?: Blueprint;
  mode?: "new" | "edit";
}) {
  const { showToast } = useToast();
  const summary = getBlueprintSummary(blueprint);

  return (
    <div className="grid gap-seek-4 xl:grid-cols-[1fr_20rem]">
      <main className="space-y-seek-4">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
          <PageTitle
            title={mode === "new" ? "Blueprint үүсгэх" : "Blueprint засах"}
            subtitle="Question-pool бүрдүүлж, хэсэг бүрээс санамсаргүй сонгох дүрмийг тохируулна."
          />
          <div className="flex gap-2">
            <Link href="/blueprints">
              <Button type="button" variant="secondary">
                Буцах
              </Button>
            </Link>
            <Button
              type="button"
              onClick={() => showToast("Blueprint хадгалагдлаа.", "success")}
            >
              Хадгалах
            </Button>
          </div>
        </div>

        <Card className="p-seek-4">
          <div className="mb-seek-4 flex gap-seek-5 border-b border-border">
            {["Ерөнхий тохиргоо", "Тестийн хэсгүүд", "Ерөнхий тайлан", "Асуултын тайлан"].map(
              (tab, index) => (
                <button
                  key={tab}
                  type="button"
                  className={`pb-seek-2 text-sm font-semibold ${
                    index === 1
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          <div className="grid gap-seek-3 md:grid-cols-2">
            <Input defaultValue={blueprint.title} placeholder="Blueprint нэр" />
            <Select
              defaultValue={blueprint.topicId}
              options={topicTree.map((item) => ({
                value: item.id,
                label: item.label,
              }))}
            />
            <Input
              type="number"
              defaultValue={blueprint.totalDurationMinutes}
              placeholder="Нийт хугацаа"
            />
            <Input
              type="number"
              defaultValue={blueprint.passScore}
              placeholder="Тэнцэх оноо %"
            />
          </div>
          <Textarea className="mt-seek-3" rows={3} defaultValue={blueprint.description} />
        </Card>

        <div className="space-y-seek-4">
          {blueprint.sections.map((section) => (
            <SectionBuilder key={section.id} section={section} />
          ))}
          <Card className="border-dashed p-seek-4">
            <div className="grid gap-seek-3 md:grid-cols-[1fr_7rem_7rem_auto]">
              <Input placeholder="Хэсгийн нэр" />
              <Input type="number" placeholder="Тоо" defaultValue={10} />
              <Input type="number" placeholder="Оноо" defaultValue={1} />
              <Button type="button" variant="secondary">
                Хэсэг нэмэх
              </Button>
            </div>
          </Card>
        </div>
      </main>

      <aside className="space-y-seek-4">
        <Card className="bg-gradient-to-br from-primary to-purple-600 p-seek-5 text-primary-foreground">
          <Text className="font-bold">Загвар нэгтгэл</Text>
          <div className="mt-seek-4 grid grid-cols-2 gap-seek-3">
            <SummaryCell label="Нийт pool" value={summary.pooledQuestions} />
            <SummaryCell label="Сонгох" value={summary.pickedQuestions} />
            <SummaryCell label="Оноо" value={summary.totalPoints} />
            <SummaryCell label="Дамжих" value={`${blueprint.passScore}%`} />
          </div>
        </Card>
        <Card className="p-seek-4">
          <Badge variant={summary.ready ? "success" : "warning"}>
            {summary.ready ? "Загвар ашиглахад бэлэн" : "Validation дутуу"}
          </Badge>
          <ProgressBar className="mt-seek-3" value={summary.ready ? 100 : 60} />
          <Button type="button" className="mt-seek-4 w-full">
            Тест үүсгэх
          </Button>
        </Card>
      </aside>
    </div>
  );
}

function SectionBuilder({ section }: { section: BlueprintSection }) {
  const valid = isBlueprintSectionValid(section);
  const selectedQuestions = mockQuestionBank.filter((question) =>
    section.selectedQuestionIds.includes(question.id),
  );

  return (
    <Card className="p-seek-4">
      <div className="flex flex-col gap-seek-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Badge>{section.name.slice(0, 1)}</Badge>
            <Text className="font-bold">{section.name}</Text>
            <Badge variant={valid ? "success" : "danger"}>
              Сан: {section.selectedQuestionIds.length}/{section.randomPickCount}
            </Badge>
          </div>
          <Text variant="muted" className="mt-1 text-sm">
            {section.description}
          </Text>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:w-[20rem]">
          <Input type="number" defaultValue={section.selectedQuestionIds.length} aria-label="Pool n" />
          <Input type="number" defaultValue={section.randomPickCount} aria-label="Pick m" />
          <Input type="number" defaultValue={section.pointsPerQuestion} aria-label="Оноо" />
        </div>
      </div>
      <div className="mt-seek-3 flex flex-wrap gap-2">
        {["Санамсаргүй", "Ашиглаагүй асуулт", "Хүндрэлийн тэнцвэр", "Адаптив AI"].map(
          (strategy, index) => (
            <button
              key={strategy}
              type="button"
              className={`rounded-seek-md border px-seek-3 py-seek-1.5 text-xs font-semibold ${
                index === 0
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-surface"
              }`}
            >
              {strategy}
            </button>
          ),
        )}
      </div>
      <div className="mt-seek-4 space-y-2 rounded-seek-md border border-border p-seek-3">
        {selectedQuestions.map((question) => (
          <div
            key={question.id}
            className="flex flex-col gap-1 rounded-seek-md bg-muted-background p-seek-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Text className="font-semibold">
                {question.code} · {question.title}
              </Text>
              <Text variant="muted" className="text-xs">
                Үндсэн оноо: {question.points}
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <Input className="w-20" type="number" defaultValue={section.pointsPerQuestion} />
              <Button type="button" variant="outline" size="sm">
                Хасах
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="secondary" size="sm">
          + Асуулт сонгох
        </Button>
      </div>
    </Card>
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
