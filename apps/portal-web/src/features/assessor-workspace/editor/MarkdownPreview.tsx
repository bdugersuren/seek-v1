"use client";

import React, { useEffect, useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

interface MarkdownPreviewProps {
  value: string;
  isFillBlank?: boolean;
  className?: string;
}

/**
 * MarkdownPreview — Markdown, KaTeX, GFM хүснэгт, зураг, mermaid диаграмыг
 * бүрэн зөв рендерлэх preview компонент.
 */
export function MarkdownPreview({ value, isFillBlank, className }: MarkdownPreviewProps) {
  if (!value || !value.trim()) {
    return <span className="text-muted-foreground italic">Агуулга байхгүй байна.</span>;
  }

  // 1. Рендер хийхээс өмнө хоосон зайнуудыг зөв дарааллаар урьдчилан дугаарлана (Pre-tokenization)
  let blankCounter = 0;
  const processedValue = isFillBlank 
    ? value.replace(/(__+)/g, () => {
        blankCounter++;
        return `[[BLANK_PLACEHOLDER_${blankCounter}]]`;
      })
    : value;

  return (
    <div className={`markdown-preview ${className || ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          // Хүснэгтийн компонентууд — seek дизайн системтэй нийцүүлсэн
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-seek-md border border-border">
              <table className="w-full min-w-[24rem] text-left text-sm border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted-background border-b border-border">
              {children}
            </thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border last:border-b-0">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="p-seek-3 font-semibold text-foreground whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="p-seek-3 text-foreground">{children}</td>
          ),
          // Зургийн компонент
          img: ({ src, alt, ...props }) => (
            <span className="block my-4 overflow-hidden rounded-seek-md border border-slate-200 bg-slate-50/50 p-1 flex justify-center">
              <img
                src={src}
                alt={alt || ""}
                className="max-h-80 max-w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                {...props}
              />
            </span>
          ),
          // Код блок — mermaid диаграм рендерлэх
          code: ({ className: codeClassName, children, ...props }) => {
            const match = /language-(\w+)/.exec(codeClassName || "");
            const lang = match?.[1];

            if (lang === "mermaid") {
              return <MermaidDiagram chart={String(children).trim()} />;
            }

            // Inline code
            if (!codeClassName) {
              return (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm font-mono text-pink-600" {...props}>
                  {children}
                </code>
              );
            }

            // Block code
            return (
              <code className={`block rounded-seek-md bg-slate-900 text-slate-100 p-seek-4 text-sm font-mono overflow-x-auto ${codeClassName}`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-4 rounded-seek-md bg-slate-900 p-0 overflow-x-auto">
              {children}
            </pre>
          ),
          // Paragraph
          p: ({ children }) => {
            if (isFillBlank) {
              return <p className="text-foreground leading-7">{processFillBlanks(children)}</p>;
            }
            return <p className="text-foreground leading-7">{children}</p>;
          },
          // Lists
          ul: ({ children }) => (
            <ul className="my-2 ml-6 list-disc space-y-1 text-foreground">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-6 list-decimal space-y-1 text-foreground">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="leading-7">{children}</li>
          ),
          // Headings
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-2 text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h3>,
          h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-1 text-foreground">{children}</h4>,
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="my-4 border-l-4 border-primary/30 pl-4 italic text-muted-foreground">
              {children}
            </blockquote>
          ),
          // Horizontal rule
          hr: () => <hr className="my-6 border-border" />,
          // Strong, Em
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          // Links
          a: ({ href, children }) => (
            <a href={href} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {processedValue}
      </ReactMarkdown>
    </div>
  );
}

/**
 * FILL_BLANK горимд __ хоосон зайг input болгон солих
 */
function processFillBlanks(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      const parts = child.split(/(\[\[BLANK_PLACEHOLDER_\d+\]\])/g);
      if (parts.length === 1) return child;
      return parts.map((part, idx) => {
        const match = /\[\[BLANK_PLACEHOLDER_(\d+)\]\]/.exec(part);
        if (match) {
          const num = match[1];
          return (
            <input
              key={`blank-${num}-${idx}`}
              type="text"
              placeholder={`blank${num}`}
              className="mx-1 px-2 py-0.5 w-24 h-7 text-xs border border-slate-300 rounded bg-white text-slate-800 focus:border-blue-500 focus:outline-none inline-block align-middle font-semibold text-center shadow-inner"
            />
          );
        }
        return part;
      });
    }
    return child;
  });
}

/**
 * Mermaid диаграм рендерлэх компонент
 */
function MermaidDiagram({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 10)}`);

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "default",
          securityLevel: "loose",
        });
        if (cancelled || !containerRef.current) return;
        const { svg } = await mermaid.render(idRef.current, chart);
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (err) {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = `<pre class="text-xs text-red-500 p-2">Mermaid диаграм алдаатай: ${String(err)}</pre>`;
        }
      }
    }
    render();
    return () => { cancelled = true; };
  }, [chart]);

  return (
    <div
      ref={containerRef}
      className="my-4 flex justify-center overflow-x-auto rounded-seek-md border border-border bg-white p-seek-4"
    />
  );
}

export default MarkdownPreview;
