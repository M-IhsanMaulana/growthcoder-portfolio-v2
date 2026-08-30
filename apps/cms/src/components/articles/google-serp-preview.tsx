"use client";

import React, { useState } from "react";
import { Globe, Smartphone, Monitor } from "lucide-react";

interface GoogleSerpPreviewProps {
  title: string;
  slug: string;
  description: string;
}

export function GoogleSerpPreview({
  title,
  slug,
  description,
}: GoogleSerpPreviewProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const displayTitle =
    title.trim() || "Judul Artikel Anda Akan Ditampilkan di Sini";
  const displaySlug = slug.trim() || "url-artikel-anda";
  const displayDesc =
    description.trim() ||
    "Deskripsi meta artikel Anda akan muncul di sini sebagai cuplikan ringkasan pencarian Google. Pastikan informatif dan menarik pembaca.";

  const titleLength = displayTitle.length;
  const descLength = displayDesc.length;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
      {/* Header with Device Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground">
              Google SERP Preview
            </h4>
            <p className="text-[10px] text-muted-foreground">
              Simulasi hasil pencarian Google
            </p>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/40 p-0.5">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`rounded-md p-1 transition-colors cursor-pointer ${
              device === "desktop"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Desktop View"
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`rounded-md p-1 transition-colors cursor-pointer ${
              device === "mobile"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Mobile View"
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Google Result Card Simulation */}
      <div
        className={`rounded-xl border border-border/80 bg-white dark:bg-[#202124] p-3.5 transition-all ${
          device === "mobile" ? "max-w-xs mx-auto shadow-md" : "w-full"
        }`}
      >
        {/* URL breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] text-[#202124] dark:text-[#dadce0] mb-1">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
            GC
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium text-[#202124] dark:text-[#bdc1c6] leading-none">
              growthcoder.id
            </span>
            <span className="text-[9px] text-[#5f6368] dark:text-[#9aa0a6] truncate max-w-[200px] leading-none mt-0.5">
              https://growthcoder.id/artikel/{displaySlug}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer line-clamp-2 leading-snug mt-1">
          {displayTitle} | GrowthCoder
        </h3>

        {/* Snippet Description */}
        <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed mt-1">
          {displayDesc}
        </p>
      </div>

      {/* Length Health Check Badges */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span>Panjang Judul:</span>
          <span
            className={`font-mono font-medium ${
              titleLength > 60
                ? "text-amber-500"
                : titleLength >= 30
                  ? "text-emerald-500"
                  : "text-muted-foreground"
            }`}
          >
            {titleLength}/60
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Panjang Deskripsi:</span>
          <span
            className={`font-mono font-medium ${
              descLength > 160
                ? "text-amber-500"
                : descLength >= 80
                  ? "text-emerald-500"
                  : "text-muted-foreground"
            }`}
          >
            {descLength}/160
          </span>
        </div>
      </div>
    </div>
  );
}
