"use client";

import Link from "next/link";
import { Badge, Button, Card, PageTitle, Text } from "@seek/ui";
import { getBlueprintById, resolveQuizQuestionSet } from "@/features/assessor-workspace/api";
import { mockQuizzes } from "@/features/assessor-workspace/mock-data";

export default function QuizzesPage() {
  return (
    <div className="space-y-seek-4">
      <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
        <PageTitle
          title="Quiz"
          subtitle="Blueprint-ээс test instance үүсгэж хугацаа болон асуултын override тохируулна."
        />
        <Link href="/quizzes/new"><Button type="button">+ Quiz үүсгэх</Button></Link>
      </div>
      <div className="grid gap-seek-4 lg:grid-cols-2">
        {mockQuizzes.map((quiz) => {
          const blueprint = getBlueprintById(quiz.blueprintId);
          const resolved = resolveQuizQuestionSet(quiz);
          return (
            <Card key={quiz.id} className="p-seek-5">
              <div className="flex items-start justify-between">
                <div>
                  <Badge>{quiz.status}</Badge>
                  <Text className="mt-seek-3 text-xl font-bold">{quiz.title}</Text>
                  <Text variant="muted">{blueprint?.title || "Blueprint олдсонгүй"}</Text>
                </div>
                <Link href={`/quizzes/${quiz.id}`}><Button type="button" variant="secondary" size="sm">Засах</Button></Link>
              </div>
              <div className="mt-seek-4 grid gap-seek-3 sm:grid-cols-3">
                <Metric label="Хугацаа" value={`${quiz.durationMinutes}м`} />
                <Metric label="Сонгогдох" value={resolved.length} />
                <Metric label="Override" value={quiz.questionOverrides.filter((item) => item.mode !== "none").length} />
              </div>
              <Text variant="muted" className="mt-seek-4 text-sm">{quiz.startAt} - {quiz.endAt}</Text>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-seek-md bg-muted-background p-seek-3">
      <Text variant="muted" className="text-xs">{label}</Text>
      <Text className="text-xl font-bold">{value}</Text>
    </div>
  );
}
