"use client";

import { useEffect, useMemo, useState } from "react";
import { Badge, Button, PageContainer, Text, useToast } from "@seek/ui";
import type { ProfileVerificationResponse } from "@seek/contracts";
import {
  approveVerification,
  getAdminVerifications,
  rejectVerification,
} from "@/features/profile/api";

const statusOptions = ["SUBMITTED", "VERIFIED", "REJECTED", "EXPIRED"] as const;

const statusLabels: Record<string, string> = {
  SUBMITTED: "Хянагдаж байна",
  VERIFIED: "Баталгаажсан",
  REJECTED: "Татгалзсан",
  EXPIRED: "Хугацаа дууссан",
};

const statusVariant: Record<string, "success" | "warning" | "secondary" | "danger"> = {
  SUBMITTED: "warning",
  VERIFIED: "success",
  REJECTED: "danger",
  EXPIRED: "secondary",
};

export default function AdminProfilePage() {
  const { showToast } = useToast();
  const [status, setStatus] = useState<string>("SUBMITTED");
  const [items, setItems] = useState<ProfileVerificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const pendingCount = useMemo(
    () => items.filter((item) => item.status === "SUBMITTED").length,
    [items],
  );

  const loadQueue = async () => {
    setLoading(true);
    try {
      const data = await getAdminVerifications(status);
      setItems(data);
    } catch (err: any) {
      showToast(err.message || "Баталгаажуулалтын жагсаалт уншихад алдаа гарлаа.", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
  }, [status]);

  const handleApprove = async (id: string) => {
    setActionId(id);
    try {
      await approveVerification(id);
      showToast("Баталгаажуулалт зөвшөөрөгдлөө.", "success");
      loadQueue();
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

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId) return;
    const reason = rejectReason.trim();
    if (!reason) {
      showToast("Татгалзсан шалтгаан оруулна уу.", "warning");
      return;
    }

    setActionId(rejectId);
    try {
      await rejectVerification(rejectId, reason);
      showToast("Баталгаажуулалт татгалзагдлаа.", "success");
      setRejectId(null);
      setRejectReason("");
      loadQueue();
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
              Баталгаажуулалтын queue
            </h1>
            <Text variant="muted" className="mt-seek-2">
              Profile verification хүсэлтүүдийг хянаж зөвшөөрөх эсвэл татгалзана.
            </Text>
          </div>
          <div className="flex items-center gap-seek-3">
            <Badge variant={pendingCount > 0 ? "warning" : "secondary"}>
              {pendingCount} хүлээгдэж байна
            </Badge>
            <Button type="button" variant="outline" onClick={loadQueue} disabled={loading}>
              Шинэчлэх
            </Button>
          </div>
        </header>

        <section className="rounded-seek-lg border border-border bg-surface shadow-seek-sm">
          <div className="flex flex-col gap-seek-3 border-b border-border px-seek-5 py-seek-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-seek-2">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`rounded-seek-md border px-seek-3 py-seek-2 text-sm font-semibold ${
                    status === option
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-surface text-foreground"
                  }`}
                  onClick={() => setStatus(option)}
                >
                  {statusLabels[option]}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-seek-6 text-center text-sm text-muted-foreground">
              Уншиж байна...
            </div>
          ) : items.length === 0 ? (
            <div className="p-seek-6 text-center text-sm text-muted-foreground">
              Энэ төлөвтэй хүсэлт алга.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[56rem] border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted-foreground">
                    <th className="px-seek-5 py-seek-3 font-medium">Төрөл</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Profile ID</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Төлөв</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Огноо</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Тайлбар</th>
                    <th className="px-seek-5 py-seek-3 font-medium">Үйлдэл</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border last:border-b-0">
                      <td className="px-seek-5 py-seek-4 text-sm font-semibold text-foreground">
                        {item.type}
                      </td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                        {item.profileId}
                      </td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                        <Badge variant={statusVariant[item.status] || "secondary"}>
                          {statusLabels[item.status] || item.status}
                        </Badge>
                      </td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                        {item.rejectedReason || "-"}
                      </td>
                      <td className="px-seek-5 py-seek-4 text-sm text-foreground">
                        <div className="flex gap-seek-2">
                          <Button
                            type="button"
                            size="sm"
                            disabled={item.status !== "SUBMITTED" || actionId === item.id}
                            onClick={() => handleApprove(item.id)}
                          >
                            Зөвшөөрөх
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={item.status !== "SUBMITTED" || actionId === item.id}
                            onClick={() => openReject(item.id)}
                          >
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
              Баталгаажуулалт татгалзах
            </h3>
            <Text variant="muted" className="mb-seek-4 text-xs">
              Хэрэглэгч дахин засах боломжтой ойлгомжтой шалтгаан оруулна уу.
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
