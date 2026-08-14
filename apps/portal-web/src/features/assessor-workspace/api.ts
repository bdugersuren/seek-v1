import { authFetch } from "@/lib/auth-client";
import { mockBlueprints, mockQuestionBank } from "./mock-data";
import type {
  Blueprint,
  BlueprintSection,
  QuestionBankItem,
  QuestionWorkflowStatus,
  Quiz,
  QuizQuestionOverride,
} from "./types";

async function requestAssessmentJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await authFetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(payload.message || "Request failed");
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
    ready: blueprint.sections.every(isBlueprintSectionValid),
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

function mapVersionToQuestionBankItem(actV: any, q: any): QuestionBankItem {
  const primaryClassification = q.classifications?.[0];
  const topicId = primaryClassification?.topicId || actV.topicId || (primaryClassification?.topic?.code) || "general";
  const topicName = primaryClassification?.topic?.title || primaryClassification?.topic?.name || actV.topicName || (primaryClassification ? "Сэдэв" : "Ерөнхий");

  const topicMappings: QuestionTopicMapping[] = (q.classifications || []).map((c: any) => ({
    topicId: c.topicId,
    topicName: c.topic?.title || c.topic?.name || c.topicId,
    bloomLevel: (c.cognitiveLevel?.code || c.cognitiveLevelId || "apply") as any,
    competencyType: "knowledge" as any,
    difficulty: (c.difficultyLevel?.code || c.difficultyLevelId || "medium") as any,
    weight: Number(c.weight || 1),
    assessmentContextId: c.assessmentContextId,
    cognitiveFrameworkId: c.cognitiveLevel?.cognitiveFrameworkId || c.assessmentContext?.cognitiveFrameworkId,
    difficultyScaleId: c.difficultyLevel?.difficultyScaleId || c.assessmentContext?.difficultyScaleId,
    competenceFrameworkId: c.assessmentContext?.competenceFrameworkId,
    audienceTypeId: c.assessmentContext?.audienceTypeId,
    audienceLevelId: c.assessmentContext?.audienceLevelId,
    competencies: (c.competences || []).map((tc: any) => ({
      competenceId: tc.competenceId,
      weight: Number(tc.weight || 1),
      name: tc.competence?.name || tc.competenceId,
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

  const options: QuestionOption[] = rawOptions.map((o: any, idx: number) => ({
    id: o.id || o.optionKey || o.code || `opt_${idx + 1}`,
    label: o.label || o.optionKey || o.code || String.fromCharCode(65 + idx),
    optionKey: o.optionKey || o.code || o.id || `opt_${idx + 1}`,
    value: o.value || o.content || o.body || "",
    content: o.value || o.content || o.body || "",
    isCorrect: Boolean(o.isCorrect),
    score: o.score !== undefined && o.score !== null ? Number(o.score) : (o.isCorrect ? 1 : 0),
    negativeScore: o.negativeScore !== undefined && o.negativeScore !== null ? Number(o.negativeScore) : 0,
    matchValue: o.matchRules?.matchValue || o.metadata?.matchValue || o.matchValue || "",
    acceptedValues: o.metadata?.acceptedValues || o.acceptedValues || [],
    metadata: o.metadata || {},
  }));

  const explanation = actV.explanation || actV.feedback || "";

  return {
    id: q.id,
    code: q.code,
    title: actV.title || "No Title",
    body: actV.body || "",
    stem: actV.body || "",
    parentId: q.parentId || null,
    type: (actV.type || "SINGLE_CHOICE") as any,
    status: (q.lifecycleStatus === "ARCHIVED" ? "archived" : actV.versionStatus?.toLowerCase()) as any,
    defaultMaxScore: Number(actV.defaultMaxScore !== undefined && actV.defaultMaxScore !== null ? actV.defaultMaxScore : 1),
    defaultMinScore: Number(actV.defaultMinScore !== undefined && actV.defaultMinScore !== null ? actV.defaultMinScore : 0),
    defaultTimeSeconds: actV.defaultTimeSeconds || 60,
    points: Number(actV.defaultMaxScore !== undefined && actV.defaultMaxScore !== null ? actV.defaultMaxScore : 1),
    minPoints: Number(actV.defaultMinScore !== undefined && actV.defaultMinScore !== null ? actV.defaultMinScore : 0),
    durationSeconds: actV.defaultTimeSeconds || 60,
    bloomLevel: (primaryClassification?.bloomLevel?.toLowerCase() || "apply") as any,
    competencyType: (primaryClassification?.competencyType?.toLowerCase() || "knowledge") as any,
    topicId,
    topicName,
    topicMappings: topicMappings.length > 0 ? topicMappings : [
      {
        topicId,
        topicName,
        bloomLevel: "apply",
        competencyType: "knowledge",
        difficulty: "medium",
        weight: 1,
      },
    ],
    difficulty: (primaryClassification?.difficulty?.toLowerCase() || "medium") as any,
    options,
    answerKey: (() => {
      const type = actV.type || "SINGLE_CHOICE";
      if (type === "MATCHING") {
        return options
          .map((o: any) => `${o.value || o.content} ➔ ${o.matchValue || ""}`)
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
    explanation,
    feedback: explanation,
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
    workflowHistory: [],
  };
}

function mapToQuestionBankItem(q: any): QuestionBankItem {
  const actV = q.activeVersion || q.versions?.[0] || q.currentPublishedVersion || {};
  const mainItem = mapVersionToQuestionBankItem(actV, q);

  if (Array.isArray(q.versions) && q.versions.length > 0) {
    mainItem.versions = q.versions.map((v: any) => mapVersionToQuestionBankItem(v, q));
  } else {
    mainItem.versions = [mainItem];
  }

  return mainItem;
}

function mapToBlueprint(b: any): Blueprint {
  return {
    id: b.id,
    title: b.name || "No Title",
    description: b.description || "",
    topicId: "fractions",
    topicName: "Fractions",
    passScore: 70.0,
    totalDurationMinutes: 60,
    status: "ready",
    updatedAt: b.updatedAt || "",
    sections: (b.sections || []).map((s: any) => ({
      id: s.id,
      name: s.title,
      description: "",
      randomPickCount: s.questionCount || 0,
      pointsPerQuestion: Number(s.maxScorePerQuestion || 1),
      selectedQuestionIds: (s.questions || []).map((q: any) => q.questionId),
      durationMinutes: 10,
      strategy: "random",
    })),
  };
}

function mapToQuiz(q: any): Quiz {
  const rev = q.revisions?.[0] || q.currentPublishedRevision || {};
  return {
    id: q.id,
    blueprintId: q.templateId,
    title: q.title || "No Title",
    priceMnt: Number(rev.defaultPrice || 0),
    accessMode: "public",
    startAt: q.createdAt || "",
    endAt: q.createdAt || "",
    durationMinutes: rev.durationMinutes || 60,
    maxAttempts: rev.maxAttempts || 1,
    shuffleSections: false,
    shuffleAnswers: false,
    hideSolutions: false,
    showLeaderboard: false,
    showScore: true,
    showCorrectness: true,
    showCorrectAnswers: true,
    showExplanations: true,
    resultReleaseMode: "immediate",
    status: "draft",
    questionOverrides: (rev.runtimePolicy as any)?.questionOverrides || [],
  };
}

// -------------------------------------------------------------
// Real Async API integrations mapping to NestJS microservices
// -------------------------------------------------------------

export async function fetchQuestions(filters?: any): Promise<QuestionBankItem[]> {
  const query = filters ? "?" + new URLSearchParams(filters).toString() : "";
  const questions = await requestAssessmentJson<any[]>(`/api/v1/assessment/questions${query}`);
  return questions.map(mapToQuestionBankItem);
}

function mapToCreateQuestionDto(data: any) {
  const payloadOptions = (data.options || []).map((o: any, index: number) => ({
    code: o.optionKey || o.id || o.label || `opt_${index + 1}`,
    optionKey: o.optionKey || o.id || o.label || `opt_${index + 1}`,
    value: o.value !== undefined ? o.value : (o.content || ""),
    body: o.value !== undefined ? o.value : (o.content || ""),
    isCorrect: o.isCorrect || false,
    score: Number(o.score !== undefined ? o.score : (o.isCorrect ? (data.defaultMaxScore || data.points || 1) : 0)),
    negativeScore: o.negativeScore !== undefined ? Number(o.negativeScore) : 0,
    matchValue: o.matchValue || "",
    matchRules: {
      matchValue: o.matchValue || "",
    },
    metadata: {
      acceptedValues: o.acceptedValues || [],
      ...(o.metadata || {})
    }
  }));

  const scoringConfig = {
    ...(data.scoringConfig || {}),
    scoringMode: data.scoringMode || data.scoringConfig?.scoringMode || "per_option",
  };

  return {
    code: data.code,
    lifecycleStatus: "ACTIVE",
    visibilityScope: data.visibilityScope || "PRIVATE",
    ownerUserId: data.ownerUserId || null,
    parentId: data.parentId || null,
    title: data.title || "No Title",
    body: data.body ? data.body : (data.stem || "Шинэ асуулт"),
    type: data.type || data.typeId || "SINGLE_CHOICE",
    defaultTimeSeconds: Number(data.defaultTimeSeconds !== undefined ? data.defaultTimeSeconds : (data.durationSeconds || 60)),
    defaultMaxScore: Number(data.defaultMaxScore !== undefined ? data.defaultMaxScore : (data.points !== undefined ? data.points : 1)),
    defaultMinScore: Number(data.defaultMinScore !== undefined ? data.defaultMinScore : (data.minPoints !== undefined ? data.minPoints : 0)),
    languageCode: "mn",
    tags: data.tags || [],
    explanation: data.explanation ? data.explanation : (data.feedback || ""),
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
    rubric: data.rubric || [],
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
      competencies: (m.competencies || []).map((c: any) => ({
        competenceId: c.competenceId || c.id,
        weight: c.weight !== undefined ? Number(c.weight) : 1.0,
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

export async function sendQuestionWorkflow(id: string, action: string, comment?: string): Promise<void> {
  let newStatus = "draft";
  if (action === "approval_requested" || action === "resubmitted") newStatus = "pending";
  if (action === "approve") newStatus = "approved";
  if (action === "publish") newStatus = "published";
  if (action === "changes_requested") newStatus = "changes_requested";
  if (action === "reject") newStatus = "rejected";
  if (action === "deleted") newStatus = "deleted";
  if (action === "archived") newStatus = "archived";

  // Superadmin bypass statuses
  if (action.startsWith("bypass_")) {
    newStatus = action.replace("bypass_", "");
  }

  await requestAssessmentJson<void>(`/api/v1/assessment/questions/${id}/workflow`, {
    method: "POST",
    body: JSON.stringify({
      action,
      newStatus,
      comment,
      actorUserId: "mock-assessor",
    }),
  });
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

export async function fetchBlueprints(): Promise<Blueprint[]> {
  const blueprints = await requestAssessmentJson<any[]>("/api/v1/assessment/blueprints");
  return blueprints.map(mapToBlueprint);
}

export async function createBlueprint(data: any): Promise<Blueprint> {
  const b = await requestAssessmentJson<any>("/api/v1/assessment/blueprints", {
    method: "POST",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      sections: (data.sections || []).map((s: any) => ({
        name: s.name,
        randomPickCount: Number(s.randomPickCount),
        pointsPerQuestion: Number(s.pointsPerQuestion),
        selectedQuestionIds: s.selectedQuestionIds,
      })),
    }),
  });
  return mapToBlueprint(b);
}

export async function updateBlueprint(id: string, data: any): Promise<Blueprint> {
  const b = await requestAssessmentJson<any>(`/api/v1/assessment/blueprints/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      sections: (data.sections || []).map((s: any) => ({
        name: s.name,
        randomPickCount: Number(s.randomPickCount),
        pointsPerQuestion: Number(s.pointsPerQuestion),
        selectedQuestionIds: s.selectedQuestionIds,
      })),
    }),
  });
  return mapToBlueprint(b);
}

export async function getBlueprintByIdAsync(id: string): Promise<Blueprint | null> {
  try {
    const b = await requestAssessmentJson<any>(`/api/v1/assessment/blueprints/${id}`);
    return mapToBlueprint(b);
  } catch {
    return null;
  }
}

export async function fetchQuizzes(): Promise<Quiz[]> {
  const quizzes = await requestAssessmentJson<any[]>("/api/v1/assessment/quizzes");
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
  } catch {
    return null;
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

export async function fetchTopics(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/topics");
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

export async function fetchCognitiveLevels(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/cognitive-levels");
}

export async function createCognitiveLevel(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/cognitive-levels", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateCognitiveLevel(id: string, dto: any): Promise<any> {
  return await requestAssessmentJson<any>(`/api/v1/assessment/questions/metadata/cognitive-levels/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export async function deleteCognitiveLevel(id: string): Promise<void> {
  await requestAssessmentJson<void>(`/api/v1/assessment/questions/metadata/cognitive-levels/${id}`, {
    method: "DELETE",
  });
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
export async function fetchAudienceLevels(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/audience-levels");
}

export async function createAudienceLevel(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/audience-levels", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateAudienceLevel(id: string, dto: any): Promise<any> {
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
export async function fetchAudienceTypes(): Promise<any[]> {
  return await requestAssessmentJson<any[]>("/api/v1/assessment/questions/metadata/audience-types");
}

export async function createAudienceType(dto: any): Promise<any> {
  return await requestAssessmentJson<any>("/api/v1/assessment/questions/metadata/audience-types", {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export async function updateAudienceType(id: string, dto: any): Promise<any> {
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



