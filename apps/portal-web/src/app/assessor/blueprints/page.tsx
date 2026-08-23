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
  useToast,
} from "@seek/ui";
import {
  DataViewToggle,
  ExplorerTopicTree,
  MetricCard,
  WorkspaceFilterSection,
  buildTopicDescendantMap,
  type ExplorerTopicNode,
} from "@/components/workspace";
import { getBlueprintSummary, fetchBlueprints, fetchQuestions } from "@/features/assessor-workspace/api";
import {
  mockBlueprints,
  mockQuizzes,
} from "@/features/assessor-workspace/mock-data";
import type { Blueprint, QuestionBankItem } from "@/features/assessor-workspace/types";

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

export default function BlueprintsPage() {
  const { showToast } = useToast();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

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
  
  // Difficulty filters (Added to aside)
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  // Creator filters (Added to aside)
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);

  const [minSections, setMinSections] = useState(0);
  const [minPool, setMinPool] = useState(0);
  const [minPick, setMinPick] = useState(0);
  const [sort, setSort] = useState("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [preview, setPreview] = useState<Blueprint | null>(null);

  // List selection state
  const [selectedBpIds, setSelectedBpIds] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const [bpData, qData] = await Promise.all([
          fetchBlueprints(),
          fetchQuestions()
        ]);
        if (active) {
          setBlueprints(bpData);
          const qMap: Record<string, any> = {};
          qData.forEach(q => {
            qMap[q.id] = q;
          });
          setQuestionsMap(qMap);
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

        // Difficulty filter
        const matchesDifficulty =
          selectedDifficulties.length === 0 ||
          blueprint.sections.some(sec =>
            sec.selectedQuestionIds.some(qId => {
              const q = questionsMap[qId];
              return q && selectedDifficulties.some(diff => q.difficulty?.includes(diff));
            })
          );

        // Creator filter
        const creatorName = blueprint.id.includes("1") || blueprint.id.includes("3") ? "Dr. Aris" : blueprint.id.includes("2") || blueprint.id.includes("6") ? "Prof. Clara" : "Sarah L.";
        const matchesCreator = selectedCreators.length === 0 || selectedCreators.includes(creatorName);

        return (
          matchesQuery &&
          matchesTopic &&
          matchesStatus &&
          matchesDifficulty &&
          matchesCreator &&
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
  }, [blueprints, minPick, minPool, minSections, query, selectedStatuses, selectedTopics, sort, questionsMap, selectedDifficulties, selectedCreators]);

  const stats = useMemo(() => {
    const summaries = filtered.map(getBlueprintSummary);
    return {
      total: filtered.length,
      ready: filtered.filter((item) => item.status === "ready" || item.status === "published").length,
      pool: summaries.reduce((sum, item) => sum + item.pooledQuestions, 0),
      pick: summaries.reduce((sum, item) => sum + item.pickedQuestions, 0),
    };
  }, [filtered]);

  const resetFilters = () => {
    setSelectedTopics([]);
    setSelectedStatuses([]);
    setSelectedDifficulties([]);
    setSelectedCreators([]);
    setMinSections(0);
    setMinPool(0);
    setMinPick(0);
    setQuery("");
  };

  return (
    <div className="grid gap-seek-4 lg:grid-cols-[18rem_minmax(0,1fr)] p-seek-6 max-w-[96rem] mx-auto w-full">
      {/* LEFT COLUMN: ASIDE FILTERS */}
      <aside className="space-y-seek-4 rounded-seek-lg border border-border bg-surface p-seek-4 lg:sticky lg:top-seek-4 lg:self-start h-fit shadow-seek-sm">
        <div className="flex items-center justify-between border-b border-border/40 pb-seek-3">
          <Text className="font-bold text-foreground">Шүүлтүүрүүд</Text>
          <button
            type="button"
            onClick={resetFilters}
            className="text-xs font-bold text-primary hover:underline"
          >
            Цэвэрлэх
          </button>
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

        {/* BLUEPRINT STATUS */}
        <WorkspaceFilterSection title="Blueprint төлөв">
          <div className="space-y-2">
            {Object.entries(statusLabels).map(([value, label]) => (
              <label key={value} className="flex items-center justify-between gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                <span className="flex items-center gap-2">
                  <Checkbox
                    checked={selectedStatuses.includes(value as BlueprintStatus)}
                    onChange={() =>
                      toggleArray(selectedStatuses, value as BlueprintStatus, setSelectedStatuses)
                    }
                  />
                  {label}
                </span>
                <Badge variant="secondary" className="text-[10px] bg-muted-background">
                  {blueprints.filter((item) => item.status === value).length}
                </Badge>
              </label>
            ))}
          </div>
        </WorkspaceFilterSection>

        {/* DIFFICULTY FILTER */}
        <WorkspaceFilterSection title="Хүндрэлийн түвшин">
          <div className="space-y-2">
            {["easy", "medium", "hard"].map((diff) => (
              <label key={diff} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                <Checkbox
                  checked={selectedDifficulties.includes(diff)}
                  onChange={() => toggleArray(selectedDifficulties, diff, setSelectedDifficulties)}
                />
                <span className="capitalize">{diff}</span>
              </label>
            ))}
          </div>
        </WorkspaceFilterSection>

        {/* CREATOR FILTER */}
        <WorkspaceFilterSection title="Үүсгэгч / Багш">
          <div className="space-y-2">
            {["Dr. Aris", "Prof. Clara", "Sarah L."].map((creator) => (
              <label key={creator} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer select-none">
                <Checkbox
                  checked={selectedCreators.includes(creator)}
                  onChange={() => toggleArray(selectedCreators, creator, setSelectedCreators)}
                />
                <span>{creator}</span>
              </label>
            ))}
          </div>
        </WorkspaceFilterSection>
        
        <WorkspaceFilterSection title="Тоон шүүлтүүр">
          <div className="space-y-seek-3">
            <NumberFilter label="Хэсгийн тоо ≥" value={minSections} onChange={setMinSections} />
            <NumberFilter label="Pool асуулт ≥" value={minPool} onChange={setMinPool} />
            <NumberFilter label="Сонгох асуулт ≥" value={minPick} onChange={setMinPick} />
          </div>
        </WorkspaceFilterSection>
      </aside>

      {/* RIGHT COLUMN: MAIN CONTENT */}
      <main className="space-y-seek-4 min-w-0">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
          <PageTitle
            title="Blueprint"
            subtitle="Question-pool, random pick, section бүтэц болон readiness төлөвөөр удирдана."
          />
          <Link href="/assessor/blueprints/new">
            <Button type="button">+ Blueprint үүсгэх</Button>
          </Link>
        </div>

        <div className="grid gap-seek-3 grid-cols-2 md:grid-cols-4">
          <MetricCard label="Нийт blueprint" value={stats.total} />
          <MetricCard label="Бэлэн" value={stats.ready} />
          <MetricCard label="Нийт pool" value={stats.pool} />
          <MetricCard label="Сонгох" value={stats.pick} />
        </div>

        {/* HEADER FILTERS (SEARCH & SORT) */}
        <Card className="p-seek-4 shadow-seek-sm border border-border bg-surface">
          <div className="flex flex-col gap-seek-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 text-xs"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search templates by title, course..."
              />
            </div>
            <Select
              className="lg:w-56 text-xs"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              options={[
                { value: "updated", label: "Sort by: Recently updated" },
                { value: "duration", label: "Sort by: Duration" },
                { value: "pass", label: "Sort by: Pass score" },
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

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Text variant="muted">Уншиж байна...</Text>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
            <Icons.CircleX size={40} className="text-muted-foreground" />
            <Text className="font-semibold mt-seek-3">Blueprint олдсонгүй</Text>
            <Text variant="muted" className="mt-1 text-sm">
              Тохирох шүүлтүүртэй blueprint байхгүй байна.
            </Text>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid gap-seek-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((blueprint) => (
              <BlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                questionsMap={questionsMap}
                onPreview={() => setPreview(blueprint)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-seek-4">
            <BlueprintTable
              blueprints={filtered}
              questionsMap={questionsMap}
              selectedIds={selectedBpIds}
              onSelectIds={setSelectedBpIds}
              onPreview={setPreview}
            />
            
            {/* PAGINATION */}
            <div className="flex items-center justify-between border-t border-border/40 pt-seek-4">
              <Text variant="muted" className="text-xs">
                Showing 1-{filtered.length} of {filtered.length} blueprints
              </Text>
              <div className="flex items-center gap-1">
                <Button type="button" variant="outline" size="sm" className="px-2" disabled>
                  &lt;
                </Button>
                <Button type="button" variant="primary" size="sm" className="px-3 h-8 text-xs font-bold">
                  1
                </Button>
                <Button type="button" variant="outline" size="sm" className="px-3 h-8 text-xs font-bold">
                  2
                </Button>
                <Button type="button" variant="outline" size="sm" className="px-2" disabled>
                  &gt;
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {preview && (
        <BlueprintPreviewModal
          blueprint={preview}
          questionsMap={questionsMap}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

/* BLUEPRINT CARD COMPONENT */
function BlueprintCard({
  blueprint,
  questionsMap,
  onPreview,
}: {
  blueprint: Blueprint;
  questionsMap: Record<string, any>;
  onPreview: () => void;
}) {
  const summary = getBlueprintSummary(blueprint);
  const { showToast } = useToast();

  const difficultyStats = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    blueprint.sections.forEach(sec => {
      sec.selectedQuestionIds.forEach(qId => {
        const q = questionsMap[qId];
        if (q) {
          if (q.difficulty?.includes("easy")) easy++;
          else if (q.difficulty?.includes("hard")) hard++;
          else medium++;
        }
      });
    });
    const total = easy + medium + hard || 1;
    return {
      easy: Math.round((easy / total) * 100),
      medium: Math.round((medium / total) * 100),
      hard: Math.round((hard / total) * 100),
    };
  }, [blueprint.sections, questionsMap]);

  return (
    <Card className="overflow-hidden border border-border shadow-seek-sm bg-surface rounded-seek-lg flex flex-col justify-between">
      <div className="p-seek-4 space-y-seek-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[10px] font-bold py-0.5 px-2 rounded">
              {blueprint.topicName || "Math 101"}
            </Badge>
            <Badge variant={blueprint.status === "published" ? "success" : "warning"} className="text-[10px] font-bold py-0.5 px-2 rounded">
              {blueprint.status === "published" ? "Published" : "Draft"}
            </Badge>
          </div>
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <Icons.Settings className="h-4 w-4" />
          </button>
        </div>

        <div>
          <Text className="text-base font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
            <Link href={`/assessor/blueprints/${blueprint.id}`}>
              {blueprint.title}
            </Link>
          </Text>
        </div>

        {/* Metrics icons */}
        <div className="flex items-center gap-seek-4 text-[10px] font-bold text-muted-foreground">
          <span className="flex items-center gap-1">
            <Icons.ListChecks className="h-3.5 w-3.5 text-muted-foreground" /> {blueprint.sections.length} Pools
          </span>
          <span className="flex items-center gap-1">
            <Icons.BulletList className="h-3.5 w-3.5 text-muted-foreground" /> {summary.pooledQuestions} Questions
          </span>
          <span className="flex items-center gap-1">
            <Icons.Timer className="h-3.5 w-3.5 text-muted-foreground" /> ~{blueprint.totalDurationMinutes} Mins
          </span>
        </div>

        {/* Est. Difficulty Progress bar */}
        <div className="space-y-2 border-t border-border/40 pt-seek-3">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Est. Difficulty</span>
            <span className="text-foreground">{difficultyStats.easy}/{difficultyStats.medium}/{difficultyStats.hard}</span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-border">
            <div style={{ width: `${difficultyStats.easy}%` }} className="h-full bg-emerald-500" />
            <div style={{ width: `${difficultyStats.medium}%` }} className="h-full bg-amber-500" />
            <div style={{ width: `${difficultyStats.hard}%` }} className="h-full bg-rose-500" />
          </div>
          <div className="flex gap-2.5 text-[9px] font-bold text-muted-foreground">
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Easy {difficultyStats.easy}%</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Med {difficultyStats.medium}%</span>
            <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Hard {difficultyStats.hard}%</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between border-t border-border/40 bg-muted-background/5 p-seek-4">
        <div>
          <Text className="text-[10px] font-bold text-primary">Used in 12 active exams</Text>
          <Text variant="muted" className="text-[9px] mt-0.5">Updated 2 days ago</Text>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="border-primary/20 text-primary hover:bg-primary/5 text-xs font-bold"
          onClick={() => {
            showToast("Exam generated successfully", "success");
            onPreview();
          }}
        >
          Generate Exam
        </Button>
      </div>
    </Card>
  );
}

/* BLUEPRINT TABLE COMPONENT */
function BlueprintTable({
  blueprints,
  questionsMap,
  selectedIds,
  onSelectIds,
  onPreview,
}: {
  blueprints: Blueprint[];
  questionsMap: Record<string, any>;
  selectedIds: string[];
  onSelectIds: (ids: string[]) => void;
  onPreview: (blueprint: Blueprint) => void;
}) {
  const toggleSelectAll = () => {
    if (selectedIds.length === blueprints.length) {
      onSelectIds([]);
    } else {
      onSelectIds(blueprints.map(b => b.id));
    }
  };

  const toggleSelect = (id: string) => {
    onSelectIds(
      selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]
    );
  };

  return (
    <Card className="overflow-x-auto border border-border shadow-seek-sm bg-surface rounded-seek-lg">
      <table className="w-full min-w-[64rem] text-left text-xs">
        <thead className="bg-muted-background/35 text-muted-foreground border-b border-border/60">
          <tr className="text-[10px] font-bold uppercase tracking-wider">
            <th className="p-seek-3 w-10 text-center">
              <Checkbox
                checked={blueprints.length > 0 && selectedIds.length === blueprints.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th className="p-seek-3">Blueprint Name</th>
            <th className="p-seek-3 w-28">Course</th>
            <th className="p-seek-3 w-40">Pools / Questions</th>
            <th className="p-seek-3 w-48">Difficulty</th>
            <th className="p-seek-3 w-28">Usage</th>
            <th className="p-seek-3 w-32">Last Modified</th>
            <th className="p-seek-3 w-28 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blueprints.map((blueprint) => {
            const summary = getBlueprintSummary(blueprint);
            const isChecked = selectedIds.includes(blueprint.id);
            const creatorName = blueprint.id.includes("1") || blueprint.id.includes("3") ? "Dr. Aris" : blueprint.id.includes("2") || blueprint.id.includes("6") ? "Prof. Clara" : "Sarah L.";

            const difficultyStats = (() => {
              let easy = 0, medium = 0, hard = 0;
              blueprint.sections.forEach(sec => {
                sec.selectedQuestionIds.forEach(qId => {
                  const q = questionsMap[qId];
                  if (q) {
                    if (q.difficulty?.includes("easy")) easy++;
                    else if (q.difficulty?.includes("hard")) hard++;
                    else medium++;
                  }
                });
              });
              const total = easy + medium + hard || 1;
              return {
                easy: Math.round((easy / total) * 100),
                medium: Math.round((medium / total) * 100),
                hard: Math.round((hard / total) * 100),
              };
            })();

            return (
              <tr key={blueprint.id} className="border-b border-border/40 hover:bg-muted-background/5 transition-colors">
                <td className="p-seek-3 text-center">
                  <Checkbox checked={isChecked} onChange={() => toggleSelect(blueprint.id)} />
                </td>
                <td className="p-seek-3">
                  <Text className="font-bold text-foreground hover:text-primary transition-colors">
                    <Link href={`/assessor/blueprints/${blueprint.id}`}>
                      {blueprint.title}
                    </Link>
                  </Text>
                  <Text variant="muted" className="text-[10px] mt-0.5 font-medium">
                    Created by {creatorName}
                  </Text>
                </td>
                <td className="p-seek-3">
                  <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold py-0.5 px-2 rounded">
                    {blueprint.topicName || "Math 101"}
                  </Badge>
                </td>
                <td className="p-seek-3">
                  <span className="font-bold text-foreground text-xs block">{blueprint.sections.length} Pools</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5 font-medium block">
                    {summary.pooledQuestions} Questions · ~{blueprint.totalDurationMinutes}m
                  </span>
                </td>
                <td className="p-seek-3">
                  <div className="space-y-1">
                    <div className="flex h-1.5 w-32 overflow-hidden rounded-full bg-border">
                      <div style={{ width: `${difficultyStats.easy}%` }} className="h-full bg-emerald-500" />
                      <div style={{ width: `${difficultyStats.medium}%` }} className="h-full bg-amber-500" />
                      <div style={{ width: `${difficultyStats.hard}%` }} className="h-full bg-rose-500" />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground block">
                      {difficultyStats.easy}% E / {difficultyStats.medium}% M / {difficultyStats.hard}% H
                    </span>
                  </div>
                </td>
                <td className="p-seek-3">
                  <span className="font-bold text-primary text-[10px] block">12 active</span>
                </td>
                <td className="p-seek-3 font-semibold text-muted-foreground">
                  2 days ago
                </td>
                <td className="p-seek-3 text-center">
                  <div className="flex justify-center gap-1.5">
                    <Link href={`/assessor/blueprints/${blueprint.id}`}>
                      <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded" title="Засах">
                        <Icons.SavePen className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => onPreview(blueprint)}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded"
                      title="Хуулах"
                    >
                      <Icons.Undo2 className="h-3.5 w-3.5 rotate-180" />
                    </button>
                    <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded">
                      <Icons.Settings className="h-3.5 w-3.5" />
                    </button>
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

function BlueprintPreviewModal({
  blueprint,
  questionsMap,
  onClose,
}: {
  blueprint: Blueprint;
  questionsMap: Record<string, any>;
  onClose: () => void;
}) {
  const summary = getBlueprintSummary(blueprint);
  const checks = [
    { label: "Ерөнхий мэдээлэл бөглөгдсөн", ok: blueprint.title.length > 0 },
    { label: "Section бүр valid", ok: summary.ready },
    { label: "Pass score тохирсон", ok: blueprint.passScore > 0 },
    { label: "Question pool бүрдсэн", ok: summary.pooledQuestions > 0 },
  ];

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-black/45 p-seek-4">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-5 shadow-seek-xl bg-surface border border-border rounded-seek-lg">
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
              {section.selectedQuestionIds.length > 0 && (
                <div className="mt-seek-3 space-y-2 border-t border-border pt-seek-3">
                  <Text className="text-xs font-semibold text-muted-foreground">Сонгосон асуултууд:</Text>
                  <ul className="list-inside list-disc text-sm space-y-1">
                    {section.selectedQuestionIds.map((qId) => {
                      const q = questionsMap[qId];
                      return (
                        <li key={qId} className="text-foreground">
                          {q ? `${q.code} · ${q.title} (${q.type})` : `Асуулт ID: ${qId}`}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
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

function NumberFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-xs">
      <span className="font-semibold text-foreground">{label}</span>
      <Input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-8" />
    </label>
  );
}

function toggleArray<T>(values: T[], value: T, setValues: (next: T[]) => void) {
  setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
}
