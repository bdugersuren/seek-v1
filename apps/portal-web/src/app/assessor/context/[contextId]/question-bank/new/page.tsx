"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    contextId: string;
  };
}

export default function NewQuestionPage({ params }: PageProps) {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/assessor/context/${params.contextId}/question-bank`);
  }, [router, params.contextId]);

  return <div className="p-seek-5 text-center text-sm text-muted-foreground">Шилжүүлж байна...</div>;
}
