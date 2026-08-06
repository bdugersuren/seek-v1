export class QuizQuestionOverrideDto {
  questionId: string;
  mode: "mandatory" | "excluded";
}

export class CreateQuizDto {
  title: string;
  description?: string;
  blueprintId: string;
  priceMnt?: number;
  durationMinutes: number;
  maxAttempts?: number;
  questionOverrides?: QuizQuestionOverrideDto[];
}

export class UpdateQuizDto {
  title?: string;
  description?: string;
  priceMnt?: number;
  durationMinutes?: number;
  maxAttempts?: number;
  questionOverrides?: QuizQuestionOverrideDto[];
}
