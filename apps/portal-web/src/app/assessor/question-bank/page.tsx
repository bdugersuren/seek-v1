"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@seek/ui";
import { fetchAssessmentContexts } from "@/features/assessor-workspace/api";

export default function OldQuestionBankPage() {
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    async function doRedirect() {
      try {
        const contexts = await fetchAssessmentContexts();
        if (contexts && contexts.length > 0) {
          // System has contexts, redirect to the first context's question bank
          router.replace(`/assessor/context/${contexts[0].id}/question-bank`);
        } else {
          // No contexts found, redirect to context list
          router.replace("/assessor/context");
        }
      } catch (err) {
        console.error("Redirect error:", err);
        showToast("Чиглүүлэлт хийхэд алдаа гарлаа. Контекст сонгох хуудас руу шилжиж байна.", "warning");
        router.replace("/assessor/context");
      }
    }
    doRedirect();
  }, [router, showToast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted-background">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Чиглүүлж байна, түр хүлээнэ үү...</p>
      </div>
    </div>
  );
}
