"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Text } from "@seek/ui";
import { RuntimeShell } from "@/features/runtime/RuntimeShell";
import { mockRuntimeAttempt } from "@/features/runtime/mock-data";

export default function SubmittedPage() {
  const params = useParams<{ attemptId: string }>();
  const known = params.attemptId === mockRuntimeAttempt.session.attemptId;

  return (
    <RuntimeShell
      title="Шалгалт илгээгдлээ"
      subtitle="Submit receipt болон result visibility policy."
    >
      <Card className="max-w-3xl p-seek-5">
        <Text className="text-xl font-bold">
          {known ? mockRuntimeAttempt.session.assessmentTitle : "Unknown assessment"}
        </Text>
        <div className="mt-seek-4 grid gap-seek-3 sm:grid-cols-2">
          <ReceiptMetric label="Attempt" value={params.attemptId} />
          <ReceiptMetric label="Receipt" value={`receipt-${params.attemptId}`} />
          <ReceiptMetric
            label="Result release"
            value={mockRuntimeAttempt.session.resultVisibilityPolicy.resultReleaseMode}
          />
          <ReceiptMetric
            label="Solutions"
            value={
              mockRuntimeAttempt.session.resultVisibilityPolicy.hideSolutions
                ? "Hidden"
                : "Visible"
            }
          />
        </div>
        <Text variant="muted" className="mt-seek-4">
          Bulk exam default policy: оноо assessor талд хадгалагдана, зөв хариу болон тайлбар
          шалгалт хаагдсаны дараа эсвэл manual release үед харагдана.
        </Text>
        <div className="mt-seek-5">
          <Link href="/">
            <Button type="button">Assessment home руу буцах</Button>
          </Link>
        </div>
      </Card>
    </RuntimeShell>
  );
}

function ReceiptMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-seek-md bg-muted-background p-seek-3">
      <Text variant="muted" className="text-xs">
        {label}
      </Text>
      <Text className="mt-1 break-all font-semibold">{value}</Text>
    </div>
  );
}
