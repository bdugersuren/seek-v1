"use client";

import { mockBlueprints } from "@/features/assessor-workspace/mock-data";
import { BlueprintEditor } from "@/features/assessor-workspace/BlueprintEditor";

export default function EditBlueprintPage() {
  return <BlueprintEditor blueprint={mockBlueprints[0]} mode="edit" />;
}
