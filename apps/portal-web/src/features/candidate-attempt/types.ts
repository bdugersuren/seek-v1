export interface CandidateQuestionOption {
  id: string;
  label: string;
}

export interface CandidateMatchingPair {
  id: string;
  prompt: string;
}

export interface CandidateMatrixRow {
  id: string;
  label: string;
}

export interface CandidateMatrixColumn {
  id: string;
  label: string;
}

export interface CandidateQuestionMedia {
  id: string;
  type: "image" | "audio" | "video" | "file";
  title: string;
  url: string;
  description?: string;
}

export interface CandidateCaseItem {
  id: string;
  prompt: string;
  type: "single_choice" | "short_text";
  options?: CandidateQuestionOption[];
}

export type CandidateQuestionType =
  | "single_choice"
  | "multiple_choice"
  | "matching"
  | "ordering"
  | "fill_blank"
  | "matrix"
  | "numeric"
  | "likert"
  | "sjt"
  | "case_bundle"
  | "essay";

export interface CandidateQuestion {
  id: string;
  code: string;
  prompt: string;
  instruction: string;
  type: CandidateQuestionType;
  points: number;
  options?: CandidateQuestionOption[];
  pairs?: CandidateMatchingPair[];
  matchOptions?: CandidateQuestionOption[];
  rows?: CandidateMatrixRow[];
  columns?: CandidateMatrixColumn[];
  media?: CandidateQuestionMedia[];
  caseText?: string;
  caseItems?: CandidateCaseItem[];
  minValue?: number;
  maxValue?: number;
  unit?: string;
}

export interface CandidateAttempt {
  id: string;
  assessmentTitle: string;
  candidateName: string;
  durationMinutes: number;
  remainingMinutes: number;
  questions: CandidateQuestion[];
}

export type CandidateAnswerValue = string | string[] | Record<string, string>;

export type CandidateAnswers = Record<string, CandidateAnswerValue>;
