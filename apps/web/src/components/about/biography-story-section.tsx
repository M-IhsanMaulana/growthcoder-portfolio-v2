import * as React from "react";
import { BookOpen, Quote } from "lucide-react";
import type { SiteAboutConfig } from "@growthcoder/types";
import { sanitizeHtml } from "@/lib/sanitize";

interface BiographyStorySectionProps {
  about?: SiteAboutConfig;
}

export function BiographyStorySection({ about }: BiographyStorySectionProps) {
  const storyHtml = about?.storyHtml;
  const quote = about?.quote;
  const quoteAuthor = about?.quoteAuthor;

  if (!storyHtml && !quote) {
    return null;
  }

  const cleanHtml = sanitizeHtml(storyHtml);

  return (
    <section className="py-14 md:py-20 border-b border-border/60 relative">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Section Header */}
        <div className="space-y-2 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kisah &amp; Narasi Karir</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Perjalanan Rekayasa Perangkat Lunak &amp; Dedikasi Teknis
          </h2>
        </div>

        {/* Featured Quote Card */}
        {quote && (
          <div className="mb-10 relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-emerald-500/10 p-6 sm:p-8 backdrop-blur-md shadow-lg">
            <Quote className="w-10 h-10 text-primary/30 absolute -top-1 -left-1 transform -rotate-12 pointer-events-none" />
            <div className="relative space-y-3 z-10">
              <p className="text-base sm:text-lg md:text-xl font-medium text-foreground italic leading-relaxed">
                &ldquo;{quote}&rdquo;
              </p>
              {quoteAuthor && (
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-0.5 w-6 bg-primary" />
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {quoteAuthor}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rich HTML Content from CKEditor 5 */}
        {cleanHtml && (
          <div className="rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-10 shadow-xs backdrop-blur-xs">
            <div
              className="prose prose-zinc dark:prose-invert max-w-none 
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/60 prose-h2:pb-2
                prose-h3:text-lg prose-h3:sm:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-h3:text-foreground
                prose-p:text-muted-foreground prose-p:text-sm prose-p:sm:text-base prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-foreground prose-strong:font-bold
                prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-muted-foreground prose-li:text-sm prose-li:sm:text-base prose-li:mb-1.5
                prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-muted-foreground prose-li:text-sm prose-li:sm:text-base
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/90 prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:rounded-r-lg
                prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-muted prose-code:text-primary prose-code:text-xs prose-code:font-mono
                prose-pre:rounded-xl prose-pre:border prose-pre:border-border/80 prose-pre:bg-zinc-950 prose-pre:p-4 prose-pre:text-zinc-100 prose-pre:shadow-lg
                prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:shadow-md prose-img:my-6
                prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80"
              dangerouslySetInnerHTML={{ __html: cleanHtml }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
