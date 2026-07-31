"use client";

import { QuestionEditor } from "@/features/assessor-workspace/QuestionEditor";

export default function EditQuestionPage({
  params,
}: {
  params: { id: string };
}) {
  return <QuestionEditor mode="edit" questionCode={decodeURIComponent(params.id)} />;
}
