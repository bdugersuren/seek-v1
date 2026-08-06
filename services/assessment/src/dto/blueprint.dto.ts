export class CreateBlueprintSectionDto {
  name: string;
  randomPickCount: number;
  pointsPerQuestion: number;
  selectedQuestionIds: string[];
}

export class CreateBlueprintDto {
  name: string;
  description?: string;
  sections: CreateBlueprintSectionDto[];
}

export class UpdateBlueprintDto {
  name?: string;
  description?: string;
  sections?: CreateBlueprintSectionDto[];
}
