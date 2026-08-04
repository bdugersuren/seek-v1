"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, PageContainer, Text, useToast } from "@seek/ui";
import type { ProfileVerificationResponse } from "@seek/contracts";
import {
  approveVerification,
  getAdminVerifications,
  rejectVerification,
} from "@/features/profile/api";

const trackedStatuses = ["SUBMITTED", "VERIFIED", "REJECTED"] as const;

export default function SuperAdminProfilePage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<ProfileVerificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const counts = useMemo(() => {
    return trackedStatuses.reduce<Record<string, number>>((acc, status) => {
      acc[status] = items.filter((item) => item.status === status).length;
      return acc;
    }, {});
  }, [items]);

  const submittedItems = useMemo(
    () => items.filter((item) => item.status === "SUBMITTED"),
    [items],
  );

  const loadOverview = async () => {
    setLoading(true);
    try {
      const groups = await Promise.all(trackedStatuses.map((status) => getAdminVerifications(status)));
      setItems(groups.flat());
    } catch (err: any) {
      showToast(err.message || "Verification overview уншихад алдаа гарлаа.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      await approveVerification(id);
      showToast("Хүсэлт зөвшөөрөгдлөө.", "success");
      loadOverview();
    } catch (err: any) {
      showToast(err.message || "Зөвшөөрөхөд алдаа гарлаа.", "danger");
    } finally {
      setActionId(null);
    }
  };

  const openReject = (id: string) => {
    setRejectId(id);
    setRejectReason("");
  };

  const handleReject = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!rejectId) return;
    const reason = rejectReason.trim();
    if (!reason) {
      showToast("Татгалзсан шалтгаан оруулна уу.", "warning");
      return;
    }

    setActionId(rejectId);
    try {
      await rejectVerification(rejectId, reason);
      showToast("Хүсэлт татгалзагдлаа.", "success");
      setRejectId(null);
      setRejectReason("");
      loadOverview();
    } catch (err: any) {
      showToast(err.message || "Татгалзахад алдаа гарлаа.", "danger");
    } finally {
      setActionId(null);
    }
  };

  return (
    <PageContainer className="max-w-none bg-muted-background px-seek-4 py-seek-5 sm:px-seek-6">
      <div className="space-y-seek-5">
        <header className="flex flex-col gap-seek-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-sans text-3xl font-bold text-foreground">
              Profile operations
            </h1>
            <Text variant="muted" className="mt-seek-2">
              Verification backlog, KYC үр дүн, reviewer workflow-ийн товч хяналт.
            </Text>
          </div>
          <Button type="button" variant="outline" disabled={loading} onClick={loadOverview}>
            Шинэчлэх
          </Button>
        </header>

        <section className="grid grid-cols-1 gap-seek-4 md:grid-cols-3">
          <SummaryTile label="Хүлээгдэж буй" value={counts.SUBMITTED || 0} tone="warning" />
          <SummaryTile label="Баталгаажсан" value={counts.VERIFIED || 0} tone="success" />
          <SummaryTile label="Татгалзсан" value={counts.REJECTED || 0} tone="danger" />
        </section>

        <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
          <div className="border-b border-border px-seek-5 py-seek-4">
            <h2 className="font-sans text-xl font-bold text-foreground">
              Шуурхай хяналт
            </h2>
            <Text variant="muted" className="mt-seek-1 text-sm">
              Хүлээгдэж буй verification хүсэлтүүд.
            </Text>
          </div>

          {loading ? (
            <div className="p-seek-6 text-center text-sm text-muted-foreground">Уншиж байна...</div>
          ) : submittedItems.length === 0 ? (
            <div className="p-seek-6 text-center text-sm text-muted-foreground">Хүлээгдэж буй хүсэлт алга.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="px-seek-5 py-seek-3 font-medium">Төрөл</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Profile ID</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Илгээсэн</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {submittedItems.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-b-0">
                      <td className="px-seek-5 py-seek-4 text-sm font-semibold text-foreground">{item.type}</td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">{item.profileId}</td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className="px-seek-5 py-seek-4">
                        <div className="flex gap-seek-2">
                          <Button type="button" size="sm" disabled={actionId === item.id} onClick={() => handleApprove(item.id)}>
                            Зөвшөөрөх
                          </Button>
                          <Button type="button" variant="outline" size="sm" disabled={actionId === item.id} onClick={() => openReject(item.id)}>
                            Татгалзах
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-seek-lg border border-border bg-surface p-seek-6 shadow-seek-lg">
            <h3 className="mb-seek-2 font-sans text-xl font-bold text-foreground">
              Verification татгалзах
            </h3>
            <Text variant="muted" className="mb-seek-4 text-xs">
              Audit trail болон хэрэглэгчийн засварлах дараагийн алхамд ашиглагдах шалтгаан.
            </Text>
            <form onSubmit={handleReject} className="space-y-seek-4">
              <label className="block space-y-seek-1">
                <span className="text-xs font-semibold text-foreground">Шалтгаан*</span>
                <textarea
                  required
                  value={rejectReason}
                  className="min-h-28 w-full rounded-seek-md border border-border bg-surface px-seek-3 py-seek-2 text-sm text-foreground focus:outline-none"
                  onChange={(event) => setRejectReason(event.target.value)}
                />
              </label>
              <div className="mt-seek-6 flex justify-end gap-seek-2">
                <Button type="button" variant="outline" disabled={Boolean(actionId)} onClick={() => setRejectId(null)}>
                  Болих
                </Button>
                <Button type="submit" disabled={Boolean(actionId)}>
                  {actionId ? "Илгээж байна..." : "Татгалзах"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "success" | "warning" | "danger";
}) {
  return (
    <div className="rounded-seek-lg border border-border bg-surface p-seek-5 shadow-seek-sm">
      <Text variant="muted" className="text-xs">{label}</Text>
      <div className="mt-seek-3 flex items-center gap-seek-3">
        <p className="font-sans text-3xl font-bold text-foreground">{value}</p>
        <Badge variant={tone}>{label}</Badge>
      </div>
    </div>
  );
}
