"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  Switch,
  PageContainer,
  useToast,
} from "@seek/ui";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useI18n } from "@/i18n/use-t";
import type { CognitiveFramework, CognitiveLevel } from "@/features/cognitive-management/types";
import {
  fetchCognitiveFrameworks,
  fetchCognitiveLevels,
  createCognitiveFramework,
  updateCognitiveFramework,
  deleteCognitiveFramework,
  createCognitiveLevel,
  updateCognitiveLevel,
  deleteCognitiveLevel,
} from "@/features/assessor-workspace/api";
import { FormModal } from "@/features/audience-management/form-modal";
import {
  LevelTree,
  descendants,
} from "@/features/audience-management/level-tree";

type Form = {
  name: string;
  code: string;
  description: string;
  isActive: boolean;
  parentId: string;
  orderIndex: number;
  frameworkVersion: string;
  icon: string;
  reportBucket: string;
};
type Editor = {
  kind: "type" | "level";
  id?: string;
  typeId?: string;
  initial: Form;
};
const empty: Form = {
  name: "",
  code: "",
  description: "",
  isActive: true,
  parentId: "",
  orderIndex: 1,
  frameworkVersion: "",
  icon: "",
  reportBucket: "",
};
export default function CognitiveFrameworkManagementPage() {
  const { t } = useI18n();
  const { showToast } = useToast();
  const [types, setTypes] = useState<CognitiveFramework[]>([]),
    [levels, setLevels] = useState<(CognitiveLevel & {orderIndex: number})[]>([]),
    [selected, setSelected] = useState(""),
    [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true),
    [loadingLevels, setLoadingLevels] = useState(false),
    [error, setError] = useState(""),
    [levelError, setLevelError] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set()),
    [editor, setEditor] = useState<Editor | null>(null),
    [form, setForm] = useState<Form>(empty),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState("");
  const request = useRef(0);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;
  const message = (e: unknown) => {
    const a = e as { status?: number; code?: string };
    return t(
      a.status === 401 || a.status === 403
        ? "audience.denied"
        : a.code === "IN_USE"
          ? "audience.inUse"
          : a.code === "DUPLICATE_CODE_OR_RANK"
            ? "cognitive.duplicate"
            : a.status === 400
              ? "audience.invalid"
              : "audience.failed",
    );
  };
  const loadTypes = async (preferred?: string) => {
    setLoading(true);
    setError("");
    try {
      const rows = await fetchCognitiveFrameworks();
      setTypes(rows);
      setSelected((current) =>
        rows.some((x) => x.id === (preferred ?? current))
          ? (preferred ?? current)
          : rows[0]?.id || "",
      );
    } catch (e) {
      setError(message(e));
    } finally {
      setLoading(false);
    }
  };
  const loadLevels = async (id: string) => {
    const seq = ++request.current;
    setLoadingLevels(true);
    setLevelError("");
    try {
      const rows = await fetchCognitiveLevels(id);
      if (seq === request.current && selectedRef.current === id)
        setLevels(rows.map(row => ({...row, orderIndex: row.rank})));
    } catch (e) {
      if (seq === request.current) setLevelError(message(e));
    } finally {
      if (seq === request.current) setLoadingLevels(false);
    }
  };
  useEffect(() => {
    void loadTypes();
  }, []);
  useEffect(() => {
    setLevels([]);
    setCollapsed(new Set());
    if (selected) void loadLevels(selected);
    else {
      ++request.current;
      setLoadingLevels(false);
      setLevelError("");
    }
  }, [selected]);
  const chosen = types.find((x) => x.id === selected);
  const open = (
    kind: "type" | "level",
    record?: CognitiveFramework | CognitiveLevel,
    parentId = "",
  ) => {
    const level = record as CognitiveLevel | undefined;
    const initial: Form = record
      ? {
          ...empty,
          name: record.name,
          code: record.code,
          isActive: record.isActive,
          description: (record as CognitiveFramework).description || "",
          parentId: level?.parentId || "",
          orderIndex: level?.rank ?? 1,
          frameworkVersion: (record as CognitiveFramework).frameworkVersion || "",
          icon: level?.icon || "",
          reportBucket: level?.reportBucket || "",
        }
      : {
          ...empty,
          parentId,
          orderIndex:
            Math.max(
              0,
              ...levels
                .map((l) => l.orderIndex),
            ) + 1,
        };
    setForm(initial);
    setFormError("");
    setEditor({ kind, id: record?.id, typeId: selected, initial });
  };
  const change = <K extends keyof Form>(key: K, value: Form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || busy) return;
    setBusy(true);
    setFormError("");
    try {
      if (editor.kind === "type") {
        const payload = {
          name: form.name.trim(),
          code: form.code,
          description: form.description || null,
          frameworkVersion: form.frameworkVersion || null,
          isActive: form.isActive,
        };
        const row = editor.id
          ? await updateCognitiveFramework(editor.id, payload)
          : await createCognitiveFramework(payload);
        await loadTypes(row.id);
      } else {
        const payload = {
          cognitiveFrameworkId: editor.typeId!,
          name: form.name.trim(),
          code: form.code,
          parentId: form.parentId || null,
          rank: form.orderIndex,
          description: form.description || null,
          icon: form.icon || null,
          reportBucket: form.reportBucket || null,
          isActive: form.isActive,
        };
        if (editor.id) await updateCognitiveLevel(editor.id, payload);
        else await createCognitiveLevel(payload);
        setCollapsed((old) => {
          const next = new Set(old);
          next.delete(form.parentId);
          return next;
        });
        await Promise.all([
          loadTypes(editor.typeId),
          loadLevels(editor.typeId!),
        ]);
      }
      setEditor(null);
      showToast(t("audience.saved"), "success");
    } catch (e) {
      setFormError(message(e));
    } finally {
      setBusy(false);
    }
  };
  const remove = async (kind: "type" | "level", id: string) => {
    if (!window.confirm(t("audience.confirmDelete"))) return;
    try {
      if (kind === "type") {
        await deleteCognitiveFramework(id);
        await loadTypes();
      } else {
        await deleteCognitiveLevel(id);
        await Promise.all([loadTypes(), loadLevels(selected)]);
      }
    } catch (e) {
      showToast(message(e), "danger");
    }
  };
  const excluded =
    editor?.kind === "level" && editor.id
      ? descendants(levels, editor.id)
      : new Set<string>();
  const field = (label: string, children: React.ReactElement) => (
    <label className="block space-y-1.5 text-sm font-medium">
      {label}
      {React.cloneElement(children, { "aria-label": label })}
    </label>
  );
  const skeleton = (
    <div
      role="status"
      aria-label={t("audience.saving")}
      className="space-y-3 p-4 animate-pulse"
    >
      {[1, 2, 3].map((n) => (
        <div key={n} className="h-12 rounded bg-muted" />
      ))}
    </div>
  );
  const failure = (text: string, retry: () => void) => (
    <div role="alert" className="space-y-3 p-5 text-sm">
      <p>{text}</p>
      <Button variant="outline" onClick={retry}>
        {t("audience.retry")}
      </Button>
    </div>
  );
  return (
    <PageContainer>
      <h1 className="mb-5 text-xl font-semibold">{t("cognitive.title")}</h1>
      <div className="grid min-w-0 grid-cols-1 overflow-hidden rounded-xl border border-border bg-surface md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-3 border-b border-border p-4 md:border-b-0 md:border-r">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <Input
              aria-label={t("cognitive.search")}
              placeholder={t("cognitive.search")}
              className="pl-9 text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button className="w-full gap-1 text-sm" onClick={() => open("type")}>
            <Plus size={15} />
            {t("cognitive.newType")}
          </Button>
          {loading ? (
            skeleton
          ) : error ? (
            failure(error, () => void loadTypes())
          ) : types.length === 0 ? (
            <p className="py-5 text-sm text-muted-foreground">
              {t("cognitive.emptyTypes")}
            </p>
          ) : (
            <div className="space-y-2">
              {types
                .filter((x) =>
                  `${x.name} ${x.code}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
                )
                .map((x) => (
                  <div
                    key={x.id}
                    className={`flex items-center gap-2 rounded-lg border p-3 ${selected === x.id ? "border-primary bg-primary/5" : "border-border"}`}
                  >
                    <button
                      className="min-w-0 flex-1 text-left"
                      aria-pressed={selected === x.id}
                      onClick={() => setSelected(x.id)}
                    >
                      <span className="block break-words text-sm font-semibold">
                        {x.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({x.code})
                      </span>
                      <span className="mt-1 block text-xs text-primary">
                        {x.levelCount ?? 0} {t("audience.levels")}
                        {!x.isActive ? ` · ${t("audience.inactive")}` : ""}
                      </span>
                    </button>
                    <button
                      aria-label={`${t("audience.edit")} ${x.name}`}
                      className="text-primary"
                      onClick={() => open("type", x)}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      aria-label={`${t("audience.delete")} ${x.name}`}
                      onClick={() => void remove("type", x.id)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              {!types.some((x) =>
                `${x.name} ${x.code}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              ) && <p className="text-sm">{t("audience.noResults")}</p>}
            </div>
          )}
        </aside>
        <section className="min-w-0 p-4">
          {chosen ? (
            <>
              <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">
                    {chosen.name} — {t("audience.hierarchy")}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("cognitive.allTypes")} / {chosen.name}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setCollapsed(
                        collapsed.size
                          ? new Set()
                          : new Set(levels.map((x) => x.id)),
                      )
                    }
                  >
                    {t(
                      collapsed.size ? "audience.expand" : "audience.collapse",
                    )}
                  </Button>
                  <Button size="sm" onClick={() => open("level")}>
                    + {t("audience.rootAdd")}
                  </Button>
                </div>
              </header>
              {loadingLevels ? (
                skeleton
              ) : levelError ? (
                failure(levelError, () => void loadLevels(selected))
              ) : levels.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                  {t("audience.emptyLevels")}
                </div>
              ) : (
                <LevelTree
                  levels={levels}
                  collapsed={collapsed}
                  toggle={(id) =>
                    setCollapsed((old) => {
                      const n = new Set(old);
                      n.has(id) ? n.delete(id) : n.add(id);
                      return n;
                    })
                  }
                  add={(id) => open("level", undefined, id)}
                  edit={(l) => open("level", l)}
                  remove={(l) => void remove("level", l.id)}
                />
              )}
            </>
          ) : (
            <p className="p-8 text-center text-muted-foreground">
              {t("cognitive.emptyTypes")}
            </p>
          )}
        </section>
      </div>
      {editor && (
        <FormModal
          title={t(
            editor.kind === "type"
              ? editor.id
                ? "cognitive.editType"
                : "cognitive.newType"
              : editor.id
                ? "audience.editLevel"
                : "audience.newLevel",
          )}
          dirty={JSON.stringify(form) !== JSON.stringify(editor.initial)}
          busy={busy}
          close={() => setEditor(null)}
          submit={save}
          error={formError}
        >
          {editor.kind === "level" &&
            field(
              t("audience.parent"),
              <Select
                value={form.parentId}
                onChange={(e) => change("parentId", e.target.value)}
              >
                <option value="">{t("audience.root")}</option>
                {levels
                  .filter((l) => !excluded.has(l.id))
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.code})
                    </option>
                  ))}
              </Select>,
            )}
          {field(
            t("audience.name"),
            <Input
              required
              value={form.name}
              onChange={(e) => change("name", e.target.value)}
            />,
          )}
          {field(
            t("audience.code"),
            <Input
              required
              readOnly={!!editor.id}
              pattern={editor.id ? undefined : "[A-Z0-9_-]+"}
              value={form.code}
              onChange={(e) => change("code", e.target.value)}
            />,
          )}
          <p className="text-xs text-muted-foreground">
            {t("audience.codeHelp")}
          </p>
          {field(t("audience.description"), <Textarea value={form.description} onChange={e => change("description", e.target.value)} />)}
          {editor.kind === "type" ? field(t("cognitive.version"), <Input value={form.frameworkVersion} onChange={e => change("frameworkVersion", e.target.value)} />) : <>
            <p className="text-xs text-muted-foreground">{t("cognitive.rankHelp")}</p>
            {field(t("audience.order"), <Input type="number" required min={0} max={2147483647} step={1} value={form.orderIndex} onChange={e => change("orderIndex", e.target.valueAsNumber)} />)}
            {field(t("cognitive.bucket"), <Input value={form.reportBucket} onChange={e => change("reportBucket", e.target.value)} />)}
            {field(t("cognitive.icon"), <Input value={form.icon} onChange={e => change("icon", e.target.value)} />)}
          </>}
          <div className="flex items-center justify-between gap-3 pt-2">
            <span className="text-sm font-medium">{t("audience.active")}</span>
            <Switch
              aria-label={t("audience.active")}
              checked={form.isActive}
              onChange={(e) => change("isActive", e.target.checked)}
            />
          </div>
        </FormModal>
      )}
    </PageContainer>
  );
}
