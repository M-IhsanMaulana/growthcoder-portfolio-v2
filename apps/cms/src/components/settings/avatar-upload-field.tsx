"use client";

import React, { useState, useRef } from "react";
import {
  User,
  Upload,
  FolderOpen,
  Trash2,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { apiClient, resolveMediaUrl } from "@/lib/api-client";
import { toast } from "sonner";
import type { MediaAsset } from "@growthcoder/types";

interface AvatarUploadFieldProps {
  value: string | null | undefined;
  onChange: (url: string) => void;
  label?: string;
  description?: string;
  error?: string;
}

export function AvatarUploadField({
  value,
  onChange,
  label = "Avatar Profil",
  description = "Format: JPG, PNG, WEBP, atau GIF (Maks. 10MB). Disarankan rasio 1:1 persegi.",
  error,
}: AvatarUploadFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("File harus berupa format gambar (JPG, PNG, WEBP, GIF, SVG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", `Avatar ${file.name}`);

      const res = await apiClient.upload<MediaAsset>(
        "/api/admin/media/upload",
        formData,
      );
      if (res.success && res.data) {
        onChange(res.data.fileUrl);
        toast.success("Avatar profil berhasil diunggah");
      } else {
        throw new Error(res.message || "Gagal mengunggah avatar");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengunggah file avatar");
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
      toast.success("Avatar berhasil dipilih dari Media Library");
    }
    setPickerOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    toast.info("Avatar profil dihapus");
  };

  const resolvedUrl = value ? resolveMediaUrl(value) : "";

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
            <span>Hapus Avatar</span>
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
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
        />

        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Avatar Preview */}
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl border-2 border-border/80 bg-muted/60 overflow-hidden shadow-xs flex items-center justify-center relative">
              {resolvedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolvedUrl}
                  alt="Avatar preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 bg-muted/30">
                  <User className="w-8 h-8 stroke-[1.5]" />
                </div>
              )}

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
                title="Lihat ukuran penuh"
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
                    <span className="truncate">{value}</span>
                  </span>
                ) : (
                  "Belum ada foto avatar yang diunggah"
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
                    {value ? "Unggah Foto Baru" : "Unggah File Foto"}
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
        title="Pilih Avatar Profil dari Media Library"
        acceptTypes={["image"]}
      />
    </div>
  );
}
