"use client";

import React from "react";
import Image from "next/image";
import {
  FileText,
  Tag as TagIcon,
  Folder,
  Calendar,
  Clock,
  Type,
  AlignLeft,
  Sparkles,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/api-client";
import { sanitizeHtml } from "@/lib/sanitize";
import type { Article } from "@growthcoder/types";

interface ArticleOverviewTabProps {
  article: Article;
}

export function ArticleOverviewTab({ article }: ArticleOverviewTabProps) {
  const wordCount = article.content
    ? article.content
        .replace(/<[^>]*>?/gm, " ")
        .trim()
        .split(/\s+/)
        .filter(Boolean).length
    : 0;
  const charCount = article.content
    ? article.content.replace(/<[^>]*>?/gm, "").length
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content Preview (2 Columns) */}
      <div className="lg:col-span-2 space-y-6">
        {/* Cover Image Banner if present */}
        {article.coverImage && (
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-border shadow-xs bg-muted/40 group">
            <img
              src={resolveMediaUrl(article.coverImage)}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 backdrop-blur-md border border-white/20">
                Cover Image
              </span>
            </div>
          </div>
        )}

        {/* Content Body Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div className="flex items-center gap-2 text-foreground font-semibold text-base">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>Pratinjau Konten Lengkap</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              HTML Rendered View
            </div>
          </div>

          {/* Excerpt Highlight */}
          {article.excerpt && (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-muted-foreground text-sm italic leading-relaxed">
              <strong className="text-foreground not-italic font-semibold block mb-1 text-xs">
                Ringkasan / Excerpt:
              </strong>
              {article.excerpt}
            </div>
          )}

          {/* Article HTML Content (Sanitized & Rich Typography) */}
          <div
            className="article-content-rendered rich-content-body max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                sanitizeHtml(article.content) ||
                '<p class="text-muted-foreground italic">Konten artikel belum diisi.</p>',
            }}
          />
        </div>
      </div>

      {/* Side Meta & Details Panel (1 Column) */}
      <div className="space-y-6">
        {/* Quick Content Metrics Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Statistik Konten
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] text-muted-foreground block">
                Jumlah Kata
              </span>
              <span className="text-lg font-bold text-foreground font-mono">
                {wordCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] text-muted-foreground block">
                Jumlah Karakter
              </span>
              <span className="text-lg font-bold text-foreground font-mono">
                {charCount}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] text-muted-foreground block">
                Estimasi Baca
              </span>
              <span className="text-lg font-bold text-foreground font-mono">
                ~{article.readingTimeMinutes || 1} min
              </span>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 border border-border/60">
              <span className="text-[11px] text-muted-foreground block">
                Total Views
              </span>
              <span className="text-lg font-bold text-primary font-mono">
                {article.viewCount || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Taxonomy Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Folder className="w-4 h-4 text-primary" />
            Kategori & Tag
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block mb-1.5 font-medium">
                Kategori:
              </span>
              {article.category ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-semibold">
                  <Folder className="w-3.5 h-3.5" />
                  {article.category.name}
                </div>
              ) : (
                <span className="text-muted-foreground italic">
                  Tanpa Kategori
                </span>
              )}
            </div>

            <div>
              <span className="text-muted-foreground block mb-1.5 font-medium">
                Tag Terkait:
              </span>
              {article.tags && article.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border text-[11px] font-medium"
                    >
                      <TagIcon className="w-3 h-3 text-muted-foreground" />
                      {tag.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-muted-foreground italic">
                  Belum ada tag
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Publishing Details Card */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Informasi Publikasi
          </h3>

          <div className="space-y-3 text-xs divide-y divide-border/60">
            <div className="pt-2 first:pt-0 flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-semibold capitalize text-foreground">
                {article.status}
              </span>
            </div>

            {article.scheduledAt && (
              <div className="pt-2 flex justify-between">
                <span className="text-muted-foreground">Dijadwalkan Pada:</span>
                <span className="font-medium text-foreground">
                  {new Date(article.scheduledAt).toLocaleString("id-ID")}
                </span>
              </div>
            )}

            <div className="pt-2 flex justify-between">
              <span className="text-muted-foreground">Waktu Dibuat:</span>
              <span className="font-medium text-foreground">
                {new Date(article.createdAt).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="pt-2 flex justify-between">
              <span className="text-muted-foreground">Terakhir Diupdate:</span>
              <span className="font-medium text-foreground">
                {new Date(article.updatedAt).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
