"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  Icons,
  PageTitle,
  Text,
  useToast,
} from "@seek/ui";
import {
  fetchAssessmentContexts,
  fetchQuestions,
  fetchBlueprints,
  fetchQuizzes,
} from "@/features/assessor-workspace/api";

export default function AssessorContextDashboard() {
  const params = useParams();
  const contextId = params.contextId as string;
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<any>(null);
  const [stats, setStats] = useState({
    totalQuestions: 0,
    approvedQuestions: 0,
    draftQuestions: 0,
    totalBlueprints: 0,
    readyBlueprints: 0,
    totalQuizzes: 0,
    activeQuizzes: 0,
    draftQuizzes: 0,
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [contexts, questions, blueprints, quizzes] = await Promise.all([
          fetchAssessmentContexts(),
          fetchQuestions({ ownerUserId: "mock-assessor", assessmentContextId: contextId }),
          fetchBlueprints(contextId),
          fetchQuizzes(contextId),
        ]);

        const currentContext = contexts.find((c: any) => c.id === contextId);
        setContext(currentContext || null);

        // Calculate statistics
        const totalQ = questions?.length || 0;
        const approvedQ = questions?.filter((q: any) => q.status === "approved" || q.status === "published").length || 0;
        const draftQ = questions?.filter((q: any) => q.status === "draft").length || 0;

        const totalBP = blueprints?.length || 0;
        const readyBP = blueprints?.filter((bp: any) => bp.status === "ready" || bp.status === "published").length || 0;

        const totalQz = quizzes?.length || 0;
        const activeQz = quizzes?.filter((qz: any) => qz.status === "ready" || qz.status === "published" || qz.status === "active").length || 0;
        const draftQz = quizzes?.filter((qz: any) => qz.status === "draft").length || 0;

        setStats({
          totalQuestions: totalQ,
          approvedQuestions: approvedQ,
          draftQuestions: draftQ,
          totalBlueprints: totalBP,
          readyBlueprints: readyBP,
          totalQuizzes: totalQz,
          activeQuizzes: activeQz,
          draftQuizzes: draftQz,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        showToast("Мэдээллийг татаж чадсангүй.", "danger");
      } finally {
        setLoading(false);
      }
    }

    if (contextId) {
      loadData();
    }
  }, [contextId, showToast]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Text variant="muted">Мэдээллийг уншиж байна, түр хүлээнэ үү...</Text>
      </div>
    );
  }

  if (!context) {
    return (
      <div className="p-seek-6 max-w-4xl mx-auto text-center space-y-seek-4">
        <Icons.Warning size={48} className="text-danger mx-auto" />
        <Text className="text-xl font-bold">Үнэлгээний контекст олдсонгүй</Text>
        <Link href="/assessor/context" className="text-primary font-semibold hover:underline block">
          Буцах
        </Link>
      </div>
    );
  }

  return (
    <div className="p-seek-6 space-y-seek-6 max-w-5xl mx-auto">
      {/* Header section with context info */}
      <div className="border-b border-border pb-seek-4 space-y-seek-2">
        <div className="flex items-center gap-seek-3">
          <Link href="/assessor/context" className="text-muted-foreground hover:text-foreground">
            <Icons.Undo2 />
          </Link>
          <span className="font-mono text-xs text-muted-foreground px-seek-2 py-seek-1 bg-muted-background rounded-seek-sm">
            {context.code}
          </span>
          {context.audienceType && (
            <span className="text-seek-xxs px-seek-2 py-0.5 rounded-seek-full bg-primary/10 text-primary font-semibold">
              {context.audienceType.name}
            </span>
          )}
        </div>
        <PageTitle
          title={context.name}
          subtitle={context.description || "Контекстийн тайлбар оруулаагүй байна."}
        />
        
        {/* Context metadata badges */}
        <div className="flex flex-wrap gap-seek-4 pt-seek-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">Хүндрэлийн шатлал:</span>
            <span>{context.difficultyScale?.name || "Тохируулаагүй"}</span>
          </div>
          <span className="text-border">|</span>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-foreground">Когнитив хүрээ:</span>
            <span>{context.cognitiveFramework?.name || "Тохируулаагүй"}</span>
          </div>
        </div>
      </div>

      {/* Main dashboard navigation cards */}
      <div className="grid gap-seek-6 md:grid-cols-3">
        {/* Card 1: Question Bank */}
        <Link href={`/assessor/context/${contextId}/question-bank`} className="group block">
          <Card className="p-seek-6 border border-border group-hover:border-primary group-hover:shadow-seek-md transition-all h-full flex flex-col justify-between space-y-seek-4">
            <div className="space-y-seek-3">
              <div className="p-seek-3 rounded-seek-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all w-fit">
                <Icons.Warning size={28} />
              </div>
              <h3 className="text-xl font-bold group-hover:text-primary transition-all">
                Даалгавар боловсруулах
              </h3>
              <Text variant="muted" className="text-sm">
                Контекстийн агуулгын сэдвүүд, танин мэдэхүйн түвшнүүд болон үнэлэх ур чадваруудын хүрээнд асуулт, даалгавруудыг үүсгэх, засах, хянах.
              </Text>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-seek-2 pt-seek-4 border-t border-border/50 text-center text-xs">
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Нийт</span>
                <span className="text-base font-bold text-foreground">{stats.totalQuestions}</span>
              </div>
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Батлагдсан</span>
                <span className="text-base font-bold text-success">{stats.approvedQuestions}</span>
              </div>
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Ноорог</span>
                <span className="text-base font-bold text-warning">{stats.draftQuestions}</span>
              </div>
            </div>
          </Card>
        </Link>

        {/* Card 2: Quiz Template / Blueprint */}
        <Link href={`/assessor/context/${contextId}/blueprints`} className="group block">
          <Card className="p-seek-6 border border-border group-hover:border-primary group-hover:shadow-seek-md transition-all h-full flex flex-col justify-between space-y-seek-4">
            <div className="space-y-seek-3">
              <div className="p-seek-3 rounded-seek-lg bg-success/5 text-success group-hover:bg-success group-hover:text-white transition-all w-fit">
                <Icons.Settings size={28} />
              </div>
              <h3 className="text-xl font-bold group-hover:text-success transition-all">
                Үнэлгээний загвар (Blueprint)
              </h3>
              <Text variant="muted" className="text-sm">
                Бүтэц, сэдвийн сан, хэсгүүдийн random pick, тэнцэх босго оноо болон үргэлжлэх хугацаа зэрэг дүрмүүдийг тохируулан үнэлгээний загварыг бэлтгэх.
              </Text>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-seek-2 pt-seek-4 border-t border-border/50 text-center text-xs">
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Нийт загвар</span>
                <span className="text-base font-bold text-foreground">{stats.totalBlueprints}</span>
              </div>
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Идэвхтэй / Бэлэн</span>
                <span className="text-base font-bold text-success">{stats.readyBlueprints}</span>
              </div>
            </div>
          </Card>
        </Link>

        {/* Card 3: Quiz Management */}
        <Link href={`/assessor/context/${contextId}/quizzes`} className="group block">
          <Card className="p-seek-6 border border-border group-hover:border-primary group-hover:shadow-seek-md transition-all h-full flex flex-col justify-between space-y-seek-4">
            <div className="space-y-seek-3">
              <div className="p-seek-3 rounded-seek-lg bg-indigo-500/5 text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all w-fit">
                <Icons.Calendar size={28} />
              </div>
              <h3 className="text-xl font-bold group-hover:text-indigo-500 transition-all">
                Quiz удирдах
              </h3>
              <Text variant="muted" className="text-sm">
                Үнэлгээний загварыг ашиглан шалгуулагчдад зориулсан сорил, шалгалтыг үүсгэх, төлөвлөх, үнэ болон оролдлогын тоог тохируулах.
              </Text>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-seek-2 pt-seek-4 border-t border-border/50 text-center text-xs">
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Нийт</span>
                <span className="text-base font-bold text-foreground">{stats.totalQuizzes}</span>
              </div>
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Идэвхтэй</span>
                <span className="text-base font-bold text-success">{stats.activeQuizzes}</span>
              </div>
              <div>
                <span className="block text-seek-xxs text-muted-foreground uppercase">Ноорог</span>
                <span className="text-base font-bold text-warning">{stats.draftQuizzes}</span>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
