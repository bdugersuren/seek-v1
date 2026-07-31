import { mockCandidateAttempt } from "./mock-data";
import type { CandidateAnswerValue, CandidateAnswers } from "./types";

export async function getCandidateAttempt(attemptId: string) {
  if (attemptId !== mockCandidateAttempt.id) {
    return null;
  }

  return mockCandidateAttempt;
}

export function getAnsweredCount(answers: CandidateAnswers) {
  return Object.values(answers).filter(isAnswered).length;
}

export function getProgressPercent(
  totalQuestions: number,
  answers: CandidateAnswers,
) {
  if (totalQuestions === 0) {
    return 0;
  }

  return Math.round((getAnsweredCount(answers) / totalQuestions) * 100);
}

export function isAnswered(answer: CandidateAnswerValue | undefined) {
  if (!answer) {
    return false;
  }

  if (typeof answer === "string") {
    return answer.trim().length > 0;
  }

  if (Array.isArray(answer)) {
    return answer.length > 0;
  }

  return Object.values(answer).some((value) => value.trim().length > 0);
}
