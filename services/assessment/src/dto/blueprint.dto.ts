export class CreateBlueprintSectionDto {
  name: string;
  randomPickCount: number;
  pointsPerQuestion: number;
  selectedQuestionIds: string[];
}

export class CreateBlueprintDto {
  name: string;
  code?: string;
  description?: string;
  assessmentContextId?: string;
  sections: CreateBlueprintSectionDto[];
}

export class UpdateBlueprintDto {
  name?: string;
  code?: string;
  description?: string;
  assessmentContextId?: string;
  sections?: CreateBlueprintSectionDto[];
}
