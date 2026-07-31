"use client";

import { useSearchParams } from "next/navigation";
import { QuizEditor } from "@/features/assessor-workspace/QuizEditor";
import { mockBlueprints } from "@/features/assessor-workspace/mock-data";

export default function NewQuizPage() {
  const searchParams = useSearchParams();
  const blueprintId = searchParams.get("blueprintId");
  const blueprint =
    mockBlueprints.find((item) => item.id === blueprintId) ?? mockBlueprints[0];

  return <QuizEditor blueprint={blueprint} mode="new" />;
}
