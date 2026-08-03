"use client";

import { mockBlueprints, mockQuizzes } from "@/features/assessor-workspace/mock-data";
import { QuizEditor } from "@/features/assessor-workspace/QuizEditor";

export default function EditQuizPage({ params }: { params: { id: string } }) {
  const quiz = mockQuizzes.find((item) => item.id === params.id) ?? mockQuizzes[0];
  const blueprint =
    mockBlueprints.find((item) => item.id === quiz.blueprintId) ?? mockBlueprints[0];

  return <QuizEditor blueprint={blueprint} mode="edit" />;
}
