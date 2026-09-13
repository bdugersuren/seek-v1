import { QuestionTypeBadge } from "../../assessor-workspace/question-presentation";
import { optionLetter } from "../../assessor-workspace/option-label";
import {
  demoOnly,
  expected,
  round,
  statusLabels,
  type Question,
  type Response,
} from "./model";
export const panel =
  "rounded-2xl border border-border bg-surface p-5 shadow-sm";
export function StatusBadge({ response: r }: { response: Response }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${r.status === "correct" ? "bg-emerald-50 text-emerald-800" : r.status === "wrong" ? "bg-rose-50 text-rose-800" : r.status === "partial" || r.status === "pending" ? "bg-amber-50 text-amber-900" : "bg-slate-100 text-slate-700"}`}
    >
      {r.status === "correct" ? "✓ " : r.status === "wrong" ? "✕ " : "• "}
      {statusLabels[r.status]}
    </span>
  );
}
export function Solution({
  q,
  r,
  locked,
}: {
  q: Question;
  r: Response;
  locked: boolean;
}) {
  const correct = expected(q);
  const same = (i: number) => r.value[i] === correct[i];
  const cell = (ok: boolean) =>
    ok ? "border-emerald-300 bg-emerald-50" : "border-amber-300 bg-amber-50";
  const box = (title: string, content: React.ReactNode) => (
    <section className="rounded-xl border border-border p-4">
      <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
        {title}
      </h4>
      {content}
    </section>
  );
  let body: React.ReactNode;
  switch (q.type) {
    case "SINGLE_CHOICE":
    case "MULTIPLE_CHOICE":
    case "TRUE_FALSE":
    case "SJT":
      body = (
        <div className="space-y-3">
          {q.options.map((o, i) => {
            const selected = r.value.includes(String(i)),
              ok = q.correct.includes(i);
            return (
              <div
                key={o}
                className={`flex flex-wrap items-center gap-3 rounded-xl border p-4 ${!locked && ok ? "border-emerald-300 bg-emerald-50" : selected ? "border-blue-300 bg-blue-50" : "border-border"}`}
              >
                <b className="grid h-8 w-8 shrink-0 place-items-center rounded-full border bg-white text-slate-800">
                  {q.type === "TRUE_FALSE"
                    ? i === 0
                      ? "✓"
                      : "✕"
                    : optionLetter(i)}
                </b>
                <span className="min-w-0 flex-1">{o}</span>
                <span className="text-xs font-medium">
                  {selected ? "● Өгсөн хариулт " : ""}
                  {!locked && ok
                    ? "✓ Зөв хариулт"
                    : !locked && selected
                      ? "✕ Зөв бус сонголт"
                      : ""}
                  {!locked && q.type === "MULTIPLE_CHOICE" && ok && !selected
                    ? " · Орхисон зөв сонголт"
                    : ""}
                  {!locked && q.type === "SJT"
                    ? ` · ${i === 0 ? 4 : i === 2 ? 2 : 0} оноо`
                    : ""}
                </span>
              </div>
            );
          })}
        </div>
      );
      break;
    case "ORDERING":
      body = (
        <div className="grid gap-4 md:grid-cols-2">
          {box(
            "Өгсөн дараалал",
            <ol className="space-y-2">
              {r.value.length
                ? r.value.map((v, i) => (
                    <li
                      key={i}
                      className={`rounded-lg border p-3 ${locked ? "" : cell(same(i))}`}
                    >
                      {i + 1}. {v}{" "}
                      {!locked && (same(i) ? "✓" : "↔ Байрлал зөрсөн")}
                    </li>
                  ))
                : "Хариулаагүй"}
            </ol>,
          )}
          {!locked &&
            box(
              "Зөв дараалал",
              <ol className="space-y-2">
                {q.items.map((v, i) => (
                  <li key={v} className="rounded-lg bg-emerald-50 p-3">
                    {i + 1}. {v}
                  </li>
                ))}
              </ol>,
            )}
        </div>
      );
      break;
    case "MATCHING":
      body = (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Өгсөн ба зөв харгалзаа</caption>
            <thead>
              <tr>
                <th className="p-3">Өгөгдөл</th>
                <th className="p-3">Өгсөн хариулт</th>
                {!locked && <th className="p-3">Зөв харгалзаа</th>}
              </tr>
            </thead>
            <tbody>
              {q.rows.map((row, i) => (
                <tr key={row} className="border-t">
                  <th className="p-3">{row}</th>
                  <td className="p-3">
                    {q.columns[Number(r.value[i])] ?? "Хариулаагүй"}
                  </td>
                  {!locked && (
                    <td className="p-3">
                      {same(i) ? "✓" : "↔"} {q.columns[q.correct[i]]} ·{" "}
                      {same(i) ? round(q.max / q.rows.length) : 0} оноо
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      break;
    case "MATRIX":
      body = (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <caption className="mb-3 text-left text-muted-foreground">
              ● Өгсөн хариулт{!locked ? " · ✓ Зөв хариулт" : ""}
            </caption>
            <thead>
              <tr>
                <th className="p-3 text-left">Мөр</th>
                {q.columns.map((c) => (
                  <th key={c} className="p-3">
                    {c}
                  </th>
                ))}
                {!locked && <th className="p-3">Оноо</th>}
              </tr>
            </thead>
            <tbody>
              {q.rows.map((row, i) => (
                <tr key={row} className="border-t">
                  <th className="p-3 text-left">{row}</th>
                  {q.columns.map((c, j) => (
                    <td
                      key={c}
                      className={`p-3 text-center ${!locked && q.correct[i] === j ? "bg-emerald-50" : ""}`}
                      aria-label={`${row}: ${c}${r.value[i] === String(j) ? ", өгсөн" : ""}${!locked && q.correct[i] === j ? ", зөв" : ""}`}
                    >
                      {r.value[i] === String(j) ? "●" : ""}
                      {!locked && q.correct[i] === j ? " ✓" : ""}
                    </td>
                  ))}
                  {!locked && (
                    <td>
                      {same(i) ? round(q.max / q.rows.length) : 0}/
                      {round(q.max / q.rows.length)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      break;
    case "FILL_BLANK":
      body = (
        <div className="space-y-4">
          <p className="text-lg leading-loose">
            {q.parts.map((part, i) => (
              <span key={i}>
                {part}
                {i < q.accepted.length && (
                  <mark className="mx-1 rounded bg-blue-50 px-2 py-1 text-blue-900">
                    {r.value[i] || "________"}
                  </mark>
                )}
              </span>
            ))}
          </p>
          {!locked &&
            q.accepted.map((v, i) => (
              <p key={i} className="rounded-lg bg-slate-50 p-3">
                Зай {i + 1}: {r.value[i] || "Хариулаагүй"} → <b>{v}</b> ·{" "}
                {same(i) ? "✓ 2" : "✕ 0"}/2 оноо
              </p>
            ))}
        </div>
      );
      break;
    case "NUMERIC":
      body = (
        <div className="grid gap-4 sm:grid-cols-2">
          {box(
            "Өгсөн хариулт",
            <p className="text-2xl font-semibold">
              {r.value[0] ?? "—"} {q.unit}
            </p>,
          )}
          {!locked &&
            box(
              "Зөв утга ба хүлцэл",
              <>
                <p className="text-2xl font-semibold">
                  {q.target} {q.unit}
                </p>
                <p className="mt-2 text-sm">
                  ±{q.tolerance} {q.unit} · [{q.target - q.tolerance},{" "}
                  {q.target + q.tolerance}]
                </p>
              </>,
            )}
        </div>
      );
      break;
    case "LIKERT":
      body = (
        <div className="space-y-2">
          {q.scale.map((v, i) => (
            <div
              key={v}
              className={`rounded-xl border p-3 ${r.value[0] === String(i) ? "border-blue-400 bg-blue-50" : "border-border"}`}
            >
              {r.value[0] === String(i) ? "●" : "○"} {i + 1}. {v}
            </div>
          ))}
          <p className="text-sm text-muted-foreground">
            Өөрийн үнэлгээ · Оноонд тооцохгүй
          </p>
        </div>
      );
      break;
    case "CASE_BUNDLE":
      body = (
        <div className="space-y-4">
          {q.children.map((c, i) => (
            <section key={c.prompt} className="rounded-xl border p-4">
              <h4 className="font-semibold">
                {i + 1}. {c.prompt}
              </h4>
              <p className="mt-3">
                Өгсөн хариулт: {r.value[i] || "Хариулаагүй"}
              </p>
              {!locked && (
                <>
                  <p className="mt-2 text-emerald-800">
                    Зөв/жишиг: {c.expected} · {same(i) ? 2 : 0}/2 оноо
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {c.explanation}
                  </p>
                </>
              )}
            </section>
          ))}
        </div>
      );
      break;
    case "ESSAY":
      body = (
        <div className="space-y-4">
          {box(
            "Бичсэн хариулт",
            <p className="whitespace-pre-wrap leading-7">
              {r.value[0] || "Хариулаагүй"}
            </p>,
          )}
          {!locked && (
            <>
              {box(
                "Үнэлгээний рубрик",
                <div>
                  {q.rubric.map((v, i) => (
                    <div
                      key={v}
                      className="flex justify-between gap-3 border-b py-3"
                    >
                      <span>{v}</span>
                      <b>
                        {r.score === null
                          ? "Хүлээгдэж байна"
                          : `${Math.min(2, Math.max(0, r.score - i * 2))}/2`}
                      </b>
                    </div>
                  ))}
                  <p className="mt-3 text-sm">
                    Үнэлэгчийн тайлбар:{" "}
                    {r.status === "pending"
                      ? "Гар үнэлгээ хараахан хийгдээгүй."
                      : r.score === 4
                        ? "Эх сурвалж болон нотолгоог харьцуулах аргыг бүрэн тайлбарласан."
                        : r.score === 2
                          ? "Эх сурвалжийг дурдсан. Харьцуулсан нотолгоогоор баяжуулах шаардлагатай."
                          : "Шалгуурт нийцсэн үндэслэл дутуу байна."}
                  </p>
                </div>,
              )}
              {box(
                "Боломжит жишиг хариулт",
                <p className="leading-7">{q.example}</p>,
              )}
            </>
          )}
        </div>
      );
      break;
    case "SHORT_TEXT":
      body = (
        <div className="grid gap-4 sm:grid-cols-2">
          {box("Өгсөн хариулт", r.value[0] || "Хариулаагүй")}
          {!locked && box("Зөвшөөрөгдөх хувилбар", q.accepted.join(" / "))}
        </div>
      );
      break;
  }
  return (
    <article className={panel} data-testid={`solution-${q.type}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <QuestionTypeBadge type={q.type} />
        <StatusBadge response={r} />
      </div>
      <h3 className="my-5 text-xl font-semibold leading-8">
        {questionsNumber(q.id)}. {q.prompt}
      </h3>
      <div className="mb-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span>{q.topic}</span>
        <span>{q.difficulty}</span>
        <span>{r.seconds} секунд</span>
        <span>
          {q.max === 0
            ? "Оноонд тооцохгүй"
            : r.score === null
              ? "Оноо хүлээгдэж байна"
              : `${round(r.score)} / ${q.max} оноо`}
        </span>
      </div>
      {demoOnly.includes(q.type) && (
        <p className="mb-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-900">
          Тайлангийн дүрслэлийн жишээ · Энэ төрлийн runtime дэмжлэг хараахан
          нээгдээгүй.
        </p>
      )}
      {body}
      {locked ? (
        <div className="mt-5 rounded-xl bg-slate-100 p-4 text-sm">
          Шийдэл хараахан нээгдээгүй. Зөв хариулт болон тайлбар нийтлэгдсэний
          дараа харагдана.
        </div>
      ) : (
        <section className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <h4 className="font-semibold text-emerald-900">Тайлбар ба оноолт</h4>
          <p className="mt-2 text-sm leading-7 text-emerald-950">
            {q.explanation}
          </p>
        </section>
      )}
    </article>
  );
}
function questionsNumber(id: string) {
  return id.replace("q", "");
}
