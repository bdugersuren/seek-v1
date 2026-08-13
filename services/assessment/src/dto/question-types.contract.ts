/**
 * Question Types Domain Contracts & Standard Schemas
 * seek.mn platform - assessment service
 */

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

/**
 * Scoring Modes
 * 'all_or_nothing' has been removed per user requirements.
 * Supported modes:
 * - 'per_option': Each option contributes its own positive or negative score.
 * - 'combination': Specific selected combinations yield exact configured scores.
 * - 'manual': Rubric-based or human/AI evaluation.
 */
export type ScoringMode = "per_option" | "combination" | "manual";

export interface CombinationEntry {
  id?: string;
  selected?: string[];
  pairs?: Record<string, string>; // for MATCHING: { "L1": "R2", "L2": "R1" }
  blanks?: Record<string, string>; // for FILL_BLANK: { "blank_1": "H2O", "blank_2": "NaCl" }
  ordering?: string[]; // for ORDERING: ["item_3", "item_1", "item_2"]
  score: number;
}

export interface ScoringConfig {
  scoringMode: ScoringMode;
  combinations?: CombinationEntry[];
  rightOptions?: Array<{ id: string; value: string }>;
  negativeMarkingConfig?: {
    allowNegativeTotal?: boolean;
    penaltyPerWrongOption?: number;
  };
  partialCreditPolicy?: {
    enabled?: boolean;
    minRatio?: number;
  };
}

export interface NumericAnswerConfig {
  targetValue: number;
  tolerance: number;
  toleranceType: "ABSOLUTE" | "PERCENT";
  rangeMin?: number;
  rangeMax?: number;
  precision?: number;
  acceptedUnits?: string[];
}

export interface ShortTextAnswerConfig {
  evaluationMode: "AUTO_MATCH" | "AI_SEMANTIC" | "MANUAL";
  acceptedPatterns: Array<{
    pattern: string;
    isRegex?: boolean;
    caseSensitive?: boolean;
    score: number;
  }>;
  fallbackToManualGrading?: boolean;
}

export interface RubricCriterionLevel {
  score: number;
  label?: string;
  description?: string;
}

export interface RubricCriterion {
  id: string;
  criteria: string;
  maxScore: number;
  description?: string;
  levels?: RubricCriterionLevel[];
}

export interface FillBlankAcceptedValue {
  value: string;
  score: number;
  caseSensitive?: boolean;
  trim?: boolean;
}

export interface FillBlankOptionMetadata {
  blankKey: string;
  acceptedValues: FillBlankAcceptedValue[];
  blankType?: "text" | "dropdown" | "numeric";
  dropdownChoices?: string[];
}

export interface MatrixColumnDefinition {
  key: string;
  label: string;
  scoreWeight?: number;
}

export interface MatrixPayload {
  columns: MatrixColumnDefinition[];
}

export interface QuestionPresentationConfig {
  shuffleOptions?: boolean;
  layout?: "vertical" | "horizontal" | "grid";
  minWordCount?: number;
  maxWordCount?: number;
  richTextEnabled?: boolean;
  fileUploadAllowed?: boolean;
}
