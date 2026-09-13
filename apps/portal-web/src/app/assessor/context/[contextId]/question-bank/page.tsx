"use client";
import {
  QuestionTypeBadge,
  QuestionStatistics,
  QuestionDifficulty,
} from "@/features/assessor-workspace/question-presentation";

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
  Select,
  Text,
  useDialog,
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
  bloomLabels,
  difficultyLabels,
  mockQuestionBank,
  questionTypeLabels,
  statusLabels,
} from "@/features/assessor-workspace/mock-data";
import { QuestionPreviewModal as SharedQuestionPreviewModal } from "@/features/assessor-workspace/QuestionPreviewModal";
import { CreateQuestionModal } from "@/features/assessor-workspace/CreateQuestionModal";
import {
  canEditQuestion,
  getQuestionStats,
  fetchQuestions,
  fetchQuestionBank,
  createQuestion,
  deleteQuestion,
  fetchDifficultyLevels,
  getQuestionByIdAsync,
  sendQuestionWorkflow,
  fetchTopics,
  fetchAudienceTypes,
  fetchAudienceLevels,
  fetchAssessmentContexts,
} from "@/features/assessor-workspace/api";
import type {
  DifficultyLevel,
  QuestionBankItem,
  QuestionType,
  QuestionWorkflowStatus,
} from "@/features/assessor-workspace/types";

type ChecklistSectionId =
  "topics" | "audience" | "types" | "difficulties" | "statuses";

// nestedTopics dynamically computed inside QuestionBankPage

const statusVariant: Record<
  QuestionWorkflowStatus,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  draft: "secondary",
  approval_requested: "warning",
  in_review: "warning",
  changes_requested: "danger",
  resubmitted: "warning",
  approved: "success",
  published: "primary",
  archived: "secondary",
  rejected: "danger",
  retired: "secondary",
  deleted: "danger",
};

const difficultyVariant: Record<
  DifficultyLevel,
  "primary" | "secondary" | "success" | "danger" | "warning"
> = {
  very_easy: "success",
  easy: "success",
  medium: "warning",
  hard: "danger",
  very_hard: "danger",
};

const pageSizeOptions = [10, 20, 50, 100];

interface PageProps {
  params: {
    contextId: string;
  };
}

export default function QuestionBankPage({ params: routeParams }: PageProps) {
  const router = useRouter();
  const params = useParams();
  const contextId = params.contextId as string;
  const [view, setView] = useState<"cards" | "table">("cards");
  const [query, setQuery] = useState("");
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<
    QuestionType[]
  >([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<
    DifficultyLevel[]
  >([]);
  const [selectedStatuses, setSelectedStatuses] = useState<
    QuestionWorkflowStatus[]
  >([]);
  const [openSections, setOpenSections] = useState<
    Record<ChecklistSectionId, boolean>
  >({
    topics: false,
    audience: false,
    types: true,
    difficulties: true,
    statuses: true,
  });
  const [rawTopics, setRawTopics] = useState<any[]>([]); // DB dynamic topics state
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([]); // Collapse by default

  // Audience filter states
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [audienceLevels, setAudienceLevels] = useState<any[]>([]);
  const [selectedAudienceType, setSelectedAudienceType] = useState<string>("");
  const [selectedAudienceLevelIds, setSelectedAudienceLevelIds] = useState<
    string[]
  >([]);
  const [openAudienceLevelIds, setOpenAudienceLevelIds] = useState<string[]>(
    [],
  );

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);

  // 1. Load filters on mount
  useEffect(() => {
    if (typeof window === "undefined" || !params.contextId) return;
    try {
      const saved = localStorage.getItem(
        `seek_assessor_qb_filter_${params.contextId}`,
      );
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.view) setView(filters.view);
        if (filters.query !== undefined) setQuery(filters.query);
        if (Array.isArray(filters.selectedTopicIds))
          setSelectedTopicIds(filters.selectedTopicIds);
        if (Array.isArray(filters.selectedQuestionTypes))
          setSelectedQuestionTypes(filters.selectedQuestionTypes);
        if (Array.isArray(filters.selectedDifficulties))
          setSelectedDifficulties(filters.selectedDifficulties);
        if (Array.isArray(filters.selectedStatuses))
          setSelectedStatuses(filters.selectedStatuses);
        if (Array.isArray(filters.selectedAudienceLevelIds))
          setSelectedAudienceLevelIds(filters.selectedAudienceLevelIds);
        if (filters.page) setPage(filters.page);
        if (filters.pageSize) setPageSize(filters.pageSize);
      }
    } catch (e) {
      console.error("Failed to load filters from localStorage", e);
    } finally {
      setIsFiltersLoaded(true);
    }
  }, [params.contextId]);

  // 2. Save filters only after they have been loaded from localStorage
  useEffect(() => {
    if (!isFiltersLoaded || typeof window === "undefined" || !params.contextId)
      return;
    try {
      const filters = {
        view,
        query,
        selectedTopicIds,
        selectedQuestionTypes,
        selectedDifficulties,
        selectedStatuses,
        selectedAudienceLevelIds,
        page,
        pageSize,
      };
      localStorage.setItem(
        `seek_assessor_qb_filter_${params.contextId}`,
        JSON.stringify(filters),
      );
    } catch (e) {
      console.error("Failed to save filters to localStorage", e);
    }
  }, [
    isFiltersLoaded,
    view,
    query,
    selectedTopicIds,
    selectedQuestionTypes,
    selectedDifficulties,
    selectedStatuses,
    selectedAudienceLevelIds,
    page,
    pageSize,
    params.contextId,
  ]);

  const [preview, setPreview] = useState<QuestionBankItem | null>(null);
  const [createModalIsOpen, setCreateModalIsOpen] = useState(false);
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [total, setTotal] = useState(0);
  const [facets, setFacets] = useState<any[]>([]);
  const [metadataError, setMetadataError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [reload, setReload] = useState(0);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setMetadataError("");
        const [tData, audTypes, audLvs, contextsData, levels] =
          await Promise.all([
            fetchTopics(contextId),
            fetchAudienceTypes(),
            fetchAudienceLevels(),
            fetchAssessmentContexts(),
            fetchDifficultyLevels(),
          ]);
        if (active) {
          setRawTopics(tData || []);
          setAudienceTypes(audTypes || []);
          setAudienceLevels(audLvs || []);

          const currentContext = contextsData?.find(
            (c: any) => c.id === contextId,
          );
          setContext(currentContext || null);
          setDifficultyLevels(
            levels
              .filter(
                (level: any) =>
                  level.difficultyScaleId === currentContext?.difficultyScaleId,
              )
              .sort((a: any, b: any) => a.rank - b.rank),
          );

          if (currentContext && currentContext.audienceTypeId) {
            setSelectedAudienceType(currentContext.audienceTypeId);
          } else if (audTypes && audTypes.length > 0) {
            setSelectedAudienceType(audTypes[0].id);
          }

          // Keep topics collapsed by default (empty openTopicIds)
          setOpenTopicIds([]);
        }
      } catch (err) {
        if (active) setMetadataError("Шүүлтүүрийн тохиргоог ачаалж чадсангүй.");
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [contextId, reload]);

  const nestedTopics = useMemo(() => {
    if (!rawTopics || rawTopics.length === 0) return [];

    const nodesMap: Record<string, ExplorerTopicNode> = {};
    const roots: ExplorerTopicNode[] = [];

    rawTopics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.title || t.name,
        count: facets
          .filter((f) => f.topicId === t.id)
          .reduce((sum, f) => sum + f.count, 0),
        children: [],
      };
    });

    rawTopics.forEach((t) => {
      const node = nodesMap[t.id];
      if (t.parentId && nodesMap[t.parentId]) {
        nodesMap[t.parentId].children = nodesMap[t.parentId].children || [];
        nodesMap[t.parentId].children!.push(node);
        nodesMap[t.parentId].count =
          (nodesMap[t.parentId].count || 0) + (node.count || 0);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [rawTopics, facets]);

  const topicDescendantMap = useMemo(() => {
    return buildTopicDescendantMap(nestedTopics);
  }, [nestedTopics]);

  const nestedAudienceLevels = useMemo(() => {
    if (!selectedAudienceType || !audienceLevels || audienceLevels.length === 0)
      return [];

    const filteredLevels = audienceLevels.filter(
      (al) => al.audienceTypeId === selectedAudienceType,
    );
    const nodesMap: Record<string, ExplorerTopicNode> = {};
    const roots: ExplorerTopicNode[] = [];

    filteredLevels.forEach((l) => {
      nodesMap[l.id] = {
        id: l.id,
        label: l.name || l.code,
        count: questions.filter((q) =>
          q.topicMappings?.some((m) => m.audienceLevelId === l.id),
        ).length,
        children: [],
      };
    });

    filteredLevels.forEach((l) => {
      const node = nodesMap[l.id];
      if (l.parentId && nodesMap[l.parentId]) {
        nodesMap[l.parentId].children = nodesMap[l.parentId].children || [];
        nodesMap[l.parentId].children!.push(node);
        nodesMap[l.parentId].count =
          (nodesMap[l.parentId].count || 0) + (node.count || 0);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [selectedAudienceType, audienceLevels, questions]);

  const audienceDescendantMap = useMemo(() => {
    return buildTopicDescendantMap(nestedAudienceLevels);
  }, [nestedAudienceLevels]);

  const handlePreview = async (item: QuestionBankItem) => {
    setPreview(item);
    try {
      const fresh = await getQuestionByIdAsync(item.id);
      if (fresh) {
        setPreview(fresh);
      }
    } catch (err) {
      console.error("Failed to load fresh question preview", err);
    }
  };

  const expandedTopics = useMemo(
    () =>
      Array.from(
        new Set(
          selectedTopicIds.flatMap((id) => [
            id,
            ...(topicDescendantMap[id] || []),
          ]),
        ),
      ),
    [selectedTopicIds, topicDescendantMap],
  );
  const expandedAudiences = useMemo(
    () =>
      Array.from(
        new Set(
          selectedAudienceLevelIds.flatMap((id) => [
            id,
            ...(audienceDescendantMap[id] || []),
          ]),
        ),
      ),
    [selectedAudienceLevelIds, audienceDescendantMap],
  );
  const bankQuery = JSON.stringify({
    assessmentContextId: contextId,
    search: query,
    types: selectedQuestionTypes.join(","),
    statuses: selectedStatuses.join(","),
    difficulties: selectedDifficulties.join(","),
    topics: expandedTopics.join(","),
    audiences: expandedAudiences.join(","),
    page: String(page),
    pageSize: String(pageSize),
  });
  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      setLoading(true);
      setLoadError("");
      fetchQuestionBank(JSON.parse(bankQuery))
        .then((data) => {
          if (active) {
            setQuestions(data.items);
            setTotal(data.total);
            setFacets(data.facets);
            if (data.page !== page) setPage(data.page);
          }
        })
        .catch(() => {
          if (active)
            setLoadError("Асуултын санг ачаалж чадсангүй. Дахин оролдоно уу.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [bankQuery, reload]);
  useEffect(() => setSelectedQuestionIds([]), [bankQuery]);
  const filteredQuestions = questions;

  const hasActiveFilters = useMemo(() => {
    return (
      query !== "" ||
      selectedTopicIds.length > 0 ||
      selectedQuestionTypes.length > 0 ||
      selectedDifficulties.length > 0 ||
      selectedStatuses.length > 0 ||
      selectedAudienceLevelIds.length > 0
    );
  }, [
    query,
    selectedTopicIds,
    selectedQuestionTypes,
    selectedDifficulties,
    selectedStatuses,
    selectedAudienceLevelIds,
  ]);

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleQuestions = questions;
  const visibleQuestionIds = visibleQuestions.map((question) => question.id);
  const allVisibleSelected =
    visibleQuestionIds.length > 0 &&
    visibleQuestionIds.every((id) => selectedQuestionIds.includes(id));
  const facetCounts = (key: string) =>
    facets.reduce((acc: Record<string, number>, row: any) => {
      if (row[key]) acc[row[key]] = (acc[row[key]] || 0) + row.count;
      return acc;
    }, {});
  const typeCounts = facetCounts("type"),
    difficultyCounts = facetCounts("difficulty"),
    statusCounts = facetCounts("status");
  const stats = {
    total: facets.reduce((sum, row) => sum + row.count, 0),
    active: (statusCounts.approved || 0) + (statusCounts.published || 0),
    inactive:
      (statusCounts.draft || 0) +
      (statusCounts.changes_requested || 0) +
      (statusCounts.rejected || 0) +
      (statusCounts.archived || 0),
    selectedTopics: new Set(facets.map((f) => f.topicId).filter(Boolean)).size,
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedTopicIds([]);
    setSelectedAudienceLevelIds([]);
    setSelectedQuestionTypes([]);
    setSelectedDifficulties([]);
    setSelectedStatuses([]);
    setSelectedQuestionIds([]);
    setPage(1);
  };

  const toggleSection = (section: ChecklistSectionId) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  const toggleTopicOpen = (topicId: string) => {
    setOpenTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  };

  const toggleAudienceLevelOpen = (lvlId: string) => {
    setOpenAudienceLevelIds((current) =>
      current.includes(lvlId)
        ? current.filter((id) => id !== lvlId)
        : [...current, lvlId],
    );
  };

  const toggleSelection = (questionId: string) => {
    setSelectedQuestionIds((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  };

  const toggleVisibleSelection = () => {
    setSelectedQuestionIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleQuestionIds.includes(id));
      }
      return Array.from(new Set([...current, ...visibleQuestionIds]));
    });
  };

  const requestApproval = (question: QuestionBankItem) => {
    showDialog({
      title: "Батлуулах хүсэлт илгээх үү?",
      description: `${question.code} даалгаварт батлуулах хүсэлт илгээх гэж байна.`,
      confirmLabel: "Хүсэлт илгээх",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await sendQuestionWorkflow(
            question.id,
            question.status === "changes_requested"
              ? "resubmitted"
              : "approval_requested",
            undefined,
            question,
          );
          showToast("Батлуулах хүсэлт амжилттай илгээгдлээ.", "success");
          setReload((x) => x + 1);
        } catch (err: any) {
          showToast(err.message || "Хүсэлт илгээхэд алдаа гарлаа.", "danger");
        }
      },
    });
  };

  const runBulkAction = (label: string) => {
    showDialog({
      title: `${selectedQuestionIds.length} даалгаврыг "${label}" төлөв рүү шилжүүлэх үү?`,
      description: "Сонгосон даалгавруудын төлөвийг шинэчилж байна.",
      confirmLabel: label,
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          const eligible = selectedQuestionIds.filter((id) =>
            questions
              .find((q) => q.id === id)
              ?.allowedActions?.some(
                (a) => a === "approval_requested" || a === "resubmitted",
              ),
          );
          const results = await Promise.allSettled(
            eligible.map((id) => {
              const q = questions.find((x) => x.id === id)!;
              return sendQuestionWorkflow(
                id,
                q.status === "changes_requested"
                  ? "resubmitted"
                  : "approval_requested",
                undefined,
                q,
              );
            }),
          );
          const failed = results.filter((x) => x.status === "rejected").length;
          showToast(
            `${results.length - failed} хүсэлт илгээгдсэн. ${failed} амжилтгүй. ${selectedQuestionIds.length - eligible.length} боломжгүй төлөвтэй.`,
            failed ? "warning" : "success",
          );
          const failures = results.flatMap((result, index) =>
            result.status === "rejected"
              ? [
                  `${questions.find((q) => q.id === eligible[index])?.code}: ${result.reason?.message || "Алдаа"}`,
                ]
              : [],
          );
          if (failures.length)
            showDialog({
              title: "Амжилтгүй хүсэлтүүд",
              description: failures.join("\n"),
              confirmLabel: "Хаах",
              onConfirm: () => {},
            });
          setSelectedQuestionIds(
            eligible.filter((_, index) => results[index].status === "rejected"),
          );
          setReload((x) => x + 1);
        } catch (err: any) {
          showToast("Төлөв шинэчлэхэд алдаа гарлаа.", "danger");
        }
      },
    });
  };

  const handleDeleteQuestion = async (id: string) => {
    showDialog({
      title: "Даалгавар устгах уу?",
      description: "Энэ даалгаврыг устгах уу? Энэ үйлдлийг буцаах боломжгүй.",
      confirmLabel: "Устгах",
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await deleteQuestion(id);
          showToast("Даалгавар амжилттай устгагдлаа.", "success");
          setReload((x) => x + 1);
        } catch (err: any) {
          showToast("Устгахад алдаа гарлаа.", "danger");
        }
      },
    });
  };

  const handleCopyQuestion = async (id: string) => {
    const target = questions.find((q) => q.id === id);
    if (!target) return;
    try {
      const full = await getQuestionByIdAsync(id);
      if (!full) throw Error("Асуултыг уншиж чадсангүй");
      await createQuestion({
        ...full,
        assessmentContextId: contextId,
        code: `Q-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        title: `${target.title} (Хуулбар)`,
      });
      setReload((x) => x + 1);
      showToast("Даалгаврыг хуулбарлалаа.", "success");
    } catch (err) {
      showToast("Хуулбарлахад алдаа гарлаа.", "danger");
    }
  };

  const decisions=questions.filter(q=>q.workflowHistory?.[0] && ["approved","changes_requested","rejected","published"].includes(q.workflowHistory[0].status)).sort((a,b)=>Date.parse(b.workflowHistory[0].createdAt)-Date.parse(a.workflowHistory[0].createdAt)).slice(0,5);
  return (
    <div className="min-w-0 grid gap-seek-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
      {metadataError && (
        <div
          role="alert"
          className="lg:col-span-2 rounded border border-danger p-4"
        >
          {metadataError}{" "}
          <Button onClick={() => setReload((x) => x + 1)}>
            Тохиргоог дахин ачаалах
          </Button>
        </div>
      )}
      {loadError && (
        <div
          role="alert"
          className="lg:col-span-2 rounded border border-danger p-4"
        >
          {loadError}{" "}
          <Button onClick={() => setReload((x) => x + 1)}>Дахин оролдох</Button>
        </div>
      )}
      {!loading && !loadError && visibleQuestions.length === 0 && (
        <p role="status" className="lg:col-span-2">
          Сонгосон шүүлтүүрт тохирох асуулт алга.
        </p>
      )}
      {decisions.length > 0 && (
        <section className="lg:col-span-2 rounded border border-border bg-surface p-4">
          <h2 className="font-semibold">Шийдвэрийн мэдэгдэл</h2>
          <ul>
            {decisions.map((q) => (
                <li key={q.id} className="mt-2">
                  <Link
                    className="text-primary"
                    href={`/assessor/context/${contextId}/question-bank/${q.id}`}
                  >
                    {q.code} — {statusLabels[q.status] || q.status}
                  </Link>
                  <p className="whitespace-pre-wrap">
                    {q.workflowHistory[0].comment}
                  </p>
                </li>
              ))}
          </ul>
        </section>
      )}

      <aside className="rounded-seek-lg border border-border bg-surface p-seek-4">
        <div className="mb-seek-4 flex items-center justify-between min-h-[1.5rem]">
          <Text className="font-semibold">Шүүлтүүрүүд</Text>
          {hasActiveFilters && (
            <button
              type="button"
              className="text-xs font-semibold text-primary hover:underline transition-all"
              onClick={resetFilters}
            >
              Цэвэрлэх
            </button>
          )}
        </div>

        <WorkspaceFilterSection
          title="Сэдвийн сан"
          selectedCount={selectedTopicIds.length}
          open={openSections.topics}
          onToggle={() => toggleSection("topics")}
        >
          <ExplorerTopicTree
            nodes={nestedTopics}
            selectedIds={selectedTopicIds}
            openIds={openTopicIds}
            onToggle={(topicId) =>
              toggleArrayValue(selectedTopicIds, topicId, setSelectedTopicIds)
            }
            onToggleOpen={toggleTopicOpen}
          />
        </WorkspaceFilterSection>

        <WorkspaceFilterSection
          title="Зорилтот бүлэг"
          selectedCount={selectedAudienceLevelIds.length}
          open={openSections.audience}
          onToggle={() => toggleSection("audience")}
        >
          <div className="space-y-seek-3">
            {selectedAudienceType && nestedAudienceLevels.length > 0 && (
              <div className="border border-border/40 rounded p-seek-2 bg-muted-background/10">
                <ExplorerTopicTree
                  nodes={nestedAudienceLevels}
                  selectedIds={selectedAudienceLevelIds}
                  openIds={openAudienceLevelIds}
                  onToggle={(lvlId) =>
                    toggleArrayValue(
                      selectedAudienceLevelIds,
                      lvlId,
                      setSelectedAudienceLevelIds,
                    )
                  }
                  onToggleOpen={toggleAudienceLevelOpen}
                />
              </div>
            )}
          </div>
        </WorkspaceFilterSection>

        <WorkspaceFilterSection
          title="Асуултын төрөл"
          selectedCount={selectedQuestionTypes.length}
          open={openSections.types}
          onToggle={() => toggleSection("types")}
        >
          <Checklist
            items={Object.entries(questionTypeLabels).map(([value, label]) => ({
              value,
              label,
              count: typeCounts[value as QuestionType] ?? 0,
            }))}
            selected={selectedQuestionTypes}
            onToggle={(value) =>
              toggleArrayValue(
                selectedQuestionTypes,
                value as QuestionType,
                setSelectedQuestionTypes,
              )
            }
          />
        </WorkspaceFilterSection>

        <WorkspaceFilterSection
          title="Хүндрэлийн түвшин"
          selectedCount={selectedDifficulties.length}
          open={openSections.difficulties}
          onToggle={() => toggleSection("difficulties")}
        >
          <Checklist
            items={difficultyLevels.map((level) => ({
              value: level.code,
              label: level.name,
              count: difficultyCounts[level.code] ?? 0,
            }))}
            selected={selectedDifficulties}
            onToggle={(value) =>
              toggleArrayValue(
                selectedDifficulties,
                value as DifficultyLevel,
                setSelectedDifficulties,
              )
            }
          />
        </WorkspaceFilterSection>

        <WorkspaceFilterSection
          title="Даалгаврын төлөв"
          selectedCount={selectedStatuses.length}
          open={openSections.statuses}
          onToggle={() => toggleSection("statuses")}
        >
          <Checklist
            items={Object.entries(statusLabels)
              .filter(
                ([value]) =>
                  !["approval_requested", "resubmitted", "deleted"].includes(
                    value,
                  ),
              )
              .map(([value, label]) => ({
                value,
                label,
                count: statusCounts[value as QuestionWorkflowStatus] ?? 0,
              }))}
            selected={selectedStatuses}
            onToggle={(value) =>
              toggleArrayValue(
                selectedStatuses,
                value as QuestionWorkflowStatus,
                setSelectedStatuses,
              )
            }
          />
        </WorkspaceFilterSection>
      </aside>

      <main className="min-w-0 space-y-seek-4">
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-seek-4">
          <div className="flex items-center gap-seek-3">
            <Link href={`/assessor/context/${params.contextId}`} passHref>
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-seek-full bg-transparent hover:bg-surface-hover text-foreground/80 hover:text-foreground transition-colors border border-border"
                title="Буцах"
              >
                <Icons.Undo2 className="h-5 w-5" />
              </button>
            </Link>
            <PageTitle
              title="Даалгаврын сан"
              subtitle={context?.name || "Ачаалж байна..."}
            />
          </div>
          <Button type="button" onClick={() => setCreateModalIsOpen(true)}>
            + Даалгавар нэмэх
          </Button>
        </div>

        <div className="grid gap-seek-3 md:grid-cols-4">
          <MetricCard
            label="Нийт даалгавар"
            value={stats.total}
            accent="bg-primary"
          />
          <MetricCard
            label="Батлагдсан/нийтлэгдсэн"
            value={stats.active}
            accent="bg-success"
          />
          <MetricCard
            label="Ноорог/засвар"
            value={stats.inactive}
            accent="bg-warning"
          />
          <MetricCard
            label="Сэдвийн сан"
            value={stats.selectedTopics}
            accent="bg-info"
          />
        </div>

        <Card className="p-seek-4">
          <div className="flex flex-col gap-seek-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Icons.Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 pr-9"
                placeholder="Код, гарчиг, асуултын текстээр хайх..."
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
              {query && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full hover:bg-muted-background transition-colors"
                  onClick={() => {
                    setQuery("");
                    setPage(1);
                  }}
                  title="Арилгах"
                >
                  <Icons.CircleX className="h-4 w-4" />
                </button>
              )}
            </div>
            <DataViewToggle
              value={view}
              onChange={setView}
              options={[
                { value: "cards", label: "Карт" },
                { value: "table", label: "Жагсаалт" },
              ]}
            />
          </div>
        </Card>

        {view === "cards" ? (
          <div className="grid gap-seek-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleQuestions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                selected={selectedQuestionIds.includes(question.id)}
                onSelect={() => toggleSelection(question.id)}
                onPreview={() => handlePreview(question)}
                onRequestApproval={() => requestApproval(question)}
                onCopy={() => handleCopyQuestion(question.id)}
                onDelete={() => handleDeleteQuestion(question.id)}
              />
            ))}
          </div>
        ) : (
          <QuestionTable
            questions={visibleQuestions}
            selectedQuestionIds={selectedQuestionIds}
            toggleSelection={toggleSelection}
            handlePreview={handlePreview}
            handleDelete={handleDeleteQuestion}
            handleCopy={handleCopyQuestion}
            handleRequestApproval={requestApproval}
          />
        )}

        <PaginationBar
          total={total}
          page={safePage}
          pageCount={pageCount}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
            setSelectedQuestionIds([]);
          }}
        />
      </main>

      {selectedQuestionIds.length > 0 && (
        <BulkActionBar
          count={selectedQuestionIds.length}
          onClear={() => setSelectedQuestionIds([])}
          onAction={runBulkAction}
        />
      )}

      {preview && (
        <SharedQuestionPreviewModal
          question={preview}
          onClose={() => setPreview(null)}
        />
      )}

      {createModalIsOpen && (
        <CreateQuestionModal
          assessmentContextId={contextId}
          isOpen={createModalIsOpen}
          onClose={() => setCreateModalIsOpen(false)}
          onSuccess={(questionId) => {
            setCreateModalIsOpen(false);
            router.push(
              `/assessor/context/${params.contextId}/question-bank/${questionId}`,
            );
          }}
        />
      )}
    </div>
  );
}

function Checklist<T extends string>({
  items,
  selected,
  onToggle,
}: {
  items: Array<{ value: T | string; label: string; count: number }>;
  selected: T[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <label
          key={item.value}
          className="flex items-center justify-between gap-2 text-sm text-foreground"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Checkbox
              checked={selected.includes(item.value as T)}
              onChange={() => onToggle(String(item.value))}
            />
            <span className="truncate">{item.label}</span>
          </span>
          <span className="text-xs text-muted-foreground">{item.count}</span>
        </label>
      ))}
    </div>
  );
}

function QuestionCard({
  question,
  selected,
  onSelect,
  onPreview,
  onRequestApproval,
  onCopy,
  onDelete,
}: {
  question: QuestionBankItem;
  selected: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onRequestApproval: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}) {
  const params = useParams();

  return (
    <Card
      className={`p-seek-5 hover:shadow-seek-md transition-all rounded-seek-lg border border-border bg-surface ${selected ? "ring-2 ring-primary border-primary bg-primary/5" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={selected}
            onChange={onSelect}
            aria-label="Сонгох"
          />
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-muted-background/40 border-none text-[10px] font-bold py-0.5 px-2"
          >
            <QuestionTypeBadge type={question.type} />
          </Badge>
          <QuestionDifficulty question={question} />
        </div>
      </div>

      <div className="mt-seek-4 space-y-seek-3">
        <Text className="font-bold text-foreground text-sm leading-normal">
          {question.title}
        </Text>

        {/* Code/Formula snippet */}
        {question.body && (
          <div className="rounded-seek-md bg-muted-background p-seek-3 line-clamp-3 break-words text-[11px] text-foreground/80 leading-normal border border-border/20">
            {question.body.replace(/<[^>]*>/g, " ")}
          </div>
        )}

        <Badge variant={statusVariant[question.status] || "secondary"}>
          {statusLabels[question.status] || question.status}
        </Badge>
        {question.publishedVersionId &&
          question.publishedVersionId !== question.questionVersionId && (
            <p className="text-xs">Өмнөх хувилбар нийтлэгдсэн</p>
          )}
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge
            variant="secondary"
            className="bg-muted-background border-none text-[9px] font-semibold text-muted-foreground px-2 py-0.5 rounded"
          >
            {question.topicName || "Ерөнхий"}
          </Badge>
          {question.bloomLevel && (
            <Badge
              variant="secondary"
              className="bg-muted-background border-none text-[9px] font-semibold text-muted-foreground px-2 py-0.5 rounded"
            >
              {bloomLabels[question.bloomLevel]}
            </Badge>
          )}
        </div>
      </div>

      {/* Footer block */}
      <div className="mt-seek-5 flex items-center justify-between border-t border-border/40 pt-seek-4 text-[10px] font-bold text-muted-foreground">
        <span className="flex items-center gap-1 text-muted-foreground">
          <QuestionStatistics question={question} />
        </span>

        {/* Actions icons block */}
        <div className="flex items-center gap-1">
          {question.allowedActions?.some(
            (a) => a === "approval_requested" || a === "resubmitted",
          ) && (
            <button
              type="button"
              onClick={onRequestApproval}
              title="Батлуулах хүсэлт"
              className="p-1"
            >
              <Icons.ListCheck className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onPreview}
            className="p-1 hover:bg-surface-hover rounded transition-colors"
            title="Харах"
          >
            <Icons.Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <Link
            href={`/assessor/context/${params.contextId}/question-bank/${question.id}`}
          >
            <button
              type="button"
              className="p-1 hover:bg-surface-hover rounded transition-colors"
              title={canEditQuestion(question.status) ? "Засах" : "Дэлгэрэнгүй"}
            >
              <Icons.SavePen className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </Link>
          <button
            type="button"
            onClick={onCopy}
            className="p-1 hover:bg-surface-hover rounded transition-colors"
            title="Хуулах"
          >
            <Icons.UndoDot className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <button
            type="button"
            disabled={
              Boolean(question.publishedVersionId) ||
              question.status === "in_review"
            }
            onClick={onDelete}
            className="p-1 hover:bg-danger/5 rounded transition-colors"
            title="Устгах"
          >
            <Icons.Trash className="h-3.5 w-3.5 text-muted-foreground hover:text-danger" />
          </button>
        </div>
      </div>
    </Card>
  );
}

function QuestionTable({
  questions,
  selectedQuestionIds,
  toggleSelection,
  handlePreview,
  handleDelete,
  handleCopy,
  handleRequestApproval,
}: {
  questions: QuestionBankItem[];
  selectedQuestionIds: string[];
  toggleSelection: (id: string) => void;
  handlePreview: (question: QuestionBankItem) => void;
  handleDelete?: (id: string) => void;
  handleCopy?: (id: string) => void;
  handleRequestApproval: (question: QuestionBankItem) => void;
}) {
  const params = useParams();
  const isAllSelected =
    questions.length > 0 &&
    questions.every((q) => selectedQuestionIds.includes(q.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      questions.forEach((q) => {
        if (selectedQuestionIds.includes(q.id)) toggleSelection(q.id);
      });
    } else {
      questions.forEach((q) => {
        if (!selectedQuestionIds.includes(q.id)) toggleSelection(q.id);
      });
    }
  };

  return (
    <Card className="overflow-x-auto border border-border shadow-seek-sm bg-surface rounded-seek-lg">
      <table className="w-full min-w-[64rem] text-left text-xs">
        <thead className="bg-muted-background/35 text-muted-foreground border-b border-border/60">
          <tr className="text-[10px] font-bold uppercase tracking-wider">
            <th className="p-seek-3 w-10 text-center">
              <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
            </th>
            <th className="p-seek-3">Асуулт</th>
            <th className="p-seek-3 w-36">Сэдэв</th>
            <th className="p-seek-3 w-28">Төрөл</th>
            <th className="p-seek-3 w-28">Хүндрэлийн түвшин</th>
            <th className="p-seek-3 w-28">Төлөв</th>
            <th className="p-seek-3 w-28">Амжилтын хувь</th>
            <th className="p-seek-3 w-28">Үүсгэсэн</th>
            <th className="p-seek-3 w-24 text-center">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => {
            const isChecked = selectedQuestionIds.includes(question.id);

            return (
              <tr
                key={question.id}
                className="border-b border-border/40 hover:bg-muted-background/5 transition-colors"
              >
                <td className="p-seek-3 text-center">
                  <Checkbox
                    checked={isChecked}
                    onChange={() => toggleSelection(question.id)}
                  />
                </td>
                <td className="p-seek-3">
                  <Text className="font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    {question.title}
                  </Text>
                  <Text
                    variant="muted"
                    className="text-[10px] mt-0.5 font-medium"
                  >
                    Код: {question.code}
                  </Text>
                </td>
                <td className="p-seek-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="secondary"
                      className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold py-0.5 px-2 rounded"
                    >
                      {question.topicName || "Ерөнхий"}
                    </Badge>
                  </div>
                </td>
                <td className="p-seek-3">
                  <Badge variant="secondary" className="text-xs py-1 px-2">
                    <QuestionTypeBadge type={question.type} />
                  </Badge>
                </td>
                <td className="p-seek-3 font-semibold">
                  <QuestionDifficulty question={question} />
                </td>
                <td className="p-seek-3">
                  <Badge
                    variant={statusVariant[question.status] || "secondary"}
                  >
                    {statusLabels[question.status] || question.status}
                  </Badge>
                  {question.publishedVersionId &&
                    question.publishedVersionId !==
                      question.questionVersionId && (
                      <p className="mt-1 text-xs">Өмнөх хувилбар нийтлэгдсэн</p>
                    )}
                </td>
                <td className="p-seek-3">
                  <QuestionStatistics question={question} />
                </td>
                <td className="p-seek-3 font-semibold text-muted-foreground">
                  {question.createdAt
                    ? new Date(question.createdAt).toLocaleDateString("mn-MN")
                    : "—"}
                </td>
                <td className="p-seek-3 text-center">
                  <div className="flex justify-center gap-1">
                    {question.allowedActions?.some(
                      (a) => a === "approval_requested" || a === "resubmitted",
                    ) && (
                      <button
                        type="button"
                        onClick={() => handleRequestApproval(question)}
                        title="Батлуулах хүсэлт"
                        className="p-1"
                      >
                        <Icons.ListCheck className="h-4 w-4" />
                      </button>
                    )}
                    <Link
                      href={`/assessor/context/${params.contextId}/question-bank/${question.id}`}
                    >
                      <button
                        type="button"
                        className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded"
                        title={
                          canEditQuestion(question.status)
                            ? "Засах"
                            : "Дэлгэрэнгүй"
                        }
                      >
                        <Icons.SavePen className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handlePreview(question)}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded"
                      title="Харах"
                    >
                      <Icons.Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy?.(question.id)}
                      className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded"
                      title="Хуулах"
                    >
                      <Icons.UndoDot className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={
                        Boolean(question.publishedVersionId) ||
                        question.status === "in_review"
                      }
                      onClick={() => handleDelete?.(question.id)}
                      className="p-1 text-muted-foreground hover:text-danger hover:bg-danger/5 rounded"
                      title="Устгах"
                    >
                      <Icons.Trash className="h-3.5 w-3.5" />
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

function PaginationBar({
  total,
  page,
  pageCount,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  return (
    <div className="flex flex-col gap-seek-3 rounded-seek-lg border border-border bg-surface p-seek-3 sm:flex-row sm:items-center sm:justify-between">
      <Text variant="muted" className="text-sm">
        Нийт {total} даалгавар · {page}/{pageCount} хуудас
      </Text>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          ←
        </Button>
        {Array.from({ length: pageCount }, (_, index) => index + 1)
          .slice(0, 5)
          .map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              className={`h-9 w-9 rounded-seek-md text-sm font-semibold ${
                pageNumber === page
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground"
              }`}
              onClick={() => onPageChange(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          →
        </Button>
        <Select
          className="w-32"
          value={String(pageSize)}
          onChange={(event) => onPageSizeChange(Number(event.target.value))}
          options={pageSizeOptions.map((size) => ({
            value: String(size),
            label: `${size} / хуудас`,
          }))}
        />
      </div>
    </div>
  );
}

function BulkActionBar({
  count,
  onClear,
  onAction,
}: {
  count: number;
  onClear: () => void;
  onAction: (label: string) => void;
}) {
  return (
    <div className="fixed bottom-5 left-1/2 z-dropdown w-[min(58rem,calc(100vw-2rem))] -translate-x-1/2 rounded-seek-lg border border-border bg-surface p-seek-3 shadow-seek-lg">
      <div className="flex flex-col gap-seek-3 md:flex-row md:items-center md:justify-between">
        <Text className="text-sm font-semibold">
          {count} даалгавар сонгосон
        </Text>
        <div className="flex flex-wrap gap-2">
          {["Батлуулах хүсэлт"].map((label) => (
            <Button
              key={label}
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => onAction(label)}
            >
              {label}
            </Button>
          ))}
          <Button type="button" size="sm" variant="outline" onClick={onClear}>
            Цэвэрлэх
          </Button>
        </div>
      </div>
    </div>
  );
}

function toggleArrayValue<T>(
  values: T[],
  value: T,
  setValues: (next: T[]) => void,
) {
  setValues(
    values.includes(value)
      ? values.filter((item) => item !== value)
      : [...values, value],
  );
}

function countBy<T extends string>(
  questions: QuestionBankItem[],
  getKey: (question: QuestionBankItem) => T,
) {
  return questions.reduce<Partial<Record<T, number>>>((counts, question) => {
    if (question.status === "deleted") return counts;
    const key = getKey(question);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}
