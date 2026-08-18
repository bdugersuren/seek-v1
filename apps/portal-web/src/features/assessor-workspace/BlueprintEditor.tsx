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
} from "./api";
import {
  competencyLabels,
  difficultyLabels,
  mockBlueprints,
  mockQuestionBank,
  questionTypeLabels,
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

type WizardStep = 1 | 2 | 3 | 4;

interface TopicTreeNode {
  id: string;
  label: string;
  children?: TopicTreeNode[];
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
  sections: BlueprintSection[];
  reviewComment: string;
}

const defaultBlueprint = mockBlueprints[0];
const steps: Array<{ id: WizardStep; title: string; subtitle: string }> = [
  { id: 1, title: "Ерөнхий мэдээлэл", subtitle: "Нэр, pass score" },
  { id: 2, title: "Ангилал", subtitle: "Сэдэв ба focus" },
  { id: 3, title: "Section & pool", subtitle: "n pool, m pick" },
  { id: 4, title: "Батлуулах", subtitle: "Checklist" },
];

const strategyLabels: Record<BlueprintSelectionStrategy, string> = {
  random: "Санамсаргүй",
  least_used: "Ашиглаагүй асуулт",
  difficulty_balanced: "Хүндрэлийн тэнцвэр",
  adaptive_ai: "Адаптив AI",
};

const blueprintTopicTree: TopicTreeNode[] = [
  {
    id: "quiz",
    label: "quiz",
    children: [
      {
        id: "general-knowledge",
        label: "Ерөнхий мэдлэг",
        children: [
          { id: "governance", label: "Засаглалын бүтэц" },
          { id: "constitution", label: "Монгол Улсын Үндсэн хууль" },
          { id: "socio-economic", label: "Нийгэм-эдийн засаг, дэлхийн шинжилгээ" },
          { id: "international-relations", label: "Олон улсын харилцаа" },
          { id: "civil-service-law", label: "Төрийн албаны тухай хууль" },
        ],
      },
      {
        id: "digital-foundation",
        label: "Мэдээллийн технологийн үндсэн чадвар",
        children: [
          { id: "computer-use", label: "Компьютерийн хэрэглээ" },
          { id: "cyber", label: "Мэдээллийн аюулгүй байдал, цахим орчны соёл" },
          { id: "office", label: "Оффис программ" },
        ],
      },
      {
        id: "cognitive",
        label: "Танин мэдэхүй",
        children: [
          { id: "analytics", label: "Аналитик сэтгэлгээ" },
          { id: "logic", label: "Логик сэтгэлгээ" },
          { id: "math-basic", label: "Математик үндэс" },
          { id: "calculation", label: "Тооцоо, дүгнэлт" },
        ],
      },
      {
        id: "personal-behaviour",
        label: "Хувь хүний зан төлөв",
        children: [
          { id: "ethics", label: "Ёс зүй" },
          { id: "communication", label: "Харилцааны ур чадвар" },
          { id: "leadership", label: "Манлайлал" },
        ],
      },
      {
        id: "math",
        label: "Математик",
        children: [
          { id: "fractions", label: "Энгийн бутархай" },
          { id: "algebra", label: "Шугаман алгебр" },
        ],
      },
    ],
  },
];

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
  const [step, setStep] = useState<WizardStep>(1);
  const [submitted, setSubmitted] = useState(false);
  const [poolSectionId, setPoolSectionId] = useState<string | null>(null);

  const activeContextId = contextId || blueprint.assessmentContextId;

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

  const dynamicTopicTree = useMemo(() => {
    if (!rawTopics || rawTopics.length === 0) return [];
    const nodesMap: Record<string, TopicTreeNode> = {};
    const roots: TopicTreeNode[] = [];

    rawTopics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.title || t.name,
        children: [],
      };
    });

    rawTopics.forEach((t) => {
      const node = nodesMap[t.id];
      if (t.parentId && nodesMap[t.parentId]) {
        nodesMap[t.parentId].children = nodesMap[t.parentId].children || [];
        nodesMap[t.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [rawTopics]);

  const finalTopicTree = activeContextId && dynamicTopicTree.length > 0 ? dynamicTopicTree : blueprintTopicTree;

  const [state, setState] = useState<BlueprintWizardState>(() =>
    buildInitialState(mode, blueprint),
  );
  const validation = validateBlueprint(state);

  const setPartial = (patch: Partial<BlueprintWizardState>) =>
    setState((current) => ({ ...current, ...patch }));

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
      showToast("Blueprint амжилттай хадгалагдлаа.", "success");
      if (activeContextId) {
        router.push(`/assessor/context/${activeContextId}/blueprints`);
      } else {
        router.push("/assessor/blueprints");
      }
    } catch (err: any) {
      showToast("Blueprint хадгалахад алдаа гарлаа.", "danger");
    }
  };

  const submit = async () => {
    if (!validation.ready) {
      showToast("Батлуулахын өмнө checklist дээрх дутуу хэсгүүдийг гүйцээнэ үү.", "warning");
      return;
    }
    try {
      setSubmitted(true);
      const bpData: Blueprint = {
        id: state.id,
        title: state.title,
        description: state.description,
        topicId: state.topicId,
        topicName: state.topicName,
        passScore: state.passScore,
        totalDurationMinutes: state.totalDurationMinutes,
        status: "ready",
        assessmentContextId: activeContextId,
        sections: state.sections,
        updatedAt: new Date().toISOString(),
      };

      if (mode === "edit") {
        await updateBlueprint(bpData.id, bpData);
      } else {
        await createBlueprint(bpData);
      }
      showToast("Батлуулахаар амжилттай илгээлээ.", "success");
      if (activeContextId) {
        router.push(`/assessor/context/${activeContextId}/blueprints`);
      } else {
        router.push("/assessor/blueprints");
      }
    } catch (err: any) {
      showToast("Илгээхэд алдаа гарлаа.", "danger");
    }
  };

  return (
    <div className="min-h-screen bg-muted-background pb-24">
      <header className="sticky top-0 z-header border-b border-border bg-surface/95 px-seek-4 py-seek-3 backdrop-blur">
        <div className="flex flex-col gap-seek-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-seek-3">
            <Link
              href={activeContextId ? `/assessor/context/${activeContextId}/blueprints` : "/assessor/blueprints"}
              className="grid h-11 w-11 place-items-center rounded-seek-md border border-border bg-surface shadow-seek-sm hover:bg-surface-hover"
              aria-label="Буцах"
            >
              <Icons.ChevronRight className="h-5 w-5 rotate-180" />
            </Link>
            <div>
              <Text className="text-2xl font-bold">
                {mode === "new" ? "БЛЮПРИНТ ҮҮСГЭХ" : "БЛЮПРИНТ"}
              </Text>
              <Text variant="muted" className="text-sm">
                Математик 6-р анги хичээл
              </Text>
            </div>
          </div>
          <StepIndicator current={step} onStepChange={setStep} />
          <Button type="button" variant="outline" size="sm" onClick={save}>
            Хадгалах
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-seek-5 px-seek-4 py-seek-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
        <BlueprintTemplateAside state={state} validationReady={validation.ready} submitted={submitted} />
        <main className="space-y-seek-4">
          {step === 1 && <GeneralStep state={state} setState={setPartial} />}
          {step === 2 && (
            <ClassificationStep
              mappings={state.topicMappings}
              setMappings={(topicMappings) => setPartial({ topicMappings })}
              topicTree={finalTopicTree}
            />
          )}
          {step === 3 && (
            <SectionsStep
              sections={state.sections}
              questions={questions}
              setSections={(sections) => setPartial({ sections })}
              openPool={(sectionId) => setPoolSectionId(sectionId)}
            />
          )}
          {step === 4 && (
            <ApprovalStep
              state={state}
              validation={validation}
              submitted={submitted}
              mode={mode}
              setComment={(reviewComment) => setPartial({ reviewComment })}
              onSave={save}
              onSubmit={submit}
            />
          )}
        </main>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-dropdown border-t border-border bg-surface/95 px-seek-4 py-seek-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="muted" className="text-sm">
            Алхам {step}/4 · {steps[step - 1].title}
          </Text>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled={step === 1} onClick={() => setStep((step - 1) as WizardStep)}>
              Буцах
            </Button>
            <Button type="button" variant="outline" onClick={save}>
              Хадгалах
            </Button>
            {step < 4 ? (
              <Button type="button" onClick={() => setStep((step + 1) as WizardStep)}>
                Дараах
              </Button>
            ) : (
              <Button type="button" onClick={submit}>
                {mode === "edit" ? "Дахин батлуулах" : "Батлуулах хүсэлт илгээх"}
              </Button>
            )}
          </div>
        </div>
      </footer>

      {poolSectionId && (
        <QuestionPoolModal
          section={state.sections.find((section) => section.id === poolSectionId)!}
          questions={questions}
          onClose={() => setPoolSectionId(null)}
          onApply={(selectedQuestionIds) =>
            setPartial({
              sections: state.sections.map((section) =>
                section.id === poolSectionId ? { ...section, selectedQuestionIds } : section,
              ),
            })
          }
        />
      )}
    </div>
  );
}

function GeneralStep({
  state,
  setState,
}: {
  state: BlueprintWizardState;
  setState: (patch: Partial<BlueprintWizardState>) => void;
}) {
  return (
    <Card className="p-seek-5">
      <SectionHeader title="Ерөнхий мэдээлэл" subtitle="Blueprint-ийн нэр, хугацаа, тэнцэх хувь болон тайлбар." />
      <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-2">
        <FieldLabel label="Blueprint нэр">
          <Input value={state.title} onChange={(event) => setState({ title: event.target.value })} />
        </FieldLabel>
        <FieldLabel label="Нийт хугацаа (мин)">
          <Input type="number" value={state.totalDurationMinutes} onChange={(event) => setState({ totalDurationMinutes: Number(event.target.value) })} />
        </FieldLabel>
        <FieldLabel label="Тэнцэх оноо (%)">
          <Input type="number" value={state.passScore} onChange={(event) => setState({ passScore: Number(event.target.value) })} />
        </FieldLabel>
      </div>
      <FieldLabel label="Тайлбар">
        <Textarea className="mt-seek-3" rows={4} value={state.description} onChange={(event) => setState({ description: event.target.value })} />
      </FieldLabel>
    </Card>
  );
}

function ClassificationStep({
  mappings,
  setMappings,
  topicTree,
}: {
  mappings: BlueprintTopicMapping[];
  setMappings: (mappings: BlueprintTopicMapping[]) => void;
  topicTree: TopicTreeNode[];
}) {
  const [expandedTopics, setExpandedTopics] = useState<string[]>([
    "quiz",
    "general-knowledge",
    "digital-foundation",
    "cognitive",
    "personal-behaviour",
    "math",
  ]);
  const selected = mappings.map((mapping) => mapping.topicId);
  const toggleTopic = (topic: TopicTreeNode) => {
    if (topic.children?.length) {
      setExpandedTopics((current) =>
        current.includes(topic.id)
          ? current.filter((id) => id !== topic.id)
          : [...current, topic.id],
      );
      return;
    }
    if (selected.includes(topic.id)) {
      setMappings(mappings.filter((mapping) => mapping.topicId !== topic.id));
      return;
    }
    setMappings([
      ...mappings,
      {
        topicId: topic.id,
        topicName: topic.label,
        weight: 1,
        difficultyFocus: "medium",
        competencyFocus: "knowledge",
      },
    ]);
  };
  const update = (topicId: string, patch: Partial<BlueprintTopicMapping>) =>
    setMappings(mappings.map((mapping) => mapping.topicId === topicId ? { ...mapping, ...patch } : mapping));

  return (
    <div className="grid gap-seek-4 xl:grid-cols-[21rem_minmax(0,1fr)]">
      <Card className="overflow-hidden p-seek-4 xl:sticky xl:top-28 xl:self-start">
        <div className="flex items-center justify-between border-b border-border pb-seek-3">
          <div>
            <Text className="font-bold">Сэдвийн сан</Text>
            <Text variant="muted" className="text-xs">Folder tree-ээс leaf сэдэв сонгоно.</Text>
          </div>
          <Badge variant="secondary">{mappings.length}</Badge>
        </div>
        <TopicExplorerTree
          nodes={topicTree}
          selected={selected}
          expanded={expandedTopics}
          onToggle={toggleTopic}
        />
      </Card>
      <Card className="min-w-0 p-seek-4">
        <SectionHeader title="Blueprint topic mapping" subtitle="Сэдэв бүрийн priority, difficulty focus, competency focus тохируулна." />
        <div className="mt-seek-4 space-y-seek-3">
          {mappings.length === 0 && (
            <div className="rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
              <Text className="font-semibold">Сэдэв сонгоогүй байна</Text>
            </div>
          )}
          {mappings.map((mapping) => (
            <div key={mapping.topicId} className="min-w-0 rounded-seek-lg border border-border p-seek-4">
              <div className="mb-seek-3 flex min-w-0 flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                <Text className="font-bold">{mapping.topicName}</Text>
                <Text variant="muted" className="text-xs">{mapping.topicId}</Text>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setMappings(mappings.filter((item) => item.topicId !== mapping.topicId))}
                >
                  Хасах
                </Button>
              </div>
              <div className="grid min-w-0 gap-seek-3 md:grid-cols-3">
                <FieldLabel label="Priority / weight">
                  <Input
                    className="min-w-0"
                    type="number"
                    value={mapping.weight}
                    onChange={(event) => update(mapping.topicId, { weight: Number(event.target.value) })}
                  />
                </FieldLabel>
                <FieldLabel label="Difficulty focus">
                  <Select
                    className="min-w-0"
                    value={mapping.difficultyFocus}
                    onChange={(event) => update(mapping.topicId, { difficultyFocus: event.target.value as DifficultyLevel })}
                    options={Object.entries(difficultyLabels).map(([value, label]) => ({ value, label }))}
                  />
                </FieldLabel>
                <FieldLabel label="Competency focus">
                  <Select
                    className="min-w-0"
                    value={mapping.competencyFocus}
                    onChange={(event) => update(mapping.topicId, { competencyFocus: event.target.value as CompetencyType })}
                    options={Object.entries(competencyLabels).map(([value, label]) => ({ value, label }))}
                  />
                </FieldLabel>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function TopicExplorerTree({
  nodes,
  selected,
  expanded,
  onToggle,
  depth = 0,
}: {
  nodes: TopicTreeNode[];
  selected: string[];
  expanded: string[];
  onToggle: (topic: TopicTreeNode) => void;
  depth?: number;
}) {
  return (
    <div className={depth === 0 ? "mt-seek-3 space-y-1" : "space-y-1"}>
      {nodes.map((node) => {
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = expanded.includes(node.id);
        const isSelected = selected.includes(node.id);
        return (
          <div key={node.id}>
            <div
              className={`grid grid-cols-[1.25rem_1.25rem_minmax(0,1fr)] items-center gap-1 rounded-seek-sm px-2 py-1.5 text-sm hover:bg-surface-hover ${
                isSelected ? "bg-primary/10 text-primary" : ""
              }`}
              style={{ paddingLeft: `${depth * 16 + 8}px` }}
            >
              <button
                type="button"
                className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-muted-background"
                onClick={() => onToggle(node)}
                aria-label={hasChildren && isExpanded ? "Хураах" : "Дэлгэх"}
              >
                {hasChildren ? (
                  <Icons.ChevronRight className={`h-3.5 w-3.5 ${isExpanded ? "rotate-90" : ""}`} />
                ) : null}
              </button>
              <Checkbox
                checked={isSelected}
                disabled={hasChildren}
                onChange={() => onToggle(node)}
                aria-label={`${node.label} сонгох`}
              />
              <button
                type="button"
                className="flex min-w-0 items-center gap-2 text-left"
                onClick={() => onToggle(node)}
              >
                <span aria-hidden="true" className="shrink-0 text-amber-500">▣</span>
                <span className="truncate">{node.label}</span>
              </button>
            </div>
            {hasChildren && isExpanded && (
              <TopicExplorerTree
                nodes={node.children ?? []}
                selected={selected}
                expanded={expanded}
                onToggle={onToggle}
                depth={depth + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionsStep({
  sections,
  questions,
  setSections,
  openPool,
}: {
  sections: BlueprintSection[];
  questions: QuestionBankItem[];
  setSections: (sections: BlueprintSection[]) => void;
  openPool: (sectionId: string) => void;
}) {
  const [expandedIds, setExpandedIds] = useState<string[]>(
    sections[0] ? [sections[0].id] : [],
  );
  const updateSection = (sectionId: string, patch: Partial<BlueprintSection>) =>
    setSections(sections.map((section) => section.id === sectionId ? { ...section, ...patch } : section));
  const addSection = () =>
    setSections([
      ...sections,
      {
        id: `sec-${sections.length + 1}`,
        name: `${String.fromCharCode(65 + sections.length)}. Шинэ хэсэг`,
        description: "Шинэ section-ийн тайлбар.",
        selectedQuestionIds: [],
        randomPickCount: 1,
        pointsPerQuestion: 1,
        durationMinutes: 5,
        strategy: "random",
      },
    ]);
  const toggleExpanded = (sectionId: string) =>
    setExpandedIds((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId],
    );

  return (
    <div className="space-y-seek-4">
      <main className="space-y-seek-4">
        {sections.map((section) => {
          const valid = isBlueprintSectionValid(section);
          const expanded = expandedIds.includes(section.id);
          const selectedQuestions = questions.filter((question: QuestionBankItem) =>
            section.selectedQuestionIds.includes(question.id),
          );
          return (
            <Card key={section.id} className="overflow-hidden rounded-seek-xl shadow-seek-sm">
              <div className="space-y-seek-4 p-seek-4">
                <div className="flex flex-col gap-seek-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex min-w-0 items-start gap-seek-3">
                    <span className="mt-2 cursor-grab text-xl leading-none text-muted-foreground">⠿</span>
                    <div className="min-w-0">
                      <Input
                        className="h-10 w-full min-w-0 border-transparent bg-transparent px-0 text-base font-bold md:min-w-[18rem]"
                        value={section.name}
                        onChange={(event) =>
                          updateSection(section.id, { name: event.target.value })
                        }
                        aria-label="Section нэр"
                      />
                      <Badge variant={valid ? "success" : "danger"}>
                        ✓ Сан: {section.selectedQuestionIds.length}/{section.randomPickCount}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => openPool(section.id)}>
                      + Асуулт
                    </Button>
                    <Button type="button" size="sm" variant="danger" onClick={() => setSections(sections.filter((item) => item.id !== section.id))}>
                      Устгах
                    </Button>
                    <button
                      type="button"
                      className="grid h-10 w-10 place-items-center rounded-seek-md border border-border text-muted-foreground hover:bg-surface-hover"
                      onClick={() => toggleExpanded(section.id)}
                      aria-label={expanded ? "Section хураах" : "Section дэлгэх"}
                    >
                      <Icons.ChevronRight className={`h-4 w-4 ${expanded ? "rotate-90" : ""}`} />
                    </button>
                  </div>
                </div>
                <div className="grid gap-seek-3 sm:grid-cols-2 xl:grid-cols-[9rem_9rem_10rem_minmax(12rem,1fr)]">
                  <FieldLabel label="Max оноо">
                    <Input
                      className="h-10 text-sm"
                      type="number"
                      value={section.pointsPerQuestion}
                      onChange={(event) =>
                        updateSection(section.id, {
                          pointsPerQuestion: Number(event.target.value),
                        })
                      }
                    />
                  </FieldLabel>
                  <FieldLabel label="Min оноо">
                    <Input className="h-10 text-sm" type="number" value={-1} readOnly />
                  </FieldLabel>
                  <FieldLabel label="Асуултын тоо">
                    <Input
                      className="h-10 text-sm"
                      type="number"
                      value={section.randomPickCount}
                      onChange={(event) =>
                        updateSection(section.id, {
                          randomPickCount: Number(event.target.value),
                        })
                      }
                    />
                  </FieldLabel>
                  <FieldLabel label="Сонгох арга">
                    <Select
                      className="h-10 text-sm"
                      value={section.strategy}
                      onChange={(event) =>
                        updateSection(section.id, {
                          strategy: event.target.value as BlueprintSelectionStrategy,
                        })
                      }
                      options={(Object.keys(strategyLabels) as BlueprintSelectionStrategy[]).map(
                        (value) => ({ value, label: strategyLabels[value] }),
                      )}
                    />
                  </FieldLabel>
                </div>
              </div>
              {expanded && (
                <div className="space-y-3 border-t border-border bg-muted-background/40 p-seek-4">
                  {selectedQuestions.map((question: QuestionBankItem) => (
                    <div
                      key={question.id}
                      className="flex flex-col gap-seek-2 rounded-seek-lg border border-border bg-surface p-seek-3 shadow-seek-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <Text className="font-bold">
                          <span className="text-emerald-600">{question.code}</span> · {question.title}
                        </Text>
                        <Text variant="muted" className="text-xs">
                          Үндсэн оноо: {question.points}
                        </Text>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline">◎</Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            updateSection(section.id, {
                              selectedQuestionIds: section.selectedQuestionIds.filter(
                                (id) => id !== question.id,
                              ),
                            })
                          }
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                  {selectedQuestions.length === 0 && (
                    <div className="rounded-seek-lg border border-dashed border-border bg-surface p-seek-6 text-center">
                      <Text className="font-semibold">Асуулт сонгоогүй байна</Text>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
        <Card className="border-dashed p-seek-4">
          <Button type="button" variant="secondary" onClick={addSection}>+ Section нэмэх</Button>
        </Card>
      </main>
    </div>
  );
}

function ApprovalStep({
  state,
  validation,
  submitted,
  mode,
  setComment,
  onSave,
  onSubmit,
}: {
  state: BlueprintWizardState;
  validation: ReturnType<typeof validateBlueprint>;
  submitted: boolean;
  mode: "new" | "edit";
  setComment: (comment: string) => void;
  onSave: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="space-y-seek-4">
      <Card className="p-seek-5">
        <SectionHeader title="Батлуулах хүсэлтийн тойм" subtitle="Илгээхийн өмнө blueprint readiness шалгана." />
        <div className="mt-seek-4 grid gap-seek-3 md:grid-cols-4">
          <Metric label="Section" value={state.sections.length} />
          <Metric label="Pool" value={state.sections.reduce((sum, section) => sum + section.selectedQuestionIds.length, 0)} />
          <Metric label="Pick" value={state.sections.reduce((sum, section) => sum + section.randomPickCount, 0)} />
          <Metric label="Pass" value={`${state.passScore}%`} />
        </div>
      </Card>
      <Card className="p-seek-5">
        <Text className="mb-seek-3 font-bold">Readiness checklist</Text>
        <div className="grid gap-seek-2 md:grid-cols-2">
          {validation.items.map((item) => (
            <div key={item.label} className={`rounded-seek-md border p-seek-3 ${item.ok ? "border-success bg-success-background" : "border-warning bg-warning-background"}`}>
              <Text className="font-semibold">{item.ok ? "✓" : "!"} {item.label}</Text>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-seek-5">
        <Text className="mb-seek-2 font-bold">Workflow comment</Text>
        <Textarea rows={5} value={state.reviewComment} onChange={(event) => setComment(event.target.value)} placeholder="Батлуулах хүсэлтийн тайлбар бичнэ..." />
        <div className="mt-seek-4 flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={onSave}>Ноорог хадгалах</Button>
          <Button type="button" onClick={onSubmit}>{mode === "edit" ? "Дахин батлуулах" : "Батлуулах хүсэлт илгээх"}</Button>
          {mode === "edit" && <Button type="button" variant="secondary">Архивлах</Button>}
        </div>
        {submitted && <Badge className="mt-seek-4" variant="success">Mock workflow хүсэлт илгээгдсэн</Badge>}
      </Card>
    </div>
  );
}

function QuestionPoolModal({
  section,
  questions,
  onClose,
  onApply,
}: {
  section: BlueprintSection;
  questions: QuestionBankItem[];
  onClose: () => void;
  onApply: (selectedQuestionIds: string[]) => void;
}) {
  const [selected, setSelected] = useState(section.selectedQuestionIds);
  const [query, setQuery] = useState("");
  const available = questions.filter(
    (question: QuestionBankItem) =>
      (question.status === "approved" || question.status === "published" || question.status === "draft") &&
      (question.title.toLowerCase().includes(query.toLowerCase()) || question.code.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-black/45 p-seek-4">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-5">
        <div className="flex items-start justify-between gap-seek-4">
          <div>
            <Text className="text-xl font-bold">Question pool сонгох</Text>
            <Text variant="muted" className="text-sm">{section.name} · approved/published/draft даалгавар</Text>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose}>Хаах</Button>
        </div>
        <Input className="mt-seek-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Асуулт хайх..." />
        <div className="mt-seek-4 space-y-2">
          {available.map((question) => (
            <label key={question.id} className="grid gap-seek-3 rounded-seek-md border border-border p-seek-3 md:grid-cols-[auto_1fr_auto] md:items-center">
              <Checkbox checked={selected.includes(question.id)} onChange={() => setSelected((current) => current.includes(question.id) ? current.filter((id) => id !== question.id) : [...current, question.id])} />
              <div>
                <Text className="font-semibold">{question.code} · {question.title}</Text>
                <Text variant="muted" className="text-xs">{questionTypeLabels[question.type]} · {difficultyLabels[question.difficulty]} · {question.topicName}</Text>
              </div>
              <Badge variant="secondary">{question.points} оноо</Badge>
            </label>
          ))}
        </div>
        <div className="mt-seek-4 flex justify-end gap-2 border-t border-border pt-seek-4">
          <Button type="button" variant="secondary" onClick={onClose}>Болих</Button>
          <Button type="button" onClick={() => { onApply(selected); onClose(); }}>Сонголт хадгалах</Button>
        </div>
      </Card>
    </div>
  );
}

function BlueprintTemplateAside({
  state,
  validationReady,
  submitted,
}: {
  state: BlueprintWizardState;
  validationReady: boolean;
  submitted: boolean;
}) {
  const blueprint = buildBlueprint(state);
  const summary = getBlueprintSummary(blueprint);
  const firstSection = state.sections[0];
  const activePool = firstSection?.selectedQuestionIds.length ?? 0;
  const activeTotalSeconds = (firstSection?.durationMinutes ?? state.totalDurationMinutes) * 60;
  return (
    <aside className="space-y-seek-4 xl:sticky xl:top-28 xl:self-start">
      <Card className="p-seek-4">
        <CollapsibleTitle title="Загвар" />
        <div className="mt-seek-4 space-y-seek-4">
          <FieldLabel label="Асуулт сонгох">
            <Select
              value={firstSection?.strategy ?? "random"}
              disabled
              options={(Object.keys(strategyLabels) as BlueprintSelectionStrategy[]).map(
                (value) => ({ value, label: strategyLabels[value] }),
              )}
            />
          </FieldLabel>
          <div>
            <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">
              Нийт оноо
            </Text>
            <div className="grid grid-cols-2 gap-seek-3">
              <Metric label="Max" value={firstSection?.pointsPerQuestion ?? 0} />
              <Metric label="Min" value={-1} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-seek-2">
            <SideMetric label="Хугацаа (сек)" value={activeTotalSeconds} />
            <SideMetric label="Асуултын сан" value={activePool} />
            <SideMetric label="Тэнцэх хувь" value={`${state.passScore}%`} />
          </div>
          <div>
            <Text className="mb-2 text-xs font-bold uppercase text-muted-foreground">
              Харилцах
            </Text>
            <div className="grid grid-cols-2 gap-seek-3">
              <SideMetric label="Хэсгийн тоо" value={state.sections.length} />
              <SideMetric label="Асуултын тоо" value={summary.pickedQuestions} />
            </div>
          </div>
        </div>
      </Card>
      <Card className="p-seek-4">
        <Badge variant={validationReady ? "success" : "warning"}>
          {submitted ? "Хүсэлт илгээгдсэн" : validationReady ? "Загвар ашиглахад бэлэн" : "Validation дутуу"}
        </Badge>
        <Text variant="muted" className="mt-seek-3 text-sm">
          Quiz үүсгэх үйлдэл баталгаажсан blueprint дээр `/blueprints` жагсаалтаас хийгдэнэ.
        </Text>
      </Card>
    </aside>
  );
}

function StepIndicator({ current, onStepChange }: { current: WizardStep; onStepChange: (step: WizardStep) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-seek-3">
      {steps.map((item) => (
        <button key={item.id} type="button" className="flex items-center gap-2 text-left" onClick={() => onStepChange(item.id)}>
          <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${current >= item.id ? "bg-purple-600 text-white" : "bg-slate-200 text-muted-foreground"}`}>{current > item.id ? "✓" : item.id}</span>
          <span>
            <span className="block text-sm font-bold">{item.title}</span>
            <span className="block text-xs text-muted-foreground">{item.subtitle}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function buildInitialState(mode: "new" | "edit", blueprint: Blueprint): BlueprintWizardState {
  const source = mode === "new" ? defaultBlueprint : blueprint;
  return {
    id: mode === "new" ? "bp-new" : source.id,
    title: mode === "new" ? "Шинэ blueprint" : source.title,
    description: source.description,
    topicId: source.topicId,
    topicName: source.topicName,
    passScore: source.passScore,
    totalDurationMinutes: source.totalDurationMinutes,
    status: mode === "new" ? "draft" : source.status,
    topicMappings: source.topicMappings ?? [
      {
        topicId: source.topicId,
        topicName: source.topicName,
        weight: 1,
        difficultyFocus: "medium",
        competencyFocus: "knowledge",
      },
    ],
    sections: source.sections,
    reviewComment: source.reviewComment ?? "",
  };
}

function buildBlueprint(state: BlueprintWizardState): Blueprint {
  return {
    id: state.id,
    title: state.title,
    description: state.description,
    topicId: state.topicId,
    topicName: state.topicName,
    topicMappings: state.topicMappings,
    passScore: state.passScore,
    totalDurationMinutes: state.totalDurationMinutes,
    sections: state.sections,
    status: state.status,
    reviewComment: state.reviewComment,
    updatedAt: "2026-07-31 10:00",
  };
}

function validateBlueprint(state: BlueprintWizardState) {
  const items = [
    { label: "Blueprint нэр бөглөгдсөн", ok: state.title.trim().length > 0 },
    { label: "Ангилал сонгосон", ok: state.topicMappings.length > 0 },
    { label: "Дор хаяж нэг section байна", ok: state.sections.length > 0 },
    { label: "Section бүр дээр m <= n", ok: state.sections.every(isBlueprintSectionValid) },
    { label: "Pass score тохирсон", ok: state.passScore > 0 && state.passScore <= 100 },
    { label: "Workflow comment бичсэн", ok: state.reviewComment.trim().length > 0 },
  ];
  return { items, ready: items.every((item) => item.ok) };
}

function FieldLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">{label}</Text>
      {children}
    </label>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <Text className="font-semibold">{title}</Text>
      <Text variant="muted" className="text-sm">{subtitle}</Text>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-seek-md bg-muted-background p-seek-3">
      <Text variant="muted" className="text-xs">{label}</Text>
      <Text className="text-xl font-bold">{value}</Text>
    </div>
  );
}

function SideMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-seek-lg bg-slate-200 p-seek-3 text-center">
      <Text variant="muted" className="text-[0.65rem] font-bold uppercase">
        {label}
      </Text>
      <Text className="mt-1 text-lg font-bold text-emerald-600">{value}</Text>
    </div>
  );
}

function CollapsibleTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-seek-3">
      <Text className="text-sm font-bold uppercase text-emerald-600">▦ {title}</Text>
      <Icons.ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
    </div>
  );
}
