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

type ChecklistSectionId = "topics" | "audience" | "types" | "difficulties" | "statuses";

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
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<DifficultyLevel[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<QuestionWorkflowStatus[]>([]);
  const [openSections, setOpenSections] = useState<Record<ChecklistSectionId, boolean>>({
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
  const [selectedAudienceLevelIds, setSelectedAudienceLevelIds] = useState<string[]>([]);
  const [openAudienceLevelIds, setOpenAudienceLevelIds] = useState<string[]>([]);

  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isFiltersLoaded, setIsFiltersLoaded] = useState(false);

  // 1. Load filters on mount
  useEffect(() => {
    if (typeof window === "undefined" || !params.contextId) return;
    try {
      const saved = localStorage.getItem(`seek_assessor_qb_filter_${params.contextId}`);
      if (saved) {
        const filters = JSON.parse(saved);
        if (filters.view) setView(filters.view);
        if (filters.query !== undefined) setQuery(filters.query);
        if (Array.isArray(filters.selectedTopicIds)) setSelectedTopicIds(filters.selectedTopicIds);
        if (Array.isArray(filters.selectedQuestionTypes)) setSelectedQuestionTypes(filters.selectedQuestionTypes);
        if (Array.isArray(filters.selectedDifficulties)) setSelectedDifficulties(filters.selectedDifficulties);
        if (Array.isArray(filters.selectedStatuses)) setSelectedStatuses(filters.selectedStatuses);
        if (Array.isArray(filters.selectedAudienceLevelIds)) setSelectedAudienceLevelIds(filters.selectedAudienceLevelIds);
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
    if (!isFiltersLoaded || typeof window === "undefined" || !params.contextId) return;
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
      localStorage.setItem(`seek_assessor_qb_filter_${params.contextId}`, JSON.stringify(filters));
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

  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const [qData, tData, audTypes, audLvs, contextsData] = await Promise.all([
          fetchQuestions({ ownerUserId: "mock-assessor", assessmentContextId: contextId }),
          fetchTopics(contextId),
          fetchAudienceTypes(),
          fetchAudienceLevels(),
          fetchAssessmentContexts(),
        ]);
        if (active) {
          setQuestions(qData);
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
          
          // Keep topics collapsed by default (empty openTopicIds)
          setOpenTopicIds([]);
        }
      } catch (err) {
        console.error("Failed to load questions, topics and audiences", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  const nestedTopics = useMemo(() => {
    if (!rawTopics || rawTopics.length === 0) return [];
    
    const nodesMap: Record<string, ExplorerTopicNode> = {};
    const roots: ExplorerTopicNode[] = [];

    rawTopics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.title || t.name,
        count: questions.filter(q => q.topicId === t.id).length,
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
  }, [rawTopics, questions]);

  const topicDescendantMap = useMemo(() => {
    return buildTopicDescendantMap(nestedTopics);
  }, [nestedTopics]);

  const nestedAudienceLevels = useMemo(() => {
    if (!selectedAudienceType || !audienceLevels || audienceLevels.length === 0) return [];
    
    const filteredLevels = audienceLevels.filter(al => al.audienceTypeId === selectedAudienceType);
    const nodesMap: Record<string, ExplorerTopicNode> = {};
    const roots: ExplorerTopicNode[] = [];

    filteredLevels.forEach((l) => {
      nodesMap[l.id] = {
        id: l.id,
        label: l.name || l.code,
        count: questions.filter(q => q.topicMappings?.some(m => m.audienceLevelId === l.id)).length,
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

  const filteredQuestions = useMemo(
    () =>
      questions.filter((question) => {
        const matchQuery = [question.code, question.title, question.body || (question as any).stem]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase());
        const topicMatches =
          selectedTopicIds.length === 0 ||
          selectedTopicIds.some(
            (topicId) =>
              question.topicId === topicId ||
              topicDescendantMap[topicId]?.includes(question.topicId),
          );

        const audienceMatches =
          selectedAudienceLevelIds.length === 0 ||
          selectedAudienceLevelIds.some(
            (lvlId) =>
              question.topicMappings?.some(m => m.audienceLevelId === lvlId) ||
              audienceDescendantMap[lvlId]?.some((childId: string) => 
                question.topicMappings?.some(m => m.audienceLevelId === childId)
              )
          );

        return (
          question.status !== "deleted" &&
          matchQuery &&
          topicMatches &&
          audienceMatches &&
          (selectedQuestionTypes.length === 0 ||
            selectedQuestionTypes.includes(question.type)) &&
          (selectedDifficulties.length === 0 ||
            selectedDifficulties.includes(question.difficulty as any)) &&
          (selectedStatuses.length === 0 || selectedStatuses.includes(question.status))
        );
      }),
    [
      questions,
      query,
      selectedDifficulties,
      selectedQuestionTypes,
      selectedStatuses,
      selectedTopicIds,
      selectedAudienceLevelIds,
      audienceDescendantMap,
    ],
  );

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

  const pageCount = Math.max(1, Math.ceil(filteredQuestions.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visibleQuestions = filteredQuestions.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );
  const visibleQuestionIds = visibleQuestions.map((question) => question.id);
  const allVisibleSelected =
    visibleQuestionIds.length > 0 &&
    visibleQuestionIds.every((id) => selectedQuestionIds.includes(id));
  const stats = getQuestionStats(questions);
  const typeCounts = countBy(questions, (question) => question.type as string);
  const difficultyCounts = countBy(questions, (question) => question.difficulty as string || "unknown");
  const statusCounts = countBy(questions, (question) => question.status as string);

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
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
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
        : [...current, lvlId]
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
          await sendQuestionWorkflow(question.id, "approval_requested");
          showToast("Батлуулах хүсэлт амжилттай илгээгдлээ.", "success");
          const data = await fetchQuestions({ ownerUserId: "mock-assessor", assessmentContextId: params.contextId });
          setQuestions(data);
        } catch (err: any) {
          showToast(err.message || "Хүсэлт илгээхэд алдаа гарлаа.", "danger");
        }
      },
    });
  };

  const runBulkAction = (label: string) => {
    let action = "approval_requested";
    if (label === "Нийтлэх") action = "publish";
    if (label === "Архивлах") action = "archived";
    if (label === "Устгах") action = "deleted";

    showDialog({
      title: `${selectedQuestionIds.length} даалгаврыг "${label}" төлөв рүү шилжүүлэх үү?`,
      description: "Сонгосон даалгавруудын төлөвийг шинэчилж байна.",
      confirmLabel: label,
      cancelLabel: "Болих",
      onConfirm: async () => {
        try {
          await Promise.all(
            selectedQuestionIds.map((id) => sendQuestionWorkflow(id, action))
          );
          showToast("Төлөв амжилттай шинэчлэгдлээ.", "success");
          setSelectedQuestionIds([]);
          const data = await fetchQuestions({ ownerUserId: "mock-assessor", assessmentContextId: params.contextId });
          setQuestions(data);
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
          await sendQuestionWorkflow(id, "deleted");
          showToast("Даалгавар амжилттай устгагдлаа.", "success");
          const data = await fetchQuestions({ ownerUserId: "mock-assessor", assessmentContextId: params.contextId });
          setQuestions(data);
        } catch (err: any) {
          showToast("Устгахад алдаа гарлаа.", "danger");
        }
      }
    });
  };

  const handleCopyQuestion = async (id: string) => {
    const target = questions.find((q) => q.id === id);
    if (!target) return;
    try {
      showToast("Даалгаврыг хуулбарлалаа.", "success");
      // mock local state copy
      const copied: QuestionBankItem = {
        ...target,
        id: `q-copy-${Date.now()}`,
        code: `${target.code}-copy`,
        title: `${target.title} (Хуулбар)`,
        status: "draft" as any,
      };
      setQuestions(current => [copied, ...current]);
    } catch (err) {
      showToast("Хуулбарлахад алдаа гарлаа.", "danger");
    }
  };

  return (
    <div className="grid gap-seek-4 lg:grid-cols-[18rem_1fr]">
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
                    toggleArrayValue(selectedAudienceLevelIds, lvlId, setSelectedAudienceLevelIds)
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
            items={Object.entries(difficultyLabels).map(([value, label]) => ({
              value,
              label,
              count: difficultyCounts[value as DifficultyLevel] ?? 0,
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
            items={Object.entries(statusLabels).map(([value, label]) => ({
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

      <main className="space-y-seek-4">
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
          <Button type="button" onClick={() => setCreateModalIsOpen(true)}>+ Даалгавар нэмэх</Button>
        </div>

        <div className="grid gap-seek-3 md:grid-cols-4">
          <MetricCard label="Нийт даалгавар" value={stats.total} accent="bg-primary" />
          <MetricCard label="Батлагдсан/нийтлэгдсэн" value={stats.active} accent="bg-success" />
          <MetricCard label="Ноорог/засвар" value={stats.inactive} accent="bg-warning" />
          <MetricCard label="Сэдвийн сан" value={stats.selectedTopics} accent="bg-info" />
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
          />
        )}

        <PaginationBar
          total={filteredQuestions.length}
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
          isOpen={createModalIsOpen}
          onClose={() => setCreateModalIsOpen(false)}
          onSuccess={(questionId) => {
            setCreateModalIsOpen(false);
            router.push(`/assessor/context/${params.contextId}/question-bank/${questionId}`);
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
  
  // Icon and Color by Question Type
  const typeConfig = useMemo(() => {
    switch (question.type as string) {
      case "multiple_choice":
        return { label: "Multiple Choice", icon: <Icons.MultiChoose className="h-3 w-3 text-primary" /> };
      case "essay":
        return { label: "Essay", icon: <Icons.Essay className="h-3 w-3 text-secondary" /> };
      case "true_false":
        return { label: "True/False", icon: <Icons.TrueFalse className="h-3 w-3 text-success" /> };
      case "fill_in_blank":
        return { label: "Fill-in-Blank", icon: <Icons.FillBlank className="h-3 w-3 text-warning" /> };
      default:
        return { label: "Short Answer", icon: <Icons.ShortText className="h-3 w-3 text-muted-foreground" /> };
    }
  }, [question.type]);

  return (
    <Card className={`p-seek-5 hover:shadow-seek-md transition-all rounded-seek-lg border border-border bg-surface ${selected ? "ring-2 ring-primary border-primary bg-primary/5" : ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <Checkbox checked={selected} onChange={onSelect} aria-label="Сонгох" />
          <Badge variant="secondary" className="flex items-center gap-1 bg-muted-background/40 border-none text-[10px] font-bold py-0.5 px-2">
            {typeConfig.icon}
            <span>{typeConfig.label}</span>
          </Badge>
          <Badge variant={(question.difficulty as string) === "easy" ? "success" : (question.difficulty as string) === "hard" ? "danger" : "warning"} className="text-[10px] font-bold py-0.5 px-2">
            {question.difficulty ? difficultyLabels[question.difficulty as DifficultyLevel] : "Medium"}
          </Badge>
        </div>
      </div>

      <div className="mt-seek-4 space-y-seek-3">
        <Text className="font-bold text-foreground text-sm leading-normal">
          {question.title}
        </Text>
        
        {/* Code/Formula snippet */}
        {question.body && (
          <div className="rounded-seek-md bg-muted-background p-seek-3 font-mono text-[11px] text-foreground/80 leading-normal border border-border/20">
            {question.body}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="secondary" className="bg-muted-background border-none text-[9px] font-semibold text-muted-foreground px-2 py-0.5 rounded">
            {question.topicName || "General"}
          </Badge>
          {question.bloomLevel && (
            <Badge variant="secondary" className="bg-muted-background border-none text-[9px] font-semibold text-muted-foreground px-2 py-0.5 rounded">
              {bloomLabels[question.bloomLevel]}
            </Badge>
          )}
        </div>
      </div>

      {/* Footer block */}
      <div className="mt-seek-5 flex items-center justify-between border-t border-border/40 pt-seek-4 text-[10px] font-bold text-muted-foreground">
        <span className="flex items-center gap-1 text-emerald-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          78% success rate
        </span>

        {/* Actions icons block */}
        <div className="flex items-center gap-1">
          <button type="button" onClick={onPreview} className="p-1 hover:bg-surface-hover rounded transition-colors" title="Харах">
            <Icons.Eye className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <Link href={`/assessor/context/${params.contextId}/question-bank/${question.id}`}>
            <button type="button" className="p-1 hover:bg-surface-hover rounded transition-colors" title="Засах">
              <Icons.SavePen className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
            </button>
          </Link>
          <button type="button" onClick={onCopy} className="p-1 hover:bg-surface-hover rounded transition-colors" title="Хуулах">
            <Icons.UndoDot className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
          </button>
          <button type="button" onClick={onDelete} className="p-1 hover:bg-danger/5 rounded transition-colors" title="Устгах">
            <Icons.Trash className="h-3.5 w-3.5 text-muted-foreground hover:text-danger" />
          </button>
        </div>

        <span className="text-[10px] text-muted-foreground">
          Used 24 times
        </span>
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
}: {
  questions: QuestionBankItem[];
  selectedQuestionIds: string[];
  toggleSelection: (id: string) => void;
  handlePreview: (question: QuestionBankItem) => void;
  handleDelete?: (id: string) => void;
  handleCopy?: (id: string) => void;
}) {
  const params = useParams();
  const isAllSelected = questions.length > 0 && questions.every(q => selectedQuestionIds.includes(q.id));

  const handleSelectAll = () => {
    if (isAllSelected) {
      questions.forEach(q => {
        if (selectedQuestionIds.includes(q.id)) toggleSelection(q.id);
      });
    } else {
      questions.forEach(q => {
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
            <th className="p-seek-3">Question</th>
            <th className="p-seek-3 w-36">Subject / Topic</th>
            <th className="p-seek-3 w-28">Type</th>
            <th className="p-seek-3 w-28">Difficulty</th>
            <th className="p-seek-3 w-28">Success Rate</th>
            <th className="p-seek-3 w-28">Created</th>
            <th className="p-seek-3 w-24 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => {
            const isChecked = selectedQuestionIds.includes(question.id);
            const successRate = 78; // mock success rate
            
            // Icon and Color by Question Type
            const typeConfig = (() => {
              switch (question.type as string) {
                case "multiple_choice":
                  return { label: "Multiple Choice", color: "text-primary bg-primary/5 border-primary/10" };
                case "essay":
                  return { label: "Essay", color: "text-secondary bg-secondary/5 border-secondary/10" };
                case "true_false":
                  return { label: "True/False", color: "text-success bg-success/5 border-success/10" };
                case "fill_in_blank":
                  return { label: "Fill-in-Blank", color: "text-warning bg-warning/5 border-warning/10" };
                default:
                  return { label: "Short Answer", color: "text-muted-foreground bg-muted-background border-none" };
              }
            })();

            const difficultyConfig = (() => {
              if (question.difficulty?.includes("easy")) return { label: "Easy", dot: "bg-emerald-500", text: "text-emerald-700" };
              if (question.difficulty?.includes("hard")) return { label: "Hard", dot: "bg-rose-500", text: "text-rose-700" };
              return { label: "Medium", dot: "bg-amber-500", text: "text-amber-700" };
            })();

            return (
              <tr key={question.id} className="border-b border-border/40 hover:bg-muted-background/5 transition-colors">
                <td className="p-seek-3 text-center">
                  <Checkbox checked={isChecked} onChange={() => toggleSelection(question.id)} />
                </td>
                <td className="p-seek-3">
                  <Text className="font-bold text-foreground line-clamp-1 hover:text-primary transition-colors">
                    {question.title}
                  </Text>
                  <Text variant="muted" className="text-[10px] mt-0.5 font-medium">
                    ID: {question.code} · Used 24 times
                  </Text>
                </td>
                <td className="p-seek-3">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 text-[9px] font-bold py-0.5 px-2 rounded">
                      {question.topicName || "General"}
                    </Badge>
                  </div>
                </td>
                <td className="p-seek-3">
                  <Badge variant="secondary" className={`${typeConfig.color} text-[9px] font-bold py-0.5 px-2 rounded`}>
                    {typeConfig.label}
                  </Badge>
                </td>
                <td className="p-seek-3 font-semibold">
                  <span className={`inline-flex items-center gap-1.5 ${difficultyConfig.text} text-[10px] font-bold`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${difficultyConfig.dot}`} />
                    {difficultyConfig.label}
                  </span>
                </td>
                <td className="p-seek-3">
                  <div className="space-y-1 w-20">
                    <span className="font-bold text-foreground text-[10px]">{successRate}%</span>
                    <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                      <div style={{ width: `${successRate}%` }} className="h-full bg-emerald-500 rounded-full" />
                    </div>
                  </div>
                </td>
                <td className="p-seek-3 font-semibold text-muted-foreground">
                  2 days ago
                </td>
                <td className="p-seek-3 text-center">
                  <div className="flex justify-center gap-1">
                    <Link href={`/assessor/context/${params.contextId}/question-bank/${question.id}`}>
                      <button type="button" className="p-1 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded" title="Засах">
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
        <Text className="text-sm font-semibold">{count} даалгавар сонгосон</Text>
        <div className="flex flex-wrap gap-2">
          {["Батлуулах хүсэлт", "Хянагдаж байна", "Нийтлэх", "Архивлах"].map(
            (label) => (
              <Button
                key={label}
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => onAction(label)}
              >
                {label}
              </Button>
            ),
          )}
          <Button type="button" size="sm" variant="danger" onClick={() => onAction("Устгах")}>
            Устгах
          </Button>
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
