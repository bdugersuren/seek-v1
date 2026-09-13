export type PoolRules = {
  schemaVersion: 1;
  topicIds?: string[];
  includeDescendants?: boolean;
  types?: string[];
  difficultyLevelIds?: string[];
  audienceLevelIds?: string[];
};
export class CreateBlueprintSectionDto {
  id?: string;
  name: string;
  description?: string;
  sectionMode?: "FIXED" | "RULE_BASED";
  selectionRules?: PoolRules;
  randomPickCount: number;
  pointsPerQuestion: number;
  selectedQuestionIds: string[];
}
export class CreateBlueprintDto {
  createdBy?: string;
  name: string;
  code?: string;
  description?: string;
  assessmentContextId?: string;
  topicId?: string | null;
  defaultDurationMinutes?: number;
  defaultPassingScore?: number;
  lifecycleStatus?: "DRAFT" | "ARCHIVED";
  sections: CreateBlueprintSectionDto[];
}
export class UpdateBlueprintDto {
  version: number;
  name?: string;
  code?: string;
  description?: string;
  assessmentContextId?: string;
  topicId?: string | null;
  defaultDurationMinutes?: number;
  defaultPassingScore?: number;
  lifecycleStatus?: "DRAFT" | "ARCHIVED";
  sections?: CreateBlueprintSectionDto[];
}
