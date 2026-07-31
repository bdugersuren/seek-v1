"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
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
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import { QuestionRichEditor } from "./editor/QuestionRichEditor";
import {
  bloomLabels,
  competencyLabels,
  difficultyLabels,
  mockQuestionBank,
  questionTypeLabels,
  statusLabels,
} from "./mock-data";
import type {
  BloomLevel,
  CompetencyType,
  DifficultyLevel,
  QuestionBankItem,
  QuestionOption,
  QuestionTopicMapping,
  QuestionType,
} from "./types";

type WizardStep = 1 | 2 | 3;

interface EditorOption {
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
  score: number;
}

interface QuestionWizardState {
  title: string;
  code: string;
  type: QuestionType;
  stem: string;
  options: EditorOption[];
  feedbackCorrect: string;
  feedbackIncorrect: string;
  scoringMode: string;
  totalPoints: number;
  correctPoints: number;
  durationSeconds: number;
  tags: string[];
  mappings: QuestionTopicMapping[];
  workflowComment: string;
  status: QuestionBankItem["status"];
}

interface TopicNode {
  id: string;
  label: string;
  children?: TopicNode[];
}

const wizardSteps: Array<{ id: WizardStep; title: string; subtitle: string }> = [
  { id: 1, title: "Даалгавар үүсгэх", subtitle: "Асуулт, хариулт, оноо" },
  { id: 2, title: "Ангилал тохируулах", subtitle: "Сэдэв ба түвшин" },
  { id: 3, title: "Батлуулах хүсэлт", subtitle: "Шалгах ба илгээх" },
];

const topicNodes: TopicNode[] = [
  {
    id: "math",
    label: "Математик",
    children: [
      { id: "fractions", label: "Энгийн бутархай" },
      { id: "algebra", label: "Шугаман алгебр" },
      { id: "equation", label: "Тэгшитгэл" },
    ],
  },
  {
    id: "soft-skills",
    label: "Зөөлөн ур чадвар",
    children: [
      { id: "communication", label: "Харилцааны ур чадвар" },
      { id: "leadership", label: "Манлайлал" },
    ],
  },
  {
    id: "digital",
    label: "Дижитал чадвар",
    children: [{ id: "cyber", label: "Кибер аюулгүй байдал" }],
  },
];

const questionTypeIcons: Record<QuestionType, string> = {
  single_choice: "☑",
  multiple_choice: "☷",
  matching: "↔",
  ordering: "◇",
  fill_blank: "▱",
  matrix: "▦",
  numeric: "#",
  likert: "◎",
  sjt: "◉",
  case_bundle: "▣",
  essay: "✎",
};

export function QuestionEditor({
  mode = "edit",
  questionCode,
}: {
  mode?: "new" | "edit";
  questionCode?: string;
}) {
  const { showToast } = useToast();
  const sourceQuestion = useMemo(
    () =>
      mockQuestionBank.find(
        (question) =>
          question.id.toLowerCase() === questionCode?.toLowerCase() ||
          question.code.toLowerCase() === questionCode?.toLowerCase(),
      ),
    [questionCode],
  );
  const [step, setStep] = useState<WizardStep>(1);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationTouched, setValidationTouched] = useState(false);
  const [state, setState] = useState<QuestionWizardState>(() =>
    buildInitialState(mode, sourceQuestion),
  );

  const validation = validateWizard(state);
  const preview = () => setPreviewQuestion(buildQuestionFromState(state, sourceQuestion));
  const setPartial = (patch: Partial<QuestionWizardState>) =>
    setState((current) => ({ ...current, ...patch }));

  const goNext = () => {
    if (step === 2 && state.mappings.length === 0) {
      setValidationTouched(true);
      showToast("Сэдвийн сангаас дор хаяж нэг дэд сэдэв сонгоно уу.", "warning");
      return;
    }
    setStep((current) => Math.min(3, current + 1) as WizardStep);
  };

  const saveDraft = () => {
    setSubmitted(false);
    showToast("Ноорог mock state-д хадгалагдлаа.", "success");
  };

  const requestApproval = () => {
    setValidationTouched(true);
    if (!validation.ready) {
      showToast("Батлуулахын өмнө checklist дээрх дутуу хэсгүүдийг гүйцээнэ үү.", "warning");
      return;
    }
    setSubmitted(true);
    setPartial({ status: mode === "edit" ? "resubmitted" : "approval_requested" });
    showToast(
      mode === "edit"
        ? "Дахин батлуулах хүсэлт mock workflow-д бүртгэгдлээ."
        : "Батлуулах хүсэлт mock workflow-д бүртгэгдлээ.",
      "success",
    );
  };

  return (
    <div className="min-h-screen bg-muted-background pb-24">
      <header className="sticky top-0 z-header border-b border-border bg-surface/95 px-seek-4 py-seek-3 backdrop-blur">
        <div className="flex flex-col gap-seek-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-seek-3">
            <Link
              href="/question-bank"
              className="grid h-11 w-11 place-items-center rounded-seek-md border border-border bg-surface shadow-seek-sm hover:bg-surface-hover"
              aria-label="Буцах"
            >
              <Icons.ChevronRight className="h-5 w-5 rotate-180" />
            </Link>
            <div>
              <Text className="text-2xl font-bold">
                {mode === "new" ? "Асуулт үүсгэх" : "Асуулт засах"}
              </Text>
              <Text variant="muted" className="text-sm">
                {sourceQuestion?.topicName ?? "Математик 6-р анги хичээл"}
              </Text>
            </div>
          </div>
          <StepIndicator current={step} onStepChange={setStep} />
          <Button type="button" variant="outline" size="sm" onClick={preview}>
            Урьдчилан харах
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-seek-4 py-seek-5">
        {step === 1 && (
          <StepOne
            state={state}
            setState={setPartial}
            updateOption={(index, patch) =>
              setState((current) => ({
                ...current,
                options: current.options.map((option, optionIndex) =>
                  optionIndex === index ? { ...option, ...patch } : option,
                ),
              }))
            }
            addOption={() =>
              setState((current) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    id: String.fromCharCode(97 + current.options.length),
                    label: String.fromCharCode(65 + current.options.length),
                    content: "",
                    isCorrect: false,
                    score: 0,
                  },
                ],
              }))
            }
            removeOption={(index) =>
              setState((current) => ({
                ...current,
                options: current.options.filter((_, optionIndex) => optionIndex !== index),
              }))
            }
          />
        )}

        {step === 2 && (
          <StepTwo
            mappings={state.mappings}
            setMappings={(mappings) => setPartial({ mappings })}
            validationTouched={validationTouched}
          />
        )}

        {step === 3 && (
          <StepThree
            state={state}
            validation={validation}
            mode={mode}
            submitted={submitted}
            onCommentChange={(workflowComment) => setPartial({ workflowComment })}
            onSave={saveDraft}
            onSubmit={requestApproval}
          />
        )}
      </div>

      <ActionRail onBack={() => setStep((current) => Math.max(1, current - 1) as WizardStep)} onPreview={preview} onSave={saveDraft} onDelete={() => showToast("Mock editor дээр soft delete action тэмдэглэгдлээ.", "info")} />

      <footer className="fixed inset-x-0 bottom-0 z-dropdown border-t border-border bg-surface/95 px-seek-4 py-seek-3 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-seek-3 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="muted" className="text-sm">
            Алхам {step}/3 · {wizardSteps[step - 1].title}
          </Text>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" disabled={step === 1} onClick={() => setStep((step - 1) as WizardStep)}>
              Буцах
            </Button>
            <Button type="button" variant="outline" onClick={saveDraft}>
              Хадгалах
            </Button>
            {step < 3 ? (
              <Button type="button" onClick={goNext}>
                Дараах
              </Button>
            ) : (
              <Button type="button" onClick={requestApproval}>
                {mode === "edit" ? "Дахин батлуулах" : "Батлуулах хүсэлт илгээх"}
              </Button>
            )}
          </div>
        </div>
      </footer>

      {previewQuestion && (
        <QuestionPreviewModal
          question={previewQuestion}
          onClose={() => setPreviewQuestion(null)}
        />
      )}
    </div>
  );
}

function StepIndicator({
  current,
  onStepChange,
}: {
  current: WizardStep;
  onStepChange: (step: WizardStep) => void;
}) {
  return (
    <div className="flex min-w-0 items-center justify-center">
      {wizardSteps.map((item, index) => {
        const active = current === item.id;
        const complete = current > item.id;
        return (
          <button
            key={item.id}
            type="button"
            className="grid min-w-28 grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-2 text-left"
            onClick={() => onStepChange(item.id)}
          >
            <span
              className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                active || complete
                  ? "bg-purple-600 text-white"
                  : "bg-slate-200 text-muted-foreground"
              }`}
            >
              {complete ? "✓" : item.id}
            </span>
            <span>
              <span className="block text-sm font-bold">{item.title}</span>
              <span className="block text-xs text-muted-foreground">{item.subtitle}</span>
            </span>
            {index < wizardSteps.length - 1 && (
              <span className="mx-seek-3 hidden h-0.5 w-14 bg-purple-200 xl:block" />
            )}
          </button>
        );
      })}
    </div>
  );
}

function StepOne({
  state,
  setState,
  updateOption,
  addOption,
  removeOption,
}: {
  state: QuestionWizardState;
  setState: (patch: Partial<QuestionWizardState>) => void;
  updateOption: (index: number, patch: Partial<EditorOption>) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
}) {
  return (
    <div className="grid gap-seek-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="space-y-seek-4 xl:sticky xl:top-28 xl:self-start">
        <Card className="p-seek-4">
          <CollapsibleTitle title="Оноо бодох & тохиргоо" />
          <div className="mt-seek-4 space-y-seek-4">
            <FieldLabel label="Оноо бодох хэлбэр">
              <Select
                value={state.scoringMode}
                onChange={(event) => setState({ scoringMode: event.target.value })}
                options={[
                  { value: "automatic", label: "автоматаар оноохоор" },
                  { value: "manual", label: "гараар шалгах" },
                  { value: "rubric", label: "rubric оноогоор" },
                ]}
              />
            </FieldLabel>
            <div className="grid grid-cols-2 gap-seek-3">
              <FieldLabel label="Түгт.">
                <Input
                  type="number"
                  value={state.totalPoints}
                  onChange={(event) => setState({ totalPoints: Number(event.target.value) })}
                />
              </FieldLabel>
              <FieldLabel label="Зөв">
                <Input
                  type="number"
                  value={state.correctPoints}
                  onChange={(event) => setState({ correctPoints: Number(event.target.value) })}
                />
              </FieldLabel>
            </div>
            <FieldLabel label="Хугацаа (сек)">
              <Input
                type="number"
                value={state.durationSeconds}
                onChange={(event) => setState({ durationSeconds: Number(event.target.value) })}
              />
            </FieldLabel>
            <div>
              <Text className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                Tag (шошго)
              </Text>
              <div className="mb-2 flex flex-wrap gap-2 rounded-seek-md bg-muted-background p-seek-2">
                {state.tags.map((tag) => (
                  <Badge key={tag} variant="success">
                    {tag} ×
                  </Badge>
                ))}
              </div>
              <Input placeholder="Шошго бичээд Enter дарна уу..." />
            </div>
          </div>
        </Card>
      </aside>

      <main className="space-y-seek-5">
        <Card className="p-seek-4">
          <div className="grid gap-seek-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {Object.entries(questionTypeLabels).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setState({ type: value as QuestionType })}
                className={`min-h-20 rounded-seek-lg border p-seek-3 text-center shadow-seek-sm ${
                  value === state.type
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-border bg-surface hover:bg-surface-hover"
                }`}
              >
                <span className="mx-auto grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                  {questionTypeIcons[value as QuestionType]}
                </span>
                <span className="mt-2 block text-xs font-bold">{label}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-seek-4">
          <FieldLabel label="Гарчиг">
            <Input
              value={state.title}
              onChange={(event) => setState({ title: event.target.value })}
              placeholder="Жишээ: Квадрат тэгшитгэлийн язгуур"
            />
          </FieldLabel>
        </Card>

        <Card className="p-seek-4">
          <SectionHeader title="Question" subtitle="Raw markdown болон LaTeX бичнэ." />
          <QuestionRichEditor
            label="Question"
            initialContent={state.stem}
            minHeight="8rem"
            onChange={(value) => setState({ stem: value.markdown })}
          />
        </Card>

        <Card className="p-seek-4">
          <div className="mb-seek-4 flex items-center justify-between">
            <SectionHeader
              title="Answers"
              subtitle="Нэг зөв хариулт эсвэл сонголт бүрт оноо тогтооно."
            />
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              + Сонголт нэмэх
            </Button>
          </div>
          <div className="space-y-seek-4">
            {state.options.map((option, index) => (
              <div
                key={`${option.id}-${index}`}
                className="rounded-seek-lg border border-border bg-surface p-seek-4"
              >
                <div className="mb-seek-3 flex flex-wrap items-center justify-between gap-seek-3">
                  <Badge variant={option.isCorrect ? "success" : "secondary"}>
                    {option.label}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={option.isCorrect}
                        onChange={(event) => updateOption(index, { isCorrect: event.target.checked })}
                      />
                      Зөв
                    </label>
                    <span className="text-sm font-semibold">Оноо:</span>
                    <Input
                      className="w-20"
                      type="number"
                      value={option.score}
                      onChange={(event) => updateOption(index, { score: Number(event.target.value) })}
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      ×
                    </Button>
                  </div>
                </div>
                <QuestionRichEditor
                  label={`Хариулт ${option.label}`}
                  initialContent={option.content}
                  minHeight="4rem"
                  onChange={(value) => updateOption(index, { content: value.markdown })}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-seek-4">
          <SectionHeader title="Feedback" subtitle="Зөв болон буруу хариултын тайлбар." />
          <div className="space-y-seek-4">
            <QuestionRichEditor
              label="Feedback: correctly answered"
              initialContent={state.feedbackCorrect}
              minHeight="5rem"
              onChange={(value) => setState({ feedbackCorrect: value.markdown })}
            />
            <QuestionRichEditor
              label="Feedback: incorrectly answered"
              initialContent={state.feedbackIncorrect}
              minHeight="5rem"
              onChange={(value) => setState({ feedbackIncorrect: value.markdown })}
            />
          </div>
        </Card>
      </main>
    </div>
  );
}

function StepTwo({
  mappings,
  setMappings,
  validationTouched,
}: {
  mappings: QuestionTopicMapping[];
  setMappings: (mappings: QuestionTopicMapping[]) => void;
  validationTouched: boolean;
}) {
  const selectedIds = mappings.map((mapping) => mapping.topicId);

  const toggleTopic = (topic: { id: string; label: string }) => {
    if (selectedIds.includes(topic.id)) {
      setMappings(mappings.filter((mapping) => mapping.topicId !== topic.id));
      return;
    }
    setMappings([
      ...mappings,
      {
        topicId: topic.id,
        topicName: topic.label,
        bloomLevel: "apply",
        competencyType: "knowledge",
        difficulty: "medium",
        weight: 1,
      },
    ]);
  };

  const updateMapping = (topicId: string, patch: Partial<QuestionTopicMapping>) =>
    setMappings(
      mappings.map((mapping) =>
        mapping.topicId === topicId ? { ...mapping, ...patch } : mapping,
      ),
    );

  return (
    <div className="grid gap-seek-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
      <Card className="p-seek-4 xl:sticky xl:top-28 xl:self-start">
        <Text className="font-bold">Сэдвийн сан</Text>
        <Text variant="muted" className="mt-1 text-sm">
          Дэд сэдэв бүрийг checkbox-оор сонгоно.
        </Text>
        <div className="mt-seek-4 space-y-seek-3">
          <TopicTree nodes={topicNodes} selectedIds={selectedIds} onToggle={toggleTopic} />
        </div>
        {validationTouched && mappings.length === 0 && (
          <Text className="mt-seek-3 text-sm font-semibold text-danger">
            Дор хаяж нэг дэд сэдэв сонгоно уу.
          </Text>
        )}
      </Card>

      <main className="space-y-seek-4">
        <Card className="p-seek-4">
          <SectionHeader
            title="Сонгосон дэд сэдвийн mapping"
            subtitle="Нэг асуулт олон дэд сэдэвтэй, өөр өөр Bloom/чадамж/түвшинтэй холбогдож болно."
          />
          {mappings.length === 0 ? (
            <div className="rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
              <Text className="font-semibold">Сэдэв сонгоогүй байна</Text>
              <Text variant="muted" className="mt-1 text-sm">
                Зүүн талын сэдвийн сангаас дэд сэдэв сонгоход энд тохиргоо гарна.
              </Text>
            </div>
          ) : (
            <div className="space-y-seek-3">
              {mappings.map((mapping) => (
                <div
                  key={mapping.topicId}
                  className="grid gap-seek-3 rounded-seek-lg border border-border bg-surface p-seek-4 lg:grid-cols-[1fr_11rem_12rem_10rem_7rem]"
                >
                  <div>
                    <Text className="font-bold">{mapping.topicName}</Text>
                    <Text variant="muted" className="text-xs">
                      {mapping.topicId}
                    </Text>
                  </div>
                  <Select
                    value={mapping.bloomLevel}
                    onChange={(event) =>
                      updateMapping(mapping.topicId, {
                        bloomLevel: event.target.value as BloomLevel,
                      })
                    }
                    options={Object.entries(bloomLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                  <Select
                    value={mapping.competencyType}
                    onChange={(event) =>
                      updateMapping(mapping.topicId, {
                        competencyType: event.target.value as CompetencyType,
                      })
                    }
                    options={Object.entries(competencyLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                  <Select
                    value={mapping.difficulty}
                    onChange={(event) =>
                      updateMapping(mapping.topicId, {
                        difficulty: event.target.value as DifficultyLevel,
                      })
                    }
                    options={Object.entries(difficultyLabels).map(([value, label]) => ({
                      value,
                      label,
                    }))}
                  />
                  <Input
                    type="number"
                    min={1}
                    value={mapping.weight}
                    aria-label={`${mapping.topicName} weight`}
                    onChange={(event) =>
                      updateMapping(mapping.topicId, {
                        weight: Number(event.target.value),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}

function StepThree({
  state,
  validation,
  mode,
  submitted,
  onCommentChange,
  onSave,
  onSubmit,
}: {
  state: QuestionWizardState;
  validation: ReturnType<typeof validateWizard>;
  mode: "new" | "edit";
  submitted: boolean;
  onCommentChange: (comment: string) => void;
  onSave: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-seek-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <main className="space-y-seek-4">
        <Card className="p-seek-5">
          <SectionHeader
            title="Батлуулах хүсэлтийн тойм"
            subtitle="Илгээхийн өмнө үндсэн мэдээлэл болон чанарын checklist-ийг шалгана."
          />
          <div className="grid gap-seek-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryTile label="Гарчиг" value={state.title || "Нэргүй"} />
            <SummaryTile label="Төрөл" value={questionTypeLabels[state.type]} />
            <SummaryTile label="Оноо/хугацаа" value={`${state.totalPoints} оноо · ${state.durationSeconds} сек`} />
            <SummaryTile label="Сэдэв" value={`${state.mappings.length} mapping`} />
          </div>
        </Card>

        <Card className="p-seek-5">
          <Text className="mb-seek-3 font-bold">Validation checklist</Text>
          <div className="space-y-2">
            {validation.items.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-seek-md border p-seek-3 ${
                  item.ok ? "border-success bg-success-background" : "border-warning bg-warning-background"
                }`}
              >
                <Text className="font-semibold">{item.label}</Text>
                <Badge variant={item.ok ? "success" : "warning"}>
                  {item.ok ? "OK" : "Дутуу"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-seek-5">
          <Text className="mb-seek-2 font-bold">Workflow comment</Text>
          <Textarea
            rows={5}
            value={state.workflowComment}
            onChange={(event) => onCommentChange(event.target.value)}
            placeholder="Батлуулах хүсэлтийн тайлбар бичнэ..."
          />
          <div className="mt-seek-4 flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={onSave}>
              Ноорог хадгалах
            </Button>
            <Button type="button" onClick={onSubmit}>
              {mode === "edit" ? "Дахин батлуулах хүсэлт" : "Батлуулах хүсэлт илгээх"}
            </Button>
            {mode === "edit" && (
              <Button type="button" variant="secondary">
                Архивлах
              </Button>
            )}
          </div>
        </Card>
      </main>

      <aside className="space-y-seek-4 xl:sticky xl:top-28 xl:self-start">
        <Card className="bg-gradient-to-br from-purple-700 to-primary p-seek-5 text-white">
          <Text className="font-bold">Workflow төлөв</Text>
          <Text className="mt-2 text-3xl font-bold">
            {submitted ? "Илгээгдсэн" : statusLabels[state.status]}
          </Text>
          <Text className="mt-2 text-sm opacity-90">
            {submitted
              ? "Mock workflow history-д хүсэлт бүртгэгдсэн."
              : "Checklist бүрэн бол батлуулах хүсэлт илгээж болно."}
          </Text>
        </Card>
        <Card className="p-seek-4">
          <Text className="mb-2 font-bold">Сэдвийн mapping</Text>
          <div className="space-y-2">
            {state.mappings.map((mapping) => (
              <div key={mapping.topicId} className="rounded-seek-md bg-muted-background p-seek-3">
                <Text className="font-semibold">{mapping.topicName}</Text>
                <Text variant="muted" className="text-xs">
                  {bloomLabels[mapping.bloomLevel]} · {competencyLabels[mapping.competencyType]} · {difficultyLabels[mapping.difficulty]}
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </aside>
    </div>
  );
}

function TopicTree({
  nodes,
  selectedIds,
  onToggle,
}: {
  nodes: TopicNode[];
  selectedIds: string[];
  onToggle: (topic: { id: string; label: string }) => void;
}) {
  return (
    <div className="space-y-2">
      {nodes.map((node) => (
        <div key={node.id}>
          <div className="rounded-seek-md bg-muted-background px-seek-3 py-seek-2 text-sm font-bold">
            {node.label}
          </div>
          <div className="ml-seek-4 mt-2 space-y-2">
            {node.children?.map((child) => (
              <label key={child.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selectedIds.includes(child.id)}
                  onChange={() => onToggle(child)}
                />
                {child.label}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionRail({
  onBack,
  onPreview,
  onSave,
  onDelete,
}: {
  onBack: () => void;
  onPreview: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="fixed right-seek-4 top-1/2 z-dropdown hidden -translate-y-1/2 rounded-seek-full border border-border bg-surface p-2 shadow-seek-lg xl:grid xl:gap-2">
      <RailButton label="Буцах" onClick={onBack}>←</RailButton>
      <RailButton label="Preview" onClick={onPreview}>◎</RailButton>
      <RailButton label="Raw edit" onClick={onPreview}>✎</RailButton>
      <RailButton label="Save" onClick={onSave}>▣</RailButton>
      <RailButton label="Delete" danger onClick={onDelete}>⌫</RailButton>
    </div>
  );
}

function RailButton({
  label,
  danger,
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-full border border-border ${
        danger ? "text-danger hover:bg-danger-background" : "text-primary hover:bg-primary/10"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function buildInitialState(mode: "new" | "edit", source?: QuestionBankItem): QuestionWizardState {
  const question = mode === "edit" ? source ?? mockQuestionBank.find((item) => item.code === "MX-58") : undefined;
  const options = question?.options.length
    ? question.options.map((option) => ({
        id: option.id,
        label: option.label,
        content: option.content,
        isCorrect: Boolean(option.isCorrect),
        score: option.score ?? (option.isCorrect ? question.points : 0),
      }))
    : [
        { id: "a", label: "A", content: "x = 2", isCorrect: true, score: 1 },
        { id: "b", label: "B", content: "x = 3", isCorrect: true, score: 1 },
        { id: "c", label: "C", content: "x = 1", isCorrect: false, score: 0 },
        { id: "d", label: "D", content: "x = 6", isCorrect: false, score: 0 },
      ];

  return {
    title: question?.title ?? "Квадрат тэгшитгэлийн язгуур",
    code: question?.code ?? "NEW-001",
    type: question?.type ?? "multiple_choice",
    stem: question?.stem ?? "Дараах тэгшитгэлийн язгууруудыг олно уу: $$x^2 - 5x + 6 = 0$$",
    options,
    feedbackCorrect:
      question?.feedback ??
      "Виетийн теоремоор үржвэр нь 6, нийлбэр нь 5 байх тоонууд нь 2 ба 3 юм.",
    feedbackIncorrect: "Буруу хариулсан үед язгуурын нийлбэр ба үржвэрийг дахин шалгана.",
    scoringMode: "automatic",
    totalPoints: question?.points ?? 3,
    correctPoints: question?.points ?? 1,
    durationSeconds: question?.durationSeconds ?? 60,
    tags: question?.tags ?? ["мат", "комбинаторик"],
    mappings:
      question?.topicMappings ??
      [
        {
          topicId: question?.topicId ?? "algebra",
          topicName: question?.topicName ?? "Шугаман алгебр",
          bloomLevel: question?.bloomLevel ?? "apply",
          competencyType: question?.competencyType ?? "knowledge",
          difficulty: question?.difficulty ?? "medium",
          weight: 1,
        },
      ],
    workflowComment: "",
    status: question?.status ?? "draft",
  };
}

function buildQuestionFromState(state: QuestionWizardState, source?: QuestionBankItem): QuestionBankItem {
  const primaryMapping = state.mappings[0];
  const options: QuestionOption[] = state.options.map((option) => ({
    id: option.id,
    label: option.label,
    content: option.content,
    isCorrect: option.isCorrect,
    score: option.score,
  }));

  return {
    id: source?.id ?? "preview-question",
    code: state.code,
    title: state.title,
    stem: state.stem,
    type: state.type,
    status: state.status,
    points: state.totalPoints,
    durationSeconds: state.durationSeconds,
    bloomLevel: primaryMapping?.bloomLevel ?? "apply",
    competencyType: primaryMapping?.competencyType ?? "knowledge",
    topicId: primaryMapping?.topicId ?? "unmapped",
    topicName: primaryMapping?.topicName ?? "Ангилаагүй",
    topicMappings: state.mappings,
    difficulty: primaryMapping?.difficulty ?? "medium",
    tags: state.tags,
    options,
    answerKey: options.filter((option) => option.isCorrect).map((option) => option.label).join(", ") || "-",
    rubric: "Wizard prototype rubric",
    feedback: state.feedbackCorrect,
    media: source?.media ?? [],
    createdBy: source?.createdBy ?? "Ассессор Б.",
    updatedBy: "Ассессор Б.",
    createdAt: source?.createdAt ?? "2026-07-31 10:00",
    updatedAt: "2026-07-31 10:00",
    workflowHistory: [
      ...(source?.workflowHistory ?? []),
      ...(state.workflowComment
        ? [
            {
              id: "wizard-comment",
              status: state.status,
              comment: state.workflowComment,
              actorId: "mock-assessor",
              actorName: "Ассессор Б.",
              actorRole: "Assessor",
              createdAt: "2026-07-31 10:00",
            },
          ]
        : []),
    ],
  };
}

function validateWizard(state: QuestionWizardState) {
  const items = [
    { label: "Асуултын гарчиг бөглөгдсөн", ok: state.title.trim().length > 0 },
    { label: "Асуултын агуулга бөглөгдсөн", ok: state.stem.trim().length > 0 },
    {
      label: "Зөв хариулт болон оноо тохирсон",
      ok: state.options.some((option) => option.isCorrect && option.score > 0),
    },
    { label: "Сэдвийн mapping сонгосон", ok: state.mappings.length > 0 },
    { label: "Feedback бөглөгдсөн", ok: state.feedbackCorrect.trim().length > 0 },
    { label: "Workflow comment бичсэн", ok: state.workflowComment.trim().length > 0 },
  ];
  return { items, ready: items.every((item) => item.ok) };
}

function FieldLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <Text className="mb-1 text-xs font-bold uppercase text-muted-foreground">
        {label}
      </Text>
      {children}
    </label>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <Text className="font-semibold">{title}</Text>
      <Text variant="muted" className="text-sm">
        {subtitle}
      </Text>
    </div>
  );
}

function CollapsibleTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <Text className="text-sm font-bold uppercase text-muted-foreground">{title}</Text>
      <Icons.ChevronRight className="h-4 w-4 rotate-90 text-muted-foreground" />
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-seek-lg border border-border bg-muted-background p-seek-4">
      <Text variant="muted" className="text-xs uppercase">
        {label}
      </Text>
      <Text className="mt-1 font-bold">{value}</Text>
    </div>
  );
}
