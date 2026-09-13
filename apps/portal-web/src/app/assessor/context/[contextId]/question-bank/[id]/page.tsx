"use client";

import { useState, useEffect } from "react";
import { getQuestionByIdAsync } from "@/features/assessor-workspace/api";
import type { QuestionBankItem } from "@/features/assessor-workspace/types";
import { ReviewDetail } from "@/features/question-review/review";
import { QuestionEditor } from "@/features/assessor-workspace/QuestionEditor";

export default function EditQuestionPage({
  params,
}: {
  params: { id: string; contextId: string };
}) {
  const [question, setQuestion] = useState<QuestionBankItem | null>(null);
  const [refresh,setRefresh]=useState(0);
  const [error,setError]=useState("");
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
        if(active)setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [params.id,refresh]);

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
          <p className="text-lg font-semibold text-danger">{error||"Асуулт олдсонгүй."}</p>
        </div>
      </div>
    );
  }

  if(!['draft','changes_requested'].includes(question.status))return <ReviewDetail id={question.id} author onChanged={()=>setRefresh(x=>x+1)}/>;
  return <>
    <details className="mb-4 rounded border p-3"><summary>Шийдвэр, мэдэгдлийн түүх</summary><ReviewDetail id={question.id} author onChanged={()=>setRefresh(x=>x+1)}/></details>
    <QuestionEditor key={refresh} mode="edit" question={question} backUrl={`/assessor/context/${params.contextId}/question-bank`}/>
  </>;
}
