"use client";

import { useRef, useState, useCallback } from "react";
import { Text } from "@seek/ui";
import { authFetch } from "@/lib/auth-client";

interface MarkdownEditorProps {
  value: string;
  placeholder?: string;
  onChange: (markdown: string) => void;
  minHeight?: string;
  /** Зураг upload хийх боломжтой эсэх */
  enableImageUpload?: boolean;
}

/**
 * MarkdownEditor — Markdown бичих textarea + toolbar.
 * Bold, Italic, Lists, KaTeX math, Table, Image upload, Mermaid snippet товчлууртай.
 */
export function MarkdownEditor({
  value,
  placeholder = "Markdown бичнэ үү...",
  onChange,
  minHeight = "10rem",
  enableImageUpload = true,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  const insertSnippet = useCallback(
    (snippet: string, cursorOffset?: number) => {
      const textarea = textareaRef.current;
      if (!textarea) {
        onChange(`${value}${snippet}`);
        return;
      }

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const next = `${value.slice(0, start)}${snippet}${value.slice(end)}`;
      onChange(next);

      window.requestAnimationFrame(() => {
        textarea.focus();
        const cursor = start + (cursorOffset ?? snippet.length);
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [value, onChange],
  );

  const wrapSelection = useCallback(
    (prefix: string, suffix: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = value.slice(start, end);
      const wrapped = `${prefix}${selected || "text"}${suffix}`;
      const next = `${value.slice(0, start)}${wrapped}${value.slice(end)}`;
      onChange(next);

      window.requestAnimationFrame(() => {
        textarea.focus();
        if (selected) {
          textarea.setSelectionRange(start, start + wrapped.length);
        } else {
          const cursor = start + prefix.length;
          textarea.setSelectionRange(cursor, cursor + 4);
        }
      });
    },
    [value, onChange],
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      try {
        // 1. Presigned URL авах
        const presignedRes = await authFetch("/api/v1/file/presigned-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: file.name, type: "QUESTION_ATTACHMENT" }),
        });
        const { uploadUrl, storageKey } = await presignedRes.json();

        // 2. MinIO руу хуулах
        await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": file.type || "" },
          body: file,
        });

        // 3. Баталгаажуулах
        await authFetch("/api/v1/file/objects/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            storageKey,
            mimeType: file.type,
            sizeBytes: file.size,
          }),
        });

        // 4. Markdown зурагны синтакс оруулах
        const cdnUrl = `/api/v1/file/objects?storageKey=${encodeURIComponent(storageKey)}`;
        const altText = file.name.replace(/\.[^.]+$/, "");
        insertSnippet(`\n![${altText}](${cdnUrl})\n`);
      } catch (err) {
        console.error("Image upload error:", err);
      } finally {
        setUploading(false);
        e.target.value = "";
      }
    },
    [insertSnippet],
  );

  return (
    <div className="rounded-seek-md border border-border bg-surface overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted-background/50 px-2 py-1.5">
        {/* Text formatting */}
        <ToolbarGroup>
          <TBtn title="Bold (Ctrl+B)" onClick={() => wrapSelection("**", "**")}>
            <span className="font-bold text-xs">B</span>
          </TBtn>
          <TBtn title="Italic (Ctrl+I)" onClick={() => wrapSelection("*", "*")}>
            <span className="italic text-xs">I</span>
          </TBtn>
          <TBtn title="Strikethrough" onClick={() => wrapSelection("~~", "~~")}>
            <span className="line-through text-xs">S</span>
          </TBtn>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarGroup>
          <TBtn title="Bullet list" onClick={() => insertSnippet("\n- ", 3)}>
            <span className="text-xs">• ≡</span>
          </TBtn>
          <TBtn title="Numbered list" onClick={() => insertSnippet("\n1. ", 4)}>
            <span className="text-xs">1. ≡</span>
          </TBtn>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Math */}
        <ToolbarGroup>
          <TBtn title="Inline math ($...$)" onClick={() => insertSnippet("$x^2$", 1)}>
            <span className="text-xs font-mono">√x</span>
          </TBtn>
          <TBtn title="Block math ($$...$$)" onClick={() => insertSnippet("\n$$\n\\sum_{i=1}^{n} x_i\n$$\n", 4)}>
            <span className="text-xs font-mono">∑</span>
          </TBtn>
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Structure */}
        <ToolbarGroup>
          <TBtn
            title="Хүснэгт оруулах"
            onClick={() =>
              insertSnippet("\n| Гарчиг 1 | Гарчиг 2 | Гарчиг 3 |\n| --- | --- | --- |\n| утга 1 | утга 2 | утга 3 |\n| утга 4 | утга 5 | утга 6 |\n")
            }
          >
            <span className="text-xs">▦</span>
          </TBtn>
          {enableImageUpload && (
            <TBtn
              title="Зураг хуулах"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-xs">{uploading ? "⏳" : "🖼"}</span>
            </TBtn>
          )}
          <TBtn
            title="Mermaid диаграм"
            onClick={() =>
              insertSnippet("\n```mermaid\ngraph TD\n    A[Эхлэл] --> B[Дараагийн]\n    B --> C[Дуусгавар]\n```\n")
            }
          >
            <span className="text-xs">◇</span>
          </TBtn>
          <TBtn title="Code блок" onClick={() => insertSnippet("\n```\ncode\n```\n", 5)}>
            <span className="text-xs font-mono">{`</>`}</span>
          </TBtn>
        </ToolbarGroup>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          // Ctrl+B = Bold
          if (e.ctrlKey && e.key === "b") {
            e.preventDefault();
            wrapSelection("**", "**");
          }
          // Ctrl+I = Italic
          if (e.ctrlKey && e.key === "i") {
            e.preventDefault();
            wrapSelection("*", "*");
          }
        }}
        className="min-h-[var(--editor-min-height)] w-full resize-y bg-surface p-seek-3 font-mono text-sm leading-7 text-foreground outline-none transition-colors focus:bg-white placeholder:text-muted-foreground/60"
        style={{ "--editor-min-height": minHeight } as React.CSSProperties}
        spellCheck={false}
      />
    </div>
  );
}

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border" />;
}

function TBtn({
  title,
  disabled,
  onClick,
  children,
}: {
  title: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded hover:bg-surface-hover active:bg-muted-background disabled:opacity-40 transition-colors"
    >
      {children}
    </button>
  );
}

export default MarkdownEditor;
