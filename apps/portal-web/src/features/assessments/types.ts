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

// ============================================================
// METADATA & CLASSIFICATION TYPES
// ============================================================

export interface Topic {
  id: string;
  tenantId?: string | null;
  assessmentContextId?: string | null;
  parentId?: string | null;
  code: string;
  title: string;
  name?: string; // name alias for UI consistency
  description?: string | null;
  path?: string | null;
  depth: number;
  orderIndex: number;
  externalCode?: string | null;
  validFrom?: string | Date | null;
  validTo?: string | Date | null;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  children?: Topic[];
}

export interface CompetenceFramework {
  id: string;
  tenantId?: string | null;
  jurisdiction?: string | null;
  ownerOrganizationId?: string | null;
  proficiencyScaleId?: string | null;
  externalStandardRef?: string | null;
  code: string;
  name: string;
  version: string;
  description?: string | null;
  validFrom?: string | Date | null;
  validTo?: string | Date | null;
  isActive: boolean;
  competences?: CompetenceType[];
}

export interface CompetenceType {
  id: string;
  competenceFrameworkId: string;
  parentId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  orderIndex: number;
  icon?: string | null;
  isActive: boolean;
  children?: CompetenceType[];
}

export interface DifficultyScale {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  levels?: DifficultyLevel[];
}

export interface DifficultyLevel {
  id: string;
  difficultyScaleId: string;
  code: string;
  name: string;
  rank: number;
  numericValue?: number | string | null;
  minAbility?: number | string | null;
  maxAbility?: number | string | null;
  color?: string | null;
  reportOrder?: number | null;
  description?: string | null;
  icon?: string | null;
  isActive: boolean;
}

export interface AudienceType {
  id: string;
  tenantId?: string | null;
  code: string;
  name: string;
  description?: string | null;
  isActive: boolean;
  levels?: AudienceLevel[];
}

export interface AudienceLevel {
  id: string;
  audienceTypeId: string;
  parentId?: string | null;
  code: string;
  externalCode?: string | null;
  levelKind?: string | null;
  name: string;
  orderIndex: number;
  isActive: boolean;
  effectiveFrom?: string | Date | null;
  effectiveTo?: string | Date | null;
  children?: AudienceLevel[];
}

export interface TopicQuestionClassification {
  id: string;
  topicId: string;
  questionId: string;
  assessmentContextId: string;
  difficultyLevelId: string;
  cognitiveLevelId: string;
  validatedQuestionVersionId?: string | null;
  classificationStatus: "VALID" | "REVIEW_REQUIRED" | "INVALID" | "ARCHIVED";
  validityStatusReason?: string | null;
  isPrimary: boolean;
  weight?: number | null;
  confidence?: number | null;
  classifierType?: string | null;
  evidence?: any;
  reviewComment?: string | null;
  version: number;
  validFrom?: string | Date | null;
  validTo?: string | Date | null;
  createdBy: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  topic?: Topic;
  difficultyLevel?: DifficultyLevel;
  competences?: TopicQuestionCompetence[];
}

export interface TopicQuestionCompetence {
  id: string;
  classificationId: string;
  competenceId: string;
  weight?: number | null;
  contributionRule?: any;
  minEvidenceRequired?: number | null;
  reportingWeight?: number | null;
  isPrimary: boolean;
  createdBy?: string | null;
  reviewedBy?: string | null;
  createdAt?: string | Date;
  competence?: CompetenceType;
}

