"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchAssessmentContexts } from "@/features/assessor-workspace/api";

export default function OldNewQuestionPage() {
  const router = useRouter();

  useEffect(() => {
    async function doRedirect() {
      try {
        const contexts = await fetchAssessmentContexts();
        if (contexts && contexts.length > 0) {
          router.replace(`/assessor/context/${contexts[0].id}/question-bank`);
        } else {
          router.replace("/assessor/context");
        }
      } catch (err) {
        router.replace("/assessor/context");
      }
    }
    doRedirect();
  }, [router]);

  return <div className="p-seek-5 text-center text-sm text-muted-foreground">Чиглүүлж байна...</div>;
}
