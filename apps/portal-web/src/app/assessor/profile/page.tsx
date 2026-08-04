"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, PageContainer, Text, useToast } from "@seek/ui";
import type {
  CandidateProfileResponse,
  ProfileDocumentResponse,
  ProfileVerificationResponse,
} from "@seek/contracts";
import {
  getCandidateProfile,
  getDocuments,
  getVerifications,
  sendPhoneOtp,
} from "@/features/profile/api";

const statusLabels: Record<string, string> = {
  VERIFIED: "Баталгаажсан",
  SUBMITTED: "Хянагдаж байна",
  REJECTED: "Татгалзсан",
  EXPIRED: "Хугацаа дууссан",
};

const statusVariant: Record<string, "success" | "warning" | "secondary" | "danger"> = {
  VERIFIED: "success",
  SUBMITTED: "warning",
  REJECTED: "danger",
  EXPIRED: "secondary",
};

export default function AssessorProfilePage() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState<CandidateProfileResponse | null>(null);
  const [verifications, setVerifications] = useState<ProfileVerificationResponse[]>([]);
  const [documents, setDocuments] = useState<ProfileDocumentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingOtp, setSendingOtp] = useState(false);

  const assessorVerification = useMemo(
    () => verifications.find((item) => item.type === "ASSESSOR"),
    [verifications],
  );

  const identityVerification = useMemo(
    () => verifications.find((item) => item.type === "IDENTITY"),
    [verifications],
  );

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [profileData, verificationData, documentData] = await Promise.all([
        getCandidateProfile(),
        getVerifications(),
        getDocuments(),
      ]);
      setProfile(profileData);
      setVerifications(verificationData);
      setDocuments(documentData);
    } catch (err: any) {
      showToast(err.message || "Профайл мэдээлэл уншихад алдаа гарлаа.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSendOtp = async () => {
    if (!profile?.phoneNumber) {
      showToast("Эхлээд /profile дээр утасны дугаараа хадгална уу.", "warning");
      return;
    }
    setSendingOtp(true);
    try {
      await sendPhoneOtp(profile.phoneNumber);
      showToast("Баталгаажуулах код илгээгдлээ. Candidate profile дээр кодоо оруулна уу.", "success");
    } catch (err: any) {
      showToast(err.message || "OTP илгээхэд алдаа гарлаа.", "danger");
    } finally {
      setSendingOtp(false);
    }
  };

  if (loading) {
    return (
      <PageContainer className="py-12 text-center">
        <Text>Уншиж байна...</Text>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-none bg-muted-background px-seek-4 py-seek-5 sm:px-seek-6">
      <div className="space-y-seek-5">
        <header className="flex flex-col gap-seek-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">
              Үнэлэгчийн профайл
            </h1>
            <Text variant="muted" className="mt-seek-2">
              Үнэлгээ зохиох, хянах эрхтэй холбоотой readiness болон баталгаажуулалтын төлөв.
            </Text>
          </div>
          <Button type="button" variant="outline" onClick={loadProfile}>
            Шинэчлэх
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-seek-4 lg:grid-cols-4">
          <MetricTile label="Профайл" value={profile?.isComplete ? "Бэлэн" : "Дутуу"} tone={profile?.isComplete ? "success" : "warning"} />
          <MetricTile label="Утас" value={profile?.phoneNumberVerifiedAt ? "Баталгаажсан" : "Шаардлагатай"} tone={profile?.phoneNumberVerifiedAt ? "success" : "warning"} />
          <MetricTile label="Identity" value={identityVerification?.status ? statusLabels[identityVerification.status] || identityVerification.status : "Хүсэлтгүй"} tone={identityVerification?.status === "VERIFIED" ? "success" : "secondary"} />
          <MetricTile label="Assessor" value={assessorVerification?.status ? statusLabels[assessorVerification.status] || assessorVerification.status : "Хүсэлтгүй"} tone={assessorVerification?.status === "VERIFIED" ? "success" : "warning"} />
        </section>

        <section className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
          <div className="flex flex-col gap-seek-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="font-sans text-xl font-bold text-foreground">
                Үндсэн мэдээлэл
              </h2>
              <div className="mt-seek-4 grid grid-cols-1 gap-seek-3 sm:grid-cols-2">
                <InfoRow label="Нэр" value={profile?.displayName || "-"} />
                <InfoRow label="Байгууллага" value={profile?.organisation || "-"} />
                <InfoRow label="Утас" value={profile?.phoneNumber || "-"} />
                <InfoRow label="Сонгосон хэл" value={profile?.preferredLanguage || "-"} />
              </div>
            </div>
            {!profile?.phoneNumberVerifiedAt && (
              <Button type="button" disabled={sendingOtp} onClick={handleSendOtp}>
                {sendingOtp ? "Илгээж байна..." : "Утас баталгаажуулах"}
              </Button>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-seek-5 xl:grid-cols-2">
          <div className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
            <h2 className="font-sans text-xl font-bold text-foreground">
              Баталгаажуулалт
            </h2>
            <div className="mt-seek-4 space-y-seek-3">
              {verifications.length === 0 ? (
                <Text variant="muted" className="text-sm">Одоогоор хүсэлт алга.</Text>
              ) : (
                verifications.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border py-seek-3 last:border-b-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.type}</p>
                      <Text variant="muted" className="text-xs">{new Date(item.createdAt).toLocaleString()}</Text>
                    </div>
                    <Badge variant={statusVariant[item.status] || "secondary"}>
                      {statusLabels[item.status] || item.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
            <h2 className="font-sans text-xl font-bold text-foreground">
              Баримт бичиг
            </h2>
            <div className="mt-seek-4 space-y-seek-3">
              {documents.length === 0 ? (
                <Text variant="muted" className="text-sm">Бүртгэлтэй файл алга.</Text>
              ) : (
                documents.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b border-border py-seek-3 last:border-b-0">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.name}</p>
                      <Text variant="muted" className="text-xs">{item.type}</Text>
                    </div>
                    <Badge variant="secondary">{(item.sizeBytes / (1024 * 1024)).toFixed(2)} MB</Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </PageContainer>
  );
}

function MetricTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "secondary";
}) {
  return (
    <div className="rounded-seek-lg border border-border bg-surface p-seek-4 shadow-seek-sm">
      <Text variant="muted" className="text-xs">{label}</Text>
      <div className="mt-seek-2">
        <Badge variant={tone}>{value}</Badge>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text variant="muted" className="text-xs">{label}</Text>
      <p className="mt-seek-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
