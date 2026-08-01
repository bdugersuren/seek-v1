"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, ProgressBar, Text } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";
import { useAssessmentRuntime } from "@/features/runtime/useAssessmentRuntime";

export default function WaitingRoomPage() {
  const params = useParams<{ attemptId: string }>();
  const runtime = useAssessmentRuntime(params.attemptId);
  const attempt = runtime.attempt;

  if (!runtime.isKnownAttempt || !attempt) {
    return (
      <RuntimeShell title="Attempt олдсонгүй" subtitle="Runtime session шалгаж байна.">
        <RuntimeNotice tone="danger" title="Буруу attempt">
          Portal-оос дахин шалгалтад орох холбоос нээнэ үү.
        </RuntimeNotice>
      </RuntimeShell>
    );
  }

  return (
    <RuntimeShell
      title="Шалгалтын хүлээлгийн өрөө"
      subtitle="Эхлэхээс өмнө session, төхөөрөмж, payload readiness шалгана."
    >
      <div className="grid gap-seek-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <Card className="p-seek-5">
          <div className="flex flex-col gap-seek-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <Text className="text-xl font-bold">
                {attempt.session.assessmentTitle}
              </Text>
              <Text variant="muted" className="mt-1">
                {attempt.session.userDisplayName} · {attempt.session.attemptId}
              </Text>
            </div>
            <div className="rounded-seek-lg bg-muted-background px-seek-4 py-seek-3 text-center">
              <Text variant="muted" className="text-xs uppercase">
                Үлдсэн хугацаа
              </Text>
              <Text className="font-mono text-3xl font-bold text-primary">
                {runtime.formattedRemaining}
              </Text>
            </div>
          </div>

          <div className="mt-seek-6 space-y-seek-3">
            <ReadinessRow
              label="Attempt entitlement"
              ok
              detail="Mock session баталгаажсан"
            />
            <ReadinessRow
              label="Encrypted payload preload"
              ok={runtime.payloadPreloaded}
              detail={
                runtime.payloadPreloaded
                  ? "Payload татагдсан, unlock key хүлээж байна"
                  : "Payload татаж байна..."
              }
            />
            <ReadinessRow
              label="Unlock key"
              ok={runtime.unlockReceived}
              detail={
                runtime.unlockReceived
                  ? "Start event mock ирсэн"
                  : "Эхлэх мөчид WebSocket/SSE-ээр ирнэ"
              }
            />
            <ReadinessRow
              label="Fullscreen policy"
              ok={runtime.fullscreenActive}
              detail={
                runtime.fullscreenActive
                  ? "Fullscreen active"
                  : "Шалгалт эхлэхээс өмнө fullscreen асаана"
              }
            />
          </div>

          <div className="mt-seek-6 flex flex-col gap-seek-2 sm:flex-row">
            <Button type="button" variant="secondary" onClick={runtime.requestFullscreen}>
              Fullscreen асаах
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={!runtime.payloadPreloaded}
              onClick={runtime.receiveMockUnlock}
            >
              Mock unlock event
            </Button>
            <Link href={`/take/${attempt.session.attemptId}`} className="inline-flex">
              <Button type="button" disabled={!runtime.canStart}>
                Шалгалт эхлүүлэх
              </Button>
            </Link>
          </div>
        </Card>

        <div className="space-y-seek-4">
          <RuntimeNotice title="Secure start model">
            Асуултын payload урьдчилан кодлогдож татагдана. Эхлэх мөчид unlock key ирсний дараа runtime нээгдэнэ.
          </RuntimeNotice>
          <Card className="p-seek-4">
            <Text className="font-bold">Runtime status</Text>
            <Text variant="muted" className="mt-2 text-sm">
              {runtime.statusLabel}
            </Text>
            <div className="mt-seek-3">
              <ProgressBar value={runtime.payloadPreloaded ? 75 : 35} />
            </div>
          </Card>
        </div>
      </div>
    </RuntimeShell>
  );
}

function ReadinessRow({
  label,
  ok,
  detail,
}: {
  label: string;
  ok: boolean;
  detail: string;
}) {
  return (
    <div className="flex items-start justify-between gap-seek-3 rounded-seek-md border border-border p-seek-3">
      <div>
        <Text className="font-semibold">{label}</Text>
        <Text variant="muted" className="mt-1 text-sm">
          {detail}
        </Text>
      </div>
      <span
        className={`rounded-seek-full px-seek-3 py-seek-1 text-xs font-bold ${
          ok ? "bg-success-background text-success" : "bg-warning-background text-warning"
        }`}
      >
        {ok ? "OK" : "WAIT"}
      </span>
    </div>
  );
}
