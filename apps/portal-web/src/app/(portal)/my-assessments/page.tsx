import Link from "next/link";
import { Badge, Button, Card, PageContainer, Text } from "@seek/ui";
import { candidateAssessments } from "@/features/candidate-portal/mock-data";

export default function MyAssessmentsPage() {
  return (
    <PageContainer className="max-w-none bg-muted-background">
      <h1 className="font-sans text-3xl font-bold text-foreground">
        Миний үнэлгээ
      </h1>
      <Text variant="muted" className="mt-seek-2">
        Идэвхтэй, ирэх болон дууссан үнэлгээнүүд.
      </Text>
      <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 xl:grid-cols-3">
        {candidateAssessments.map((assessment) => (
          <Card key={assessment.id}>
            <div className="flex items-start justify-between gap-seek-3">
              <h2 className="font-sans text-lg font-bold text-foreground">
                {assessment.title}
              </h2>
              <Badge
                variant={
                  assessment.status === "Идэвхтэй"
                    ? "success"
                    : assessment.status === "Ирэх"
                      ? "warning"
                      : "secondary"
                }
              >
                {assessment.status}
              </Badge>
            </div>
            <Text variant="muted" className="mt-seek-3 text-sm">
              {assessment.dates} · {assessment.duration}
            </Text>
            <Link href="/take/mock-attempt-001">
              <Button type="button" className="mt-seek-5 w-full">
                {assessment.action}
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
