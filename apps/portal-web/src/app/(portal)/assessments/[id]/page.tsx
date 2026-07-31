"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Badge,
  Button,
  Card,
  Heading,
  Icons,
  PageContainer,
  PageTitle,
  Stack,
  Text,
  useDialog,
  useToast,
} from "@seek/ui";
import { mockAssessments } from "@/features/assessments/mock-data";

export default function AssessmentDetailPage() {
  const params = useParams<{ id: string }>();
  const assessment = mockAssessments.find((item) => item.id === params.id);
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  if (!assessment) {
    return (
      <PageContainer>
        <PageTitle
          title="Assessment олдсонгүй"
          subtitle="Сонгосон assessment mock catalog дотор байхгүй байна."
        />
        <Link
          href="/assessments"
          className="inline-flex w-fit items-center justify-center rounded-seek-md border border-border bg-surface px-seek-4 py-seek-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
        >
          Assessment list рүү буцах
        </Link>
      </PageContainer>
    );
  }

  const openInviteModal = () => {
    showDialog({
      title: "Candidate invite илгээх",
      description:
        "Production үед энэ modal дээр email list, deadline, candidate group сонгох form байрлана.",
      confirmLabel: "Invite илгээх",
      cancelLabel: "Болих",
      onConfirm: () =>
        showToast(
          `${assessment.title} invite workflow demo ажиллалаа.`,
          "success",
        ),
    });
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
        <PageTitle title={assessment.title} subtitle={assessment.description} />
        <div className="flex flex-wrap gap-seek-2">
          <Badge>{assessment.status}</Badge>
          <Badge variant="secondary">{assessment.tag}</Badge>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-seek-4 md:grid-cols-4">
        {[
          ["Candidates", assessment.candidates],
          ["Completed", assessment.completed],
          ["Questions", assessment.questionCount],
          ["Duration", `${assessment.durationMinutes}m`],
        ].map(([label, value]) => (
          <Card key={label}>
            <Stack gap={2}>
              <Text variant="muted" className="text-sm font-medium">
                {label}
              </Text>
              <Text className="text-3xl font-bold text-primary">{value}</Text>
            </Stack>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-seek-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <Stack gap={5}>
            <div className="flex items-center justify-between gap-seek-3">
              <Heading level={2} className="text-xl">
                Question preview
              </Heading>
              <Badge variant="secondary">Markdown / KaTeX ready</Badge>
            </div>
            {assessment.questions.map((question) => (
              <div
                key={question.id}
                className="rounded-seek-md border border-border bg-muted-background p-seek-4"
              >
                <Stack gap={3}>
                  <div className="flex items-start justify-between gap-seek-3">
                    <Heading level={3} className="text-lg">
                      {question.title}
                    </Heading>
                    <Badge>{question.points} pts</Badge>
                  </div>
                  <Text className="font-mono text-sm leading-6">
                    {question.markdown}
                  </Text>
                </Stack>
              </div>
            ))}
          </Stack>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <Stack gap={5}>
            <Stack gap={2}>
              <Heading level={2} className="text-xl text-primary-foreground">
                Candidate invite
              </Heading>
              <Text className="text-primary-foreground/85">
                Invite workflow нь modal + notification pattern ашиглана.
              </Text>
            </Stack>
            <Button type="button" variant="secondary" onClick={openInviteModal}>
              Invite demo
            </Button>
            <Link
              href="/assessments"
              className="text-sm font-medium text-primary-foreground/90 underline-offset-4 hover:underline"
            >
              Assessment list рүү буцах
            </Link>
          </Stack>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-4">
        {assessment.competencies.map((competency) => (
          <Card key={competency}>
            <Stack gap={3}>
              <div className="flex h-10 w-10 items-center justify-center rounded-seek-md bg-cyan-600 text-white">
                <Icons.Check size={22} />
              </div>
              <Text className="font-medium">{competency}</Text>
            </Stack>
          </Card>
        ))}
      </section>
    </PageContainer>
  );
}
