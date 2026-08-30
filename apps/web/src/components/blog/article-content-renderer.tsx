"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { slugifyHeading } from "@/lib/toc";
import { sanitizeHtml } from "@/lib/sanitize";

interface ArticleContentRendererProps {
  content: string;
}

/**
 * Terminal Code Block Component
 */
function CodeBlock({
  code,
  language = "code",
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      console.error("Failed to copy code");
    }
  };

  const lines = code.trim().split("\n");

  return (
    <div className="my-6 sm:my-8 rounded-2xl overflow-hidden border border-border/80 bg-zinc-950 text-zinc-100 shadow-xl font-mono text-xs sm:text-sm">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
        {/* macOS Window Controls */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/40" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/40" />
          <span className="ml-2 text-[11px] font-sans text-zinc-400 flex items-center gap-1.5 font-medium">
            <Terminal className="h-3.5 w-3.5 text-zinc-400" />
            {language.toUpperCase()}
          </span>
        </div>

        {/* Copy Code Button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-xs font-sans transition-colors cursor-pointer"
          title="Salin Kode"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-zinc-400" />
              <span>Salin</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body with Line Numbers */}
      <div className="p-4 sm:p-5 overflow-x-auto custom-scrollbar">
        <pre className="grid grid-cols-[auto_1fr] gap-x-4 leading-relaxed font-mono">
          {lines.map((line, idx) => (
            <React.Fragment key={idx}>
              <span className="select-none text-right text-zinc-600 text-xs sm:text-sm font-mono pr-2 border-r border-zinc-800/80">
                {idx + 1}
              </span>
              <code className="text-zinc-100 whitespace-pre">
                {line || " "}
              </code>
            </React.Fragment>
          ))}
        </pre>
      </div>
    </div>
  );
}

export function ArticleContentRenderer({
  content,
}: ArticleContentRendererProps) {
  if (!content) {
    return null;
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  // If HTML (from CKEditor 5), inject auto IDs to H2 and H3 tags and format custom code blocks
  if (isHtml) {
    const sanitized = sanitizeHtml(content);
    // Inject IDs into headings for TOC compatibility
    let formattedHtml = sanitized;
    let headingIndex = 0;
    formattedHtml = formattedHtml.replace(
      /<h([23])([^>]*)>(.*?)<\/h\1>/gi,
      (_full, level, attrs, text) => {
        const cleanText = text.replace(/<[^>]+>/g, "").trim();
        const id = slugifyHeading(cleanText) || `heading-${headingIndex++}`;
        return `<h${level} id="${id}" ${attrs} class="scroll-mt-24">${text}</h${level}>`;
      },
    );

    return (
      <div
        className="article-body article-content-rendered rich-content-body max-w-none"
        dangerouslySetInnerHTML={{ __html: formattedHtml }}
      />
    );
  }

  // If Markdown, parse line by line
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeBuffer: string[] = [];
  let listBuffer: string[] = [];
  let orderedListBuffer: string[] = [];

  const flushUnorderedList = (key: string) => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul
          key={`${key}-ul`}
          className="space-y-2 my-4 pl-6 list-disc text-foreground/90 leading-relaxed"
        >
          {listBuffer.map((item, i) => (
            <li key={i} className="text-sm sm:text-base">
              {item}
            </li>
          ))}
        </ul>,
      );
      listBuffer = [];
    }
  };

  const flushOrderedList = (key: string) => {
    if (orderedListBuffer.length > 0) {
      elements.push(
        <ol
          key={`${key}-ol`}
          className="space-y-2 my-4 pl-6 list-decimal text-foreground/90 leading-relaxed"
        >
          {orderedListBuffer.map((item, i) => (
            <li key={i} className="text-sm sm:text-base">
              {item}
            </li>
          ))}
        </ol>,
      );
      orderedListBuffer = [];
    }
  };

  const flushLists = (key: string) => {
    flushUnorderedList(key);
    flushOrderedList(key);
  };

  lines.forEach((line, index) => {
    // Check Code Block ```lang
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${index}`}
            code={codeBuffer.join("\n")}
            language={codeLanguage || "text"}
          />,
        );
        codeBuffer = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        flushLists(`precode-${index}`);
        codeLanguage = line.trim().replace(/^```/, "").trim();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // Heading 2 (## Heading)
    if (line.startsWith("## ")) {
      flushLists(`h2-${index}`);
      const text = line.replace(/^##\s+/, "").trim();
      const id = slugifyHeading(text) || `heading-${index}`;
      elements.push(
        <h2
          key={`h2-${index}`}
          id={id}
          className="text-2xl sm:text-3xl font-bold font-heading text-foreground pt-8 pb-1 scroll-mt-24 first:pt-0"
        >
          {text}
        </h2>,
      );
      return;
    }

    // Heading 3 (### Heading)
    if (line.startsWith("### ")) {
      flushLists(`h3-${index}`);
      const text = line.replace(/^###\s+/, "").trim();
      const id = slugifyHeading(text) || `heading-${index}`;
      elements.push(
        <h3
          key={`h3-${index}`}
          id={id}
          className="text-xl sm:text-2xl font-semibold font-heading text-foreground pt-6 pb-2 scroll-mt-24"
        >
          {text}
        </h3>,
      );
      return;
    }

    // Blockquote (> Quote)
    if (line.startsWith("> ")) {
      flushLists(`quote-${index}`);
      const text = line.replace(/^>\s+/, "").trim();
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-5 p-4 sm:p-5 rounded-2xl border-l-4 border-primary bg-muted/40 text-foreground/90 italic text-sm sm:text-base leading-relaxed"
        >
          {text}
        </blockquote>,
      );
      return;
    }

    // Unordered List (- item or * item)
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      flushOrderedList(`ul-flush-${index}`);
      const item = line.trim().replace(/^[-*]\s+/, "");
      listBuffer.push(item);
      return;
    }

    // Ordered List (1. item)
    if (/^\d+\.\s+/.test(line.trim())) {
      flushUnorderedList(`ol-flush-${index}`);
      const item = line.trim().replace(/^\d+\.\s+/, "");
      orderedListBuffer.push(item);
      return;
    }

    // Non-list line
    flushLists(`line-${index}`);

    // Paragraph
    if (line.trim().length > 0) {
      elements.push(
        <p
          key={`p-${index}`}
          className="text-sm sm:text-base text-foreground/80 leading-relaxed my-3.5"
        >
          {line}
        </p>,
      );
    }
  });

  flushLists("end");

  return <div className="space-y-2">{elements}</div>;
}
