"use client";

import { useEffect, useRef, useState } from "react";
import { Badge, Text } from "@seek/ui";

export interface RichEditorValue {
  json: null;
  html: string;
  markdown: string;
}

interface QuestionRichEditorProps {
  label: string;
  initialContent?: string;
  minHeight?: string;
  onChange?: (value: RichEditorValue) => void;
}

export function QuestionRichEditor({
  label,
  initialContent,
  minHeight = "12rem",
  onChange,
}: QuestionRichEditorProps) {
  const [markdown, setMarkdown] = useState(() => normalizeInitialMarkdown(initialContent));
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const next = normalizeInitialMarkdown(initialContent);
    setMarkdown(next);
    onChange?.({ json: null, html: "", markdown: next });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialContent]);

  const updateMarkdown = (next: string) => {
    setMarkdown(next);
    onChange?.({ json: null, html: "", markdown: next });
  };

  const insertSnippet = (snippet: string, selectOffset = snippet.length) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      updateMarkdown(`${markdown}${snippet}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const next = `${markdown.slice(0, start)}${snippet}${markdown.slice(end)}`;
    updateMarkdown(next);

    window.requestAnimationFrame(() => {
      textarea.focus();
      const cursor = start + selectOffset;
      textarea.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="rounded-seek-lg border border-border bg-surface">
      <div className="flex flex-col gap-seek-2 border-b border-border p-seek-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Text className="font-semibold">{label}</Text>
          <Text variant="muted" className="text-xs">
            Raw markdown · LaTeX · table · media placeholder
          </Text>
        </div>
        <Badge variant="secondary">Markdown</Badge>
      </div>

      <div className="question-rich-toolbar">
        <div className="question-rich-toolbar-group">
          <ToolbarButton title="Undo" disabled onClick={() => undefined}>
            ↶
          </ToolbarButton>
          <ToolbarButton title="Redo" disabled onClick={() => undefined}>
            ↷
          </ToolbarButton>
        </div>
        <div className="question-rich-toolbar-group">
          <ToolbarButton title="Bold" onClick={() => insertSnippet("**bold**", 2)}>
            B
          </ToolbarButton>
          <ToolbarButton title="Italic" onClick={() => insertSnippet("_italic_", 1)}>
            <span className="italic">/</span>
          </ToolbarButton>
          <ToolbarButton title="Underline placeholder" onClick={() => insertSnippet("<u>text</u>", 3)}>
            <span className="underline">U</span>
          </ToolbarButton>
          <ToolbarButton title="Strike" onClick={() => insertSnippet("~~strike~~", 2)}>
            <span className="line-through">T</span>
          </ToolbarButton>
        </div>
        <div className="question-rich-toolbar-group">
          <ToolbarButton title="Heading" onClick={() => insertSnippet("### Гарчиг\n", 11)}>
            A<sup>+</sup>
          </ToolbarButton>
          <ToolbarButton title="Small text marker" onClick={() => insertSnippet("<small>text</small>", 7)}>
            A-
          </ToolbarButton>
          <ToolbarButton title="Clear formatting marker" onClick={() => insertSnippet("`raw`", 1)}>
            A×
          </ToolbarButton>
        </div>
        <div className="question-rich-toolbar-group">
          <ToolbarButton title="Bullet list" onClick={() => insertSnippet("\n- Жагсаалт\n")}>
            ≡
          </ToolbarButton>
          <ToolbarButton title="Numbered list" onClick={() => insertSnippet("\n1. Жагсаалт\n")}>
            1≡
          </ToolbarButton>
          <ToolbarButton title="Inline math" onClick={() => insertSnippet("$\\frac{x-1}{x^2-1}$", 1)}>
            √
          </ToolbarButton>
        </div>
        <div className="question-rich-toolbar-group">
          <ToolbarButton
            title="Table"
            onClick={() =>
              insertSnippet("\n|№|Асуулт|\n|---|---|\n|1|Асуулт-1|\n|2|Асуулт-2|\n")
            }
          >
            ▦
          </ToolbarButton>
          <ToolbarButton title="Image" onClick={() => insertSnippet("\n![Зураг](image-placeholder.png)\n")}>
            ▧
          </ToolbarButton>
          <ToolbarButton title="Block math" onClick={() => insertSnippet("\n$$\n\\sum_{i=1}^{n} x_i\n$$\n", 4)}>
            ∑
          </ToolbarButton>
        </div>
        <div className="question-rich-toolbar-group question-rich-toolbar-source">
          <ToolbarButton active title="Raw markdown editor" onClick={() => textareaRef.current?.focus()}>
            {"</>"}
          </ToolbarButton>
        </div>
      </div>

      <div className="p-seek-4">
        <textarea
          ref={textareaRef}
          value={markdown}
          onChange={(event) => updateMarkdown(event.target.value)}
          className="min-h-[var(--editor-min-height)] w-full resize-y rounded-seek-md border border-border bg-muted-background p-seek-3 font-mono text-sm leading-7 text-foreground outline-none transition-colors focus:border-primary focus:bg-surface focus:ring-2 focus:ring-primary/20"
          style={{ "--editor-min-height": minHeight } as React.CSSProperties}
          aria-label={`${label} raw markdown`}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

function normalizeInitialMarkdown(content?: string) {
  if (!content?.trim()) return "";

  return content
    .replace(/<\/p>\s*<p>/g, "\n\n")
    .replace(/^<p>/, "")
    .replace(/<\/p>$/, "")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<table><tbody>/g, "\n")
    .replace(/<\/tbody><\/table>/g, "\n")
    .replace(/<tr>/g, "|")
    .replace(/<\/tr>/g, "\n")
    .replace(/<t[hd]>/g, "")
    .replace(/<\/t[hd]>/g, "|")
    .trim();
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      className={`question-rich-toolbar-button ${
        active ? "question-rich-toolbar-button-active" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
