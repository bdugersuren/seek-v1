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
  const [error,setError]=useState('');
  const [retry,setRetry]=useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);setError('');
        const data = await getBlueprintByIdAsync(id);
        if (active) {
          if(data?.assessmentContextId!==contextId&&data)throw new Error('Blueprint энэ контекстэд хамаарахгүй.');
          setBlueprint(data);
        }
      } catch (err) {
        if(active)setError((err as any).status===403?'Хандах эрхгүй.':(err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [id,contextId,retry]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if(error)return <div role="alert" className="p-6">{error}<button className="ml-4 underline" onClick={()=>setRetry(n=>n+1)}>Дахин оролдох</button></div>;
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
