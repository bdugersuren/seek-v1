"use client";
import {QuizCreateDialog} from "./QuizCreateDialog";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@seek/ui";
import {
  fetchBlueprintPage,
  fetchAssessmentContexts,
  fetchTopics,
  getBlueprintByIdAsync,
  duplicateBlueprint,
  deleteBlueprint,
  updateBlueprint,
  createBlueprint,
  createQuiz,
} from "./api";
import type { Blueprint } from "./types";
import {
  BlueprintDialog,
  PoolPreview,
  BlueprintQuizLinks,
  Readiness,
  bpPanel,
  bpInput,
} from "./BlueprintUI";
export function BlueprintList({ contextId }: { contextId?: string }) {
  const router = useRouter();
  const [quizBlueprint,setQuizBlueprint]=useState<any>(null);
  const [context, setContext] = useState(contextId || ""),
    [contexts, setContexts] = useState<any[]>([]),
    [topics, setTopics] = useState<any[]>([]),
    [metaError, setMetaError] = useState("");
  const [search, setSearch] = useState(""),
    [topic, setTopic] = useState(""),
    [difficulty, setDifficulty] = useState(""),
    [mode, setMode] = useState(""),
    [readiness, setReadiness] = useState(""),
    [lifecycle, setLifecycle] = useState(""),
    [page, setPage] = useState(1),
    [view, setView] = useState("card"),
    [reload, setReload] = useState(0);
  const [data, setData] = useState<any>(null),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [notice, setNotice] = useState("");
  const pending = useRef(false);
  const [preview, setPreview] = useState<Blueprint | null>(null),
    [create, setCreate] = useState(false),
    [name, setName] = useState(""),
    [code, setCode] = useState(""),
    [newTopic, setNewTopic] = useState("");
  useEffect(() => {
    let active = true;
    setMetaError("");
    Promise.all([fetchAssessmentContexts(), fetchTopics(context || undefined)])
      .then(([c, t]) => {
        if (active) {
          setContexts(c);
          setTopics(t);
        }
      })
      .catch(() => active && setMetaError("Лавлах мэдээлэл татаж чадсангүй."));
    return () => {
      active = false;
    };
  }, [context, reload]);
  const descendants = (id: string) => {
    const ids = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const t of topics)
        if (ids.has(t.parentId) && !ids.has(t.id)) {
          ids.add(t.id);
          changed = true;
        }
    }
    return Array.from(ids).join(",");
  };
  const topicIds = topic ? descendants(topic) : "";
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timer = setTimeout(
      () =>
        fetchBlueprintPage({
          ...(context ? { assessmentContextId: context } : {}),
          search,
          topics: topicIds,
          difficulties: difficulty,
          mode,
          readiness,
          lifecycle,
          page: String(page),
          pageSize: "12",
        })
          .then((d) => active && setData(d))
          .catch(
            (e) =>
              active &&
              setError(
                e.status === 403
                  ? "Энэ контекстэд хандах эрхгүй."
                  : e.message || "Жагсаалт татаж чадсангүй.",
              ),
          )
          .finally(() => active && setLoading(false)),
      200,
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    context,
    search,
    topicIds,
    difficulty,
    mode,
    readiness,
    lifecycle,
    page,
    reload,
  ]);
  function reset() {
    setSearch("");
    setTopic("");
    setDifficulty("");
    setMode("");
    setReadiness("");
    setLifecycle("");
    setPage(1);
  }
  async function act(kind: string, b?: Blueprint) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setNotice("");
    try {
      if (kind === "create") {
        if (!context) throw new Error("Контекст сонгоно уу.");
        const row = await createBlueprint({
          name,
          code: code || undefined,
          topicId: newTopic,
          assessmentContextId: context,
          sections: [],
        });
        setCreate(false);
        router.push(`/assessor/context/${context}/blueprints/${row.id}`);
        return;
      }
      if (!b) return;
      if (kind === "duplicate") {
        const copy = await duplicateBlueprint(b.id);
        router.push(
          `/assessor/context/${copy.assessmentContextId}/blueprints/${copy.id}`,
        );
        return;
      }
      if (kind === "delete") {
        if (
          !window.confirm(
            `“${b.title}” загварыг устгах уу? Асуултууд устахгүй. Үйлдлийг буцаах боломжгүй.`,
          )
        )
          return;
        await deleteBlueprint(b.id);
        setPreview(null);
        setReload((n) => n + 1);
        return;
      }
      const full = await getBlueprintByIdAsync(b.id);
      if (!full) throw new Error("Blueprint олдсонгүй.");
      if (kind === "view") {
        setPreview(full);
        return;
      }
      if (kind === "archive" || kind === "restore") {
        await updateBlueprint(b.id, {
          ...full,
          status: kind === "archive" ? "archived" : "draft",
        });
        setPreview(null);
        setReload((n) => n + 1);
        return;
      }
      if (kind === "quiz") {
        if (full.readiness?.status !== "READY") {
          setPreview(full);
          throw new Error(
            "Blueprint ашиглахад бэлэн биш. Зөрчлүүдийг засна уу.",
          );
        }
        setPreview(null);
        setQuizBlueprint(full);
      }
    } catch (e: any) {
      setNotice(e.message || "Үйлдэл амжилтгүй.");
    } finally {
      setBusy(false);
      pending.current = false;
    }
  }
  const field = (
    label: string,
    value: string,
    set: (s: string) => void,
    options: React.ReactNode,
  ) => (
    <label className="block text-sm">
      {label}
      <select
        aria-label={label}
        className={bpInput}
        value={value}
        onChange={(e) => {
          set(e.target.value);
          setPage(1);
        }}
      >
        {options}
      </select>
    </label>
  );
  const actions = (b: Blueprint) => (
    <div className="flex flex-wrap gap-2 text-sm">
      <button
        className="rounded-lg border px-3 py-2"
        disabled={busy}
        onClick={() => act("view", b)}
      >
        Харах
      </button>
      <Link
        className="rounded-lg border px-3 py-2"
        href={`/assessor/context/${b.assessmentContextId}/blueprints/${b.id}`}
      >
        Засах
      </Link>
      <button
        className="rounded-lg border px-3 py-2"
        disabled={busy}
        onClick={() => act("duplicate", b)}
      >
        Хуулбарлах
      </button>
      <button
        className="rounded-lg bg-primary px-3 py-2 text-primary-foreground disabled:opacity-50"
        disabled={busy || !b.allowedActions?.includes("create_quiz")}
        onClick={() => act("quiz", b)}
      >
        Quiz үүсгэх
      </button>
      <button
        className="rounded-lg border px-3 py-2"
        disabled={busy}
        onClick={() => act(b.status === "archived" ? "restore" : "archive", b)}
      >
        {b.status === "archived" ? "Сэргээх" : "Архивлах"}
      </button>
      <button
        className="rounded-lg border px-3 py-2 text-red-700 disabled:opacity-50"
        disabled={busy || !b.allowedActions?.includes("delete")}
        title={b.usageCount ? "Quiz-д ашиглагдсан. Архивлаж болно." : undefined}
        onClick={() => act("delete", b)}
      >
        Устгах
      </button>
    </div>
  );
  function tree(
    parent: string | null = null,
    seen: string[] = [],
  ): React.ReactNode {
    return topics
      .filter((t) => (t.parentId || null) === parent && !seen.includes(t.id))
      .map((t) => (
        <div key={t.id} className="ml-2 border-l pl-2">
          <label className="flex items-start gap-2 py-2 text-sm">
            <input
              type="radio"
              name="blueprint-topic"
              checked={topic === t.id}
              onChange={() => {
                setTopic(t.id);
                setPage(1);
              }}
            />
            {t.title || t.name}
          </label>
          {tree(t.id, [...seen, t.id])}
        </div>
      ));
  }
  return (
    <main className="mx-auto min-w-0 max-w-[1440px] space-y-5 p-4 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Үнэлгээний Blueprint</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {contexts.find((c) => c.id === context)?.name ||
              "Таны эрхтэй контекстүүд"}{" "}
            · Асуултын сангаас Quiz бүрдүүлэх загвар
          </p>
        </div>
        <Button
          disabled={!context || !!metaError}
          onClick={() => {
            setName("");
            setCode("");
            setNewTopic("");
            setCreate(true);
          }}
        >
          + Blueprint үүсгэх
        </Button>
      </header>
      {!contextId &&
        field(
          "Контекст",
          context,
          (v) => {
            setContext(v);
            reset();
          },
          <>
            <option value="">Бүх контекст</option>
            {contexts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </>,
        )}
      {data && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            ["Нийт загвар", data.summary.total],
            ["Бэлэн", data.summary.ready],
            ["Засвар шаардлагатай", data.summary.attention],
          ].map(([label, n]) => (
            <div key={label} className={bpPanel}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <b className="mt-2 block text-2xl">{n}</b>
            </div>
          ))}
        </div>
      )}
      {notice && (
        <p role="status" className={`${bpPanel} text-sm`}>
          {notice}
        </p>
      )}
      {metaError && (
        <p role="alert" className={bpPanel}>
          {metaError}
          <Button onClick={() => setReload((n) => n + 1)}>
            Лавлах дахин татах
          </Button>
        </p>
      )}
      <div className="grid min-w-0 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className={`${bpPanel} self-start`}>
          <details open>
            <summary className="cursor-pointer font-semibold">Шүүлтүүр</summary>
            <div className="mt-4 space-y-4">
              <details>
                <summary className="cursor-pointer text-sm">
                  Сэдэв ба дэд сэдэв
                </summary>
                <button
                  className="my-2 text-sm text-primary"
                  onClick={() => {
                    setTopic("");
                    setPage(1);
                  }}
                >
                  Бүх сэдэв
                </button>
                {tree()}
              </details>
              {field(
                "Хүндрэлийн түвшин",
                difficulty,
                setDifficulty,
                <>
                  <option value="">Бүгд</option>
                  {data?.facets?.difficulties?.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </>,
              )}
              {field(
                "Сангийн горим",
                mode,
                setMode,
                <>
                  <option value="">Бүгд</option>
                  <option value="FIXED">Сонгосон сан</option>
                  <option value="RULE_BASED">Дүрмийн сан</option>
                </>,
              )}
              {field(
                "Бэлэн эсэх",
                readiness,
                setReadiness,
                <>
                  <option value="">Бүгд</option>
                  <option value="READY">Бэлэн</option>
                  <option value="NEEDS_ATTENTION">Засвар шаардлагатай</option>
                  <option value="UNAVAILABLE">Шалгалт боломжгүй</option>
                </>,
              )}
              {field(
                "Төлөв",
                lifecycle,
                setLifecycle,
                <>
                  <option value="">Бүгд</option>
                  <option value="DRAFT">Ноорог</option>
                  <option value="ARCHIVED">Архивлагдсан</option>
                </>,
              )}
              <Button variant="outline" onClick={reset}>
                Шүүлтүүр цэвэрлэх
              </Button>
            </div>
          </details>
        </aside>
        <section className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="min-w-0 flex-1 text-sm">
              Нэр, кодоор хайх
              <input
                aria-label="Blueprint хайх"
                className={bpInput}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </label>
            <Button
              variant="outline"
              aria-pressed={view === "card"}
              onClick={() => setView("card")}
            >
              Карт
            </Button>
            <Button
              variant="outline"
              aria-pressed={view === "table"}
              onClick={() => setView("table")}
            >
              Жагсаалт
            </Button>
          </div>
          {error ? (
            <div role="alert" className={bpPanel}>
              {error}
              <Button variant="outline" onClick={() => setReload((n) => n + 1)}>
                Дахин оролдох
              </Button>
            </div>
          ) : loading ? (
            <p className={bpPanel}>Ачаалж байна…</p>
          ) : !data?.items.length ? (
            <div className={bpPanel}>
              <h2 className="font-semibold">
                {search || topic || mode || readiness || lifecycle || difficulty
                  ? "Шүүлтүүрт тохирох загвар алга"
                  : "Blueprint байхгүй"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Шүүлтүүрээ өөрчлөх эсвэл шинэ загвар үүсгэнэ үү.
              </p>
            </div>
          ) : view === "card" ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {data.items.map((b: Blueprint) => (
                <article key={b.id} className={`${bpPanel} space-y-4`}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold">{b.title}</h2>
                    <Readiness value={b.readiness} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {b.code} · {b.topicName} ·{" "}
                    {b.status === "archived" ? "Архивлагдсан" : "Ноорог"}
                  </p>
                  <p className="line-clamp-2 text-sm">{b.description}</p>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      [
                        "Хэсэг",
                        b.readiness?.summary?.sectionCount ?? b.sections.length,
                      ],
                      [
                        "Давхардалгүй сан",
                        b.readiness?.summary?.uniquePoolQuestions ?? "—",
                      ],
                      [
                        "Сонгох асуулт",
                        b.readiness?.summary?.pickedQuestions ?? "—",
                      ],
                      ["Нийт оноо", b.readiness?.summary?.totalPoints ?? "—"],
                    ].map(([label, n]) => (
                      <div
                        key={label}
                        className="rounded-lg bg-muted-background p-3"
                      >
                        <dt className="text-xs text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-1 font-semibold">{n}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="text-xs text-muted-foreground">
                    {b.totalDurationMinutes} минут · Босго {b.passScore}% ·
                    Холбогдсон Quiz: {b.usageCount}
                    <br />
                    Шинэчилсэн:{" "}
                    {b.updatedAt
                      ? new Date(b.updatedAt).toLocaleString("mn-MN")
                      : "Тодорхойгүй"}
                  </p>
                  {actions(b)}
                </article>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border bg-surface">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead>
                  <tr>
                    {[
                      "Нэр / код",
                      "Төлөв",
                      "Сан / сонголт / оноо",
                      "Хугацаа",
                      "Quiz",
                      "Шинэчилсэн",
                      "Үйлдэл",
                    ].map((v) => (
                      <th key={v} className="p-3">
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((b: Blueprint) => (
                    <tr key={b.id} className="border-t">
                      <td className="p-3">
                        <b>{b.title}</b>
                        <p className="text-xs">
                          {b.code} · {b.topicName}
                        </p>
                      </td>
                      <td className="p-3">
                        <Readiness value={b.readiness} />
                        <p>
                          {b.status === "archived" ? "Архивлагдсан" : "Ноорог"}
                        </p>
                      </td>
                      <td className="p-3">
                        {b.readiness?.summary?.uniquePoolQuestions ?? "—"} /{" "}
                        {b.readiness?.summary?.pickedQuestions ?? "—"} /{" "}
                        {b.readiness?.summary?.totalPoints ?? "—"}
                      </td>
                      <td className="p-3">{b.totalDurationMinutes} мин</td>
                      <td className="p-3">{b.usageCount}</td>
                      <td className="p-3">
                        {new Date(b.updatedAt).toLocaleDateString("mn-MN")}
                      </td>
                      <td className="p-3">{actions(b)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data && !error && (
            <div className="flex items-center justify-between gap-3 text-sm">
              <Button
                variant="outline"
                disabled={loading || data.page <= 1}
                onClick={() => setPage(data.page - 1)}
              >
                Өмнөх
              </Button>
              <span>
                {data.total} загвар · {data.page} /{" "}
                {Math.max(1, Math.ceil(data.total / 12))}
              </span>
              <Button
                variant="outline"
                disabled={loading || data.page * 12 >= data.total}
                onClick={() => setPage(data.page + 1)}
              >
                Дараах
              </Button>
            </div>
          )}
        </section>
      </div>
      {preview && (
        <BlueprintDialog title={preview.title} onClose={() => setPreview(null)}>
          <p className="mb-4 text-sm">
            {preview.code} · {preview.topicName} · Холбогдсон Quiz{" "}
            {preview.usageCount}
          </p>
          <PoolPreview result={preview.readiness} /><BlueprintQuizLinks blueprint={preview}/>
          <div className="mt-5">{actions(preview)}</div>
        </BlueprintDialog>
      )}
      {create && (
        <BlueprintDialog
          title="Blueprint үүсгэх"
          onClose={() => !busy && setCreate(false)}
        >
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              act("create");
            }}
          >
            <label className="block">
              Нэр
              <input
                required
                aria-label="Blueprint нэр"
                maxLength={200}
                className={bpInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="block">
              Код
              <input
                aria-label="Blueprint код"
                className={bpInput}
                value={code}
                placeholder="Автоматаар үүсгэнэ"
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
            {field(
              "Үндсэн сэдэв",
              newTopic,
              setNewTopic,
              <>
                <option value="">Тохируулаагүй</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title || t.name}
                  </option>
                ))}
              </>,
            )}
            {notice && <p role="alert">{notice}</p>}
            <Button type="submit" disabled={busy}>
              {busy ? "Үүсгэж байна…" : "Ноорог үүсгэх"}
            </Button>
          </form>
        </BlueprintDialog>
      )}
      {quizBlueprint&&<QuizCreateDialog blueprint={quizBlueprint} onClose={()=>setQuizBlueprint(null)}/>}
    </main>
  );
}
