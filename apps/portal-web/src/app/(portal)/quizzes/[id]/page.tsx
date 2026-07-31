"use client";

import { mockBlueprints } from "@/features/assessor-workspace/mock-data";
import { QuizEditor } from "@/features/assessor-workspace/QuizEditor";

export default function EditQuizPage() {
  return <QuizEditor blueprint={mockBlueprints[0]} mode="edit" />;
}
