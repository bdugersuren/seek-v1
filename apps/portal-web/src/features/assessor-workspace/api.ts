import { optionLabel } from "./option-label";
import type { CognitiveFramework, CognitiveLevel, CognitiveFrameworkInput, CognitiveLevelInput } from "@/features/cognitive-management/types";
import type { AudienceType, AudienceLevel } from "@/features/assessments/types";
export type AudienceTypeInput = Pick<AudienceType,"name"|"code"> & Partial<Pick<AudienceType,"description"|"isActive">>;
export type AudienceLevelInput = Pick<AudienceLevel,"audienceTypeId"|"name"|"code"> & Partial<Pick<AudienceLevel,"parentId"|"orderIndex"|"levelKind"|"externalCode"|"isActive">> & {rank?:number};
export class AssessmentApiError extends Error { constructor(public status: number, public code?: string) { super("Assessment request failed"); } }
import { authFetch } from "@/lib/auth-client";
import { mockBlueprints, mockQuestionBank } from "./mock-data";
import type {
  Blueprint,
  BlueprintSection,
  QuestionBankItem,
  QuestionTopicMapping,
  QuestionOption,
  QuestionWorkflowStatus,
  Quiz,
  QuizQuestionOverride,
} from "./types";

export async function requestAssessmentJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await authFetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw Object.assign(new Error(payload.message || "Request failed"), {status: res.status, code: payload.code, field:payload.field, issues:payload.issues});
  }
  return payload as T;
}

export function getQuestionStats(questions: QuestionBankItem[]) {
  const visible = questions.filter((question) => question.status !== "deleted");
  return {
    total: visible.length,
    active: visible.filter((question) =>
      ["approved", "published"].includes(question.status),
    ).length,
    inactive: visible.filter((question) =>
      ["draft", "changes_requested", "rejected", "archived"].includes(
        question.status,
      ),
    ).length,
    selectedTopics: new Set(visible.map((question) => question.topicId)).size,
  };
}

export function canEditQuestion(status: QuestionWorkflowStatus) {
  return ["draft", "changes_requested", "rejected"].includes(status);
}

export function getNextWorkflowActions(status: QuestionWorkflowStatus) {
  if (status === "draft") return ["approval_requested", "deleted"] as const;
  if (status === "changes_requested") return ["resubmitted", "deleted"] as const;
  if (status === "approved") return ["published", "archived"] as const;
  if (status === "published") return ["archived"] as const;
  return [] as const;
}

export function getBlueprintSummary(blueprint: Blueprint) {
  const pickedQuestions = blueprint.sections.reduce(
    (sum, section) => sum + section.randomPickCount,
    0,
  );
  const pooledQuestions = blueprint.sections.reduce(
    (sum, section) => sum + section.selectedQuestionIds.length,
    0,
  );
  const totalPoints = blueprint.sections.reduce(
    (sum, section) => sum + section.randomPickCount * section.pointsPerQuestion,
    0,
  );

  return {
    pickedQuestions,
    pooledQuestions,
    totalPoints,
    ready: blueprint.readiness ? blueprint.readiness.status === "READY" : blueprint.sections.length>0 && blueprint.sections.every(isBlueprintSectionValid),
  };
}

export function isBlueprintSectionValid(section: BlueprintSection) {
  return (
    section.selectedQuestionIds.length > 0 &&
    section.randomPickCount > 0 &&
    section.randomPickCount <= section.selectedQuestionIds.length
  );
}

// Synchronous Lookups for UI page mappings compatibility
export function getQuestionById(id: string): QuestionBankItem | null {
  return mockQuestionBank.find((question) => question.id === id) || null;
}

export function getBlueprintById(id: string): Blueprint | null {
  return mockBlueprints.find((blueprint) => blueprint.id === id) || null;
}

export function mapVersionToQuestionBankItem(actV: any, q: any): QuestionBankItem {
  const primaryClassification = q.classifications?.find((c:any)=>c.assessmentContextId===q.assessmentContextId) || q.classifications?.[0];
  const topicId = primaryClassification?.topicId || actV.topicId || (primaryClassification?.topic?.code) || "general";
  const topicName = primaryClassification?.topic?.title || primaryClassification?.topic?.name || actV.topicName || (primaryClassification ? "Сэдэв" : "Ерөнхий");

  const topicMappings: QuestionTopicMapping[] = (q.classifications || []).map((c: any) => ({
    topicId: c.topicId,
    topicName: c.topic?.title || c.topic?.name || c.topicId,
    bloomLevel: (c.cognitiveLevels?.[0]?.cognitiveLevel?.code || c.cognitiveLevel?.code || c.cognitiveLevelId || "apply") as any,
    competencyType: "knowledge" as any,
    difficulty: (c.difficultyLevel?.code || c.difficultyLevelId || "medium") as any,
    weight: Number(c.weight || 1),
    assessmentContextId: c.assessmentContextId,
    cognitiveFrameworkId: c.cognitiveLevels?.[0]?.cognitiveLevel?.cognitiveFrameworkId || c.cognitiveLevel?.cognitiveFrameworkId || c.assessmentContext?.cognitiveFrameworkId,
    difficultyScaleId: c.difficultyLevel?.difficultyScaleId || c.assessmentContext?.difficultyScaleId,
    competenceFrameworkId: c.assessmentContext?.competenceFrameworkId,
    audienceTypeId: c.assessmentContext?.audienceTypeId,
    audienceLevelId: c.assessmentContext?.audienceLevelId,
    competencies: (c.competences || []).map((tc: any) => ({
      competenceId: tc.competenceId,
      weight: Number(tc.weight || 1),
      name: tc.competence?.name || tc.competenceId,
    })),
    cognitiveLevels: (c.cognitiveLevels || []).map((cl: any) => ({
      cognitiveLevelId: cl.cognitiveLevelId,
      weight: Number(cl.weight || 1),
      name: cl.cognitiveLevel?.name || cl.cognitiveLevelId,
    })),
  }));

  const scoringConfig = actV.scoringConfig || actV.payload?.scoringConfig || {};
  const scoringMode =
    actV.scoringMode ||
    scoringConfig.scoringMode ||
    actV.payload?.scoringMode ||
    actV.payload?.scoringConfig?.scoringMode ||
    "per_option";

  const rawOptions = (Array.isArray(actV.options) && actV.options.length > 0)
    ? actV.options
    : (Array.isArray(actV.payload?.options) ? actV.payload.options : []);

  const options: QuestionOption[] = [...rawOptions].sort((a:any,b:any)=>(a.orderIndex ?? 0)-(b.orderIndex ?? 0)).map((o: any, idx: number) => ({
    id: o.optionKey || o.id || o.code || `opt_${idx + 1}`,
    label: optionLabel(actV.type, idx, o.metadata?.displayLabel || o.label),
    optionKey: o.optionKey || o.code || o.id || `opt_${idx + 1}`,
    value: o.value || o.body || "",
    isCorrect: Boolean(o.isCorrect),
    score: o.score !== undefined && o.score !== null ? Number(o.score) : (o.isCorrect ? 1 : 0),
    matchValue: o.matchRules?.matchValue || o.metadata?.matchValue || o.matchValue || "",
    acceptedValues: o.metadata?.acceptedValues || o.acceptedValues || [],
    metadata: o.metadata || {},
  }));

  const explanation = actV.explanation || actV.feedback || "";

  return {
    id: q.id,
    revision:q.revision,
    statistics:q.statistics,
    questionVersionId:actV.id,
    allowedActions:q.allowedActions,
    code: q.code,
    title: actV.title || "No Title",
    body: actV.body || "",
    parentId: q.parentId || null,
    type: (actV.type || "SINGLE_CHOICE") as any,
    status: (q.lifecycleStatus === "ARCHIVED" ? "archived" : actV.versionStatus?.toLowerCase()) as any,
    defaultMaxScore: Number(actV.defaultMaxScore !== undefined && actV.defaultMaxScore !== null ? actV.defaultMaxScore : 1),
    defaultMinScore: Number(actV.defaultMinScore !== undefined && actV.defaultMinScore !== null ? actV.defaultMinScore : 0),
    defaultTimeSeconds: actV.defaultTimeSeconds || 60,
    bloomLevel: primaryClassification?.cognitiveLevels?.[0]?.cognitiveLevel?.code?.toLowerCase() as any,
    competencyType: (primaryClassification?.competencyType?.toLowerCase() || "knowledge") as any,
    topicId,
    topicName,
    topicMappings,
    difficulty: primaryClassification?.difficultyLevel?.code || undefined,
    difficultyName: primaryClassification?.difficultyLevel?.name,
    difficultyColor: primaryClassification?.difficultyLevel?.color,
    difficultyRank: primaryClassification?.difficultyLevel?.rank,
    difficultyLevelId: primaryClassification?.difficultyLevelId,
    publishedVersionId: q.currentPublishedVersion?.id || q.currentPublishedVersionId,
    options,
    answerKey: (() => {
      const type = actV.type || "SINGLE_CHOICE";
      if (type === "SHORT_TEXT") return actV.answerConfig?.answerKey || "-";
      if (type === "MATCHING") {
        return options
          .map((o: any) => `${o.value} ➔ ${scoringConfig.rightOptions?.find((r:any)=>r.id===o.matchValue)?.value || o.matchValue || ""}`)
          .join(", ");
      }
      if (type === "NUMERIC") {
        const opt = options[0];
        return opt ? `Тоо: ${opt.value}, Хүлцэл: ±${opt.matchValue || 0}` : "-";
      }
      return options
        .filter((o: any) => o.isCorrect)
        .map((o: any) => o.label || o.optionKey || o.id)
        .join(", ") || "-";
    })(),
    rubric: actV.rubric || actV.payload?.rubric || [],
    tags: q.tags || actV.tags || [],
    explanation,
    feedbackCorrect: actV.feedbackCorrect || "",
    feedbackIncorrect: actV.feedbackIncorrect || "",
    scoringMode,
    scoringConfig,
    presentationConfig: actV.presentationConfig || {},
    media: (actV.media || []).map((m: any) => {
      let type: "image" | "audio" | "video" | "file" = "file";
      const mType = (m.mediaType || m.type || "").toLowerCase();
      if (mType === "image" || mType === "audio" || mType === "video") {
        type = mType as any;
      }
      const name = m.metadata?.name || m.name || m.storageKey?.split("/").pop() || "media_file";
      const url = m.url || `/api/v1/file/objects?storageKey=${encodeURIComponent(m.storageKey || "")}`;
      return { 
        type, 
        name, 
        url, 
        storageKey: m.storageKey,
        mediaType: m.mediaType || type.toUpperCase(),
        mimeType: m.mimeType || null,
        sizeBytes: m.sizeBytes || null,
      };
    }),
    ownerUserId: q.ownerUserId || "",
    createdBy: actV.createdBy || q.createdBy || "",
    updatedBy: actV.updatedBy || q.updatedBy || "",
    createdAt: actV.createdAt || q.createdAt || "",
    updatedAt: actV.updatedAt || q.updatedAt || "",
    versionNumber: actV.versionNumber !== undefined ? actV.versionNumber : q.version,
    versionStatus: actV.versionStatus || q.lifecycleStatus,
    workflowHistory: (q.workflowEvents||[]).map((e:any)=>({id:e.id,status:e.newStatus.toLowerCase(),comment:e.comment||"",actorId:e.actorUserId,actorName:e.actorUserId,actorRole:e.actorRole||"",createdAt:e.occurredAt})),
  };
}

export function mapToQuestionBankItem(q: any): QuestionBankItem {
  const actV = q.activeVersion || q.versions?.[0] || q.currentPublishedVersion || {};
  const mainItem = mapVersionToQuestionBankItem(actV, q);

  if (Array.isArray(q.versions) && q.versions.length > 0) {
    mainItem.versions = q.versions.map((v: any) => mapVersionToQuestionBankItem(v, q));
  } else {
    mainItem.versions = [mainItem];
  }

  return mainItem;
}

export function mapToBlueprint(b:any):Blueprint {
 return {id:b.id,code:b.code,version:b.version,createdBy:b.createdBy,title:b.name||'',description:b.description||'',topicId:b.topicId||'',topicName:b.topicName||'Тохируулаагүй',assessmentContextId:b.assessmentContextId,passScore:Number(b.defaultPassingScore),totalDurationMinutes:b.defaultDurationMinutes,status:b.lifecycleStatus==='ARCHIVED'?'archived':'draft',updatedAt:b.updatedAt,usageCount:b.usageCount??b._count?.quizzes??0,readiness:b.readiness,linkedQuizzes:b.linkedQuizzes,allowedActions:b.allowedActions,sections:(b.sections||[]).map((s:any)=>({id:s.id,name:s.title,description:s.description||'',randomPickCount:s.questionCount,pointsPerQuestion:Number(s.maxScorePerQuestion),selectedQuestionIds:(s.questions||[]).map((q:any)=>q.questionId),sectionMode:s.sectionMode,selectionRules:{schemaVersion:1,...s.selectionRules},durationMinutes:0,strategy:'random'}))};
}
export function blueprintPayload(data:any){return {name:data.title??data.name,code:data.code||undefined,version:data.version,description:data.description,topicId:data.topicId||null,assessmentContextId:data.assessmentContextId,defaultDurationMinutes:data.totalDurationMinutes??data.defaultDurationMinutes??60,defaultPassingScore:data.passScore??data.defaultPassingScore??70,lifecycleStatus:data.status==='archived'?'ARCHIVED':'DRAFT',sections:(data.sections||[]).map((s:any)=>({...(s.id&&!s.id.startsWith('new-')?{id:s.id}:{}),name:s.name,description:s.description||'',sectionMode:s.sectionMode||'FIXED',selectionRules:{schemaVersion:1,...s.selectionRules},randomPickCount:Number(s.randomPickCount),pointsPerQuestion:Number(s.pointsPerQuestion),selectedQuestionIds:s.sectionMode==='RULE_BASED'?[]:s.selectedQuestionIds}))};}
export async function fetchBlueprintPage(filters:Record<string,string>){const r=await requestAssessmentJson<any>('/api/v1/assessment/blueprints?'+new URLSearchParams({...filters,paged:'true'}));return {...r,items:r.items.map(mapToBlueprint)};}
export async function previewBlueprint(data:any){return requestAssessmentJson<any>('/api/v1/assessment/blueprints/preview',{method:'POST',body:JSON.stringify(blueprintPayload(data))});}
export async function duplicateBlueprint(id:string){return mapToBlueprint(await requestAssessmentJson<any>(`/api/v1/assessment/blueprints/${encodeURIComponent(id)}/duplicate`,{method:'POST',body:'{}'}));}

export function mapToQuiz(q: any): Quiz {
  const rev=q.selectedRevision||q.revisions?.[0]||q.currentPublishedRevision;
  return {...q,blueprintId:q.templateId,title:rev?.title||q.title,description:rev?.description,
    durationMinutes:rev?.durationMinutes,maxAttempts:rev?.maxAttempts,passingScore:rev?.passingScore==null?null:Number(rev.passingScore),
    status:rev?.revisionStatus?.toLowerCase(),revisionStatus:rev?.revisionStatus,
    priceMnt:rev?.defaultPrice==null?null:Number(rev.defaultPrice),
    questionOverrides:rev?.runtimePolicy?.questionOverrides||[],
    selectedRevision:rev} as Quiz;
}

// -------------------------------------------------------------
// Real Async API integrations mapping to NestJS microservices
// -------------------------------------------------------------

export async function fetchQuestions(filters?: any): Promise<QuestionBankItem[]> {
  const query = filters ? "?" + new URLSearchParams(filters).toString() : "";
  const questions = await requestAssessmentJson<any[]>(`/api/v1/assessment/questions${query}`);
  return questions.map(mapToQuestionBankItem);
}

export function mapToCreateQuestionDto(data: any) {
  let rubric=data.rubric||[];
  if(typeof rubric==='string'){try{rubric=JSON.parse(rubric);}catch{throw Error('Rubric тохиргооны формат буруу байна.');}}

  const payloadOptions = (data.options || []).map((o: any, index: number) => {
    const finalVal = o.value || "";
    return {
      code: o.optionKey || o.id || o.label || `opt_${index + 1}`,
      optionKey: o.optionKey || o.id || o.label || `opt_${index + 1}`,
      label: o.label || "",
      value: finalVal,
      body: finalVal,
      isCorrect: o.isCorrect || false,
      score: Number(o.score !== undefined ? o.score : (o.isCorrect ? (data.defaultMaxScore || 1) : 0)),
      matchValue: o.matchValue || "",
      matchRules: {
        matchValue: o.matchValue || "",
      },
      metadata: {
        displayLabel: o.label || "",
        acceptedValues: o.acceptedValues || [],
        ...(o.metadata || {})
      }
    };
  });

  const scoringConfig = {
    ...(data.scoringConfig || {}),
    scoringMode: data.scoringMode || data.scoringConfig?.scoringMode || "per_option",
    combinations: (data.scoringConfig?.combinations || []).map((c: any) => ({
      ids: c.ids || [],
      score: Number(c.score ?? 1)
    }))
  };

  return {
    expectedRevision:data.revision,
    assessmentContextId: data.assessmentContextId,
    code: data.code,
    lifecycleStatus: "ACTIVE",
    visibilityScope: data.visibilityScope || "PRIVATE",
    ownerUserId: data.ownerUserId || null,
    parentId: data.parentId || null,
    title: data.title || "No Title",
    body: data.body || "Шинэ асуулт",
    type: data.type || data.typeId || "SINGLE_CHOICE",
    defaultTimeSeconds: Number(data.defaultTimeSeconds !== undefined ? data.defaultTimeSeconds : 60),
    defaultMaxScore: Number(data.defaultMaxScore !== undefined ? data.defaultMaxScore : 1),
    defaultMinScore: Number(data.defaultMinScore !== undefined ? data.defaultMinScore : 0),
    languageCode: "mn",
    tags: data.tags || [],
    explanation: data.explanation || "",
    feedbackCorrect: data.feedbackCorrect || "",
    feedbackIncorrect: data.feedbackIncorrect || "",
    payload: {
      options: payloadOptions,
      scoringMode: scoringConfig.scoringMode,
      scoringConfig,
    },
    answerConfig: {
      answerKey: data.answerKey || "",
    },
    scoringConfig,
    rubric,
    presentationConfig: data.presentationConfig || {},
    media: (data.media || []).map((m: any, index: number) => ({
      mediaType: (m.mediaType || m.type || "IMAGE").toUpperCase(),
      storageKey: m.storageKey,
      mimeType: m.mimeType || null,
      sizeBytes: m.sizeBytes ? Number(m.sizeBytes) : null,
      orderIndex: index + 1,
      metadata: m.metadata || {},
    })),
    topicMappings: (data.mappings || data.topicMappings || []).map((m: any) => ({
      topicId: m.topicId,
      bloomLevel: m.bloomLevel,
      difficulty: m.difficulty,
      weight: m.weight !== undefined ? Number(m.weight) : 1.0,
      assessmentContextId: m.assessmentContextId || null,
      difficultyScaleId: m.difficultyScaleId || null,
      cognitiveFrameworkId: m.cognitiveFrameworkId || null,
      competenceFrameworkId: m.competenceFrameworkId || null,
      audienceTypeId: m.audienceTypeId || null,
      audienceLevelId: m.audienceLevelId || null,
      competencies: (m.competencies || []).map((c: any) => ({
        competenceId: c.competenceId || c.id,
        weight: c.weight !== undefined ? Number(c.weight) : 1.0,
      })),
      cognitiveLevels: (m.cognitiveLevels || []).map((cl: any) => ({
        cognitiveLevelId: cl.cognitiveLevelId || cl.id,
        weight: cl.weight !== undefined ? Number(cl.weight) : 1.0,
      })),
    })),
  };
}

export async function createQuestion(data: any): Promise<QuestionBankItem> {
  const dto = mapToCreateQuestionDto(data);
  const q = await requestAssessmentJson<any>("/api/v1/assessment/questions", {
    method: "POST",
    body: JSON.stringify(dto),
  });
  return mapToQuestionBankItem(q);
}

export async function updateQuestion(id: string, data: any): Promise<QuestionBankItem> {
  const dto = mapToCreateQuestionDto(data);
  delete (dto as any).code;
  const q = await requestAssessmentJson<any>(`/api/v1/assessment/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
  return mapToQuestionBankItem(q);
}

export async function deleteQuestion(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/${id}`, {
    method: "DELETE",
  });
}

export async function sendQuestionWorkflow(id: string, action: string, comment?: string, version?: {questionVersionId?:string;revision?:number}): Promise<void> {
  const current=version || await getQuestionByIdAsync(id);
  if(!current)throw Error("Даалгавар олдсонгүй.");
  await requestAssessmentJson(`/api/v1/assessment/questions/${id}/workflow`,{method:'POST',body:JSON.stringify({action,comment,questionVersionId:current.questionVersionId,expectedRevision:current.revision,requestId:crypto.randomUUID()})});
}

export async function fetchQuestionWorkflowEvents(id: string): Promise<any[]> {
  try {
    return await requestAssessmentJson<any[]>(`/api/v1/assessment/questions/${id}/workflow`);
  } catch (err) {
    console.error("Failed to fetch workflow events:", err);
    return [];
  }
}

export async function getQuestionByIdAsync(id: string): Promise<QuestionBankItem | null> {
  try {
    const q = await requestAssessmentJson<any>(`/api/v1/assessment/questions/${id}`);
    return mapToQuestionBankItem(q);
  } catch {
    return null;
  }
}

export async function fetchBlueprints(contextId?: string): Promise<Blueprint[]> {
  const url = contextId 
    ? `/api/v1/assessment/blueprints?assessmentContextId=${encodeURIComponent(contextId)}`
    : "/api/v1/assessment/blueprints";
  const blueprints = await requestAssessmentJson<any[]>(url);
  return blueprints.map(mapToBlueprint);
}

export async function createBlueprint(data:any):Promise<Blueprint>{return mapToBlueprint(await requestAssessmentJson<any>('/api/v1/assessment/blueprints',{method:'POST',body:JSON.stringify(blueprintPayload(data))}));}

export async function deleteBlueprint(id: string): Promise<void> {
  await requestAssessmentJson(`/api/v1/assessment/blueprints/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function updateBlueprint(id:string,data:any):Promise<Blueprint>{return mapToBlueprint(await requestAssessmentJson<any>(`/api/v1/assessment/blueprints/${encodeURIComponent(id)}`,{method:'PUT',body:JSON.stringify(blueprintPayload(data))}));}
export async function getBlueprintByIdAsync(id:string):Promise<Blueprint|null>{try{return mapToBlueprint(await requestAssessmentJson<any>(`/api/v1/assessment/blueprints/${encodeURIComponent(id)}`));}catch(e){if((e as any).status===404)return null;throw e;}}

export async function fetchQuizzes(contextId?: string): Promise<Quiz[]> {
  const url = contextId
    ? `/api/v1/assessment/quizzes?assessmentContextId=${contextId}`
    : "/api/v1/assessment/quizzes";
  const quizzes = await requestAssessmentJson<any[]>(url);
  return quizzes.map(mapToQuiz);
}

export async function createQuiz(data: any): Promise<Quiz> {
  const q = await requestAssessmentJson<any>("/api/v1/assessment/quizzes", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapToQuiz(q);
}

export async function updateQuiz(id: string, data: any): Promise<Quiz> {
  const q = await requestAssessmentJson<any>(`/api/v1/assessment/quizzes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return mapToQuiz(q);
}

export async function getQuizByIdAsync(id: string): Promise<Quiz | null> {
  try {
    const q = await requestAssessmentJson<any>(`/api/v1/assessment/quizzes/${id}`);
    return mapToQuiz(q);
  } catch (e) {
    if ((e as any).status===404) return null;
    throw e;
  }
}

export async function fetchSchedules(): Promise<any[]> {
  const schedules = await requestAssessmentJson<any[]>("/api/v1/assessment/schedules");
  return schedules.map((s) => ({
    id: s.id,
    quizRevisionId: s.quizRevisionId,
    code: s.code,
    name: s.name,
    availableFrom: s.availableFrom,
    availableUntil: s.availableUntil,
    waitingRoomOpensAt: s.waitingRoomOpensAt,
    requiredEarlyJoinMinutes: s.requiredEarlyJoinMinutes,
    accessMode: s.accessMode,
    capacity: s.capacity,
    priceOverride: s.priceOverride ? Number(s.priceOverride) : null,
    status: s.status,
    quizTitle: s.quizRevision?.title || "",
  }));
}

export async function createSchedule(data: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/schedules", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function publishSchedule(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/schedules/${id}/publish`, {
    method: "POST",
    body: JSON.stringify({ actorUserId: "mock-assessor" }),
  });
}

export function validateQuizOverrides(
  blueprint: Blueprint,
  overrides: QuizQuestionOverride[],
) {
  const errors: string[] = [];

  blueprint.sections.forEach((section) => {
    const mandatoryCount = section.selectedQuestionIds.filter((questionId) =>
      overrides.some(
        (override) =>
          override.questionId === questionId && override.mode === "mandatory",
      ),
    ).length;

    if (mandatoryCount > section.randomPickCount) {
      errors.push(
        `${section.name}: заавал оруулах асуулт (${mandatoryCount}) нь сонгох тоо (${section.randomPickCount})-оос их байна.`,
      );
    }

    const excludedCount = section.selectedQuestionIds.filter((questionId) =>
      overrides.some(
        (override) =>
          override.questionId === questionId && override.mode === "excluded",
      ),
    ).length;
    const availableCount = section.selectedQuestionIds.length - excludedCount;

    if (availableCount < section.randomPickCount) {
      errors.push(
        `${section.name}: хассан асуултын дараа pool (${availableCount}) нь сонгох тоо (${section.randomPickCount})-д хүрэлцэхгүй байна.`,
      );
    }
  });

  return errors;
}

export function validateQuiz(blueprint: Blueprint, quiz: Quiz) {
  const errors = validateQuizOverrides(blueprint, quiz.questionOverrides);

  if (quiz.priceMnt < 0) errors.push("Төлбөр 0 эсвэл түүнээс их байх ёстой.");
  if (!quiz.title.trim()) errors.push("Quiz нэр заавал байна.");
  if (!quiz.durationMinutes || quiz.durationMinutes <= 0) errors.push("Шалгалтын хугацаа 0-оос их байна.");
  if (quiz.maxAttempts < 1) errors.push("Оролдлогын тоо дор хаяж 1 байна.");

  return errors;
}

export function resolveQuizQuestionSet(quiz: Quiz) {
  const blueprint = getBlueprintById(quiz.blueprintId);
  if (!blueprint) return [];

  return blueprint.sections.flatMap((section) => {
    const mandatory = section.selectedQuestionIds.filter((questionId) =>
      quiz.questionOverrides.some(
        (override) =>
          override.questionId === questionId && override.mode === "mandatory",
      ),
    );
    const excluded = new Set(
      quiz.questionOverrides
        .filter((override) => override.mode === "excluded")
        .map((override) => override.questionId),
    );
    const candidates = section.selectedQuestionIds.filter(
      (questionId) => !mandatory.includes(questionId) && !excluded.has(questionId),
    );

    return [...mandatory, ...candidates].slice(0, section.randomPickCount);
  });
}

export async function fetchTopics(assessmentContextId?: string): Promise<any[]> {
  const url = assessmentContextId
    ? `/api/v1/assessment/questions/metadata/topics?assessmentContextId=${assessmentContextId}`
    : "/api/v1/assessment/questions/metadata/topics";
  return await requestAssessmentJson<any[]>(url);
}

export async function createTopic(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/topics", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateTopic(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/topics/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteTopic(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/topics/${id}`, {
    method: "DELETE",
  });
}

export async function fetchDifficultyLevels(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/difficulty-levels");
}

export async function createDifficultyLevel(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/difficulty-levels", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateDifficultyLevel(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/difficulty-levels/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteDifficultyLevel(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/difficulty-levels/${id}`, {
    method: "DELETE",
  });
}

export async function fetchCognitiveFrameworks(): Promise<CognitiveFramework[]> {
  return requestAssessmentJson<CognitiveFramework[]>("/api/v1/assessment/questions/metadata/cognitive-frameworks");
}
export async function fetchCognitiveLevels(cognitiveFrameworkId?: string): Promise<CognitiveLevel[]> {
  return requestAssessmentJson<CognitiveLevel[]>("/api/v1/assessment/questions/metadata/cognitive-levels" + (cognitiveFrameworkId ? "?cognitiveFrameworkId=" + encodeURIComponent(cognitiveFrameworkId) : ""));
}
export async function createCognitiveFramework(dto: CognitiveFrameworkInput): Promise<CognitiveFramework> {
  return requestAssessmentJson<CognitiveFramework>("/api/v1/assessment/questions/metadata/cognitive-frameworks", {method: "POST", body: JSON.stringify(dto)});
}
export async function updateCognitiveFramework(id: string, dto: Partial<CognitiveFrameworkInput>): Promise<CognitiveFramework> {
  return requestAssessmentJson<CognitiveFramework>(`/api/v1/assessment/questions/metadata/cognitive-frameworks/${id}`, {method: "PUT", body: JSON.stringify(dto)});
}
export async function deleteCognitiveFramework(id: string): Promise<void> {
  return requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/cognitive-frameworks/${id}`, {method: "DELETE"});
}
export async function createCognitiveLevel(dto: CognitiveLevelInput): Promise<CognitiveLevel> {
  return requestAssessmentJson<CognitiveLevel>("/api/v1/assessment/questions/metadata/cognitive-levels", {method: "POST", body: JSON.stringify(dto)});
}
export async function updateCognitiveLevel(id: string, dto: Partial<CognitiveLevelInput>): Promise<CognitiveLevel> {
  return requestAssessmentJson<CognitiveLevel>(`/api/v1/assessment/questions/metadata/cognitive-levels/${id}`, {method: "PUT", body: JSON.stringify(dto)});
}
export async function deleteCognitiveLevel(id: string): Promise<void> {
  return requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/cognitive-levels/${id}`, {method: "DELETE"});
}

// AssessmentContext API
export async function fetchAssessmentContexts(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/assessment-contexts");
}

export async function createAssessmentContext(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/assessment-contexts", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateAssessmentContext(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/assessment-contexts/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteAssessmentContext(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/assessment-contexts/${id}`, {
    method: "DELETE",
  });
}

// DifficultyScale API
export async function fetchDifficultyScales(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/difficulty-scales");
}

export async function createDifficultyScale(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/difficulty-scales", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateDifficultyScale(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/difficulty-scales/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteDifficultyScale(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/difficulty-scales/${id}`, {
    method: "DELETE",
  });
}

// CompetenceFramework API
export async function fetchCompetenceFrameworks(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/competence-frameworks");
}

export async function createCompetenceFramework(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/competence-frameworks", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateCompetenceFramework(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/competence-frameworks/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteCompetenceFramework(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/competence-frameworks/${id}`, {
    method: "DELETE",
  });
}

// CompetenceType API
export async function fetchCompetenceTypes(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/competence-types");
}

export async function createCompetenceType(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/competence-types", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateCompetenceType(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/competence-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteCompetenceType(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/competence-types/${id}`, {
    method: "DELETE",
  });
}

// AudienceLevel API
export async function fetchAudienceLevels(audienceTypeId?: string): Promise<AudienceLevel[]> {
  return await requestAssessmentJson<AudienceLevel[]>("/api/v1/assessment/questions/metadata/audience-levels" + (audienceTypeId ? `?audienceTypeId=${encodeURIComponent(audienceTypeId)}` : ""));
}

export async function createAudienceLevel(dto: AudienceLevelInput): Promise<AudienceLevel> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/audience-levels", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateAudienceLevel(id: string, dto: Partial<AudienceLevelInput>): Promise<AudienceLevel> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/audience-levels/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteAudienceLevel(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/audience-levels/${id}`, {
    method: "DELETE",
  });
}

// AudienceType API
export async function fetchAudienceTypes(): Promise<AudienceType[]> {
  return await requestAssessmentJson<AudienceType[]>("/api/v1/assessment/questions/metadata/audience-types");
}

export async function createAudienceType(dto: AudienceTypeInput): Promise<AudienceType> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/audience-types", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateAudienceType(id: string, dto: Partial<AudienceTypeInput>): Promise<AudienceType> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/audience-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteAudienceType(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/audience-types/${id}`, {
    method: "DELETE",
  });
}

// Dynamic Database Explorer API
export async function fetchDbTables(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/db/tables");
}

export async function fetchDbData(modelName: string): Promise<any[]> {
  return await requestAssessmentJson<any[]>(`/api/v1/assessment/questions/db/${modelName}`);
}

export async function createDbData(modelName: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/db/${modelName}`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateDbData(modelName: string, id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/db/${modelName}/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteDbData(modelName: string, id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/db/${modelName}/${id}`, {
    method: "DELETE",
  });
}




export async function fetchQuestionBank(filters:Record<string,string>):Promise<{items:QuestionBankItem[];total:number;page:number;facets:any[]}> {
 const data=await requestAssessmentJson<any>(`/api/v1/assessment/questions?${new URLSearchParams({...filters,bank:"true"})}`);
 return {...data,items:data.items.map(mapToQuestionBankItem)};
}
export async function fetchBlueprintCandidates(filters:Record<string,string>){return requestAssessmentJson<any>('/api/v1/assessment/blueprints/candidates?'+new URLSearchParams(filters));}
