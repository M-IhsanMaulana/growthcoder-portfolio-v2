"use client";

import React, { useState, useRef } from "react";
import { apiClient } from "@/lib/api-client";
import {
  UploadCloud,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { toast } from "sonner";
import type { MediaAsset } from "@growthcoder/types";

interface MediaUploadDropzoneProps {
  onSuccess: (uploadedAssets?: MediaAsset[]) => void;
  onCancel?: () => void;
  allowedTypes?: string[];
  maxFileSizeMB?: number;
}

interface QueuedFile {
  id: string;
  file: globalThis.File;
  altText: string;
  status: "idle" | "uploading" | "success" | "error";
  errorMessage?: string;
}

export function MediaUploadDropzone({
  onSuccess,
  onCancel,
  maxFileSizeMB = 30,
}: MediaUploadDropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;

    const newQueued: QueuedFile[] = [];
    const maxBytes = maxFileSizeMB * 1024 * 1024;

    for (let i = 0; i < incomingFiles.length; i++) {
      const f = incomingFiles[i];
      if (f.size > maxBytes) {
        toast.error(
          `File "${f.name}" melebihi batas ukuran (${maxFileSizeMB}MB)`,
        );
        continue;
      }

      newQueued.push({
        id: `${Date.now()}-${i}-${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        altText: "",
        status: "idle",
      });
    }

    setQueue((prev) => [...prev, ...newQueued]);
  };

  const removeQueuedFile = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const updateAltText = (id: string, text: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, altText: text } : item)),
    );
  };

  const startUpload = async () => {
    if (queue.length === 0) return;

    setIsUploading(true);
    const newlyUploaded: MediaAsset[] = [];
    let hasError = false;

    // If only 1 file or multiple files, we can upload either batch or sequentially for accurate status
    for (const item of queue) {
      if (item.status === "success") continue;

      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: "uploading" } : q)),
      );

      try {
        const formData = new FormData();
        formData.append("file", item.file);
        if (item.altText) {
          formData.append("altText", item.altText);
        }

        const res = await apiClient.upload<MediaAsset>(
          "/api/admin/media/upload",
          formData,
        );

        if (res.success && res.data) {
          newlyUploaded.push(res.data);
          setQueue((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, status: "success" } : q,
            ),
          );
        } else {
          throw new Error(res.message || "Gagal mengunggah file");
        }
      } catch (err: unknown) {
        hasError = true;
        const msg = (err as Error).message || "Gagal upload";
        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: "error", errorMessage: msg } : q,
          ),
        );
      }
    }

    setIsUploading(false);

    if (newlyUploaded.length > 0) {
      toast.success(`Berhasil mengunggah ${newlyUploaded.length} file media`);
      onSuccess(newlyUploaded);
      // Remove success items after a brief delay
      setTimeout(() => {
        setQueue((prev) => prev.filter((q) => q.status !== "success"));
      }, 1500);
    }

    if (hasError) {
      toast.error("Beberapa file gagal diunggah, silakan periksa statusnya.");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (file: globalThis.File) => {
    if (file.type.startsWith("image/"))
      return <ImageIcon className="w-5 h-5 text-emerald-400" />;
    if (file.type.startsWith("video/"))
      return <Video className="w-5 h-5 text-purple-400" />;
    if (file.type.includes("pdf") || file.type.includes("document"))
      return <FileText className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-neutral-400" />;
  };

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/70 p-6 backdrop-blur transition-all shadow-sm">
      {/* Drop area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all ${
          dragOver
            ? "border-emerald-500 bg-emerald-500/10"
            : "border-border/80 hover:border-emerald-500/60 hover:bg-muted/40"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          accept="image/*,video/*,application/pdf,.doc,.docx"
        />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
          <UploadCloud className="h-7 w-7" />
        </div>
        <h4 className="mt-4 text-base font-semibold text-foreground">
          Tarik & letakkan file ke sini, atau{" "}
          <span className="text-emerald-600 dark:text-emerald-400 underline">
            pilih dari perangkat
          </span>
        </h4>
        <p className="mt-1 text-xs text-muted-foreground">
          Mendukung PNG, JPG, WebP, GIF, SVG, PDF, MP4, WebM (Maksimal{" "}
          {maxFileSizeMB}MB per file)
        </p>
      </div>

      {/* Queue items */}
      {queue.length > 0 && (
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Antrean Unggahan ({queue.length} file)
            </h5>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQueue([])}
                disabled={isUploading}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Hapus Semua
              </Button>
              <Button
                size="sm"
                onClick={startUpload}
                disabled={
                  isUploading || queue.every((q) => q.status === "success")
                }
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs shadow-sm"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
                    Unggah ({queue.filter((q) => q.status !== "success").length}
                    )
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {queue.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card/90 p-2.5 text-sm shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted">
                  {getFileIcon(item.file)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-medium text-foreground text-xs">
                      {item.file.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatFileSize(item.file.size)}
                    </span>
                  </div>

                  {item.file.type.startsWith("image/") && (
                    <input
                      type="text"
                      placeholder="Alt Text deskripsi gambar (opsional)..."
                      value={item.altText}
                      disabled={isUploading || item.status === "success"}
                      onChange={(e) => updateAltText(item.id, e.target.value)}
                      className="mt-1 w-full rounded border border-border bg-background px-2 py-0.5 text-[11px] text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none"
                    />
                  )}

                  {item.status === "error" && (
                    <p className="mt-1 text-[11px] text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {item.errorMessage}
                    </p>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {item.status === "uploading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                  )}
                  {item.status === "success" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  )}
                  {item.status === "idle" && (
                    <button
                      type="button"
                      onClick={() => removeQueuedFile(item.id)}
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {onCancel && (
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Tutup
          </Button>
        </div>
      )}
    </div>
  );
}
