"use client";

import { BookOpen } from "lucide-react";
import { ArticleCard } from "./article-card";
import type { Article } from "@growthcoder/types";

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-16 sm:mt-24 pt-12 sm:pt-16 border-t border-border/40">
      <div className="mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-3">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Rekomendasi Bacaan</span>
        </div>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-heading text-foreground tracking-tight">
          Artikel Terkait
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {articles.slice(0, 3).map((article, idx) => (
          <ArticleCard
            key={article.id || article.slug}
            article={article}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
