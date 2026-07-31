import { mockAssessments } from "./mock-data";
import type { AssessmentDraftInput } from "./types";

export async function listAssessments() {
  return mockAssessments;
}

export async function getAssessment(id: string) {
  return mockAssessments.find((assessment) => assessment.id === id) || null;
}

export function validateAssessmentDraft(input: AssessmentDraftInput) {
  const errors: Partial<Record<keyof AssessmentDraftInput, string>> = {};

  if (!input.title.trim()) {
    errors.title = "Гарчиг заавал оруулна.";
  }

  if (!input.description.trim()) {
    errors.description = "Тайлбар заавал оруулна.";
  }

  if (input.durationMinutes < 15) {
    errors.durationMinutes = "Хугацаа 15 минутаас бага байж болохгүй.";
  }

  if (input.questionCount < 1) {
    errors.questionCount = "Асуултын тоо 1-ээс бага байж болохгүй.";
  }

  return errors;
}
