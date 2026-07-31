import { mockBlueprints, mockQuestionBank } from "./mock-data";
import type {
  Blueprint,
  BlueprintSection,
  QuestionBankItem,
  QuestionWorkflowStatus,
  Quiz,
  QuizQuestionOverride,
} from "./types";

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

export function getQuestionById(id: string) {
  return mockQuestionBank.find((question) => question.id === id) || null;
}

export function getBlueprintById(id: string) {
  return mockBlueprints.find((blueprint) => blueprint.id === id) || null;
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
  if (!quiz.startAt || !quiz.endAt || quiz.startAt >= quiz.endAt) {
    errors.push("Идэвхтэй хугацааны интервал зөв байх ёстой.");
  }
  if (quiz.durationMinutes <= 0) errors.push("Шалгалтын хугацаа 0-оос их байна.");
  if (quiz.maxAttempts < 1) errors.push("Оролдлогын тоо дор хаяж 1 байна.");
  if (quiz.accessMode === "private_code" && !quiz.accessCode?.trim()) {
    errors.push("Захиалгат/private code тестэд нэвтрэх код заавал байна.");
  }
  if (
    quiz.accessMode === "assigned_users" &&
    (quiz.assignedUserIds?.length ?? 0) === 0
  ) {
    errors.push("Зөвхөн тодорхой хэрэглэгчдэд харагдах үед дор хаяж нэг хэрэглэгч сонгоно.");
  }

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
