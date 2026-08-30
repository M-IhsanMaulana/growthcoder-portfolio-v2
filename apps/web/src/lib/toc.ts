export interface TocItem {
  id: string;
  text: string;
  level: number; // 2 for H2, 3 for H3
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts H2 and H3 headings from either Markdown or HTML string
 * Safe for execution on both Server and Client environments
 */
export function extractTocFromContent(content: string): TocItem[] {
  if (!content) return [];
  const items: TocItem[] = [];

  // Check if content is HTML
  const isHtml = /<h[23][^>]*>/i.test(content);

  if (isHtml) {
    const headingRegex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;
    let index = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = parseInt(match[1], 10);
      const rawText = match[2].replace(/<[^>]+>/g, "").trim();
      const id = slugifyHeading(rawText) || `heading-${index}`;
      items.push({ id, text: rawText, level });
      index++;
    }
  } else {
    // Markdown format
    const lines = content.split("\n");
    lines.forEach((line, index) => {
      if (line.startsWith("## ")) {
        const text = line.replace(/^##\s+/, "").trim();
        const id = slugifyHeading(text) || `heading-${index}`;
        items.push({ id, text, level: 2 });
      } else if (line.startsWith("### ")) {
        const text = line.replace(/^###\s+/, "").trim();
        const id = slugifyHeading(text) || `heading-${index}`;
        items.push({ id, text, level: 3 });
      }
    });
  }

  return items;
}
