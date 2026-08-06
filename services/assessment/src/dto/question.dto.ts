export class CreateQuestionDto {
  code: string;
  lifecycleStatus?: "ACTIVE" | "ARCHIVED";
  visibilityScope?: "PRIVATE" | "TENANT" | "PUBLIC";
  title?: string;
  body: string; // Markdown, KaTeX, Metadata text
  type: any; // SINGLE_CHOICE, MULTIPLE_CHOICE, etc.
  defaultTimeSeconds?: number;
  defaultMaxScore?: number;
  defaultMinScore?: number;
  languageCode?: string;
  tags?: string[];
  explanation?: string;
  payload?: Record<string, any>; // Options, Correct answers, CTF flags, matching pairs
  answerConfig?: Record<string, any>;
  scoringConfig?: Record<string, any>;
  ownerUserId?: string;
  media?: any[];
}

export class UpdateQuestionDto {
  lifecycleStatus?: "ACTIVE" | "ARCHIVED";
  visibilityScope?: "PRIVATE" | "TENANT" | "PUBLIC";
  title?: string;
  body?: string;
  type?: any;
  defaultTimeSeconds?: number;
  defaultMaxScore?: number;
  defaultMinScore?: number;
  languageCode?: string;
  tags?: string[];
  explanation?: string;
  payload?: Record<string, any>;
  answerConfig?: Record<string, any>;
  scoringConfig?: Record<string, any>;
  ownerUserId?: string;
  media?: any[];
}
