"use client";

import { useSearchParams } from "next/navigation";
import { BlueprintEditor } from "@/features/assessor-workspace/BlueprintEditor";
import { mockBlueprints } from "@/features/assessor-workspace/mock-data";

export default function NewBlueprintPage() {
  const searchParams = useSearchParams();
  const contextId = searchParams.get("contextId") || undefined;

  return <BlueprintEditor blueprint={mockBlueprints[0]} mode="new" contextId={contextId} />;
}
