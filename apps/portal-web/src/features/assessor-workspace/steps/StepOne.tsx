"use client";

import React, { useState, useEffect, useRef } from "react";
import { Badge, Button, Icons, Input, Text, useToast } from "@seek/ui";
import { RichEditor } from "../editor/RichEditor";
import { FieldLabel, CollapsibleCard } from "../builders/HelperComponents";
import { questionTypeLabels } from "../mock-data";
import type { QuestionWizardState, EditorOption, QuestionType } from "../types";
import { authFetch } from "@/lib/auth-client";

// Builders
import { TrueFalseBuilder } from "../builders/TrueFalseBuilder";
import { OrderingBuilder } from "../builders/OrderingBuilder";
import { ShortTextBuilder } from "../builders/ShortTextBuilder";
import { MatrixBuilder } from "../builders/MatrixBuilder";
import { LikertBuilder } from "../builders/LikertBuilder";
import { SjtBuilder } from "../builders/SjtBuilder";
import { CaseBundleBuilder } from "../builders/CaseBundleBuilder";
import { NumericBuilder } from "../builders/NumericBuilder";
import { EssayRubricBuilder } from "../builders/EssayRubricBuilder";
import { FillInBlankOptions } from "../builders/FillInBlankOptions";
import { CombinationMCBuilder, CombinationMatchingBuilder } from "../builders/CombinationBuilders";

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
  manual: Icons.Eye,
};

const scoringModeLabels: Record<string, string> = {
  per_option: "Харгалзах оноо",
  combination: "Хослолын оноо",
  manual: "Гараар үнэлэх",
};

interface StepOneProps {
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
}

/**
 * StepOne - Wizard-ийн 1-р шат: Асуултын үндсэн мэдээлэл, төрөл, оноо бодох хэлбэр, хариултын сонголтуудыг тохируулах хуудас.
 */
export function StepOne({
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
}: StepOneProps) {
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
          { id: "num-ans", label: "Хариулт", content: "", isCorrect: true, score: state.defaultMaxScore, matchValue: "0" }
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
        <CollapsibleCard title="Асуултын үндсэн мэдээлэл" icon={Icons.Type}>
          <div className="grid gap-seek-3 sm:grid-cols-3" role="group">
            {/* <FieldLabel label="Асуултын код">
              <Input
                value={state.code}
                onChange={(event) => setState({ code: event.target.value })}
                placeholder="Жишээ: Q-MATH-01"
              />
            </FieldLabel> */}
            <div className="sm:col-span-3">
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
                    const presignedRes = await authFetch('/api/v1/file/presigned-upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ name: file.name, type: 'QUESTION_ATTACHMENT' }),
                    });
                    const { uploadUrl, storageKey } = await presignedRes.json();

                    await fetch(uploadUrl, {
                      method: 'PUT',
                      headers: { 'Content-Type': '' },
                      body: file,
                    });

                    await authFetch('/api/v1/file/objects/verify', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        storageKey,
                        mimeType: file.type,
                        sizeBytes: file.size,
                      }),
                    });

                    let mediaType = "IMAGE";
                    if (file.type.startsWith("audio/")) mediaType = "AUDIO";
                    else if (file.type.startsWith("video/")) mediaType = "VIDEO";

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
              option={state.options[0] || { id: "num-ans", label: "Хариулт", content: "", isCorrect: true, score: state.defaultMaxScore, matchValue: "0" }}
              totalPoints={state.defaultMaxScore}
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
              totalPoints={state.defaultMaxScore}
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
                      <div className={`w-12 flex items-center justify-center font-bold text-base tracking-wider flex-shrink-0 select-none ${indicatorBgClass}`}>
                        {option.label || `O${index + 1}`}
                      </div>

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
