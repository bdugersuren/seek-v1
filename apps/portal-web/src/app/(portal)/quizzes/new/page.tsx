"use client";

import { QuizEditor } from "@/features/assessor-workspace/QuizEditor";
import { mockBlueprints } from "@/features/assessor-workspace/mock-data";

export default function NewQuizPage() {
  return <QuizEditor blueprint={mockBlueprints[0]} mode="new" />;
}
