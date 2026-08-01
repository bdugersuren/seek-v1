import {
  AssessmentRuntimeSession,
  AssessmentAnswerSnapshot,
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
  type: string;
  points: number;
  options?: RuntimeQuestionOption[];
}

export interface RuntimeAttempt {
  session: AssessmentRuntimeSession;
  questions: RuntimeQuestion[];
  snapshot: AssessmentAnswerSnapshot;
}
