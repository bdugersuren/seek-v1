"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Button, Card, Checkbox, ProgressBar, Text } from "@seek/ui";
import { RuntimeNotice, RuntimeShell } from "@/features/runtime/RuntimeShell";
import { useAssessmentRuntime } from "@/features/runtime/useAssessmentRuntime";

export default function WaitingRoomPage() {
  const params = useParams<{ attemptId: string }>();
  const runtime = useAssessmentRuntime(params.attemptId);
  const attempt = runtime.attempt;
  const [acceptedInstructions, setAcceptedInstructions] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const schedule = useMemo(() => {
    if (!attempt) return null;
    const startsAt = attempt.session.scheduledStartsAt || attempt.session.startsAt;
    const endsAt = attempt.session.scheduledEndsAt || attempt.session.endsAt;
    const waitingRoomOpensAt =
      attempt.session.waitingRoomOpensAt || attempt.session.startsAt;
    const startRemainingSeconds = Math.max(
      0,
      Math.floor((new Date(startsAt).getTime() - now) / 1000),
    );

    return {
      startsAt,
      endsAt,
      waitingRoomOpensAt,
      startRemainingSeconds,
      startReady: startRemainingSeconds === 0,
    };
  }, [attempt, now]);

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
      subtitle="Хуваарь, readiness, заавартай танилцаад эхлэх цагийг хүлээнэ."
    >
      <div className="space-y-seek-4">
        <Card className="p-seek-5">
          <div className="grid gap-seek-4 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center">
            <div>
              <Text className="text-2xl font-bold">
                {attempt.session.assessmentTitle}
              </Text>
              <Text variant="muted" className="mt-1">
                {attempt.session.userDisplayName} · {attempt.session.attemptId}
              </Text>
              <div className="mt-seek-4 grid grid-cols-1 gap-seek-2 text-sm text-muted-foreground sm:grid-cols-2">
                <span>Эхлэх: {formatDateTime(schedule?.startsAt)}</span>
                <span>Дуусах: {formatDateTime(schedule?.endsAt)}</span>
                <span>
                  Хүлээлгийн өрөө: {formatDateTime(schedule?.waitingRoomOpensAt)}
                </span>
                <span>
                  Урьдчилан нэвтрэх:{" "}
                  {attempt.session.requiredEarlyJoinMinutes ?? 0} минут
                </span>
              </div>
            </div>
            <div className="rounded-seek-lg border border-border bg-muted-background px-seek-4 py-seek-5 text-center">
              <Text variant="muted" className="text-xs uppercase">
                {schedule?.startReady ? "Дуусахад үлдсэн" : "Эхлэхэд үлдсэн"}
              </Text>
              <Text className="mt-1 font-mono text-4xl font-bold text-primary">
                {schedule?.startReady
                  ? runtime.formattedRemaining
                  : formatDuration(schedule?.startRemainingSeconds ?? 0)}
              </Text>
              <Text variant="muted" className="mt-2 text-xs">
                Цаг серверийн хуваариар тоологдоно.
              </Text>
            </div>
          </div>
        </Card>

        <div className="grid gap-seek-4 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-seek-4">
            <Card className="p-seek-5">
              <Text className="text-xl font-bold">Заавар, шаардлага</Text>
              <div className="mt-seek-4 space-y-seek-3">
                {instructionItems.map((item, index) => (
                  <div
                    key={item.title}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-seek-3 rounded-seek-md border border-border p-seek-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-seek-md bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <Text className="font-semibold">{item.title}</Text>
                      <Text variant="muted" className="mt-1 text-sm leading-6">
                        {item.body}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-seek-5 rounded-seek-md bg-muted-background p-seek-4">
                <Checkbox
                  checked={acceptedInstructions}
                  label="Би бүх зааврыг анхааралтай уншиж, ойлгосон."
                  onChange={(event) =>
                    setAcceptedInstructions(event.currentTarget.checked)
                  }
                />
              </div>
            </Card>

            <Card className="p-seek-5">
              <Text className="text-xl font-bold">Readiness</Text>
              <div className="mt-seek-4 space-y-seek-3">
                <ReadinessRow
                  label="Attempt entitlement"
                  ok
                  detail="Session баталгаажсан"
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
                  label="Start countdown"
                  ok={Boolean(schedule?.startReady)}
                  detail={
                    schedule?.startReady
                      ? "Эхлэх цаг болсон"
                      : "Эхлэх цагийг хүлээж байна"
                  }
                />
                <ReadinessRow
                  label="Instruction confirmation"
                  ok={acceptedInstructions}
                  detail={
                    acceptedInstructions
                      ? "Заавартай танилцсан"
                      : "Checkbox зөвшөөрөх шаардлагатай"
                  }
                />
              </div>
            </Card>
          </div>

          <div className="space-y-seek-4">
            <Card className="p-seek-4">
              <Text className="font-bold">Шалгалтын мэдээлэл</Text>
              <div className="mt-seek-4 space-y-seek-3">
                <SummaryRow label="Асуулт" value={`${attempt.session.questionCount ?? attempt.questions.length}`} />
                <SummaryRow label="Нийт оноо" value={`${attempt.session.totalPoints ?? 0}`} />
                <SummaryRow label="Тэнцэх хувь" value={`${attempt.session.passingPercent ?? 0}%`} />
                <SummaryRow
                  label="Үргэлжлэх хугацаа"
                  value={`${Math.round(attempt.session.durationSeconds / 60)} минут`}
                />
                <SummaryRow label="Autosubmit" value="Идэвхтэй" />
              </div>
            </Card>

            <RuntimeNotice title="Secure start model">
              Асуултын payload урьдчилан кодлогдож татагдана. Эхлэх мөчид unlock
              key ирсний дараа runtime нээгдэнэ.
            </RuntimeNotice>

            <Card className="p-seek-4">
              <Text className="font-bold">Runtime status</Text>
              <Text variant="muted" className="mt-2 text-sm">
                {runtime.statusLabel}
              </Text>
              <div className="mt-seek-3">
                <ProgressBar
                  value={
                    acceptedInstructions && runtime.payloadPreloaded
                      ? schedule?.startReady
                        ? 100
                        : 75
                      : runtime.payloadPreloaded
                        ? 55
                        : 30
                  }
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 gap-seek-2">
              <Button
                type="button"
                variant="secondary"
                onClick={runtime.requestFullscreen}
              >
                Fullscreen асаах
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={
                  !runtime.payloadPreloaded ||
                  !acceptedInstructions ||
                  !schedule?.startReady ||
                  runtime.starting
                }
                onClick={runtime.startAttempt}
              >
                {runtime.starting ? "Эхлүүлж байна" : "Start event илгээх"}
              </Button>
              <Link
                href={`/take/${attempt.session.attemptId}`}
                className="inline-flex"
              >
                <Button
                  type="button"
                  className="w-full"
                  disabled={!runtime.canStart || !acceptedInstructions}
                >
                  Шалгалт эхлүүлэх
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RuntimeShell>
  );
}

const instructionItems = [
  {
    title: "Хуудаснаас гарахгүй байх",
    body:
      "Шалгалтын хүлээлгийн болон ажиллах үед энэ хуудаснаас гарахгүй. 3 удаа хуудаснаас гарсан эсвэл browser focus алдсан тохиолдолд тест ажиллах боломжгүй болно.",
  },
  {
    title: "Цаг серверээр тоологдоно",
    body:
      "Дэлгэцийн баруун дээд хэсгийн тоолуур шалгалт эхлэх болон дуусахад үлдсэн хугацааг харуулна. Таймер тэг болоход тест автоматаар дуусаж autosubmit хийгдэнэ.",
  },
  {
    title: "Асуултын самбар",
    body:
      "Дугаарлагдсан асуулт руу шууд очихын тулд баруун талын асуултын самбар дээрх дугаар дээр дарна. Энэ үйлдэл нь одоогийн асуултын хариултыг хадгалахгүй гэдгийг анхаарна уу.",
  },
  {
    title: "Хариулт хадгалах",
    body:
      "Одоогийн асуултын хариултаа хадгалахын тулд Хадгалах ба Дараах дээр дарж дараагийн асуулт руу шилжинэ. Үнэлүүлэгч хугацаанаасаа өмнө submit хийж болно.",
  },
];

function formatDateTime(value?: string) {
  if (!value) return "Тодорхойгүй";

  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-seek-3 border-b border-border pb-seek-2 last:border-0 last:pb-0">
      <Text variant="muted" className="text-sm">
        {label}
      </Text>
      <Text className="text-sm font-bold">{value}</Text>
    </div>
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
