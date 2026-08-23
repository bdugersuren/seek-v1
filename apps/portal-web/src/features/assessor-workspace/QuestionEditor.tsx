"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Button, Icons, Text, useToast } from "@seek/ui";
import { QuestionPreviewModal } from "./QuestionPreviewModal";
import {
  bloomLabels,
  competencyLabels,
  difficultyLabels,
  mockQuestionBank,
  statusLabels,
} from "./mock-data";
import type {
  QuestionBankItem,
  QuestionOption,
  QuestionWizardState,
  WizardStep,
  TopicNode,
  BloomLevel,
  CompetencyType,
  DifficultyLevel
} from "./types";
import {
  createQuestion,
  updateQuestion,
  fetchTopics,
  fetchDifficultyLevels,
  fetchCognitiveLevels,
  fetchCompetenceTypes,
  fetchAssessmentContexts,
  fetchDifficultyScales,
  fetchCompetenceFrameworks,
  fetchAudienceTypes,
  fetchAudienceLevels,
  fetchDbData
} from "./api";

// Steps components
import { StepOne } from "./steps/StepOne";
import { StepTwo } from "./steps/StepTwo";
import { StepThree } from "./steps/StepThree";

/**
 * QuestionEditor - Асуулт засварлах болон шинээр үүсгэх Wizard цонхны үндсэн компонент.
 * Энэ компонент нь 3 шаттай (Алхам 1: Агуулга ба хариулт; Алхам 2: Сэдэв ба ангилал; Алхам 3: Илгээх тойм).
 */
export function QuestionEditor({
  mode = "edit",
  questionCode,
  question,
  backUrl = "/assessor/question-bank",
}: {
  mode?: "new" | "edit";
  questionCode?: string;
  question?: QuestionBankItem;
  backUrl?: string;
}) {
  const router = useRouter();
  const params = useParams();
  const { showToast } = useToast();
  
  // Өгөгдсөн source асуултыг тодорхойлох
  const sourceQuestion = useMemo(() => {
    if (question) return question;
  }, [question, questionCode]);

  const [step, setStep] = useState<WizardStep>(1);
  const [previewQuestion, setPreviewQuestion] = useState<QuestionBankItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationTouched, setValidationTouched] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [state, setState] = useState<QuestionWizardState>(() =>
    buildInitialState(mode, sourceQuestion, params?.contextId as string),
  );

  // sourceQuestion өөрчлөгдөх үед state-ийг шинэчлэх
  useEffect(() => {
    if (sourceQuestion && mode === "edit") {
      setState(buildInitialState(mode, sourceQuestion, params?.contextId as string));
    }
  }, [sourceQuestion, mode, params?.contextId]);

  const [topics, setTopics] = useState<any[]>([]);
  const [difficultyLevels, setDifficultyLevels] = useState<any[]>([]);
  const [cognitiveLevels, setCognitiveLevels] = useState<any[]>([]);
  const [competenceTypes, setCompetenceTypes] = useState<any[]>([]);
  const [assessmentContexts, setAssessmentContexts] = useState<any[]>([]);
  const [difficultyScales, setDifficultyScales] = useState<any[]>([]);
  const [competenceFrameworks, setCompetenceFrameworks] = useState<any[]>([]);
  const [cognitiveFrameworks, setCognitiveFrameworks] = useState<any[]>([]);
  const [audienceTypes, setAudienceTypes] = useState<any[]>([]);
  const [audienceLevels, setAudienceLevels] = useState<any[]>([]);
  const [selectedContextId, setSelectedContextId] = useState<string>("");
  const [loadingMetadata, setLoadingMetadata] = useState(true);

  // Сэдэв, хүндрэл, танин мэдэхүйн түвшин зэрэг мета өгөгдлийг DB-ээс унших
  useEffect(() => {
    async function loadMetadata() {
      try {
        const contextId = params?.contextId as string;
        const [t, d, c, comp, ctxs, scales, compFws, audTypes, audLvs, cogFws] = await Promise.all([
          fetchTopics(contextId),
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
        } else if (contextId) {
          setSelectedContextId(contextId);
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
  }, [sourceQuestion, params?.contextId]);

  // ГҮЙЦЭТГЭЛИЙН САЙЖРУУЛАЛТ: Оноог state-д хадгалж useEffect-ээр давтагдахын оронд
  // useMemo ашиглаж derived state-ээр шууд тооцоолно.
  const { defaultMaxScore, defaultMinScore } = useMemo(() => {
    let maxScore = 0;
    let minScore = 0;

    switch (state.type) {
      case "SINGLE_CHOICE":
      case "TRUE_FALSE":
      case "SJT":
      case "LIKERT":
        maxScore = state.options.length > 0 ? Math.max(...state.options.map(o => o.score), 0) : 0;
        minScore = state.options.length > 0 ? Math.min(...state.options.map(o => o.score), 0) : 0;
        break;
      case "MULTIPLE_CHOICE":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.filter(o => o.score > 0).reduce((sum, o) => sum + (o.score > 0 ? o.score : 0), 0);
          minScore = state.options.filter(o => o.score < 0).reduce((sum, o) => sum + o.score, 0);
        }
        break;
      case "ORDERING":
        if (state.scoringMode === "combination") {
          const combos = state.scoringConfig?.combinations || [];
          maxScore = combos.length > 0 ? Math.max(...combos.map((c: any) => c.score), 0) : 0;
          minScore = combos.length > 0 ? Math.min(...combos.map((c: any) => c.score), 0) : 0;
        } else {
          maxScore = state.options.reduce((sum, o) => sum + (o.score > 0 ? o.score : 0), 0);
          minScore = 0;
        }
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
        const rubrics = Array.isArray(state.rubric) ? state.rubric : [];
        maxScore = rubrics.reduce((sum: number, r: any) => sum + (Number(r.maxScore) || 0), 0);
        minScore = 0;
        break;
    }

    return { defaultMaxScore: maxScore, defaultMinScore: minScore };
  }, [state.options, state.scoringMode, state.scoringConfig, state.type, state.rubric]);

  // Derived state утгуудыг нэгтгэсэн нийт одоогийн state
  const stateWithPoints = useMemo(() => ({
    ...state,
    defaultMaxScore,
    defaultMinScore
  }), [state, defaultMaxScore, defaultMinScore]);

  // Асуултын шаардлагыг хангаж буй эсэхийг шалгах (checklist)
  const validation = validateWizard(stateWithPoints);
  
  // Урьдчилан харах модалыг бэлтгэх функц
  const preview = () => setPreviewQuestion(buildQuestionFromState(stateWithPoints, sourceQuestion));
  
  const setPartial = (patch: Partial<QuestionWizardState>) =>
    setState((current: QuestionWizardState) => ({ ...current, ...patch }));

  const goNext = () => {
    if (step === 2) {
      const hasUnmapped = state.mappings.length === 0 || state.mappings.some((m) => !m.topicId || m.topicId === "unmapped" || m.topicId === "general");
      if (hasUnmapped) {
        setValidationTouched(true);
        showToast("Сэдвийн сангаас дор хаяж нэг бодит сэдэв сонгоно уу.", "warning");
        return;
      }
    }
    setStep((current: WizardStep) => Math.min(3, current + 1) as WizardStep);
  };

  // Ноорог хадгалах үйлдэл
  const saveDraft = async () => {
    try {
      const qData = buildQuestionFromState({ ...stateWithPoints, status: "draft" }, sourceQuestion);
      if (mode === "edit" && sourceQuestion?.id) {
        await updateQuestion(sourceQuestion.id, qData);
        showToast("Ноорогийг амжилттай шинэчиллээ.", "success");
      } else {
        await createQuestion(qData);
        showToast("Ноорог амжилттай хадгалагдлаа.", "success");
        router.push(backUrl);
      }
    } catch (err: any) {
      showToast("Хадгалахад алдаа гарлаа.", "danger");
    }
  };

  // Ctrl+S / Cmd+S-ээр ноорог хадгалах
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveDraft();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stateWithPoints, sourceQuestion, mode]);

  // Батлуулах хүсэлт илгээх үйлдэл
  const requestApproval = async () => {
    setValidationTouched(true);
    if (!validation.ready) {
      showToast("Батлуулахын өмнө checklist дээрх дутуу хэсгүүдийг гүйцээнэ үү.", "warning");
      return;
    }
    try {
      setSubmitted(true);
      const nextStatus = mode === "edit" ? "resubmitted" : "approval_requested";
      const qData = buildQuestionFromState({ ...stateWithPoints, status: nextStatus }, sourceQuestion);
      if (mode === "edit" && sourceQuestion?.id) {
        await updateQuestion(sourceQuestion.id, qData);
      } else {
        await createQuestion(qData);
      }
      showToast("Хадгалагдаж батлуулахаар илгээгдлээ.", "success");
      router.push(backUrl);
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
              href={backUrl}
              className="grid h-11 w-11 place-items-center rounded-seek-md border border-border bg-surface shadow-seek-sm hover:bg-surface-hover"
              aria-label="Буцах"
            >
              <Icons.Undo2 />
            </Link>
            <div>
              <Text className="text-2xl font-bold">
                {mode === "new" ? "Асуулт үүсгэх" : "Асуулт засах"}
              </Text>
              <Text variant="muted" className="text-sm">
                {sourceQuestion?.code || ""}
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
            state={stateWithPoints}
            setState={setPartial}
            updateOption={(index, patch) =>
              setState((current: QuestionWizardState) => {
                const nextScore = patch.score !== undefined ? patch.score : current.options[index]?.score ?? 0;
                const nextIsCorrect = patch.isCorrect !== undefined ? patch.isCorrect : nextScore > 0;
                let nextOptions = current.options.map((option, optionIndex) => {
                  if (optionIndex === index) {
                    const finalValue = patch.value !== undefined ? patch.value : option.value;
                    return { ...option, ...patch, value: finalValue, isCorrect: nextIsCorrect, score: nextScore };
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
              setState((current: QuestionWizardState) => {
                const nextOptions = [
                  ...current.options,
                  {
                    id: Math.random().toString(36).substring(2, 9),
                    optionKey: "",
                    label: "",
                    value: "",
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
              setState((current: QuestionWizardState) => {
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
              setState((current: QuestionWizardState) => ({
                ...current,
                options: [
                  ...current.options,
                  {
                    id: `L${current.options.length + 1}`,
                    optionKey: `L${current.options.length + 1}`,
                    label: `L${current.options.length + 1}`,
                    value: "",
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
              setState((current: QuestionWizardState) => ({
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
              setState((current: QuestionWizardState) => ({
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
              setState((current: QuestionWizardState) => ({
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
            mappings={stateWithPoints.mappings}
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
            state={stateWithPoints}
            validation={validation}
            mode={mode}
            submitted={submitted}
            onCommentChange={(workflowComment) => setPartial({ workflowComment })}
            onSave={saveDraft}
            onSubmit={requestApproval}
          />
        )}
      </div>

      <ActionRail 
        onBack={() => setStep((current: WizardStep) => Math.max(1, current - 1) as WizardStep)} 
        onPreview={preview} 
        onSave={saveDraft} 
        onDelete={() => showToast("Mock editor дээр soft delete action тэмдэглэгдлээ.", "info")} 
      />

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

const wizardSteps: Array<{ id: WizardStep; title: string; subtitle: string }> = [
  { id: 1, title: "Даалгавар үүсгэх", subtitle: "Асуулт, хариулт, оноо" },
  { id: 2, title: "Ангилал тохируулах", subtitle: "Сэдэв ба түвшин" },
  { id: 3, title: "Батлуулах хүсэлт", subtitle: "Шалгах ба илгээх" },
];

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

/**
 * buildInitialState - Асуултын анхны өгөгдлийг хүлээн авч Wizard-ийн дотоод state-ийг үүсгэх туслах функц.
 * Хэрэв засварлах асуулт хоосон бол (Шинээр үүсгэх үед) өгөгдлийг default утгуудаар дүүргэнэ.
 *
 * @param mode - "new" эсвэл "edit" горим
 * @param source - Засварлагдаж буй асуултын эх өгөгдөл
 * @returns QuestionWizardState хэлбэртэй объект
 */
function buildInitialState(mode: "new" | "edit", source?: QuestionBankItem, contextId?: string): QuestionWizardState {
  const question = mode === "edit" ? source ?? mockQuestionBank.find((item) => item.code === "MX-58") : undefined;
  const qType = question?.type ?? "MULTIPLE_CHOICE";
  
  const options = question?.options && question.options.length > 0
    ? question.options.map((option) => ({
        id: option.id,
        optionKey: option.optionKey || option.id,
        label: option.label,
        value: option.value || "",
        isCorrect: Boolean(option.isCorrect),
        score: option.score ?? (option.isCorrect ? (question.defaultMaxScore ?? 1) : 0),
        matchValue: option.matchValue || "",
        acceptedValues: option.acceptedValues || [],
      }))
    : (() => {
        switch (qType) {
          case "TRUE_FALSE":
            return [
              { id: "A", optionKey: "A", label: "TRUE", value: "Үнэн", isCorrect: true, score: 1, matchValue: "" },
              { id: "B", optionKey: "B", label: "FALSE", value: "Худал", isCorrect: false, score: 0, matchValue: "" },
            ];
          case "MATCHING":
            return [
              { id: "L1", optionKey: "L1", label: "L1", value: "Зүүн 1", isCorrect: true, score: 1 },
              { id: "L2", optionKey: "L2", label: "L2", value: "Зүүн 2", isCorrect: true, score: 1 },
            ];
          case "ORDERING":
            return [
              { id: "o1", optionKey: "o1", label: "O1", value: "", isCorrect: true, score: 1, matchValue: "" },
              { id: "o2", optionKey: "o2", label: "O2", value: "", isCorrect: true, score: 1, matchValue: "" },
            ];
          case "FILL_BLANK":
            return [
              { id: "blank1", optionKey: "blank1", label: "blank1", value: "", isCorrect: true, score: 1, matchValue: "", acceptedValues: [{ value: "", score: 1 }] },
            ];
          case "MATRIX":
            return [
              { id: "mx1", optionKey: "mx1", label: "Мөр 1", value: "", isCorrect: true, score: 1, matchValue: "" },
            ];
          case "NUMERIC":
            return [
              { id: "num-ans", optionKey: "num-ans", label: "Хариулт", value: "", isCorrect: true, score: question?.defaultMaxScore ?? 1, matchValue: "0" }
            ];
          case "LIKERT":
            return [
              { id: "a", optionKey: "a", label: "1", value: "Маш муу", isCorrect: false, score: 1, matchValue: "" },
              { id: "b", optionKey: "b", label: "2", value: "Муу", isCorrect: false, score: 2, matchValue: "" },
            ];
          default:
            return [
              { id: "a", optionKey: "a", label: "A", value: "", isCorrect: true, score: 1, matchValue: "" },
              { id: "b", optionKey: "b", label: "B", value: "", isCorrect: false, score: 0, matchValue: "" },
              { id: "c", optionKey: "c", label: "C", value: "", isCorrect: false, score: 0, matchValue: "" },
              { id: "d", optionKey: "d", label: "D", value: "", isCorrect: false, score: 0, matchValue: "" },
            ];
        }
      })();

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
    type: qType,
    body: question?.body ?? "Дараах тэгшитгэлийн язгууруудыг олно уу: $$x^2 - 5x + 6 = 0$$",
    options,
    explanation: question?.explanation || "",
    feedbackCorrect:
      question?.feedbackCorrect || "",
    feedbackIncorrect:
      question?.feedbackIncorrect || "",
    scoringMode,
    scoringConfig: (() => {
      const raw = rawScoringConfig;
      return {
        ...raw,
        scoringMode,
        rightOptions: raw.rightOptions || (
          qType === "MATCHING"
            ? (options.length > 0 ? options.map((o, idx) => ({ id: `R${idx + 1}`, value: o.matchValue || o.value })).filter(o => o.value) : [{ id: "R1", value: "Баруун 1" }, { id: "R2", value: "Баруун 2" }, { id: "R3", value: "Баруун 3" }])
            : []
        ),
        combinations: (() => {
          if (raw.combinations && Array.isArray(raw.combinations) && raw.combinations.length > 0) {
            return raw.combinations.map((c: any) => ({
              ids: Array.isArray(c.ids) ? c.ids : (Array.isArray(c.answers) ? c.answers : []),
              score: Number(c.score ?? 1)
            }));
          }
          if (qType === "MATCHING") {
            const defaultPairs = options.map((o, idx) => `${o.id}:R${idx + 1}`);
            return [{ ids: defaultPairs, score: 1 }];
          }
          return [];
        })()
      };
    })(),
    defaultMaxScore: question?.defaultMaxScore ?? 3,
    defaultMinScore: question?.defaultMinScore ?? 0,
    defaultTimeSeconds: question?.defaultTimeSeconds ?? 60,
    tags: question?.tags ?? [],
    mappings:
      question?.topicMappings && question.topicMappings.length > 0
        ? question.topicMappings.map((m: any) => ({
            ...m,
            cognitiveLevels: m.cognitiveLevels || [],
            competencies: m.competencies || []
          }))
        : [
            {
              topicId: "unmapped",
              topicName: "Сэдэв сонгоогүй",
              bloomLevel: "apply",
              competencyType: "knowledge",
              difficulty: "medium",
              weight: 1,
              assessmentContextId: contextId || "",
              cognitiveLevels: [],
              competencies: [],
            },
          ],
    workflowComment: "",
    status: question?.status ?? "draft",
    rubric: (() => {
      if (!question?.rubric) return [];
      try {
        const parsed = typeof question.rubric === 'string' ? JSON.parse(question.rubric) : question.rubric;
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })(),
    media: question?.media ?? [],
  };
}

/**
 * buildQuestionFromState - Wizard-ийн дотоод state-ийг API-рүү илгээх болон урьдчилан харахад 
 * зориулсан QuestionBankItem формат руу хөрвүүлэх туслах функц.
 *
 * @param state - Одоогийн Wizard-ийн дотоод state
 * @param source - Засварлагдаж буй асуултын эх өгөгдөл
 * @returns QuestionBankItem хэлбэртэй объект
 */
function buildQuestionFromState(state: QuestionWizardState, source?: QuestionBankItem): QuestionBankItem {
  const primaryMapping = state.mappings[0];
  const options: QuestionOption[] = state.options.map((option) => {
    return {
      id: option.id,
      optionKey: option.optionKey || option.id,
      label: option.label,
      value: option.value,
      isCorrect: option.isCorrect,
      score: option.score,
      matchValue: option.matchValue,
      acceptedValues: option.acceptedValues || [],
    };
  });

  return {
    id: source?.id ?? "preview-question",
    code: state.code,
    title: state.title,
    body: state.body,
    type: state.type,
    status: state.status,
    defaultMaxScore: state.defaultMaxScore,
    defaultMinScore: state.defaultMinScore,
    defaultTimeSeconds: state.defaultTimeSeconds,
    bloomLevel: (primaryMapping?.bloomLevel ?? "apply") as BloomLevel,
    competencyType: (primaryMapping?.competencyType ?? "knowledge") as CompetencyType,
    topicId: primaryMapping?.topicId ?? "unmapped",
    topicName: primaryMapping?.topicName ?? "Ангилаагүй",
    topicMappings: state.mappings,
    difficulty: (primaryMapping?.difficulty ?? "medium") as DifficultyLevel,
    tags: state.tags,
    options,
    answerKey: state.type === "ESSAY" ? "Рубрик үнэлгээ" : (options.filter((option) => option.isCorrect).map((option) => option.label).join(", ") || "-"),
    rubric: typeof state.rubric === 'object' ? JSON.stringify(state.rubric) : (state.rubric || "Wizard prototype rubric"),
    scoringMode: state.scoringMode,
    scoringConfig: state.scoringConfig,
    explanation: state.explanation,
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

/**
 * validateWizard - Асуултын өгөгдөл шаардлага хангасан эсэхийг баталгаажуулж 
 * чанарын checklist-ийн үр дүнг буцаах туслах функц.
 *
 * @param state - Одоогийн Wizard-ийн дотоод state (онооны хамт)
 * @returns ready (бэлэн эсэх) болон checklist-ийн мөрүүд
 */
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
    { 
      label: "Сэдвийн mapping сонгосон", 
      ok: state.mappings.length > 0 && state.mappings.every((m) => m.topicId && m.topicId !== "unmapped" && m.topicId !== "general") 
    },
    { label: "Feedback/тайлбар бөглөгдсөн", ok: state.explanation.trim().length > 0 || state.feedbackCorrect.trim().length > 0 || state.feedbackIncorrect.trim().length > 0 },
    { label: "Workflow comment бичсэн", ok: state.workflowComment.trim().length > 0 },
  ];
  return { items, ready: items.every((item) => item.ok) };
}
