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
  type: "single_choice" | "multiple_choice" | "true_false" | "short_text" | "numeric" | "fill_blank" | "essay" | "matching" | "matrix";
  media?: Array<{id:string;mediaType:string;altText:string;url:string}>;
  rightOptions?:Array<{id:string;value:string}>;
  matrixColumns?:Array<{id:string;label:string}>;
  points: number;
  options?: RuntimeQuestionOption[];
}

export interface RuntimeAttempt {
  session: AssessmentRuntimeSession;
  questions: RuntimeQuestion[];
  snapshot: AssessmentAnswerSnapshot;
}

export type RuntimeAnswers = Record<string, AssessmentAnswerValue>;
