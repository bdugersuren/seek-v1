"use client";
import React, { useEffect, useRef, useId } from "react";
import { createPortal } from "react-dom";
import { Button } from "@seek/ui";
import { X, Layers } from "lucide-react";
import { useI18n } from "@/i18n/use-t";

export function FormModal({
  title,
  dirty,
  busy,
  close,
  submit,
  children,
  error,
}: {
  title: string;
  dirty: boolean;
  busy: boolean;
  close: () => void;
  submit: (e: React.FormEvent) => void;
  children: React.ReactNode;
  error: string;
}) {
  const { t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const heading = useId();
  const latest = useRef({ dirty, busy, close });
  latest.current = { dirty, busy, close };
  const dismiss = () => {
    const v = latest.current;
    if (!v.busy && (!v.dirty || window.confirm(t("audience.discard"))))
      v.close();
  };
  useEffect(() => {
    const old = document.activeElement as HTMLElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    box.current
      ?.querySelector<HTMLElement>("input,select,textarea,button")
      ?.focus();
    return () => {
      document.body.style.overflow = overflow;
      old?.focus();
    };
  }, []);
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/30 p-3"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div
        ref={box}
        role="dialog"
        aria-modal="true"
        aria-labelledby={heading}
        className="max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-xl bg-surface text-foreground shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            dismiss();
          }
          if (e.key === "Tab") {
            const els = Array.from(
              box.current!.querySelectorAll<HTMLElement>(
                'button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]',
              ),
            );
            const first = els[0],
              last = els[els.length - 1];
            if (e.shiftKey && document.activeElement === first) {
              e.preventDefault();
              last?.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              first?.focus();
            }
          }
        }}
      >
        <header className="flex items-center justify-between border-b border-border p-5">
          <h2 id={heading} className="flex items-center gap-3 font-semibold">
            <Layers className="text-primary" size={20} />
            {title}
          </h2>
          <button
            type="button"
            aria-label={t("audience.close")}
            disabled={busy}
            onClick={dismiss}
          >
            <X size={18} />
          </button>
        </header>
        <form onSubmit={submit}>
          <fieldset disabled={busy} className="space-y-4 p-5">
            {children}
            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}
          </fieldset>
          <footer className="flex justify-end gap-3 border-t border-border p-5">
            <Button
              type="button"
              variant="outline"
              disabled={busy}
              onClick={dismiss}
            >
              {t("audience.cancel")}
            </Button>
            <Button type="submit" disabled={busy}>
              {t(busy ? "audience.saving" : "audience.save")}
            </Button>
          </footer>
        </form>
      </div>
    </div>,
    document.body,
  );
}
