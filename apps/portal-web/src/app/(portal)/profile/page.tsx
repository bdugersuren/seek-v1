"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  PageContainer,
  Text,
  useDialog,
  useToast,
} from "@seek/ui";
import { mockProfile } from "@/features/profile/mock-data";
import type {
  AffiliationItem,
  DocumentItem,
  EmploymentHistoryItem,
  ProfileMockData,
  VerificationItem,
  VerificationStatus,
} from "@/features/profile/types";

type ProfileTab =
  | "personal"
  | "employment"
  | "affiliation"
  | "verification"
  | "documents"
  | "security";

const tabs: Array<{ id: ProfileTab; label: string }> = [
  { id: "personal", label: "Хувийн мэдээлэл" },
  { id: "employment", label: "Албан тушаалын түүх" },
  { id: "affiliation", label: "Харьяалал" },
  { id: "verification", label: "Баталгаажуулалт" },
  { id: "documents", label: "Бичиг баримт" },
  { id: "security", label: "Аюулгүй байдал" },
];

const statusLabels: Record<VerificationStatus, string> = {
  verified: "Баталгаажсан",
  pending: "Хүсэлт илгээсэн",
  not_requested: "Хүсэлт өгөөгүй",
  rejected: "Татгалзсан",
};

const statusVariant: Record<
  VerificationStatus,
  "success" | "warning" | "secondary" | "danger"
> = {
  verified: "success",
  pending: "warning",
  not_requested: "secondary",
  rejected: "danger",
};

export default function ProfilePage() {
  const profile = mockProfile;
  const { showDialog } = useDialog();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");

  const verificationCounts = useMemo(
    () => ({
      verified: profile.verificationItems.filter(
        (item) => item.status === "verified",
      ).length,
      pending: profile.verificationItems.filter(
        (item) => item.status === "pending",
      ).length,
      notRequested: profile.verificationItems.filter(
        (item) => item.status === "not_requested",
      ).length,
      rejected: profile.verificationItems.filter(
        (item) => item.status === "rejected",
      ).length,
    }),
    [profile.verificationItems],
  );

  const requestVerification = (title = "Баталгаажуулалт") => {
    showDialog({
      title: `${title} хүсэлт илгээх үү?`,
      description:
        "Prototype үед хүсэлт local notification хэлбэрээр ажиллана. Backend үе дээр verification workflow үүснэ.",
      confirmLabel: "Хүсэлт илгээх",
      cancelLabel: "Буцах",
      onConfirm: () => showToast(`${title} хүсэлт илгээгдлээ.`, "success"),
    });
  };

  return (
    <PageContainer className="max-w-none bg-muted-background px-seek-4 py-seek-5 sm:px-seek-6">
      <div className="space-y-seek-5">
        <header className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">
              Миний профайл
            </h1>
            <Text variant="muted" className="mt-seek-2">
              Хувийн мэдээлэл, баталгаажуулалт, бичиг баримт болон аюулгүй
              байдлаа удирдана.
            </Text>
          </div>
          <div className="flex flex-wrap gap-seek-2">
            <Button type="button" variant="outline">
              Мэдээлэл засах
            </Button>
            <Button
              type="button"
              onClick={() => requestVerification("Профайл")}
            >
              + Баталгаажуулах хүсэлт
            </Button>
          </div>
        </header>

        <nav className="flex gap-seek-5 overflow-x-auto border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`shrink-0 border-b-2 px-seek-1 pb-seek-3 font-sans text-sm font-semibold transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "personal" && (
          <PersonalTab
            profile={profile}
            counts={verificationCounts}
            onRequest={requestVerification}
          />
        )}
        {activeTab === "employment" && (
          <EmploymentTab
            jobs={profile.employmentHistory}
            onRequest={requestVerification}
          />
        )}
        {activeTab === "affiliation" && (
          <AffiliationTab affiliations={profile.affiliations} />
        )}
        {activeTab === "verification" && (
          <VerificationTab
            profile={profile}
            counts={verificationCounts}
            onRequest={requestVerification}
          />
        )}
        {activeTab === "documents" && (
          <DocumentsTab
            documents={profile.documents}
            onRequest={requestVerification}
          />
        )}
        {activeTab === "security" && <SecurityTab profile={profile} />}
      </div>
    </PageContainer>
  );
}

function PersonalTab({
  profile,
  counts,
  onRequest,
}: {
  profile: ProfileMockData;
  counts: {
    verified: number;
    pending: number;
    notRequested: number;
    rejected: number;
  };
  onRequest: (title?: string) => void;
}) {
  const identity = profile.identity;

  return (
    <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.85fr)]">
      <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
        <div className="flex flex-col gap-seek-5 md:flex-row md:items-start">
          <div className="relative h-28 w-28 shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-violet-100 p-1">
            <div className="grid h-full w-full place-items-center rounded-full bg-surface font-sans text-3xl font-bold text-primary">
              БМ
            </div>
            <span className="absolute bottom-1 right-1 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface text-xs">
              ID
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-seek-3">
              <h2 className="font-sans text-2xl font-bold text-foreground">
                {identity.fullName}
              </h2>
              <Badge variant="success">ACTIVE</Badge>
            </div>
            <Text variant="muted" className="mt-seek-1">
              Бүртгэлийн дугаар: {identity.registryNumber}
            </Text>
            <div className="mt-seek-5 grid grid-cols-1 gap-seek-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoTile
                label="И-мэйл"
                value={identity.email}
                status="verified"
              />
              <InfoTile
                label="Утасны дугаар"
                value={identity.phone}
                status="verified"
              />
              <InfoTile label="Төрсөн огноо" value={identity.birthDate} />
              <InfoTile
                label="Иргэний үнэмлэх"
                value={identity.nationalId}
                status="pending"
              />
            </div>
          </div>
        </div>

        <dl className="mt-seek-6 grid grid-cols-1 gap-x-seek-6 gap-y-seek-3 sm:grid-cols-2">
          <ProfileField label="Хүйс" value={identity.gender} />
          <ProfileField label="Иргэншил" value={identity.citizenship} />
          <ProfileField label="Амьдарч буй улс" value={identity.country} />
          <ProfileField label="Хаяг" value={identity.address} />
          <ProfileField label="Боловсрол" value={identity.education} />
          <ProfileField label="Мэргэжил" value={identity.profession} />
          <ProfileField
            label="Ажил мэргэжлийн чиглэл"
            value={identity.workArea}
          />
          <ProfileField label="Platform role" value={identity.preferredRole} />
          <ProfileField
            label="Бүртгүүлсэн огноо"
            value={identity.registeredAt}
          />
          <ProfileField
            label="Сүүлд шинэчилсэн"
            value={identity.lastUpdatedAt}
          />
        </dl>

        <div className="mt-seek-6 flex flex-col gap-seek-3 rounded-seek-md border border-primary/20 bg-primary/5 p-seek-4 sm:flex-row sm:items-center sm:justify-between">
          <Text variant="muted" className="text-sm">
            Зарим мэдээлэл баталгаажаагүй байна. Баталгаажуулалт хийвэл
            платформын бүх боломжийг бүрэн ашиглах боломжтой.
          </Text>
          <Button
            type="button"
            variant="outline"
            onClick={() => onRequest("Профайл")}
          >
            Баталгаажуулах хүсэлт илгээх
          </Button>
        </div>
      </section>

      <div className="space-y-seek-5">
        <VerificationRequestCard
          items={profile.verificationItems}
          onRequest={onRequest}
        />
        <VerificationLevelCard
          level={profile.verificationLevel}
          counts={counts}
        />
      </div>
    </div>
  );
}

function InfoTile({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: VerificationStatus;
}) {
  return (
    <div className="rounded-seek-md border border-border bg-muted-background p-seek-3">
      <Text variant="muted" className="text-xs">
        {label}
      </Text>
      <p className="mt-seek-1 break-words font-sans text-sm font-semibold text-foreground">
        {value}
      </p>
      {status && (
        <Badge variant={statusVariant[status]} className="mt-seek-2">
          {statusLabels[status]}
        </Badge>
      )}
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[11rem_minmax(0,1fr)] gap-seek-3 text-sm">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}

function VerificationRequestCard({
  items,
  onRequest,
}: {
  items: VerificationItem[];
  onRequest: (title?: string) => void;
}) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
      <h2 className="font-sans text-xl font-bold text-foreground">
        Баталгаажуулалт хийх хүсэлт
      </h2>
      <Text variant="muted" className="mt-seek-2 text-sm">
        Системийн итгэлийн түвшин нэмэгдүүлэхийн тулд доорх баталгаажуулалтуудыг
        хүсэлт гаргана уу.
      </Text>
      <div className="mt-seek-5 space-y-seek-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-1 gap-seek-3 rounded-seek-md border border-border p-seek-3 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center"
          >
            <div>
              <p className="font-sans text-sm font-bold text-foreground">
                {item.title}
              </p>
              <Text variant="muted" className="text-xs">
                {item.description}
              </Text>
            </div>
            <Badge variant={statusVariant[item.status]}>
              {statusLabels[item.status]}
            </Badge>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={item.status === "verified" || item.status === "pending"}
              onClick={() => onRequest(item.title)}
            >
              Хүсэлт илгээх
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}

function VerificationLevelCard({
  level,
  counts,
}: {
  level: number;
  counts: {
    verified: number;
    pending: number;
    notRequested: number;
    rejected: number;
  };
}) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
      <h2 className="font-sans text-xl font-bold text-foreground">
        Баталгаажуулалтын түвшин
      </h2>
      <div className="mt-seek-5 grid grid-cols-1 gap-seek-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center">
        <div
          className="grid h-36 w-36 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#22c55e 0 ${level}%, #f97316 ${level}% 70%, #e5e7eb 70% 100%)`,
          }}
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-surface text-center">
            <div>
              <p className="font-sans text-3xl font-bold text-foreground">
                {level}%
              </p>
              <Text variant="muted" className="text-xs">
                Дутуу түвшин
              </Text>
            </div>
          </div>
        </div>
        <div className="space-y-seek-2 text-sm">
          <LegendDot
            color="bg-success"
            label={`Баталгаажсан (${counts.verified})`}
          />
          <LegendDot
            color="bg-primary"
            label={`Хүсэлт илгээсэн (${counts.pending})`}
          />
          <LegendDot
            color="bg-warning"
            label={`Хүсэлт өгөөгүй (${counts.notRequested})`}
          />
          <LegendDot
            color="bg-danger"
            label={`Татгалзсан (${counts.rejected})`}
          />
        </div>
      </div>
      <div className="mt-seek-5 rounded-seek-md bg-violet-50 p-seek-4 dark:bg-violet-950">
        <p className="font-sans text-sm font-bold text-violet-700 dark:text-violet-200">
          Дараагийн түвшин рүү ахихын тулд
        </p>
        <ul className="mt-seek-3 space-y-seek-2 text-sm text-foreground">
          <li>✓ Хувийн мэдээлэл баталгаажуулах</li>
          <li>✓ Албан тушаал баталгаажуулах</li>
          <li>✓ Байгууллагын харьяалал баталгаажуулах</li>
        </ul>
      </div>
    </section>
  );
}

function EmploymentTab({
  jobs,
  onRequest,
}: {
  jobs: EmploymentHistoryItem[];
  onRequest: (title?: string) => void;
}) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
      <div className="flex flex-col gap-seek-3 border-b border-border px-seek-5 py-seek-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-bold text-foreground">
            Албан тушаалын түүх
          </h2>
          <Text variant="muted" className="mt-seek-1 text-sm">
            Өмнөх болон одоогийн албан тушаалууд. Одоогийнх нь ACTIVE төлөвтэй
            байна.
          </Text>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => onRequest("Албан тушаал")}
        >
          + Албан тушаал нэмэх
        </Button>
      </div>
      <ResponsiveTable
        headers={["Албан тушаал", "Байгууллага", "Эхэлсэн", "Дууссан", "Төлөв"]}
        rows={jobs.map((job) => [
          job.position,
          job.organisation,
          job.startDate,
          job.endDate,
          <StatusBadge key={job.id} status={job.status} />,
        ])}
      />
    </section>
  );
}

function AffiliationTab({ affiliations }: { affiliations: AffiliationItem[] }) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
      <div className="border-b border-border px-seek-5 py-seek-4">
        <h2 className="font-sans text-xl font-bold text-foreground">
          Байгууллагын харьяалал
        </h2>
        <Text variant="muted" className="mt-seek-1 text-sm">
          Аль байгууллагын өмнөөс үнэлгээ өгөх, харах, удирдах эрхтэйг
          тодорхойлно.
        </Text>
      </div>
      <ResponsiveTable
        headers={["Байгууллага", "Нэгж", "Role", "Баталгаажуулсан", "Төлөв"]}
        rows={affiliations.map((item) => [
          item.organisation,
          item.unit,
          item.role,
          item.verifiedBy,
          <StatusBadge key={item.id} status={item.status} />,
        ])}
      />
    </section>
  );
}

function VerificationTab({
  profile,
  counts,
  onRequest,
}: {
  profile: ProfileMockData;
  counts: {
    verified: number;
    pending: number;
    notRequested: number;
    rejected: number;
  };
  onRequest: (title?: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <VerificationRequestCard
        items={profile.verificationItems}
        onRequest={onRequest}
      />
      <VerificationLevelCard
        level={profile.verificationLevel}
        counts={counts}
      />
    </div>
  );
}

function DocumentsTab({
  documents,
  onRequest,
}: {
  documents: DocumentItem[];
  onRequest: (title?: string) => void;
}) {
  return (
    <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
      <div className="flex flex-col gap-seek-3 border-b border-border px-seek-5 py-seek-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-bold text-foreground">
            Бичиг баримт
          </h2>
          <Text variant="muted" className="mt-seek-1 text-sm">
            Identity, diploma, employment proof болон assessor credential
            файлууд.
          </Text>
        </div>
        <Button type="button" onClick={() => onRequest("Бичиг баримт")}>
          + Файл нэмэх
        </Button>
      </div>
      <ResponsiveTable
        headers={["Нэр", "Төрөл", "Огноо", "Дуусах", "Хандалт", "Төлөв"]}
        rows={documents.map((doc) => [
          doc.name,
          doc.type,
          doc.uploadedAt,
          doc.expiryDate,
          doc.visibility,
          <Badge key={doc.id} variant={statusVariant[doc.status]}>
            {statusLabels[doc.status]}
          </Badge>,
        ])}
      />
    </section>
  );
}

function SecurityTab({ profile }: { profile: ProfileMockData }) {
  return (
    <div className="grid grid-cols-1 gap-seek-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
        <h2 className="font-sans text-xl font-bold text-foreground">
          Account Security
        </h2>
        <div className="mt-seek-5 grid grid-cols-1 gap-seek-3 md:grid-cols-2">
          <SecurityTile
            title="Нууц үг"
            value={`Сүүлд шинэчилсэн: ${profile.security.passwordUpdatedAt}`}
            action="Нууц үг солих"
          />
          <SecurityTile
            title="MFA / 2FA"
            value={profile.security.mfaEnabled ? "Идэвхтэй" : "Идэвхгүй"}
            action="Идэвхжүүлэх"
          />
        </div>
        <div className="mt-seek-6">
          <h3 className="font-sans text-base font-bold text-foreground">
            Active sessions
          </h3>
          <div className="mt-seek-3 space-y-seek-3">
            {profile.security.sessions.map((session) => (
              <div
                key={session.id}
                className="flex flex-col gap-seek-2 rounded-seek-md border border-border p-seek-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-sans text-sm font-bold text-foreground">
                    {session.device}
                  </p>
                  <Text variant="muted" className="text-xs">
                    {session.location} · {session.lastActiveAt}
                  </Text>
                </div>
                {session.current ? (
                  <Badge variant="success">Current</Badge>
                ) : (
                  <Button type="button" variant="outline" size="sm">
                    Logout
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
        <h2 className="font-sans text-xl font-bold text-foreground">
          Security checklist
        </h2>
        <ul className="mt-seek-4 space-y-seek-3 text-sm text-foreground">
          <li>✓ Email баталгаажсан</li>
          <li>✓ Phone баталгаажсан</li>
          <li>□ MFA идэвхжүүлэх</li>
          <li>□ Trusted device policy тохируулах</li>
        </ul>
        <Button type="button" variant="outline" className="mt-seek-5 w-full">
          Logout all devices
        </Button>
      </section>
    </div>
  );
}

function SecurityTile({
  title,
  value,
  action,
}: {
  title: string;
  value: string;
  action: string;
}) {
  return (
    <div className="rounded-seek-md border border-border bg-muted-background p-seek-4">
      <p className="font-sans text-base font-bold text-foreground">{title}</p>
      <Text variant="muted" className="mt-seek-1 text-sm">
        {value}
      </Text>
      <Button type="button" variant="outline" size="sm" className="mt-seek-4">
        {action}
      </Button>
    </div>
  );
}

function StatusBadge({ status }: { status: "active" | "expired" | "pending" }) {
  const variant =
    status === "active"
      ? "success"
      : status === "pending"
        ? "warning"
        : "secondary";
  const label =
    status === "active"
      ? "ACTIVE"
      : status === "pending"
        ? "PENDING"
        : "EXPIRED";

  return <Badge variant={variant}>{label}</Badge>;
}

function ResponsiveTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted-foreground">
            {headers.map((header) => (
              <th key={header} className="px-seek-5 py-seek-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border last:border-b-0"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className="px-seek-5 py-seek-4 text-sm text-foreground"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-seek-2">
      <span className={`h-3 w-3 rounded-full ${color}`} />
      <span>{label}</span>
    </div>
  );
}
