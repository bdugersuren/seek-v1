"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@seek/ui";
import { BlueprintDialog, PoolPreview, bpInput, bpPanel } from "./BlueprintUI";
import { getBlueprintByIdAsync } from "./api";
import { QuizQuestion } from "./QuizQuestion";
import { quizApi, quizLifecycle, quizStatus, quizAction } from "./quiz-api";
export function QuizEditor({
  id,
  admin = false,
}: {
  id: string;
  admin?: boolean;
}) {
  const router = useRouter(),
    search = useSearchParams(),
    revisionId = search.get("revisionId") || "",
    pending = useRef(false),
    saved = useRef(""),
    requests = useRef(new Map<string, string>());
  const [q, setQ] = useState<any>(null),
    [form, setForm] = useState<any>({}),
    [tab, setTab] = useState(0),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [reload, setReload] = useState(0),
    [preview, setPreview] = useState(false),
    [pool, setPool] = useState<any>(null),
    [selection, setSelection] = useState<any>(null),
    [overrides, setOverrides] = useState<any[]>([]),
    [workflow, setWorkflow] = useState(""),
    [comment, setComment] = useState("");
  const overrideDirty =
    !!q &&
    JSON.stringify(overrides) !==
      JSON.stringify(q.selectedRevision.runtimePolicy?.questionOverrides || []);
  const dirty =
    !!q && (JSON.stringify(form) !== saved.current || overrideDirty);
  function accept(value: any) {
    setQ(value);
    const r = value.selectedRevision;
    const f = {
      title: r.title,
      description: r.description || "",
      durationMinutes: r.durationMinutes,
      passingScore: Number(r.passingScore),
      maxAttempts: r.maxAttempts,
    };
    setForm(f);
    saved.current = JSON.stringify(f);
    setOverrides(r.runtimePolicy?.questionOverrides || []);
    setSelection(null);
  }
  useEffect(() => {
    let live = true;
    setQ(null);
    setError("");
    quizApi(
      "/" +
        encodeURIComponent(id) +
        (revisionId ? "?revisionId=" + encodeURIComponent(revisionId) : ""),
    )
      .then((v) => {
        if (live) accept(v);
      })
      .catch((e) => {
        if (live)
          setError(
            e.status === 403
              ? "Энэ Quiz-д хандах эрхгүй."
              : e.status === 404
                ? "Quiz эсвэл хувилбар олдсонгүй."
                : e.message,
          );
      });
    return () => {
      live = false;
    };
  }, [id, revisionId, reload]);
  useEffect(() => {
    if (!dirty) return;
    const unload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    const click = (e: MouseEvent) => {
      if (
        (e.target as HTMLElement).closest("a[href]") &&
        !window.confirm("Хадгалаагүй өөрчлөлтөө орхих уу?")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", click, true);
    };
  }, [dirty]);
  async function act(action: string) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const base = {
        quizRevisionId: q.selectedRevision.id,
        expectedVersion: q.version,
      };
      let value;
      if (action === "save" && overrideDirty)
        throw Error(
          "Override өөрчлөлтөө дахин бүрдүүлэх үйлдлээр хадгалах эсвэл өмнөх сонголтод буцаана уу.",
        );
      if (action === "save" || action === "reselect") {
        value = await quizApi("/" + id, "PUT", {
          ...base,
          ...form,
          ...(action === "reselect"
            ? { reselectQuestions: true, questionOverrides: overrides }
            : {}),
        });
      } else if (action === "preview") {
        setSelection(
          await quizApi("/" + id + "/preview", "POST", {
            ...base,
            questionOverrides: overrides,
          }),
        );
        return;
      } else if (action === "new_revision") {
        value = await quizApi("/" + id + "/revisions", "POST", base);
        router.replace((admin ? "/admin/quizzes/" : "/assessor/quizzes/") + id);
      } else {
        if (dirty) throw Error("Эхлээд өөрчлөлтөө хадгална уу.");
        const payload = { ...base, action, comment };
        const key = JSON.stringify(payload);
        if (!requests.current.has(key))
          requests.current.set(key, crypto.randomUUID());
        value = await quizApi("/" + id + "/workflow", "POST", {
          ...payload,
          requestId: requests.current.get(key),
        });
        setWorkflow("");
        setComment("");
      }
      accept(value);
      setNotice(
        action === "save"
          ? "Хадгалагдлаа."
          : action === "reselect"
            ? "Асуултууд дахин бүрдлээ."
            : "Үйлдэл амжилттай.",
      );
    } catch (e: any) {
      setError(
        e.message +
          (e.issues
            ? " " +
              e.issues
                .map((x: any) => (typeof x === "string" ? x : x.message))
                .join(" ")
            : ""),
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  async function openPool() {
    setError("");
    try {
      const b = await getBlueprintByIdAsync(q.templateId);
      if (!b) throw Error("Blueprint олдсонгүй.");
      setPool(b.readiness);
    } catch (e: any) {
      setError(e.message);
    }
  }
  if (!q)
    return (
      <main className="p-6">
        {error ? (
          <>
            <p role="alert">{error}</p>
            <Button onClick={() => setReload((x) => x + 1)}>
              Дахин оролдох
            </Button>
          </>
        ) : (
          <p role="status">Quiz ачаалж байна…</p>
        )}
      </main>
    );
  const r = q.selectedRevision,
    actions = q.allowedActions || [],
    editable = actions.includes("save");
  let index = 0;
  return (
    <main className="mx-auto min-w-0 max-w-6xl space-y-5 p-4 sm:p-6">
      <header className={bpPanel}>
        <Link
          href={
            admin
              ? "/admin/quizzes"
              : q.template.assessmentContextId
                ? `/assessor/context/${q.template.assessmentContextId}/quizzes`
                : "/assessor/quizzes"
          }
          className="text-primary"
        >
          ← Quiz жагсаалт
        </Link>
        <h1 className="mt-3 break-words text-2xl font-bold">{r.title}</h1>
        <p className="mt-2 text-sm">
          {quizStatus[r.revisionStatus]} · v{r.revisionNumber} ·{" "}
          {quizLifecycle[q.lifecycleStatus] || q.lifecycleStatus} · Засварын
          хувилбар {q.version}
        </p>
        <p className="mt-2 text-sm">
          Нийтэлсэн:{" "}
          {q.currentPublishedRevision
            ? `v${q.currentPublishedRevision.revisionNumber}`
            : "Байхгүй"}{" "}
          · Blueprint:{" "}
          <Link
            className="text-primary"
            href={`/assessor/context/${q.template.assessmentContextId}/blueprints/${q.templateId}`}
          >
            {q.template.name}
          </Link>
        </p>
        <label className="mt-3 block text-sm">
          Quiz хувилбар
          <select
            aria-label="Quiz хувилбар"
            className={bpInput}
            value={r.id}
            onChange={(e) => {
              if (!dirty || window.confirm("Хадгалаагүй өөрчлөлтөө орхих уу?"))
                router.push(
                  (admin ? "/admin/quizzes/" : "/assessor/quizzes/") +
                    id +
                    "?revisionId=" +
                    e.target.value,
                );
            }}
          >
            {q.revisions.map((v: any) => (
              <option key={v.id} value={v.id}>
                v{v.revisionNumber} · {quizStatus[v.revisionStatus]}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-4 flex flex-wrap gap-2">
          {editable && (
            <Button disabled={busy} onClick={() => act("save")}>
              Хадгалах
            </Button>
          )}
          <Button variant="outline" onClick={() => setPreview(true)}>
            Шалгуулагчийн харагдац
          </Button>
          {actions.includes("new_revision") && (
            <Button disabled={busy} onClick={() => act("new_revision")}>
              Шинэ ноорог хувилбар
            </Button>
          )}
        </div>
      </header>
      {error && (
        <p
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-4 text-red-800"
        >
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="rounded bg-emerald-50 p-4 text-emerald-900">
          {notice}
        </p>
      )}
      <nav
        aria-label="Quiz editor хэсгүүд"
        className="flex gap-2 overflow-x-auto"
      >
        {["Ерөнхий", "Асуулт ба оноо", "Шалгах ба нийтлэх"].map((label, i) => (
          <Button
            key={label}
            variant={tab === i ? "primary" : "outline"}
            onClick={() => setTab(i)}
          >
            {i + 1}. {label}
          </Button>
        ))}
      </nav>
      {tab === 0 && (
        <section className={bpPanel}>
          <fieldset
            disabled={!editable || busy}
            className="grid gap-4 sm:grid-cols-2"
          >
            <label>
              Quiz нэр
              <input
                className={bpInput}
                value={form.title}
                maxLength={300}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label>
              Тайлбар
              <textarea
                aria-label="Тайлбар"
                className={bpInput}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
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
                  value={form[field]}
                  onChange={(e) =>
                    setForm({ ...form, [field]: Number(e.target.value) })
                  }
                />
              </label>
            ))}
          </fieldset>
          <p className="mt-4 text-sm text-muted-foreground">
            Хуваарь, хандалт болон оролцогч оноолтыг админ нийтэлсэн хувилбарт
            тусад нь тохируулна.
          </p>
        </section>
      )}
      {tab === 1 && (
        <section className="space-y-4">
          <div className={bpPanel}>
            <b>
              Хадгалсан бүрэлдэхүүн · {r.totalQuestionCount} асуулт ·{" "}
              {Number(r.totalMaxScore)} оноо
            </b>
            <p className="mt-2 text-sm">
              Хэсэг, авах тоо, оноог Blueprint-ээс өвлөсөн. Дахин бүрдүүлэхээс
              бусад засвар асуултуудыг солихгүй.
            </p>
            {editable && (
              <Button className="mt-3" variant="outline" onClick={openPool}>
                Заавал оруулах / хасах
              </Button>
            )}
          </div>
          {r.sections.map((s: any) => (
            <div key={s.id} className="space-y-3">
              <h2 className="font-bold">
                {s.title} · {s.questionCount} асуулт ·{" "}
                {Number(s.maxScorePerQuestion)} оноо/асуулт
              </h2>
              {s.questions.map((x: any) => (
                <QuizQuestion key={x.id} item={x} index={index++} />
              ))}
            </div>
          ))}
        </section>
      )}
      {tab === 2 && (
        <section className={bpPanel}>
          <h2 className="text-lg font-bold">
            {q.readiness.status === "READY"
              ? "✓ Бэлэн"
              : "! Засвар шаардлагатай"}
          </h2>
          <p>
            {r.totalQuestionCount} асуулт · {Number(r.totalMaxScore)} оноо ·{" "}
            {r.durationMinutes} минут · Босго {Number(r.passingScore)}%
          </p>
          {q.readiness.issues.map((x: string) => (
            <p key={x} className="mt-2 text-amber-800">
              {x}
            </p>
          ))}
          <div className="my-4 flex flex-wrap gap-2">
            {actions
              .filter((x: string) => quizAction[x])
              .map((action: string) => (
                <Button
                  key={action}
                  disabled={busy || dirty}
                  onClick={() => {
                    setWorkflow(action);
                    setComment("");
                  }}
                >
                  {quizAction[action]}
                </Button>
              ))}
          </div>
          {admin && r.revisionStatus === "PUBLISHED" && (
            <Link
              className="text-primary underline"
              href={"/admin/candidate-assessments?quizRevisionId=" + r.id}
            >
              Энэ хувилбараар хуваарь үүсгэх
            </Link>
          )}
          <p className="my-3 text-sm">
            Нийтлэх нь шалгуулагчдад шууд нээхгүй. Одоогийн хуваарь, эхэлсэн
            оролдлогууд өөрчлөгдөхгүй.
          </p>
          <h3 className="font-semibold">Үйлдлийн түүх</h3>
          {!q.workflow.length && (
            <p className="text-sm">Үйлдлийн түүх хараахан байхгүй.</p>
          )}
          <ol className="mt-3 space-y-3">
            {q.workflow.map((e: any) => (
              <li key={e.id} className="rounded border p-3 text-sm">
                {quizAction[e.action] || e.action} ·{" "}
                {quizStatus[e.newStatus] || e.newStatus} ·{" "}
                {new Date(e.occurredAt).toLocaleString("mn-MN")}
                <p>{e.comment}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
      {preview && (
        <BlueprintDialog
          title="Шалгуулагчийн харагдац — хадгалсан хувилбар"
          onClose={() => setPreview(false)}
        >
          <p className="mb-4 text-sm">
            Preview: хариулт хадгалахгүй, attempt болон үнэлгээ үүсгэхгүй.
          </p>
          <div className="space-y-4">
            {r.sections
              .flatMap((s: any) => s.questions)
              .map((x: any, i: number) => (
                <QuizQuestion key={x.id} item={x} index={i} candidate />
              ))}
          </div>
        </BlueprintDialog>
      )}
      {pool && (
        <BlueprintDialog
          title="Асуултын бүрэлдэхүүн тохируулах"
          onClose={() => {
            if (!busy) setPool(null);
          }}
        >
          <p className="mb-4 text-sm">
            Одоогийн Blueprint-ийн зөвшөөрөгдсөн сан. Шүүлтүүр өөрчлөх нь
            хадгалсан асуултуудыг шууд солихгүй.
          </p>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {Array.from(
              new Map<string, any>(
                (pool.sections || [])
                  .flatMap((s: any) => s.candidates || [])
                  .map((x: any) => [x.id, x]),
              ).values(),
            ).map((x: any) => (
              <label
                key={x.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded border p-2"
              >
                <span className="min-w-0 break-words">{x.title}</span>
                <select
                  aria-label={x.title + " сонголт"}
                  className="rounded border p-2"
                  value={
                    overrides.find((o) => o.questionId === x.id)?.mode || "none"
                  }
                  onChange={(e) => {
                    setSelection(null);
                    setOverrides([
                      ...overrides.filter((o) => o.questionId !== x.id),
                      ...(e.target.value === "none"
                        ? []
                        : [{ questionId: x.id, mode: e.target.value }]),
                    ]);
                  }}
                >
                  <option value="none">Сангаас сонгох</option>
                  <option value="mandatory">Заавал оруулах</option>
                  <option value="excluded">Хасах</option>
                </select>
              </label>
            ))}
          </div>
          <Button
            className="mt-3"
            variant="outline"
            onClick={() => {
              setOverrides([]);
              setSelection(null);
            }}
          >
            Override цэвэрлэх
          </Button>
          <Button
            className="ml-2 mt-3"
            variant="outline"
            onClick={() => {
              setOverrides(r.runtimePolicy?.questionOverrides || []);
              setSelection(null);
            }}
          >
            Хадгалсан сонголтод буцах
          </Button>
          <div className="my-4 flex flex-wrap gap-2">
            <Button disabled={busy} onClick={() => act("preview")}>
              Жишиг бүрэлдэхүүн шалгах
            </Button>
            <Button
              disabled={busy}
              onClick={() => {
                if (
                  window.confirm(
                    "Хадгалсан ноорогийн асуултуудыг одоогийн Blueprint-ээс дахин бүрдүүлэх үү?",
                  )
                )
                  void act("reselect");
              }}
            >
              Асуултыг дахин бүрдүүлэх
            </Button>
          </div>
          {overrideDirty && (
            <p className="text-sm text-amber-800">
              Сонголтын өөрчлөлт хараахан хадгалагдаагүй.
            </p>
          )}
          {selection && (
            <>
              <h3 className="font-bold">Жишиг сонголт — хадгалаагүй</h3>
              <PoolPreview result={selection} />
            </>
          )}
          {error && (
            <p role="alert" className="text-red-700">
              {error}
            </p>
          )}
        </BlueprintDialog>
      )}
      {workflow && (
        <BlueprintDialog
          title={quizAction[workflow]}
          onClose={() => {
            if (!busy) setWorkflow("");
          }}
        >
          <p className="mb-3">
            v{r.revisionNumber} · {r.title}
          </p>
          <label>
            Тайлбар{workflow === "changes_requested" ? " (шаардлагатай)" : ""}
            <textarea
              className={bpInput}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
          <Button
            className="mt-4"
            disabled={
              busy || (workflow === "changes_requested" && !comment.trim())
            }
            onClick={() => act(workflow)}
          >
            {quizAction[workflow]} — баталгаажуулах
          </Button>
          {error && (
            <p role="alert" className="mt-3 text-red-700">
              {error}
            </p>
          )}
        </BlueprintDialog>
      )}
    </main>
  );
}
