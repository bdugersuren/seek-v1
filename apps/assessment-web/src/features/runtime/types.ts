import type {
  AssessmentAnswerSnapshot,
  AssessmentAnswerValue,
  AssessmentRuntimeSession,
} from "@seek/contracts";

export interface RuntimeQuestionOption {
  id: string;
  label: string;
}

export interface RuntimeQuestion {
  id: string;
  code: string;
  prompt: string;
  instruction: string;
  type: "single_choice" | "multiple_choice" | "fill_blank" | "essay";
  points: number;
  options?: RuntimeQuestionOption[];
}

export interface RuntimeAttempt {
  session: AssessmentRuntimeSession;
  questions: RuntimeQuestion[];
  snapshot: AssessmentAnswerSnapshot;
}

export type RuntimeAnswers = Record<string, AssessmentAnswerValue>;
