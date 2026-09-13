"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@seek/ui";
import { quizApi, quizLifecycle, quizStatus } from "./quiz-api";
import { bpInput, bpPanel } from "./BlueprintUI";
export function QuizList({
  contextId,
  admin = false,
}: {
  contextId?: string;
  admin?: boolean;
}) {
  const [search, setSearch] = useState(""),
    [status, setStatus] = useState(""),
    [blueprint, setBlueprint] = useState(""),
    [page, setPage] = useState(1),
    [data, setData] = useState<any>(null),
    [error, setError] = useState(""),
    [reload, setReload] = useState(0);
  useEffect(() => {
    let live = true;
    setData(null);
    setError("");
    const timer = setTimeout(
      () =>
        quizApi(
          "?" +
            new URLSearchParams({
              paged: "true",
              page: String(page),
              pageSize: "12",
              ...(contextId ? { assessmentContextId: contextId } : {}),
              ...(search ? { search } : {}),
              ...(status ? { status } : {}),
              ...(blueprint ? { blueprintId: blueprint } : {}),
            }),
        )
          .then((x) => {
            if (live) setData(x);
          })
          .catch((e) => {
            if (live)
              setError(
                e.status === 403 ? "Quiz жагсаалтад хандах эрхгүй." : e.message,
              );
          }),
      200,
    );
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [contextId, search, status, blueprint, page, reload]);
  return (
    <main className="mx-auto min-w-0 max-w-7xl space-y-5 p-4 sm:p-6">
      <header className={bpPanel}>
        <h1 className="text-2xl font-bold">
          {admin ? "Quiz хянах ба нийтлэх" : "Quiz"}
        </h1>
        <p className="my-3 text-sm">
          {data
            ? `Нийт ${data.summary.total} · Нийтэлсэн ${data.summary.published} · Хянагдаж байгаа ${data.summary.inReview}`
            : "Quiz хувилбарын бодит төлөв"}
        </p>
        {!admin && (
          <Link
            className="text-primary underline"
            href={
              contextId
                ? `/assessor/context/${contextId}/blueprints`
                : "/assessor/blueprints"
            }
          >
            Blueprint-ээс Quiz үүсгэх
          </Link>
        )}
      </header>
      <section className={bpPanel + " grid gap-3 sm:grid-cols-3"}>
        <label>
          Quiz хайх
          <input
            className={bpInput}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </label>
        <label>
          Quiz төлөв
          <select
            aria-label="Quiz төлөв"
            className={bpInput}
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Бүх төлөв</option>
            {Object.entries(quizStatus).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
        <label>
          Blueprint шүүлтүүр
          <select
            aria-label="Blueprint шүүлтүүр"
            className={bpInput}
            value={blueprint}
            onChange={(e) => {
              setBlueprint(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Бүх Blueprint</option>
            {data?.facets.blueprints.map((b: any) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </label>
      </section>
      {error ? (
        <section role="alert" className={bpPanel}>
          <p>{error}</p>
          <Button onClick={() => setReload((x) => x + 1)}>Дахин оролдох</Button>
        </section>
      ) : !data ? (
        <p role="status">Ачаалж байна…</p>
      ) : (
        <>
          <p>{data.total} Quiz олдлоо.</p>
          {!data.items.length && (
            <section className={bpPanel}>
              <p>
                {search || status || blueprint
                  ? "Шүүлтүүрт тохирох Quiz байхгүй."
                  : "Quiz хараахан үүсээгүй."}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setStatus("");
                  setBlueprint("");
                  setPage(1);
                }}
              >
                Шүүлтүүр цэвэрлэх
              </Button>
            </section>
          )}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map((q: any) => {
              const r = q.revisions[0];
              return (
                <article key={q.id} className={bpPanel + " min-w-0 space-y-3"}>
                  <h2 className="break-words text-lg font-bold">
                    {r?.title || q.title}
                  </h2>
                  <p className="text-sm">
                    {quizStatus[r?.revisionStatus] || "Хувилбаргүй"} · v
                    {r?.revisionNumber} ·{" "}
                    {quizLifecycle[q.lifecycleStatus] || q.lifecycleStatus}
                  </p>
                  <p className="text-sm">
                    Нийтэлсэн:{" "}
                    {q.currentPublishedRevision
                      ? `v${q.currentPublishedRevision.revisionNumber}`
                      : "Байхгүй"}
                  </p>
                  <p>
                    {r?.totalQuestionCount ?? "—"} асуулт ·{" "}
                    {r?.totalMaxScore ?? "—"} оноо · {r?.durationMinutes ?? "—"}{" "}
                    минут
                  </p>
                  <p className="text-sm">Blueprint: {q.template.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Шинэчилсэн: {new Date(q.updatedAt).toLocaleString("mn-MN")}
                  </p>
                  <Link
                    className="inline-block rounded bg-primary px-4 py-2 text-white"
                    href={
                      (admin ? "/admin/quizzes/" : "/assessor/quizzes/") + q.id
                    }
                  >
                    Quiz нээх
                  </Link>
                </article>
              );
            })}
          </div>
          <nav aria-label="Quiz хуудаслалт" className="flex items-center gap-3">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((x) => x - 1)}
            >
              Өмнөх
            </Button>
            <span>
              {page} / {Math.max(1, Math.ceil(data.total / 12))}
            </span>
            <Button
              variant="outline"
              disabled={page * 12 >= data.total}
              onClick={() => setPage((x) => x + 1)}
            >
              Дараах
            </Button>
          </nav>
        </>
      )}
    </main>
  );
}
