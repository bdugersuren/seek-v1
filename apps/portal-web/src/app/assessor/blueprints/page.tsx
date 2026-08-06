"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Icons,
  Input,
  PageTitle,
  ProgressBar,
  Select,
  Text,
} from "@seek/ui";
import {
  DataViewToggle,
  ExplorerTopicTree,
  MetricCard,
  WorkspaceFilterSection,
  buildTopicDescendantMap,
  type ExplorerTopicNode,
} from "@/components/workspace";
import { getBlueprintSummary, fetchBlueprints } from "@/features/assessor-workspace/api";
import {
  mockBlueprints,
  mockQuizzes,
} from "@/features/assessor-workspace/mock-data";
import type { Blueprint } from "@/features/assessor-workspace/types";

type ViewMode = "card" | "table";
type BlueprintStatus = Blueprint["status"];

const topicNodes: ExplorerTopicNode[] = [
  {
    id: "quiz",
    label: "quiz",
    count: 6,
    children: [
      {
        id: "general-knowledge",
        label: "Ерөнхий мэдлэг",
        count: 0,
        children: [
          { id: "governance", label: "Засаглалын бүтэц", count: 0 },
          { id: "constitution", label: "Монгол Улсын Үндсэн хууль", count: 0 },
          { id: "socio-economic", label: "Нийгэм-эдийн засаг, дэлхийн шинжилгээ", count: 0 },
          { id: "international-relations", label: "Олон улсын харилцаа", count: 0 },
          { id: "civil-service-law", label: "Төрийн албаны тухай хууль", count: 0 },
        ],
      },
      {
        id: "digital-foundation",
        label: "Мэдээллийн технологийн үндсэн чадвар",
        count: 1,
        children: [
          { id: "computer-use", label: "Компьютерийн хэрэглээ", count: 0 },
          { id: "cyber", label: "Мэдээллийн аюулгүй байдал, цахим орчны соёл", count: 1 },
          { id: "office", label: "Оффис программ", count: 0 },
        ],
      },
      {
        id: "cognitive",
        label: "Танин мэдэхүй",
        count: 4,
        children: [
          { id: "analytics", label: "Аналитик сэтгэлгээ", count: 0 },
          { id: "logic", label: "Логик сэтгэлгээ", count: 0 },
          {
            id: "math",
            label: "Математик үндэс",
            count: 4,
            children: [
              { id: "fractions", label: "Энгийн бутархай", count: 2 },
              { id: "algebra", label: "Шугаман алгебр", count: 1 },
              { id: "equation", label: "Тэгшитгэл", count: 1 },
            ],
          },
        ],
      },
      {
        id: "personal-behaviour",
        label: "Хувь хүний зан төлөв",
        count: 1,
        children: [
          { id: "ethics", label: "Ёс зүй", count: 0 },
          { id: "communication", label: "Харилцааны ур чадвар", count: 1 },
        ],
      },
    ],
  },
];

const topicDescendantMap = buildTopicDescendantMap(topicNodes);

const statusLabels: Record<BlueprintStatus, string> = {
  draft: "Ноорог",
  ready: "Ашиглахад бэлэн",
  published: "Нийтлэгдсэн",
  archived: "Архивлагдсан",
};

const blueprints: Blueprint[] = [
  ...mockBlueprints,
  {
    ...mockBlueprints[0],
    id: "bp-algebra-mix",
    title: "Алгебрийн суурь холимог",
    description: "Шугаман алгебр, тэгшитгэл, хэрэглээний бодлогын blueprint.",
    topicId: "algebra",
    topicName: "Шугаман алгебр",
    passScore: 70,
    totalDurationMinutes: 35,
    status: "draft",
    updatedAt: "2026-07-30 15:20",
    sections: mockBlueprints[0].sections.map((section, index) => ({
      ...section,
      id: `alg-${section.id}`,
      name: `${String.fromCharCode(65 + index)}. Алгебр хэсэг`,
      randomPickCount: index === 0 ? 3 : 2,
      selectedQuestionIds: ["qb-002", "qb-005", "qb-001"],
    })),
  },
];

export default function BlueprintsPage() {
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchBlueprints();
        if (active) {
          setBlueprints(data);
        }
      } catch (err) {
        console.error("Failed to load blueprints", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([
    "quiz",
    "digital-foundation",
    "cognitive",
    "math",
    "personal-behaviour",
  ]);
  const [selectedStatuses, setSelectedStatuses] = useState<BlueprintStatus[]>([]);
  const [minSections, setMinSections] = useState(0);
  const [minPool, setMinPool] = useState(0);
  const [minPick, setMinPick] = useState(0);
  const [sort, setSort] = useState("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [preview, setPreview] = useState<Blueprint | null>(null);

  const filtered = useMemo(() => {
    return blueprints
      .filter((blueprint) => {
        const summary = getBlueprintSummary(blueprint);
        const matchesQuery =
          blueprint.title.toLowerCase().includes(query.toLowerCase()) ||
          blueprint.description.toLowerCase().includes(query.toLowerCase());
        const matchesTopic =
          selectedTopics.length === 0 ||
          selectedTopics.some(
            (topicId) =>
              blueprint.topicId === topicId ||
              topicDescendantMap[topicId]?.includes(blueprint.topicId),
          );
        const matchesStatus =
          selectedStatuses.length === 0 || selectedStatuses.includes(blueprint.status);
        return (
          matchesQuery &&
          matchesTopic &&
          matchesStatus &&
          blueprint.sections.length >= minSections &&
          summary.pooledQuestions >= minPool &&
          summary.pickedQuestions >= minPick
        );
      })
      .sort((a, b) => {
        if (sort === "duration") return b.totalDurationMinutes - a.totalDurationMinutes;
        if (sort === "pass") return b.passScore - a.passScore;
        return b.updatedAt.localeCompare(a.updatedAt);
      });
  }, [minPick, minPool, minSections, query, selectedStatuses, selectedTopics, sort]);

  const stats = useMemo(() => {
    const summaries = filtered.map(getBlueprintSummary);
    return {
      total: filtered.length,
      ready: filtered.filter((item) => item.status === "ready" || item.status === "published").length,
      pool: summaries.reduce((sum, item) => sum + item.pooledQuestions, 0),
      pick: summaries.reduce((sum, item) => sum + item.pickedQuestions, 0),
    };
  }, [filtered]);

  return (
    <div className="grid gap-seek-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="space-y-seek-4 rounded-seek-lg border border-border bg-surface p-seek-4 lg:sticky lg:top-seek-4 lg:self-start">
        <div className="flex items-center justify-between">
          <Text className="font-bold">Шүүлтүүрүүд</Text>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedTopics([]);
              setSelectedStatuses([]);
              setMinSections(0);
              setMinPool(0);
              setMinPick(0);
            }}
          >
            Цэвэрлэх
          </Button>
        </div>
        <WorkspaceFilterSection
          title="Сэдвийн сан"
          subtitle="Folder tree-ээс leaf сэдэв сонгоно."
          selectedCount={selectedTopics.length}
        >
          <ExplorerTopicTree
            nodes={topicNodes}
            selectedIds={selectedTopics}
            openIds={openTopicIds}
            onToggle={(id) => toggleArray(selectedTopics, id, setSelectedTopics)}
            onToggleOpen={(id) =>
              setOpenTopicIds((current) =>
                current.includes(id)
                  ? current.filter((topicId) => topicId !== id)
                  : [...current, id],
              )
            }
          />
        </WorkspaceFilterSection>
        <WorkspaceFilterSection title="Blueprint төлөв">
          {Object.entries(statusLabels).map(([value, label]) => (
            <label key={value} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex items-center gap-2">
                <Checkbox
                  checked={selectedStatuses.includes(value as BlueprintStatus)}
                  onChange={() =>
                    toggleArray(selectedStatuses, value as BlueprintStatus, setSelectedStatuses)
                  }
                />
                {label}
              </span>
              <Badge variant="secondary">
                {blueprints.filter((item) => item.status === value).length}
              </Badge>
            </label>
          ))}
        </WorkspaceFilterSection>
        <WorkspaceFilterSection title="Тоон шүүлтүүр">
          <NumberFilter label="Хэсгийн тоо ≥" value={minSections} onChange={setMinSections} />
          <NumberFilter label="Pool асуулт ≥" value={minPool} onChange={setMinPool} />
          <NumberFilter label="Сонгох асуулт ≥" value={minPick} onChange={setMinPick} />
        </WorkspaceFilterSection>
      </aside>

      <main className="space-y-seek-4">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
          <PageTitle
            title="Blueprint"
            subtitle="Question-pool, random pick, section бүтэц болон readiness төлөвөөр удирдана."
          />
          <Link href="/assessor/blueprints/new">
            <Button type="button">+ Blueprint үүсгэх</Button>
          </Link>
        </div>

        <div className="grid gap-seek-3 md:grid-cols-4">
          <MetricCard label="Нийт blueprint" value={stats.total} />
          <MetricCard label="Бэлэн" value={stats.ready} />
          <MetricCard label="Нийт pool" value={stats.pool} />
          <MetricCard label="Сонгох" value={stats.pick} />
        </div>

        <Card className="p-seek-4">
          <div className="flex flex-col gap-seek-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Blueprint нэр, тайлбар хайх..."
              />
            </div>
            <Select
              className="lg:w-56"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              options={[
                { value: "updated", label: "Шинэ зассан эхэнд" },
                { value: "duration", label: "Хугацаа ихээс" },
                { value: "pass", label: "Pass score ихээс" },
              ]}
            />
            <DataViewToggle
              value={viewMode}
              onChange={setViewMode}
              options={[
                { value: "card", label: "Карт" },
                { value: "table", label: "Жагсаалт" },
              ]}
            />
          </div>
        </Card>

        {viewMode === "card" ? (
          <div className="grid gap-seek-4 xl:grid-cols-2">
            {filtered.map((blueprint) => (
              <BlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                onPreview={() => setPreview(blueprint)}
              />
            ))}
          </div>
        ) : (
          <BlueprintTable blueprints={filtered} onPreview={setPreview} />
        )}

        <Pagination total={filtered.length} />
      </main>

      {preview && <BlueprintPreviewModal blueprint={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function BlueprintCard({ blueprint, onPreview }: { blueprint: Blueprint; onPreview: () => void }) {
  const summary = getBlueprintSummary(blueprint);
  const canCreateQuiz = isBlueprintApproved(blueprint);
  const quizCount = getQuizCount(blueprint.id);
  return (
    <Card className="overflow-hidden">
      <div className="p-seek-5">
      <div className="flex items-start justify-between gap-seek-4">
        <div>
          <Badge variant={summary.ready ? "success" : "warning"}>
            {summary.ready ? "Ашиглахад бэлэн" : "Дутуу"}
          </Badge>
          <Text className="mt-seek-3 text-xl font-bold">{blueprint.title}</Text>
          <Text variant="muted" className="mt-1 line-clamp-2">{blueprint.description}</Text>
        </div>
        <Text className="text-right text-sm text-muted-foreground">{blueprint.updatedAt}</Text>
      </div>
      <div className="mt-seek-4 grid gap-seek-3 sm:grid-cols-2 lg:grid-cols-5">
        <MetricCard label="Section" value={blueprint.sections.length} />
        <MetricCard label="Pool" value={summary.pooledQuestions} />
        <MetricCard label="Сонгох" value={summary.pickedQuestions} />
        <MetricCard label="Хугацаа" value={`${blueprint.totalDurationMinutes}м`} />
        <MetricCard label="Quiz" value={quizCount} />
      </div>
      <div className="mt-seek-4">
        <ProgressBar value={blueprint.passScore} />
        <Text variant="muted" className="mt-1 text-xs">Тэнцэх оноо {blueprint.passScore}%</Text>
      </div>
      </div>
      <div className="grid gap-2 border-t border-border bg-muted-background/50 p-seek-4 sm:grid-cols-[auto_auto_minmax(12rem,1fr)] sm:items-center">
        <Button type="button" variant="outline" onClick={onPreview}>Харах</Button>
        <Link href={`/assessor/blueprints/${blueprint.id}`}>
          <Button type="button" variant="secondary">Засах</Button>
        </Link>
        {canCreateQuiz ? (
          <Link href={`/assessor/quizzes/new?blueprintId=${blueprint.id}`}>
            <Button type="button" className="w-full">+ Quiz үүсгэх</Button>
          </Link>
        ) : (
          <Button type="button" className="w-full" disabled title="Blueprint баталгаажсаны дараа quiz үүсгэнэ">
            Quiz үүсгэх
          </Button>
        )}
      </div>
    </Card>
  );
}

function BlueprintTable({
  blueprints,
  onPreview,
}: {
  blueprints: Blueprint[];
  onPreview: (blueprint: Blueprint) => void;
}) {
  return (
    <Card className="overflow-x-auto">
      <table className="w-full min-w-[64rem] text-left text-sm">
        <thead className="bg-muted-background text-muted-foreground">
          <tr>
            <th className="p-seek-3">Blueprint</th>
            <th className="p-seek-3">Сэдэв</th>
            <th className="p-seek-3">Төлөв</th>
            <th className="p-seek-3">Section</th>
            <th className="p-seek-3">Pool</th>
            <th className="p-seek-3">Сонгох</th>
            <th className="p-seek-3">Quiz</th>
            <th className="p-seek-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {blueprints.map((blueprint) => {
            const summary = getBlueprintSummary(blueprint);
            const canCreateQuiz = isBlueprintApproved(blueprint);
            const quizCount = getQuizCount(blueprint.id);
            return (
              <tr key={blueprint.id} className="border-t border-border">
                <td className="p-seek-3">
                  <Text className="font-semibold">{blueprint.title}</Text>
                  <Text variant="muted" className="line-clamp-1 text-xs">
                    {blueprint.description}
                  </Text>
                </td>
                <td className="p-seek-3">{blueprint.topicName}</td>
                <td className="p-seek-3">
                  <Badge variant={blueprint.status === "draft" ? "warning" : "success"}>
                    {statusLabels[blueprint.status]}
                  </Badge>
                </td>
                <td className="p-seek-3">{blueprint.sections.length}</td>
                <td className="p-seek-3">{summary.pooledQuestions}</td>
                <td className="p-seek-3">{summary.pickedQuestions}</td>
                <td className="p-seek-3">{quizCount}</td>
                <td className="p-seek-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => onPreview(blueprint)}>
                      Харах
                    </Button>
                    <Link href={`/assessor/blueprints/${blueprint.id}`}>
                      <Button type="button" size="sm" variant="secondary">Засах</Button>
                    </Link>
                    {canCreateQuiz ? (
                      <Link href={`/assessor/quizzes/new?blueprintId=${blueprint.id}`}>
                        <Button type="button" size="sm">Quiz үүсгэх</Button>
                      </Link>
                    ) : (
                      <Button type="button" size="sm" disabled title="Blueprint баталгаажсаны дараа quiz үүсгэнэ">
                        Quiz
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function isBlueprintApproved(blueprint: Blueprint) {
  return blueprint.status === "ready" || blueprint.status === "published";
}

function BlueprintPreviewModal({ blueprint, onClose }: { blueprint: Blueprint; onClose: () => void }) {
  const summary = getBlueprintSummary(blueprint);
  const checks = [
    { label: "Ерөнхий мэдээлэл бөглөгдсөн", ok: blueprint.title.length > 0 },
    { label: "Section бүр valid", ok: summary.ready },
    { label: "Pass score тохирсон", ok: blueprint.passScore > 0 },
    { label: "Question pool бүрдсэн", ok: summary.pooledQuestions > 0 },
  ];

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-black/45 p-seek-4">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-5">
        <div className="flex items-start justify-between gap-seek-4">
          <div>
            <Badge variant={summary.ready ? "success" : "warning"}>
              {statusLabels[blueprint.status]}
            </Badge>
            <Text className="mt-seek-3 text-2xl font-bold">{blueprint.title}</Text>
            <Text variant="muted" className="mt-1">{blueprint.description}</Text>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Хаах</Button>
        </div>
        <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-4">
          <MetricCard label="Section" value={blueprint.sections.length} />
          <MetricCard label="Pool" value={summary.pooledQuestions} />
          <MetricCard label="Сонгох" value={summary.pickedQuestions} />
          <MetricCard label="Оноо" value={summary.totalPoints} />
        </div>
        <div className="mt-seek-4 space-y-3">
          {blueprint.sections.map((section) => (
            <div key={section.id} className="rounded-seek-lg border border-border p-seek-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Text className="font-bold">{section.name}</Text>
                <Badge variant={section.randomPickCount <= section.selectedQuestionIds.length ? "success" : "danger"}>
                  Pool {section.selectedQuestionIds.length} · Pick {section.randomPickCount}
                </Badge>
              </div>
              <Text variant="muted" className="mt-1 text-sm">{section.description}</Text>
            </div>
          ))}
        </div>
        <div className="mt-seek-4 grid gap-seek-2 md:grid-cols-2">
          {checks.map((check) => (
            <div
              key={check.label}
              className={`rounded-seek-md border p-seek-3 ${
                check.ok ? "border-success bg-success-background" : "border-warning bg-warning-background"
              }`}
            >
              <Text className="font-semibold">{check.ok ? "✓" : "!"} {check.label}</Text>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NumberFilter({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      <Input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function Pagination({ total }: { total: number }) {
  return (
    <div className="flex items-center justify-between rounded-seek-lg border border-border bg-surface p-seek-3">
      <Text variant="muted" className="text-sm">Нийт {total} blueprint</Text>
      <div className="flex gap-2">
        <Button type="button" size="sm" variant="outline">1</Button>
        <Button type="button" size="sm" variant="secondary">2</Button>
      </div>
    </div>
  );
}

function getQuizCount(blueprintId: string) {
  return mockQuizzes.filter((quiz) => quiz.blueprintId === blueprintId).length;
}

function toggleArray<T>(values: T[], value: T, setValues: (next: T[]) => void) {
  setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
}
