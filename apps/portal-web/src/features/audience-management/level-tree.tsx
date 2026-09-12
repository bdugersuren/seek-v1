import React from "react";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  GraduationCap,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
export type TreeLevel = { id: string; parentId?: string | null; name: string; code: string; orderIndex: number; isActive: boolean; levelKind?: string | null };
import { useI18n } from "@/i18n/use-t";
export function descendants<T extends Pick<TreeLevel, "id" | "parentId">>(levels: T[], id: string): Set<string> {
  const found = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const l of levels)
      if (l.parentId && found.has(l.parentId) && !found.has(l.id)) {
        found.add(l.id);
        changed = true;
      }
  }
  return found;
}
export function LevelTree<T extends TreeLevel>({
  levels,
  collapsed,
  toggle,
  add,
  edit,
  remove,
}: {
  levels: T[];
  collapsed: Set<string>;
  toggle: (id: string) => void;
  add: (id: string) => void;
  edit: (l: T) => void;
  remove: (l: T) => void;
}) {
  const { t } = useI18n();
  const render = (parent: string | null, seen: Set<string>): React.ReactNode =>
    levels
      .filter((l) => (l.parentId || null) === parent && !seen.has(l.id))
      .sort(
        (a, b) => a.orderIndex - b.orderIndex || a.code.localeCompare(b.code),
      )
      .map((l) => {
        const count = levels.filter((x) => x.parentId === l.id).length;
        const open = !collapsed.has(l.id);
        return (
          <li key={l.id} className="min-w-0">
            <div
              className={`flex flex-wrap items-center gap-2 border-b border-border px-2 py-3 hover:bg-primary/5 ${!l.isActive ? "opacity-60" : ""}`}
            >
              {count ? (
                <button
                  aria-label={`${open ? t("audience.collapse") : t("audience.expand")} ${l.name}`}
                  aria-expanded={open}
                  onClick={() => toggle(l.id)}
                >
                  {open ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              ) : (
                <span className="w-4" />
              )}
              {l.levelKind === "GROUP" || count ? (
                <Folder size={17} className="text-primary" />
              ) : (
                <GraduationCap size={17} />
              )}
              <span className="text-xs text-muted-foreground">
                #{l.orderIndex}
              </span>
              <span className="min-w-0 grow basis-[60%] break-words text-sm font-medium sm:basis-0">
                {l.name}{" "}
                <span className="text-xs text-muted-foreground">
                  ({l.code})
                </span>
              </span>
              <span
                className={`rounded px-2 text-xs ${l.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
              >
                {t(l.isActive ? "audience.active" : "audience.inactive")}
              </span>
              {count > 0 && (
                <span className="text-xs text-muted-foreground">
                  {count} {t("audience.levels")}
                </span>
              )}
              <button
                aria-label={`${t("audience.childAdd")} ${l.name}`}
                title={t("audience.childAdd")}
                className="text-primary"
                onClick={() => add(l.id)}
              >
                <Plus size={16} />
              </button>
              <button
                aria-label={`${t("audience.edit")} ${l.name}`}
                onClick={() => edit(l)}
              >
                <Pencil size={15} />
              </button>
              <button
                aria-label={`${t("audience.delete")} ${l.name}`}
                onClick={() => remove(l)}
              >
                <Trash2 size={15} />
              </button>
            </div>
            {open && count > 0 && (
              <ul className="ml-3 border-l border-border pl-2">
                {render(l.id, new Set(Array.from(seen).concat(l.id)))}
              </ul>
            )}
          </li>
        );
      });
  return (
    <ul aria-label={t("audience.hierarchy")}>{render(null, new Set())}</ul>
  );
}
