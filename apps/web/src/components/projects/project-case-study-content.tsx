"use client";

import * as React from "react";
import { sanitizeHtml } from "@/lib/sanitize";
import { Check, Copy, Terminal, Quote } from "lucide-react";

interface ProjectCaseStudyContentProps {
  content: string;
}

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
    <div className="my-6 rounded-2xl overflow-hidden border border-border/80 bg-zinc-950 text-zinc-100 shadow-xl font-mono text-xs sm:text-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600/40" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600/40" />
          <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600/40" />
          <span className="ml-2 text-[11px] font-sans text-zinc-400 flex items-center gap-1.5 font-medium">
            <Terminal className="h-3.5 w-3.5 text-zinc-400" />
            {language.toUpperCase()}
          </span>
        </div>

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

export function ProjectCaseStudyContent({
  content,
}: ProjectCaseStudyContentProps) {
  if (!content) {
    return null;
  }

  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  // If Rich HTML (generated from CKEditor 5 / CMS)
  if (isHtml) {
    const sanitized = sanitizeHtml(content);

    return (
      <div
        className="project-case-study-rendered rich-content-body max-w-none text-foreground/90 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: sanitized }}
      />
    );
  }

  // Fallback if raw Markdown
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLanguage = "";
  let codeContent: string[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul
          key={`${keyPrefix}-list`}
          className="space-y-2 my-4 pl-6 list-disc text-foreground/90 leading-relaxed"
        >
          {listItems.map((item, i) => (
            <li key={i} className="text-sm sm:text-base">
              {item}
            </li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  lines.forEach((line, index) => {
    // Code Block Start / End
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <CodeBlock
            key={`code-${index}`}
            code={codeContent.join("\n")}
            language={codeLanguage || "code"}
          />,
        );
        codeContent = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        flushList(`precode-${index}`);
        codeLanguage = line.trim().replace(/^```/, "").trim();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    // Heading 1 (# Title)
    if (line.startsWith("# ")) {
      flushList(`h1-${index}`);
      const title = line.replace(/^#\s+/, "");
      elements.push(
        <h1
          key={`h1-${index}`}
          className="text-2xl sm:text-3xl font-extrabold font-heading text-foreground pt-8 pb-2 border-b border-border/40 first:pt-0"
        >
          {title}
        </h1>,
      );
      return;
    }

    // Heading 2 (## Title)
    if (line.startsWith("## ")) {
      flushList(`h2-${index}`);
      const title = line.replace(/^##\s+/, "");
      elements.push(
        <h2
          key={`h2-${index}`}
          className="text-xl sm:text-2xl font-bold font-heading text-foreground pt-6 pb-1 border-b border-border/40 first:pt-0"
        >
          {title}
        </h2>,
      );
      return;
    }

    // Heading 3 (### Title)
    if (line.startsWith("### ")) {
      flushList(`h3-${index}`);
      const title = line.replace(/^###\s+/, "");
      elements.push(
        <h3
          key={`h3-${index}`}
          className="text-lg sm:text-xl font-semibold font-heading text-foreground pt-4 pb-1"
        >
          {title}
        </h3>,
      );
      return;
    }

    // Blockquote (> Quote)
    if (line.startsWith("> ")) {
      flushList(`quote-${index}`);
      const text = line.replace(/^>\s+/, "").trim();
      elements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-5 p-4 sm:p-5 rounded-2xl border-l-4 border-primary bg-primary/5 dark:bg-primary/10 text-foreground/90 italic text-sm sm:text-base leading-relaxed flex items-start gap-3 shadow-2xs"
        >
          <Quote className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span>{text}</span>
        </blockquote>,
      );
      return;
    }

    // Bullet List item (- Item)
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      const itemText = line.trim().replace(/^[-*]\s+/, "");
      listItems.push(itemText);
      return;
    }

    // If we encounter a non-list line, flush pending list items
    flushList(`nonlist-${index}`);

    // Normal paragraph
    if (line.trim().length > 0) {
      elements.push(
        <p
          key={`p-${index}`}
          className="text-sm sm:text-base text-foreground/85 leading-relaxed my-3"
        >
          {line}
        </p>,
      );
    }
  });

  flushList("end");

  return (
    <div className="project-case-study-markdown space-y-3">{elements}</div>
  );
}
