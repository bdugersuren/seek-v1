"use client";
import {QuizCreateDialog} from "./QuizCreateDialog";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@seek/ui";
import {
  createBlueprint,
  updateBlueprint,
  previewBlueprint,
  fetchTopics,
  fetchDifficultyLevels,
  fetchAudienceLevels,
  fetchAssessmentContexts,
  fetchBlueprintCandidates,
  createQuiz,
  updateQuiz,
  getBlueprintByIdAsync,
} from "./api";
import type { Blueprint, BlueprintSection } from "./types";
import { questionTypeLabels } from "./mock-data";
import { QuestionTypeBadge } from "./question-presentation";
import {
  BlueprintDialog,
  PoolPreview,
  BlueprintQuizLinks,
  Readiness,
  bpPanel,
  bpInput,
} from "./BlueprintUI";
const empty = (contextId?: string): Blueprint => ({
  id: "",
  code: "",
  version: 1,
  title: "",
  description: "",
  topicId: "",
  topicName: "",
  assessmentContextId: contextId,
  totalDurationMinutes: 60,
  passScore: 70,
  status: "draft",
  sections: [],
  updatedAt: "",
});
export function BlueprintEditor({
  blueprint,
  mode = "edit",
  contextId,
}: {
  blueprint?: Blueprint;
  mode?: "new" | "edit";
  contextId?: string;
}) {
  const router = useRouter();
  const [quizBlueprint,setQuizBlueprint]=useState<any>(null);
  const [state, setState] = useState<Blueprint>(() =>
    mode === "new" ? empty(contextId) : blueprint || empty(contextId),
  );
  const saved = useRef(JSON.stringify(state));
  const pending = useRef(false);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fieldError, setFieldError] = useState(""),
    [notice, setNotice] = useState("");
  const [topics, setTopics] = useState<any[]>([]),
    [levels, setLevels] = useState<any[]>([]),
    [audiences, setAudiences] = useState<any[]>([]),
    [contexts, setContexts] = useState<any[]>([]),
    [metadataError, setMetadataError] = useState(""),
    [reload, setReload] = useState(0);
  const [tab, setTab] = useState(0),
    [result, setResult] = useState<any>(null),
    [picker, setPicker] = useState<number | null>(null),
    [query, setQuery] = useState(""),
    [page, setPage] = useState(1),
    [bank, setBank] = useState<any>({ items: [], total: 0 }),
    [bankError, setBankError] = useState(""),
    [bankLoading, setBankLoading] = useState(false);
  const activeContext = contextId || state.assessmentContextId;
  const dirty = JSON.stringify(state) !== saved.current;
  useEffect(() => {
    let active = true;
    setMetadataError("");
    Promise.all([
      fetchAssessmentContexts(),
      fetchTopics(activeContext),
      fetchDifficultyLevels(),
      fetchAudienceLevels(),
    ])
      .then(([c, t, l, a]) => {
        if (active) {
          setContexts(c);
          setTopics(t);
          setLevels(l);
          setAudiences(a);
        }
      })
      .catch(
        () => active && setMetadataError("Лавлах мэдээлэл татаж чадсангүй."),
      );
    return () => {
      active = false;
    };
  }, [activeContext, reload]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    const links = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      if (
        dirty &&
        a?.href &&
        !a.href.endsWith("#") &&
        !window.confirm("Хадгалаагүй өөрчлөлт байна. Гарах уу?")
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", warn);
    document.addEventListener("click", links, true);
    return () => {
      window.removeEventListener("beforeunload", warn);
      document.removeEventListener("click", links, true);
    };
  }, [dirty]);
  useEffect(() => {
    if (picker === null || !activeContext) return;
    let active = true;
    setBankLoading(true);
    setBankError("");
    const timer = setTimeout(
      () =>
        fetchBlueprintCandidates({
          assessmentContextId: activeContext,
          search: query,
          page: String(page),
        })
          .then((r) => active && setBank(r))
          .catch((e) => active && setBankError(e.message))
          .finally(() => active && setBankLoading(false)),
      200,
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [picker, activeContext, query, page, reload]);
  const ctx = contexts.find((c) => c.id === activeContext);
  const actualLevels = levels.filter(
    (l) => l.difficultyScaleId === ctx?.difficultyScaleId,
  );
  const actualAudiences = audiences.filter(
    (a) => a.audienceTypeId === ctx?.audienceTypeId,
  );
  function patch(p: Partial<Blueprint>) {
    setState((s) => ({ ...s, ...p }));
    setResult(null);
    setNotice("");
  }
  function section(i: number, p: Partial<BlueprintSection>) {
    patch({
      sections: state.sections.map((s, j) => (i === j ? { ...s, ...p } : s)),
    });
  }
  function add() {
    patch({
      sections: [
        ...state.sections,
        {
          id: "new-" + crypto.randomUUID(),
          name: `Сан ${state.sections.length + 1}`,
          description: "",
          sectionMode: "FIXED",
          selectionRules: { schemaVersion: 1 },
          selectedQuestionIds: [],
          randomPickCount: 1,
          pointsPerQuestion: 1,
          durationMinutes: 0,
          strategy: "random",
        },
      ],
    });
  }
  async function action(kind: "save" | "preview" | "quiz") {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError("");
    setFieldError("");
    try {
      if (!state.title.trim())
        throw Object.assign(new Error("Blueprint нэр шаардлагатай."), {
          field: "name",
        });
      if (!activeContext) throw new Error("Контекст сонгоно уу.");
      let value = { ...state, assessmentContextId: activeContext };
      if (kind === "preview") {
        setResult(await previewBlueprint(value));
        setTab(2);
        return;
      }
      const payload = {
        ...value,
        ...(!(value.code || "").trim() ? { code: undefined } : {}),
      };
      const stored = state.id
        ? await updateBlueprint(state.id, payload)
        : await createBlueprint(payload);
      saved.current = JSON.stringify(stored);
      setState(stored);
      setResult(stored.readiness);
      setNotice("Хадгалагдлаа.");
      if (kind === "quiz") {
        if (stored.readiness?.status !== "READY") {
          setTab(2);
          throw new Error("Quiz үүсгэхийн өмнө доорх зөрчлүүдийг засна уу.");
        }
        setQuizBlueprint(stored);
      }
      if (!state.id)
        router.replace(
          `/assessor/context/${activeContext}/blueprints/${stored.id}`,
        );
    } catch (e: any) {
      setError(e.message || "Үйлдэл амжилтгүй.");
      setFieldError(e.field || "");
      if (e.issues) setResult({ status: "NEEDS_ATTENTION", issues: e.issues });
    } finally {
      setBusy(false);
      pending.current = false;
    }
  }
  async function reselect(id:string){
    if(dirty&&!window.confirm('Хадгалаагүй өөрчлөлтөө орхих уу?'))return;
    router.push('/assessor/quizzes/'+id);
  }
  const number = (value: string) => (value === "" ? 0 : Number(value));
  return (
    <main className="mx-auto min-w-0 max-w-6xl space-y-5 p-4 sm:p-6">
      <header
        className={`${bpPanel} flex flex-wrap items-start justify-between gap-4`}
      >
        <div>
          <button
            className="mb-3 text-sm text-primary"
            onClick={() => {
              if (!dirty || window.confirm("Хадгалаагүй өөрчлөлтөө орхих уу?"))
                router.push(
                  activeContext
                    ? `/assessor/context/${activeContext}/blueprints`
                    : "/assessor/blueprints",
                );
            }}
          >
            ← Blueprint жагсаалт
          </button>
          <h1 className="text-2xl font-bold">
            {state.title || "Шинэ Blueprint"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {ctx?.name || "Контекст сонгоно уу"} ·{" "}
            {state.status === "archived" ? "Архивлагдсан" : "Ноорог"} · Хувилбар{" "}
            {state.version || 1}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={busy || !!metadataError}
            onClick={() => action("preview")}
          >
            Бэлэн эсэхийг шалгах
          </Button>
          <Button
            disabled={busy || !!metadataError}
            onClick={() => action("save")}
          >
            {busy ? "Ажиллаж байна…" : "Хадгалах"}
          </Button>
        </div>
      </header>
      {metadataError && (
        <div role="alert" className={bpPanel}>
          {metadataError}
          <Button variant="outline" onClick={() => setReload((v) => v + 1)}>
            Дахин оролдох
          </Button>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-900"
        >
          {error}
          {fieldError && <p className="mt-1 text-xs">Талбар: {fieldError}</p>}
          {(error.includes("өөрчлөгдсөн") || error.includes("шинэчилсэн")) && (
            <p className="mt-2 text-sm">
              Таны бичсэн өөрчлөлт энэ дэлгэцэд хэвээр. Дахин ачаалахаас өмнө
              хуулж авна уу.
            </p>
          )}
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="rounded-xl bg-emerald-50 p-4 text-emerald-900"
        >
          {notice}
        </p>
      )}
      <nav
        className="flex gap-2 overflow-x-auto"
        aria-label="Засварлагчийн хэсгүүд"
      >
        {["1. Ерөнхий", "2. Асуултын сангууд", "3. Шалгах ба ашиглах"].map(
          (label, i) => (
            <button
              key={label}
              aria-current={tab === i ? "step" : undefined}
              onClick={() => setTab(i)}
              className={`shrink-0 rounded-lg px-4 py-3 text-sm font-semibold ${tab === i ? "bg-primary text-primary-foreground" : "bg-surface"}`}
            >
              {label}
            </button>
          ),
        )}
      </nav>
      {tab === 0 && (
        <section className={`${bpPanel} grid gap-4 sm:grid-cols-2`}>
          {!contextId && !state.id && (
            <label className="sm:col-span-2">
              Контекст
              <select
                aria-label="Контекст"
                className={bpInput}
                value={activeContext || ""}
                onChange={(e) =>
                  patch({
                    assessmentContextId: e.target.value,
                    topicId: "",
                    sections: [],
                  })
                }
              >
                <option value="">Сонгоно уу</option>
                {contexts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            Нэр
            <input
              aria-label="Нэр"
              className={bpInput}
              value={state.title}
              onChange={(e) => patch({ title: e.target.value })}
              maxLength={200}
            />
          </label>
          <label>
            Код
            <input
              aria-label="Код"
              className={bpInput}
              value={state.code || ""}
              placeholder="Хоосон бол автоматаар үүсгэнэ"
              onChange={(e) => patch({ code: e.target.value })}
            />
          </label>
          <label className="sm:col-span-2">
            Тайлбар
            <textarea
              aria-label="Тайлбар"
              className={bpInput}
              value={state.description}
              onChange={(e) => patch({ description: e.target.value })}
            />
          </label>
          <label>
            Үндсэн сэдэв
            <select
              aria-label="Үндсэн сэдэв"
              className={bpInput}
              value={state.topicId}
              onChange={(e) => patch({ topicId: e.target.value })}
            >
              <option value="">Тохируулаагүй</option>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title || t.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Нийт хугацаа (минут)
            <input
              aria-label="Нийт хугацаа"
              type="number"
              min={1}
              max={1440}
              className={bpInput}
              value={state.totalDurationMinutes}
              onChange={(e) =>
                patch({ totalDurationMinutes: number(e.target.value) })
              }
            />
          </label>
          <label>
            Тэнцэх босго (%)
            <input
              aria-label="Тэнцэх босго"
              type="number"
              min={0}
              max={100}
              step="0.1"
              className={bpInput}
              value={state.passScore}
              onChange={(e) => patch({ passScore: number(e.target.value) })}
            />
          </label>
        </section>
      )}
      {tab === 1 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Quiz үүсгэхэд асуултуудыг нэг удаа сонгож тогтооно.
            </p>
            <Button onClick={add}>+ Сан нэмэх</Button>
          </div>
          {!state.sections.length && (
            <p className={bpPanel}>
              Асуултын сан байхгүй. Сан нэмээд тохируулна уу.
            </p>
          )}
          {state.sections.map((s, i) => (
            <section key={s.id} className={`${bpPanel} space-y-4`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-semibold">Сан {i + 1}</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={i === 0}
                    onClick={() => {
                      const a = [...state.sections];
                      [a[i - 1], a[i]] = [a[i], a[i - 1]];
                      patch({ sections: a });
                    }}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="outline"
                    disabled={i === state.sections.length - 1}
                    onClick={() => {
                      const a = [...state.sections];
                      [a[i + 1], a[i]] = [a[i], a[i + 1]];
                      patch({ sections: a });
                    }}
                  >
                    ↓
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      patch({
                        sections: [
                          ...state.sections,
                          {
                            ...s,
                            id: "new-" + crypto.randomUUID(),
                            name: s.name + " — хуулбар",
                            selectedQuestionIds: [...s.selectedQuestionIds],
                          },
                        ],
                      })
                    }
                  >
                    Сан хуулах
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (window.confirm("Энэ санг загвараас хасах уу?"))
                        patch({
                          sections: state.sections.filter((_, j) => j !== i),
                        });
                    }}
                  >
                    Сан устгах
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label>
                  Сангийн нэр
                  <input
                    aria-label={`Сан ${i + 1} нэр`}
                    className={bpInput}
                    value={s.name}
                    onChange={(e) => section(i, { name: e.target.value })}
                  />
                </label>
                <label>
                  Горим
                  <select
                    aria-label={`Сан ${i + 1} горим`}
                    className={bpInput}
                    value={s.sectionMode || "FIXED"}
                    onChange={(e) => {
                      if (
                        s.selectedQuestionIds.length &&
                        e.target.value === "RULE_BASED" &&
                        !window.confirm(
                          "Дүрмийн горимд шилжихэд сонгосон асуултуудыг цэвэрлэх үү?",
                        )
                      )
                        return;
                      section(i, {
                        sectionMode: e.target.value as any,
                        selectedQuestionIds:
                          e.target.value === "RULE_BASED"
                            ? []
                            : s.selectedQuestionIds,
                        selectionRules: { schemaVersion: 1 },
                      });
                    }}
                  >
                    <option value="FIXED">Сонгосон сан</option>
                    <option value="RULE_BASED">Дүрмийн сан</option>
                  </select>
                </label>
                <label>
                  Сонгох тоо
                  <input
                    aria-label={`Сан ${i + 1} сонгох тоо`}
                    type="number"
                    min={0}
                    max={500}
                    className={bpInput}
                    value={s.randomPickCount}
                    onChange={(e) =>
                      section(i, { randomPickCount: number(e.target.value) })
                    }
                  />
                </label>
                <label>
                  Оноо / асуулт
                  <input
                    aria-label={`Сан ${i + 1} оноо`}
                    type="number"
                    min={0}
                    step="0.25"
                    className={bpInput}
                    value={s.pointsPerQuestion}
                    onChange={(e) =>
                      section(i, { pointsPerQuestion: number(e.target.value) })
                    }
                  />
                </label>
                <label className="sm:col-span-2">
                  Сангийн тайлбар
                  <textarea
                    aria-label={`Сан ${i + 1} тайлбар`}
                    className={bpInput}
                    value={s.description}
                    onChange={(e) =>
                      section(i, { description: e.target.value })
                    }
                  />
                </label>
              </div>
              {s.sectionMode === "RULE_BASED" ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Нэг бүлгийн сонголтуудын аль нэг, бүлгүүдийн бүх нөхцөлийг
                    хангана. Сонгоогүй бүлэг нэмэлт хязгаар тавихгүй.
                  </p>
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      [
                        "topicIds",
                        "Сэдэв",
                        topics.map((t) => ({
                          id: t.id,
                          name: t.title || t.name,
                        })),
                      ],
                      [
                        "types",
                        "Асуултын төрөл",
                        Object.entries(questionTypeLabels).map(
                          ([id, name]) => ({ id, name }),
                        ),
                      ],
                      ["difficultyLevelIds", "Хүндрэлийн түвшин", actualLevels],
                      ["audienceLevelIds", "Audience түвшин", actualAudiences],
                    ].map(([key, label, values]: any) => (
                      <fieldset key={key} className="rounded-lg border p-3">
                        <legend className="px-1 text-sm font-semibold">
                          {label}
                        </legend>
                        <div className="max-h-44 space-y-2 overflow-y-auto">
                          {values.map((v: any) => (
                            <label
                              key={v.id}
                              className="flex items-center gap-2 text-sm"
                            >
                              <input
                                type="checkbox"
                                checked={(
                                  (s.selectionRules as any)?.[key] || []
                                ).includes(v.id)}
                                onChange={() => {
                                  const old =
                                    (s.selectionRules as any)?.[key] || [];
                                  section(i, {
                                    selectionRules: {
                                      schemaVersion: 1,
                                      ...s.selectionRules,
                                      [key]: old.includes(v.id)
                                        ? old.filter(
                                            (id: string) => id !== v.id,
                                          )
                                        : [...old, v.id],
                                    },
                                  });
                                }}
                              />
                              {v.name}
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={s.selectionRules?.includeDescendants !== false}
                      onChange={(e) =>
                        section(i, {
                          selectionRules: {
                            schemaVersion: 1,
                            ...s.selectionRules,
                            includeDescendants: e.target.checked,
                          },
                        })
                      }
                    />
                    Сэдвийн дэд сэдвүүдийг хамруулах
                  </label>
                </div>
              ) : (
                <div>
                  <p className="mb-3 text-sm">
                    Сонгосон холбоос: {s.selectedQuestionIds.length}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setPicker(i);
                      setQuery("");
                      setPage(1);
                    }}
                  >
                    Асуулт сонгох / хасах
                  </Button>
                </div>
              )}
            </section>
          ))}
        </div>
      )}
      {tab === 2 && (
        <section className={`${bpPanel} space-y-4`}>
          {result ? (
            <PoolPreview result={result} />
          ) : (
            <p>Одоогийн тохиргоог серверээр шалгана уу.</p>
          )}
          <BlueprintQuizLinks blueprint={state} onReselect={reselect} busy={busy}/>
          <Button
            disabled={busy || state.status === "archived"}
            onClick={() => action("quiz")}
          >
            Хадгалаад Quiz үүсгэх
          </Button>
          <p className="text-xs text-muted-foreground">
            Өмнөх Quiz болон эхэлсэн оролдлогууд өөрчлөгдөхгүй.
          </p>
        </section>
      )}
      {picker !== null && (
        <BlueprintDialog
          title="Нийтлэгдсэн асуултын сан"
          onClose={() => setPicker(null)}
        >
          <label>
            Хайх
            <input
              aria-label="Асуултаас хайх"
              className={bpInput}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </label>
          <p className="my-3 text-sm">
            Сонгосон {state.sections[picker].selectedQuestionIds.length} · Нийт
            боломжтой {bank.total}
          </p>
          {bankError && (
            <p role="alert">
              {bankError}
              <Button onClick={() => setReload((n) => n + 1)}>
                Дахин оролдох
              </Button>
            </p>
          )}
          {bankLoading ? (
            <p>Ачаалж байна…</p>
          ) : (
            <div className="space-y-2">
              {bank.items.map((q: any) => (
                <label
                  key={q.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <input
                    type="checkbox"
                    aria-label={`Сонгох ${q.code}`}
                    checked={state.sections[
                      picker
                    ].selectedQuestionIds.includes(q.id)}
                    onChange={() => {
                      const old = state.sections[picker].selectedQuestionIds;
                      section(picker, {
                        selectedQuestionIds: old.includes(q.id)
                          ? old.filter((id) => id !== q.id)
                          : [...old, q.id],
                      });
                    }}
                  />
                  <span className="min-w-0">
                    <b className="block text-sm">
                      {q.code} · {q.title}
                    </b>
                    <span className="mt-2 block text-xs">
                      <QuestionTypeBadge type={q.type} />
                      {
                        actualLevels.find((l) => l.id === q.difficultyLevelId)
                          ?.name
                      }{" "}
                      · Нийтлэгдсэн
                    </span>
                  </span>
                </label>
              ))}
            </div>
          )}
          <div className="my-4 flex justify-between">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Өмнөх
            </Button>
            <span>
              {page} / {Math.max(1, Math.ceil(bank.total / 20))}
            </span>
            <Button
              variant="outline"
              disabled={page * 20 >= bank.total}
              onClick={() => setPage((p) => p + 1)}
            >
              Дараах
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              if (
                window.confirm(
                  "Энэ сангийн бүх сонгосон холбоосыг цэвэрлэх үү?",
                )
              )
                section(picker, { selectedQuestionIds: [] });
            }}
          >
            Бүх сонголт цэвэрлэх
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Зөвхөн таны контекстэд хамаарах, runtime дэмждэг хүчинтэй
            нийтлэгдсэн хувилбарууд. Хуучин хүчингүй холбоосуудыг бэлэн эсэхийн
            шалгалтаар харуулна.
          </p>
        </BlueprintDialog>
      )}
      {quizBlueprint&&<QuizCreateDialog blueprint={quizBlueprint} onClose={()=>setQuizBlueprint(null)}/>}
    </main>
  );
}
