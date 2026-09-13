"use client";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@seek/ui";
import { QuestionTypeBadge } from "../../assessor-workspace/question-presentation";
import { questionTypeLabels } from "../../assessor-workspace/mock-data";
import { Solution, StatusBadge, panel } from "./Solution";
import {
  questions,
  people,
  makeAttempts,
  totals,
  leaderboard,
  groups,
  distribution,
  round,
  statusLabels,
  type Scenario,
  type Attempt,
  type Question,
} from "./model";
const tabs = [
  ["analysis", "Analysis · Шинжилгээ"],
  ["solutions", "Solutions · Хариулт ба тайлбар"],
  ["top-scorers", "Top Scorers · Эрэмбэ"],
] as const;
const scenarios: Record<Scenario, string> = {
  graded: "Үнэлэгдсэн",
  pending: "Гар үнэлгээ хүлээж байгаа",
  locked: "Шийдэл хараахан нээгдээгүй",
  empty: "Өгөгдөлгүй",
};
const selectClass =
  "mt-1 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600";
const fmt = (n: number) => String(round(n));
const duration = (s: number) => `${Math.floor(s / 60)} мин ${s % 60} сек`;
function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block min-w-0 text-xs font-medium text-muted-foreground">
      {label}
      <select
        aria-label={label}
        className={selectClass}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {children}
      </select>
    </label>
  );
}
function Card({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper?: string;
}) {
  return (
    <section className={panel}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
      {helper && <p className="mt-2 text-xs text-muted-foreground">{helper}</p>}
    </section>
  );
}
function Empty({
  text = "Энэ жишиг төлөвт өгөгдөл байхгүй.",
}: {
  text?: string;
}) {
  return (
    <div className={`${panel} py-16 text-center`}>
      <p className="text-lg font-semibold">Харуулах мэдээлэл алга</p>
      <p className="mt-2 text-sm text-muted-foreground">{text}</p>
    </div>
  );
}
function Bars({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; score: number; max: number }[];
}) {
  return (
    <section className={panel}>
      <h3 className="mb-5 font-semibold">{title}</h3>
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-2 flex justify-between gap-3 text-sm">
              <span>
                {questionTypeLabels[
                  row.label as keyof typeof questionTypeLabels
                ] ?? row.label}
              </span>
              <span className="shrink-0 font-medium">
                {row.max
                  ? `${fmt(row.score)} / ${fmt(row.max)}`
                  : "Өгөгдөлгүй / оноогүй"}
              </span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100"
              role="img"
              aria-label={`${row.label}: ${row.max ? fmt((row.score / row.max) * 100) + "%" : "Өгөгдөлгүй"}`}
            >
              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width: `${row.max ? Math.min(100, (row.score / row.max) * 100) : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default function ResultsDemo() {
  const [params, setParams] = useState<URLSearchParams>(
    () => new URLSearchParams(),
  );
  const [navOpen, setNavOpen] = useState(true);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setNavOpen(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  useEffect(() => {
    const sync = () => setParams(new URLSearchParams(window.location.search));
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  const navigate = (patch: Record<string, string>) => {
    const p = new URLSearchParams(window.location.search);
    for (const [k, v] of Object.entries(patch)) p.set(k, v);
    window.history.pushState(null, "", `${window.location.pathname}?${p}`);
    setParams(p);
  };
  const scenario = (
    Object.keys(scenarios).includes(params.get("scenario") ?? "")
      ? params.get("scenario")
      : "graded"
  ) as Scenario;
  const tab = tabs.some(([id]) => id === params.get("tab"))
    ? params.get("tab")!
    : "analysis";
  const view = params.get("view") === "candidate" ? "candidate" : "assessor";
  const attempts = useMemo(() => makeAttempts(scenario), [scenario]);
  const person = people.find((p) => p.id === params.get("person")) ?? people[0];
  const own = attempts.filter((a) => a.personId === person.id);
  const attempt =
    own.find((a) => a.id === params.get("attempt")) ?? own[own.length - 1];
  const complete = attempts.filter((a) => !totals(a).pending);
  const ranks = leaderboard(attempts);
  const t = attempt ? totals(attempt) : null;
  const avg = complete.length
    ? complete.reduce((n, a) => n + totals(a).percent, 0) / complete.length
    : null;
  const filtered = questions.filter(
    (q) =>
      (type === "all" || q.type === type) &&
      (status === "all" ||
        (status === "mistakes"
          ? ["wrong", "partial", "unanswered"].includes(
              attempt?.responses[q.id].status ?? "",
            )
          : attempt?.responses[q.id].status === status)) &&
      q.prompt.toLowerCase().includes(search.toLowerCase()),
  );
  const q =
    filtered.find((q) => q.id === params.get("question")) ?? filtered[0];
  useEffect(() => {
    if (tab !== "solutions" || !q || params.get("question") === q.id) return;
    const p = new URLSearchParams(window.location.search);
    p.set("question", q.id);
    window.history.replaceState(null, "", `${window.location.pathname}?${p}`);
    setParams(p);
  }, [tab, q?.id, params]);
  const index = q ? filtered.indexOf(q) : -1;
  const openQuestion = (id: string) => {
    setType("all");
    setStatus("all");
    setSearch("");
    navigate({ tab: "solutions", question: id });
  };
  const selectPerson = (id: string) => navigate({ person: id, attempt: "" });
  const printedName =
    view === "assessor" ? "Үнэлэгчийн анализ" : "Шалгуулагчийн тайлан";
  return (
    <div className="results-demo min-w-0 bg-muted-background text-foreground">
      <style>{`@media print { body * { visibility:hidden } .results-demo,.results-demo * {visibility:visible} .results-demo {position:absolute;left:0;top:0;width:100%;background:white!important;font-size:11px} .results-demo .no-print {display:none!important} .results-demo section,.results-demo article {break-inside:avoid;box-shadow:none!important} .results-demo table {font-size:10px} .results-demo .print-stack {display:block!important} .results-demo .print-stack > * {margin-bottom:16px} }`}</style>
      <header className="border-b border-border bg-surface px-4 py-6 sm:px-7">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                  Жишиг тайлан
                </span>
                <span className="text-xs text-muted-foreground">
                  13 төрөл · Хувилбар 1.0
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Мэдлэг ба шийдвэр гаргалт
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {printedName} · {person.name}
                {attempt ? ` · Оролдлого ${attempt.ordinal}` : ""}
              </p>
            </div>
            <Button
              className="no-print"
              variant="outline"
              onClick={() => window.print()}
            >
              Хэвлэх / PDF
            </Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Бүх нэр, хариулт, үзүүлэлт зохиомол. Бодит шалгалтын дүн биш. Тэнцэх
            босго: 70%. Жишиг төлөв: {scenarios[scenario]}.
          </p>
          <div className="no-print mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Select
              label="Харах өнцөг"
              value={view}
              onChange={(v) => navigate({ view: v })}
            >
              <option value="assessor">Үнэлэгчийн анализ</option>
              <option value="candidate">Шалгуулагчийн тайлан</option>
            </Select>
            <Select label="Оролцогч" value={person.id} onChange={selectPerson}>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
            <Select
              label="Оролдлого"
              value={attempt?.id ?? ""}
              onChange={(v) => navigate({ attempt: v })}
            >
              {own.length ? (
                own.map((a) => (
                  <option key={a.id} value={a.id}>
                    Оролдлого {a.ordinal}
                    {totals(a).pending
                      ? " · Хүлээгдэж байна"
                      : ` · ${fmt(totals(a).percent)}%`}
                  </option>
                ))
              ) : (
                <option value="">Оролдлого байхгүй</option>
              )}
            </Select>
            <Select
              label="Жишиг төлөв"
              value={scenario}
              onChange={(v) => navigate({ scenario: v })}
            >
              {Object.entries(scenarios).map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div
            role="tablist"
            aria-label="Тайлангийн хэсгүүд"
            className="no-print mt-6 flex gap-2 overflow-x-auto"
          >
            {tabs.map(([id, label], i) => (
              <button
                key={id}
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={`panel-${id}`}
                tabIndex={tab === id ? 0 : -1}
                onKeyDown={(e) => {
                  if (
                    ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                  ) {
                    e.preventDefault();
                    const n =
                      e.key === "Home"
                        ? 0
                        : e.key === "End"
                          ? 2
                          : (i + (e.key === "ArrowRight" ? 1 : 2)) % 3;
                    navigate({ tab: tabs[n][0] });
                    document.getElementById(`tab-${tabs[n][0]}`)?.focus();
                  }
                }}
                onClick={() => navigate({ tab: id })}
                className={`shrink-0 rounded-lg px-4 py-3 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600 ${tab === id ? "bg-blue-600 text-white" : "text-muted-foreground hover:bg-muted-background"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main
        className="mx-auto max-w-[1440px] space-y-5 p-4 sm:p-7"
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
      >
        <h2 className="text-lg font-semibold">
          {tabs.find(([id]) => id === tab)?.[1]}
        </h2>
        {!attempt || !t ? (
          <Empty />
        ) : tab === "analysis" ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {view === "candidate" ? (
                <>
                  <Card
                    label={t.pending ? "Түр оноо" : "Авсан оноо"}
                    value={`${fmt(t.score)} / ${t.max}`}
                    helper={`${fmt(t.percent)}% · ${t.pending ? "Эцсийн дүн биш" : "Босго 70%"}`}
                  />
                  <Card
                    label="Үнэлгээний төлөв"
                    value={
                      t.pending
                        ? "Хүлээгдэж байна"
                        : t.percent >= 70
                          ? "Тэнцсэн"
                          : "Тэнцээгүй"
                    }
                    helper="Likert оноонд орохгүй"
                  />
                  <Card
                    label="Хариулсан асуулт"
                    value={`${t.answered} / ${questions.length}`}
                    helper="Кейсийг нэг үндсэн асуултаар тооцов"
                  />
                  <Card
                    label="Зарцуулсан хугацаа"
                    value={duration(t.seconds)}
                    helper="Асуултуудын хугацааны нийлбэр"
                  />
                </>
              ) : (
                <>
                  <Card
                    label="Оролцогч"
                    value={String(
                      new Set(attempts.map((a) => a.personId)).size,
                    )}
                    helper="Зохиомол оролцогчид"
                  />
                  <Card
                    label="Эцэслэн үнэлэгдсэн оролдлого"
                    value={`${complete.length} / ${attempts.length}`}
                  />
                  <Card
                    label="Дундаж оноо"
                    value={avg === null ? "Өгөгдөлгүй" : `${fmt(avg)}%`}
                    helper="Эцэслэн үнэлэгдсэн бүх оролдлого"
                  />
                  <Card
                    label="Тэнцсэн хувь"
                    value={
                      complete.length
                        ? `${fmt((complete.filter((a) => totals(a).percent >= 70).length / complete.length) * 100)}%`
                        : "Өгөгдөлгүй"
                    }
                    helper="Эцэслэн үнэлэгдсэн оролдлогоос"
                  />
                </>
              )}
            </div>
            {view === "candidate" ? (
              <section className={panel}>
                <h3 className="font-semibold">Хариултын задаргаа</h3>
                <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                  {Object.entries(statusLabels).map(([s, label]) => (
                    <div key={s} className="rounded-xl bg-muted-background p-3">
                      <b className="text-xl">
                        {
                          Object.values(attempt.responses).filter(
                            (r) => r.status === s,
                          ).length
                        }
                      </b>
                      <p className="mt-1 text-xs">{label}</p>
                    </div>
                  ))}
                </div>
                <Button
                  className="no-print mt-4"
                  variant="outline"
                  onClick={() => {
                    setStatus("mistakes");
                    setType("all");
                    setSearch("");
                    navigate({ tab: "solutions" });
                  }}
                >
                  Алдаатай асуултуудыг давтах
                </Button>
              </section>
            ) : (
              <section className={panel}>
                <h3 className="font-semibold">Онооны тархалт</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Эцэслэн үнэлэгдсэн оролдлого · n={complete.length}
                </p>
                {complete.length ? (
                  <div className="mt-5 grid grid-cols-5 gap-2">
                    {[0, 20, 40, 60, 80].map((start) => {
                      const count = complete.filter((a) => {
                        const p = totals(a).percent;
                        return (
                          p >= start &&
                          (start === 80 ? p <= 100 : p < start + 20)
                        );
                      }).length;
                      return (
                        <div key={start} className="text-center">
                          <div className="flex h-28 items-end rounded bg-slate-50">
                            <div
                              className="w-full rounded-t bg-blue-600"
                              style={{
                                height: `${(count / complete.length) * 100}%`,
                              }}
                            />
                          </div>
                          <b className="mt-2 block text-sm">{count}</b>
                          <span className="text-xs">
                            {start}–
                            {start === 80 ? "100" : start + 20 + "-оос бага"}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="mt-5 text-sm">
                    Үнэлэгдсэн оролдлого хараахан алга.
                  </p>
                )}
              </section>
            )}
            <div className="print-stack grid gap-5 xl:grid-cols-3">
              <Bars
                title="Сэдвээр"
                rows={groups(
                  view === "candidate" ? [attempt] : complete,
                  "topic",
                )}
              />
              <Bars
                title="Хүндрэлийн түвшнээр"
                rows={groups(
                  view === "candidate" ? [attempt] : complete,
                  "difficulty",
                )}
              />
              <Bars
                title="Асуултын төрлөөр"
                rows={groups(
                  view === "candidate" ? [attempt] : complete,
                  "type",
                )}
              />
            </div>
            {view === "candidate" ? (
              <>
                <Performance attempts={own} />
                <section className={panel}>
                  <h3 className="font-semibold">Давтах шаардлагатай сэдэв</h3>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Үнэлэгдсэн асуултын оноо 70%-д хүрээгүй сэдвүүд.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {groups([attempt], "topic")
                      .filter((g) => g.max && g.score / g.max < 0.7)
                      .map((g) => (
                        <span
                          key={g.label}
                          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"
                        >
                          {g.label} · {fmt((g.score / g.max) * 100)}%
                        </span>
                      ))}
                  </div>
                </section>
              </>
            ) : (
              <section className={panel}>
                <h3 className="mb-4 font-semibold">
                  Асуулт тус бүрийн гүйцэтгэл
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[680px] text-left text-sm">
                    <caption className="mb-3 text-left text-xs text-muted-foreground">
                      Асуултаар үнэлэгдсэн хариултууд · бүрэн оноо авсан хувь
                    </caption>
                    <thead>
                      <tr>
                        {[
                          "Асуулт / төрөл",
                          "Хүндрэл",
                          "n",
                          "Бүрэн оноо",
                          "Дундаж",
                          "Хугацаа",
                        ].map((v) => (
                          <th key={v} className="p-3">
                            {v}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question) => {
                        const rs = attempts
                          .map((a) => a.responses[question.id])
                          .filter((r) => r.score !== null);
                        return (
                          <tr key={question.id} className="border-t">
                            <td className="p-3">
                              <button
                                className="text-left text-blue-700 underline-offset-4 hover:underline"
                                onClick={() => openQuestion(question.id)}
                              >
                                <span className="mb-1 block">
                                  {question.id.toUpperCase()} ·{" "}
                                  {question.prompt}
                                </span>
                                <QuestionTypeBadge type={question.type} />
                              </button>
                            </td>
                            <td className="p-3">{question.difficulty}</td>
                            <td className="p-3">{rs.length}</td>
                            <td className="p-3">
                              {rs.length && question.max
                                ? `${fmt((rs.filter((r) => r.score === question.max).length / rs.length) * 100)}%`
                                : "—"}
                            </td>
                            <td className="p-3">
                              {rs.length
                                ? `${fmt(rs.reduce((s, r) => s + (r.score ?? 0), 0) / rs.length)}/${question.max}`
                                : "—"}
                            </td>
                            <td className="p-3">
                              {rs.length
                                ? `${fmt(rs.reduce((s, r) => s + r.seconds, 0) / rs.length)} сек`
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        ) : tab === "solutions" ? (
          <>
            <div className="no-print grid gap-3 rounded-xl border bg-surface p-4 sm:grid-cols-3">
              <label className="text-xs text-muted-foreground">
                Асуултаас хайх
                <input
                  aria-label="Асуултаас хайх"
                  className={selectClass}
                  placeholder="Асуултын текст…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </label>
              <Select label="Асуултын төрөл" value={type} onChange={setType}>
                <option value="all">Бүх төрөл · 13</option>
                {questions.map((q) => (
                  <option key={q.type} value={q.type}>
                    {questionTypeLabels[q.type]}
                  </option>
                ))}
              </Select>
              <Select
                label="Хариултын төлөв"
                value={status}
                onChange={setStatus}
              >
                <option value="all">Бүх төлөв</option>
                <option value="mistakes">Давтах шаардлагатай</option>
                {Object.entries(statusLabels).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
              <button
                className="text-left text-sm text-blue-700"
                onClick={() => {
                  setSearch("");
                  setType("all");
                  setStatus("all");
                }}
              >
                Шүүлтүүр цэвэрлэх
              </button>
            </div>
            {!q ? (
              <Empty text="Шүүлтүүрт тохирох асуулт алга. Шүүлтүүрээ цэвэрлэнэ үү." />
            ) : (
              <div className="print-stack grid min-w-0 gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
                <details
                  open={navOpen}
                  onToggle={(event) => setNavOpen(event.currentTarget.open)}
                  className={`${panel} no-print self-start`}
                >
                  <summary className="cursor-pointer text-sm font-semibold">
                    Асуултууд · {filtered.length}
                  </summary>
                  <div className="mt-4 grid grid-cols-3 gap-2 lg:grid-cols-1">
                    {filtered.map((question) => (
                      <button
                        key={question.id}
                        aria-current={q.id === question.id ? "true" : undefined}
                        onClick={() => navigate({ question: question.id })}
                        className={`min-w-0 rounded-lg border p-3 text-left text-xs ${q.id === question.id ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" : "border-border"}`}
                      >
                        <b className="mb-2 block">
                          {question.id.toUpperCase()}
                        </b>
                        <span className="hidden lg:block">
                          <QuestionTypeBadge type={question.type} />
                        </span>
                        <span className="mt-2 block">
                          <StatusBadge
                            response={attempt.responses[question.id]}
                          />
                        </span>
                      </button>
                    ))}
                  </div>
                </details>
                <div className="min-w-0 space-y-5">
                  <Solution
                    q={q}
                    r={attempt.responses[q.id]}
                    locked={scenario === "locked"}
                  />
                  {view === "assessor" && (
                    <QuestionDistribution
                      q={q}
                      attempts={attempts}
                      locked={scenario === "locked"}
                    />
                  )}
                  <div className="no-print flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      disabled={index <= 0}
                      onClick={() =>
                        navigate({ question: filtered[index - 1].id })
                      }
                    >
                      ← Өмнөх
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {index + 1} / {filtered.length}
                    </span>
                    <Button
                      variant="outline"
                      disabled={index >= filtered.length - 1}
                      onClick={() =>
                        navigate({ question: filtered[index + 1].id })
                      }
                    >
                      Дараах →
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              <Card
                label="Эрэмбэд орсон оролцогч"
                value={String(ranks.length)}
              />
              <Card
                label="Дундаж оноо"
                value={avg === null ? "Өгөгдөлгүй" : `${fmt(avg)}%`}
                helper="Үнэлэгдсэн бүх оролдлого"
              />
              <Card
                label="Хамгийн өндөр оноо"
                value={
                  ranks.length ? `${fmt(ranks[0].percent)}%` : "Өгөгдөлгүй"
                }
              />
            </div>
            <Performance attempts={own} />
            <section className={panel}>
              <h3 className="font-semibold">Оролцогчдын эрэмбэ</h3>
              <p className="my-3 text-xs leading-5 text-muted-foreground">
                Нэг хувилбарын эцэслэн үнэлэгдсэн шилдэг оролдлогоор. Тэнцүү
                оноо ижил байртай; хугацаа байр өөрчлөхгүй.
              </p>
              {!ranks.length ? (
                <p className="py-8 text-center">
                  Эцэслэн үнэлэгдсэн оролдлого алга.
                </p>
              ) : (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr>
                          {[
                            "Байр",
                            "Оролцогч",
                            "Оролдлого",
                            "Шилдэг оноо",
                            "Хугацаа",
                          ].map((v) => (
                            <th className="p-3" key={v}>
                              {v}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {ranks.map((row) => (
                          <tr
                            key={row.person.id}
                            className={`border-t ${row.person.id === person.id ? "bg-blue-50" : ""}`}
                          >
                            <td className="p-3 font-bold">#{row.rank}</td>
                            <td className="p-3">
                              {view === "assessor" ? (
                                <button
                                  className="text-blue-700 underline"
                                  onClick={() =>
                                    navigate({
                                      person: row.person.id,
                                      attempt: row.best.id,
                                      tab: "analysis",
                                    })
                                  }
                                >
                                  {row.person.name}
                                </button>
                              ) : (
                                row.person.name
                              )}
                              {row.person.id === person.id ? " · Сонгосон" : ""}
                            </td>
                            <td className="p-3">{row.count}</td>
                            <td className="p-3 font-semibold">
                              {fmt(row.percent)}%
                            </td>
                            <td className="p-3">{duration(row.seconds)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="space-y-3 md:hidden">
                    {ranks.map((row) => (
                      <div
                        key={row.person.id}
                        className={`rounded-xl border p-4 ${row.person.id === person.id ? "border-blue-500 bg-blue-50" : ""}`}
                      >
                        <div className="flex justify-between gap-2">
                          <b>
                            #{row.rank} · {row.person.name}
                          </b>
                          <b>{fmt(row.percent)}%</b>
                        </div>
                        <p className="mt-2 text-xs">
                          {row.count} оролдлого · {duration(row.seconds)}
                        </p>
                        {view === "assessor" && (
                          <button
                            className="mt-3 text-sm text-blue-700"
                            onClick={() =>
                              navigate({
                                person: row.person.id,
                                attempt: row.best.id,
                                tab: "analysis",
                              })
                            }
                          >
                            Тайлан харах →
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>
          </>
        )}
        <footer className="border-t pt-4 text-xs text-muted-foreground">
          SEEK · Жишиг тайлан · {printedName} · {scenarios[scenario]}
        </footer>
      </main>
    </div>
  );
}
function Performance({ attempts }: { attempts: Attempt[] }) {
  return (
    <section className={panel}>
      <h3 className="mb-4 font-semibold">Сонгосон оролцогчийн оролдлогууд</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {attempts.map((a) => {
          const t = totals(a);
          return (
            <div key={a.id} className="rounded-xl bg-muted-background p-4">
              <p className="text-sm">Оролдлого {a.ordinal}</p>
              <b className="mt-2 block text-xl">
                {fmt(t.score)} / {t.max}
              </b>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.pending ? "Үнэлгээ хүлээгдэж байна" : `${fmt(t.percent)}%`} ·{" "}
                {duration(t.seconds)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
function QuestionDistribution({
  q,
  attempts,
  locked,
}: {
  q: Question;
  attempts: Attempt[];
  locked: boolean;
}) {
  const rows = distribution(attempts, q);
  const mistakes = attempts.filter((a) =>
    ["wrong", "partial"].includes(a.responses[q.id].status),
  );
  const common = distribution(mistakes, q)[0];
  return (
    <section className={panel}>
      <h3 className="font-semibold">Бүлгийн хариултын тархалт</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Бүх оролдлого · n={attempts.length}
      </p>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="min-w-0 break-words">{row.label}</span>
              <b className="shrink-0">
                {row.count} · {fmt((row.count / attempts.length) * 100)}%
              </b>
            </div>
            <div className="h-2 rounded bg-slate-100">
              <div
                className="h-2 rounded bg-blue-500"
                style={{ width: `${(row.count / attempts.length) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {!locked && q.type !== "LIKERT" && (
        <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">
          {common
            ? `Түгээмэл алдаатай хариулт (${common.count}): ${common.label}`
            : "Алдаатай хариулт бүртгэгдээгүй."}
        </p>
      )}
    </section>
  );
}
