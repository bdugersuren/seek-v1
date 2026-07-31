export type QuestionWorkflowStatus =
  | "draft"
  | "approval_requested"
  | "in_review"
  | "changes_requested"
  | "resubmitted"
  | "approved"
  | "published"
  | "archived"
  | "rejected"
  | "deleted";

export type QuestionType =
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

export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type CompetencyType =
  | "knowledge"
  | "skill"
  | "attitude"
  | "digital"
  | "professional";

export type DifficultyLevel = "very_easy" | "easy" | "medium" | "hard" | "very_hard";

export interface WorkflowComment {
  id: string;
  status: QuestionWorkflowStatus;
  comment: string;
  actorId: string;
  actorName: string;
  actorRole: string;
  createdAt: string;
}

export interface QuestionOption {
  id: string;
  label: string;
  content: string;
  contentJson?: unknown;
  contentHtml?: string;
  isCorrect?: boolean;
  score?: number;
}

export interface QuestionMedia {
  type: "image" | "audio" | "video" | "file";
  name: string;
  url: string;
}

export interface QuestionBankItem {
  id: string;
  code: string;
  title: string;
  stem: string;
  contentJson?: unknown;
  contentHtml?: string;
  contentMarkdown?: string;
  type: QuestionType;
  status: QuestionWorkflowStatus;
  points: number;
  durationSeconds: number;
  bloomLevel: BloomLevel;
  competencyType: CompetencyType;
  topicId: string;
  topicName: string;
  difficulty: DifficultyLevel;
  tags: string[];
  options: QuestionOption[];
  answerKey: string;
  rubric: string;
  feedback: string;
  media: QuestionMedia[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  workflowHistory: WorkflowComment[];
}

export type BlueprintSelectionStrategy =
  | "random"
  | "least_used"
  | "difficulty_balanced"
  | "adaptive_ai";

export interface BlueprintSection {
  id: string;
  name: string;
  description: string;
  selectedQuestionIds: string[];
  randomPickCount: number;
  pointsPerQuestion: number;
  durationMinutes: number;
  strategy: BlueprintSelectionStrategy;
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  topicId: string;
  topicName: string;
  passScore: number;
  totalDurationMinutes: number;
  sections: BlueprintSection[];
  status: "draft" | "ready" | "published" | "archived";
  updatedAt: string;
}

export type QuizOverrideMode = "mandatory" | "excluded" | "none";

export interface QuizQuestionOverride {
  questionId: string;
  mode: QuizOverrideMode;
}

export interface Quiz {
  id: string;
  title: string;
  blueprintId: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  status: "draft" | "scheduled" | "active" | "closed";
  questionOverrides: QuizQuestionOverride[];
}
