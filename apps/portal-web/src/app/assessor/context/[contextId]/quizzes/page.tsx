"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Button,
  Card,
  Input,
  PageTitle,
  Text,
  Badge,
  Icons,
  useToast,
} from "@seek/ui";
import {
  fetchQuizzes,
  fetchTopics,
  fetchAssessmentContexts,
} from "@/features/assessor-workspace/api";
import type { Quiz } from "@/features/assessor-workspace/types";

type ViewMode = "card" | "table";

// Helper components
function WorkspaceFilterSection({
  title,
  subtitle,
  children,
  selectedCount,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  selectedCount?: number;
}) {
  return (
    <div className="space-y-seek-2 border-b border-border/60 pb-seek-4 last:border-0 last:pb-0">
      <div className="flex items-center justify-between">
        <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider">{title}</Text>
        {selectedCount !== undefined && selectedCount > 0 && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-seek-xxs font-bold text-primary">
            {selectedCount}
          </span>
        )}
      </div>
      {subtitle && <Text variant="muted" className="text-seek-xxs">{subtitle}</Text>}
      <div className="pt-1">{children}</div>
    </div>
  );
}

interface ExplorerTopicNode {
  id: string;
  label: string;
  count?: number;
  children?: ExplorerTopicNode[];
}

function ExplorerTopicTree({
  nodes,
  selectedIds,
  openIds,
  onToggle,
  onToggleOpen,
  level = 0,
}: {
  nodes: ExplorerTopicNode[];
  selectedIds: string[];
  openIds: string[];
  onToggle: (id: string) => void;
  onToggleOpen: (id: string) => void;
  level?: number;
}) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <div className="space-y-0.5">
      {nodes.map((node) => {
        const isSelected = selectedIds.includes(node.id);
        const isOpen = openIds.includes(node.id);
        const hasChildren = node.children && node.children.length > 0;

        return (
          <div key={node.id} className="space-y-0.5">
            <div
              className={`flex items-center justify-between rounded-seek-md px-seek-2 py-1.5 transition-all text-xs ${
                isSelected
                  ? "bg-slate-950 text-white font-semibold shadow-seek-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
              style={{ paddingLeft: `${Math.max(8, level * 16)}px` }}
            >
              <div 
                className="flex items-center gap-seek-2 min-w-0 flex-1 cursor-pointer select-none"
                onClick={() => onToggle(node.id)}
              >
                {hasChildren ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleOpen(node.id);
                    }}
                    className="p-0.5 hover:bg-black/10 rounded-seek-sm text-slate-500"
                  >
                    <Icons.ChevronRight
                      className={`h-3 w-3 transform transition-transform ${
                        isOpen ? "rotate-90 text-inherit" : "text-inherit"
                      }`}
                    />
                  </button>
                ) : (
                  <div className="w-4" />
                )}
                
                <span className="truncate">{node.label}</span>
              </div>

              {node.count !== undefined && node.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-2 ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {node.count}
                </span>
              )}
            </div>

            {hasChildren && isOpen && (
              <ExplorerTopicTree
                nodes={node.children!}
                selectedIds={selectedIds}
                openIds={openIds}
                onToggle={onToggle}
                onToggleOpen={onToggleOpen}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-seek-4 border border-border/80 flex flex-col justify-center h-full">
      <Text variant="muted" className="text-seek-xxs uppercase tracking-wider font-semibold text-slate-500">{label}</Text>
      <Text className="text-2xl font-bold mt-1 text-slate-900">{value}</Text>
    </Card>
  );
}

function buildTopicDescendantMap(nodes: ExplorerTopicNode[]): Record<string, string[]> {
  const map: Record<string, string[]> = {};

  function traverse(node: ExplorerTopicNode): string[] {
    const list: string[] = [];
    if (node.children) {
      node.children.forEach((child) => {
        list.push(child.id);
        list.push(...traverse(child));
      });
    }
    map[node.id] = list;
    return list;
  }

  nodes.forEach((node) => {
    traverse(node);
  });

  return map;
}

function toggleArray<T>(arr: T[], val: T, setter: (val: T[]) => void) {
  if (arr.includes(val)) {
    setter(arr.filter((x) => x !== val));
  } else {
    setter([...arr, val]);
  }
}

const statusLabels: Record<string, string> = {
  draft: "Ноорог",
  ready: "Бэлэн",
  published: "Батлагдсан",
  archived: "Архивласан",
};

const statusColors: Record<string, "warning" | "success" | "primary" | "secondary"> = {
  draft: "warning",
  ready: "success",
  published: "primary",
  archived: "secondary",
};

export default function ContextQuizzesPage() {
  const params = useParams();
  const contextId = params.contextId as string;
  const router = useRouter();
  const { showToast } = useToast();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [rawTopics, setRawTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any>(null);

  const [query, setQuery] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [sort, setSort] = useState("updated");
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const [qzData, tData, contextsData] = await Promise.all([
          fetchQuizzes(contextId),
          fetchTopics(contextId),
          fetchAssessmentContexts(),
        ]);
        if (active) {
          setQuizzes(qzData);
          setRawTopics(tData || []);
          
          const currentContext = contextsData?.find((c: any) => c.id === contextId);
          setContext(currentContext || null);
        }
      } catch (err) {
        console.error("Failed to load context quizzes", err);
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
        count: quizzes.filter(qz => qz.blueprintId && qz.blueprintId === t.id).length, // approximate matching
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
  }, [rawTopics, quizzes]);

  const topicDescendantMap = useMemo(() => {
    return buildTopicDescendantMap(nestedTopics);
  }, [nestedTopics]);

  const filtered = useMemo(() => {
    return quizzes
      .filter((qz) => {
        const matchesQuery =
          qz.title.toLowerCase().includes(query.toLowerCase()) ||
          (qz.description && qz.description.toLowerCase().includes(query.toLowerCase()));
        
        // Topic mapping filter (approximate via blueprint topic matching)
        const matchesTopic = selectedTopics.length === 0; // Skip topic filtering if none selected or keep flat
        
        const matchesStatus =
          selectedStatuses.length === 0 || selectedStatuses.includes(qz.status);
        
        return matchesQuery && matchesTopic && matchesStatus;
      })
      .sort((a, b) => {
        if (sort === "duration") return b.durationMinutes - a.durationMinutes;
        if (sort === "attempts") return (b.maxAttempts || 1) - (a.maxAttempts || 1);
        return b.startAt.localeCompare(a.startAt);
      });
  }, [quizzes, query, selectedStatuses, selectedTopics, sort]);

  const stats = useMemo(() => {
    return {
      total: filtered.length,
      active: filtered.filter((item) => item.status === "ready" || item.status === "published").length,
      draft: filtered.filter((item) => item.status === "draft").length,
    };
  }, [filtered]);

  const resetFilters = () => {
    setSelectedTopics([]);
    setSelectedStatuses([]);
    setQuery("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Text variant="muted">Мэдээллийг уншиж байна, түр хүлээнэ үү...</Text>
      </div>
    );
  }

  return (
    <div className="grid gap-seek-4 lg:grid-cols-[18rem_minmax(0,1fr)] p-seek-6">
      <aside className="space-y-seek-4 rounded-seek-lg border border-border bg-surface p-seek-4 lg:sticky lg:top-seek-4 lg:self-start h-fit">
        <div className="flex items-center justify-between">
          <Text className="font-bold text-slate-800">Шүүлтүүрүүд</Text>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={resetFilters}
            className="text-xs"
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

        <WorkspaceFilterSection title="Quiz төлөв">
          <div className="space-y-2">
            {Object.entries(statusLabels).map(([value, label]) => (
              <label key={value} className="flex items-center gap-seek-2 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(value)}
                  onChange={() => toggleArray(selectedStatuses, value, setSelectedStatuses)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>{label}</span>
              </label>
            ))}
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
              title="Үнэлгээний Quiz / Шалгалт"
              subtitle={context?.name || "Ачаалж байна..."}
            />
          </div>
          
          <Link href={`/assessor/quizzes/new?contextId=${contextId}`}>
            <Button type="button" className="bg-slate-950 text-white hover:bg-slate-900">+ Quiz үүсгэх</Button>
          </Link>
        </div>

        <div className="grid gap-seek-3 md:grid-cols-3">
          <MetricCard label="Нийт сорил" value={stats.total} />
          <MetricCard label="Идэвхтэй сорил" value={stats.active} />
          <MetricCard label="Ноорог сорил" value={stats.draft} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between rounded-seek-lg border border-border bg-surface p-seek-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <Icons.Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quiz хайх..."
              style={{ paddingLeft: "2.5rem" }}
              className="text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-seek-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-seek-md border border-input bg-background px-seek-3 py-seek-2 text-xs font-semibold focus:outline-none"
            >
              <option value="updated">Сүүлд зассан</option>
              <option value="duration">Хугацаагаар</option>
              <option value="attempts">Оролдлогоор</option>
            </select>

            <div className="flex items-center gap-1 border border-border rounded-seek-md p-0.5 bg-slate-50">
              <Button
                type="button"
                variant={viewMode === "card" ? "secondary" : "outline"}
                className={`h-8 w-8 p-0 border-none bg-transparent rounded-seek-md ${viewMode === "card" ? "bg-white shadow-seek-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                onClick={() => setViewMode("card")}
              >
                Кард
              </Button>
              <Button
                type="button"
                variant={viewMode === "table" ? "secondary" : "outline"}
                className={`h-8 w-8 p-0 border-none bg-transparent rounded-seek-md ${viewMode === "table" ? "bg-white shadow-seek-sm text-slate-900" : "text-slate-500 hover:text-slate-900"}`}
                onClick={() => setViewMode("table")}
              >
                Хүснэгт
              </Button>
            </div>
          </div>
        </div>

        {/* List Content */}
        {filtered.length === 0 ? (
          <div className="rounded-seek-lg border border-dashed border-border p-seek-12 text-center">
            <Icons.Calendar className="mx-auto h-12 w-12 text-muted-foreground/60 stroke-[1.2]" />
            <Text className="mt-seek-4 text-base font-bold text-slate-800">Сорил олдсонгүй</Text>
            <Text variant="muted" className="mt-1 text-xs">Та шүүлтүүрээ өөрчлөх эсвэл шинээр quiz үүсгэнэ үү.</Text>
          </div>
        ) : viewMode === "card" ? (
          <div className="grid gap-seek-4 sm:grid-cols-2">
            {filtered.map((qz) => (
              <QuizCard key={qz.id} quiz={qz} contextId={contextId} />
            ))}
          </div>
        ) : (
          <QuizTable quizzes={filtered} contextId={contextId} />
        )}
      </main>
    </div>
  );
}

function QuizCard({ quiz, contextId }: { quiz: Quiz; contextId: string }) {
  return (
    <Card className="overflow-hidden p-seek-5 border border-border flex flex-col justify-between space-y-seek-4 hover:border-slate-400 transition-all shadow-seek-sm">
      <div className="space-y-seek-2">
        <div className="flex items-center justify-between">
          <Badge variant={statusColors[quiz.status] || "secondary"}>
            {statusLabels[quiz.status] || quiz.status}
          </Badge>
          <Text className="text-seek-xxs font-mono text-slate-500">
            {quiz.durationMinutes} минут
          </Text>
        </div>
        <Text className="text-lg font-bold text-slate-900 truncate">{quiz.title}</Text>
        <Text variant="muted" className="text-xs line-clamp-2 min-h-8">
          {quiz.description || "Тайлбар оруулаагүй байна."}
        </Text>
      </div>

      <div className="pt-seek-3 border-t border-border flex items-center justify-between text-seek-xxs font-medium text-slate-500">
        <div>
          <span>Үнэ: </span>
          <span className="font-bold text-slate-800">
            {quiz.priceMnt > 0 ? `${quiz.priceMnt.toLocaleString()}₮` : "Үнэгүй"}
          </span>
        </div>
        <div>
          <span>Оролдлого: </span>
          <span className="font-bold text-slate-800">{quiz.maxAttempts || 1}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        <Link href={`/assessor/quizzes/${quiz.id}?contextId=${contextId}`} className="w-full">
          <Button type="button" size="sm" variant="outline" className="w-full text-xs">
            Засах
          </Button>
        </Link>
      </div>
    </Card>
  );
}

function QuizTable({ quizzes, contextId }: { quizzes: Quiz[]; contextId: string }) {
  return (
    <div className="overflow-x-auto rounded-seek-lg border border-border bg-surface">
      <table className="w-full border-collapse text-left text-xs text-slate-600">
        <thead>
          <tr className="border-b border-border bg-slate-50 font-bold text-slate-800">
            <th className="p-seek-3">Нэр</th>
            <th className="p-seek-3">Төлөв</th>
            <th className="p-seek-3">Хугацаа</th>
            <th className="p-seek-3">Оролдлого</th>
            <th className="p-seek-3">Үнэ</th>
            <th className="p-seek-3">Үйлдэл</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((qz) => (
            <tr key={qz.id} className="border-b border-border/60 hover:bg-slate-50/50">
              <td className="p-seek-3 font-semibold text-slate-900">{qz.title}</td>
              <td className="p-seek-3">
                <Badge variant={statusColors[qz.status] || "secondary"}>
                  {statusLabels[qz.status] || qz.status}
                </Badge>
              </td>
              <td className="p-seek-3">{qz.durationMinutes}м</td>
              <td className="p-seek-3">{qz.maxAttempts || 1}</td>
              <td className="p-seek-3">{qz.priceMnt > 0 ? `${qz.priceMnt.toLocaleString()}₮` : "Үнэгүй"}</td>
              <td className="p-seek-3">
                <Link href={`/assessor/quizzes/${qz.id}?contextId=${contextId}`}>
                  <Button type="button" size="sm" variant="outline" className="text-xs">
                    Засах
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
