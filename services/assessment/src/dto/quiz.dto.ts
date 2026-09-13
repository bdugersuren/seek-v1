export class QuizQuestionOverrideDto {
  questionId: string;
  mode: "mandatory" | "excluded";
}
export class CreateQuizDto {
  createdBy?: string;
  title: string;
  description?: string;
  blueprintId: string;
  expectedBlueprintVersion: number;
  requestId: string;
  passingScore?: number;
  priceMnt?: number;
  durationMinutes?: number;
  maxAttempts?: number;
  questionOverrides?: QuizQuestionOverrideDto[];
}
export class UpdateQuizDto {
  quizRevisionId: string;
  expectedVersion: number;
  reselectQuestions?: boolean;
  title?: string;
  description?: string;
  passingScore?: number;
  durationMinutes?: number;
  maxAttempts?: number;
  questionOverrides?: QuizQuestionOverrideDto[];
}
