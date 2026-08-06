"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewQuestionPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/assessor/question-bank");
  }, [router]);

  return <div className="p-seek-5 text-center text-sm text-muted-foreground">Шилжүүлж байна...</div>;
}
