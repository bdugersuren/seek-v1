"use client";

import { useState, useEffect } from "react";
import { getBlueprintByIdAsync } from "@/features/assessor-workspace/api";
import type { Blueprint } from "@/features/assessor-workspace/types";
import { BlueprintEditor } from "@/features/assessor-workspace/BlueprintEditor";

export default function EditBlueprintPage({
  params,
}: {
  params: { id: string; contextId: string };
}) {
  const id = decodeURIComponent(params.id);
  const contextId = decodeURIComponent(params.contextId);
  
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getBlueprintByIdAsync(id);
        if (active) {
          setBlueprint(data);
        }
      } catch (err) {
        console.error("Failed to load blueprint", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!blueprint) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-danger">Blueprint олдсонгүй.</p>
        </div>
      </div>
    );
  }

  return <BlueprintEditor blueprint={blueprint} mode="edit" contextId={contextId} />;
}
