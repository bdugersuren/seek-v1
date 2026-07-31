export type AssessmentStatus = "Draft" | "Active" | "Review" | "Archived";

export interface AssessmentQuestion {
  id: string;
  title: string;
  markdown: string;
  points: number;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  status: AssessmentStatus;
  tag: string;
  candidates: number;
  completed: number;
  durationMinutes: number;
  questionCount: number;
  priceLabel: string;
  owner: string;
  competencies: string[];
  questions: AssessmentQuestion[];
}

export interface AssessmentDraftInput {
  title: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
}
