"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";
import type { Article } from "@growthcoder/types";
import { TiltCard } from "@/components/animations/tilt-card";

interface ArticleCardProps {
  article: Article;
  index?: number;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Terbaru";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  const primaryTag =
    article.tags && article.tags[0]
      ? article.tags[0].name
      : article.category?.name || "Engineering";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
      className="h-full flex flex-col"
    >
      <TiltCard maxTilt={4} className="h-full rounded-3xl">
        <article className="relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group h-full cursor-pointer">
          <div>
            {/* Article Cover Image */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40">
              {article.coverImage ? (
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-card text-muted-foreground">
                  <BookOpen className="h-8 w-8 text-primary/40 mb-2" />
                  <span className="font-mono text-xs font-medium">
                    Engineering Article
                  </span>
                </div>
              )}

              {/* Primary Badge */}
              <div className="absolute top-3.5 left-3.5 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-sm">
                  {primaryTag}
                </span>
              </div>
            </div>

            {/* Article Metadata & Excerpt */}
            <div className="p-6 sm:p-7">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-primary/80" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary/80" />
                  {article.readingTimeMinutes || 5} min read
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                <Link
                  href={`/blog/${article.slug}`}
                  className="after:absolute after:inset-0 after:z-10 focus:outline-none"
                >
                  {article.title}
                </Link>
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              {/* Tags List */}
              {article.tags && article.tags.length > 1 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {article.tags.slice(0, 3).map((t) => (
                    <span
                      key={t.id || t.slug}
                      className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground border border-border/40"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action (View Counter completely excluded) */}
          <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-border/30 flex items-center justify-between text-xs">
            <span className="font-semibold text-primary inline-flex items-center gap-1.5 group/btn">
              <span>Baca Selengkapnya</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </span>

            {article.category && (
              <span className="text-[11px] text-muted-foreground truncate max-w-[140px]">
                {article.category.name}
              </span>
            )}
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}
