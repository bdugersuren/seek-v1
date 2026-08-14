"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import {
  Badge,
  Button,
  Card,
  Icons,
  Text,
  useToast,
} from "@seek/ui";
import { 
  getNextWorkflowActions, 
  getQuestionByIdAsync, 
  fetchQuestionWorkflowEvents, 
  sendQuestionWorkflow 
} from "./api";
import { WorkflowCommentModal } from "./WorkflowCommentModal";
import {
  bloomLabels,
  competencyLabels,
  difficultyLabels,
  questionTypeLabels,
  statusLabels,
} from "./mock-data";
import type { 
  QuestionBankItem, 
  QuestionWorkflowStatus, 
  QuestionType,
  BloomLevel,
  CompetencyType,
  DifficultyLevel
} from "./types";

// Extracted subcomponents
import { RichTextPreview } from "./builders/RichTextPreviewer";
import { QuestionTypePreview } from "./builders/OptionPreviews";

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

const scoringModeLabels: Record<string, string> = {
  per_option: "Харгалзах оноо",
  combination: "Хослолын оноо",
  manual: "Гараар үнэлэх",
};

const actionLabels: Record<string, string> = {
  submit: "Батлуулахаар илгээсэн",
  approve: "Батлагдсан",
  publish: "Нийтлэгдсэн",
  reject: "Татгалзсан",
  changes_requested: "Засвар шаардсан",
  resubmit: "Дахин илгээсэн",
};

const statusVariant: Record<
  QuestionWorkflowStatus,
  "secondary" | "success" | "warning" | "danger"
> = {
  draft: "secondary",
  approval_requested: "warning",
  in_review: "warning",
  changes_requested: "danger",
  resubmitted: "warning",
  approved: "success",
  published: "success",
  archived: "secondary",
  rejected: "danger",
  deleted: "danger",
};

/**
 * QuestionPreviewModal - Асуултыг урьдчилан харах, түүний хувилбаруудыг сонгож үзэх 
 * болон Superadmin-ий зүгээс workflow төлөв шинэчлэх (батлах, татгалзах) үйлдлүүдийг 
 * агуулсан хяналтын модал цонх.
 */
export function QuestionPreviewModal({
  question,
  onClose,
}: {
  question: QuestionBankItem;
  onClose: () => void;
}) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isSuperAdmin = currentUser?.role === "super_admin";

  const [allVersions, setAllVersions] = useState<QuestionBankItem[]>(
    question.versions && question.versions.length > 0 ? question.versions : [question]
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [loadingVersions, setLoadingVersions] = useState<boolean>(false);
  const [workflowEvents, setWorkflowEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const [commentModalConfig, setCommentModalConfig] = useState<{ title: string; action: string } | null>(null);
  const { showToast } = useToast();

  // Хувилбаруудын түүхийг DB-ээс дуудаж ачаалах
  useEffect(() => {
    if (question.versions && question.versions.length > 1) {
      setAllVersions(question.versions);
      return;
    }

    if (question.id) {
      let active = true;
      const loadFullHistory = async () => {
        try {
          setLoadingVersions(true);
          const fullItem = await getQuestionByIdAsync(question.id);
          if (active && fullItem && fullItem.versions && fullItem.versions.length > 0) {
            setAllVersions(fullItem.versions);
          }
        } catch (err) {
          console.error("Failed to load question version history:", err);
        } finally {
          if (active) setLoadingVersions(false);
        }
      };
      loadFullHistory();
      return () => {
        active = false;
      };
    }
  }, [question.id, question.versions]);

  // Workflow үйл явдлуудын түүхийг (timeline) ачаалах
  useEffect(() => {
    if (question.id) {
      let active = true;
      const loadEvents = async () => {
        try {
          setLoadingEvents(true);
          const evs = await fetchQuestionWorkflowEvents(question.id);
          if (active) {
            setWorkflowEvents(evs || []);
          }
        } catch (err) {
          console.error("Failed to load workflow events:", err);
        } finally {
          if (active) setLoadingEvents(false);
        }
      };
      loadEvents();
      return () => { active = false; };
    }
  }, [question.id]);

  // Workflow төлөв шинэчлэх үйлдлийг гүйцэтгэх
  const handleWorkflowAction = async (action: string, comment?: string) => {
    try {
      await sendQuestionWorkflow(question.id, action, comment);
      showToast("Асуултын төлөв амжилттай шинэчлэгдлээ.", "success");
      
      const fresh = await getQuestionByIdAsync(question.id);
      if (fresh) {
        if (fresh.versions && fresh.versions.length > 0) {
          setAllVersions(fresh.versions);
        } else {
          setAllVersions([fresh]);
        }
      }
      const freshEvs = await fetchQuestionWorkflowEvents(question.id);
      setWorkflowEvents(freshEvs || []);
    } catch (err: any) {
      showToast(err.message || "Ажиллагааг гүйцэтгэхэд алдаа гарлаа.", "danger");
    }
  };

  const activeQuestion = allVersions[selectedIndex] || question;
  const TypeIcon = questionTypeIcons[activeQuestion.type] || Icons.ListCheck;
  
  const scoringMode =
    activeQuestion.scoringMode ||
    (activeQuestion.scoringConfig as any)?.scoringMode ||
    (activeQuestion.contentJson as any)?.scoringMode ||
    (activeQuestion.contentJson as any)?.payload?.scoringMode ||
    "per_option";

  const totalPoints = activeQuestion.defaultMaxScore !== undefined ? activeQuestion.defaultMaxScore : (activeQuestion.points !== undefined ? activeQuestion.points : 1);
  const minPoints = activeQuestion.defaultMinScore !== undefined ? activeQuestion.defaultMinScore : (activeQuestion.minPoints !== undefined ? activeQuestion.minPoints : 0);
  const durationSeconds = activeQuestion.defaultTimeSeconds || activeQuestion.durationSeconds || 60;

  return (
    <div className="fixed inset-0 z-modal grid place-items-center bg-slate-900/60 backdrop-blur-sm p-seek-4 transition-all duration-300">
      <Card className="max-h-[92vh] w-full max-w-4xl overflow-auto p-seek-6 shadow-2xl relative border-slate-200">
        {/* Close Button */}
        <div className="absolute right-4 top-4">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full flex items-center justify-center hover:bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-800"
          >
            ✕
          </Button>
        </div>

        {/* Modal Title Section */}
        <div className="flex items-start justify-between gap-seek-4 pr-seek-6">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              
              <Badge variant="secondary" className="font-mono text-xs">
                [{activeQuestion.code}]: <b>{activeQuestion.title || "Гарчиггүй даалгавар"}</b>
              </Badge>
              
              {/* Version History Selector Combobox */}
              {allVersions.length > 1 && (
                <div className="flex items-center gap-1.5 ml-2">
                  <span className="text-xs font-semibold text-slate-500">Хувилбар:</span>
                  <div className="relative inline-block">
                    <select
                      value={selectedIndex}
                      onChange={(e) => setSelectedIndex(Number(e.target.value))}
                      className="rounded-seek-md border border-slate-300 bg-white pl-2.5 pr-7 py-1 text-xs font-bold text-slate-800 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all hover:border-slate-400"
                    >
                      {allVersions.map((v, idx) => (
                        <option key={v.versionNumber || idx} value={idx}>
                          v{v.versionNumber || (allVersions.length - idx)} ({statusLabels[v.status] || v.status?.toUpperCase() || "DRAFT"}) {v.createdAt ? `• ${new Date(v.createdAt).toLocaleDateString()}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {selectedIndex > 0 && (
              <div className="flex items-center gap-2 rounded-seek-md bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-900 mt-1">
                <Icons.Info className="h-4 w-4 shrink-0 text-amber-600" />
                <span>
                  Та <strong>v{activeQuestion.versionNumber || (allVersions.length - selectedIndex)}</strong> өмнөх хувилбарыг үзэж байна. (Сүүлийн идэвхтэй хувилбар: v{allVersions[0]?.versionNumber || allVersions.length})
                </span>
              </div>
            )}

            
          </div>
        </div>

        {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
        {/* ҮНДСЭН ФАЙЛ */}     
        {/* ----------------------------------------------------------------------------------------------------------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-seek-6 mt-seek-4 items-start">
          <div className="space-y-seek-5 min-w-0">
            {/* Enhanced Metadata Card */}
            <div className="mt-seek-4 rounded-seek-lg border border-slate-200 bg-slate-50/80 p-seek-4 shadow-seek-xs">
              <div className="grid grid-cols-2 gap-seek-3">
                {/* Type */}
                <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-3 border border-slate-200/80 shadow-seek-xs">
                  <div className="h-8 w-8 rounded-seek-md bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <Text variant="muted" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Төрөл</Text>
                    <Text className="text-xs font-bold text-slate-800 truncate">{questionTypeLabels[activeQuestion.type]}</Text>
                  </div>
                </div>

                {/* Scoring Mode */}
                <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-3 border border-slate-200/80 shadow-seek-xs">
                  <div className="h-8 w-8 rounded-seek-md bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Icons.OneOption className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <Text variant="muted" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Оноо бодох</Text>
                    <Text className="text-xs font-bold text-slate-800 truncate">{scoringModeLabels[scoringMode] || scoringMode}</Text>
                  </div>
                </div>

                {/* Points */}
                <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-3 border border-slate-200/80 shadow-seek-xs">
                  <div className="h-8 w-8 rounded-seek-md bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                    <Icons.MaxValue className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <Text variant="muted" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Нийт оноо</Text>
                    <Text className="text-xs font-bold text-slate-800">{totalPoints} оноо {minPoints < 0 ? `(${minPoints})` : ""}</Text>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2.5 bg-white rounded-seek-md p-seek-3 border border-slate-200/80 shadow-seek-xs">
                  <div className="h-8 w-8 rounded-seek-md bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
                    <Icons.Timer className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <Text variant="muted" className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Хугацаа</Text>
                    <Text className="text-xs font-bold text-slate-800">{durationSeconds} сек</Text>
                  </div>
                </div>
              </div>

              {/* Context Badges Bar - Safely indexing BloomLevel, DifficultyLevel, CompetencyType to prevent TS errors */}
              <div className="mt-seek-3 pt-seek-3 border-t border-slate-200/60 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="bg-purple-50/60 border-purple-100 text-purple-700 text-xs px-2.5 py-1">
                  {activeQuestion.topicName || "Ерөнхий сэдэв"}
                </Badge>
                {activeQuestion.bloomLevel && (
                  <Badge variant="secondary" className="bg-blue-50/60 border-blue-100 text-blue-700 text-xs px-2.5 py-1">
                    Блум: {bloomLabels[activeQuestion.bloomLevel as BloomLevel] || activeQuestion.bloomLevel}
                  </Badge>
                )}
                {activeQuestion.difficulty && (
                  <Badge variant="warning" className="bg-amber-50 border-amber-200 text-amber-800 text-xs px-2.5 py-1">
                    Хүндрэл: {difficultyLabels[activeQuestion.difficulty as DifficultyLevel] || activeQuestion.difficulty}
                  </Badge>
                )}
                {activeQuestion.competencyType && (
                  <Badge variant="secondary" className="bg-emerald-50/60 border-emerald-100 text-emerald-700 text-xs px-2.5 py-1">
                    Чадамж: {competencyLabels[activeQuestion.competencyType as CompetencyType] || activeQuestion.competencyType}
                  </Badge>
                )}
              </div>
            </div>

            {/* Main Question Body & Interactive Learner Preview */}
            <div className="mt-seek-4 rounded-seek-lg border border-slate-200 bg-white p-seek-5 shadow-seek-xs">
              <LearnerQuestionPreview question={activeQuestion} />
            </div>




            {/* Feedback Cards Section */}
            <div className="mt-seek-5 space-y-seek-4">
             
             {/* Correct Feedback Card */}
             <div className="space-y-1">
              <Text className="text-xs font-bold text-blue-500">Ерөний тайлбар:</Text>
              <div className="rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-blue-500">
                <div className="flex">
                  <div className="w-12 bg-success-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                    <Icons.Info className="h-5 w-5 text-white bg-blue-500 rounded-full p-0.5" />
                  </div>
                  <div className="flex-1 p-seek-3">
                    
                    <div className="text-sm text-slate-700">
                      {activeQuestion.explanation || activeQuestion.explanation ? (
                        <RichTextPreview value={activeQuestion.explanation || activeQuestion.explanation || ""} />
                      ) : (
                        <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>


              {/* Correct Feedback Card */}
              <div className="space-y-1">
                <Text className="text-xs font-bold text-success mb-1">Зөв хариулсан үеийн тайлбар:</Text>
              <div className="rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-success">
                <div className="flex">
                  <div className="w-12 bg-success-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                    <Icons.Check className="h-5 w-5 text-white bg-success rounded-full p-0.5" />
                  </div>
                  <div className="flex-1 p-seek-3">
                    
                    <div className="text-sm text-slate-700">
                      {activeQuestion.feedbackCorrect || activeQuestion.feedback ? (
                        <RichTextPreview value={activeQuestion.feedbackCorrect || activeQuestion.feedback || ""} />
                      ) : (
                        <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>
              {/* Incorrect Feedback Card */}
              <div className="space-y-1">
                <Text className="text-xs font-bold text-danger mb-1">Буруу хариулсан үеийн тайлбар:</Text>
              <div className="rounded-seek-lg border border-border bg-slate-50/20 overflow-hidden border-l-[4px] border-l-danger">
                <div className="flex">
                  <div className="w-12 bg-danger-background/20 border-r border-border flex items-center justify-center flex-shrink-0">
                    <Icons.Close className="h-5 w-5 text-white bg-danger rounded-full p-0.5" />
                  </div>
                  <div className="flex-1 p-seek-3">
                    
                    <div className="text-sm text-slate-700">
                      {activeQuestion.feedbackIncorrect ? (
                        <RichTextPreview value={activeQuestion.feedbackIncorrect || ""} />
                      ) : (
                        <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Right Column: Workflow Controls & Timeline */}
          <div className="space-y-seek-5 border-l border-slate-200 pl-seek-5 lg:sticky lg:top-4 bg-white/50 backdrop-blur-xs p-seek-4 rounded-seek-lg">
            {/* Actions Card - Only Visible to Superadmin */}
            {isSuperAdmin && (
              <>
                <div className="space-y-seek-3">
                  <Text className="text-sm font-bold text-slate-800 block">Үйлдэл хийх (Superadmin)</Text>
                  <div className="flex flex-col gap-2">
                    {(activeQuestion.status === "approval_requested" ||
                      activeQuestion.status === "in_review" ||
                      activeQuestion.status === "resubmitted") && (
                      <>
                        <Button
                          type="button"
                          variant="primary"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setCommentModalConfig({ title: "Батлах тайлбар (Заавал бичнэ)", action: "approve" })}
                        >
                          Батлах (Approve)
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                          onClick={() => setCommentModalConfig({ title: "Засвар шаардах тайлбар", action: "changes_requested" })}
                        >
                          Засвар шаардах
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          className="w-full"
                          onClick={() => setCommentModalConfig({ title: "Татгалзах шалтгаан", action: "reject" })}
                        >
                          Татгалзах (Reject)
                        </Button>
                      </>
                    )}
                    {activeQuestion.status === "approved" && (
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full"
                        onClick={() => setCommentModalConfig({ title: "Нийтлэх тайлбар (Заавал бичнэ)", action: "publish" })}
                      >
                        Нийтлэх (Publish)
                      </Button>
                    )}
                    {activeQuestion.status !== "approval_requested" &&
                      activeQuestion.status !== "in_review" &&
                      activeQuestion.status !== "resubmitted" &&
                      activeQuestion.status !== "approved" && (
                      <Text variant="muted" className="text-xs italic">Энэ төлөвт хийх боломжтой үйлдэл байхгүй байна.</Text>
                    )}
                  </div>
                </div>
                <hr className="border-slate-200" />
              </>
            )}

            {/* Workflow History Timeline */}
            <div className="space-y-seek-2">
              <Badge variant={statusVariant[activeQuestion.status] || "secondary"}>
                {statusLabels[activeQuestion.status] || activeQuestion.status}
              </Badge>
              <Text className="text-sm font-bold text-slate-800">Хяналтын түүх</Text>
              {loadingEvents ? (
                <Text variant="muted" className="text-xs">Уншиж байна...</Text>
              ) : workflowEvents.length === 0 ? (
                <Text variant="muted" className="text-xs text-slate-400">Түүх байхгүй байна.</Text>
              ) : (
                <div className="space-y-seek-5 border-l-2 border-slate-100 ml-seek-2 pl-seek-4 py-seek-2">
                  {workflowEvents.map((ev: any, idx: number) => {
                    const isApproved = ev.newStatus === "approved" || ev.newStatus === "published";
                    const isRejected = ev.newStatus === "rejected" || ev.newStatus === "changes_requested";
                    const isDraft = ev.newStatus === "draft" || ev.newStatus === "deleted";
                    
                    const dotColorClass = isApproved 
                      ? "bg-emerald-500 ring-emerald-100" 
                      : isRejected 
                      ? "bg-rose-500 ring-rose-100" 
                      : isDraft
                      ? "bg-slate-400 ring-slate-100"
                      : "bg-amber-500 ring-amber-100";

                    const commentBorderColor = isApproved 
                      ? "border-l-emerald-500" 
                      : isRejected 
                      ? "border-l-rose-500" 
                      : isDraft
                      ? "border-l-slate-400"
                      : "border-l-amber-500";

                    const cleanAction = ev.action?.replace("bypass_", "").toLowerCase();
                    const actionLabel = actionLabels[cleanAction] || ev.action?.toUpperCase();

                    return (
                      <div key={ev.id || idx} className="relative space-y-1.5">
                        <div className={`absolute -left-[22px] top-1 h-2.5 w-2.5 rounded-full ring-4 ${dotColorClass} border border-white`} />
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 tracking-wide uppercase">
                          <span>{actionLabel}</span>
                          <span className="font-normal text-slate-500">{ev.occurredAt ? new Date(ev.occurredAt).toLocaleDateString() : ""}</span>
                        </div>
                        <div className="text-xs text-slate-700">
                          Шинэ төлөв: <span className="font-bold text-slate-900">{statusLabels[ev.newStatus as QuestionWorkflowStatus] || ev.newStatus?.toUpperCase()}</span>
                        </div>
                        {ev.comment && (
                          <div className={`text-[11px] leading-relaxed text-slate-600 bg-slate-50/70 rounded-seek-md p-seek-2.5 border border-slate-200/80 border-l-[3.5px] ${commentBorderColor} shadow-seek-xs mt-1.5 font-medium`}>
                            "{ev.comment}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {commentModalConfig && (
        <WorkflowCommentModal
          title={commentModalConfig.title}
          onSubmit={(comment) => {
            handleWorkflowAction(commentModalConfig.action, comment);
            setCommentModalConfig(null);
          }}
          onClose={() => setCommentModalConfig(null)}
        />
      )}
    </div>
  );
}

/**
 * LearnerQuestionPreview - Суралцагчдад асуултын агуулга болон хавсралт медиа хэрхэн 
 * харагдахыг урьдчилан үзүүлдэг компонент.
 */
function LearnerQuestionPreview({ question }: { question: QuestionBankItem }) {
  const stem = question.stem || question.body || "";

  return (
    <div className="space-y-seek-4">
      <div className="rounded-seek-md bg-slate-50/70 p-seek-4 border border-slate-100 text-slate-900">
        <RichTextPreview value={stem} isFillBlank={question.type === "FILL_BLANK"} />
      </div>
      <MediaPreview question={question} />
      <QuestionTypePreview question={question} />
    </div>
  );
}

/**
 * MediaPreview - Асуултанд хавсаргасан медиа файлуудыг (зураг, видео, аудио, файл) 
 * төрлөөс нь хамааран тохирох тоглуулагч эсвэл харагдацаар харуулдаг туслах компонент.
 */
function MediaPreview({ question }: { question: QuestionBankItem }) {
  if (!question.media || question.media.length === 0) return null;

  return (
    <div className="grid gap-seek-3 md:grid-cols-2 mt-seek-4">
      {question.media.map((item, idx) => {
        const fileUrl = item.url;
        
        return (
          <div
            key={`${item.type}-${idx}`}
            className="rounded-seek-md border border-border bg-surface p-seek-3 flex flex-col justify-between"
          >
            {item.type === "image" && (
              <div className="overflow-hidden rounded-seek-md bg-muted-background flex items-center justify-center border border-border">
                <img
                  src={fileUrl}
                  alt={item.name}
                  className="max-h-64 max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            
            {item.type === "video" && (
              <div className="overflow-hidden rounded-seek-md bg-black border border-border flex items-center justify-center">
                <video
                  src={fileUrl}
                  controls
                  className="max-h-64 w-full"
                />
              </div>
            )}
            
            {item.type === "audio" && (
              <div className="rounded-seek-md bg-muted-background p-seek-3 border border-border">
                <Text className="font-semibold text-sm mb-2 truncate">{item.name}</Text>
                <audio
                  src={fileUrl}
                  controls
                  className="w-full"
                />
              </div>
            )}
            
            {item.type === "file" && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-seek-md bg-muted-background p-seek-3 border border-border hover:bg-muted-background/80"
              >
                <Icons.Calendar className="h-8 w-8 text-primary" />
                <div className="min-w-0 flex-1">
                  <Text className="font-semibold text-sm truncate">Хавсралт файл (Татах)</Text>
                  <Text variant="muted" className="text-xs truncate">
                    {item.name}
                  </Text>
                </div>
              </a>
            )}
            
            {item.type !== "file" && (
              <Text variant="muted" className="mt-2 text-xs truncate">
                {item.name}
              </Text>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default QuestionPreviewModal;
