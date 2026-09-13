"use client";
import { mapToQuestionBankItem } from "./api";
import { QuestionTypeBadge } from "./question-presentation";
import { RichTextPreview } from "./builders/RichTextPreviewer";
import { QuestionTypePreview } from "./builders/OptionPreviews";
import { optionLabel } from "./option-label";
export function QuizQuestion({
  item,
  index,
  candidate = false,
}: {
  item: any;
  index: number;
  candidate?: boolean;
}) {
  const v = item.questionVersion;
  if (!v) return <p role="alert">Асуултын агуулга харах боломжгүй.</p>;
  const q = mapToQuestionBankItem({
    ...item.question,
    activeVersion: v,
    versions: [v],
    classifications: v.classificationSnapshot || [],
  });
  return (
    <article className="min-w-0 space-y-3 rounded-xl border p-4">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <b>{index + 1}.</b>
        <QuestionTypeBadge type={q.type} />
        <span>{Number(item.maxScore)} оноо</span>
        {!candidate && (
          <>
            <span>Асуулт v{v.versionNumber}</span>
            <span>{q.difficultyName || "Хүндрэл тохируулаагүй"}</span>
            <span>{q.topicName || "Сэдэв тохируулаагүй"}</span>
          </>
        )}
      </div>
      <h3 className="font-semibold">{v.title}</h3>
      <RichTextPreview value={q.body || ""} />
      {candidate ? (
        <CandidateAnswer q={q} />
      ) : (
        <>
          <h4 className="font-semibold">Зөв хариулт ба оноолт</h4>
          <p className="text-sm text-muted-foreground">Доорх нь асуултын суурь оноолт (дээд оноо {q.defaultMaxScore}). Энэ Quiz-д дээд тал нь {Number(item.maxScore)} оноо авна.{q.type !== "ESSAY" && Number(item.maxScore)!==q.defaultMaxScore ? " Автомат үнэлгээ Quiz-ийн дээд оноонд хувь тэнцүүлнэ." : ""}</p>
          <QuestionTypePreview question={q} />
          {q.explanation && (
            <>
              <h4 className="font-semibold">Тайлбар</h4>
              <RichTextPreview value={q.explanation} />
            </>
          )}
        </>
      )}
    </article>
  );
}
function CandidateAnswer({ q }: { q: any }) {
  if (["SINGLE_CHOICE", "MULTIPLE_CHOICE", "TRUE_FALSE"].includes(q.type))
    return (
      <fieldset className="space-y-2">
        <legend className="sr-only">Хариулт сонгох</legend>
        {q.options.map((o: any, i: number) => (
          <label
            key={o.id}
            className="flex items-start gap-2 rounded border p-3"
          >
            <input
              type={q.type === "MULTIPLE_CHOICE" ? "checkbox" : "radio"}
              name={"preview-" + q.id}
            />
            <span>
              {optionLabel(q.type, i)}. <RichTextPreview value={o.value} />
            </span>
          </label>
        ))}
      </fieldset>
    );
  if (q.type === "MATCHING")
    return (
      <div className="space-y-2">
        {q.options.map((o: any) => (
          <label key={o.id} className="grid gap-2 sm:grid-cols-2">
            <RichTextPreview value={o.value} />
            <select
              aria-label={"Харгалзуулах " + o.label}
              className="min-w-0 rounded border p-2"
            >
              <option value="">Сонгох</option>
              {(q.scoringConfig?.rightOptions || []).map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.value}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
    );
  if (q.type === "MATRIX")
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <caption className="sr-only">Матрицын хариулт</caption>
          <thead>
            <tr>
              <th>Өгүүлбэр</th>
              {(q.scoringConfig?.matrixColumns || []).map((c: any) => (
                <th key={c.id} className="p-2">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {q.options.map((o: any) => (
              <tr key={o.id}>
                <th className="p-2 text-left">
                  <RichTextPreview value={o.value} />
                </th>
                {(q.scoringConfig?.matrixColumns || []).map((c: any) => (
                  <td key={c.id} className="p-2 text-center">
                    <input
                      type="radio"
                      name={"row-" + o.id}
                      aria-label={`${o.label} — ${c.label}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  return (
    <label className="block">
      Таны хариулт
      {q.type === "ESSAY" ? (
        <textarea className="mt-2 min-h-32 w-full rounded border p-3" />
      ) : (
        <input
          type={q.type === "NUMERIC" ? "number" : "text"}
          className="mt-2 w-full rounded border p-3"
        />
      )}
    </label>
  );
}
