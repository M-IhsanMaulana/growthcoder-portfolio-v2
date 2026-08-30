"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  FileText,
  Video,
  File,
  Copy,
  Check,
  Eye,
  Trash2,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset } from "@growthcoder/types";

interface MediaGridProps {
  assets: MediaAsset[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onInspect: (asset: MediaAsset) => void;
  onDeleteSingle: (asset: MediaAsset) => void;
}

export function MediaGrid({
  assets,
  selectedIds,
  onToggleSelect,
  onInspect,
  onDeleteSingle,
}: MediaGridProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, url: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL berhasil disalin ke clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <ImageIcon className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          Belum ada file media
        </h3>
        <p className="mt-1 max-w-sm text-xs text-muted-foreground">
          Unggah gambar, dokumen, atau video untuk mulai menggunakan media
          terpusat pada portofolio Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {assets.map((asset) => {
        const isSelected = selectedIds.includes(asset.id);

        return (
          <div
            key={asset.id}
            onClick={() => onInspect(asset)}
            className={`group relative flex flex-col rounded-xl border p-2.5 transition-all duration-200 cursor-pointer overflow-hidden shadow-sm hover:shadow-md ${
              isSelected
                ? "border-emerald-500 bg-emerald-500/5 ring-2 ring-emerald-500/30"
                : "border-border bg-card hover:border-emerald-500/50"
            }`}
          >
            {/* Top Selection Checkbox */}
            <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(asset.id);
                }}
                className={`flex h-6 w-6 items-center justify-center rounded-md transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-card/90 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground border border-border shadow-sm"
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="h-3.5 w-3.5" />
                ) : (
                  <Square className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Thumbnail Box */}
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/40 dark:bg-neutral-950/80 border border-border/40">
              {asset.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(asset.fileUrl)}
                  alt={asset.altText || asset.fileName}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : asset.mediaType === "video" ? (
                <div className="flex flex-col items-center gap-1.5 text-purple-500">
                  <Video className="h-8 w-8" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                    Video
                  </span>
                </div>
              ) : asset.mediaType === "document" ? (
                <div className="flex flex-col items-center gap-1.5 text-blue-500">
                  <FileText className="h-8 w-8" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                    PDF/Doc
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                  <File className="h-8 w-8" />
                  <span className="text-[10px] uppercase font-mono tracking-wider font-semibold">
                    File
                  </span>
                </div>
              )}

              {/* Hover Action Overlay Buttons */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={(e) => handleCopy(e, asset.fileUrl, asset.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900/90 text-white hover:bg-emerald-600 transition-colors shadow-sm cursor-pointer"
                  title="Salin URL"
                >
                  {copiedId === asset.id ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInspect(asset);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900/90 text-white hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                  title="Lihat Detail"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSingle(asset);
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900/90 text-white hover:bg-rose-600 transition-colors shadow-sm cursor-pointer"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Dimension Badge (for images) */}
              {asset.width && asset.height && (
                <div className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-mono text-white backdrop-blur-sm shadow-sm">
                  {asset.width}×{asset.height}
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="mt-2 flex flex-col">
              <span
                className="truncate text-xs font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors"
                title={asset.fileName}
              >
                {asset.fileName}
              </span>
              <div className="mt-0.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="capitalize">{asset.mediaType}</span>
                <span className="font-mono">
                  {formatFileSize(asset.fileSize)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
