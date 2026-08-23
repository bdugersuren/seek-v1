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
  | "SINGLE_CHOICE"
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE"
  | "ORDERING"
  | "MATCHING"
  | "SHORT_TEXT"
  | "FILL_BLANK"
  | "MATRIX"
  | "NUMERIC"
  | "LIKERT"
  | "SJT"
  | "CASE_BUNDLE"
  | "ESSAY";

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
  optionKey?: string;
  label: string;
  value: string;
  contentJson?: unknown;
  contentHtml?: string;
  isCorrect?: boolean;
  score: number;
  matchValue?: string;
  acceptedValues?: { value: string; score: number; caseSensitive?: boolean }[];
  metadata?: Record<string, any>;
}

export interface RightMatchingOption {
  id: string;
  value: string;
}

export interface QuestionMedia {
  type: "image" | "audio" | "video" | "file";
  name: string;
  url: string;
}

export interface QuestionTopicMapping {
  topicId: string;
  topicName: string;
  bloomLevel: BloomLevel | string;
  competencyType: CompetencyType | string;
  difficulty: DifficultyLevel | string;
  weight: number;
  assessmentContextId?: string;
  cognitiveFrameworkId?: string;
  difficultyScaleId?: string;
  competenceFrameworkId?: string;
  audienceTypeId?: string;
  audienceLevelId?: string;
  competencies?: Array<{
    competenceId: string;
    weight: number;
    name?: string;
  }>;
  cognitiveLevels?: Array<{
    cognitiveLevelId: string;
    weight: number;
    name?: string;
  }>;
}

export interface QuestionBankItem {
  id: string;
  code: string;
  title: string;
  body?: string;
  parentId?: string | null;
  ownerUserId?: string;
  contentJson?: unknown;
  contentHtml?: string;
  contentMarkdown?: string;
  type: QuestionType;
  status: QuestionWorkflowStatus;
  defaultMaxScore?: number;
  defaultMinScore?: number;
  defaultTimeSeconds?: number;
  bloomLevel?: BloomLevel;
  competencyType?: CompetencyType;
  topicId: string;
  topicName: string;
  topicMappings?: QuestionTopicMapping[];
  difficulty?: DifficultyLevel;
  tags: string[];
  options: QuestionOption[];
  answerKey?: string;
  rubric?: any;
  explanation?: string;
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  scoringMode?: string;
  scoringConfig?: any;
  presentationConfig?: any;
  media: QuestionMedia[];
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  versionNumber?: number;
  versionStatus?: string;
  versions?: QuestionBankItem[];
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

export interface BlueprintTopicMapping {
  topicId: string;
  topicName: string;
  weight: number;
  difficultyFocus: DifficultyLevel;
  competencyFocus: CompetencyType;
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  topicId: string;
  topicName: string;
  assessmentContextId?: string;
  topicMappings?: BlueprintTopicMapping[];
  passScore: number;
  totalDurationMinutes: number;
  sections: BlueprintSection[];
  status: "draft" | "ready" | "published" | "archived";
  workflowHistory?: WorkflowComment[];
  reviewComment?: string;
  updatedAt: string;
}

export type QuizOverrideMode = "mandatory" | "excluded" | "none";
export type QuizAccessMode = "public" | "private_code" | "assigned_users";
export type QuizResultReleaseMode = "immediate" | "after_close" | "manual";

export interface QuizQuestionOverride {
  questionId: string;
  mode: QuizOverrideMode;
}

export interface Quiz {
  id: string;
  title: string;
  blueprintId: string;
  priceMnt: number;
  accessMode: QuizAccessMode;
  accessCode?: string;
  assignedUserIds?: string[];
  startAt: string;
  endAt: string;
  durationMinutes: number;
  maxAttempts: number;
  shuffleSections: boolean;
  shuffleAnswers: boolean;
  hideSolutions: boolean;
  showLeaderboard: boolean;
  showScore: boolean;
  showCorrectness: boolean;
  showCorrectAnswers: boolean;
  showExplanations: boolean;
  resultReleaseMode: QuizResultReleaseMode;
  status: "draft" | "scheduled" | "active" | "closed";
  questionOverrides: QuizQuestionOverride[];
}

export interface TopicNode {
  id: string;
  label: string;
  children?: TopicNode[];
}

export interface QuestionWizardState {
  title: string;
  code: string;
  type: QuestionType;
  body: string;
  options: QuestionOption[];
  explanation: string;
  feedbackCorrect: string;
  feedbackIncorrect: string;
  scoringMode: string;
  scoringConfig: Record<string, any>;
  defaultMaxScore: number;
  defaultMinScore: number;
  defaultTimeSeconds: number;
  tags: string[];
  mappings: QuestionTopicMapping[];
  workflowComment: string;
  status: QuestionBankItem["status"];
  rubric?: any;
  media: any[];
}

export type WizardStep = 1 | 2 | 3;
