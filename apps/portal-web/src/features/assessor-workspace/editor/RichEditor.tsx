'use client';

import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Mathematics } from '@tiptap/extension-mathematics';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Markdown } from 'tiptap-markdown';
import type { Node as PMNode } from '@tiptap/pm/model';
import katex from 'katex';
import { useEffect, useRef, useState } from 'react';
import { authFetch } from '@/lib/auth-client';
import { tiptapDocToMarkdown } from './tiptap-to-markdown';

export interface RichEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
}

export function RichEditor({
  value,
  onChange,
  placeholder = '',
  minHeight = '8rem',
  className = '',
  disabled = false,
}: RichEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const skipNextUpdateRef = useRef(false);

  // Raw markdown toggle
  const [showRawMd, setShowRawMd] = useState(false);
  const [rawMdValue, setRawMdValue] = useState('');

  // Math dialog
  const [mathOpen, setMathOpen] = useState(false);
  const [mathLatex, setMathLatex] = useState('');
  const [mathBlock, setMathBlock] = useState(false);
  const [mathEditPos, setMathEditPos] = useState<number | null>(null);

  // Stable callbacks for math click handlers
  const onClickInlineMath = useRef((_node: PMNode, _pos: number) => {});
  const onClickBlockMath = useRef((_node: PMNode, _pos: number) => {});

  onClickInlineMath.current = (node, pos) => {
    const latex = typeof node.attrs['latex'] === 'string' ? node.attrs['latex'] : '';
    setMathLatex(latex);
    setMathBlock(false);
    setMathEditPos(pos);
    setMathOpen(true);
  };
  onClickBlockMath.current = (node, pos) => {
    const latex = typeof node.attrs['latex'] === 'string' ? node.attrs['latex'] : '';
    setMathLatex(latex);
    setMathBlock(true);
    setMathEditPos(pos);
    setMathOpen(true);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ code: false, codeBlock: false }),
      Superscript,
      Subscript,
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
      Mathematics.configure({
        katexOptions: { throwOnError: false },
        inlineOptions: { onClick: (n, p) => onClickInlineMath.current(n, p) },
        blockOptions: { onClick: (n, p) => onClickBlockMath.current(n, p) },
      }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Markdown.configure({ html: false, tightLists: true, transformPastedText: true }),
    ],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none px-3 py-2 text-foreground bg-surface',
      },
    },
    onUpdate: ({ editor: e }) => {
      if (skipNextUpdateRef.current) {
        skipNextUpdateRef.current = false;
        return;
      }
      onChange(tiptapDocToMarkdown(e));
    },
  });

  // Sync external value → editor
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const currentMd = tiptapDocToMarkdown(editor);
    const effectiveValue = value ?? '';
    if (currentMd.trim() !== effectiveValue.trim()) {
      skipNextUpdateRef.current = true;
      editor.commands.setContent(effectiveValue);
    }
  }, [value, editor]);

  // Math preview
  const mathPreview = (() => {
    if (!mathLatex.trim()) return null;
    try {
      return katex.renderToString(mathLatex, { displayMode: mathBlock, throwOnError: true });
    } catch {
      return undefined;
    }
  })();

  function handleMathInsert() {
    if (!editor || !mathLatex.trim()) return;
    if (mathEditPos !== null) {
      if (mathBlock) editor.commands.updateBlockMath({ latex: mathLatex, pos: mathEditPos });
      else editor.commands.updateInlineMath({ latex: mathLatex, pos: mathEditPos });
    } else {
      if (mathBlock) editor.commands.insertBlockMath({ latex: mathLatex });
      else editor.commands.insertInlineMath({ latex: mathLatex });
    }
    setMathOpen(false);
    setMathLatex('');
    setMathEditPos(null);
    editor.commands.focus();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    setUploading(true);
    try {
      // 1. Get presigned upload URL
      const presignedRes = await authFetch('/api/v1/file/presigned-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, type: 'QUESTION_ATTACHMENT' }),
      });
      const { uploadUrl, storageKey } = await presignedRes.json();

      // 2. PUT file to MinIO
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': '' },
        body: file,
      });

      // 3. Verify upload
      await authFetch('/api/v1/file/objects/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageKey,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });

      // 4. Insert image into editor using proxy cdn URL
      const cdnUrl = `/api/v1/file/objects?storageKey=${encodeURIComponent(storageKey)}`;
      editor.commands.setImage({ src: cdnUrl });
      editor.commands.focus();
    } catch (err) {
      console.error('RichEditor image upload error:', err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function toggleRawMd() {
    if (!editor) return;
    if (!showRawMd) {
      setRawMdValue(tiptapDocToMarkdown(editor));
      setShowRawMd(true);
    } else {
      if (!disabled) {
        skipNextUpdateRef.current = true;
        editor.commands.setContent(rawMdValue);
      }
      setShowRawMd(false);
    }
  }

  if (!editor) return null;

  return (
    <div className={`rounded-seek-lg border border-border bg-surface overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted-background/40 px-2 py-1">
        {!disabled && (
          <>
            {/* Undo / Redo */}
            <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo() || showRawMd}>
              ↶
            </Btn>
            <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo() || showRawMd}>
              ↷
            </Btn>
            <Sep />

            {/* Text marks */}
            <Btn title="Bold" active={editor.isActive('bold')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleBold().run()}>
              <span className="font-bold">B</span>
            </Btn>
            <Btn title="Italic" active={editor.isActive('italic')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleItalic().run()}>
              <span className="italic">/</span>
            </Btn>
            <Btn title="Underline" active={editor.isActive('underline')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <span className="underline">U</span>
            </Btn>
            <Btn title="Strike" active={editor.isActive('strike')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleStrike().run()}>
              <span className="line-through">T</span>
            </Btn>
            <Sep />

            {/* Super / Subscript */}
            <Btn title="Superscript" active={editor.isActive('superscript')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleSuperscript().run()}>
              A<sup>+</sup>
            </Btn>
            <Btn title="Subscript" active={editor.isActive('subscript')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleSubscript().run()}>
              A<sub>−</sub>
            </Btn>
            <Btn
              title="Clear formats"
              disabled={showRawMd}
              onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            >
              Ax
            </Btn>
            <Sep />

            {/* Lists */}
            <Btn title="Bullet list" active={editor.isActive('bulletList')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleBulletList().run()}>
              ≡
            </Btn>
            <Btn title="Ordered list" active={editor.isActive('orderedList')} disabled={showRawMd} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
              1≡
            </Btn>
            <Sep />

            {/* Math */}
            <Btn
              title="Formula"
              disabled={showRawMd}
              onClick={() => { setMathLatex(''); setMathBlock(false); setMathEditPos(null); setMathOpen(true); }}
            >
              √
            </Btn>

            <Sep />

            {/* Table */}
            <Btn
              title="Table (2x3)"
              disabled={showRawMd}
              onClick={() => editor.chain().focus().insertTable({ rows: 2, cols: 3, withHeaderRow: true }).run()}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="1" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </Btn>

            {/* Image */}
            <Btn
              title="Image"
              disabled={uploading || showRawMd}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <span className="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              )}
            </Btn>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

            <Sep />
          </>
        )}

        {/* Raw markdown toggle */}
        <Btn
          title={disabled ? 'View raw markdown' : 'Edit raw markdown'}
          active={showRawMd}
          onClick={toggleRawMd}
        >
          <span className="font-mono text-xs">{'</>'}</span>
        </Btn>
      </div>

      {/* Raw markdown textarea */}
      {showRawMd && (
        <textarea
          value={rawMdValue}
          readOnly={disabled}
          spellCheck={false}
          onChange={(e) => {
            if (disabled) return;
            setRawMdValue(e.target.value);
            onChange(e.target.value);
          }}
          className={`w-full resize-none font-mono text-sm px-3 py-2 outline-none ${
            disabled
              ? 'bg-muted-background text-muted-foreground cursor-default'
              : 'bg-slate-950 text-green-400'
          }`}
          style={{ minHeight }}
        />
      )}

      {/* WYSIWYG editor */}
      <div style={{ display: showRawMd ? 'none' : undefined }}>
        <EditorContent
          editor={editor}
          style={{ minHeight }}
          className="[&_.ProseMirror]:min-h-[inherit] [&_.ProseMirror]:outline-none [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-400
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
            [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0"
        />
      </div>

      {/* Math insert dialog */}
      {mathOpen && (
        <div
          className="fixed inset-0 z-modal flex items-center justify-center bg-black/40"
          onClick={(e) => { if (e.target === e.currentTarget) setMathOpen(false); }}
        >
          <div className="w-96 rounded-seek-lg bg-surface shadow-seek-lg p-seek-4 space-y-seek-4">
            <h3 className="font-bold text-slate-800 text-sm">Математик томъёо</h3>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">LaTeX томъёо</label>
              <input
                type="text"
                autoFocus
                value={mathLatex}
                onChange={(e) => setMathLatex(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleMathInsert();
                  if (e.key === 'Escape') setMathOpen(false);
                }}
                placeholder="e = mc^2"
                className="w-full rounded-seek-md border border-border bg-surface px-3 py-2 text-sm font-mono outline-none focus:border-primary"
              />
            </div>

            {/* Live preview */}
            <div className="flex min-h-12 items-center justify-center rounded-seek-md border border-border bg-muted-background px-3 py-2">
              {mathLatex.trim() ? (
                mathPreview !== undefined ? (
                  <span dangerouslySetInnerHTML={{ __html: mathPreview ?? '' }} />
                ) : (
                  <span className="text-xs text-red-500">LaTeX алдаа — томъёогоо шалгана уу</span>
                )
              ) : (
                <span className="text-xs text-muted-foreground">Урьдчилан харах...</span>
              )}
            </div>

            {/* Inline vs Block toggle */}
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={mathBlock}
                onChange={(e) => setMathBlock(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              Блок горим <span className="text-muted-foreground/60">($$...$$, мөр дангаараа)</span>
            </label>

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setMathOpen(false)}
                className="rounded-seek-md border border-border bg-surface px-4 py-2 hover:bg-surface-hover"
              >
                Болих
              </button>
              <button
                type="button"
                onClick={handleMathInsert}
                disabled={!mathLatex.trim() || mathPreview === undefined}
                className="rounded-seek-md bg-slate-950 px-4 py-2 font-bold text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mathEditPos !== null ? 'Шинэчлэх' : 'Оруулах'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Btn({
  children,
  onClick,
  active,
  disabled,
  title,
  className = '',
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 min-w-[28px] items-center justify-center rounded text-xs transition-colors
        ${active ? 'bg-primary/10 text-primary font-bold' : 'text-slate-600 hover:bg-muted-background'}
        ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}
        ${className}`}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span className="mx-1 h-4 w-px bg-border" />;
}
