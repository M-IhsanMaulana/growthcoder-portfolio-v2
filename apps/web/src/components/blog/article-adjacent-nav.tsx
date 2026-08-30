"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Article } from "@growthcoder/types";

interface ArticleAdjacentNavProps {
  prev: Article | null;
  next: Article | null;
}

export function ArticleAdjacentNav({ prev, next }: ArticleAdjacentNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-8 border-t border-border/40">
      {/* Previous Article */}
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/50 transition-all duration-300"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 group-hover:text-primary transition-colors">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Artikel Sebelumnya</span>
          </div>
          <h4 className="text-sm font-bold font-heading text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {prev.title}
          </h4>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}

      {/* Next Article */}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col items-end text-right p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/50 transition-all duration-300 sm:col-start-2"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 group-hover:text-primary transition-colors">
            <span>Artikel Selanjutnya</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
          <h4 className="text-sm font-bold font-heading text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
            {next.title}
          </h4>
        </Link>
      ) : (
        <div className="hidden sm:block" />
      )}
    </div>
  );
}
