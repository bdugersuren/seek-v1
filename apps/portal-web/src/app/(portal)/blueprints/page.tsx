"use client";

import Link from "next/link";
import { Badge, Button, Card, PageTitle, ProgressBar, Text } from "@seek/ui";
import { getBlueprintSummary } from "@/features/assessor-workspace/api";
import { mockBlueprints } from "@/features/assessor-workspace/mock-data";

export default function BlueprintsPage() {
  return (
    <div className="space-y-seek-4">
      <div className="flex flex-col gap-seek-3 sm:flex-row sm:items-start sm:justify-between">
        <PageTitle
          title="Blueprint"
          subtitle="Даалгаврын сангаас pool бүрдүүлж, n асуултаас m санамсаргүй сонгох тестийн бүтэц."
        />
        <Link href="/blueprints/new"><Button type="button">+ Blueprint үүсгэх</Button></Link>
      </div>
      <div className="grid gap-seek-4 lg:grid-cols-2">
        {mockBlueprints.map((blueprint) => {
          const summary = getBlueprintSummary(blueprint);
          return (
            <Card key={blueprint.id} className="p-seek-5">
              <div className="flex items-start justify-between gap-seek-4">
                <div>
                  <Badge variant={summary.ready ? "success" : "warning"}>{summary.ready ? "Ашиглахад бэлэн" : "Дутуу"}</Badge>
                  <Text className="mt-seek-3 text-xl font-bold">{blueprint.title}</Text>
                  <Text variant="muted" className="mt-1">{blueprint.description}</Text>
                </div>
                <Text className="text-right text-sm text-muted-foreground">{blueprint.updatedAt}</Text>
              </div>
              <div className="mt-seek-4 grid gap-seek-3 sm:grid-cols-4">
                <Metric label="Pool" value={summary.pooledQuestions} />
                <Metric label="Сонгох" value={summary.pickedQuestions} />
                <Metric label="Оноо" value={summary.totalPoints} />
                <Metric label="Хугацаа" value={`${blueprint.totalDurationMinutes}м`} />
              </div>
              <div className="mt-seek-4">
                <ProgressBar value={blueprint.passScore} />
                <Text variant="muted" className="mt-1 text-xs">Тэнцэх оноо {blueprint.passScore}%</Text>
              </div>
              <div className="mt-seek-4 flex gap-2">
                <Link href={`/blueprints/${blueprint.id}`}><Button type="button" variant="secondary">Засах</Button></Link>
                <Link href="/quizzes/new"><Button type="button">Quiz үүсгэх</Button></Link>
              </div>
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
