"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@seek/ui";
import { BlueprintDialog, PoolPreview, bpInput } from "./BlueprintUI";
import { requestAssessmentJson } from "./api";
export function QuizCreateDialog({
  blueprint,
  onClose,
}: {
  blueprint: any;
  onClose: () => void;
}) {
  const router = useRouter(),
    pending = useRef(false),
    request = useRef({ key: "", id: "" });
  const [form, setForm] = useState({
    title: blueprint.title,
    description: "",
    durationMinutes: blueprint.totalDurationMinutes,
    passingScore: blueprint.passScore,
    maxAttempts: 1,
  });
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    const payload = {
      ...form,
      blueprintId: blueprint.id,
      expectedBlueprintVersion: blueprint.version,
    };
    const key = JSON.stringify(payload);
    if (request.current.key !== key)
      request.current = { key, id: crypto.randomUUID() };
    try {
      const q = await requestAssessmentJson<any>("/api/v1/assessment/quizzes", {
        method: "POST",
        body: JSON.stringify({ ...payload, requestId: request.current.id }),
      });
      router.push("/assessor/quizzes/" + q.id);
    } catch (e: any) {
      setError(e.message);
      pending.current = false;
      setBusy(false);
    }
  }
  return (
    <BlueprintDialog
      title="Quiz ноорог үүсгэх"
      onClose={() => {
        if (!busy) onClose();
      }}
    >
      <p className="mb-4 text-sm">
        Blueprint: {blueprint.title} · v{blueprint.version}. Асуултууд нэг удаа
        сонгогдож хувилбарт хадгалагдана.
      </p>
      <PoolPreview result={blueprint.readiness} />
      <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <label>
          Quiz нэр
          <input
            className={bpInput}
            required
            maxLength={300}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </label>
        <label>
          Тайлбар
          <textarea
                aria-label="Тайлбар"
            className={bpInput}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </label>
        {(
          [
            ["durationMinutes", "Хугацаа (минут)", 1, 1440],
            ["passingScore", "Тэнцэх босго (%)", 0, 100],
            ["maxAttempts", "Оролдлогын тоо", 1, 1000],
          ] as const
        ).map(([field, label, min, max]) => (
          <label key={field}>
            {label}
            <input
              className={bpInput}
              type="number"
              min={min}
              max={max}
              step={field === "passingScore" ? "0.01" : "1"}
              required
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: Number(e.target.value) })
              }
            />
          </label>
        ))}
        {error && (
          <p role="alert" className="text-red-700 sm:col-span-2">
            {error}
          </p>
        )}
        <div className="sm:col-span-2">
          <Button
            type="submit"
            disabled={busy || blueprint.readiness?.status !== "READY"}
          >
            {busy ? "Үүсгэж байна…" : "Ноорог үүсгээд нээх"}
          </Button>
        </div>
      </form>
    </BlueprintDialog>
  );
}
