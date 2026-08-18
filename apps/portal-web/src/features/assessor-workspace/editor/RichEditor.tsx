'use client';

import React, { useRef, useState } from 'react';
import { authFetch } from '@/lib/auth-client';
import { Icons } from '@seek/ui';

export interface RichEditorProps {
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  disabled?: boolean;
  compact?: boolean;
}

/**
 * RichEditor - KaTeX, Mermaid, Зураг оруулах болон бүх төрлийн
 * Markdown синтаксийг дэмжсэн цэвэр, хөнгөн Markdown Editor компонент.
 */
export function RichEditor({
  value,
  onChange,
  placeholder = 'Markdown бичвэр оруулах...',
  minHeight = '6rem',
  className = '',
  disabled = false,
  compact = false,
}: RichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Курсор дээр markdown синтакс оруулах туслах функц
  const insertTextAtCursor = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value || '';
    const selectedText = currentVal.substring(start, end) || defaultText;

    const nextVal =
      currentVal.substring(0, start) +
      before +
      selectedText +
      after +
      currentVal.substring(end);

    onChange(nextVal);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(
        start + before.length,
        newCursorPos
      );
    }, 0);
  };

  // MinIO-руу зураг хуулж оруулах ерөнхий функц
  const uploadAndInsertImage = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      // 1. Presigned URL авах
      const presignedRes = await authFetch('/api/v1/file/presigned-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: file.name, type: 'QUESTION_ATTACHMENT' }),
      });
      const { uploadUrl, storageKey } = await presignedRes.json();

      // 2. Файлыг MinIO руу илгээх
      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': '' },
        body: file,
      });

      // 3. Баталгаажуулах
      await authFetch('/api/v1/file/objects/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storageKey,
          mimeType: file.type,
          sizeBytes: file.size,
        }),
      });

      // 4. Markdown зураг хэлбэрээр курсорт оруулах
      const cdnUrl = `/api/v1/file/objects?storageKey=${encodeURIComponent(storageKey)}`;
      insertTextAtCursor(`![${file.name}](${cdnUrl})`);
    } catch (err) {
      console.error('Markdown editor image upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // MinIO Presigned URL-аар зураг оруулах (FileInput ашиглах үед)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadAndInsertImage(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Clipboard Paste ашиглан зураг оруулах
  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          // Paste хийсэн зураг ихэвчлэн нэргүй (image.png) байдаг тул өвөрмөц нэр өгнө
          const fileName = file.name === "image.png" ? `pasted_image_${Date.now()}.png` : file.name;
          const renamedFile = new File([file], fileName, { type: file.type });
          await uploadAndInsertImage(renamedFile);
        }
      }
    }
  };

  // Drag & Drop ашиглан зураг оруулах
  const handleDrop = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith("image/")) {
        e.preventDefault();
        await uploadAndInsertImage(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const items = e.dataTransfer?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          e.preventDefault();
          break;
        }
      }
    }
  };

  return (
    <div
      className={`group relative flex flex-col rounded-seek-md border border-slate-200 bg-white transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 ${className}`}
    >
      {/* Hidden image file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      {/* Editor Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 bg-slate-50/80 px-2 py-1.5 text-xs text-slate-600 rounded-t-seek-md">
        {/* Bold */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => insertTextAtCursor('**', '**', 'тодруулсан текст')}
          className="flex h-3 w-3 items-center justify-center rounded hover:bg-slate-200/70 active:bg-slate-300 transition-colors font-bold text-slate-700 disabled:opacity-50"
          title="Bold (**текст**)"
        >
          <Icons.BoldIcon />
        </button>

        {/* Italic */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => insertTextAtCursor('*', '*', 'налуу текст')}
          className="flex h-4 w-4 items-center justify-center rounded hover:bg-slate-200/70 active:bg-slate-300 transition-colors italic font-serif text-slate-700 disabled:opacity-50"
          title="Italic (*текст*)"
        >
          I
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Inline Math KaTeX */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => insertTextAtCursor('$', '$', 'x^2 + y^2 = r^2')}
          className="flex h-6 w-6 px-1.5 items-center justify-center rounded hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-colors font-mono font-semibold text-slate-700 disabled:opacity-50"
          title="Inline KaTeX ($...$)"
        >
          <Icons.MathInline />
        </button>

        {/* Block Math KaTeX */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => insertTextAtCursor('\n$$\n', '\n$$\n', '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}')}
          className="flex h-6 w-6 px-1.5 items-center justify-center rounded hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-colors font-mono font-semibold text-slate-700 disabled:opacity-50"
          title="Block KaTeX ($$...$$)"
        >
          <Icons.MathFunc />
        </button>

        {/* Mermaid Diagram */}
        <button
          type="button"
          disabled={disabled}
          onClick={() =>
            insertTextAtCursor(
              '\n```mermaid\ngraph TD\n  A[Эхлэл] --> B{Нөхцөл}\n  B -->|Тийм| C[Үйлдэл]\n  B -->|Үгүй| D[Төгсгөл]\n```\n'
            )
          }
          className="flex h-7 w-7 px-2 items-center justify-center gap-1 rounded hover:bg-indigo-50 hover:text-indigo-600 active:bg-indigo-100 transition-colors text-[11px] font-semibold text-slate-700 disabled:opacity-50"
          title="Mermaid диаграм оруулах"
        >
          <Icons.ChartIcon />
        </button>

        <div className="h-4 w-[1px] bg-slate-200 mx-0.5" />

        {/* Image Upload */}
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-7 w-7 px-2 items-center justify-center gap-1 rounded hover:bg-emerald-50 hover:text-emerald-700 active:bg-emerald-100 transition-colors text-[11px] font-semibold text-slate-700 disabled:opacity-50"
          title="Зураг оруулах (MinIO)"
        >
          {uploading ? (
            <Icons.HourGlass />
          ) : (
            <Icons.ImageAdd />
          )}
        </button>

        {/* Table */}
        {!compact && (
          <button
            type="button"
            disabled={disabled}
            onClick={() =>
              insertTextAtCursor(
                '\n| Багана 1 | Багана 2 | Багана 3 |\n|---|---|---|\n| Утга A | Утга B | Утга C |\n| Утга D | Утга E | Утга F |\n\n'
              )
            }
            className="flex h-6 w-6 px-1.5 items-center justify-center rounded hover:bg-slate-200/70 active:bg-slate-300 transition-colors text-slate-700 disabled:opacity-50"
            title="Хүснэгт оруулах"
          >
            <Icons.TableIcon />
          </button>
        )}

        {/* Code Block */}
        {!compact && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => insertTextAtCursor('\n```javascript\n', '\n```\n', '// Код энд бичнэ')}
            className="flex h-6 w-6 px-1.5 items-center justify-center rounded hover:bg-slate-200/70 active:bg-slate-300 transition-colors text-slate-700 disabled:opacity-50"
            title="Код блок (```code```)"
          >
            <Icons.CodeIcon />
          </button>
        )}

        {/* List */}
        {!compact && (
          <button
            type="button"
            disabled={disabled}
            onClick={() => insertTextAtCursor('\n- ', '', 'Жагсаалтын мөр')}
            className="flex h-6 w-6 px-1.5 items-center justify-center rounded hover:bg-slate-200/70 active:bg-slate-300 transition-colors text-slate-700 disabled:opacity-50"
            title="Жагсаалт (- ...)"
          >
            <Icons.BulletList />
          </button>
        )}
      </div>

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        value={value || ''}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onPaste={handlePaste}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        style={{ minHeight }}
        className="w-full resize-y rounded-b-seek-md bg-transparent p-3 font-mono text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
      />
    </div>
  );
}

export default RichEditor;
