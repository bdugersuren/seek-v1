import { QuestionType, ScoringConfig } from "./question-types.contract";

export class CreateQuestionDto {
  code: string;
  lifecycleStatus?: "ACTIVE" | "ARCHIVED";
  visibilityScope?: "PRIVATE" | "TENANT" | "PUBLIC";
  title?: string;
  body: string; // Markdown, KaTeX, Stem text
  type: QuestionType; // SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, ORDERING, MATCHING, etc.
  defaultTimeSeconds?: number;
  defaultMaxScore?: number;
  defaultMinScore?: number;
  languageCode?: string;
  tags?: string[];
  explanation?: string;
  payload?: Record<string, any>; // Options, matching pairs, matrix columns, etc.
  answerConfig?: Record<string, any>;
  scoringConfig?: ScoringConfig | Record<string, any>;
  presentationConfig?: Record<string, any>;
  rubric?: Array<any> | Record<string, any>;
  ownerUserId?: string;
  parentId?: string | null;
  media?: any[];
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  topicMappings?: Array<{
    topicId: string;
    bloomLevel: string; // cognitiveLevelId/Code-той дүйцнэ
    difficulty: string;  // difficultyLevelId/Code-той дүйцнэ
    weight: number;
    competencies?: Array<{
      competenceId: string;
      weight: number;
    }>;
  }>;
}

export class UpdateQuestionDto {
  lifecycleStatus?: "ACTIVE" | "ARCHIVED";
  visibilityScope?: "PRIVATE" | "TENANT" | "PUBLIC";
  title?: string;
  body?: string;
  type?: QuestionType;
  defaultTimeSeconds?: number;
  defaultMaxScore?: number;
  defaultMinScore?: number;
  languageCode?: string;
  tags?: string[];
  explanation?: string;
  payload?: Record<string, any>;
  answerConfig?: Record<string, any>;
  scoringConfig?: ScoringConfig | Record<string, any>;
  presentationConfig?: Record<string, any>;
  rubric?: Array<any> | Record<string, any>;
  ownerUserId?: string;
  parentId?: string | null;
  media?: any[];
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  topicMappings?: Array<{
    topicId: string;
    bloomLevel: string;
    difficulty: string;
    weight: number;
    competencies?: Array<{
      competenceId: string;
      weight: number;
    }>;
  }>;
}
