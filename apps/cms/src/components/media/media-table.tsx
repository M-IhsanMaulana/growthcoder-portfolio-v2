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
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset } from "@growthcoder/types";

interface MediaTableProps {
  assets: MediaAsset[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onInspect: (asset: MediaAsset) => void;
  onDeleteSingle: (asset: MediaAsset) => void;
}

export function MediaTable({
  assets,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onInspect,
  onDeleteSingle,
}: MediaTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const isAllSelected =
    assets.length > 0 && assets.every((a) => selectedIds.includes(a.id));

  const handleCopy = (url: string, id: string) => {
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

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
      }).format(d);
    } catch {
      return dateStr;
    }
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
          Unggah gambar, dokumen, atau video untuk melihatnya dalam format
          tabel.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-foreground">
          <thead className="border-b border-border bg-muted/60 uppercase text-[10px] tracking-wider text-muted-foreground">
            <tr>
              <th className="w-10 px-4 py-3">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className="flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Dimensi</th>
              <th className="px-4 py-3">Ukuran</th>
              <th className="px-4 py-3">Tanggal Upload</th>
              <th className="px-4 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {assets.map((asset) => {
              const isSelected = selectedIds.includes(asset.id);

              return (
                <tr
                  key={asset.id}
                  onClick={() => onInspect(asset)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-500/10 hover:bg-emerald-500/15"
                      : "hover:bg-muted/40"
                  }`}
                >
                  {/* Select Checkbox */}
                  <td
                    className="px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onToggleSelect(asset.id)}
                      className="flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </td>

                  {/* Thumbnail & File Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40 dark:bg-neutral-950">
                        {asset.mediaType === "image" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveMediaUrl(asset.fileUrl)}
                            alt={asset.fileName}
                            className="h-full w-full object-cover"
                          />
                        ) : asset.mediaType === "video" ? (
                          <Video className="h-5 w-5 text-purple-500" />
                        ) : asset.mediaType === "document" ? (
                          <FileText className="h-5 w-5 text-blue-500" />
                        ) : (
                          <File className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors max-w-xs sm:max-w-sm md:max-w-md">
                          {asset.fileName}
                        </p>
                        {asset.altText && (
                          <p className="truncate text-[11px] text-muted-foreground">
                            Alt: {asset.altText}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium uppercase text-muted-foreground border border-border/50">
                      {asset.mediaType}
                    </span>
                  </td>

                  {/* Dimensions */}
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {asset.width && asset.height
                      ? `${asset.width} × ${asset.height}`
                      : "—"}
                  </td>

                  {/* Size */}
                  <td className="px-4 py-3 font-mono text-[11px] text-foreground">
                    {formatFileSize(asset.fileSize)}
                  </td>

                  {/* Created At */}
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(asset.createdAt)}
                  </td>

                  {/* Actions */}
                  <td
                    className="px-4 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(asset.fileUrl, asset.id)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                        title="Salin URL"
                      >
                        {copiedId === asset.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <a
                        href={asset.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="Buka File"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => onInspect(asset)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSingle(asset)}
                        className="rounded-md p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
