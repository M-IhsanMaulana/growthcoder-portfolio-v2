"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  Save,
  Image as ImageIcon,
  FileText,
  Video,
  File,
  Loader2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { toast } from "sonner";
import { apiClient, resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset, MediaUsageItem } from "@growthcoder/types";

interface MediaDetailDrawerProps {
  assetId: string | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (updatedAsset: MediaAsset) => void;
  onDeleted: (deletedId: string) => void;
}

export function MediaDetailDrawer({
  assetId,
  open,
  onClose,
  onUpdated,
  onDeleted,
}: MediaDetailDrawerProps) {
  const [asset, setAsset] = useState<MediaAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Edit form state
  const [fileName, setFileName] = useState("");
  const [altText, setAltText] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [usageError, setUsageError] = useState<MediaUsageItem[] | null>(null);

  useEffect(() => {
    if (!assetId || !open) {
      setAsset(null);
      setUsageError(null);
      setDeleteConfirmOpen(false);
      return;
    }

    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await apiClient.get<MediaAsset>(
          `/api/admin/media/${assetId}`,
        );
        if (res.success && res.data) {
          setAsset(res.data);
          setFileName(res.data.fileName || "");
          setAltText(res.data.altText || "");
        }
      } catch (err: unknown) {
        toast.error((err as Error).message || "Gagal memuat detail file");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [assetId, open]);

  if (!open) return null;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Berhasil menyalin ${field}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveMetadata = async () => {
    if (!asset) return;

    setIsSaving(true);
    try {
      const res = await apiClient.patch<MediaAsset>(
        `/api/admin/media/${asset.id}`,
        {
          fileName,
          altText,
        },
      );

      if (res.success && res.data) {
        setAsset(res.data);
        onUpdated(res.data);
        toast.success("Metadata berhasil disimpan");
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal memperbarui metadata");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (force = false) => {
    if (!asset) return;

    setIsDeleting(true);
    try {
      const res = await apiClient.delete(
        `/api/admin/media/${asset.id}${force ? "?force=true" : ""}`,
      );
      if (res.success) {
        toast.success("Media asset berhasil dihapus");
        onDeleted(asset.id);
        onClose();
      }
    } catch (err: unknown) {
      const customErr = err as { usages?: MediaUsageItem[]; message?: string };
      if (customErr.usages && customErr.usages.length > 0) {
        setUsageError(customErr.usages);
      } else {
        toast.error(customErr.message || "Gagal menghapus media asset");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative flex h-full w-full max-w-xl flex-col bg-background border-l border-border shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-base">
              Detail Media Asset
            </h3>
            {asset && (
              <span className="rounded bg-muted px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-border uppercase">
                {asset.mediaType}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : asset ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Visual Preview */}
            <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-muted/30 dark:bg-neutral-900/90 group">
              {asset.mediaType === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(asset.fileUrl)}
                  alt={asset.altText || asset.fileName}
                  className="max-h-full max-w-full object-contain"
                />
              ) : asset.mediaType === "video" ? (
                <video
                  src={resolveMediaUrl(asset.fileUrl)}
                  controls
                  className="max-h-full max-w-full"
                />
              ) : asset.mediaType === "document" ? (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <FileText className="h-16 w-16 text-blue-500" />
                  <span className="text-xs font-medium text-foreground">
                    {asset.fileName}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <File className="h-16 w-16 text-muted-foreground" />
                  <span className="text-xs font-medium text-foreground">
                    {asset.fileName}
                  </span>
                </div>
              )}

              {/* View in new tab overlay */}
              <a
                href={resolveMediaUrl(asset.fileUrl)}
                target="_blank"
                rel="noreferrer"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 text-foreground border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted shadow-sm cursor-pointer"
                title="Buka di tab baru"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(asset.fileUrl, "URL File")}
                className="text-xs gap-1.5 border-border bg-card hover:bg-muted text-foreground shadow-sm cursor-pointer"
              >
                {copiedField === "URL File" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Salin URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(asset.id, "ID Media")}
                className="text-xs gap-1.5 border-border bg-card hover:bg-muted text-foreground shadow-sm cursor-pointer"
              >
                {copiedField === "ID Media" ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                Salin ID
              </Button>
              <a
                href={asset.fileUrl}
                download={asset.fileName}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted text-foreground text-xs font-medium gap-1.5 h-9 px-3 transition-colors shadow-sm cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh
              </a>
            </div>

            {/* Editable Metadata Form */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-4 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Metadata File
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Nama File (Title)
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-emerald-500 focus:outline-none shadow-sm"
                />
              </div>

              {asset.mediaType === "image" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Alt Text (Aksesibilitas & SEO)
                  </label>
                  <input
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Deskripsi singkat gambar..."
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none shadow-sm"
                  />
                </div>
              )}

              <Button
                size="sm"
                onClick={handleSaveMetadata}
                disabled={isSaving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-sm"
              >
                {isSaving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                Simpan Perubahan
              </Button>
            </div>

            {/* Technical Information Table */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-3 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Informasi Teknis
              </h4>
              <div className="grid grid-cols-2 gap-y-2.5 text-xs">
                <span className="text-muted-foreground">Ukuran File:</span>
                <span className="font-mono text-foreground">
                  {formatFileSize(asset.fileSize)}
                </span>

                {asset.width && asset.height ? (
                  <>
                    <span className="text-muted-foreground">Dimensi:</span>
                    <span className="font-mono text-foreground">
                      {asset.width} × {asset.height} px
                    </span>
                  </>
                ) : null}

                <span className="text-muted-foreground">MIME Type:</span>
                <span className="font-mono text-foreground">
                  {asset.mimeType}
                </span>

                <span className="text-muted-foreground">Storage Key:</span>
                <span
                  className="font-mono text-foreground truncate"
                  title={asset.filePath}
                >
                  {asset.filePath}
                </span>

                <span className="text-muted-foreground">Tanggal Diunggah:</span>
                <span className="text-foreground">
                  {formatDate(asset.createdAt)}
                </span>
              </div>
            </div>

            {/* Usages Section */}
            {asset.usages && asset.usages.length > 0 && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-xs">
                  <Info className="h-4 w-4 shrink-0" />
                  Digunakan di {asset.usages.length} Konten
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                  {asset.usages.map((u, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg bg-card border border-border px-2.5 py-1.5 text-xs shadow-sm"
                    >
                      <span className="font-medium text-foreground truncate max-w-[240px]">
                        {u.title}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground capitalize border border-border/50">
                        {u.entity.replace("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Error Warning during delete */}
            {usageError && usageError.length > 0 && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-500 text-xs font-semibold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  File tidak dapat dihapus langsung karena masih digunakan:
                </div>
                <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
                  {usageError.map((u, idx) => (
                    <li key={idx}>
                      <span className="font-medium text-foreground">
                        {u.title}
                      </span>{" "}
                      ({u.fieldName})
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setUsageError(null)}
                    className="text-xs text-foreground hover:bg-muted"
                  >
                    Batal
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(true)}
                    disabled={isDeleting}
                    className="bg-rose-600 hover:bg-rose-500 text-white text-xs shadow-sm"
                  >
                    {isDeleting ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : null}
                    Paksa Hapus (Set Null Relasi)
                  </Button>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="border-t border-border pt-4">
              {!deleteConfirmOpen ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirmOpen(true)}
                  className="w-full border-rose-500/30 text-rose-500 hover:bg-rose-500/10 text-xs gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus Media Asset
                </Button>
              ) : (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 space-y-3">
                  <p className="text-xs text-rose-600 dark:text-rose-300">
                    Apakah Anda yakin ingin menghapus file ini secara permanen
                    dari storage?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="flex-1 text-xs text-foreground hover:bg-muted"
                    >
                      Batal
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleDelete(false)}
                      disabled={isDeleting}
                      className="flex-1 bg-rose-600 hover:bg-rose-500 text-white text-xs shadow-sm"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      ) : null}
                      Konfirmasi Hapus
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Aset tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
}
