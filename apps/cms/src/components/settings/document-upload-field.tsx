"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Upload,
  FolderOpen,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle2,
  FileDown,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { apiClient, resolveMediaUrl } from "@/lib/api-client";
import { toast } from "sonner";
import type { MediaAsset } from "@growthcoder/types";

interface DocumentUploadFieldProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  error?: string;
  accept?: string;
}

export function DocumentUploadField({
  value,
  onChange,
  label = "Resume / CV (PDF)",
  description = "Format: Dokumen PDF (Maks. 30MB). File ini dapat diunduh oleh pengunjung pada website publik.",
  error,
  accept = ".pdf,application/pdf",
}: DocumentUploadFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("File harus berupa dokumen format PDF");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      toast.error("Ukuran file PDF maksimal 30MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", `Dokumen CV ${file.name}`);

      const res = await apiClient.upload<MediaAsset>(
        "/api/admin/media/upload",
        formData,
      );
      if (res.success && res.data) {
        onChange(res.data.fileUrl);
        toast.success("File Resume / CV berhasil diunggah");
      } else {
        throw new Error(res.message || "Gagal mengunggah dokumen CV");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengunggah file PDF");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleSelectMedia = (selected: MediaAsset | MediaAsset[]) => {
    const asset = Array.isArray(selected) ? selected[0] : selected;
    if (asset) {
      onChange(asset.fileUrl);
      toast.success("Dokumen CV berhasil dipilih dari Media Library");
    }
    setPickerOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    toast.info("File Resume / CV dihapus");
  };

  const resolvedUrl = value ? resolveMediaUrl(value) : "";
  const fileName = value ? value.split("/").pop() || value : "";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus File</span>
          </button>
        )}
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileChange(e.dataTransfer.files);
        }}
        className={`relative rounded-2xl border transition-all p-4 ${
          dragOver
            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
            : "border-border bg-card/50 hover:bg-card/80"
        } ${error ? "border-destructive" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Document Preview Icon */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl border-2 border-border/80 bg-rose-500/10 text-rose-600 dark:text-rose-400 overflow-hidden shadow-xs flex items-center justify-center relative">
              <FileText className="w-8 h-8 stroke-[1.5]" />

              {isUploading && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-xs flex flex-col items-center justify-center text-primary">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-[10px] font-medium mt-1">
                    Mengunggah...
                  </span>
                </div>
              )}
            </div>

            {resolvedUrl && !isUploading && (
              <a
                href={resolvedUrl}
                target="_blank"
                rel="noreferrer"
                title="Buka / Unduh Dokumen PDF"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border border-border text-muted-foreground hover:text-foreground flex items-center justify-center shadow-xs transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Details and Action Buttons */}
          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <div>
              <p className="text-xs font-medium text-foreground truncate max-w-full">
                {value ? (
                  <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate font-semibold">{fileName}</span>
                  </span>
                ) : (
                  "Belum ada file Resume / CV yang diunggah"
                )}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="text-xs h-8 px-3 rounded-lg border-dashed hover:border-primary hover:text-primary transition-all cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Mengunggah...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {value ? "Unggah CV Baru" : "Unggah File PDF"}
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isUploading}
                onClick={() => setPickerOpen(true)}
                className="text-xs h-8 px-3 rounded-lg cursor-pointer"
              >
                <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-primary" />
                Media Library
              </Button>

              {resolvedUrl && (
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs h-8 px-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground bg-background hover:bg-muted transition-colors"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  Pratinjau PDF
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectMedia}
        title="Pilih Dokumen CV dari Media Library"
        acceptTypes={["document"]}
      />
    </div>
  );
}
