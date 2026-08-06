"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authFetch } from "@/lib/auth-client";
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
import { RichEditor } from "./editor/RichEditor";
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
import { createQuestion, updateQuestion, fetchTopics, fetchDifficultyLevels, fetchCognitiveLevels } from "./api";

type WizardStep = 1 | 2 | 3;

interface EditorOption {
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
  score: number;
  matchValue?: string;
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
  scoringConfig: Record<string, any>;
  totalPoints: number;
  correctPoints: number;
  durationSeconds: number;
  tags: string[];
  mappings: QuestionTopicMapping[];
  workflowComment: string;
  status: QuestionBankItem["status"];
  rubric?: any;
  media: any[];
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

const questionTypeIcons: Record<QuestionType, React.ComponentType<any>> = {
  SINGLE_CHOICE: Icons.SingleChoose,
  MULTIPLE_CHOICE: Icons.MultiChoose,
  TRUE_FALSE: Icons.TrueFalse,
  ORDERING: Icons.Ordering,
  MATCHING: Icons.Matching,
  SHORT_TEXT: Icons.ShortText,
  FILL_BLANK: Icons.FillBlank,
  MATRIX: Icons.Matrix,
  NUMERIC: Icons.Numeric,
  LIKERT: Icons.Likert,
  SJT: Icons.Sjt,
  CASE_BUNDLE: Icons.CaseBundle,
  ESSAY: Icons.Essay,
};

const scoringModeIcons: Record<string, React.ComponentType<any>> = {
  per_option: Icons.SingleChoose,
  combination: Icons.MultiChoose,
  position: Icons.Ordering,
  all_or_nothing: Icons.ListCheck,
  partial_per_pair: Icons.Matching,
  partial_per_blank: Icons.FillBlank,
  partial_per_cell: Icons.Matrix,
  manual: Icons.Eye,
};

const scoringModeLabels: Record<string, string> = {
  per_option: "Сонголтод харгалзах оноо",
  combination: "Хослолын оноо",
  position: "Зөв байршил бүрийн оноо",
  all_or_nothing: "Бүх байршил зөв бол оноо авна",
  partial_per_pair: "Зөв харгалзаа бүрийн оноо",
  partial_per_blank: "Нүд бүрийн оноо",
  partial_per_cell: "Тус бүрийн оноо",
  manual: "Гараар үнэлэх",
};

export function QuestionEditor({
  mode = "edit",
  questionCode,
  question,
}: {
  mode?: "new" | "edit";
  questionCode?: string;
  question?: QuestionBankItem;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const sourceQuestion = useMemo(() => {
    if (question) return question;
    return mockQuestionBank.find(
      (q) =>
        q.id.toLowerCase() === questionCode?.toLowerCase() ||
        q.code.toLowerCase() === questionCode?.toLowerCase(),
    );
  }, [question, questionCode]);
  const [step, setStep] = useState<WizardStep>(1);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationTouched, setValidationTouched] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [state, setState] = useState<QuestionWizardState>(() =>
    buildInitialState(mode, sourceQuestion),
  );

  const [topics, setTopics] = useState<any[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [cognitiveLevels, setCognitiveLevels] = useState<any[]>([]);
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  useEffect(() => {
    async function loadMetadata() {
      try {
        const [t, d, c] = await Promise.all([
          fetchTopics(),
          fetchDifficultyLevels(),
          fetchCognitiveLevels(),
        ]);
        setTopics(t);
        setDifficultyLevels(d);
        setCognitiveLevels(c);
      } catch (err) {
        console.error("Metadata load failed", err);
      } finally {
        setLoadingMetadata(false);
      }
    }
    loadMetadata();
  }, []);

  const validation = validateWizard(state);
  const preview = () => setPreviewQuestion(buildQuestionFromState(state, sourceQuestion));
  const setPartial = (patch: Partial<QuestionWizardState>) =>
    setState((current) => ({ ...current, ...patch }));

  useEffect(() => {
    if (state.scoringMode === "manual" && state.type !== "ESSAY") {
      return;
    }

    let maxScore = 0;
    let minScore = 0;

    switch (state.type) {
      case "SINGLE_CHOICE":
      case "TRUE_FALSE":
      case "SJT":
        maxScore = Math.max(...state.options.map(o => o.score), 0);
        minScore = Math.min(...state.options.map(o => o.score), 0);
        break;
      case "MULTIPLE_CHOICE":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.filter(o => o.score > 0).reduce((sum, o) => sum + o.score, 0);
          minScore = state.options.filter(o => o.score <= 0).reduce((sum, o) => sum + o.score, 0);
        }
        break;
      case "ORDERING":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.reduce((sum, o) => sum + o.score, 0);
          minScore = 0;
        }
        break;
      case "MATCHING":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.reduce((sum, o) => sum + o.score, 0);
          minScore = 0;
        }
        break;
      case "FILL_BLANK":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.reduce((sum, o) => sum + o.score, 0);
          minScore = 0;
        }
        break;
      case "MATRIX":
        maxScore = state.options.reduce((sum, o) => sum + o.score, 0);
        minScore = 0;
        break;
      case "NUMERIC":
      case "LIKERT":
        maxScore = Math.max(...state.options.map(o => o.score), 0);
        minScore = 0;
        break;
      case "ESSAY":
        const rubrics = state.rubric || [];
        maxScore = rubrics.reduce((sum: number, r: any) => sum + (Number(r.maxScore) || 0), 0);
        minScore = 0;
        break;
    }

    if (state.totalPoints !== maxScore || state.correctPoints !== minScore) {
      setState(curr => ({
        ...curr,
        totalPoints: maxScore,
        correctPoints: minScore
      }));
    }
  }, [state.options, state.scoringMode, state.scoringConfig, state.type, state.totalPoints, state.correctPoints, state.rubric]);

  const goNext = () => {
    if (step === 2 && state.mappings.length === 0) {
      setValidationTouched(true);
      showToast("Сэдвийн сангаас дор хаяж нэг дэд сэдэв сонгоно уу.", "warning");
      return;
    }
    setStep((current) => Math.min(3, current + 1) as WizardStep);
  };

  const saveDraft = async () => {
    try {
      const qData = buildQuestionFromState({ ...state, status: "draft" }, sourceQuestion);
      if (mode === "edit" && sourceQuestion?.id) {
        await updateQuestion(sourceQuestion.id, qData);
      } else {
        await createQuestion(qData);
      }
      showToast("Ноорог амжилттай хадгалагдлаа.", "success");
    } catch (err: any) {
      showToast("Хадгалахад алдаа гарлаа.", "danger");
    }
  };

  const requestApproval = async () => {
    setValidationTouched(true);
    if (!validation.ready) {
      showToast("Батлуулахын өмнө checklist дээрх дутуу хэсгүүдийг гүйцээнэ үү.", "warning");
      return;
    }
    try {
      setSubmitted(true);
      const nextStatus = mode === "edit" ? "resubmitted" : "approval_requested";
      const qData = buildQuestionFromState({ ...state, status: nextStatus }, sourceQuestion);
      if (mode === "edit" && sourceQuestion?.id) {
        await updateQuestion(sourceQuestion.id, qData);
      } else {
        await createQuestion(qData);
      }
      showToast("Хадгалагдаж батлуулахаар илгээгдлээ.", "success");
      router.push("/assessor/question-bank");
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
              href="/assessor/question-bank"
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
          <Button type="button" variant="outline" size="sm" onClick={preview} className="flex items-center gap-seek-2">
            <Icons.Eye className="h-4 w-4 stroke-[1.8]" />
            <span>Урьдчилан харах</span>
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-seek-4 py-seek-5">
        {step === 1 && (
          <StepOne
            state={state}
            setState={setPartial}
            updateOption={(index, patch) =>
              setState((current) => {
                const nextScore = patch.score !== undefined ? patch.score : current.options[index]?.score ?? 0;
                const nextIsCorrect = nextScore > 0;
                let nextOptions = current.options.map((option, optionIndex) =>
                  optionIndex === index
                    ? { ...option, ...patch, isCorrect: nextIsCorrect }
                    : option
                );
                if (current.type === "SINGLE_CHOICE" && nextScore > 0) {
                  nextOptions = nextOptions.map((option, optionIndex) =>
                    optionIndex === index
                      ? option
                      : { ...option, score: 0, isCorrect: false }
                  );
                }
                return {
                  ...current,
                  options: nextOptions,
                };
              })
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
            tagInput={tagInput}
            setTagInput={setTagInput}
            addLeftMatchingOption={() =>
              setState((current) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    id: `L${current.options.length + 1}`,
                    label: `L${current.options.length + 1}`,
                    content: "",
                    isCorrect: true,
                    score: 1,
                  },
                ],
              }))
            }
            addRightMatchingOption={() => {
              const nextRightOptions = [...(state.scoringConfig?.rightOptions || [])];
              nextRightOptions.push({
                id: `R${nextRightOptions.length + 1}`,
                value: "",
              });
              setState((current) => ({
                ...current,
                scoringConfig: {
                  ...current.scoringConfig,
                  rightOptions: nextRightOptions,
                },
              }));
            }}
            removeRightMatchingOption={(index) => {
              const nextRightOptions = (state.scoringConfig?.rightOptions || []).filter((_: any, i: number) => i !== index);
              setState((current) => ({
                ...current,
                scoringConfig: {
                  ...current.scoringConfig,
                  rightOptions: nextRightOptions,
                },
              }));
            }}
            updateRightMatchingOption={(index, val) => {
              const nextRightOptions = (state.scoringConfig?.rightOptions || []).map((opt: any, i: number) =>
                i === index ? { ...opt, value: val } : opt
              );
              setState((current) => ({
                ...current,
                scoringConfig: {
                  ...current.scoringConfig,
                  rightOptions: nextRightOptions,
                },
              }));
            }}
          />
        )}

        {step === 2 && (
          <StepTwo
            mappings={state.mappings}
            setMappings={(mappings) => setPartial({ mappings })}
            validationTouched={validationTouched}
            topics={topics}
            difficultyLevels={difficultyLevels}
            cognitiveLevels={cognitiveLevels}
            loading={loadingMetadata}
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
            <Button
              type="button"
              variant="secondary"
              disabled={step === 1}
              onClick={() => setStep((step - 1) as WizardStep)}
              className="flex items-center gap-seek-2 active:scale-95 transition-all"
            >
              <Icons.ArrowLeft className="h-4 w-4 stroke-[1.8]" />
              <span>Буцах</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={saveDraft}
              className="flex items-center gap-seek-2 active:scale-95 transition-all"
            >
              <Icons.SavePen className="h-4 w-4 stroke-[1.8]" />
              <span>Хадгалах</span>
            </Button>
            {step < 3 ? (
              <Button
                type="button"
                onClick={goNext}
                className="flex items-center gap-seek-2 active:scale-95 transition-all"
              >
                <span>Дараах</span>
                <Icons.ArrowBigRight className="h-4 w-4 stroke-[1.8]" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={requestApproval}
                className="flex items-center gap-seek-2 active:scale-95 transition-all"
              >
                <Icons.CircleArrowRight className="h-4 w-4 stroke-[1.8]" />
                <span>{mode === "edit" ? "Дахин батлуулах" : "Батлуулах хүсэлт илгээх"}</span>
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
  tagInput,
  setTagInput,
  addLeftMatchingOption,
  addRightMatchingOption,
  removeRightMatchingOption,
  updateRightMatchingOption,
}: {
  state: QuestionWizardState;
  setState: (patch: Partial<QuestionWizardState>) => void;
  updateOption: (index: number, patch: Partial<EditorOption>) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
  tagInput: string;
  setTagInput: (val: string) => void;
  addLeftMatchingOption: () => void;
  addRightMatchingOption: () => void;
  removeRightMatchingOption: (index: number) => void;
  updateRightMatchingOption: (index: number, val: string) => void;
}) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showScoringDropdown, setShowScoringDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scoringDropdownRef = useRef<HTMLDivElement>(null);

  // Гадна дарах үед dropdown хаах
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const getScoringOptions = () => {
    switch (state.type) {
      case "SINGLE_CHOICE":
        return [{ value: "per_option", label: "Сонголтод харгалзах оноо" }];
      case "MULTIPLE_CHOICE":
        return [
          { value: "per_option", label: "Сонголтод харгалзах" },
          { value: "combination", label: "Хослолын оноо" }
        ];
      case "TRUE_FALSE":
        return [{ value: "per_option", label: "Сонголтод харгалзах оноо" }];
      case "ORDERING":
        return [
          { value: "position", label: "Зөв байршил бүрийн оноо" },
          { value: "all_or_nothing", label: "Бүх байршил зөв бол оноо авна" },
          { value: "combination", label: "Хослолын оноо" }
        ];
      case "MATCHING":
        return [
          { value: "partial_per_pair", label: "Зөв харгалзаа бүрийн оноо" },
          { value: "all_or_nothing", label: "Бүх харгалзаа зөв бол оноо авна" },
          { value: "combination", label: "Хослолын оноо" }
        ];
      case "SHORT_TEXT":
        return [{ value: "manual", label: "Гараар үнэлэх" }];
      case "FILL_BLANK":
        return [
          { value: "partial_per_blank", label: "Нүд бүрийн оноо" },
          { value: "combination", label: "Хослолын оноо" }
        ];
      case "MATRIX":
        return [
          { value: "all_or_nothing", label: "Бүрэн зөв сонгосон" },
          { value: "partial_per_cell", label: "Тус бүрийн оноо" }
        ];
      case "NUMERIC":
      case "LIKERT":
        return [{ value: "all_or_nothing", label: "Зөв хариулсан" }];
      case "SJT":
        return [{ value: "per_option", label: "Сонголтод харгалзах оноо" }];
      case "CASE_BUNDLE":
      case "ESSAY":
        return [{ value: "manual", label: "Гараар үнэлэх" }];
      default:
        return [{ value: "all_or_nothing", label: "Бүгд зөв бол оноо өгөх" }];
    }
  };

  const handleTypeChange = (newType: QuestionType) => {
    let nextOptions = [...state.options];
    let nextScoringMode = "all_or_nothing";

    switch (newType) {
      case "SINGLE_CHOICE":
      case "TRUE_FALSE":
      case "SJT":
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "a", label: "A", content: "", isCorrect: true, score: 1, matchValue: "" },
          { id: "b", label: "B", content: "", isCorrect: false, score: 0, matchValue: "" },
        ];
        break;
      case "MULTIPLE_CHOICE":
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "a", label: "A", content: "", isCorrect: true, score: 1, matchValue: "" },
          { id: "b", label: "B", content: "", isCorrect: false, score: 0, matchValue: "" },
        ];
        break;
      case "ORDERING":
        nextScoringMode = "position";
        nextOptions = [
          { id: "o1", label: "1", content: "", isCorrect: true, score: 1, matchValue: "" },
          { id: "o2", label: "2", content: "", isCorrect: true, score: 1, matchValue: "" },
        ];
        break;
      case "MATCHING":
        nextScoringMode = "partial_per_pair";
        nextOptions = [
          { id: "L1", label: "L1", content: "Зүүн 1", isCorrect: true, score: 1 },
          { id: "L2", label: "L2", content: "Зүүн 2", isCorrect: true, score: 1 },
        ];
        setState({
          scoringConfig: {
            ...state.scoringConfig,
            rightOptions: [
              { id: "R1", value: "Баруун 1" },
              { id: "R2", value: "Баруун 2" },
              { id: "R3", value: "Баруун 3" },
            ]
          }
        });
        break;
      case "FILL_BLANK":
        nextScoringMode = "partial_per_blank";
        nextOptions = [
          { id: "b1", label: "Хоосон 1", content: "", isCorrect: true, score: 1, matchValue: "" },
        ];
        break;
      case "MATRIX":
        nextScoringMode = "all_or_nothing";
        nextOptions = [
          { id: "mx1", label: "Мөр 1", content: "", isCorrect: true, score: 1, matchValue: "" },
        ];
        break;
      case "SHORT_TEXT":
      case "CASE_BUNDLE":
      case "ESSAY":
        nextScoringMode = "manual";
        nextOptions = [];
        break;
      case "NUMERIC":
        nextScoringMode = "all_or_nothing";
        nextOptions = [
          { id: "num-ans", label: "Хариулт", content: "", isCorrect: true, score: state.totalPoints, matchValue: "0" }
        ];
        break;
      case "LIKERT":
        nextScoringMode = "all_or_nothing";
        nextOptions = [
          { id: "a", label: "1", content: "Маш муу", isCorrect: false, score: 1, matchValue: "" },
          { id: "b", label: "2", content: "Муу", isCorrect: false, score: 2, matchValue: "" },
        ];
        break;
    }

    setState({
      type: newType,
      options: nextOptions,
      scoringMode: nextScoringMode,
    });
  };

  const handleUpdateOption = (index: number, patch: Partial<EditorOption>) => {
    if (state.type === "SINGLE_CHOICE" && patch.isCorrect) {
      const nextOptions = state.options.map((opt, i) => ({
        ...opt,
        isCorrect: i === index ? true : false,
        score: i === index ? state.totalPoints : 0,
      }));
      setState({ options: nextOptions });
    } else {
      updateOption(index, patch);
    }
  };

  return (
    <div className="grid gap-seek-5 xl:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="space-y-seek-4 xl:sticky xl:top-28 xl:self-start">


        <CollapsibleCard title="Тохиргоо" icon={Icons.Settings}>
          <div className="space-y-seek-4">
            <FieldLabel label="Асуултын төрөл">
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-seek-md border border-input bg-background px-seek-3 py-seek-2 text-left shadow-seek-sm focus:outline-none focus:ring-1 focus:ring-ring text-xs"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                >
                  <div className="flex items-center gap-seek-2">
                    {(() => {
                      const SelectedIcon = questionTypeIcons[state.type] || Icons.Info;
                      return <SelectedIcon className="h-4 w-4 text-primary stroke-[1.8]" />;
                    })()}
                    <span className="text-slate-800 font-medium">
                      {questionTypeLabels[state.type]}
                    </span>
                  </div>
                  <Icons.ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </button>

                {showTypeDropdown && (
                  <div className="absolute left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto rounded-seek-md border border-border bg-background py-1 shadow-seek-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    {Object.entries(questionTypeLabels).map(([val, label]) => {
                      const ItemIcon = questionTypeIcons[val as QuestionType] || Icons.Info;
                      return (
                        <button
                          key={val}
                          type="button"
                          className={`w-full flex items-center gap-seek-3 px-seek-3 py-2 text-left hover:bg-slate-50 transition-colors text-xs ${state.type === val ? 'bg-primary/5 font-semibold text-primary' : 'text-slate-700'}`}
                          onClick={() => {
                            handleTypeChange(val as QuestionType);
                            setShowTypeDropdown(false);
                          }}
                        >
                          <ItemIcon className={`h-4 w-4 stroke-[1.8] ${state.type === val ? 'text-primary' : 'text-slate-500'}`} />
                          <span>{label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </FieldLabel>
            <FieldLabel label="Оноо бодох хэлбэр">
              <div className="relative" ref={scoringDropdownRef}>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-seek-md border border-input bg-background px-seek-3 py-seek-2 text-left shadow-seek-sm focus:outline-none focus:ring-1 focus:ring-ring text-xs"
                  onClick={() => setShowScoringDropdown(!showScoringDropdown)}
                >
                  <div className="flex items-center gap-seek-2">
                    {(() => {
                      const SelectedIcon = scoringModeIcons[state.scoringMode] || Icons.Check;
                      const selectedOpt = getScoringOptions().find(o => o.value === state.scoringMode);
                      return (
                        <>
                          <SelectedIcon className="h-4 w-4 text-primary stroke-[1.8]" />
                          <span className="text-slate-800 font-medium">
                            {selectedOpt ? selectedOpt.label : (scoringModeLabels[state.scoringMode] || state.scoringMode)}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                  <Icons.ChevronRight className="h-4 w-4 text-slate-400 rotate-90" />
                </button>

                {showScoringDropdown && (
                  <div className="absolute left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto rounded-seek-md border border-border bg-background py-1 shadow-seek-lg animate-in fade-in slide-in-from-top-1 duration-150">
                    {getScoringOptions().map((opt) => {
                      const ItemIcon = scoringModeIcons[opt.value] || Icons.Check;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          className={`w-full flex items-center gap-seek-3 px-seek-3 py-2 text-left hover:bg-slate-50 transition-colors text-xs ${state.scoringMode === opt.value ? 'bg-primary/5 font-semibold text-primary' : 'text-slate-700'}`}
                          onClick={() => {
                            setState({ scoringMode: opt.value });
                            setShowScoringDropdown(false);
                          }}
                        >
                          <ItemIcon className={`h-4 w-4 stroke-[1.8] ${state.scoringMode === opt.value ? 'text-primary' : 'text-slate-500'}`} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </FieldLabel>
            <div className="grid grid-cols-2 gap-seek-3">
              <FieldLabel label="max оноо">
                <div className="relative">
                  <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <Icons.MaxValue className="h-4 w-4 text-amber-500 stroke-[1.8]" />
                  </div>
                  <Input
                    type="number"
                    disabled={state.scoringMode !== "manual"}
                    value={state.totalPoints}
                    onChange={(event) => setState({ totalPoints: Number(event.target.value) })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </FieldLabel>
              <FieldLabel label="min оноо">
                <div className="relative">
                  <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <Icons.MinValue className="h-4 w-4 text-slate-400 stroke-[1.8]" />
                  </div>
                  <Input
                    type="number"
                    disabled={state.scoringMode !== "manual"}
                    value={state.correctPoints}
                    onChange={(event) => setState({ correctPoints: Number(event.target.value) })}
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </FieldLabel>
            </div>
            <FieldLabel label="Хугацаа (сек)">
              <div className="relative">
                <div className="absolute left-seek-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <Icons.Timer className="h-4 w-4 text-slate-500 stroke-[1.8]" />
                </div>
                <Input
                  type="number"
                  value={state.durationSeconds}
                  onChange={(event) => setState({ durationSeconds: Number(event.target.value) })}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </FieldLabel>
            <div>
              <Text className="mb-2 text-xs font-bold uppercase text-muted-foreground">
                Tag (шошго)
              </Text>
              {state.tags.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5 rounded-seek-md bg-muted-background p-seek-2">
                  {state.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="success"
                      className="cursor-pointer hover:bg-danger hover:text-white transition-colors"
                      onClick={() => setState({ tags: state.tags.filter((t) => t !== tag) })}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    e.preventDefault();
                    if (!state.tags.includes(tagInput.trim())) {
                      setState({ tags: [...state.tags, tagInput.trim()] });
                    }
                    setTagInput("");
                  }
                }}
                placeholder="Шошго бичээд Enter дарна уу..."
              />
            </div>
          </div>
        </CollapsibleCard>
      </aside>

      <main className="space-y-seek-5">
        {/* Removed grid layout for question type selectors */}

        <CollapsibleCard title="Асуултын гарчиг" icon={Icons.Type}>
          <Input
            value={state.title}
            onChange={(event) => setState({ title: event.target.value })}
            placeholder="Жишээ: Квадрат тэгшитгэлийн язгуур"
          />
        </CollapsibleCard>

        <CollapsibleCard title="Асуултын агуулга" icon={Icons.BodyIcon}>
          <RichEditor
            value={state.stem}
            placeholder="Асуултын агуулгыг энд оруулна уу..."
            onChange={(markdown) => setState({ stem: markdown })}
          />
        </CollapsibleCard>

        <CollapsibleCard title="Хавсралт медиа файлууд" subtitle="Асуултанд зураг, аудио, видео файл хавсаргах." icon={Icons.AttachmentIcon}>
          <div className="space-y-seek-4">
            <div className="flex items-center gap-seek-3">
              <input
                type="file"
                id="media-file-upload"
                className="hidden"
                accept="image/*,audio/*,video/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  try {
                    // 1. Get presigned upload URL
                    const presignedRes = await authFetch('/api/v1/file/presigned-upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: file.name, type: 'QUESTION_ATTACHMENT' }),
                    });
                    const { uploadUrl, storageKey } = await presignedRes.json();

                    // 2. PUT file to MinIO
                    await fetch(uploadUrl, {
                      method: 'PUT',
                      headers: { 'Content-Type': '' },
                      body: file,
                    });

                    // 3. Verify upload
                    await authFetch('/api/v1/file/objects/verify', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        storageKey,
                        mimeType: file.type,
                        sizeBytes: file.size,
                      }),
                    });

                    // Determine mediaType
                    let mediaType = "IMAGE";
                    if (file.type.startsWith("audio/")) mediaType = "AUDIO";
                    else if (file.type.startsWith("video/")) mediaType = "VIDEO";

                    // 4. Add to state.media list
                    setState({
                      media: [
                        ...(state.media || []),
                        {
                          id: `media_${Date.now()}`,
                          mediaType,
                          storageKey,
                          mimeType: file.type,
                          sizeBytes: file.size,
                          orderIndex: (state.media || []).length + 1,
                        }
                      ]
                    });
                  } catch (err) {
                    console.error("Media file upload failed:", err);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('media-file-upload')?.click()}
              >
                + Файл сонгох
              </Button>
              <Text className="text-xs text-muted-foreground">Зураг, аудио, видео файлууд оруулж болно.</Text>
            </div>

            <div className="grid gap-seek-3 sm:grid-cols-2 lg:grid-cols-3">
              {(state.media || []).map((m: any, index: number) => {
                const downloadUrl = `/api/v1/file/objects?storageKey=${encodeURIComponent(m.storageKey)}`;
                return (
                  <div key={m.id || index} className="relative flex flex-col justify-between rounded-seek-md border border-border bg-muted-background/40 p-seek-3">
                    <div className="flex items-start justify-between gap-seek-2">
                      <div className="overflow-hidden">
                        <Text className="truncate text-xs font-bold text-slate-800">{(m.storageKey || "").split('/').pop() || "үл мэдэгдэх файл"}</Text>
                        <Text className="text-[10px] text-muted-foreground">{m.mediaType} • {(m.sizeBytes / 1024 / 1024).toFixed(2)} MB</Text>
                      </div>
                      <Button
                        type="button"
                        variant="danger"
                        className="h-6 w-6 p-0 text-xs"
                        onClick={() => {
                          const nextMedia = (state.media || []).filter((_: any, i: number) => i !== index);
                          setState({ media: nextMedia });
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                    
                    <div className="mt-seek-3 flex justify-center bg-surface rounded-seek-sm p-1">
                      {m.mediaType === "IMAGE" && (
                        <img src={downloadUrl} alt="Preview" className="max-h-24 object-contain" />
                      )}
                      {m.mediaType === "AUDIO" && (
                        <audio src={downloadUrl} controls className="w-full h-8" />
                      )}
                      {m.mediaType === "VIDEO" && (
                        <video src={downloadUrl} controls className="max-h-24 w-full object-contain" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleCard>













        {state.type === "ESSAY" ? (
          <CollapsibleCard
            title="Үнэлгээний рубрик (Grading Rubric)"
            subtitle="Асуултыг үнэлэх шалгууруудыг тодорхойлно."
            icon={Icons.ListCheck}
            headerActions={
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const currentRubric = state.rubric || [];
                  setState({
                    rubric: [
                      ...currentRubric,
                      { id: `c${currentRubric.length + 1}`, criteria: "", maxScore: 1, description: "" }
                    ]
                  });
                }}
              >
                + Шалгуур нэмэх
              </Button>
            }
          >
            
            <div className="space-y-seek-4">
              {(state.rubric || []).length === 0 ? (
                <Text variant="muted" className="text-sm">Үнэлгээний рубрик хоосон байна. Багш асуултыг засахдаа шалгуур нэмнэ үү.</Text>
              ) : (
                (state.rubric || []).map((rub: any, index: number) => (
                  <div key={rub.id || index} className="rounded-seek-lg border border-border bg-surface p-seek-4 space-y-seek-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="success">Шалгуур {index + 1}</Badge>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          const nextRubric = (state.rubric || []).filter((_: any, i: number) => i !== index);
                          setState({ rubric: nextRubric });
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                    
                    <div className="grid gap-seek-4 md:grid-cols-[2fr_1fr]">
                      <FieldLabel label="Шалгуурын нэр">
                        <Input
                          placeholder="Жишээ нь: Бодолтын явц"
                          value={rub.criteria}
                          onChange={(e) => {
                            const nextRubric = (state.rubric || []).map((r: any, i: number) =>
                              i === index ? { ...r, criteria: e.target.value } : r
                            );
                            setState({ rubric: nextRubric });
                          }}
                        />
                      </FieldLabel>
                      <FieldLabel label="Авах дээд оноо">
                        <Input
                          type="number"
                          value={rub.maxScore}
                          onChange={(e) => {
                            const nextRubric = (state.rubric || []).map((r: any, i: number) =>
                              i === index ? { ...r, maxScore: Number(e.target.value) } : r
                            );
                            setState({ rubric: nextRubric });
                          }}
                        />
                      </FieldLabel>
                    </div>
                    
                    <FieldLabel label="Шалгуурын тайлбар">
                      <Textarea
                        rows={2}
                        placeholder="Жишээ нь: Бодолтын алхмуудыг зөв хийсэн байдал"
                        value={rub.description}
                        onChange={(e) => {
                          const nextRubric = (state.rubric || []).map((r: any, i: number) =>
                            i === index ? { ...r, description: e.target.value } : r
                          );
                          setState({ rubric: nextRubric });
                        }}
                      />
                    </FieldLabel>
                  </div>
                ))
              )}
            </div>
          </CollapsibleCard>
        ) : state.type === "NUMERIC" ? (
          <CollapsibleCard title="Тоон хариулт" subtitle="Зөв хариулах тоо ба хүлцэх алдаа." icon={Icons.Hash}>
            <div className="grid gap-seek-4 md:grid-cols-2">
              <FieldLabel label="Зөв тоон хариулт">
                <Input
                  type="number"
                  placeholder="Жишээ нь: 12.5"
                  value={state.options[0]?.content || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    const nextOptions = [{
                      id: "num-ans",
                      label: "Хариулт",
                      content: val,
                      isCorrect: true,
                      score: state.totalPoints,
                      matchValue: state.options[0]?.matchValue || "0"
                    }];
                    setState({ options: nextOptions });
                  }}
                />
              </FieldLabel>
              <FieldLabel label="Хүлцэх алдаа (Tolerance)">
                <Input
                  type="number"
                  placeholder="Жишээ нь: 0.1"
                  value={state.options[0]?.matchValue || ""}
                  onChange={(e) => {
                    const tol = e.target.value;
                    const nextOptions = [{
                      id: "num-ans",
                      label: "Хариулт",
                      content: state.options[0]?.content || "",
                      isCorrect: true,
                      score: state.totalPoints,
                      matchValue: tol
                    }];
                    setState({ options: nextOptions });
                  }}
                />
              </FieldLabel>
            </div>
          </CollapsibleCard>
        ) : state.type === "MATCHING" ? (
          <CollapsibleCard title="Харгалзуулах сонголтууд (Matching Setup)" subtitle="Зүүн талын сурвалж болон баруун талын хариултуудыг тодорхойлно." icon={Icons.Matching}>
            
            <div className="grid gap-seek-5 md:grid-cols-2">
              {/* Left Side Elements */}
              <div className="space-y-seek-4">
                <div className="flex items-center justify-between">
                  <Text className="font-bold text-sm text-slate-800">Зүүн тал (Сурвалжууд)</Text>
                  <Button type="button" variant="outline" size="sm" onClick={addLeftMatchingOption}>
                    + Зүүн утга нэмэх
                  </Button>
                </div>
                <div className="space-y-seek-3">
                  {state.options.map((option, index) => (
                    <div key={option.id} className="rounded-seek-md border border-border bg-surface p-seek-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="success">L{index + 1}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold">Оноо:</span>
                          <Input
                            className="w-16 h-7 text-center text-xs"
                            type="number"
                            value={option.score}
                            onChange={(event) => updateOption(index, { score: Number(event.target.value) })}
                          />
                          <Button type="button" variant="danger" size="sm" onClick={() => removeOption(index)} className="h-6 w-6 p-0 flex items-center justify-center text-xs"><Icons.ListX className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                      <Input
                        placeholder="Жишээ нь: Apple"
                        value={option.content}
                        onChange={(e) => updateOption(index, { content: e.target.value })}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side Elements */}
              <div className="space-y-seek-4">
                <div className="flex items-center justify-between">
                  <Text className="font-bold text-sm text-slate-800">Баруун тал (Хариултууд)</Text>
                  <Button type="button" variant="outline" size="sm" onClick={addRightMatchingOption}>
                    + Баруун утга нэмэх
                  </Button>
                </div>
                <div className="space-y-seek-3">
                  {(state.scoringConfig?.rightOptions || []).map((opt: any, index: number) => (
                    <div key={opt.id} className="rounded-seek-md border border-border bg-surface p-seek-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">R{index + 1}</Badge>
                        <Button type="button" variant="danger" size="sm" onClick={() => removeRightMatchingOption(index)} className="h-6 w-6 p-0 text-xs">✕</Button>
                      </div>
                      <Input
                        placeholder="Жишээ нь: Жимс"
                        value={opt.value}
                        onChange={(e) => updateRightMatchingOption(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleCard>
        ) : (
          <CollapsibleCard
            title="Хариултын сонголтууд (Answers)"
            subtitle="Нэг зөв хариулт эсвэл сонголт бүрт оноо тогтооно."
            icon={Icons.ListCheck}
            headerActions={
              <Button type="button" variant="outline" size="sm" onClick={addOption} className="flex items-center gap-seek-2">
                <Icons.AddRow className="h-4 w-4 stroke-[1.8]" />
                <span>Сонголт нэмэх</span>
              </Button>
            }
          >
            <div className="space-y-seek-4">
              {state.options.map((option, index) => (
                <div
                  key={`${option.id}-${index}`}
                  className="rounded-seek-lg border border-border bg-surface p-seek-4"
                >
                  <div className="mb-seek-3 flex flex-wrap items-center justify-between gap-seek-3">
                    <Badge variant={option.score > 0 ? "success" : "secondary"}>
                      {option.label}
                    </Badge>
                    <div className="flex items-center gap-2">
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
                        className="flex items-center justify-center p-seek-1.5"
                        onClick={() => removeOption(index)}
                      >
                        <Icons.ListX className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <RichEditor
                    value={option.content}
                    placeholder={`Хариулт ${option.label}-ийг энд оруулна уу...`}
                    onChange={(markdown) => updateOption(index, { content: markdown })}
                  />
                </div>
              ))}
            </div>
          </CollapsibleCard>
        )}

        <CollapsibleCard title="Хариултуудад өгөх тайлбар" subtitle="Зөв болон буруу хариулсан үед харагдах тайлбар." icon={Icons.Ad}>
          <div className="space-y-seek-4">
            <div className="space-y-1">
              <Text className="text-xs font-semibold text-slate-700">Зөв хариулсан үеийн тайлбар:</Text>
              <RichEditor
                value={state.feedbackCorrect}
                placeholder="Тайлбарыг энд оруулна уу..."
                onChange={(markdown) => setState({ feedbackCorrect: markdown })}
              />
            </div>
            <div className="space-y-1">
              <Text className="text-xs font-semibold text-slate-700">Буруу хариулсан үеийн тайлбар:</Text>
              <RichEditor
                value={state.feedbackIncorrect}
                placeholder="Тайлбарыг энд оруулна уу..."
                onChange={(markdown) => setState({ feedbackIncorrect: markdown })}
              />
            </div>
          </div>

          {state.scoringMode === "combination" && state.type === "MULTIPLE_CHOICE" && (
            <div className="mt-seek-5 border-t border-border pt-seek-4">
              <CombinationMCBuilder
                options={state.options}
                combinations={state.scoringConfig?.combinations || []}
                onChange={(newCombos) =>
                  setState({
                    scoringConfig: {
                      ...state.scoringConfig,
                      combinations: newCombos,
                    },
                  })
                }
              />
            </div>
          )}

          {state.scoringMode === "combination" && state.type === "MATCHING" && (
            <div className="mt-seek-5 border-t border-border pt-seek-4">
              <CombinationMatchingBuilder
                options={state.options}
                combinations={state.scoringConfig?.combinations || []}
                rightOptions={state.scoringConfig?.rightOptions || []}
                onChange={(newCombos) =>
                  setState({
                    scoringConfig: {
                      ...state.scoringConfig,
                      combinations: newCombos,
                    },
                  })
                }
              />
            </div>
          )}
        </CollapsibleCard>

        
      </main>
    </div>
  );
}

function StepTwo({
  mappings,
  setMappings,
  validationTouched,
  topics,
  difficultyLevels,
  cognitiveLevels,
  loading,
}: {
  mappings: QuestionTopicMapping[];
  setMappings: (mappings: QuestionTopicMapping[]) => void;
  validationTouched: boolean;
  topics: any[];
  difficultyLevels: any[];
  cognitiveLevels: any[];
  loading: boolean;
}) {
  const selectedIds = mappings.map((mapping) => mapping.topicId);

  // Сэдвийн хавтгай жагсаалтыг мод (Tree) хэлбэрт хөрвүүлэх функц
  const computedTopicNodes = useMemo(() => {
    if (!topics || topics.length === 0) return topicNodes;
    
    const nodesMap: Record<string, TopicNode> = {};
    const roots: TopicNode[] = [];

    topics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.name,
        children: [],
      };
    });

    topics.forEach((t) => {
      const node = nodesMap[t.id];
      if (t.parentId && nodesMap[t.parentId]) {
        nodesMap[t.parentId].children = nodesMap[t.parentId].children || [];
        nodesMap[t.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots.length > 0 ? roots : topicNodes;
  }, [topics]);

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
      <CollapsibleCard title="Сэдвийн сан" subtitle="Дэд сэдэв бүрийг checkbox-оор сонгоно." icon={Icons.Menu}>
        <div className="space-y-seek-3">
          {loading ? (
            <div className="flex items-center justify-center py-seek-8">
              <Text variant="muted" className="text-xs">Сэдвийн санг уншиж байна...</Text>
            </div>
          ) : (
            <TopicTree nodes={computedTopicNodes} selectedIds={selectedIds} onToggle={toggleTopic} />
          )}
        </div>
        {validationTouched && mappings.length === 0 && (
          <Text className="mt-seek-3 text-sm font-semibold text-danger">
            Дор хаяж нэг дэд сэдэв сонгоно уу.
          </Text>
        )}
      </CollapsibleCard>

      <main className="space-y-seek-4">
        <CollapsibleCard title="Сонгосон дэд сэдвийн mapping" subtitle="Нэг асуулт олон дэд сэдэвтэй, өөр өөр Bloom/чадамж/түвшинтэй холбогдож болно." icon={Icons.Settings}>
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
                    options={
                      cognitiveLevels && cognitiveLevels.length > 0
                        ? cognitiveLevels.map((c: any) => ({ value: c.code, label: c.name }))
                        : Object.entries(bloomLabels).map(([value, label]) => ({ value, label }))
                    }
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
                    options={
                      difficultyLevels && difficultyLevels.length > 0
                        ? difficultyLevels.map((d: any) => ({ value: d.code, label: d.name }))
                        : Object.entries(difficultyLabels).map(([value, label]) => ({ value, label }))
                    }
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
        </CollapsibleCard>
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
        <CollapsibleCard
          title="Батлуулах хүсэлтийн тойм"
          subtitle="Илгээхийн өмнө үндсэн мэдээлэл болон чанарын checklist-ийг шалгана."
          icon={Icons.Dashboard}
        >
          <div className="grid gap-seek-3 md:grid-cols-2 xl:grid-cols-4">
            <SummaryTile label="Гарчиг" value={state.title || "Нэргүй"} />
            <SummaryTile label="Төрөл" value={questionTypeLabels[state.type]} />
            <SummaryTile label="Оноо/хугацаа" value={`${state.totalPoints} оноо · ${state.durationSeconds} сек`} />
            <SummaryTile label="Сэдэв" value={`${state.mappings.length} mapping`} />
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Чанарын шалгах хуудас (Validation checklist)" icon={Icons.ListChecks}>
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
        </CollapsibleCard>

        <CollapsibleCard title="Илгээх тэмдэглэл (Workflow comment)" subtitle="Батлуулах хүсэлтэд хавсаргах нэмэлт тайлбар." icon={Icons.SavePen}>
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
        </CollapsibleCard>
      </main>

      <aside className="space-y-seek-4 xl:sticky xl:top-28 xl:self-start">
        <Card className="bg-gradient-to-br from-purple-700 to-primary p-seek-5 text-white">
          <div className="flex items-center gap-seek-2">
            <Icons.Info className="h-5 w-5 text-white stroke-[1.8]" />
            <Text className="font-bold">Workflow төлөв</Text>
          </div>
          <Text className="mt-2 text-3xl font-bold">
            {submitted ? "Илгээгдсэн" : statusLabels[state.status]}
          </Text>
          <Text className="mt-2 text-sm opacity-90">
            {submitted
              ? "Mock workflow history-д хүсэлт бүртгэгдсэн."
              : "Checklist бүрэн бол батлуулах хүсэлт илгээж болно."}
          </Text>
        </Card>
        <CollapsibleCard title="Сэдвийн mapping" icon={Icons.Settings}>
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
        </CollapsibleCard>
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
      <RailButton label="Буцах" onClick={onBack}>
        <Icons.Undo2 className="h-4 w-4 stroke-[1.8]" />
      </RailButton>
      <RailButton label="Урьдчилан харах" onClick={onPreview}>
        <Icons.Eye className="h-4 w-4 stroke-[1.8]" />
      </RailButton>
      <RailButton label="Хадгалах" onClick={onSave}>
        <Icons.SavePen className="h-4 w-4 stroke-[1.8]" />
      </RailButton>
      <RailButton label="Устгах" danger onClick={onDelete}>
        <Icons.Trash className="h-4 w-4 stroke-[1.8]" />
      </RailButton>
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
        matchValue: option.matchValue || "",
      }))
    : [
        { id: "a", label: "A", content: "x = 2", isCorrect: true, score: 1, matchValue: "" },
        { id: "b", label: "B", content: "x = 3", isCorrect: true, score: 1, matchValue: "" },
        { id: "c", label: "C", content: "x = 1", isCorrect: false, score: 0, matchValue: "" },
        { id: "d", label: "D", content: "x = 6", isCorrect: false, score: 0, matchValue: "" },
      ];

  return {
    title: question?.title ?? "Квадрат тэгшитгэлийн язгуур",
    code: question?.code ?? `Q-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    type: question?.type ?? "MULTIPLE_CHOICE",
    stem: question?.stem ?? "Дараах тэгшитгэлийн язгууруудыг олно уу: $$x^2 - 5x + 6 = 0$$",
    options,
    feedbackCorrect:
      question?.feedback ??
      "Виетийн теоремоор үржвэр нь 6, нийлбэр нь 5 байх тоонууд нь 2 ба 3 юм.",
    feedbackIncorrect: "Буруу хариулсан үед язгуурын нийлбэр ба үржвэрийг дахин шалгана.",
    scoringMode: question?.scoringMode || "all_or_nothing",
    scoringConfig: (() => {
      const raw = question?.scoringConfig || 
                  (question as any)?.contentJson?.scoringConfig || 
                  (question as any)?.contentJson?.payload?.scoringConfig || {};
      return {
        ...raw,
        rightOptions: raw.rightOptions || (
          question?.type === "MATCHING"
            ? (question.options || []).map((o, idx) => ({ id: `R${idx + 1}`, value: o.matchValue })).filter(o => o.value)
            : []
        ),
        combinations: (() => {
          if (raw.combinations && Array.isArray(raw.combinations) && raw.combinations.length > 0) {
            return raw.combinations.map((c: any) => ({
              ids: Array.isArray(c.ids) ? c.ids : (Array.isArray(c.pairs) ? c.pairs : []),
              score: Number(c.score ?? 1)
            }));
          }
          if (question?.type === "MATCHING") {
            const defaultPairs = (question.options || []).map((o, idx) => `${o.id}:R${idx + 1}`);
            return [{ ids: defaultPairs, score: 1 }];
          }
          return [];
        })()
      };
    })(),
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
    rubric: question?.rubric ? (typeof question.rubric === 'string' ? JSON.parse(question.rubric) : question.rubric) : [],
    media: question?.media ?? [],
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
    matchValue: option.matchValue,
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
    answerKey: state.type === "ESSAY" ? "Рубрик үнэлгээ" : (options.filter((option) => option.isCorrect).map((option) => option.label).join(", ") || "-"),
    rubric: typeof state.rubric === 'object' ? JSON.stringify(state.rubric) : (state.rubric || "Wizard prototype rubric"),
    scoringMode: state.scoringMode,
    scoringConfig: state.scoringConfig,
    feedback: state.feedbackCorrect,
    media: (state.media || []).map((m: any) => {
      let type: "image" | "audio" | "video" | "file" = "file";
      const mType = (m.mediaType || m.type || "").toLowerCase();
      if (mType === "image" || mType === "audio" || mType === "video") {
        type = mType as any;
      }
      const name = m.name || m.metadata?.name || m.storageKey?.split("/").pop() || "media_file";
      const url = m.url || `/api/v1/file/objects?storageKey=${encodeURIComponent(m.storageKey)}`;
      return { type, name, url, storageKey: m.storageKey };
    }),
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

interface CollapsibleCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
  defaultExpanded?: boolean;
}

function CollapsibleCard({
  title,
  subtitle,
  icon: Icon,
  children,
  className = "",
  headerActions,
  defaultExpanded = true,
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <Card className={`overflow-hidden border border-border shadow-seek-sm p-0 ${className}`}>
      {/* Header with gray background */}
      <div
        className="flex items-center justify-between bg-slate-50 px-seek-5 py-seek-2 border-b border-border select-none"
      >
        <div className="flex items-center gap-seek-3">
          {Icon && (
            <div className="rounded-seek-md bg-white p-1 text-primary border border-border shadow-seek-sm flex items-center justify-center">
              <Icon className="h-4 w-4 stroke-[1.8]" />
            </div>
          )}
          <div className="flex flex-col justify-center">
            <Text className="font-bold text-slate-800 text-sm leading-tight">{title}</Text>
            {subtitle && (
              <Text variant="muted" className="text-[11px] leading-none mt-0.5">
                {subtitle}
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center gap-seek-3">
          {headerActions}
          <button
            type="button"
            className="rounded-full p-seek-1 text-slate-500 hover:bg-slate-200 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icons.ChevronRight
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Body */}
      {isExpanded && (
        <div className="p-seek-4 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </Card>
  );
}

function SectionHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="flex items-start gap-seek-3">
      {Icon && (
        <div className="mt-0.5 rounded-seek-md bg-primary/5 p-seek-1.5 text-primary">
          <Icon className="h-4 w-4 stroke-[1.8]" />
        </div>
      )}
      <div>
        <Text className="font-semibold text-slate-800">{title}</Text>
        {subtitle && (
          <Text variant="muted" className="text-sm">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
}

function CollapsibleTitle({
  title,
  icon: Icon,
}: {
  title: string;
  icon?: React.ComponentType<any>;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-seek-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground stroke-[1.8]" />}
        <Text className="text-sm font-bold uppercase text-muted-foreground">{title}</Text>
      </div>
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

interface CombinationEntry {
  ids: string[];
  score: number;
}

function CombinationMCBuilder({
  options,
  combinations,
  onChange,
}: {
  options: EditorOption[];
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
}) {
  function addCombination() {
    onChange([...combinations, { ids: [], score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function toggleOption(combIdx: number, optId: string) {
    const combo = combinations[combIdx];
    if (!combo) return;
    const newIds = combo.ids.includes(optId)
      ? combo.ids.filter((id) => id !== optId)
      : [...combo.ids, optId];
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, ids: newIds } : c)));
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <Text className="font-bold text-sm text-slate-800">Хослолын оноо тохируулах (Combination Scores)</Text>
      <div className="space-y-seek-2">
        {combinations.map((combo, combIdx) => (
          <div key={combIdx} className="rounded-seek-md border border-primary/20 bg-primary/5 p-seek-3">
            <div className="mb-seek-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Хослол {combIdx + 1}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Сонголтууд:</span>
              {options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleOption(combIdx, opt.id)}
                  className={`rounded border px-2.5 py-0.5 text-xs font-bold transition-all ${
                    combo.ids.includes(opt.id)
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-surface text-foreground hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
              <span className="ml-auto text-xs text-muted-foreground">Оноо:</span>
              <Input
                type="number"
                value={combo.score}
                onChange={(e) => setScore(combIdx, Number(e.target.value))}
                className="w-16 h-8 text-center text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}

function CombinationMatchingBuilder({
  options,
  combinations,
  onChange,
  rightOptions = [],
}: {
  options: EditorOption[];
  combinations: CombinationEntry[];
  onChange: (c: CombinationEntry[]) => void;
  rightOptions?: any[];
}) {
  const leftItems = options;
  const rightItems = rightOptions;

  function addCombination() {
    const defaultPairs = leftItems.map((l) => `${l.id}:${rightItems[0]?.id || ""}`);
    onChange([...combinations, { ids: defaultPairs, score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setPair(combIdx: number, leftId: string, rightId: string) {
    const combo = combinations[combIdx];
    if (!combo || !Array.isArray(combo.ids)) return;
    const newIds = combo.ids.filter((id) => !id.startsWith(`${leftId}:`));
    newIds.push(`${leftId}:${rightId}`);
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, ids: newIds } : c)));
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }
  function getPairRight(combo: CombinationEntry, leftId: string): string {
    if (!combo || !Array.isArray(combo.ids)) return "";
    const entry = combo.ids.find((id) => id.startsWith(`${leftId}:`));
    return entry ? entry.split(":")[1] ?? "" : "";
  }

  return (
    <div className="space-y-seek-3">
      <Text className="font-bold text-sm text-slate-800">Хослолын оноо тохируулах (Combination Scores)</Text>
      <div className="space-y-seek-2">
        {combinations.map((combo, combIdx) => (
          <div key={combIdx} className="rounded-seek-md border border-primary/20 bg-primary/5 p-seek-3">
            <div className="mb-seek-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary">Хослол {combIdx + 1}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
            </div>
            <div className="space-y-2">
              {leftItems.map((leftOpt, index) => (
                <div key={leftOpt.id} className="flex items-center gap-2">
                  <span className="w-24 truncate text-xs font-medium text-foreground">Зүүн (L{index + 1}):</span>
                  <span className="text-xs text-muted-foreground">{leftOpt.content || "(хоосон)"}</span>
                  <span className="text-xs text-muted-foreground">→</span>
                  <select
                    value={getPairRight(combo, leftOpt.id)}
                    onChange={(e) => setPair(combIdx, leftOpt.id, e.target.value)}
                    className="flex-1 rounded-seek-md border border-border bg-surface px-seek-2 py-1 text-xs outline-none focus:border-primary"
                  >
                    <option value="">Сонгоно уу</option>
                    {rightItems.map((r) => (
                      <option key={r.id} value={r.id}>{r.id}: {r.value || "(хоосон)"}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <span className="text-xs text-muted-foreground">Оноо:</span>
              <Input
                type="number"
                value={combo.score}
                onChange={(e) => setScore(combIdx, Number(e.target.value))}
                className="w-16 h-8 text-center text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}
