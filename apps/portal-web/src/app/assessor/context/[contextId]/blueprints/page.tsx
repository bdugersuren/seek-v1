"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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
import {
  getBlueprintSummary,
  fetchBlueprints,
  fetchQuestions,
  fetchTopics,
  fetchAssessmentContexts,
  fetchAudienceTypes,
  fetchAudienceLevels,
} from "@/features/assessor-workspace/api";
import type { Blueprint, QuestionBankItem } from "@/features/assessor-workspace/types";
import { CreateBlueprintModal } from "@/features/assessor-workspace/CreateBlueprintModal";

type ViewMode = "card" | "table";
type BlueprintStatus = Blueprint["status"];

const statusLabels: Record<BlueprintStatus, string> = {
  draft: "Ноорог",
  ready: "Ашиглахад бэлэн",
  published: "Нийтлэгдсэн",
  archived: "Архивлагдсан",
};

export default function ContextBlueprintsPage() {
  const params = useParams();
  const contextId = params.contextId as string;
  const router = useRouter();
  const { showToast } = useToast();

  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [questionsMap, setQuestionsMap] = useState<Record<string, QuestionBankItem>>({});
  const [rawTopics, setRawTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any>(null);

  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<BlueprintStatus[]>([]);
  const [minSections, setMinSections] = useState(0);
  const [minPool, setMinPool] = useState(0);
  const [minPick, setMinPick] = useState(0);
  const [sort, setSort] = useState("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [preview, setPreview] = useState<Blueprint | null>(null);

  // Audience filter states
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [audienceLevels, setAudienceLevels] = useState<any[]>([]);
  const [selectedAudienceType, setSelectedAudienceType] = useState<string>("");
  const [selectedAudienceLevelIds, setSelectedAudienceLevelIds] = useState<string[]>([]);
  const [openAudienceLevelIds, setOpenAudienceLevelIds] = useState<string[]>([]);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const [bpData, qData, tData, contextsData, audTypes, audLvs] = await Promise.all([
          fetchBlueprints(contextId),
          fetchQuestions({ ownerUserId: "mock-assessor", assessmentContextId: contextId }),
          fetchTopics(contextId),
          fetchAssessmentContexts(),
          fetchAudienceTypes(),
          fetchAudienceLevels(),
        ]);
        if (active) {
          setBlueprints(bpData);
          setRawTopics(tData || []);
          setAudienceTypes(audTypes || []);
          setAudienceLevels(audLvs || []);
          
          const currentContext = contextsData?.find((c: any) => c.id === contextId);
          setContext(currentContext || null);
          
          if (currentContext && currentContext.audienceTypeId) {
            setSelectedAudienceType(currentContext.audienceTypeId);
          } else if (audTypes && audTypes.length > 0) {
            setSelectedAudienceType(audTypes[0].id);
          }
          
          const qMap: Record<string, QuestionBankItem> = {};
          (qData || []).forEach(q => {
            qMap[q.id] = q;
          });
          setQuestionsMap(qMap);
        }
      } catch (err) {
        console.error("Failed to load context blueprints dashboard", err);
        showToast("Мэдээллийг татаж чадсангүй.", "danger");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (contextId) {
      load();
    }
    return () => {
      active = false;
    };
  }, [contextId, showToast]);

  // Nested topics structure
  const nestedTopics = useMemo(() => {
    if (!rawTopics || rawTopics.length === 0) return [];
    
    const nodesMap: Record<string, ExplorerTopicNode> = {};
    const roots: ExplorerTopicNode[] = [];

    rawTopics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.title || t.name,
        count: blueprints.filter(bp => bp.topicId === t.id).length,
        children: [],
      };
    });

    rawTopics.forEach((t) => {
      const node = nodesMap[t.id];
      if (t.parentId && nodesMap[t.parentId]) {
        nodesMap[t.parentId].children = nodesMap[t.parentId].children || [];
        nodesMap[t.parentId].children!.push(node);
        nodesMap[t.parentId].count = (nodesMap[t.parentId].count || 0) + (node.count || 0);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [rawTopics, blueprints]);

  const topicDescendantMap = useMemo(() => {
    return buildTopicDescendantMap(nestedTopics);
  }, [nestedTopics]);

  // Nested audience levels structure (same as question-bank)
  const nestedAudienceLevels = useMemo(() => {
    if (!selectedAudienceType || !audienceLevels || audienceLevels.length === 0) return [];
    
    const filteredLevels = audienceLevels.filter(al => al.audienceTypeId === selectedAudienceType);
    const nodesMap: Record<string, ExplorerTopicNode> = {};
    const roots: ExplorerTopicNode[] = [];

    filteredLevels.forEach((l) => {
      nodesMap[l.id] = {
        id: l.id,
        label: l.name || l.code,
        count: blueprints.filter(bp => 
          bp.sections.some(sec => 
            sec.selectedQuestionIds.some(qId => {
              const question = questionsMap[qId];
              return question && question.topicMappings?.some(mapping => mapping.audienceLevelId === l.id);
            })
          )
        ).length,
        children: [],
      };
    });

    filteredLevels.forEach((l) => {
      const node = nodesMap[l.id];
      if (l.parentId && nodesMap[l.parentId]) {
        nodesMap[l.parentId].children = nodesMap[l.parentId].children || [];
        nodesMap[l.parentId].children!.push(node);
        nodesMap[l.parentId].count = (nodesMap[l.parentId].count || 0) + (node.count || 0);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [selectedAudienceType, audienceLevels, blueprints, questionsMap]);

  const audienceDescendantMap = useMemo(() => {
    return buildTopicDescendantMap(nestedAudienceLevels);
  }, [nestedAudienceLevels]);

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
          
        const matchesAudience =
          selectedAudienceLevelIds.length === 0 ||
          blueprint.sections.some((section) =>
            section.selectedQuestionIds.some((qId) => {
              const question = questionsMap[qId];
              return question && question.topicMappings?.some(mapping => 
                selectedAudienceLevelIds.some(levelId => 
                  mapping.audienceLevelId === levelId || 
                  audienceDescendantMap[levelId]?.includes(mapping.audienceLevelId || "")
                )
              );
            })
          );

        return (
          matchesQuery &&
          matchesTopic &&
          matchesStatus &&
          matchesAudience &&
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
  }, [blueprints, minPick, minPool, minSections, query, selectedStatuses, selectedTopics, sort, topicDescendantMap, selectedAudienceLevelIds, audienceDescendantMap, questionsMap]);

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
    setSelectedAudienceLevelIds([]);
    setMinSections(0);
    setMinPool(0);
    setMinPick(0);
    setQuery("");
  };

  return (
    <div className="grid gap-seek-4 lg:grid-cols-[18rem_minmax(0,1fr)] p-seek-6">
      <aside className="space-y-seek-4 rounded-seek-lg border border-border bg-surface p-seek-4 lg:sticky lg:top-seek-4 lg:self-start h-fit">
        <div className="flex items-center justify-between">
          <Text className="font-bold">Шүүлтүүрүүд</Text>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={resetFilters}
          >
            Цэвэрлэх
          </Button>
        </div>
        
        {nestedTopics.length > 0 && (
          <WorkspaceFilterSection
            title="Сэдвийн сан"
            subtitle="Folder tree-ээс сэдэв сонгоно."
            selectedCount={selectedTopics.length}
          >
            <ExplorerTopicTree
              nodes={nestedTopics}
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
        )}

        {nestedAudienceLevels.length > 0 && (
          <WorkspaceFilterSection
            title="Зорилтот бүлгийн түвшин"
            subtitle="Зорилтот бүлгийн түвшнээр шүүнэ."
            selectedCount={selectedAudienceLevelIds.length}
          >
            <ExplorerTopicTree
              nodes={nestedAudienceLevels}
              selectedIds={selectedAudienceLevelIds}
              openIds={openAudienceLevelIds}
              onToggle={(id) => toggleArray(selectedAudienceLevelIds, id, setSelectedAudienceLevelIds)}
              onToggleOpen={(id) =>
                setOpenAudienceLevelIds((current) =>
                  current.includes(id)
                    ? current.filter((lvlId) => lvlId !== id)
                    : [...current, id],
                )
              }
            />
          </WorkspaceFilterSection>
        )}

        <WorkspaceFilterSection title="Blueprint төлөв">
          <div className="space-y-2">
            {Object.entries(statusLabels).map(([value, label]) => (
              <label key={value} className="flex items-center justify-between gap-2 text-sm cursor-pointer select-none">
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

      <main className="space-y-seek-4">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-seek-3">
            <Link href={`/assessor/context/${contextId}`} className="text-muted-foreground hover:text-foreground">
              <Icons.Settings className="h-5 w-5 transform rotate-180" />
            </Link>
            <PageTitle
              title="Үнэлгээний Blueprint"
              subtitle={context?.name || "Ачаалж байна..."}
            />
          </div>
          
          <Button type="button" onClick={() => setCreateModalIsOpen(true)}>+ Blueprint үүсгэх</Button>
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

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Text variant="muted">Уншиж байна...</Text>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
            <Icons.Warning size={40} className="text-muted-foreground" />
            <Text className="font-semibold mt-seek-3">Blueprint олдсонгүй</Text>
            <Text variant="muted" className="mt-1 text-sm">
              Тохирох шүүлтүүртэй blueprint байхгүй байна.
            </Text>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid gap-seek-4 xl:grid-cols-2">
            {filtered.map((blueprint) => (
              <BlueprintCard
                key={blueprint.id}
                blueprint={blueprint}
                contextId={contextId}
                onPreview={() => setPreview(blueprint)}
              />
            ))}
          </div>
        ) : (
          <BlueprintTable blueprints={filtered} contextId={contextId} onPreview={setPreview} />
        )}
      </main>

      {preview && (
        <BlueprintPreviewModal
          blueprint={preview}
          questionsMap={questionsMap}
          onClose={() => setPreview(null)}
        />
      )}

      <CreateBlueprintModal
        isOpen={createModalIsOpen}
        onClose={() => setCreateModalIsOpen(false)}
        onSuccess={(blueprintId) => router.push(`/assessor/context/${contextId}/blueprints/${blueprintId}`)}
        contextId={contextId}
        rawTopics={rawTopics}
      />
    </div>
  );
}

function BlueprintCard({
  blueprint,
  contextId,
  onPreview,
}: {
  blueprint: Blueprint;
  contextId: string;
  onPreview: () => void;
}) {
  const summary = getBlueprintSummary(blueprint);
  const canCreateQuiz = blueprint.status === "ready" || blueprint.status === "published";
  return (
    <Card className="overflow-hidden">
      <div className="p-seek-5">
        <div className="flex items-start justify-between gap-seek-4">
          <div>
            <Badge variant={summary.ready ? "success" : "warning"}>
              {statusLabels[blueprint.status]}
            </Badge>
            <Text className="mt-seek-3 text-xl font-bold">{blueprint.title}</Text>
            <Text variant="muted" className="mt-1 line-clamp-2">{blueprint.description}</Text>
          </div>
          <Text className="text-right text-sm text-muted-foreground">{blueprint.updatedAt}</Text>
        </div>
        <div className="mt-seek-4 grid gap-seek-3 grid-cols-4">
          <MetricCard label="Section" value={blueprint.sections.length} />
          <MetricCard label="Pool" value={summary.pooledQuestions} />
          <MetricCard label="Сонгох" value={summary.pickedQuestions} />
          <MetricCard label="Хугацаа" value={`${blueprint.totalDurationMinutes}м`} />
        </div>
        <div className="mt-seek-4">
          <ProgressBar value={blueprint.passScore} />
          <Text variant="muted" className="mt-1 text-xs">Тэнцэх оноо {blueprint.passScore}%</Text>
        </div>
      </div>
      <div className="grid gap-2 border-t border-border bg-muted-background/50 p-seek-4 sm:grid-cols-[auto_auto_minmax(12rem,1fr)] sm:items-center">
        <Button type="button" variant="outline" onClick={onPreview}>Харах</Button>
        <Link href={`/assessor/context/${contextId}/blueprints/${blueprint.id}`}>
          <Button type="button" variant="secondary">Засах</Button>
        </Link>
        {canCreateQuiz ? (
          <Link href={`/assessor/quizzes/new?blueprintId=${blueprint.id}&contextId=${contextId}`}>
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
  contextId,
  onPreview,
}: {
  blueprints: Blueprint[];
  contextId: string;
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
            <th className="p-seek-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {blueprints.map((blueprint) => {
            const summary = getBlueprintSummary(blueprint);
            const canCreateQuiz = blueprint.status === "ready" || blueprint.status === "published";
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
                <td className="p-seek-3">
                  <div className="flex gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => onPreview(blueprint)}>
                      Харах
                    </Button>
                    <Link href={`/assessor/context/${contextId}/blueprints/${blueprint.id}`}>
                      <Button type="button" size="sm" variant="secondary">Засах</Button>
                    </Link>
                    {canCreateQuiz ? (
                      <Link href={`/assessor/quizzes/new?blueprintId=${blueprint.id}&contextId=${contextId}`}>
                        <Button type="button" size="sm">Quiz</Button>
                      </Link>
                    ) : (
                      <Button type="button" size="sm" disabled>Quiz</Button>
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
    <label className="grid gap-1 text-sm">
      <span className="font-semibold">{label}</span>
      <Input type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function toggleArray<T>(values: T[], value: T, setValues: (next: T[]) => void) {
  setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
}
