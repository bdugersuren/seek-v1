"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Icons,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
} from "@seek/ui";
import {
  getBlueprintSummary,
  isBlueprintSectionValid,
  createBlueprint,
  updateBlueprint,
  fetchQuestions,
  fetchTopics,
} from "./api";
import {
  competencyLabels,
  difficultyLabels,
  mockBlueprints,
  questionTypeLabels,
  statusLabels,
} from "./mock-data";
import type {
  Blueprint,
  BlueprintSection,
  BlueprintSelectionStrategy,
  BlueprintTopicMapping,
  CompetencyType,
  DifficultyLevel,
  QuestionBankItem,
} from "./types";

interface ExtendedBlueprintSection extends BlueprintSection {
  difficultyGrouping?: "easy" | "medium" | "hard" | "all";
  filterTopicIds?: string[];
  excludeAttempted?: boolean;
  randomizeOrder?: boolean;
}

interface BlueprintWizardState {
  id: string;
  title: string;
  description: string;
  topicId: string;
  topicName: string;
  passScore: number;
  totalDurationMinutes: number;
  status: Blueprint["status"];
  topicMappings: BlueprintTopicMapping[];
  sections: ExtendedBlueprintSection[];
  reviewComment: string;
}

const defaultBlueprint = mockBlueprints[0];

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

export function BlueprintEditor({
  blueprint = defaultBlueprint,
  mode = "edit",
  contextId,
}: {
  blueprint?: Blueprint;
  mode?: "new" | "edit";
  contextId?: string;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  // Modals state
  const [editingPoolId, setEditingPoolId] = useState<string | null>(null);
  const [selectBankPoolId, setSelectBankPoolId] = useState<string | null>(null);
  const [expandedPoolIds, setExpandedPoolIds] = useState<string[]>([]);

  const activeContextId = contextId || blueprint.assessmentContextId;

  // Questions and Topics
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const data = await fetchQuestions({ 
          ownerUserId: "mock-assessor", 
          assessmentContextId: activeContextId 
        });
        if (active) {
          setQuestions(data || []);
        }
      } catch (err) {
        console.error("Failed to load questions in BlueprintEditor", err);
      }
    }
    load();
    return () => { active = false; };
  }, [activeContextId]);

  const [rawTopics, setRawTopics] = useState<any[]>([]);
  useEffect(() => {
    let active = true;
    async function loadTopics() {
      if (activeContextId) {
        try {
          const tData = await fetchTopics(activeContextId);
          if (active) setRawTopics(tData || []);
        } catch (err) {
          console.error("Failed to load topics in BlueprintEditor", err);
        }
      }
    }
    loadTopics();
    return () => { active = false; };
  }, [activeContextId]);

  const [state, setState] = useState<BlueprintWizardState>(() => {
    const source = mode === "new" ? defaultBlueprint : blueprint;
    return {
      id: mode === "new" ? "bp-new" : source.id,
      title: mode === "new" ? "Шинэ блюпринт" : source.title,
      description: source.description,
      topicId: source.topicId,
      topicName: source.topicName,
      passScore: source.passScore,
      totalDurationMinutes: source.totalDurationMinutes,
      status: mode === "new" ? "draft" : source.status,
      topicMappings: source.topicMappings ?? [],
      sections: (source.sections ?? []).map(sec => ({
        ...sec,
        difficultyGrouping: (sec as any).difficultyGrouping ?? "all",
        filterTopicIds: (sec as any).filterTopicIds ?? [],
        excludeAttempted: (sec as any).excludeAttempted ?? false,
        randomizeOrder: (sec as any).randomizeOrder ?? true,
      })),
      reviewComment: source.reviewComment ?? "",
    };
  });

  const setPartial = (patch: Partial<BlueprintWizardState>) =>
    setState((current) => ({ ...current, ...patch }));

  const addPool = () => {
    const newId = `sec-${state.sections.length + 1}`;
    const newPool: ExtendedBlueprintSection = {
      id: newId,
      name: `POOL ${state.sections.length + 1}: Linear Equations — Basic`,
      description: "Шинэ pool тохиргоо",
      selectedQuestionIds: [],
      randomPickCount: 1,
      pointsPerQuestion: 1,
      durationMinutes: 5,
      strategy: "random",
      difficultyGrouping: "easy",
      filterTopicIds: [],
      excludeAttempted: false,
      randomizeOrder: true,
    };
    setState(current => ({
      ...current,
      sections: [...current.sections, newPool]
    }));
    setExpandedPoolIds(current => [...current, newId]);
    setEditingPoolId(newId); // Нэмэгдсэн даруйд тохируулах modal нээх
  };

  const togglePoolExpand = (id: string) => {
    setExpandedPoolIds(current =>
      current.includes(id) ? current.filter(pId => pId !== id) : [...current, id]
    );
  };

  const copyPool = (sectionId: string) => {
    const target = state.sections.find(s => s.id === sectionId);
    if (!target) return;
    const newId = `sec-${state.sections.length + 1}`;
    const copied: ExtendedBlueprintSection = {
      ...target,
      id: newId,
      name: `${target.name} (Хуулбар)`,
      selectedQuestionIds: [...target.selectedQuestionIds],
    };
    setState(current => ({
      ...current,
      sections: [...current.sections, copied]
    }));
    showToast("Pool амжилттай хуулагдлаа.", "success");
  };

  const deletePool = (sectionId: string) => {
    setState(current => ({
      ...current,
      sections: current.sections.filter(s => s.id !== sectionId)
    }));
    showToast("Pool устгагдлаа.", "success");
  };

  const save = async () => {
    try {
      const bpData: Blueprint = {
        id: state.id,
        title: state.title,
        description: state.description,
        topicId: state.topicId,
        topicName: state.topicName,
        passScore: state.passScore,
        totalDurationMinutes: state.totalDurationMinutes,
        status: state.status,
        assessmentContextId: activeContextId,
        sections: state.sections,
        updatedAt: new Date().toISOString(),
      };

      if (mode === "edit") {
        await updateBlueprint(bpData.id, bpData);
      } else {
        await createBlueprint(bpData);
      }
      showToast("Загвар амжилттай хадгалагдлаа.", "success");
      router.push(activeContextId ? `/assessor/context/${activeContextId}/blueprints` : "/assessor/blueprints");
    } catch (err: any) {
      showToast("Хадгалахад алдаа гарлаа.", "danger");
    }
  };

  // Stats calculation
  const totalQuestionsSelected = useMemo(() => {
    return state.sections.reduce((sum, s) => sum + s.randomPickCount, 0);
  }, [state.sections]);

  const totalAvailablePool = useMemo(() => {
    return state.sections.reduce((sum, s) => sum + s.selectedQuestionIds.length, 0);
  }, [state.sections]);

  const difficultyDistribution = useMemo(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    state.sections.forEach(s => {
      s.selectedQuestionIds.forEach(qId => {
        const q = questions.find(item => item.id === qId);
        if (q) {
          if (q.difficulty?.includes("easy")) counts.easy++;
          else if (q.difficulty?.includes("hard")) counts.hard++;
          else counts.medium++;
        }
      });
    });
    const total = counts.easy + counts.medium + counts.hard || 1;
    return {
      easy: { count: counts.easy, pct: Math.round((counts.easy / total) * 100) },
      medium: { count: counts.medium, pct: Math.round((counts.medium / total) * 100) },
      hard: { count: counts.hard, pct: Math.round((counts.hard / total) * 100) },
    };
  }, [state.sections, questions]);

  const topicBreakdown = useMemo(() => {
    const topicCounts: Record<string, number> = {};
    state.sections.forEach(s => {
      s.selectedQuestionIds.forEach(qId => {
        const q = questions.find(item => item.id === qId);
        if (q) {
          const name = q.topicName || "Бусад";
          topicCounts[name] = (topicCounts[name] ?? 0) + 1;
        }
      });
    });
    const total = Object.values(topicCounts).reduce((sum, c) => sum + c, 0) || 1;
    return Object.entries(topicCounts).map(([name, count]) => ({
      name,
      count,
      pct: Math.round((count / total) * 100)
    })).sort((a, b) => b.count - a.count);
  }, [state.sections, questions]);

  return (
    <div className="min-h-screen bg-muted-background pb-24">
      {/* HEADER SECTION */}
      <header className="sticky top-0 z-header border-b border-border bg-surface/95 px-seek-4 py-seek-3 backdrop-blur shadow-seek-sm">
        <div className="flex flex-col gap-seek-4 xl:flex-row xl:items-center xl:justify-between max-w-[96rem] mx-auto w-full">
          <div className="flex items-center gap-seek-3 flex-1 min-w-0">
            <Link
              href={activeContextId ? `/assessor/context/${activeContextId}/blueprints` : "/assessor/blueprints"}
              className="grid h-10 w-10 place-items-center rounded-seek-md border border-border bg-surface hover:bg-surface-hover shrink-0 transition-colors"
              aria-label="Буцах"
            >
              <Icons.Undo2 className="h-5 w-5 text-muted-foreground" />
            </Link>
            <div className="min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={state.title}
                    className="text-xl font-bold h-9 py-1 px-2 border border-border rounded"
                    autoFocus
                    onBlur={() => setIsEditingTitle(false)}
                    onChange={(e) => setPartial({ title: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setIsEditingTitle(false);
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Text className="text-xl font-bold truncate">
                    {state.title}
                  </Text>
                  <button type="button" onClick={() => setIsEditingTitle(true)} aria-label="Нэр засах">
                    <Icons.SavePen className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>
              )}
              <Text variant="muted" className="text-xs">
                {state.topicName || "Mathematics 101"} · Draft Template
              </Text>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-seek-4">
            <div className="flex items-center gap-seek-3">
              <Badge variant="primary" className="bg-primary/10 text-primary border-none px-seek-3 py-1 text-xs font-semibold rounded-seek-full">
                ● {totalQuestionsSelected} Total Questions Selected
              </Badge>
              <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Icons.Timer className="h-4 w-4" />
                Est. Duration: ~{state.totalDurationMinutes} mins
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={addPool}>
                <span className="mr-1 font-bold">+</span> Add pool
              </Button>
              <Link href={activeContextId ? `/assessor/context/${activeContextId}/blueprints` : "/assessor/blueprints"}>
                <Button type="button" variant="secondary" size="sm">
                  Cancel
                </Button>
              </Link>
              <Button type="button" size="sm" onClick={save}>
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="mx-auto max-w-[96rem] px-seek-4 py-seek-5 grid gap-seek-5 lg:grid-cols-[1fr_24rem] w-full">
        {/* LEFT COLUMN: QUESTION POOLS */}
        <div className="space-y-seek-4">
          <div>
            <Text className="text-xl font-bold">Question Pools</Text>
            <Text variant="muted" className="text-xs mt-1">
              Configure rule-based pools to dynamically assemble exams. Students will receive random questions matching these profiles.
            </Text>
          </div>

          {state.sections.length === 0 ? (
            <Card className="p-seek-8 text-center border-dashed border-2">
              <Text className="font-semibold text-muted-foreground mb-seek-3">Үүсгэсэн асуултын сан (Pool) байхгүй байна.</Text>
              <Button type="button" variant="outline" onClick={addPool}>+ Анхны Pool үүсгэх</Button>
            </Card>
          ) : (
            state.sections.map((section, index) => {
              const selectedQuestions = questions.filter(q => section.selectedQuestionIds.includes(q.id));
              const valid = section.selectedQuestionIds.length >= section.randomPickCount;
              const isExpanded = expandedPoolIds.includes(section.id);
              return (
                <Card key={section.id} className="overflow-hidden rounded-seek-lg border border-border shadow-seek-sm bg-surface">
                  <div className={`p-seek-4 bg-muted-background/5 ${isExpanded ? "border-b border-border/40" : ""}`}>
                    <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-seek-3 min-w-0">
                        <span className="cursor-grab text-muted-foreground shrink-0">⠿</span>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 uppercase tracking-wider text-[10px] font-bold">
                          POOL {index + 1}
                        </Badge>
                        <Text className="font-bold text-foreground truncate">{section.name}</Text>
                        <Badge variant={section.difficultyGrouping === "easy" ? "success" : section.difficultyGrouping === "hard" ? "danger" : "warning"} className="text-[10px] capitalize">
                          {section.difficultyGrouping}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium shrink-0">
                          Pick {section.randomPickCount} / {section.selectedQuestionIds.length} Available
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-auto">
                        <button
                          type="button"
                          onClick={() => setEditingPoolId(section.id)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded transition-colors"
                          title="Засах"
                        >
                          <Icons.SavePen className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyPool(section.id)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded transition-colors"
                          title="Хуулах"
                        >
                          <Icons.Undo2 className="h-4 w-4 rotate-180" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deletePool(section.id)}
                          className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/5 rounded transition-colors"
                          title="Устгах"
                        >
                          <Icons.Trash className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePoolExpand(section.id)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-hover rounded transition-colors"
                          title={isExpanded ? "Хураах" : "Дэлгэх"}
                        >
                          <Icons.ChevronRight className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pool Questions List */}
                  {isExpanded && (
                    <div className="p-seek-4 space-y-seek-3">
                    {selectedQuestions.length === 0 ? (
                      <div className="py-seek-4 text-center border border-dashed rounded text-sm text-muted-foreground bg-muted-background/10">
                        Сонгосон асуулт байхгүй байна.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs min-w-[40rem]">
                          <thead>
                            <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                              <th className="py-2 w-16">ID</th>
                              <th className="py-2">QUESTION TEXT SNIPPET</th>
                              <th className="py-2 w-24">DIFFICULTY</th>
                              <th className="py-2 w-28">SUCCESS RATE</th>
                              <th className="py-2 w-16 text-center">LINK</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedQuestions.slice(0, 3).map((q) => (
                              <tr key={q.id} className="border-b border-border/40 hover:bg-muted-background/5">
                                <td className="py-2.5 font-bold text-primary">{q.code}</td>
                                <td className="py-2.5 font-medium truncate max-w-[20rem]">{q.body || (q as any).stem}</td>
                                <td className="py-2.5">
                                  <Badge variant={q.difficulty ? difficultyVariant[q.difficulty] : "secondary"} className="text-[10px]">
                                    {q.difficulty ? difficultyLabels[q.difficulty] : "Medium"}
                                  </Badge>
                                </td>
                                <td className="py-2.5 text-muted-foreground font-medium">72%</td>
                                <td className="py-2.5 text-center">
                                  <Icons.Check className="h-4 w-4 text-primary mx-auto" />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {selectedQuestions.length > 3 && (
                          <div className="text-xs text-muted-foreground mt-2 font-medium">
                            Showing 3 of {selectedQuestions.length} candidate questions in current item bank sync
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-end pt-seek-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectBankPoolId(section.id)}
                      >
                        <Icons.Settings className="h-3.5 w-3.5 mr-1" />
                        Manage Questions
                      </Button>
                     </div>
                  </div>
                  )}
                </Card>
              );
            })
          )}
        </div>

        {/* RIGHT COLUMN: LIVE BLUEPRINT SUMMARY */}
        <aside className="space-y-seek-4">
          <Card className="p-seek-4 shadow-seek-sm bg-surface space-y-seek-4 border border-border">
            <div className="flex items-center justify-between border-b border-border/60 pb-seek-3">
              <span className="flex items-center gap-2 font-bold text-foreground text-sm uppercase">
                <Icons.ChartIcon className="h-4 w-4 text-primary" /> Live Blueprint Summary
              </span>
              <button
                type="button"
                onClick={() => showToast("Үзүүлэлтийг шинэчиллээ.", "success")}
                className="text-muted-foreground hover:text-foreground"
                title="Шинэчлэх"
              >
                <Icons.Recycle className="h-4 w-4" />
              </button>
            </div>

            {/* General metrics */}
            <div className="space-y-seek-3 text-xs border-b border-border/40 pb-seek-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Target Exam Size</span>
                <span className="font-bold text-foreground text-sm">{totalQuestionsSelected} Questions</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Total Available Pool</span>
                <span className="font-bold text-primary text-sm">{totalAvailablePool} Questions Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">LMS Course Sync</span>
                <span className="font-bold text-success">Active & Mapped</span>
              </div>
            </div>

            {/* Difficulty distribution Donut Chart */}
            <div className="border-b border-border/40 pb-seek-4">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-seek-3">
                Estimated Difficulty Distribution
              </Text>
              <div className="flex items-center gap-seek-4">
                {/* SVG Donut Chart */}
                <div className="relative h-24 w-24 shrink-0 flex items-center justify-center">
                  <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                    {/* Easy segment */}
                    {difficultyDistribution.easy.pct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3.5"
                        strokeDasharray={`${difficultyDistribution.easy.pct} ${100 - difficultyDistribution.easy.pct}`}
                        strokeDashoffset="0"
                      />
                    )}
                    {/* Medium segment */}
                    {difficultyDistribution.medium.pct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeDasharray={`${difficultyDistribution.medium.pct} ${100 - difficultyDistribution.medium.pct}`}
                        strokeDashoffset={`-${difficultyDistribution.easy.pct}`}
                      />
                    )}
                    {/* Hard segment */}
                    {difficultyDistribution.hard.pct > 0 && (
                      <circle
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3.5"
                        strokeDasharray={`${difficultyDistribution.hard.pct} ${100 - difficultyDistribution.hard.pct}`}
                        strokeDashoffset={`-${difficultyDistribution.easy.pct + difficultyDistribution.medium.pct}`}
                      />
                    )}
                  </svg>
                  <div className="text-center z-10">
                    <span className="block text-lg font-bold text-foreground leading-none">{totalQuestionsSelected}</span>
                    <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">QS</span>
                  </div>
                </div>

                {/* Legend percentages */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" /> Easy ({difficultyDistribution.easy.count})
                    </span>
                    <span className="text-foreground">{difficultyDistribution.easy.pct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-amber-500" /> Med ({difficultyDistribution.medium.count})
                    </span>
                    <span className="text-foreground">{difficultyDistribution.medium.pct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="h-2 w-2 rounded-full bg-red-500" /> Hard ({difficultyDistribution.hard.count})
                    </span>
                    <span className="text-foreground">{difficultyDistribution.hard.pct}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Topic coverage breakdown */}
            <div className="space-y-seek-3 border-b border-border/40 pb-seek-4">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Topic Coverage Breakdown
              </Text>
              <div className="space-y-2">
                {topicBreakdown.length === 0 ? (
                  <div className="text-xs text-muted-foreground">Сэдэв сонгоогүй байна.</div>
                ) : (
                  topicBreakdown.map((topic, idx) => {
                    const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-sky-500"];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={topic.name} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-foreground truncate max-w-[12rem]">{topic.name}</span>
                          <span className="text-muted-foreground">{topic.count} Qs ({topic.pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                          <div style={{ width: `${topic.pct}%` }} className={`h-full ${color} rounded-full`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/5 text-xs font-bold py-2.5 rounded-seek-md"
              onClick={() => showToast("Шалгалтын загварыг үүсгэлээ.", "success")}
            >
              ⚡ Test Generate Sample Exam
            </Button>
            <Text variant="muted" className="text-[10px] text-center block">
              Simulate a sample exam with randomized algorithms to check difficulty balance.
            </Text>
          </Card>

          {/* Rule Collisions panel */}
          <Card className="p-seek-4 bg-surface border border-border rounded-seek-lg shadow-seek-sm flex items-start gap-seek-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
              <Icons.Info className="h-4 w-4" />
            </span>
            <div>
              <Text className="text-xs font-bold text-foreground">Rule Collisions</Text>
              <Text variant="muted" className="text-[10px] mt-1 leading-normal">
                Questions matching multiple templates default to the highest weight pool.
              </Text>
            </div>
          </Card>
        </aside>
      </div>

      {/* CONFIGURE QUESTION POOL MODAL (2-Р ЗУРАГ) */}
      {editingPoolId && (
        <QuestionPoolModal
          section={state.sections.find(s => s.id === editingPoolId)!}
          topics={rawTopics}
          onClose={() => setEditingPoolId(null)}
          onApply={(updatedSection) => {
            setState(current => ({
              ...current,
              sections: current.sections.map(s => s.id === editingPoolId ? { ...s, ...updatedSection } : s)
            }));
            setEditingPoolId(null);
            showToast("Pool амжилттай тохируулагдлаа.", "success");
          }}
        />
      )}

      {/* SELECT QUESTIONS FROM BANK MODAL (3-Р ЗУРАГ) */}
      {selectBankPoolId && (
        <SelectQuestionsBankModal
          section={state.sections.find(s => s.id === selectBankPoolId)!}
          questions={questions}
          topics={rawTopics}
          onClose={() => setSelectBankPoolId(null)}
          onApply={(selectedQuestionIds) => {
            setState(current => ({
              ...current,
              sections: current.sections.map(s => s.id === selectBankPoolId ? { ...s, selectedQuestionIds } : s)
            }));
            setSelectBankPoolId(null);
            showToast("Асуултын сонголтыг хадгаллаа.", "success");
          }}
        />
      )}
    </div>
  );
}

/* CONFIGURE QUESTION POOL MODAL COMPONENT */
function QuestionPoolModal({
  section,
  topics,
  onClose,
  onApply,
}: {
  section: ExtendedBlueprintSection;
  topics: any[];
  onClose: () => void;
  onApply: (updated: Partial<ExtendedBlueprintSection>) => void;
}) {
  const [name, setName] = useState(section.name);
  const [pickCount, setPickCount] = useState(section.randomPickCount);
  const [availableCount, setAvailableCount] = useState(section.selectedQuestionIds.length);
  const [difficultyGrouping, setDifficultyGrouping] = useState<"easy" | "medium" | "hard" | "all">(
    section.difficultyGrouping ?? "all"
  );
  const [filterTopicIds, setFilterTopicIds] = useState<string[]>(section.filterTopicIds ?? []);
  const [excludeAttempted, setExcludeAttempted] = useState(section.excludeAttempted ?? false);
  const [randomizeOrder, setRandomizeOrder] = useState(section.randomizeOrder ?? true);

  const [isOpenTopicsDropdown, setIsOpenTopicsDropdown] = useState(false);

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-black/45 p-seek-4">
      <Card className="w-full max-w-lg overflow-auto p-seek-5 shadow-seek-xl bg-surface space-y-seek-4 border border-border rounded-seek-lg">
        <div className="flex items-center justify-between border-b border-border/40 pb-seek-3">
          <Text className="text-base font-bold text-foreground">Configure Question Pool</Text>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icons.CircleX className="h-5 w-5" />
          </button>
        </div>

        {/* POOL NAME */}
        <div className="space-y-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pool Name</Text>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pool нэр..." />
        </div>

        {/* SELECTION RULE */}
        <div className="space-y-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Selection Rule</Text>
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <span>Pick</span>
            <Input
              type="number"
              min={1}
              value={pickCount}
              onChange={(e) => setPickCount(Number(e.target.value))}
              className="w-16 h-8 text-center"
            />
            <span className="text-muted-foreground font-normal">question randomly from</span>
            <span className="font-bold text-primary">{availableCount}</span>
            <span className="text-muted-foreground font-normal">eligible candidates.</span>
          </div>
        </div>

        {/* EQUATED DIFFICULTY GROUPING */}
        <div className="space-y-2">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Equated Difficulty Grouping</Text>
          <div className="flex rounded-seek-md bg-muted-background p-0.5 border border-border/60">
            {["easy", "medium", "hard", "all"].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setDifficultyGrouping(diff as any)}
                className={`flex-1 text-center py-1.5 text-xs font-bold rounded-seek-md uppercase tracking-wider transition-all ${
                  difficultyGrouping === diff
                    ? "bg-surface shadow-seek-sm text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ● {diff}
              </button>
            ))}
          </div>
        </div>

        {/* FILTER BY TOPICS / TAGS */}
        <div className="space-y-1 relative">
          <div className="flex justify-between items-center mb-1">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Filter by Topics / Tags</Text>
            <span className="text-[10px] text-success font-semibold">{filterTopicIds.length} matching topics</span>
          </div>

          <div
            className="min-h-10 w-full px-seek-3 py-seek-2 rounded-seek-md bg-surface text-foreground border border-border flex flex-wrap gap-1 items-center cursor-pointer hover:border-border-hover transition-colors"
            onClick={() => setIsOpenTopicsDropdown(!isOpenTopicsDropdown)}
          >
            {filterTopicIds.length > 0 ? (
              filterTopicIds.map((topicId) => {
                const topic = topics.find((t) => t.id === topicId);
                return (
                  <span key={topicId} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded">
                    {topic?.title || topic?.name || topicId}
                    <button
                      type="button"
                      className="hover:text-primary-hover font-bold ml-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilterTopicIds(filterTopicIds.filter((id) => id !== topicId));
                      }}
                    >
                      ×
                    </button>
                  </span>
                );
              })
            ) : (
              <span className="text-muted-foreground text-xs font-semibold">Сэдэв сонгох...</span>
            )}
          </div>

          {isOpenTopicsDropdown && (
            <div className="absolute z-dropdown mt-1 w-full max-h-48 overflow-y-auto rounded-seek-md border border-border bg-surface p-2 shadow-seek-lg space-y-1">
              {topics.map((topic) => {
                const isChecked = filterTopicIds.includes(topic.id);
                return (
                  <label key={topic.id} className="flex items-center gap-2 p-1.5 hover:bg-surface-hover rounded cursor-pointer text-xs font-semibold">
                    <Checkbox
                      checked={isChecked}
                      onChange={() => {
                        if (isChecked) {
                          setFilterTopicIds(filterTopicIds.filter((id) => id !== topic.id));
                        } else {
                          setFilterTopicIds([...filterTopicIds, topic.id]);
                        }
                      }}
                    />
                    <span>{topic.title || topic.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* ADDITIONAL RULES */}
        <div className="space-y-2 border-t border-border/40 pt-seek-3">
          <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-seek-2">Additional Rules</Text>
          <label className="flex items-start gap-2.5 text-xs font-semibold text-foreground cursor-pointer">
            <Checkbox checked={excludeAttempted} onChange={() => setExcludeAttempted(!excludeAttempted)} />
            <span>Exclude previously answered / attempted questions</span>
          </label>
          <label className="flex items-start gap-2.5 text-xs font-semibold text-foreground cursor-pointer mt-2">
            <Checkbox checked={randomizeOrder} onChange={() => setRandomizeOrder(!randomizeOrder)} />
            <span>Randomize question selection order during assembly</span>
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 border-t border-border/40 pt-seek-4">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            type="button"
            size="sm"
            onClick={() =>
              onApply({
                name,
                randomPickCount: pickCount,
                difficultyGrouping,
                filterTopicIds,
                excludeAttempted,
                randomizeOrder,
              })
            }
          >
            Save Pool
          </Button>
        </div>
      </Card>
    </div>
  );
}

/* SELECT QUESTIONS FROM BANK MODAL (3-Р ЗУРАГ) */
function SelectQuestionsBankModal({
  section,
  questions,
  topics,
  onClose,
  onApply,
}: {
  section: ExtendedBlueprintSection;
  questions: QuestionBankItem[];
  topics: any[];
  onClose: () => void;
  onApply: (selectedIds: string[]) => void;
}) {
  const [selected, setSelected] = useState<string[]>(section.selectedQuestionIds ?? []);
  const [query, setQuery] = useState("");
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  // Filter logic
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      const matchQuery =
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.code.toLowerCase().includes(query.toLowerCase());
      const matchTopic = selectedTopicIds.length === 0 || selectedTopicIds.includes(q.topicId);
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(q.type);
      const matchDifficulty = selectedDifficulties.length === 0 || selectedDifficulties.includes(q.difficulty ?? "");
      return matchQuery && matchTopic && matchType && matchDifficulty;
    });
  }, [questions, query, selectedTopicIds, selectedTypes, selectedDifficulties]);

  const activeQuestion = useMemo(() => {
    return questions.find((q) => q.id === activeQuestionId) || filtered[0] || null;
  }, [activeQuestionId, filtered, questions]);

  const toggleSelect = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = filtered.map((q) => q.id);
    const allSelected = allIds.every((id) => selected.includes(id));
    if (allSelected) {
      setSelected((current) => current.filter((id) => !allIds.includes(id)));
    } else {
      setSelected((current) => Array.from(new Set([...current, ...allIds])));
    }
  };

  const isAllSelected = useMemo(() => {
    return filtered.length > 0 && filtered.every((q) => selected.includes(q.id));
  }, [filtered, selected]);

  const totalPoints = useMemo(() => {
    return selected.reduce((sum, id) => {
      const q = questions.find((item) => item.id === id);
      return sum + (q?.defaultMaxScore ?? (q as any).points ?? 0);
    }, 0);
  }, [selected, questions]);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedTopicIds([]);
    setSelectedTypes([]);
    setSelectedDifficulties([]);
  };

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-black/45 p-seek-4">
      <Card className="max-h-[96vh] w-full max-w-6xl overflow-hidden p-0 shadow-seek-lg bg-surface flex flex-col border border-border rounded-seek-lg">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-border/40 px-seek-5 py-seek-4">
          <div>
            <Text className="text-base font-bold text-foreground">Select Questions from Bank</Text>
            <Badge variant="secondary" className="mt-1 bg-primary/10 text-primary border-none">
              Selected: {selected.length}
            </Badge>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <Icons.CircleX className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL BODY (3-COLUMN LAYOUT) */}
        <div className="flex-1 grid grid-cols-[15rem_1fr_20rem] overflow-hidden min-h-[30rem]">
          {/* COLUMN 1: FILTERS */}
          <div className="border-r border-border/40 p-seek-4 overflow-y-auto space-y-seek-4">
            <div className="relative">
              <Icons.Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions..."
                className="pl-8 text-xs h-8"
              />
            </div>

            {/* SUBJECT & TOPICS */}
            <div className="space-y-2">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subject & Topics</Text>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {topics.map((t) => (
                  <label key={t.id} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                    <Checkbox
                      checked={selectedTopicIds.includes(t.id)}
                      onChange={() =>
                        setSelectedTopicIds((current) =>
                          current.includes(t.id) ? current.filter((id) => id !== t.id) : [...current, t.id]
                        )
                      }
                    />
                    <span className="truncate">{t.title || t.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* QUESTION TYPE */}
            <div className="space-y-2">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Question Type</Text>
              <div className="space-y-1.5">
                {Object.entries(questionTypeLabels).slice(0, 4).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                    <Checkbox
                      checked={selectedTypes.includes(value)}
                      onChange={() =>
                        setSelectedTypes((current) =>
                          current.includes(value) ? current.filter((t) => t !== value) : [...current, value]
                        )
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* DIFFICULTY LEVEL */}
            <div className="space-y-2">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Difficulty Level</Text>
              <div className="space-y-1.5">
                {Object.entries(difficultyLabels).slice(0, 3).map(([value, label]) => (
                  <label key={value} className="flex items-center gap-2 text-xs font-semibold text-foreground cursor-pointer">
                    <Checkbox
                      checked={selectedDifficulties.includes(value)}
                      onChange={() =>
                        setSelectedDifficulties((current) =>
                          current.includes(value) ? current.filter((d) => d !== value) : [...current, value]
                        )
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-primary hover:underline block pt-2"
            >
              Clear All Filters
            </button>
          </div>

          {/* COLUMN 2: QUESTIONS LIST */}
          <div className="flex flex-col overflow-hidden bg-muted-background/10">
            <div className="px-seek-4 py-seek-3 border-b border-border/40 flex items-center justify-between bg-surface">
              <div className="flex items-center gap-seek-3 text-xs font-bold text-foreground">
                <Checkbox checked={isAllSelected} onChange={handleSelectAll} />
                <span>Select All · {filtered.length} questions found</span>
              </div>
              <div className="flex items-center gap-2">
                <Select className="h-8 text-[10px] w-28" options={[{ value: "newest", label: "Sort by: Newest" }]} />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-seek-4 space-y-seek-3">
              {filtered.map((q) => {
                const isChecked = selected.includes(q.id);
                const isActive = activeQuestion?.id === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => setActiveQuestionId(q.id)}
                    className={`p-seek-4 rounded-seek-lg border cursor-pointer transition-all flex items-start gap-seek-4 bg-surface ${
                      isActive ? "ring-2 ring-primary border-primary" : "border-border hover:shadow-seek-sm"
                    }`}
                  >
                    <Checkbox
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleSelect(q.id);
                      }}
                      className="mt-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <Text className="font-bold text-xs text-foreground line-clamp-1">{q.title}</Text>
                      <div className="flex items-center gap-2 mt-seek-3 flex-wrap">
                        <Badge variant="secondary" className="text-[9px] font-bold bg-muted-background border-none px-2 py-0.5 rounded">
                          {q.topicName}
                        </Badge>
                        <Badge variant={q.difficulty ? difficultyVariant[q.difficulty] : "secondary"} className="text-[9px] font-bold px-2 py-0.5 rounded">
                          {q.difficulty ? difficultyLabels[q.difficulty] : "Medium"}
                        </Badge>
                        <Badge variant="secondary" className="text-[9px] font-bold bg-muted-background border-none px-2 py-0.5 rounded">
                          {questionTypeLabels[q.type]}
                        </Badge>
                        <Badge variant="primary" className="text-[9px] font-bold bg-primary/10 text-primary border-none px-2 py-0.5 rounded">
                          {(q as any).points ?? q.defaultMaxScore ?? 0} pts
                        </Badge>
                      </div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-seek-2">
                        78% success rate
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="text-center py-seek-8 text-sm text-muted-foreground font-semibold">
                  Шүүлтүүрт тохирох асуулт олдсонгүй.
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: QUESTION PREVIEW */}
          <div className="border-l border-border/40 p-seek-4 overflow-y-auto space-y-seek-4 bg-surface flex flex-col justify-between">
            {activeQuestion ? (
              <div className="space-y-seek-4">
                <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Question Preview</Text>
                <div>
                  <Text className="font-bold text-xs leading-relaxed text-foreground">
                    {activeQuestion.body || (activeQuestion as any).stem}
                  </Text>
                </div>

                {/* Choices (Mock choices wrapper) */}
                <div className="space-y-2 pt-seek-2">
                  {[
                    { key: "A", text: "Mitochondria" },
                    { key: "B", text: "Golgi Apparatus" },
                    { key: "C", text: "Ribosomes", correct: true },
                    { key: "D", text: "Lysosome" },
                  ].map((choice) => (
                    <div
                      key={choice.key}
                      className={`p-seek-3 rounded-seek-md border text-xs font-semibold flex items-center gap-2 ${
                        choice.correct
                          ? "border-success bg-success-background text-success"
                          : "border-border hover:bg-muted-background/5"
                      }`}
                    >
                      <span className="font-bold text-muted-foreground">{choice.key}</span>
                      <span>{choice.text} {choice.correct && "(Correct)"}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-seek-3 space-y-2">
                  <Text className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Explanation</Text>
                  <Text variant="muted" className="text-[10px] leading-relaxed">
                    Ribosomes are macromolecular machines found within all living cells that perform biological protein synthesis.
                  </Text>
                </div>

                <div className="border-t border-border/40 pt-seek-3 space-y-2 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Difficulty Level</span>
                    <span className="text-foreground capitalize">{activeQuestion.difficulty ?? "Medium"}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span className="text-muted-foreground">Total Points</span>
                    <span className="text-foreground">{(activeQuestion as any).points ?? activeQuestion.defaultMaxScore ?? 0} Points</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-seek-8 text-xs text-muted-foreground">
                Асуулт сонгож урьдчилан харна уу.
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-border/40 px-seek-5 py-seek-4 flex items-center justify-between bg-surface">
          <div className="text-xs font-bold text-foreground">
            {selected.length} questions selected · <span className="text-primary">{totalPoints} Total Points</span>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="button" size="sm" onClick={() => onApply(selected)}>
              Add Selected Questions ({selected.length})
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
