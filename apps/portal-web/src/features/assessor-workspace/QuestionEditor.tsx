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
  IconButton,
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
import { createQuestion, updateQuestion, fetchTopics, fetchDifficultyLevels, fetchCognitiveLevels, fetchCompetenceTypes, fetchAssessmentContexts, fetchDifficultyScales, fetchCompetenceFrameworks, fetchAudienceTypes, fetchAudienceLevels, fetchDbData } from "./api";
import { ExplorerTopicTree } from "../../components/workspace";

type WizardStep = 1 | 2 | 3;

interface EditorOption {
  id: string;
  optionKey: string;
  label: string;
  value: string;
  content: string;
  isCorrect: boolean;
  score: number;
  matchValue?: string;
  acceptedValues?: { value: string; score: number }[];
}

interface QuestionWizardState {
  title: string;
  code: string;
  type: QuestionType;
  body: string;
  options: EditorOption[];
  explanation: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  scoringMode: string;
  scoringConfig: Record<string, any>;
  defaultMaxScore: number;
  defaultMinScore: number;
  defaultTimeSeconds: number;
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
  per_option: Icons.CorrectOne,
  combination: Icons.OneOption,
  position: Icons.Ordering,
  partial_per_pair: Icons.Matching,
  partial_per_blank: Icons.FillBlank,
  partial_per_cell: Icons.Matrix,
  manual: Icons.Eye,
};

const scoringModeLabels: Record<string, string> = {
  per_option: "Харгалзах оноо",
  combination: "Хослолын оноо",
  manual: "Гараар үнэлэх",
};

/**
 * QuestionEditor - Асуулт засварлах болон шинээр үүсгэх Wizard цонхны үндсэн компонент.
 * Энэ компонент нь 3 шаттай (StepOne: Асуултын агуулга, хариулт; StepTwo: Сэдэвтэй холбох; StepThree: Илгээх тойм).
 * 
 * @param mode - "new" эсвэл "edit" төлөвтэй байна.
 * @param questionCode - Засварлах асуултын код.
 * @param question - Засварлах асуултын объект (сонголттой).
 */
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
  
  // Өгөгдсөн question эсвэл questionCode дээр үндэслэн засварлах эх асуултын мэдээллийг тодорхойлно.
  const sourceQuestion = useMemo(() => {
    if (question) return question;
    return mockQuestionBank.find(
      (q) =>
        q.id.toLowerCase() === questionCode?.toLowerCase() ||
        q.code.toLowerCase() === questionCode?.toLowerCase(),
    );
  }, [question, questionCode]);

  const [step, setStep] = useState<WizardStep>(1); // Одоогийн шатыг хадгалах state (1-3)
  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null); // Урьдчилан харах асуулт
  const [submitted, setSubmitted] = useState(false); // Илгээгдсэн эсэхийг хянах
  const [validationTouched, setValidationTouched] = useState(false); // Шалгалтанд хэрэглэгч хүрсэн эсэх
  const [tagInput, setTagInput] = useState(""); // Тагийн текст оруулах хэсэг
  const [state, setState] = useState<QuestionWizardState>(() =>
    buildInitialState(mode, sourceQuestion),
  ); // Асуултын бүх мэдээллийг агуулсан үндсэн state

  // sourceQuestion өөрчлөгдөх үед (жишээ нь async татагдаж дуусах эсвэл өөр асуулт сонгогдох) state-ийг шинэчилнэ.
  useEffect(() => {
    if (sourceQuestion && mode === "edit") {
      setState(buildInitialState(mode, sourceQuestion));
    }
  }, [sourceQuestion, mode]);

  const [topics, setTopics] = useState<any[]>([]); // Сэдвийн сангууд
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]); // Хүндрэлийн түвшин
  const [cognitiveLevels, setCognitiveLevels] = useState<any[]>([]); // Танин мэдэхүйн түвшин
  const [competenceTypes, setCompetenceTypes] = useState<any[]>([]); // Ур чадварын төрлүүд
  const [assessmentContexts, setAssessmentContexts] = useState<any[]>([]); // Үнэлгээний контекстууд
  const [difficultyScales, setDifficultyScales] = useState<any[]>([]); // Хүндрэлийн шатлал
  const [competenceFrameworks, setCompetenceFrameworks] = useState<any[]>([]); // Ур чадварын хүрээ
  const [cognitiveFrameworks, setCognitiveFrameworks] = useState<any[]>([]); // Танин мэдэхүйн хүрээ
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]); // Зорилтот бүлгийн төрөл
  const [audienceLevels, setAudienceLevels] = useState<any[]>([]); // Зорилтот бүлгийн түвшин
  const [selectedContextId, setSelectedContextId] = useState<string>(""); // Сонгогдсон контекст ID
  const [loadingMetadata, setLoadingMetadata] = useState(true); // Мета өгөгдөл уншиж буй төлөв

  // Компонент ачаалагдах үед баазаас сэдэв, хүндрэлийн түвшин, танин мэдэхүйн түвшнүүдийг уншина.
  useEffect(() => {
    async function loadMetadata() {
      try {
        const [t, d, c, comp, ctxs, scales, compFws, audTypes, audLvs, cogFws] = await Promise.all([
          fetchTopics(),
          fetchDifficultyLevels(),
          fetchCognitiveLevels(),
          fetchCompetenceTypes(),
          fetchAssessmentContexts(),
          fetchDifficultyScales(),
          fetchCompetenceFrameworks(),
          fetchAudienceTypes(),
          fetchAudienceLevels(),
          fetchDbData("cognitiveFramework"),
        ]);
        setTopics(t);
        setDifficultyLevels(d);
        setCognitiveLevels(c);
        setCompetenceTypes(comp || []);
        setAssessmentContexts(ctxs || []);
        setDifficultyScales(scales || []);
        setCompetenceFrameworks(compFws || []);
        setAudienceTypes(audTypes || []);
        setAudienceLevels(audLvs || []);
        setCognitiveFrameworks(cogFws || []);

        const existingContextId = sourceQuestion?.topicMappings?.[0]?.assessmentContextId || 
                                 (sourceQuestion as any)?.assessmentContextId;
        if (existingContextId) {
          setSelectedContextId(existingContextId);
        } else if (ctxs && ctxs.length > 0) {
          setSelectedContextId(ctxs[0].id);
        }
      } catch (err) {
        console.error("Metadata load failed", err);
      } finally {
        setLoadingMetadata(false);
      }
    }
    loadMetadata();
  }, [sourceQuestion]);

  const activeContext = useMemo(() => {
    return assessmentContexts.find(ctx => ctx.id === selectedContextId);
  }, [assessmentContexts, selectedContextId]);

  // Одоогийн state дээр үндэслэн асуултын шаардлагыг хангаж буй эсэхийг баталгаажуулна (checklist).
  const validation = validateWizard(state);
  
  // Асуултыг хэрэглэгчид урьдчилан харуулахын тулд State-ээс QuestionBankItem форматын объект бэлдэж previewQuestion-д хадгална.
  const preview = () => setPreviewQuestion(buildQuestionFromState(state, sourceQuestion));
  
  // State-ийг хэсэгчлэн шинэчлэх туслах функц
  const setPartial = (patch: Partial<QuestionWizardState>) =>
    setState((current) => ({ ...current, ...patch }));

  // useEffect - Асуултын төрөл (state.type) болон оноо бодох хэлбэрээс (scoringMode) хамааран
  // нийт авах боломжтой хамгийн их оноо (totalPoints) болон хамгийн бага оноог (correctPoints) динамикаар тооцоолно.
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
      case "LIKERT":
        // Олон эерэг болон сөрөг оноотой сонголтууд байж болох ба шалгуулагч 1 сонголт хийнэ.
        maxScore = state.options.length > 0 ? Math.max(...state.options.map(o => o.score), 0) : 0;
        minScore = state.options.length > 0 ? Math.min(...state.options.map(o => o.score), 0) : 0;
        break;
      case "MULTIPLE_CHOICE":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.filter(o => o.isCorrect || o.score > 0).reduce((sum, o) => sum + (o.score > 0 ? o.score : 0), 0);
          minScore = state.options.filter(o => o.score < 0).reduce((sum, o) => sum + o.score, 0);
        }
        break;
      case "ORDERING":
        maxScore = state.options.reduce((sum, o) => sum + (o.score > 0 ? o.score : 0), 0);
        minScore = 0;
        break;

      case "MATCHING":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.reduce((sum, o) => sum + (o.score > 0 ? o.score : 0), 0);
          minScore = 0;
        }
        break;

      case "FILL_BLANK":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          // Хоосон нүд бүрийн зөвшөөрөгдөх хувилбаруудын хамгийн өндөр онооны нийлбэр
          maxScore = state.options.reduce((sum, o) => {
            const accepted = o.acceptedValues || [];
            const blankMax = accepted.length > 0
              ? Math.max(...accepted.map((av: any) => Number(av.score) || 0))
              : (o.score || 0);
            return sum + blankMax;
          }, 0);
          minScore = 0;
        }
        break;
      case "MATRIX":
        maxScore = state.options.reduce((sum, o) => sum + o.score, 0);
        minScore = 0;
        break;
      case "NUMERIC":      
        maxScore = Math.max(...state.options.map(o => o.score), 0);
        minScore = 0;
        break;

      case "SHORT_TEXT":
      case "CASE_BUNDLE":
      case "ESSAY":
        // Эссэ асуултын хувьд шалгуур бүрийн maxScore-ийн нийлбэрээр бодно.
        const rubrics = state.rubric || [];
        maxScore = rubrics.reduce((sum: number, r: any) => sum + (Number(r.maxScore) || 0), 0);
        minScore = 0;
        break;
    }

    // Хэрэв тооцсон оноо өөрчлөгдсөн байвал state-д нийт оноог шинэчилнэ.
    if (state.defaultMaxScore !== maxScore || state.defaultMinScore !== minScore) {
      setState(curr => ({
        ...curr,
        defaultMaxScore: maxScore,
        defaultMinScore: minScore
      }));
    }
  }, [state.options, state.scoringMode, state.scoringConfig, state.type, state.defaultMaxScore, state.defaultMinScore, state.rubric]);

  // goNext - Wizard-ийн дараагийн шат руу шилжих. Сэдэв заавал сонгосон байхыг шалгана.
  const goNext = () => {
    if (step === 2 && state.mappings.length === 0) {
      setValidationTouched(true);
      showToast("Сэдвийн сангаас дор хаяж нэг дэд сэдэв сонгоно уу.", "warning");
      return;
    }
    setStep((current) => Math.min(3, current + 1) as WizardStep);
  };

  // saveDraft - Ноорог байдлаар асуултын сангийн DB рүү хадгалах
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

  // Ctrl+S / Cmd+S товчлуураар ноорог хадгалах
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDraft();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, sourceQuestion, mode]);

  // requestApproval - Чанарын checklist шалгаад батлуулах хүсэлт илгээх (Status: approval_requested)
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
                const nextIsCorrect = patch.isCorrect !== undefined ? patch.isCorrect : nextScore > 0;
                let nextOptions = current.options.map((option, optionIndex) => {
                  if (optionIndex === index) {
                    const finalValue = patch.value !== undefined ? patch.value : (patch.content !== undefined ? patch.content : option.value);
                    const finalContent = patch.content !== undefined ? patch.content : (patch.value !== undefined ? patch.value : option.content);
                    return { ...option, ...patch, value: finalValue, content: finalContent, isCorrect: nextIsCorrect, score: nextScore };
                  }
                  return option;
                });
                return {
                  ...current,
                  options: nextOptions,
                };
              })
            }
            addOption={() => {
              setState((current) => {
                const nextOptions = [
                  ...current.options,
                  {
                    id: Math.random().toString(36).substring(2, 9),
                    optionKey: "",
                    label: "",
                    value: "",
                    content: "",
                    isCorrect: false,
                    score: 0,
                  },
                ];
                const updatedOptions = nextOptions.map((opt, idx) => ({
                  ...opt,
                  label: String.fromCharCode(65 + idx),
                }));
                return {
                  ...current,
                  options: updatedOptions,
                };
              });
              showToast("Шинэ хариултын сонголт амжилттай нэмэгдлээ.", "success");
            }}
            removeOption={(index) => {
              setState((current) => {
                const nextOptions = current.options.filter((_, optionIndex) => optionIndex !== index);
                const updatedOptions = nextOptions.map((opt, idx) => ({
                  ...opt,
                  label: String.fromCharCode(65 + idx),
                }));
                return {
                  ...current,
                  options: updatedOptions,
                };
              });
            }}
            tagInput={tagInput}
            setTagInput={setTagInput}
            addLeftMatchingOption={() => {
              setState((current) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    id: `L${current.options.length + 1}`,
                    optionKey: `L${current.options.length + 1}`,
                    label: `L${current.options.length + 1}`,
                    value: "",
                    content: "",
                    isCorrect: true,
                    score: 1,
                  },
                ],
              }));
              showToast("Зүүн талын шинэ сурвалж амжилттай нэмэгдлээ.", "success");
            }}
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
              showToast("Баруун талын шинэ хариулт амжилттай нэмэгдлээ.", "success");
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
            competenceTypes={competenceTypes}
            loading={loadingMetadata}
            assessmentContexts={assessmentContexts}
            difficultyScales={difficultyScales}
            competenceFrameworks={competenceFrameworks}
            cognitiveFrameworks={cognitiveFrameworks}
            audienceTypes={audienceTypes}
            audienceLevels={audienceLevels}
            selectedContextId={selectedContextId}
            setSelectedContextId={setSelectedContextId}
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
              <Icons.PrevIcon className="h-4 w-4 stroke-[1.8]" />
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
                <Icons.NextIcon className="h-4 w-4 stroke-[1.8]" />
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

/**
 * StepOne - Wizard-ийн 1-р шат: Асуултын үндсэн мэдээлэл, төрөл, оноо бодох хэлбэр, хариултын сонголтуудыг тохируулах хуудас.
 */
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
  const { showToast } = useToast();
  const getScoringOptions = () => {
    switch (state.type) {
      case "SINGLE_CHOICE":
      case "TRUE_FALSE":
      case "SJT":
      case "LIKERT":
      case "NUMERIC":
        return [{ value: "per_option", label: "Харгалзах оноо" }];

      case "MULTIPLE_CHOICE":
      case "ORDERING":
      case "MATCHING":
      case "FILL_BLANK":
      case "MATRIX":
        return [          
          { value: "per_option", label: "Харгалзах оноо" },
          { value: "combination", label: "Хослолын оноо" }
        ];

      case "SHORT_TEXT":
      case "CASE_BUNDLE":
      case "ESSAY":
        return [{ value: "manual", label: "Гараар үнэлэх" }];
      default:
        return [{ value: "per_option", label: "Харгалзах оноо" }];
    }
  };

  const currentScoringOption = getScoringOptions().find(o => o.value === state.scoringMode);
  const scoringLabel = currentScoringOption ? currentScoringOption.label : state.scoringMode;
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


  const handleTypeChange = (newType: QuestionType) => {
    let nextOptions = [...state.options];
    let nextScoringMode = "per_option";

    switch (newType) {

      case "TRUE_FALSE":
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "A", label: "TRUE", content: "Үнэн", isCorrect: true, score: 1, matchValue: "" },
          { id: "B", label: "FALSE", content: "Худал", isCorrect: false, score: 0, matchValue: "" },
        ];
        break;

      case "SINGLE_CHOICE":
      case "SJT":
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "A", label: "A", content: "", isCorrect: true, score: 1, matchValue: "" },
          { id: "B", label: "B", content: "", isCorrect: false, score: 0, matchValue: "" },
          { id: "C", label: "C", content: "", isCorrect: false, score: 0, matchValue: "" },
          { id: "D", label: "D", content: "", isCorrect: false, score: 0, matchValue: "" },
        ];
        break;
      case "MULTIPLE_CHOICE":
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "A", label: "A", content: "", isCorrect: true, score: 1, matchValue: "" },
          { id: "B", label: "B", content: "", isCorrect: false, score: 0, matchValue: "" },
        ];
        break;
      case "ORDERING":
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "o1", label: "1", content: "", isCorrect: true, score: 1, matchValue: "" },
          { id: "o2", label: "2", content: "", isCorrect: true, score: 1, matchValue: "" },
        ];
        break;
      case "MATCHING":
        nextScoringMode = "per_option";
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
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "blank1", label: "blank1", content: "", isCorrect: true, score: 1, matchValue: "", acceptedValues: [{ value: "", score: 1 }] },
        ];
        break;
      case "MATRIX":
        nextScoringMode = "per_option";
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
        nextScoringMode = "per_option";
        nextOptions = [
          { id: "num-ans", label: "Хариулт", content: "", isCorrect: true, score: state.totalPoints, matchValue: "0" }
        ];
        break;
      case "LIKERT":
        nextScoringMode = "per_option";
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
                    value={state.defaultMaxScore}
                    onChange={(event) => setState({ defaultMaxScore: Number(event.target.value) })}
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
                    value={state.defaultMinScore}
                    onChange={(event) => setState({ defaultMinScore: Number(event.target.value) })}
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
                  value={state.defaultTimeSeconds}
                  onChange={(event) => setState({ defaultTimeSeconds: Number(event.target.value) })}
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

        <CollapsibleCard title="Асуултын үндсэн мэдээлэл" icon={Icons.Type}>
          <div className="grid gap-seek-3 sm:grid-cols-3" role="group">
            <FieldLabel label="Асуултын код">
              <Input
                value={state.code}
                onChange={(event) => setState({ code: event.target.value })}
                placeholder="Жишээ: Q-MATH-01"
              />
            </FieldLabel>
            <div className="sm:col-span-2">
              <FieldLabel label="Асуултын гарчиг">
                <Input
                  value={state.title}
                  onChange={(event) => setState({ title: event.target.value })}
                  placeholder="Жишээ: Квадрат тэгшитгэлийн язгуур"
                />
              </FieldLabel>
            </div>
          </div>
        </CollapsibleCard>

        <CollapsibleCard title="Асуултын агуулга" icon={Icons.BodyIcon}>
          <RichEditor
            value={state.body}
            placeholder="Асуултын агуулгыг энд оруулна уу..."
            onChange={(markdown) => setState({ body: markdown })}
          />
        </CollapsibleCard>

        <CollapsibleCard title="Хавсралт медиа файлууд" subtitle="Асуултанд зураг, аудио, видео файл хавсаргах." icon={Icons.AttachmentIcon} defaultExpanded={false}>
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
                size="sm"
                onClick={() => document.getElementById('media-file-upload')?.click()}
                className="flex items-center gap-seek-2"
              >
                <Icons.FilePlus className="h-4 w-4 stroke-[1.8]" />
                <span>Файл сонгох</span>
              </Button>
            </div>

            {state.media && state.media.length > 0 && (
              <div className="grid gap-seek-3 sm:grid-cols-2 lg:grid-cols-3">
                {state.media.map((m: any, idx: number) => (
                  <div key={m.id || idx} className="flex items-center justify-between p-seek-3 rounded-seek-md border border-border bg-slate-50 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <Icons.AttachmentIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <span className="truncate">{m.storageKey}</span>
                    </div>
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      className="h-6 w-6 p-0 text-xs"
                      onClick={() => setState({ media: state.media.filter((_: any, i: number) => i !== idx) })}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleCard>

        {state.type === "ESSAY" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Үнэлгээний рубрик (Grading Rubric)") + " (" + (state.rubric || []).length + " шалгууртай)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.ListCheck}
          >
            <EssayRubricBuilder
              rubric={state.rubric || []}
              onChange={(nextRubric) => setState({ rubric: nextRubric })}
            />
          </CollapsibleCard>
        ) : state.type === "NUMERIC" ? (
          <CollapsibleCard
            title={questionTypeLabels[state.type] || "Тоон хариулттай асуулт"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.Hash}
          >
            <NumericBuilder
              option={state.options[0] || { id: "num-ans", label: "Хариулт", content: "", isCorrect: true, score: state.totalPoints, matchValue: "0" }}
              totalPoints={state.totalPoints}
              onChange={(nextOpt) => setState({ options: [nextOpt] })}
            />
          </CollapsibleCard>
        ) : state.type === "TRUE_FALSE" ? (
          <CollapsibleCard
            title={questionTypeLabels[state.type] || "Үнэн / Худал сонголт"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.TrueFalse}
          >
            <TrueFalseBuilder
              options={state.options}
              totalPoints={state.totalPoints}
              onChange={(nextOpts) => setState({ options: nextOpts })}
            />
          </CollapsibleCard>
        ) : state.type === "ORDERING" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Эрэмбэлэх даалгавар") + " (" + state.options.length + " алхамтай)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.Ordering}
          >
            <OrderingBuilder
              options={state.options}
              onChange={(nextOpts) => setState({ options: nextOpts })}
            />
          </CollapsibleCard>
        ) : state.type === "SHORT_TEXT" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Богино текст") + " (" + state.options.length + " түлхүүр үгтэй)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.ShortText}
          >
            <ShortTextBuilder
              options={state.options}
              onChange={(nextOpts) => setState({ options: nextOpts })}
            />
          </CollapsibleCard>
        ) : state.type === "MATRIX" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Матриц хүснэгт") + " (" + state.options.length + " мөртэй)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.Matrix}
          >
            <MatrixBuilder
              options={state.options}
              scoringConfig={state.scoringConfig || {}}
              onChange={(nextOpts) => setState({ options: nextOpts })}
              onScoringConfigChange={(nextCfg) => setState({ scoringConfig: nextCfg })}
            />
          </CollapsibleCard>
        ) : state.type === "LIKERT" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Ликерт хэмжүүр") + " (" + state.options.length + " түвшинтэй)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.Likert}
          >
            <LikertBuilder
              options={state.options}
              onChange={(nextOpts) => setState({ options: nextOpts })}
            />
          </CollapsibleCard>
        ) : state.type === "SJT" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Нөхцөлт даалгавар (SJT)") + " (" + state.options.length + " сонголттой)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.Sjt}
          >
            <SjtBuilder
              options={state.options}
              onChange={(nextOpts) => setState({ options: nextOpts })}
            />
          </CollapsibleCard>
        ) : state.type === "CASE_BUNDLE" ? (
          <CollapsibleCard
            title={questionTypeLabels[state.type] || "Кэйс даалгавар"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.CaseBundle}
          >
            <CaseBundleBuilder
              parentId={state.mappings?.[0]?.topicId}
            />
          </CollapsibleCard>
        ) : state.type === "MATCHING" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Харгалзуулах асуулт") + " (" + state.options.length + " сурвалжтай)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.Matching}
          >
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
                  {state.options.map((option, index) => {
                    const isPositive = option.score > 0;
                    const isNegative = option.score < 0;
                    const cardBorderClass = isPositive
                      ? "border-emerald-200 border-l-[4px] border-l-emerald-500 bg-emerald-50/15"
                      : isNegative
                      ? "border-rose-200 border-l-[4px] border-l-rose-500 bg-rose-50/15"
                      : "border-border border-l-[4px] border-l-slate-400 bg-slate-50/20";
                    const indicatorBgClass = isPositive
                      ? "bg-emerald-500 text-white font-bold"
                      : isNegative
                      ? "bg-rose-500 text-white font-bold"
                      : "bg-slate-200 text-slate-700 font-bold";

                    return (
                      <div key={option.id} className={`rounded-seek-md border overflow-hidden ${cardBorderClass}`}>
                        <div className="flex">
                          <div className={`w-10 flex items-center justify-center text-xs tracking-wider flex-shrink-0 select-none ${indicatorBgClass}`}>
                            L{index + 1}
                          </div>
                          <div className="flex-1 p-seek-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-700">Сурвалж L{index + 1}</span>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-slate-600">Оноо:</span>
                                <Input
                                  className="w-16 h-7 text-center text-xs"
                                  type="number"
                                  value={option.score}
                                  onChange={(event) => updateOption(index, { score: Number(event.target.value) })}
                                />
                                <Button type="button" variant="danger" size="sm" 
                                  onClick={() => removeOption(index)} 
                                  className="h-7 w-7 p-0 flex items-center justify-center text-xs">
                                  <Icons.ListX className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <RichEditor
                              compact
                              minHeight="3.5rem"
                              placeholder="Сурвалжийн агуулга (Markdown, $...$)..."
                              value={option.content}
                              onChange={(markdown) => updateOption(index, { content: markdown })}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                    <div key={opt.id} className="rounded-seek-md border border-slate-200 border-l-[4px] border-l-indigo-500 bg-indigo-50/15 overflow-hidden">
                      <div className="flex">
                        <div className="w-10 flex items-center justify-center text-xs font-bold text-white bg-indigo-500 tracking-wider flex-shrink-0 select-none">
                          R{index + 1}
                        </div>
                        <div className="flex-1 p-seek-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-900">Хариулт R{index + 1}</span>
                            <Button type="button" variant="danger" size="sm" onClick={() => removeRightMatchingOption(index)} className="h-7 w-7 p-0 text-xs">✕</Button>
                          </div>
                          <RichEditor
                            compact
                            minHeight="3.5rem"
                            placeholder="Хариултын агуулга (Markdown, $...$)..."
                            value={opt.value}
                            onChange={(markdown) => updateRightMatchingOption(index, markdown)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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
        ) : state.type === "FILL_BLANK" ? (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Хоосон бөглөх асуулт") + " (" + state.options.length + " нүдтэй)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.FillBlank}
          >
            <FillInBlankOptions
              options={state.options}
              onChange={(nextOpts: EditorOption[]) => setState({ options: nextOpts })}
              scoringMode={state.scoringMode}
              combinations={state.scoringConfig?.combinations || []}
              onCombinationsChange={(newCombos: any[]) =>
                setState({
                  scoringConfig: {
                    ...state.scoringConfig,
                    combinations: newCombos,
                  },
                })
              }
            />
          </CollapsibleCard>
        ) : (
          <CollapsibleCard
            title={(questionTypeLabels[state.type] || "Хариултын сонголтууд") + " (" + state.options.length + " сонголттой)"}
            subtitle={"Оноо бодох хэлбэр: " + scoringLabel}
            icon={questionTypeIcons[state.type] || Icons.ListCheck}
            headerActions={
              <Button 
                type="button" 
                variant="primary" 
                onClick={addOption} 
                className="flex items-center gap-seek-2 bg-purple-600 hover:bg-purple-700 text-white font-bold h-10 px-seek-4 shadow-seek-md border-0 text-xs transition-all"
              >
                <Icons.AddRow className="h-5 w-5 stroke-[2] text-white" />
                <span>Сонголт нэмэх</span>
              </Button>
            }
          >
            {state.type === "SINGLE_CHOICE" && (
              <div className="mb-seek-4 rounded-seek-md border border-blue-200 bg-blue-50/50 p-seek-3 text-xs text-blue-900 flex items-center gap-2">
                <span className="font-bold">ℹ️ Нэг сонголттой асуулт:</span>
                <span>Та олон сонголтод ялгаатай эерэг (+2, +1) эсвэл сөрөг (-1, -2) оноо тохируулах боломжтой. Шалгуулагч тестийн үеэр зөвхөн нэг сонголт хийнэ.</span>
              </div>
            )}

            <div className="space-y-seek-4">
              {state.options.map((option, index) => {
                const isPositive = option.score > 0;
                const isNegative = option.score < 0;

                const cardBorderClass = isPositive
                  ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/15"
                  : isNegative
                  ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/15"
                  : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/20";

                const indicatorBgClass = isPositive
                  ? "bg-emerald-500 text-white shadow-sm"
                  : isNegative
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-slate-200 text-slate-700 font-bold";

                return (
                  <div
                    key={`${option.id}-${index}`}
                    className={`rounded-seek-lg border overflow-hidden transition-all duration-200 shadow-seek-xs ${cardBorderClass}`}
                  >
                    <div className="flex">
                      {/* Left Indicator Strip */}
                      <div className={`w-12 flex items-center justify-center font-bold text-base tracking-wider flex-shrink-0 select-none ${indicatorBgClass}`}>
                        {option.label || `O${index + 1}`}
                      </div>

                      {/* Content & Controls */}
                      <div className="flex-1 p-seek-4 space-y-seek-3">
                        <div className="flex flex-wrap items-center justify-between gap-seek-3">
                          <div className="flex items-center gap-2">
                            <Badge variant={isPositive ? "success" : isNegative ? "danger" : "secondary"}>
                              {isPositive ? `Эерэг оноо (+${option.score})` : isNegative ? `Сөрөг оноо (${option.score})` : "0 оноо (Саармаг)"}
                            </Badge>

                            {state.type === "MULTIPLE_CHOICE" && state.scoringMode !== "combination" && (
                              <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none font-semibold text-slate-700 ml-2">
                                <input
                                  type="checkbox"
                                  checked={option.isCorrect}
                                  onChange={(e) => {
                                    const checked = e.target.checked;
                                    updateOption(index, {
                                      isCorrect: checked,
                                      score: checked ? (option.score > 0 ? option.score : 1) : (option.score > 0 ? 0 : option.score),
                                    });
                                  }}
                                  className="rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                                />
                                <span>Зөв хариулт</span>
                              </label>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-slate-700">Оноо:</span>
                            <div className="flex items-center gap-1 bg-white border border-border rounded-seek-md px-2 h-9 w-28 shadow-seek-xs">
                              <Icons.MaxValue className="h-4 w-4 text-slate-400 stroke-[1.8] flex-shrink-0" />
                              <Input
                                className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm font-semibold text-center"
                                type="number"
                                step="any"
                                max={99999}
                                value={option.score}
                                onChange={(event) => {
                                  const num = Number(event.target.value);
                                  updateOption(index, {
                                    score: num,
                                    isCorrect: num > 0,
                                  });
                                }}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="danger"
                              className="flex items-center justify-center h-9 w-9 p-0 shadow-seek-xs"
                              onClick={() => removeOption(index)}
                            >
                              <Icons.ListX className="h-5 w-5 stroke-[1.8] text-white" />
                            </Button>
                          </div>
                        </div>

                        <RichEditor
                          value={option.content}
                          placeholder={`Хариулт ${option.label}-ийн агуулгыг оруулна уу (Markdown, KaTeX $...$, Mermaid)...`}
                          onChange={(markdown) => updateOption(index, { content: markdown })}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
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
          </CollapsibleCard>
        )}

        <CollapsibleCard title="Хариултуудад өгөх тайлбар" subtitle="Зөв болон буруу хариулсан үед харагдах тайлбар." icon={Icons.Ad}>
          <div className="space-y-seek-5">
            <div className="space-y-1">
              <Text className="text-xs font-semibold text-slate-700">Асуултын ерөнхий тайлбар (Explanation):</Text>
              <div className="flex rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-blue-500">
                <div className="w-12 bg-blue-50/20 border-r border-border flex items-center justify-center flex-shrink-0">
                  <Icons.Info className="h-5 w-5 text-white bg-blue-500 rounded-full p-0.5" />
                </div>
                <div className="flex-1 p-seek-3">
                  <RichEditor
                    value={state.explanation}
                    placeholder="Ерөнхий тайлбарыг энд оруулна уу..."
                    onChange={(markdown) => setState({ explanation: markdown })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Text className="text-xs font-semibold text-slate-700">Зөв хариулсан үеийн тайлбар:</Text>
              <div className="flex rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-success">
                <div className="w-12 bg-success-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                  <Icons.Check className="h-5 w-5 text-white bg-success rounded-full p-0.5" />
                </div>
                <div className="flex-1 p-seek-3">
                  <RichEditor
                    value={state.feedbackCorrect}
                    placeholder="Тайлбарыг энд оруулна уу..."
                    onChange={(markdown) => setState({ feedbackCorrect: markdown })}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <Text className="text-xs font-semibold text-slate-700">Буруу хариулсан үеийн тайлбар:</Text>
              <div className="flex rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-danger">
                <div className="w-12 bg-danger-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                  <Icons.Close className="h-5 w-5 text-white bg-danger rounded-full p-0.5" />
                </div>
                <div className="flex-1 p-seek-3">
                  <RichEditor
                    value={state.feedbackIncorrect}
                    placeholder="Тайлбарыг энд оруулна уу..."
                    onChange={(markdown) => setState({ feedbackIncorrect: markdown })}
                  />
                </div>
              </div>
            </div>
          </div>

        </CollapsibleCard>

        
      </main>
    </div>
  );
}

/**
 * StepTwo - Wizard-ийн 2-р шат: Асуултыг сэдвийн сан, чадамжийн хүрээ болон Bloom-ийн түвшинтэй холбох mapping хуудас.
 */
function StepTwo({
  mappings,
  setMappings,
  validationTouched,
  topics,
  difficultyLevels,
  cognitiveLevels,
  competenceTypes,
  loading,
  assessmentContexts = [],
  difficultyScales = [],
  competenceFrameworks = [],
  cognitiveFrameworks = [],
  audienceTypes = [],
  audienceLevels = [],
  selectedContextId = "",
  setSelectedContextId = () => {},
}: {
  mappings: QuestionTopicMapping[];
  setMappings: (mappings: QuestionTopicMapping[]) => void;
  validationTouched: boolean;
  topics: any[];
  difficultyLevels: any[];
  cognitiveLevels: any[];
  competenceTypes: any[];
  loading: boolean;
  assessmentContexts?: any[];
  difficultyScales?: any[];
  competenceFrameworks?: any[];
  cognitiveFrameworks?: any[];
  audienceTypes?: any[];
  audienceLevels?: any[];
  selectedContextId?: string;
  setSelectedContextId?: (id: string) => void;
}) {
  const selectedIds = mappings.map((mapping) => mapping.topicId);
  const [openTopicIds, setOpenTopicIds] = useState<string[]>([]);
  const [selectedAudienceType, setSelectedAudienceType] = useState<string>("");
  const [openAudienceLevelIds, setOpenAudienceLevelIds] = useState<string[]>([]);

  useEffect(() => {
    if (topics && topics.length > 0 && openTopicIds.length === 0) {
      setOpenTopicIds(topics.map(t => t.id));
    }
  }, [topics]);

  useEffect(() => {
    if (audienceTypes && audienceTypes.length > 0 && !selectedAudienceType) {
      setSelectedAudienceType(audienceTypes[0].id);
    }
  }, [audienceTypes, selectedAudienceType]);

  const selectedAudienceLevelIds = useMemo(() => {
    return mappings.map(m => m.audienceLevelId).filter(Boolean) as string[];
  }, [mappings]);

  const nestedAudienceLevels = useMemo(() => {
    if (!selectedAudienceType || !audienceLevels || audienceLevels.length === 0) return [];
    
    const filteredLevels = audienceLevels.filter(al => al.audienceTypeId === selectedAudienceType);
    const nodesMap: Record<string, any> = {};
    const roots: any[] = [];

    filteredLevels.forEach((l) => {
      nodesMap[l.id] = {
        id: l.id,
        label: l.name || l.code,
        children: [],
      };
    });

    filteredLevels.forEach((l) => {
      const node = nodesMap[l.id];
      if (l.parentId && nodesMap[l.parentId]) {
        nodesMap[l.parentId].children = nodesMap[l.parentId].children || [];
        nodesMap[l.parentId].children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }, [selectedAudienceType, audienceLevels]);

  const toggleAudienceLevel = (lvlId: string) => {
    const isSelected = selectedAudienceLevelIds.includes(lvlId);
    setMappings(
      mappings.map(m => ({
        ...m,
        audienceLevelId: isSelected ? undefined : lvlId,
        audienceTypeId: isSelected ? undefined : selectedAudienceType,
      }))
    );
  };

  // Сэдвийн хавтгай жагсаалтыг мод (Tree) хэлбэрт хөрвүүлэх функц
  const computedTopicNodes = useMemo(() => {
    if (!topics || topics.length === 0) return [];
    
    const nodesMap: Record<string, TopicNode> = {};
    const roots: TopicNode[] = [];

    topics.forEach((t) => {
      nodesMap[t.id] = {
        id: t.id,
        label: t.title || t.name,
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

  const getNestedSelectOptions = (items: any[], parentId: string | null = null, depth = 0): any[] => {
    const list: any[] = [];
    const roots = items.filter(i => i.parentId === parentId);
    roots.forEach(node => {
      list.push({
        value: node.id,
        label: `${"\u00A0".repeat(depth * 3)}${node.name || node.label || node.title || node.code}`,
      });
      const children = getNestedSelectOptions(items, node.id, depth + 1);
      list.push(...children);
    });
    return list;
  };

  const toggleTopic = (topic: { id: string; label: string }) => {
    if (selectedIds.includes(topic.id)) {
      setMappings(mappings.filter((mapping) => mapping.topicId !== topic.id));
      return;
    }
    const activeContext = assessmentContexts.find(c => c.id === selectedContextId);
    setMappings([
      ...mappings,
      {
        topicId: topic.id,
        topicName: topic.label,
        bloomLevel: "apply",
        competencyType: "knowledge",
        difficulty: "medium",
        weight: 1,
        assessmentContextId: selectedContextId,
        cognitiveFrameworkId: activeContext?.cognitiveFrameworkId || "",
        difficultyScaleId: activeContext?.difficultyScaleId || "",
        competenceFrameworkId: activeContext?.competenceFrameworkId || "",
        audienceTypeId: activeContext?.audienceTypeId || "",
        audienceLevelId: activeContext?.audienceLevelId || "",
        competencies: [],
      },
    ]);
  };

  const updateMapping = (topicId: string, patch: Partial<QuestionTopicMapping>) =>
    setMappings(
      mappings.map((mapping) =>
        mapping.topicId === topicId ? { ...mapping, ...patch } : mapping,
      ),
    );

  const addCompetence = (topicId: string, compId: string, compName: string) => {
    const mapping = mappings.find(m => m.topicId === topicId);
    if (!mapping) return;
    const comps = mapping.competencies || [];
    if (comps.some(c => c.competenceId === compId)) return;

    updateMapping(topicId, {
      competencies: [...comps, { competenceId: compId, weight: 1.0, name: compName }]
    });
  };

  const removeCompetence = (topicId: string, compId: string) => {
    const mapping = mappings.find(m => m.topicId === topicId);
    if (!mapping) return;
    const comps = mapping.competencies || [];

    updateMapping(topicId, {
      competencies: comps.filter(c => c.competenceId !== compId)
    });
  };

  const updateCompWeight = (topicId: string, compId: string, weight: number) => {
    const mapping = mappings.find(m => m.topicId === topicId);
    if (!mapping) return;
    const comps = mapping.competencies || [];

    updateMapping(topicId, {
      competencies: comps.map(c => c.competenceId === compId ? { ...c, weight } : c)
    });
  };

  return (
    <div className="space-y-seek-5">
      <div className="bg-surface border border-border rounded-seek-lg p-seek-4 shadow-seek-xs space-y-seek-2">
        <Text className="text-sm font-bold text-foreground block mb-2">Үнэлгээний Контекст</Text>
        <Select
          value={selectedContextId}
          onChange={(e) => setSelectedContextId(e.target.value)}
          options={[
            { value: "", label: "Контекст сонгох..." },
            ...assessmentContexts.map(c => ({ value: c.id, label: c.name }))
          ]}
        />
        <p className="text-xs text-muted">
          Сонгосон контекстоос хамааран хүндрэлийн шатлал, танин мэдэхүйн түвшин болон ур чадварын хүрээ автоматаар шүүгдэнэ.
        </p>
      </div>

      <div className="grid gap-seek-5 xl:grid-cols-[20rem_minmax(0,1fr)]">
        <div className="space-y-seek-4">
          <CollapsibleCard title="Сэдвийн сан" subtitle="Дэд сэдэв бүрийг олноор сонгож асуултанд холбоно." icon={Icons.Menu}>
            <div className="space-y-seek-3">
              {loading ? (
                <div className="flex items-center justify-center py-seek-8">
                  <Text variant="muted" className="text-xs">Сэдвийн санг уншиж байна...</Text>
                </div>
              ) : (
                <ExplorerTopicTree
                  nodes={computedTopicNodes as any}
                  selectedIds={selectedIds}
                  openIds={openTopicIds}
                  onToggle={(topicId) => {
                    const targetTopic = topics.find(t => t.id === topicId);
                    if (targetTopic) {
                      toggleTopic({ id: targetTopic.id, label: targetTopic.title || targetTopic.name });
                    }
                  }}
                  onToggleOpen={(topicId) => {
                    setOpenTopicIds(prev => 
                      prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]
                    );
                  }}
                />
              )}
            </div>
            {validationTouched && mappings.length === 0 && (
              <Text className="mt-seek-3 text-sm font-semibold text-danger">
                Дор хаяж нэг дэд сэдэв сонгоно уу.
              </Text>
            )}
          </CollapsibleCard>

          <CollapsibleCard title="Зорилтот бүлэг" subtitle="Зорилтот бүлгийн түвшинг сонгож холбоно." icon={Icons.UserGroup}>
            <div className="space-y-seek-3">
              <Select
                value={selectedAudienceType}
                onChange={(e) => {
                  setSelectedAudienceType(e.target.value);
                }}
                options={[
                  { value: "", label: "Төрөл сонгох..." },
                  ...audienceTypes.map((t: any) => ({ value: t.id, label: t.name }))
                ]}
              />
              {selectedAudienceType && nestedAudienceLevels.length > 0 && (
                <div className="mt-seek-2 border border-border/40 rounded p-seek-2 bg-muted-background/10">
                  <ExplorerTopicTree
                    nodes={nestedAudienceLevels as any}
                    selectedIds={selectedAudienceLevelIds}
                    openIds={openAudienceLevelIds}
                    onToggle={(lvlId) => toggleAudienceLevel(lvlId)}
                    onToggleOpen={(lvlId) => {
                      setOpenAudienceLevelIds(prev => 
                        prev.includes(lvlId) ? prev.filter(id => id !== lvlId) : [...prev, lvlId]
                      );
                    }}
                  />
                </div>
              )}
            </div>
          </CollapsibleCard>
        </div>

      <main className="space-y-seek-4">
        <CollapsibleCard title="Сонгосон дэд сэдвийн mapping" subtitle="Сонгосон сэдэв бүрийн хүндрэл, танин мэдэхүйн түвшин болон үнэлэх ур чадваруудыг нарийвчлан тохируулна." icon={Icons.Settings}>
          {mappings.length === 0 ? (
            <div className="rounded-seek-lg border border-dashed border-border bg-muted-background p-seek-8 text-center">
              <Text className="font-semibold">Сэдэв сонгоогүй байна</Text>
              <Text variant="muted" className="mt-1 text-sm">
                Зүүн талын сэдвийн сангаас дэд сэдэв сонгоход энд тохиргоо гарна.
              </Text>
            </div>
          ) : (
            <div className="space-y-seek-4">
              {mappings.map((mapping) => {
                const mappingComps = mapping.competencies || [];

                return (
                  <div
                    key={mapping.topicId}
                    className="rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-xs space-y-seek-4"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-border/50 pb-seek-3">
                      <div>
                        <Text className="font-bold text-foreground">{mapping.topicName}</Text>
                        <Text variant="muted" className="text-xs font-mono">
                          ID: {mapping.topicId}
                        </Text>
                      </div>
                      <IconButton
                        ariaLabel="Устгах"
                        onClick={() => toggleTopic({ id: mapping.topicId, label: mapping.topicName })}
                        className="text-danger hover:bg-danger-background hover:bg-surface-hover"
                      >
                        <Icons.Trash size={16} />
                      </IconButton>
                    </div>

                    {/* Classifications Grid for Frameworks & Scales */}
                    <div className="grid gap-seek-4 sm:grid-cols-2 md:grid-cols-4">
                      {/* Cognitive Framework & Level */}
                      <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Танин мэдэхүйн хүрээ</span>
                          <Select
                            value={mapping.cognitiveFrameworkId || ""}
                            onChange={(e) => {
                              const fwId = e.target.value;
                              updateMapping(mapping.topicId, { 
                                cognitiveFrameworkId: fwId,
                                bloomLevel: "" // reset level on framework change
                              });
                            }}
                            options={[
                              { value: "", label: "Хүрээ сонгох..." },
                              ...cognitiveFrameworks.map((cf: any) => ({ value: cf.id, label: cf.name }))
                            ]}
                          />
                        </label>
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Танин мэдэхүйн түвшин</span>
                          <Select
                            value={mapping.bloomLevel}
                            onChange={(e) => updateMapping(mapping.topicId, { bloomLevel: e.target.value })}
                            options={[
                              { value: "", label: "Түвшин сонгох..." },
                              ...cognitiveLevels
                                .filter((cl: any) => cl.cognitiveFrameworkId === mapping.cognitiveFrameworkId)
                                .map((cl: any) => ({ value: cl.code, label: cl.name }))
                            ]}
                            disabled={!mapping.cognitiveFrameworkId}
                          />
                        </label>
                      </div>

                      {/* Difficulty Scale & Level */}
                      <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Хүндрэлийн шатлал</span>
                          <Select
                            value={mapping.difficultyScaleId || ""}
                            onChange={(e) => {
                              const dsId = e.target.value;
                              updateMapping(mapping.topicId, { 
                                difficultyScaleId: dsId,
                                difficulty: "" // reset level on scale change
                              });
                            }}
                            options={[
                              { value: "", label: "Шатлал сонгох..." },
                              ...difficultyScales.map((ds: any) => ({ value: ds.id, label: ds.name }))
                            ]}
                          />
                        </label>
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Хүндрэлийн түвшин</span>
                          <Select
                            value={mapping.difficulty}
                            onChange={(e) => updateMapping(mapping.topicId, { difficulty: e.target.value })}
                            options={[
                              { value: "", label: "Түвшин сонгох..." },
                              ...difficultyLevels
                                .filter((dl: any) => dl.difficultyScaleId === mapping.difficultyScaleId)
                                .map((dl: any) => ({ value: dl.code, label: dl.name }))
                            ]}
                            disabled={!mapping.difficultyScaleId}
                          />
                        </label>
                      </div>

                      {/* Audience Type & Level */}
                      <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Зорилтот бүлгийн төрөл</span>
                          <Select
                            value={mapping.audienceTypeId || ""}
                            onChange={(e) => {
                              const atId = e.target.value;
                              updateMapping(mapping.topicId, { 
                                audienceTypeId: atId,
                                audienceLevelId: "" // reset level on type change
                              });
                            }}
                            options={[
                              { value: "", label: "Төрөл сонгох..." },
                              ...audienceTypes.map((at: any) => ({ value: at.id, label: at.name }))
                            ]}
                          />
                        </label>
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Зорилтот бүлгийн түвшин</span>
                          <Select
                            value={mapping.audienceLevelId || ""}
                            onChange={(e) => updateMapping(mapping.topicId, { audienceLevelId: e.target.value })}
                            options={[
                              { value: "", label: "Түвшин сонгох..." },
                              ...getNestedSelectOptions(
                                audienceLevels.filter((al: any) => al.audienceTypeId === mapping.audienceTypeId),
                                null
                              )
                            ]}
                            disabled={!mapping.audienceTypeId}
                          />
                        </label>
                      </div>

                      {/* Competence Framework & Weight */}
                      <div className="space-y-seek-2 border border-border/40 p-seek-3 rounded bg-muted-background/20">
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Ур чадварын хүрээ</span>
                          <Select
                            value={mapping.competenceFrameworkId || ""}
                            onChange={(e) => {
                              const cfId = e.target.value;
                              updateMapping(mapping.topicId, { 
                                competenceFrameworkId: cfId,
                                competencies: [] // clear competencies on framework change
                              });
                            }}
                            options={[
                              { value: "", label: "Хүрээ сонгох..." },
                              ...competenceFrameworks.map((cf: any) => ({ value: cf.id, label: cf.name }))
                            ]}
                          />
                        </label>
                        <label className="space-y-seek-1 block">
                          <span className="font-sans text-[10px] font-bold text-muted-foreground uppercase">Жин (Weight)</span>
                          <Input
                            type="number"
                            min={0.1}
                            max={1.0}
                            step={0.1}
                            value={mapping.weight}
                            onChange={(event) =>
                              updateMapping(mapping.topicId, {
                                weight: Number(event.target.value),
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>

                    {/* Competence Mapping Section */}
                    <div className="bg-muted-background/40 p-seek-3 rounded-seek-md space-y-seek-3 border border-border/40">
                      <div className="flex items-center justify-between">
                        <Text className="text-xs font-bold text-foreground">Үнэлэх ур чадварууд (Competencies)</Text>
                        
                        {/* Competence Add dropdown */}
                        <div className="relative w-48">
                          <Select
                            value=""
                            aria-label="Ур чадвар нэмэх"
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) return;
                              const targetComp = competenceTypes.find(c => c.id === val);
                              if (targetComp) {
                                addCompetence(mapping.topicId, targetComp.id, targetComp.name);
                              }
                            }}
                            options={[
                              { value: "", label: "+ Ур чадвар нэмэх" },
                              ...competenceTypes
                                .filter(c => c.competenceFrameworkId === mapping.competenceFrameworkId && !mappingComps.some(mc => mc.competenceId === c.id))
                                .map(c => ({ value: c.id, label: c.name }))
                            ]}
                            disabled={!mapping.competenceFrameworkId}
                          />
                        </div>
                      </div>

                      {mappingComps.length === 0 ? (
                        <Text variant="muted" className="text-xs italic py-seek-2">
                          Ур чадвар холбоогүй байна. Баруун талын цэснээс сонгож нэмнэ үү.
                        </Text>
                      ) : (
                        <div className="space-y-seek-2">
                          {mappingComps.map((c) => (
                            <div 
                              key={c.competenceId} 
                              className="flex items-center justify-between gap-seek-4 bg-surface px-seek-3 py-seek-2 rounded border border-border/80 text-xs"
                            >
                              <div className="flex-1">
                                <span className="font-medium text-foreground">{c.name}</span>
                                <span className="ml-seek-2 font-mono text-[10px] text-muted-foreground">ID: {c.competenceId}</span>
                              </div>
                              <div className="flex items-center gap-seek-3">
                                <span className="text-muted-foreground text-[10px] font-semibold">Жин:</span>
                                <Input
                                  type="number"
                                  min={0.1}
                                  max={1.0}
                                  step={0.1}
                                  className="w-20 text-xs h-7 py-1 px-2"
                                  value={c.weight}
                                  onChange={(e) => updateCompWeight(mapping.topicId, c.competenceId, Number(e.target.value))}
                                />
                                <IconButton
                                  ariaLabel="Ур чадвар хасах"
                                  onClick={() => removeCompetence(mapping.topicId, c.competenceId)}
                                  className="text-danger hover:bg-danger-background hover:bg-surface-hover h-7 w-7"
                                >
                                  <Icons.Close size={14} />
                                </IconButton>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CollapsibleCard>
      </main>
    </div>
    </div>
  );
}

/**
 * StepThree - Wizard-ийн 3-р шат: Илгээхийн өмнөх эцсийн тойм, чанарын шалгах хуудас (checklist) болон workflow comment бичих хуудас.
 */
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
            <SummaryTile label="Оноо/хугацаа" value={`${state.defaultMaxScore} оноо · ${state.defaultTimeSeconds} сек`} />
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
        optionKey: option.optionKey || option.id,
        label: option.label,
        value: option.value || option.content || "",
        content: option.content || option.value || "",
        isCorrect: Boolean(option.isCorrect),
        score: option.score ?? (option.isCorrect ? (question.defaultMaxScore ?? question.points ?? 1) : 0),
        matchValue: option.matchValue || "",
        acceptedValues: option.acceptedValues || [],
      }))
    : [
        { id: "a", optionKey: "a", label: "A", value: "x = 2", content: "x = 2", isCorrect: true, score: 1, matchValue: "" },
        { id: "b", optionKey: "b", label: "B", value: "x = 3", content: "x = 3", isCorrect: true, score: 1, matchValue: "" },
        { id: "c", optionKey: "c", label: "C", value: "x = 1", content: "x = 1", isCorrect: false, score: 0, matchValue: "" },
        { id: "d", optionKey: "d", label: "D", value: "x = 6", content: "x = 6", isCorrect: false, score: 0, matchValue: "" },
      ];

  const rawScoringConfig =
    question?.scoringConfig ||
    (question as any)?.contentJson?.scoringConfig ||
    (question as any)?.contentJson?.payload?.scoringConfig ||
    {};

  const scoringMode =
    question?.scoringMode ||
    rawScoringConfig.scoringMode ||
    (question as any)?.contentJson?.scoringMode ||
    (question as any)?.contentJson?.payload?.scoringMode ||
    "per_option";

  return {
    title: question?.title ?? "Квадрат тэгшитгэлийн язгуур",
    code: question?.code ?? `Q-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    type: question?.type ?? "MULTIPLE_CHOICE",
    body: question?.body ?? question?.stem ?? "Дараах тэгшитгэлийн язгууруудыг олно уу: $$x^2 - 5x + 6 = 0$$",
    options,
    explanation: question?.explanation || question?.feedback || "Виетийн теоремоор үржвэр нь 6, нийлбэр нь 5 байх тоонууд нь 2 ба 3 юм.",
    feedbackCorrect:
      question?.feedbackCorrect ||
      "Виетийн теоремоор үржвэр нь 6, нийлбэр нь 5 байх тоонууд нь 2 ба 3 юм.",
    feedbackIncorrect:
      question?.feedbackIncorrect ||
      "Буруу хариулсан үед язгуурын нийлбэр ба үржвэрийг дахин шалгана.",
    scoringMode,
    scoringConfig: (() => {
      const raw = rawScoringConfig;
      return {
        ...raw,
        scoringMode,
        rightOptions: raw.rightOptions || (
          question?.type === "MATCHING"
            ? (question.options || []).map((o, idx) => ({ id: `R${idx + 1}`, value: o.matchValue || o.content })).filter(o => o.value)
            : []
        ),
        combinations: (() => {
          if (raw.combinations && Array.isArray(raw.combinations) && raw.combinations.length > 0) {
            return raw.combinations.map((c: any) => ({
              answers: Array.isArray(c.answers) ? c.answers : (Array.isArray(c.ids) ? c.ids : []),
              ids: Array.isArray(c.ids) ? c.ids : (Array.isArray(c.answers) ? c.answers : []),
              score: Number(c.score ?? 1)
            }));
          }
          if (question?.type === "MATCHING") {
            const defaultPairs = (question.options || []).map((o, idx) => `${o.id}:R${idx + 1}`);
            return [{ ids: defaultPairs, answers: defaultPairs, score: 1 }];
          }
          return [];
        })()
      };
    })(),
    defaultMaxScore: question?.defaultMaxScore ?? question?.points ?? 3,
    defaultMinScore: question?.defaultMinScore ?? question?.minPoints ?? 0,
    defaultTimeSeconds: question?.defaultTimeSeconds ?? question?.durationSeconds ?? 60,
    tags: question?.tags ?? ["мат", "комбинаторик"],
    mappings:
      question?.topicMappings && question.topicMappings.length > 0
        ? question.topicMappings
        : [
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
    optionKey: option.optionKey || option.id,
    label: option.label,
    value: option.value || option.content,
    content: option.content || option.value,
    isCorrect: option.isCorrect,
    score: option.score,
    matchValue: option.matchValue,
    acceptedValues: option.acceptedValues || [],
  }));

  return {
    id: source?.id ?? "preview-question",
    code: state.code,
    title: state.title,
    body: state.body,
    stem: state.body,
    type: state.type,
    status: state.status,
    defaultMaxScore: state.defaultMaxScore,
    defaultMinScore: state.defaultMinScore,
    defaultTimeSeconds: state.defaultTimeSeconds,
    points: state.defaultMaxScore,
    minPoints: state.defaultMinScore,
    durationSeconds: state.defaultTimeSeconds,
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
    explanation: state.explanation,
    feedback: state.explanation,
    feedbackCorrect: state.feedbackCorrect,
    feedbackIncorrect: state.feedbackIncorrect,
    media: (state.media || []).map((m: any) => {
      let type: "image" | "audio" | "video" | "file" = "file";
      const mType = (m.mediaType || m.type || "").toLowerCase();
      if (mType === "image" || mType === "audio" || mType === "video") {
        type = mType as any;
      }
      const name = m.name || m.metadata?.name || m.storageKey?.split("/").pop() || "media_file";
      const url = m.url || `/api/v1/file/objects?storageKey=${encodeURIComponent(m.storageKey)}`;
      return { 
        type, 
        name, 
        url, 
        storageKey: m.storageKey,
        mediaType: m.mediaType || type.toUpperCase(),
        mimeType: m.mimeType || null,
        sizeBytes: m.sizeBytes || null,
        orderIndex: m.orderIndex || 1,
        metadata: m.metadata || {}
      };
    }),
    createdBy: source?.createdBy ?? "Ассессор Б.",
    updatedBy: "Ассессор Б.",
    createdAt: source?.createdAt ?? "2026-07-31 10:00",
    updatedAt: "2026-07-31 10:00",
    versionNumber: source?.versionNumber,
    versionStatus: source?.versionStatus,
    versions: source?.versions ?? [],
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
  const hasOptionsOrRubric = (() => {
    if (state.type === "ESSAY") {
      return Array.isArray(state.rubric) && state.rubric.length > 0;
    }
    if (state.type === "SHORT_TEXT" || state.type === "CASE_BUNDLE") {
      return true;
    }
    if (state.type === "NUMERIC") {
      return (state.options[0]?.value || state.options[0]?.content || "").trim().length > 0;
    }
    if (state.scoringMode === "combination") {
      return (state.scoringConfig?.combinations || []).length > 0;
    }
    return state.options.some((option) => option.isCorrect && option.score > 0) || state.options.length > 0;
  })();

  const items = [
    { label: "Асуултын гарчиг бөглөгдсөн", ok: state.title.trim().length > 0 },
    { label: "Асуултын агуулга бөглөгдсөн", ok: state.body.trim().length > 0 },
    {
      label: "Зөв хариулт болон оноо тохирсон",
      ok: Boolean(hasOptionsOrRubric),
    },
    { label: "Сэдвийн mapping сонгосон", ok: state.mappings.length > 0 },
    { label: "Feedback/тайлбар бөглөгдсөн", ok: state.explanation.trim().length > 0 || state.feedbackCorrect.trim().length > 0 || state.feedbackIncorrect.trim().length > 0 },
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

/**
 * CollapsibleCard - Windows цонхтой ижил төстэй саарал толгойтой, 
 * баруун талын Chevron toggle товчлуураар нээгдэж хаагддаг collapsible карт компонент.
 * 
 * @param title - Картны үндсэн гарчиг
 * @param subtitle - Картны тайлбар текст
 * @param icon - Толгой хэсэгт харагдах икон
 * @param headerActions - Толгой хэсэгт баруун талд байрлах нэмэлт товчлуурууд
 * @param defaultExpanded - Эхлээд карт нээлттэй байх эсэх (Default: true)
 */
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

/**
 * CombinationMCBuilder - Олон сонголттой (MULTIPLE_CHOICE) асуултын хувьд 
 * сонголтуудын хослолд оноо өгөх логикийг удирдах туслах компонент.
 * 
 * @param options - Боломжит асуултын сонголтууд (Badge хэлбэрээр сонгогдох)
 * @param combinations - Одоо үүсгэгдсэн байгаа хослолууд болон тэдгээрийн оноо
 * @param onChange - Хослолуудыг шинэчлэх callback
 */
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
          <div key={combIdx} className={`rounded-seek-md border p-seek-3 ${combo.score > 0 ? "border-success/20 bg-success/5" : combo.score < 0 ? "border-danger/20 bg-danger/5" : "border-slate-200 bg-slate-50"}`}>
            <div className="mb-seek-2 flex items-center justify-between">
              <span className={`text-xs font-semibold ${combo.score > 0 ? "text-success" : combo.score < 0 ? "text-danger" : "text-slate-500"}`}>Хослол {combIdx + 1}</span>
              <Button type="button" variant="danger" size="sm" onClick={() => removeCombination(combIdx)} className="h-6 w-6 p-0 text-xs">✕</Button>
            </div>
            <div className="space-y-seek-3">
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
              </div>
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-dashed border-slate-200">
                <span className="text-xs font-semibold text-slate-700">Оноо:</span>
                <div className={`flex items-center gap-1 bg-slate-50 border rounded-seek-md px-2 h-10 w-32 ${
                  combo.score > 0 ? "border-success/30" : combo.score < 0 ? "border-danger/30" : "border-border"
                }`}>
                  <Icons.MaxValue className={`h-4 w-4 stroke-[1.8] flex-shrink-0 ${
                    combo.score > 0 ? "text-success" : combo.score < 0 ? "text-danger" : "text-slate-400"
                  }`} />
                  <Input
                    type="number"
                    step="any"
                    value={combo.score}
                    onChange={(e) => setScore(combIdx, Number(e.target.value))}
                    className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-sm font-semibold text-center"
                  />
                </div>
              </div>
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

function CombinationFITBBuilder({
  blankCount,
  combinations,
  onChange,
}: {
  blankCount: number;
  combinations: any[];
  onChange: (c: any[]) => void;
}) {
  function addCombination() {
    onChange([...combinations, { answers: Array(blankCount).fill(""), score: 1 }]);
  }
  function removeCombination(idx: number) {
    onChange(combinations.filter((_, i) => i !== idx));
  }
  function setAnswer(combIdx: number, blankIdx: number, value: string) {
    onChange(
      combinations.map((c, i) =>
        i === combIdx ? { ...c, answers: c.answers.map((a: any, bi: number) => (bi === blankIdx ? value : a)) } : c
      )
    );
  }
  function setScore(combIdx: number, score: number) {
    onChange(combinations.map((c, i) => (i === combIdx ? { ...c, score } : c)));
  }

  return (
    <div className="space-y-seek-3">
      <div className="grid gap-seek-3 md:grid-cols-2">
        {combinations.map((combo, combIdx) => {
          const answers = combo.answers || combo.ids || [];
          return (
            <div key={combIdx} className="rounded-seek-md border border-border bg-slate-50/50 p-seek-3 space-y-seek-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Хослол {combIdx + 1}</span>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeCombination(combIdx)}
                  className="h-6 w-6 p-0 flex items-center justify-center text-xs"
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-seek-2">
                {Array.from({ length: blankCount }, (_, bi) => (
                  <div key={bi} className="flex items-center gap-seek-2">
                    <span className="w-16 text-xs text-slate-500 font-mono">blank{bi + 1}:</span>
                    <Input
                      type="text"
                      value={answers[bi] ?? ""}
                      onChange={(e) => setAnswer(combIdx, bi, e.target.value)}
                      placeholder={`Хоосон зайны утга`}
                      className="flex-1 h-8 text-xs bg-white"
                    />
                  </div>
                ))}
              </div>
              <div className="pt-seek-2 border-t border-slate-100 flex items-center justify-end gap-seek-2">
                <span className="text-xs text-slate-500">Оноо:</span>
                <Input
                  type="number"
                  value={combo.score}
                  onChange={(e) => setScore(combIdx, Number(e.target.value))}
                  className="w-16 h-8 text-center text-xs bg-white"
                />
              </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={addCombination}>
        + Хослол нэмэх
      </Button>
    </div>
  );
}

function FillInBlankOptions({
  options,
  onChange,
  scoringMode,
  combinations,
  onCombinationsChange,
}: {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
  scoringMode: string;
  combinations: any[];
  onCombinationsChange: (c: any[]) => void;
}) {
  function addBlank() {
    const n = options.length + 1;
    onChange([
      ...options,
      {
        id: `blank${n}`,
        label: `blank${n}`,
        content: "",
        isCorrect: true,
        score: 1,
        matchValue: "insensitive",
        acceptedValues: [{ value: "", score: 1, caseSensitive: false }],
      },
    ]);
  }

  function removeBlank(idx: number) {
    if (options.length <= 1) return;
    onChange(
      options
        .filter((_, i) => i !== idx)
        .map((o, i) => ({
          ...o,
          id: `blank${i + 1}`,
          label: `blank${i + 1}`,
        }))
    );
  }

  function addAcceptedValue(blankIdx: number) {
    onChange(
      options.map((o, i) =>
        i === blankIdx
          ? {
              ...o,
              acceptedValues: [...(o.acceptedValues ?? []), { value: "", score: 1, caseSensitive: false }],
            }
          : o
      )
    );
  }

  function removeAcceptedValue(blankIdx: number, valIdx: number) {
    onChange(
      options.map((o, i) =>
        i === blankIdx
          ? {
              ...o,
              acceptedValues: (o.acceptedValues ?? []).filter((_, vi) => vi !== valIdx),
            }
          : o
      )
    );
  }

  function updateAcceptedValue(blankIdx: number, valIdx: number, field: "value" | "score" | "caseSensitive", val: any) {
    onChange(
      options.map((o, i) =>
        i === blankIdx
          ? {
              ...o,
              acceptedValues: (o.acceptedValues ?? []).map((av, vi) => (vi === valIdx ? { ...av, [field]: val } : av)),
            }
          : o
      )
    );
  }

  return (
    <div className="space-y-seek-4">
      {/* Help Banner */}
      <div className="rounded-seek-md border border-teal-200 bg-teal-50/50 p-seek-3 text-xs text-teal-900 space-y-1">
        <div className="font-bold flex items-center gap-1.5">
          <span>ℹ️ Нөхөх асуултын заавар:</span>
        </div>
        <div>
          Асуултын их бие (Stem) дотор <code>{`{{blank_1}}`}</code> эсвэл <code>{`[[1]]`}</code>, <code>{`{{blank_2}}`}</code> эсвэл <code>{`[[2]]`}</code> гэж бичиж хоосон зайг үүсгэнэ. Нүд тус бүрд олон зөвшөөрөгдөх хариулт болон ялгаатай оноо тохируулах боломжтой.
        </div>
      </div>

      {scoringMode === "per_option" ? (
        <>
          <div className="space-y-seek-4">
            {options.map((opt, idx) => {
              const maxBlankScore = (opt.acceptedValues ?? []).length > 0
                ? Math.max(...(opt.acceptedValues ?? []).map((av: any) => Number(av.score) || 0))
                : (opt.score || 1);

              return (
                <div key={opt.id || idx} className="overflow-hidden rounded-seek-lg border border-border border-l-[5px] border-l-teal-500 bg-white shadow-seek-xs">
                  <div className="flex items-center justify-between border-b border-border bg-teal-50/40 px-seek-4 py-seek-3">
                    <div className="flex items-center gap-seek-2">
                      <Badge variant="success">Хоосон зай #{idx + 1}</Badge>
                      <code className="text-xs font-mono font-bold text-teal-800 bg-teal-100/60 px-1.5 py-0.5 rounded">
                        {`{{blank_${idx + 1}}}`} / {`[[${idx + 1}]]`}
                      </code>
                      <span className="text-xs text-slate-500 font-medium ml-2">
                        (Авах дээд оноо: <strong>{maxBlankScore}</strong> оноо, {(opt.acceptedValues ?? []).length} хувилбартай)
                      </span>
                    </div>
                    {options.length > 1 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeBlank(idx)}
                        className="h-7 px-seek-2 text-xs"
                      >
                        ✕ Нүд хасах
                      </Button>
                    )}
                  </div>
                  <div className="space-y-seek-3 p-seek-4 bg-white">
                    {(opt.acceptedValues ?? []).map((av: any, valIdx: number) => (
                      <div key={valIdx} className="flex flex-wrap items-center gap-seek-3 pb-seek-2 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex-1 min-w-[200px]">
                          <Input
                            placeholder="Зөвшөөрөгдөх хариулт (жишээ нь: 4, дөрөв, four)..."
                            value={av.value}
                            onChange={(e) => updateAcceptedValue(idx, valIdx, "value", e.target.value)}
                          />
                        </div>
                        <div className="flex shrink-0 items-center gap-seek-2 bg-slate-50 border border-border rounded-seek-md px-seek-3 h-10 w-32">
                          <span className="text-xs font-semibold text-slate-500">Оноо:</span>
                          <Input
                            type="number"
                            step="any"
                            value={av.score}
                            onChange={(e) => updateAcceptedValue(idx, valIdx, "score", Number(e.target.value))}
                            className="w-full border-0 bg-transparent p-0 text-center text-sm font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                          />
                        </div>
                        <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(av.caseSensitive)}
                            onChange={(e) => updateAcceptedValue(idx, valIdx, "caseSensitive", e.target.checked)}
                            className="rounded text-teal-600 focus:ring-teal-500 h-3.5 w-3.5"
                          />
                          <span>Том/жижиг үсэг ялгах</span>
                        </label>
                        {(opt.acceptedValues ?? []).length > 1 && (
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeAcceptedValue(idx, valIdx)}
                            className="shrink-0 h-8 w-8 p-0 text-xs flex items-center justify-center"
                          >
                            ✕
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className="pt-seek-2 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addAcceptedValue(idx)}
                        className="text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        + Хариултын хувилбар нэмэх
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Button type="button" variant="outline" onClick={addBlank} className="flex items-center gap-2">
            <span>+ Дараагийн хоосон нүд (Blank) нэмэх</span>
          </Button>
        </>
      ) : (
        <>
          <div className="mb-seek-3 flex flex-wrap items-center gap-seek-2 border-b border-border pb-seek-3">
            <span className="text-xs font-semibold text-slate-500">Хоосон нүднүүд:</span>
            {options.map((_, idx) => (
              <Badge key={idx} variant="secondary">
                {`{{blank_${idx + 1}}}`}
              </Badge>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addBlank}>
              + Нүд нэмэх
            </Button>
            {options.length > 1 && (
              <Button type="button" variant="danger" size="sm" onClick={() => removeBlank(options.length - 1)}>
                − Хасах
              </Button>
            )}
          </div>
          <CombinationFITBBuilder
            blankCount={options.length}
            combinations={combinations}
            onChange={onCombinationsChange}
          />
        </>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------------------------------
// Үнэн/Худал (True/False) асуултын хувьд зөв хариулт болон оноог тохируулах туслах компонент.
// ----------------------------------------------------------------------------------------------

function TrueFalseBuilder({
  options,
  onChange,
  totalPoints = 1,
}: {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
  totalPoints?: number;
}) {
  const trueOpt = options[0] || { id: "A", label: "TRUE", content: "Үнэн", isCorrect: true, score: 1, matchValue: "" };
  const falseOpt = options[1] || { id: "B", label: "FALSE", content: "Худал", isCorrect: false, score: 0, matchValue: "" };

  const updateTrueOpt = (patch: Partial<EditorOption>) => {
    const nextScore = patch.score !== undefined ? patch.score : trueOpt.score;
    const nextIsCorrect = nextScore > 0;
    const finalValue = patch.value !== undefined ? patch.value : (patch.content !== undefined ? patch.content : trueOpt.value);
    const finalContent = patch.content !== undefined ? patch.content : (patch.value !== undefined ? patch.value : trueOpt.content);
    
    const nextTrue = { ...trueOpt, ...patch, value: finalValue, content: finalContent, isCorrect: nextIsCorrect, score: nextScore };
    const nextFalse = {
      ...falseOpt,
      isCorrect: !nextIsCorrect,
      score: nextIsCorrect ? (falseOpt.score > 0 ? 0 : falseOpt.score) : falseOpt.score,
    };
    
    if (!nextIsCorrect && nextFalse.score > 0) {
      nextFalse.isCorrect = true;
    }
    
    onChange([nextTrue, nextFalse]);
  };

  const updateFalseOpt = (patch: Partial<EditorOption>) => {
    const nextScore = patch.score !== undefined ? patch.score : falseOpt.score;
    const nextIsCorrect = nextScore > 0;
    const finalValue = patch.value !== undefined ? patch.value : (patch.content !== undefined ? patch.content : falseOpt.value);
    const finalContent = patch.content !== undefined ? patch.content : (patch.value !== undefined ? patch.value : falseOpt.content);
    
    const nextFalse = { ...falseOpt, ...patch, value: finalValue, content: finalContent, isCorrect: nextIsCorrect, score: nextScore };
    const nextTrue = {
      ...trueOpt,
      isCorrect: !nextIsCorrect,
      score: nextIsCorrect ? (trueOpt.score > 0 ? 0 : trueOpt.score) : trueOpt.score,
    };
    
    if (!nextIsCorrect && nextTrue.score > 0) {
      nextTrue.isCorrect = true;
    }
    
    onChange([nextTrue, nextFalse]);
  };

  return (
    <div className="grid gap-seek-4 md:grid-cols-2">
      {/* TRUE Option */}
      <div className={`rounded-seek-lg border overflow-hidden transition-all duration-200 shadow-seek-xs ${
        trueOpt.score > 0
          ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/15"
          : trueOpt.score < 0
          ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/15"
          : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/20"
      }`}>
        <div className="flex">
          <div className={`w-14 flex items-center justify-center font-bold text-xs tracking-wider flex-shrink-0 select-none ${
            trueOpt.score > 0 ? "bg-emerald-500 text-white" : trueOpt.score < 0 ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            ҮНЭН
          </div>
          <div className="flex-1 p-seek-4 space-y-seek-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-border rounded-seek-md px-2 h-9 w-28 shadow-seek-xs">
                <Icons.Ad />
                <Input
                  className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-xs font-semibold text-center"
                  type="number"
                  step="any"
                  value={trueOpt.score}
                  onChange={(e) => updateTrueOpt({ score: Number(e.target.value) })}
                />
              </div>
            </div>
            <RichEditor
              compact
              minHeight="4rem"
              value={trueOpt.content}
              placeholder="Үнэн хариултын тодотгол текст..."
              onChange={(content) => updateTrueOpt({ content })}
            />
          </div>
        </div>
      </div>

      {/* FALSE Option */}
      <div className={`rounded-seek-lg border overflow-hidden transition-all duration-200 shadow-seek-xs ${
        falseOpt.score > 0
          ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/15"
          : falseOpt.score < 0
          ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/15"
          : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/20"
      }`}>
        <div className="flex">
          <div className={`w-14 flex items-center justify-center font-bold text-xs tracking-wider flex-shrink-0 select-none ${
            falseOpt.score > 0 ? "bg-emerald-500 text-white" : falseOpt.score < 0 ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
          }`}>
            ХУДАЛ
          </div>
          <div className="flex-1 p-seek-4 space-y-seek-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 bg-white border border-border rounded-seek-md px-2 h-9 w-28 shadow-seek-xs">
                <Icons.Ad />
                <Input
                  className="w-full border-0 bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-full text-xs font-semibold text-center"
                  type="number"
                  step="any"
                  value={falseOpt.score}
                  onChange={(e) => updateFalseOpt({ score: Number(e.target.value) })}
                />
              </div>
            </div>
            <RichEditor
              compact
              minHeight="4rem"
              value={falseOpt.content}
              placeholder="Худал хариултын тодотгол текст..."
              onChange={(content) => updateFalseOpt({ content })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderingBuilder({
  options,
  onChange,
}: {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}) {
  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === options.length - 1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const nextOptions = [...options];
    const temp = nextOptions[index];
    nextOptions[index] = nextOptions[targetIndex];
    nextOptions[targetIndex] = temp;
    onChange(nextOptions.map((o, idx) => ({ ...o, label: String(idx + 1) })));
  };

  const addStep = () => {
    const nextIndex = options.length + 1;
    onChange([
      ...options,
      {
        id: `ord_${Date.now()}_${nextIndex}`,
        label: String(nextIndex),
        content: "",
        isCorrect: true,
        score: 1,
        matchValue: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    if (options.length <= 2) return;
    onChange(
      options
        .filter((_, idx) => idx !== index)
        .map((o, idx) => ({ ...o, label: String(idx + 1) }))
    );
  };

  const updateStep = (index: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, idx) => (idx === index ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="space-y-seek-3">
        {options.map((option, index) => (
          <div
            key={option.id || index}
            className="rounded-seek-lg border border-slate-200 border-l-[5px] border-l-amber-500 bg-white overflow-hidden shadow-seek-xs transition-all"
          >
            <div className="flex">
              <div className="w-12 flex items-center justify-center font-bold text-base text-white bg-amber-500 flex-shrink-0 select-none">
                {index + 1}
              </div>
              <div className="flex-1 p-seek-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-900">Алхам {index + 1}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveItem(index, "up")}
                      className="h-7 w-7 p-0 text-xs"
                      title="Дээш зөөх"
                    >
                      ▲
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={index === options.length - 1}
                      onClick={() => moveItem(index, "down")}
                      className="h-7 w-7 p-0 text-xs"
                      title="Доош зөөх"
                    >
                      ▼
                    </Button>
                    <div className="flex items-center gap-1 bg-slate-50 border border-border rounded-seek-md px-1.5 h-7 w-24">
                      <span className="text-[10px] font-semibold text-slate-500">Оноо:</span>
                      <Input
                        className="w-full border-0 bg-transparent p-0 text-center text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        type="number"
                        value={option.score}
                        onChange={(e) => updateStep(index, { score: Number(e.target.value) })}
                      />
                    </div>
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => removeStep(index)}
                        className="h-7 w-7 p-0 text-xs"
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
                <RichEditor
                  compact
                  minHeight="3.5rem"
                  value={option.content}
                  placeholder={`Алхам ${index + 1}-ийн агуулгыг оруулна уу...`}
                  onChange={(content) => updateStep(index, { content })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addStep} className="flex items-center gap-2">
        <span>+ Шинэ алхам нэмэх</span>
      </Button>
    </div>
  );
}

function ShortTextBuilder({
  options,
  onChange,
}: {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}) {
  const addKeyword = () => {
    onChange([
      ...options,
      {
        id: `st_${Date.now()}_${options.length + 1}`,
        label: `Хувилбар ${options.length + 1}`,
        content: "",
        isCorrect: true,
        score: 1,
        matchValue: "exact",
        acceptedValues: [],
      },
    ]);
  };

  const removeKeyword = (index: number) => {
    onChange(options.filter((_, idx) => idx !== index));
  };

  const updateKeyword = (index: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, idx) => (idx === index ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="space-y-seek-3">
        {options.map((opt, index) => (
          <div
            key={opt.id || index}
            className="rounded-seek-lg border border-slate-200 border-l-[5px] border-l-teal-500 bg-white p-seek-3 shadow-seek-xs space-y-seek-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900">Зөвшөөрөгдөх түлхүүр үг #{index + 1}</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-slate-50 border border-border rounded-seek-md px-2 h-8 w-28">
                  <span className="text-xs font-semibold text-slate-500">Оноо:</span>
                  <Input
                    type="number"
                    value={opt.score}
                    onChange={(e) => updateKeyword(index, { score: Number(e.target.value) })}
                    className="w-full border-0 bg-transparent p-0 text-center text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeKeyword(index)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  ✕
                </Button>
              </div>
            </div>
            <div className="grid gap-seek-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <Input
                  value={opt.content}
                  placeholder="Зөвшөөрөх үг / өгүүлбэр (жишээ нь: Улаанбаатар)..."
                  onChange={(e) => updateKeyword(index, { content: e.target.value })}
                />
              </div>
              <div>
                <select
                  value={opt.matchValue || "exact"}
                  onChange={(e) => updateKeyword(index, { matchValue: e.target.value })}
                  className="w-full rounded-seek-md border border-input bg-background px-seek-3 py-2 text-xs outline-none focus:border-primary"
                >
                  <option value="exact">Яг таарах (Exact Match)</option>
                  <option value="contains">Агуулсан байх (Contains)</option>
                  <option value="regex">RegEx илэрхийлэл</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" onClick={addKeyword}>
        + Түлхүүр үг нэмэх
      </Button>
    </div>
  );
}

function MatrixBuilder({
  options,
  scoringConfig,
  onChange,
  onScoringConfigChange,
}: {
  options: EditorOption[];
  scoringConfig: Record<string, any>;
  onChange: (opts: EditorOption[]) => void;
  onScoringConfigChange: (cfg: Record<string, any>) => void;
}) {
  const columns: Array<{ id: string; label: string }> = scoringConfig?.matrixColumns || [
    { id: "col_1", label: "Сайн" },
    { id: "col_2", label: "Дунд" },
    { id: "col_3", label: "Муу" },
  ];

  const addRow = () => {
    const nextIdx = options.length + 1;
    onChange([
      ...options,
      {
        id: `row_${Date.now()}_${nextIdx}`,
        label: `Мөр ${nextIdx}`,
        content: `Үнэлэх өгүүлбэр ${nextIdx}`,
        isCorrect: true,
        score: 1,
        matchValue: columns[0]?.id || "col_1",
      },
    ]);
  };

  const removeRow = (idx: number) => {
    if (options.length <= 1) return;
    onChange(options.filter((_, i) => i !== idx));
  };

  const updateRow = (idx: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  };

  const addColumn = () => {
    const nextColIdx = columns.length + 1;
    const nextColumns = [...columns, { id: `col_${Date.now()}`, label: `Багана ${nextColIdx}` }];
    onScoringConfigChange({ ...scoringConfig, matrixColumns: nextColumns });
  };

  const removeColumn = (colIdx: number) => {
    if (columns.length <= 2) return;
    const nextColumns = columns.filter((_, i) => i !== colIdx);
    onScoringConfigChange({ ...scoringConfig, matrixColumns: nextColumns });
  };

  const updateColumnLabel = (colIdx: number, label: string) => {
    const nextColumns = columns.map((c, i) => (i === colIdx ? { ...c, label } : c));
    onScoringConfigChange({ ...scoringConfig, matrixColumns: nextColumns });
  };

  return (
    <div className="space-y-seek-4">
      {/* Column Headers Config */}
      <div className="rounded-seek-md border border-border bg-slate-50/50 p-seek-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Матрицын баганууд (Хэмжүүрийн утгууд):</span>
          <Button type="button" variant="outline" size="sm" onClick={addColumn} className="text-xs h-7">
            + Багана нэмэх
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {columns.map((col, cIdx) => (
            <div key={col.id} className="flex items-center gap-1 bg-white border border-border rounded-seek-md px-2 py-1">
              <Input
                value={col.label}
                onChange={(e) => updateColumnLabel(cIdx, e.target.value)}
                className="w-24 border-0 p-0 text-xs font-semibold focus-visible:ring-0"
              />
              {columns.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeColumn(cIdx)}
                  className="text-danger hover:text-danger-hover text-xs font-bold px-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rows Matrix Table */}
      <div className="overflow-x-auto rounded-seek-lg border border-border bg-white shadow-seek-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-border text-slate-700 font-bold uppercase">
            <tr>
              <th className="p-seek-3 min-w-[200px]">Мөр (Үнэлэх өгүүлбэр)</th>
              {columns.map((col) => (
                <th key={col.id} className="p-seek-3 text-center min-w-[90px]">{col.label}</th>
              ))}
              <th className="p-seek-3 text-center w-24">Оноо</th>
              <th className="p-seek-3 text-center w-12">Үйлдэл</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {options.map((row, rIdx) => (
              <tr key={row.id}>
                <td className="p-seek-3">
                  <Input
                    value={row.content}
                    placeholder="Өгүүлбэр бичих..."
                    onChange={(e) => updateRow(rIdx, { content: e.target.value })}
                    className="text-xs"
                  />
                </td>
                {columns.map((col) => (
                  <td key={col.id} className="p-seek-3 text-center">
                    <input
                      type="radio"
                      name={`matrix_row_${row.id}`}
                      checked={row.matchValue === col.id}
                      onChange={() => updateRow(rIdx, { matchValue: col.id })}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                ))}
                <td className="p-seek-3 text-center">
                  <Input
                    type="number"
                    value={row.score}
                    onChange={(e) => updateRow(rIdx, { score: Number(e.target.value) })}
                    className="w-16 h-8 text-center text-xs mx-auto"
                  />
                </td>
                <td className="p-seek-3 text-center">
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeRow(rIdx)}
                      className="h-7 w-7 p-0 text-xs mx-auto"
                    >
                      ✕
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button type="button" variant="outline" onClick={addRow}>
        + Шинэ мөр нэмэх
      </Button>
    </div>
  );
}

function LikertBuilder({
  options,
  onChange,
}: {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}) {
  const setScale = (scaleCount: 5 | 7) => {
    if (scaleCount === 5) {
      onChange([
        { id: "likert_1", label: "1", content: "Огт зөвшөөрөхгүй", isCorrect: false, score: 1 },
        { id: "likert_2", label: "2", content: "Зөвшөөрөхгүй", isCorrect: false, score: 2 },
        { id: "likert_3", label: "3", content: "Саармаг", isCorrect: false, score: 3 },
        { id: "likert_4", label: "4", content: "Зөвшөөрч байна", isCorrect: false, score: 4 },
        { id: "likert_5", label: "5", content: "Бүрэн зөвшөөрч байна", isCorrect: false, score: 5 },
      ]);
    } else {
      onChange([
        { id: "likert_1", label: "1", content: "Огт үгүй", isCorrect: false, score: 1 },
        { id: "likert_2", label: "2", content: "Үгүй", isCorrect: false, score: 2 },
        { id: "likert_3", label: "3", content: "Бага зэрэг үгүй", isCorrect: false, score: 3 },
        { id: "likert_4", label: "4", content: "Саармаг", isCorrect: false, score: 4 },
        { id: "likert_5", label: "5", content: "Бага зэрэг тийм", isCorrect: false, score: 5 },
        { id: "likert_6", label: "6", content: "Тийм", isCorrect: false, score: 6 },
        { id: "likert_7", label: "7", content: "Бүрэн тийм", isCorrect: false, score: 7 },
      ]);
    }
  };

  const updateItem = (idx: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="flex items-center gap-seek-2">
        <span className="text-xs font-bold text-slate-700">Түвшний тоо:</span>
        <Button
          type="button"
          size="sm"
          variant={options.length === 5 ? "primary" : "outline"}
          onClick={() => setScale(5)}
          className="text-xs h-7"
        >
          5 түвшин
        </Button>
        <Button
          type="button"
          size="sm"
          variant={options.length === 7 ? "primary" : "outline"}
          onClick={() => setScale(7)}
          className="text-xs h-7"
        >
          7 түвшин
        </Button>
      </div>

      <div className="grid gap-seek-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {options.map((opt, idx) => (
          <div key={opt.id || idx} className="rounded-seek-md border border-border bg-white p-seek-3 space-y-2 shadow-seek-xs">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">Түвшин {opt.label}</Badge>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500">Оноо:</span>
                <Input
                  type="number"
                  value={opt.score}
                  onChange={(e) => updateItem(idx, { score: Number(e.target.value) })}
                  className="w-12 h-6 text-center text-xs p-0"
                />
              </div>
            </div>
            <Input
              value={opt.content}
              onChange={(e) => updateItem(idx, { content: e.target.value })}
              className="text-xs"
              placeholder="Түвшний тайлбар"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function SjtBuilder({
  options,
  onChange,
}: {
  options: EditorOption[];
  onChange: (opts: EditorOption[]) => void;
}) {
  const effectivenessLevels = [
    { value: "best", label: "Хамгийн үр дүнтэй (+2 оноо)", defaultScore: 2 },
    { value: "effective", label: "Үр дүнтэй (+1 оноо)", defaultScore: 1 },
    { value: "neutral", label: "Саармаг (0 оноо)", defaultScore: 0 },
    { value: "ineffective", label: "Үр дүнгүй (-1 оноо)", defaultScore: -1 },
    { value: "counterproductive", label: "Сөрөг нөлөөтэй (-2 оноо)", defaultScore: -2 },
  ];

  const addOption = () => {
    const nextIdx = options.length + 1;
    onChange([
      ...options,
      {
        id: `sjt_${Date.now()}_${nextIdx}`,
        label: String.fromCharCode(64 + nextIdx),
        content: "",
        isCorrect: false,
        score: 1,
        matchValue: "effective",
      },
    ]);
  };

  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    onChange(options.filter((_, i) => i !== idx));
  };

  const updateOption = (idx: number, patch: Partial<EditorOption>) => {
    onChange(options.map((o, i) => (i === idx ? { ...o, ...patch } : o)));
  };

  return (
    <div className="space-y-seek-4">
      <div className="space-y-seek-3">
        {options.map((opt, idx) => {
          const isPositive = opt.score > 0;
          const isNegative = opt.score < 0;
          return (
            <div
              key={opt.id || idx}
              className={`rounded-seek-lg border overflow-hidden shadow-seek-xs ${
                isPositive
                  ? "border-emerald-200 border-l-[5px] border-l-emerald-500 bg-emerald-50/10"
                  : isNegative
                  ? "border-rose-200 border-l-[5px] border-l-rose-500 bg-rose-50/10"
                  : "border-border border-l-[5px] border-l-slate-400 bg-slate-50/10"
              }`}
            >
              <div className="flex">
                <div className={`w-12 flex items-center justify-center font-bold text-base flex-shrink-0 select-none ${
                  isPositive ? "bg-emerald-500 text-white" : isNegative ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  {opt.label || String.fromCharCode(65 + idx)}
                </div>
                <div className="flex-1 p-seek-4 space-y-seek-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-700">Үр дүнтэй байдлын түвшин:</span>
                      <select
                        value={opt.matchValue || "effective"}
                        onChange={(e) => {
                          const level = effectivenessLevels.find((l) => l.value === e.target.value);
                          updateOption(idx, {
                            matchValue: e.target.value,
                            score: level ? level.defaultScore : opt.score,
                          });
                        }}
                        className="rounded-seek-md border border-input bg-background px-seek-3 py-1.5 text-xs outline-none focus:border-primary"
                      >
                        {effectivenessLevels.map((lvl) => (
                          <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white border border-border rounded-seek-md px-2 h-8 w-24">
                        {/* <span className="text-xs font-semibold text-slate-500">Оноо:</span> */}
                        <Icons.Ad />
                        <Input
                          type="number"
                          value={opt.score}
                          onChange={(e) => updateOption(idx, { score: Number(e.target.value) })}
                          className="w-full border-0 bg-transparent p-0 text-center text-xs font-semibold focus-visible:ring-0 focus-visible:ring-offset-0 h-full"
                        />
                      </div>
                      {options.length > 2 && (
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => removeOption(idx)}
                          className="h-8 w-8 p-0 text-xs"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                  <RichEditor
                    value={opt.content}
                    placeholder={`Нөхцөлт хариу үйлдэл / сонголт ${opt.label}-ийн агуулга...`}
                    onChange={(content) => updateOption(idx, { content })}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button type="button" variant="outline" onClick={addOption}>
        + Шинэ сонголт нэмэх
      </Button>
    </div>
  );
}

function CaseBundleBuilder({
  parentId,
}: {
  parentId?: string | null;
}) {
  return (
    <div className="rounded-seek-lg border border-primary/20 bg-primary/5 p-seek-4 space-y-seek-3">
      <div className="flex items-center gap-seek-2">
        <Icons.CaseBundle className="h-5 w-5 text-primary stroke-[1.8]" />
        <span className="font-bold text-sm text-slate-800">Кэйс даалгаврын эх бичвэр ба дэд асуултууд</span>
      </div>
      <Text variant="muted" className="text-xs">
        Энэхүү асуултын их бие (Stem) хэсэгт кэйс, өгөгдөл, нийтлэл эсвэл дагалдах материалыг оруулна. Үүний дараа асуултын сангаас бусад даалгавруудыг энэхүү эх кэйс рүү <code>parentId</code> холбоосоор холбон дэд асуулт болгож ашиглана.
      </Text>
      {parentId && (
        <div className="inline-flex items-center gap-2 bg-white border border-border rounded-seek-md px-3 py-1.5 text-xs font-semibold text-slate-700">
          <span>Эх кэйсийн ID:</span>
          <code className="text-primary font-mono">{parentId}</code>
        </div>
      )}
    </div>
  );
}

function NumericBuilder({
  option,
  onChange,
  totalPoints = 1,
}: {
  option: EditorOption;
  onChange: (opt: EditorOption) => void;
  totalPoints?: number;
}) {
  return (
    <div className="space-y-seek-4">
      <div className="grid gap-seek-4 md:grid-cols-3">
        <FieldLabel label="Зөв тоон хариулт">
          <Input
            type="number"
            step="any"
            placeholder="Жишээ нь: 12.5"
            value={option?.content || ""}
            onChange={(e) =>
              onChange({
                id: option?.id || "num-ans",
                label: "Хариулт",
                content: e.target.value,
                isCorrect: true,
                score: option?.score !== undefined ? option.score : totalPoints,
                matchValue: option?.matchValue || "0",
              })
            }
          />
        </FieldLabel>
        <FieldLabel label="Хүлцэх алдаа (Tolerance ±)">
          <Input
            type="number"
            step="any"
            placeholder="Жишээ нь: 0.1"
            value={option?.matchValue || ""}
            onChange={(e) =>
              onChange({
                id: option?.id || "num-ans",
                label: "Хариулт",
                content: option?.content || "",
                isCorrect: true,
                score: option?.score !== undefined ? option.score : totalPoints,
                matchValue: e.target.value,
              })
            }
          />
        </FieldLabel>
        <FieldLabel label="Авах дээд оноо">
          <Input
            type="number"
            step="any"
            value={option?.score !== undefined ? option.score : totalPoints}
            onChange={(e) =>
              onChange({
                id: option?.id || "num-ans",
                label: "Хариулт",
                content: option?.content || "",
                isCorrect: true,
                score: Number(e.target.value),
                matchValue: option?.matchValue || "0",
              })
            }
          />
        </FieldLabel>
      </div>
    </div>
  );
}

function EssayRubricBuilder({
  rubric,
  onChange,
}: {
  rubric: any[];
  onChange: (rubrics: any[]) => void;
}) {
  const addCriterion = () => {
    onChange([
      ...rubric,
      {
        id: `c_${Date.now()}_${rubric.length + 1}`,
        criteria: "",
        maxScore: 1,
        description: "",
      },
    ]);
  };

  const removeCriterion = (idx: number) => {
    onChange(rubric.filter((_, i) => i !== idx));
  };

  const updateCriterion = (idx: number, patch: any) => {
    onChange(rubric.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  return (
    <div className="space-y-seek-4">
      {rubric.length === 0 ? (
        <div className="rounded-seek-md border border-dashed border-border p-seek-6 text-center text-muted-foreground text-sm">
          Үнэлгээний рубрик хоосон байна. Багш асуултыг засахдаа шалгуур нэмнэ үү.
        </div>
      ) : (
        rubric.map((rub, index) => (
          <div key={rub.id || index} className="rounded-seek-lg border border-border bg-surface p-seek-4 space-y-seek-3 shadow-seek-xs">
            <div className="flex items-center justify-between">
              <Badge variant="success">Шалгуур {index + 1}</Badge>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={() => removeCriterion(index)}
              >
                ✕
              </Button>
            </div>
            <div className="grid gap-seek-4 md:grid-cols-[2fr_1fr]">
              <FieldLabel label="Шалгуурын нэр">
                <Input
                  placeholder="Жишээ нь: Бодолтын явц"
                  value={rub.criteria}
                  onChange={(e) => updateCriterion(index, { criteria: e.target.value })}
                />
              </FieldLabel>
              <FieldLabel label="Авах дээд оноо">
                <Input
                  type="number"
                  value={rub.maxScore}
                  onChange={(e) => updateCriterion(index, { maxScore: Number(e.target.value) })}
                />
              </FieldLabel>
            </div>
            <FieldLabel label="Шалгуурын тайлбар ба түвшний удирдамж">
              <Textarea
                rows={2}
                placeholder="Жишээ нь: Бодолтын алхмуудыг бүрэн зөв хийсэн байдал..."
                value={rub.description}
                onChange={(e) => updateCriterion(index, { description: e.target.value })}
              />
            </FieldLabel>
          </div>
        ))
      )}
      <Button type="button" variant="outline" onClick={addCriterion}>
        + Шалгуур нэмэх
      </Button>
    </div>
  );
}
