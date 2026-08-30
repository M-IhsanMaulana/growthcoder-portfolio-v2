import * as React from "react";

interface ProjectCaseStudyContentProps {
  content: string;
}

export function ProjectCaseStudyContent({
  content,
}: ProjectCaseStudyContentProps) {
  if (!content) {
    return null;
  }

  // Parse markdown-like content into structured sections and paragraphs
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let listItems: string[] = [];

    const flushList = (keyPrefix: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            key={`${keyPrefix}-list`}
            className="space-y-2 my-4 pl-5 list-disc text-muted-foreground"
          >
            {listItems.map((item, i) => (
              <li key={i} className="text-sm sm:text-base leading-relaxed">
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
            <pre
              key={`code-${index}`}
              className="my-5 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 font-mono text-xs sm:text-sm text-foreground overflow-x-auto shadow-inner"
            >
              <code>{codeContent.join("\n")}</code>
            </pre>,
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          flushList(`precode-${index}`);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Heading 2 (## Title)
      if (line.startsWith("## ")) {
        flushList(`h2-${index}`);
        const title = line.replace(/^##\s+/, "");
        elements.push(
          <div
            key={`h2-${index}`}
            className="pt-6 pb-2 border-b border-border/40 first:pt-0"
          >
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
              {title}
            </h2>
          </div>,
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
            className="text-lg sm:text-xl font-semibold font-heading text-foreground pt-4"
          >
            {title}
          </h3>,
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
            className="text-sm sm:text-base text-muted-foreground leading-relaxed"
          >
            {line}
          </p>,
        );
      }
    });

    flushList("end");

    return elements;
  };

  return (
    <div className="prose dark:prose-invert max-w-none space-y-4">
      {renderFormattedContent(content)}
    </div>
  );
}
