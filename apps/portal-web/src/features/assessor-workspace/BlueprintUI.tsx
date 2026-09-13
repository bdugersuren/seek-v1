"use client";
import { useEffect, useRef } from "react";
import { Button } from "@seek/ui";
export const bpPanel = "rounded-xl border border-border bg-surface p-5";
export const bpInput =
  "mt-1 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary";
export function BlueprintDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const d = ref.current;
    d?.showModal();
    return () => {
      d?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        closeRef.current();
      }}
      className="m-auto max-h-[90vh] w-[calc(100%_-_2rem)] max-w-4xl overflow-auto rounded-2xl border border-border bg-surface p-5 text-foreground shadow-xl backdrop:bg-black/50"
      aria-label={title}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Button variant="outline" onClick={onClose}>
          Хаах
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function Readiness({ value }: { value: any }) {
  const status = value?.status;
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${status === "READY" ? "bg-emerald-50 text-emerald-800" : status === "NEEDS_ATTENTION" ? "bg-amber-50 text-amber-900" : "bg-slate-100 text-slate-700"}`}
    >
      {status === "READY"
        ? "✓ Бэлэн"
        : status === "NEEDS_ATTENTION"
          ? "! Засвар шаардлагатай"
          : "Шалгалт боломжгүй"}
    </span>
  );
}
export function PoolPreview({ result }: { result: any }) {
  return (
    <div className="space-y-4">
      <Readiness value={result} />
      {result?.issues?.map((issue: any, i: number) => (
        <p
          key={i}
          className="rounded-lg bg-amber-50 p-3 text-sm text-amber-950"
        >
          {issue.field}: {issue.message}
        </p>
      ))}
      {result?.summary && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Хэсэг", result.summary.sectionCount],
            ["Давхардалгүй сан", result.summary.uniquePoolQuestions],
            ["Сонгох", result.summary.pickedQuestions],
            ["Нийт оноо", result.summary.totalPoints],
          ].map(([label, n]) => (
            <div
              key={String(label)}
              className="rounded-lg bg-muted-background p-3"
            >
              <p className="text-xs text-muted-foreground">{label}</p>
              <b className="mt-2 block text-xl">{n}</b>
            </div>
          ))}
        </div>
      )}
      {result?.sections?.map((s: any) => (
        <section key={s.id} className="rounded-xl border p-4">
          <h3 className="font-semibold">{s.name}</h3>
          <p className="mt-2 text-sm">
            {s.mode === "RULE_BASED" ? "Дүрмийн сан" : "Сонгосон сан"} ·
            Боломжтой {s.eligibleCount} · Сонгох {s.pick} · {s.points}{" "}
            оноо/асуулт
          </p>
          {s.mode === "RULE_BASED" && (
            <p className="mt-2 text-xs text-muted-foreground">
              {s.ruleSummary?.join(" · ")}
            </p>
          )}
          {s.rejected?.map((r: any, i: number) => (
            <p key={i} className="mt-2 text-xs text-amber-800">
              Холбоос {i + 1}: {r.reason}
            </p>
          ))}
          {result.selected?.[s.id]?.length > 0 && (
            <ul className="mt-3 space-y-2 text-sm">
              {result.selected[s.id].map((id: string) => {
                const q = s.candidates?.find((q: any) => q.id === id);
                return (
                  <li key={id}>
                    ✓ {q?.code} · {q?.title}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
      <p className="text-xs text-muted-foreground">
        Урьдчилсан шалгалт. Quiz үүсгэхэд эрх, хүрэлцээ болон нийтлэгдсэн
        хувилбарыг дахин шалгана.
      </p>
    </div>
  );
}

export function BlueprintQuizLinks({blueprint,onReselect,busy=false}:{blueprint:any;onReselect?:(id:string)=>void;busy?:boolean}){return <section className="mt-5 space-y-3"><h3 className="font-semibold">Холбогдсон Quiz · {blueprint.usageCount||0}</h3><p className="text-xs text-muted-foreground">Таны эрхтэй сүүлийн 20 Quiz-ийн сүүлийн хувилбар. Blueprint өөрчлөгдөхөд асуултууд автоматаар солигдохгүй.</p>{blueprint.linkedQuizzes?.map((quiz:any)=>{const r=quiz.revisions?.[0];return <details key={quiz.id} className="rounded-lg border p-3"><summary className="cursor-pointer text-sm font-semibold">{r?.title||quiz.title} · Хувилбар {r?.revisionNumber} · {r?.revisionStatus==='DRAFT'?'Ноорог':r?.revisionStatus==='PUBLISHED'?'Нийтлэгдсэн':r?.revisionStatus}</summary><div className="mt-3 space-y-2"><a className="text-primary underline" href={"/assessor/quizzes/"+quiz.id}>Quiz дэлгэрэнгүй</a>{r?.sections?.map((s:any,i:number)=><div key={i}><b className="text-sm">{s.title}</b><ul className="my-2 space-y-1 text-sm">{s.questions?.map((q:any)=><li key={q.questionId}>• {q.questionVersion.title} · {Number(q.maxScore)} оноо</li>)}</ul></div>)}{onReselect&&r?.revisionStatus==='DRAFT'&&<Button variant="outline" disabled={busy} onClick={()=>onReselect(quiz.id)}>Quiz ноорогийг нээх</Button>}</div></details>})}</section>}
