"use client";

import Link from "next/link";
import { Badge, Button, Card, PageContainer, Text } from "@seek/ui";
import { candidateAssessments } from "@/features/candidate-portal/mock-data";
import { createAssessmentRuntimeUrl } from "@/features/assessment-runtime/url";

export default function MyAssessmentsPage() {
  return (
    <PageContainer className="max-w-none bg-slate-50/50 min-h-screen px-0 py-0">
      <div className="max-w-[1400px] mx-auto p-seek-6 space-y-seek-6">
        
        {/* Header section */}
        <div className="space-y-seek-2 border-b border-slate-100 pb-seek-4">
          <h1 className="font-sans text-2xl font-extrabold text-slate-800 tracking-tight">
            Миний үнэлгээ
          </h1>
          <Text variant="muted" className="text-xs text-slate-500 font-medium">
            Таны идэвхтэй, оролцохоор төлөвлөгдсөн болон амжилттай дууссан үнэлгээнүүдийн жагсаалт.
          </Text>
        </div>

        {/* Grid Area */}
        <div className="grid grid-cols-1 gap-seek-5 sm:grid-cols-2 lg:grid-cols-3">
          {candidateAssessments.map((assessment) => {
            const isActive = assessment.status === "Идэвхтэй";
            const isUpcoming = assessment.status === "Ирэх";

            let badgeStyle = "bg-slate-100 text-slate-600";
            if (isActive) badgeStyle = "bg-emerald-100/70 text-emerald-700";
            else if (isUpcoming) badgeStyle = "bg-amber-100/70 text-amber-700";

            return (
              <Card 
                key={assessment.id} 
                className="overflow-hidden p-seek-6 border border-slate-200 bg-white flex flex-col justify-between min-h-[220px] rounded-seek-2xl shadow-seek-xs hover:shadow-seek-sm transition-all"
              >
                <div className="space-y-seek-3">
                  <div className="flex items-start justify-between gap-seek-3">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                      {assessment.title}
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-seek-md text-[9px] font-bold tracking-wider flex-shrink-0 ${badgeStyle}`}>
                      {assessment.status}
                    </span>
                  </div>
                  <Text variant="muted" className="text-seek-xxs text-slate-400 font-bold leading-normal">
                    {assessment.dates} · {assessment.duration}
                  </Text>
                </div>

                <div className="pt-seek-4 mt-seek-4 border-t border-slate-100/80">
                  <Link href={createAssessmentRuntimeUrl("/waiting/mock-attempt-001")}>
                    <Button 
                      type="button" 
                      className="w-full bg-primary text-white hover:bg-primary-hover font-bold text-xs py-2.5 rounded-seek-xl shadow-seek-xs transition-colors"
                    >
                      {assessment.action}
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>

      </div>
    </PageContainer>
  );
}
