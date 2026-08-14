"use client";

import React, { useEffect, useRef, useState } from "react";
import katex from "katex";
import { Icons, Input, Badge } from "@seek/ui";

// -------------------------------------------------------------
// Mermaid Diagram Renderer Component
// -------------------------------------------------------------

/**
 * MermaidViewer - Mermaid.js диаграммыг динамикаар уншиж рендер хийдэг компонент.
 * Системд mermaid суулгаагүй тохиолдолд CDN-ээс уншиж ачаална.
 *
 * @param chart - Mermaid диаграммын код (текст)
 * @param compact - Загварыг жижиг хэмжээтэй харуулах эсэх
 */
export function MermaidViewer({ chart, compact = false }: { chart: string; compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgHtml, setSvgHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderMermaid() {
      try {
        if (typeof window !== "undefined") {
          let mermaid = (window as any).mermaid;
          if (!mermaid) {
            await new Promise((resolve, reject) => {
              const existingScript = document.getElementById("mermaid-cdn-script");
              if (existingScript) {
                existingScript.addEventListener("load", resolve);
                return;
              }
              const script = document.createElement("script");
              script.id = "mermaid-cdn-script";
              script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
              script.onload = () => resolve(true);
              script.onerror = reject;
              document.head.appendChild(script);
            });
            mermaid = (window as any).mermaid;
          }

          if (mermaid) {
            mermaid.initialize({
              startOnLoad: false,
              theme: "neutral",
              securityLevel: "loose",
              fontFamily: "Inter, sans-serif",
            });

            const id = `mermaid-svg-${Math.random().toString(36).substring(2, 9)}`;
            const { svg } = await mermaid.render(id, chart.trim());
            if (isMounted) {
              setSvgHtml(svg);
              setError(null);
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err?.message || "Диаграм зурахад алдаа гарлаа");
        }
      }
    }

    renderMermaid();
    return () => {
      isMounted = false;
    };
  }, [chart]);

  if (error) {
    return (
      <div className={`${compact ? "my-1.5 p-2 text-[11px]" : "my-3 p-seek-3 text-xs"} rounded-seek-md border border-amber-200 bg-amber-50/60 text-amber-800`}>
        <div className="font-semibold flex items-center gap-1.5 mb-1">
          <span>❖ Mermaid диаграм</span>
        </div>
        <pre className="font-mono text-xs overflow-x-auto whitespace-pre-wrap bg-white/70 p-2 rounded border border-amber-200">{chart}</pre>
      </div>
    );
  }

  if (!svgHtml) {
    return (
      <div className={`${compact ? "my-1.5 p-2" : "my-3 p-seek-4"} rounded-seek-md border border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-500`}>
        <span className="animate-pulse">❖ Диаграм ачаалж байна...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`${compact ? "my-2 p-2 max-h-72" : "my-4 p-seek-4"} overflow-x-auto rounded-seek-lg border border-indigo-100 bg-indigo-50/20 flex justify-center shadow-seek-xs [&_svg]:max-w-full`}
      dangerouslySetInnerHTML={{ __html: svgHtml }}
    />
  );
}

// -------------------------------------------------------------
// Comprehensive Markdown + KaTeX + Tables + Lists + Code Parser
// -------------------------------------------------------------

export type MarkdownBlock =
  | { type: "paragraph"; text: string }
  | { type: "table"; rows: string[][] }
  | { type: "mermaid"; content: string }
  | { type: "code"; lang: string; content: string }
  | { type: "heading"; level: number; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; items: string[] };

/**
 * RichTextPreview - Текст доторх Markdown, Math/LaTeX болон Mermaid диаграмыг 
 * хөрвүүлэн HTML рендеринг хийдэг үндсэн туслах компонент.
 *
 * @param value - Засварлагдсан текст (асуултын агуулга, feedback гэх мэт)
 * @param isFillBlank - Хоосон зай нөхөх асуулт эсэх (ингэснээр input талбар харуулна)
 * @param compact - Загварыг авсаархан хэмжээтэй харуулах эсэх
 */
export function RichTextPreview({ 
  value, 
  isFillBlank, 
  compact = false 
}: { 
  value: string; 
  isFillBlank?: boolean; 
  compact?: boolean;
}) {
  if (!value) return null;

  return (
    <div className={compact ? "space-y-1 text-sm leading-snug" : "space-y-seek-3 text-base leading-7"}>
      {parseMarkdownBlocks(value).map((block, index) => {
        if (block.type === "mermaid") {
          return <MermaidViewer key={`mermaid-${index}`} chart={block.content} compact={compact} />;
        }

        if (block.type === "code") {
          return (
            <div key={`code-${index}`} className="my-3 overflow-hidden rounded-seek-md border border-slate-800 bg-slate-900 text-slate-100 shadow-seek-sm">
              {block.lang && (
                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-3 py-1 text-[11px] font-mono text-slate-400">
                  <span>{block.lang}</span>
                </div>
              )}
              <pre className="overflow-x-auto p-3 font-mono text-xs leading-relaxed text-emerald-400">
                <code>{block.content}</code>
              </pre>
            </div>
          );
        }

        if (block.type === "table") {
          return <MarkdownTable key={`table-${index}`} rows={block.rows} isFillBlank={isFillBlank} />;
        }

        if (block.type === "heading") {
          const Tag = block.level === 1 ? "h2" : block.level === 2 ? "h3" : "h4";
          return (
            <Tag key={`heading-${index}`} className="font-bold text-slate-900 mt-2 mb-1">
              <InlineMath value={block.text} isFillBlank={isFillBlank} />
            </Tag>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote key={`quote-${index}`} className="my-2 border-l-4 border-primary/50 bg-primary/5 pl-4 py-1.5 italic text-slate-700 rounded-r">
              <InlineMath value={block.text} isFillBlank={isFillBlank} />
            </blockquote>
          );
        }

        if (block.type === "list") {
          return (
            <ul key={`list-${index}`} className="my-2 list-disc list-inside space-y-1 text-slate-800 pl-2">
              {block.items.map((item, i) => (
                <li key={i}>
                  <InlineMath value={item} isFillBlank={isFillBlank} />
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={`paragraph-${index}`} className="text-slate-800">
            <InlineMath value={block.text} isFillBlank={isFillBlank} />
          </p>
        );
      })}
    </div>
  );
}

/**
 * parseMarkdownBlocks - Текстийг мөр мөрөөр уншиж Markdown block бүтэц рүү 
 * задлан хуваарилж блок массив буцаах туслах функц.
 *
 * @param value - Бүтэн текстийн утга
 */
export function parseMarkdownBlocks(value: string): MarkdownBlock[] {
  const lines = value.split("\n");
  const blocks: MarkdownBlock[] = [];
  let paragraph: string[] = [];
  let index = 0;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  while (index < lines.length) {
    const rawLine = lines[index];
    const line = rawLine.trim();
    const nextLine = lines[index + 1]?.trim();

    if (!line) {
      flushParagraph();
      index += 1;
      continue;
    }

    // 1. Mermaid Code Block
    if (line.startsWith("```mermaid")) {
      flushParagraph();
      index += 1;
      const mermaidLines: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        mermaidLines.push(lines[index]);
        index += 1;
      }
      index += 1; // skip closing ```
      blocks.push({ type: "mermaid", content: mermaidLines.join("\n") });
      continue;
    }

    // 2. Generic Code Block
    if (line.startsWith("```")) {
      flushParagraph();
      const lang = line.replace(/^```/, "").trim();
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      index += 1; // skip closing ```
      blocks.push({ type: "code", lang, content: codeLines.join("\n") });
      continue;
    }

    // 3. Headings (#, ##, ###)
    if (/^#{1,4}\s+/.test(line)) {
      flushParagraph();
      const level = line.match(/^(#{1,4})\s+/)?.[1].length || 1;
      const text = line.replace(/^#{1,4}\s+/, "");
      blocks.push({ type: "heading", level, text });
      index += 1;
      continue;
    }

    // 4. Blockquote (> ...)
    if (line.startsWith(">")) {
      flushParagraph();
      const quoteLines: string[] = [line.replace(/^>\s?/, "")];
      index += 1;
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join(" ") });
      continue;
    }

    // 5. Unordered List (- , * )
    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      const items: string[] = [line.replace(/^[-*]\s+/, "")];
      index += 1;
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*]\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // 6. Markdown Table
    if (isMarkdownTableHeader(line, nextLine)) {
      flushParagraph();
      const rows: string[][] = [parseTableRow(line)];
      index += 2;

      while (index < lines.length && lines[index].trim().startsWith("|")) {
        rows.push(parseTableRow(lines[index].trim()));
        index += 1;
      }

      blocks.push({ type: "table", rows });
      continue;
    }

    paragraph.push(line);
    index += 1;
  }

  flushParagraph();
  return blocks;
}

export function isMarkdownTableHeader(line: string, nextLine?: string) {
  return (
    line.startsWith("|") &&
    line.endsWith("|") &&
    Boolean(nextLine?.startsWith("|")) &&
    /^\|?[\s:-]+\|[\s|:-]+$/.test(nextLine || "")
  );
}

export function parseTableRow(line: string) {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

/**
 * MarkdownTable - Хүснэгтийн өгөгдлийг HTML Table хэлбэрээр загваржуулан харуулна.
 */
export function MarkdownTable({ rows, isFillBlank }: { rows: string[][]; isFillBlank?: boolean }) {
  if (!rows || rows.length === 0) return null;
  const [header, ...body] = rows;

  return (
    <div className="my-3 overflow-x-auto rounded-seek-md border border-slate-200 bg-white shadow-seek-xs">
      <table className="w-full min-w-[24rem] text-left text-sm">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            {header.map((cell, index) => (
              <th key={`${cell}-${index}`} className="p-seek-3 font-semibold text-slate-800">
                <InlineMath value={cell} isFillBlank={isFillBlank} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50/50">
              {row.map((cell, cellIndex) => (
                <td key={`${cell}-${cellIndex}`} className="p-seek-3 text-slate-700">
                  <InlineMath value={cell} isFillBlank={isFillBlank} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * InlineMath - Текст доторх Math ($...$) болон Block Math ($$...$$), 
 * мөн markdown image (`![alt](url)`) зэргийг тус тусад нь ялган KaTeX рендеринг хийнэ.
 */
export function InlineMath({ value, isFillBlank }: { value: string; isFillBlank?: boolean }) {
  if (!value) return null;
  const segments = value.split(/(\$\$[\s\S]+?\$\$|\$[^$]+\$|!\[.*?\]\(.*?\))/g);
  let blankCounter = 0;

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.startsWith("$$") && segment.endsWith("$$")) {
          return (
            <MathExpression
              key={`${segment}-${index}`}
              expression={segment.slice(2, -2)}
              displayMode
            />
          );
        }

        if (segment.startsWith("$") && segment.endsWith("$")) {
          return (
            <MathExpression
              key={`${segment}-${index}`}
              expression={segment.slice(1, -1)}
            />
          );
        }

        if (segment.startsWith("![") && segment.endsWith(")")) {
          const match = segment.match(/!\[(.*?)\]\((.*?)\)/);
          if (match) {
            const [, alt, src] = match;
            return (
              <span 
                key={`${segment}-${index}`} 
                className="block my-seek-4 overflow-hidden rounded-seek-md border border-slate-200 bg-slate-50/50 p-1 flex justify-center"
              >
                <img 
                  src={src} 
                  alt={alt} 
                  className="max-h-64 max-w-full object-contain" 
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </span>
            );
          }
        }

        if (isFillBlank) {
          const parts = segment.split(/(__+|{{blank_\d+}}|\[\[\d+\]\])/g);
          return (
            <span key={`${segment}-${index}`}>
              {parts.map((part, pIdx) => {
                if (part.startsWith("_") || part.startsWith("{{") || part.startsWith("[[")) {
                  blankCounter++;
                  return (
                    <input
                      key={pIdx}
                      type="text"
                      disabled
                      placeholder={`нүд ${blankCounter}`}
                      className="mx-1 px-2 py-0.5 w-24 h-7 text-xs border border-slate-300 rounded bg-white text-slate-800 inline-block align-middle font-semibold text-center shadow-inner"
                    />
                  );
                }
                return part;
              })}
            </span>
          );
        }

        return <span key={`${segment}-${index}`}>{segment}</span>;
      })}
    </>
  );
}

/**
 * MathExpression - KaTeX ашиглаж математик томьёог форматжуулах жижиг компонент.
 */
export function MathExpression({
  expression,
  displayMode = false,
}: {
  expression: string;
  displayMode?: boolean;
}) {
  const html = renderLatex(expression, displayMode);

  return (
    <span className="mx-1 inline-flex items-center rounded-seek-sm bg-primary/10 px-2 py-1 align-middle text-primary">
      {html ? (
        <span
          className="text-current [&_.katex]:text-current"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <code className="font-mono">{expression}</code>
      )}
    </span>
  );
}

/**
 * renderLatex - Өгөгдсөн KaTeX илэрхийллийг string форматтай HTML хөрвүүлэн буцаах туслах функц.
 */
export function renderLatex(expression: string, displayMode: boolean) {
  try {
    return katex.renderToString(expression.trim(), {
      displayMode,
      output: "html",
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    return null;
  }
}
