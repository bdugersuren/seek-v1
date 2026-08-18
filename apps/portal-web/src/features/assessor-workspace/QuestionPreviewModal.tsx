"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { Eye, Star } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"status" | "topics">("status");

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
      <Card className="max-h-[92vh] w-full max-w-5xl overflow-auto p-seek-6 shadow-2xl relative border-slate-200 bg-white rounded-seek-2xl">
        {/* Close Button */}
        <div className="absolute right-6 top-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="h-9 w-9 p-0 rounded-seek-md flex items-center justify-center hover:bg-slate-50 border-slate-200 text-slate-700 shadow-seek-sm bg-white"
          >
            ✕
          </Button>
        </div>

        {/* Modal Title Section */}
        <div className="flex items-start gap-seek-3.5 pr-seek-8 pb-seek-4 gap-seek-3">
          <div className="w-10 h-10 rounded-seek-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-seek-xs">
            <Eye className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider block uppercase">
              {activeQuestion.code}
            </span>
            <Text className="text-xl font-bold text-slate-800 leading-tight">
              {activeQuestion.title || "Гарчиггүй даалгавар"}
            </Text>
          </div>
        </div>

        {/* Horizontal tags/badges strip */}
        <div className="flex flex-wrap items-center gap-2 pb-seek-5 border-b border-slate-100">
          {/* Type Badge */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-seek-md shadow-seek-xs">
            <TypeIcon className="h-3.5 w-3.5" />
            <span>{questionTypeLabels[activeQuestion.type]}</span>
          </div>

          {/* Scoring Mode Badge */}
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold px-2.5 py-1.5 rounded-seek-md shadow-seek-xs">
            {scoringMode === "combination" ? (
              <Icons.OneOption className="h-3.5 w-3.5" />
            ) : scoringMode === "manual" ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <Icons.Check className="h-3.5 w-3.5 stroke-[2.5]" />
            )}
            <span>{scoringModeLabels[scoringMode] || "Харгалзах оноо"}</span>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1.5 rounded-seek-md shadow-seek-xs">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>Оноо:[{minPoints < 0 ? minPoints : minPoints === 0 ? "0" : `-${minPoints}`}, +{totalPoints}]</span>
          </div>

          {/* Duration Badge */}
          <div className="flex items-center gap-1.5 bg-slate-100/70 border border-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-seek-md shadow-seek-xs">
            <Icons.Timer className="h-3.5 w-3.5" />
            <span>
              {String(Math.floor(durationSeconds / 60)).padStart(2, '0')}:{String(durationSeconds % 60).padStart(2, '0')} mins
            </span>
          </div>
        </div>

        {selectedIndex > 0 && (
          <div className="flex items-center gap-2 rounded-seek-md bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-900 mt-3">
            <Icons.Info className="h-4 w-4 shrink-0 text-amber-600" />
            <span>
              Та <strong>v{activeQuestion.versionNumber || (allVersions.length - selectedIndex)}</strong> өмнөх хувилбарыг үзэж байна. (Сүүлийн идэвхтэй хувилбар: v{allVersions[0]?.versionNumber || allVersions.length})
            </span>
          </div>
        )}

        {/* ----------------------------------------------------------------------------------------------------------------------------------- */}
        {/* ҮНДСЭН ФАЙЛ */}     
        {/* ----------------------------------------------------------------------------------------------------------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-seek-6 mt-seek-5 items-start">
          <div className="space-y-seek-5 min-w-0">
            {/* Main Question Body & Interactive Learner Preview */}
            <div className="rounded-seek-xl border border-slate-200 bg-white p-seek-5 shadow-seek-xs">
              <LearnerQuestionPreview question={activeQuestion} />
            </div>




            {/* Feedback Cards Section */}
            <div className="mt-seek-5 space-y-seek-5">
              {/* General Explanation */}
              <div className="space-y-seek-2">
                <Text className="text-sm font-bold text-slate-800">General Explanation</Text>
                <div className="rounded-seek-xl border border-slate-200 bg-blue-50/5 overflow-hidden border-l-[4px] border-l-blue-500 p-seek-4 shadow-seek-xs">
                  <div className="text-sm text-slate-600 font-medium leading-relaxed">
                    {activeQuestion.explanation ? (
                      <RichTextPreview value={activeQuestion.explanation} />
                    ) : (
                      <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                    )}
                  </div>
                </div>
              </div>

              {/* Correct Feedback */}
              <div className="space-y-seek-2">
                <Text className="text-sm font-bold text-slate-800">Correct Feedback</Text>
                <div className="rounded-seek-xl border border-slate-200 bg-emerald-50/5 overflow-hidden border-l-[4px] border-l-emerald-500 p-seek-4 shadow-seek-xs">
                  <div className="text-sm text-slate-600 font-medium leading-relaxed">
                    {activeQuestion.feedbackCorrect || activeQuestion.feedback ? (
                      <RichTextPreview value={activeQuestion.feedbackCorrect || activeQuestion.feedback || ""} />
                    ) : (
                      <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                    )}
                  </div>
                </div>
              </div>

              {/* Incorrect Feedback */}
              <div className="space-y-seek-2">
                <Text className="text-sm font-bold text-slate-800">Incorrect Feedback</Text>
                <div className="rounded-seek-xl border border-slate-200 bg-rose-50/5 overflow-hidden border-l-[4px] border-l-rose-500 p-seek-4 shadow-seek-xs">
                  <div className="text-sm text-slate-600 font-medium leading-relaxed">
                    {activeQuestion.feedbackIncorrect ? (
                      <RichTextPreview value={activeQuestion.feedbackIncorrect} />
                    ) : (
                      <Text variant="muted" className="text-xs italic">Тайлбар тохируулаагүй.</Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Workflow Controls & Timeline */}
          <div className="space-y-seek-5 border-l border-slate-200 pl-seek-5 lg:sticky lg:top-4 bg-white/50 backdrop-blur-xs p-seek-1 rounded-seek-lg">
            
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-100 gap-seek-5 mb-seek-4">
              <button 
                type="button"
                onClick={() => setActiveTab("status")}
                className={`pb-seek-2.5 text-sm font-bold transition-all relative ${
                  activeTab === "status" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Status
                {activeTab === "status" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("topics")}
                className={`pb-seek-2.5 text-sm font-bold transition-all relative ${
                  activeTab === "topics" ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Topics
                {activeTab === "topics" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            </div>

            {/* Actions Card - Only Visible to Superadmin */}
            {isSuperAdmin && (
              <div className="space-y-seek-3 pb-seek-4 border-b border-slate-100">
                <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Үйлдэл хийх (Superadmin)</Text>
                <div className="flex flex-col gap-2">
                  {(activeQuestion.status === "approval_requested" ||
                    activeQuestion.status === "in_review" ||
                    activeQuestion.status === "resubmitted") && (
                    <>
                      <Button
                        type="button"
                        variant="primary"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-9 text-xs"
                        onClick={() => setCommentModalConfig({ title: "Батлах тайлбар (Заавал бичнэ)", action: "approve" })}
                      >
                        Батлах (Approve)
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold h-9 text-xs"
                        onClick={() => setCommentModalConfig({ title: "Засвар шаардах тайлбар", action: "changes_requested" })}
                      >
                        Засвар шаардах
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        className="w-full font-bold h-9 text-xs"
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
                      className="w-full font-bold h-9 text-xs"
                      onClick={() => setCommentModalConfig({ title: "Нийтлэх тайлбар (Заавал бичнэ)", action: "publish" })}
                    >
                      Нийтлэх (Publish)
                    </Button>
                  )}
                  {activeQuestion.status !== "approval_requested" &&
                    activeQuestion.status !== "in_review" &&
                    activeQuestion.status !== "resubmitted" &&
                    activeQuestion.status !== "approved" && (
                    <Text variant="muted" className="text-xs italic text-slate-400">Эдгээр төлөвт хийх үйлдэл байхгүй.</Text>
                  )}
                </div>
              </div>
            )}

            {activeTab === "status" ? (
              <div className="space-y-seek-5">
                {/* VERSION HISTORY */}
                <div className="space-y-seek-3">
                  <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Version History</Text>
                  
                  {/* Select Combobox */}
                  <div className="relative w-full">
                    <select
                      value={selectedIndex}
                      onChange={(e) => setSelectedIndex(Number(e.target.value))}
                      className="w-full rounded-seek-md border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-seek-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-all hover:border-slate-300 appearance-none"
                    >
                      {allVersions.map((v, idx) => (
                        <option key={v.versionNumber || idx} value={idx}>
                          v{v.versionNumber || (allVersions.length - idx)}.0 {v.id === question.id ? "(Current)" : ""}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                      ▼
                    </div>
                  </div>

                  {/* Versions List */}
                  <div className="space-y-seek-2.5 pt-seek-1">
                    {allVersions.map((v, idx) => {
                      const isCurrent = v.id === question.id;
                      const isSelected = selectedIndex === idx;
                      
                      return (
                        <div key={v.id || idx} className="flex items-center justify-between text-xs py-0.5">
                          <span className={`font-bold ${isSelected ? "text-slate-800" : "text-slate-500 font-semibold"}`}>
                            v{v.versionNumber || (allVersions.length - idx)}.0 {isCurrent ? "(Current)" : ""}
                          </span>
                          <div className="flex items-center gap-seek-2.5">
                            {isCurrent && (
                              <Badge variant="success" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px] px-1.5 py-0.5 font-bold rounded-seek-md">
                                Active
                              </Badge>
                            )}
                            {!isSelected && (
                              <button
                                type="button"
                                onClick={() => setSelectedIndex(idx)}
                                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-bold text-[11px] transition-colors"
                              >
                                <Eye className="h-3.5 w-3.5 stroke-[2]" />
                                <span>View</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* CURRENT STATUS */}
                <div className="space-y-seek-3 pt-seek-4 border-t border-slate-100">
                  <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Current Status</Text>
                  <div className="space-y-2">
                    <div className={`flex items-center gap-1.5 border text-[11px] font-bold px-2.5 py-1 rounded-full w-fit ${
                      activeQuestion.status === "approved" || activeQuestion.status === "published"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                        : activeQuestion.status === "changes_requested" || activeQuestion.status === "rejected" || activeQuestion.status === "deleted"
                        ? "bg-rose-50 border-rose-100 text-rose-700"
                        : activeQuestion.status === "approval_requested" || activeQuestion.status === "in_review" || activeQuestion.status === "resubmitted"
                        ? "bg-amber-50 border-amber-100 text-amber-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        activeQuestion.status === "approved" || activeQuestion.status === "published"
                          ? "bg-emerald-500"
                          : activeQuestion.status === "changes_requested" || activeQuestion.status === "rejected" || activeQuestion.status === "deleted"
                          ? "bg-rose-500"
                          : activeQuestion.status === "approval_requested" || activeQuestion.status === "in_review" || activeQuestion.status === "resubmitted"
                          ? "bg-amber-500"
                          : "bg-slate-400"
                      }`} />
                      <span>{statusLabels[activeQuestion.status as QuestionWorkflowStatus] || "Ноорог"}</span>
                    </div>
                    {activeQuestion.updatedAt && (
                      <span className="text-[10px] font-semibold text-slate-400 block">
                        Last reviewed: {new Date(activeQuestion.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    )}
                  </div>
                </div>

                {/* STATUS HISTORY */}
                <div className="space-y-seek-3 pt-seek-4 border-t border-slate-100">
                  <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Status History</Text>
                  
                  {loadingEvents ? (
                    <Text variant="muted" className="text-xs">Уншиж байна...</Text>
                  ) : workflowEvents.length > 0 ? (
                    <div className="space-y-seek-5 border-l border-slate-200 ml-seek-1.5 pl-seek-4 py-seek-2.5 relative">
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

                        const statusText = statusLabels[ev.newStatus as QuestionWorkflowStatus] || ev.newStatus;

                        return (
                          <div key={ev.id || idx} className="relative space-y-0.5">
                            {/* Dot indicator */}
                            <div className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ring-4 ${dotColorClass} border border-white`} />
                            
                            <span className="text-xs font-bold text-slate-800 block">
                              {statusText}
                            </span>
                            
                            {ev.comment && (
                              <span className="text-[11px] text-slate-500 block italic leading-tight mb-0.5">
                                "{ev.comment}"
                              </span>
                            )}
                            
                            <span className="text-[10px] font-semibold text-slate-400 block">
                              {ev.actorName || "Reviewer"} • {ev.occurredAt ? new Date(ev.occurredAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-2 text-slate-400 text-xs italic">
                      Төлөвийн түүх байхгүй байна.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Topics and Categories Tab
              <div className="space-y-seek-4 text-xs font-medium text-slate-600">
                <div className="space-y-seek-3.5">
                  
                  {(!activeQuestion.topicMappings || activeQuestion.topicMappings.length === 0) && (
                    <div className="flex flex-col gap-1 p-seek-3 rounded-seek-md bg-slate-50 border border-slate-150 text-slate-400 italic">
                      Сэдэв болон түвшин тохируулаагүй байна.
                    </div>
                  )}

                  {activeQuestion.topicMappings && activeQuestion.topicMappings.length > 0 && activeQuestion.topicMappings.map((mapping, mIdx) => (
                    
                    <div className="p-1" key={mapping.topicId || mIdx}>
                    <span className="font-bold text-slate-800 text-xs">{mapping.topicName || "Ерөнхий сэдэв"} ( {difficultyLabels[mapping.difficulty as DifficultyLevel] || mapping.difficulty || "Тохируулаагүй"})</span>
                    
                    
                    <div key={mapping.topicId || mIdx} className="space-y-seek-1 p-seek-3.5 rounded-seek-lg bg-slate-50/70 border border-slate-205">
                      {/* Topic Name */}
                      
                     
                      {/* Cognitive Levels */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Танин мэдэхүйн түвшин (Bloom)</span>
                        {mapping.cognitiveLevels && mapping.cognitiveLevels.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {mapping.cognitiveLevels.map((lvl, lIdx) => (
                              <Badge key={lIdx} variant="outline" className="bg-white text-slate-700 border-slate-200 text-[10px] py-0.5 px-2 font-semibold">
                                {lvl.name || lvl.cognitiveLevelId} ({lvl.weight})
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-400 italic">Сонгоогүй</span>
                        )}
                      </div>

                      {/* Competencies */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Үнэлэх ур чадвар</span>
                        {mapping.competencies && mapping.competencies.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-0.5">
                            {mapping.competencies.map((comp, cIdx) => (
                              <Badge key={cIdx} variant="outline" className="bg-white text-slate-700 border-slate-200 text-[10px] py-0.5 px-2 font-semibold">
                                {comp.name || comp.competenceId} ({comp.weight})
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="font-semibold text-slate-400 italic">Сонгоогүй</span>
                        )}
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAGS */}
            {activeQuestion.tags && activeQuestion.tags.length > 0 && (
              <div className="space-y-seek-2.5 pt-seek-4 border-t border-slate-100">
                <Text className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Tags</Text>
                <div className="flex flex-wrap gap-2">
                  {activeQuestion.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1 font-semibold rounded-seek-md border-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Close Button at the Bottom */}
        <div className="flex justify-center mt-seek-6 pt-seek-4 border-t border-slate-100">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            className="px-seek-6 py-2 h-10 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-seek-md shadow-seek-xs bg-white text-xs"
          >
            Close
          </Button>
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
