"use client";

import React from "react";
import {
  Globe,
  Search,
  Share2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";
import { GoogleSerpPreview } from "./google-serp-preview";
import { resolveMediaUrl } from "@/lib/api-client";
import type { Article } from "@growthcoder/types";

interface ArticleSeoTabProps {
  article: Article;
}

export function ArticleSeoTab({ article }: ArticleSeoTabProps) {
  const metaTitle = article.metaTitle || article.title;
  const metaDescription = article.metaDescription || article.excerpt || "";
  const coverUrl = article.coverImage
    ? resolveMediaUrl(article.coverImage)
    : null;

  // SEO Health Checks
  const checks = [
    {
      title: "Meta Title",
      status:
        metaTitle && metaTitle.length >= 30 && metaTitle.length <= 65
          ? "passed"
          : "warning",
      desc: metaTitle
        ? `Panjang: ${metaTitle.length} karakter (Disarankan: 30 - 65 karakter)`
        : "Meta title belum diisi secara kustom.",
    },
    {
      title: "Meta Description",
      status:
        metaDescription &&
        metaDescription.length >= 70 &&
        metaDescription.length <= 160
          ? "passed"
          : "warning",
      desc: metaDescription
        ? `Panjang: ${metaDescription.length} karakter (Disarankan: 70 - 160 karakter)`
        : "Meta description belum diisi.",
    },
    {
      title: "Open Graph Cover Image",
      status: coverUrl ? "passed" : "warning",
      desc: coverUrl
        ? "Gambar cover tersedia untuk thumbnail pratinjau sosial."
        : "Belum ada gambar cover untuk thumbnail sosial.",
    },
    {
      title: "Struktur Slug URL",
      status: /^[a-z0-9-]+$/.test(article.slug) ? "passed" : "error",
      desc: `/${article.slug} (Format slug standar & ramah SEO)`,
    },
    {
      title: "Penetapan Kategori & Taksonomi",
      status: article.category ? "passed" : "warning",
      desc: article.category
        ? `Kategori: ${article.category.name}`
        : "Artikel belum memiliki kategori.",
    },
  ];

  const passedCount = checks.filter((c) => c.status === "passed").length;
  const score = Math.round((passedCount / checks.length) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Column: Google SERP & Social Previews */}
      <div className="space-y-6">
        {/* Google SERP Preview Component */}
        <GoogleSerpPreview
          title={metaTitle}
          slug={article.slug}
          description={metaDescription}
        />

        {/* Social Media Open Graph Share Preview */}
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2 text-foreground font-semibold text-xs">
              <Share2 className="w-4 h-4 text-primary" />
              <span>Social Share (Open Graph) Preview</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-mono">
              Twitter / LinkedIn / FB
            </span>
          </div>

          {/* Social Card Simulation */}
          <div className="rounded-xl border border-border overflow-hidden bg-card/80 shadow-xs">
            {coverUrl ? (
              <div className="relative w-full h-44 bg-muted">
                <img
                  src={coverUrl}
                  alt={metaTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-full h-36 bg-muted/60 flex flex-col items-center justify-center text-muted-foreground text-xs space-y-1">
                <ImageIcon className="w-8 h-8 opacity-40" />
                <span>Belum ada cover image</span>
              </div>
            )}

            <div className="p-4 space-y-1.5 bg-muted/20">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                GROWTHCODER.ID
              </span>
              <h4 className="font-bold text-sm text-foreground line-clamp-1">
                {metaTitle}
              </h4>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {metaDescription}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: SEO Health Score & Audit Checklist */}
      <div className="space-y-6">
        {/* Overall SEO Score Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Skor Kesehatan SEO
              </h3>
              <p className="text-xs text-muted-foreground">
                Kesiapan artikel untuk visibilitas mesin pencari
              </p>
            </div>

            <div className="text-right">
              <span className="text-3xl font-bold font-mono text-emerald-500">
                {score}
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                /100
              </span>
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                score >= 80
                  ? "bg-emerald-500"
                  : score >= 60
                    ? "bg-amber-500"
                    : "bg-rose-500"
              }`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Audit Checklist Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            Checklist Audit Metadata
          </h3>

          <div className="space-y-3">
            {checks.map((check, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border bg-card/60 flex items-start gap-3"
              >
                {check.status === "passed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                ) : check.status === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}

                <div className="space-y-0.5 flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">
                      {check.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        check.status === "passed"
                          ? "text-emerald-500"
                          : check.status === "warning"
                            ? "text-amber-500"
                            : "text-rose-500"
                      }`}
                    >
                      {check.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {check.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
