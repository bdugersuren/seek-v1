"use client";

import { mockBlueprints } from "@/features/assessor-workspace/mock-data";
import { BlueprintEditor } from "@/features/assessor-workspace/BlueprintEditor";

export default function EditBlueprintPage({
  params,
}: {
  params: { id: string };
}) {
  const id = decodeURIComponent(params.id);
  const blueprint =
    mockBlueprints.find((item) => item.id.toLowerCase() === id.toLowerCase()) ||
    mockBlueprints[0];
  return <BlueprintEditor blueprint={blueprint} mode="edit" />;
}
