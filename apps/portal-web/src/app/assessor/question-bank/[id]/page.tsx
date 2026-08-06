"use client";

import { useState, useEffect } from "react";
import { getQuestionByIdAsync } from "@/features/assessor-workspace/api";
import type { QuestionBankItem } from "@/features/assessor-workspace/types";
import { QuestionEditor } from "@/features/assessor-workspace/QuestionEditor";

export default function EditQuestionPage({
  params,
}: {
  params: { id: string };
}) {
  const [question, setQuestion] = useState<QuestionBankItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getQuestionByIdAsync(decodeURIComponent(params.id));
        if (active) {
          setQuestion(data);
        }
      } catch (err) {
        console.error("Failed to load question", err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted-background">
        <div className="text-center">
          <p className="text-lg font-semibold text-danger">Асуулт олдсонгүй.</p>
        </div>
      </div>
    );
  }

  return <QuestionEditor mode="edit" question={question} />;
}
