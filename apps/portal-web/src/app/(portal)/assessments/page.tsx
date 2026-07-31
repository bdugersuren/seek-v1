"use client";

import Link from "next/link";
import {
  Badge,
  Card,
  Heading,
  Icons,
  PageContainer,
  PageTitle,
  ProgressBar,
  Stack,
  Text,
} from "@seek/ui";
import { mockAssessments } from "@/features/assessments/mock-data";
import type { AssessmentStatus } from "@/features/assessments/types";
import {
  mockBlueprints,
  mockQuestionBank,
  mockQuizzes,
} from "@/features/assessor-workspace/mock-data";

const statusVariant: Record<
  AssessmentStatus,
  "primary" | "secondary" | "success" | "warning"
> = {
  Draft: "secondary",
  Active: "success",
  Review: "warning",
  Archived: "secondary",
};

const metrics = [
  {
    label: "Нийт assessment",
    value: String(mockAssessments.length),
    description: "mock catalog дээр",
    tone: "text-primary",
  },
  {
    label: "Active",
    value: String(
      mockAssessments.filter((assessment) => assessment.status === "Active")
        .length,
    ),
    description: "candidate авч байгаа",
    tone: "text-success",
  },
  {
    label: "Candidates",
    value: String(
      mockAssessments.reduce(
        (total, assessment) => total + assessment.candidates,
        0,
      ),
    ),
    description: "нийт холбогдсон",
    tone: "text-warning",
  },
];

export default function AssessmentsPage() {
  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle
          title="Assessor workspace"
          subtitle="Даалгаврын сан, blueprint, quiz workflow-ийг нэг дороос удирдах hub."
        />
        <Link
          href="/assessments/new"
          className="inline-flex items-center justify-center rounded-seek-md bg-primary px-seek-4 py-seek-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Шинэ assessment
        </Link>
      </div>

      <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-3">
        <WorkspaceCard
          href="/question-bank"
          title="Даалгаврын сан"
          body="Асуулт үүсгэх, засах, workflow comment-тэйгээр баталгаажуулах."
          metric={`${mockQuestionBank.length} даалгавар`}
        />
        <WorkspaceCard
          href="/blueprints"
          title="Blueprint"
          body="Question-pool сонгож, n асуултаас m санамсаргүй сонгох дүрэм тохируулах."
          metric={`${mockBlueprints.length} загвар`}
        />
        <WorkspaceCard
          href="/quizzes"
          title="Quiz"
          body="Blueprint-ээс quiz хуваарь үүсгэж mandatory/excluded тэмдэглэгээ хийх."
          metric={`${mockQuizzes.length} quiz`}
        />
      </section>

      <section className="grid grid-cols-1 gap-seek-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <Stack gap={2}>
              <Text variant="muted" className="text-sm font-medium">
                {metric.label}
              </Text>
              <Text className={`text-3xl font-bold ${metric.tone}`}>
                {metric.value}
              </Text>
              <Text variant="muted">{metric.description}</Text>
            </Stack>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-3">
        {mockAssessments.map((assessment) => {
          const completion =
            assessment.candidates === 0
              ? 0
              : Math.round(
                  (assessment.completed / assessment.candidates) * 100,
                );

          return (
            <Card key={assessment.id}>
              <Stack gap={4}>
                <div className="flex items-start justify-between gap-seek-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-seek-md bg-cyan-600 text-white shadow-seek-sm">
                    <Icons.Check size={26} />
                  </div>
                  <Badge variant={statusVariant[assessment.status]}>
                    {assessment.status}
                  </Badge>
                </div>
                <Stack gap={2}>
                  <Heading level={3} className="text-lg leading-6">
                    {assessment.title}
                  </Heading>
                  <Text variant="muted" className="text-sm leading-6">
                    {assessment.description}
                  </Text>
                </Stack>
                <div>
                  <div className="mb-seek-2 flex items-center justify-between">
                    <Text className="text-sm font-medium">
                      Candidate progress
                    </Text>
                    <Text variant="muted" className="text-sm">
                      {completion}%
                    </Text>
                  </div>
                  <ProgressBar value={completion} />
                </div>
                <div className="grid grid-cols-2 gap-seek-2 text-sm">
                  <div className="rounded-seek-md bg-muted-background p-seek-3">
                    <Text className="font-bold">
                      {assessment.questionCount}
                    </Text>
                    <Text variant="muted" className="text-xs">
                      questions
                    </Text>
                  </div>
                  <div className="rounded-seek-md bg-muted-background p-seek-3">
                    <Text className="font-bold">
                      {assessment.durationMinutes}m
                    </Text>
                    <Text variant="muted" className="text-xs">
                      duration
                    </Text>
                  </div>
                </div>
                <Link
                  href={`/assessments/${assessment.id}`}
                  className="inline-flex items-center justify-center rounded-seek-md border border-border bg-surface px-seek-3 py-seek-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  Дэлгэрэнгүй
                </Link>
              </Stack>
            </Card>
          );
        })}
      </section>
    </PageContainer>
  );
}

function WorkspaceCard({
  href,
  title,
  body,
  metric,
}: {
  href: string;
  title: string;
  body: string;
  metric: string;
}) {
  return (
    <Card>
      <Stack gap={3}>
        <Badge variant="primary">{metric}</Badge>
        <Heading level={3} className="text-xl">
          {title}
        </Heading>
        <Text variant="muted" className="text-sm leading-6">
          {body}
        </Text>
        <Link
          href={href}
          className="inline-flex items-center justify-center rounded-seek-md border border-border bg-surface px-seek-3 py-seek-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Нээх
        </Link>
      </Stack>
    </Card>
  );
}
