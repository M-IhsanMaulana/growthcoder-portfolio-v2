"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@growthcoder/ui";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import type { Article } from "@growthcoder/types";

interface LatestArticlesSectionProps {
  articles: Article[];
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

export function LatestArticlesSection({
  articles,
}: LatestArticlesSectionProps) {
  const latestList = articles.slice(0, 3);

  if (latestList.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 sm:py-24 border-t border-border/40 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-3">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Blog &amp; Tulisan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground">
              Artikel &amp; Catatan Terbaru
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
              Berbagi seputar teknologi, edukasi, perjalanan karir, tips
              praktis, dan proses belajar sehari-hari.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 border-border/80 hover:border-primary/50 text-xs sm:text-sm font-semibold shrink-0 gap-2 self-start md:self-auto"
          >
            <Link href="/blog">
              <span>Semua Artikel</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Articles 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {latestList.map((article, idx) => (
            <motion.article
              key={article.id || article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="relative flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group cursor-pointer"
            >
              <div>
                {/* Article Cover Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  {article.coverImage ? (
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-mono text-xs">
                      Engineering Article
                    </div>
                  )}

                  {/* Top Category / Tag badge */}
                  {article.tags && article.tags[0] && (
                    <div className="absolute top-3.5 left-3.5 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-sm">
                        {article.tags[0].name}
                      </span>
                    </div>
                  )}
                </div>

                {/* Article Info & Title */}
                <div className="p-6 sm:p-7">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.publishedAt || article.createdAt)}
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {article.readingTimeMinutes || 5} min read
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-foreground mb-2.5 group-hover:text-primary transition-colors line-clamp-2">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="after:absolute after:inset-0 after:z-10 focus:outline-none"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Footer Action (View Counter completely excluded) */}
              <div className="px-6 sm:px-7 pb-6 pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                <span className="font-semibold text-primary inline-flex items-center gap-1">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>

                {article.category && (
                  <span className="text-[11px] text-muted-foreground font-medium">
                    {article.category.name}
                  </span>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
