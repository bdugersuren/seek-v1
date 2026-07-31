"use client";

import { BlueprintEditor } from "@/features/assessor-workspace/BlueprintEditor";
import { mockBlueprints } from "@/features/assessor-workspace/mock-data";

export default function NewBlueprintPage() {
  return <BlueprintEditor blueprint={mockBlueprints[0]} mode="new" />;
}
