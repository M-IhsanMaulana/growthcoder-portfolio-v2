"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  X,
  Search,
  Check,
  UploadCloud,
  Image as ImageIcon,
  FileText,
  Video,
  File,
  Loader2,
  CheckSquare,
  Square,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { apiClient, resolveMediaUrl } from "@/lib/api-client";
import { MediaUploadDropzone } from "./media-upload-dropzone";
import type { MediaAsset, MediaType } from "@growthcoder/types";

interface MediaPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selected: MediaAsset | MediaAsset[]) => void;
  multiple?: boolean;
  acceptTypes?: MediaType[];
  title?: string;
  initialSelectedIds?: string[];
}

export function MediaPickerDialog({
  open,
  onOpenChange,
  onSelect,
  multiple = false,
  acceptTypes,
  title = "Pilih Media Asset",
  initialSelectedIds = [],
}: MediaPickerDialogProps) {
  const [activeTab, setActiveTab] = useState<"browse" | "upload">("browse");
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<MediaType | "all">("all");
  const [selectedMap, setSelectedMap] = useState<Map<string, MediaAsset>>(
    new Map(),
  );

  // Sync initial selection
  useEffect(() => {
    if (open) {
      setSelectedMap(new Map());
      setActiveTab("browse");
    }
  }, [open]);

  const fetchAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        perPage: "36",
      });

      if (filterType !== "all") {
        params.set("type", filterType);
      } else if (acceptTypes && acceptTypes.length === 1) {
        params.set("type", acceptTypes[0]);
      }

      if (search.trim()) {
        params.set("search", search.trim());
      }

      const res = await apiClient.get<MediaAsset[]>(
        `/api/admin/media?${params.toString()}`,
      );
      if (res.success && res.data) {
        let items = res.data;
        if (acceptTypes && acceptTypes.length > 0) {
          items = items.filter((item) => acceptTypes.includes(item.mediaType));
        }
        setAssets(items);
      }
    } catch (err) {
      console.error("Error loading media library picker:", err);
    } finally {
      setIsLoading(false);
    }
  }, [filterType, acceptTypes, search]);

  useEffect(() => {
    if (open) {
      fetchAssets();
    }
  }, [open, fetchAssets]);

  if (!open) return null;

  const toggleSelect = (asset: MediaAsset) => {
    setSelectedMap((prev) => {
      const next = new Map(prev);
      if (next.has(asset.id)) {
        next.delete(asset.id);
      } else {
        if (!multiple) {
          next.clear();
        }
        next.set(asset.id, asset);
      }
      return next;
    });
  };

  const handleConfirmSelection = () => {
    const selectedList = Array.from(selectedMap.values());
    if (selectedList.length === 0) return;

    if (multiple) {
      onSelect(selectedList);
    } else {
      onSelect(selectedList[0]);
    }
    onOpenChange(false);
  };

  const handleUploadSuccess = (uploadedAssets?: MediaAsset[]) => {
    fetchAssets();
    if (uploadedAssets && uploadedAssets.length > 0) {
      setSelectedMap((prev) => {
        const next = multiple ? new Map(prev) : new Map();
        for (const up of uploadedAssets) {
          next.set(up.id, up);
        }
        return next;
      });
      setActiveTab("browse");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="relative flex h-[88vh] w-full max-w-5xl flex-col rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {multiple
                  ? "Pilih satu atau beberapa file dari media storage terpusat"
                  : "Pilih satu file dari media storage terpusat"}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 text-muted-foreground opacity-70 hover:opacity-100 hover:bg-muted/80 transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector & Filter Bar */}
        <div className="border-b border-border px-6 py-3 bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("browse")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "browse"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Jelajahi Library
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("upload")}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === "upload"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Unggah Baru
            </button>
          </div>

          {activeTab === "browse" && (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari media..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 sm:w-60 rounded-lg border border-border bg-card py-1.5 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none shadow-sm"
                />
              </div>

              {!acceptTypes && (
                <Select
                  value={filterType}
                  onValueChange={(val) =>
                    setFilterType(val as MediaType | "all")
                  }
                >
                  <SelectTrigger className="w-32 h-8 text-xs">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs">
                      Semua Tipe
                    </SelectItem>
                    <SelectItem value="image" className="text-xs">
                      Gambar
                    </SelectItem>
                    <SelectItem value="document" className="text-xs">
                      Dokumen
                    </SelectItem>
                    <SelectItem value="video" className="text-xs">
                      Video
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === "upload" ? (
            <MediaUploadDropzone
              onSuccess={handleUploadSuccess}
              onCancel={() => setActiveTab("browse")}
            />
          ) : isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground/60 mb-2" />
              <p className="text-sm font-medium text-foreground">
                Tidak ada media ditemukan
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Coba ubah kata kunci pencarian atau unggah file baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {assets.map((asset) => {
                const isSelected = selectedMap.has(asset.id);

                return (
                  <div
                    key={asset.id}
                    onClick={() => toggleSelect(asset)}
                    className={`group relative flex flex-col rounded-xl border p-2 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-md ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30"
                        : "border-border bg-card hover:border-emerald-500/50"
                    }`}
                  >
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute left-2.5 top-2.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-md">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                    )}

                    {/* Thumbnail */}
                    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/40 dark:bg-neutral-950 border border-border/40">
                      {asset.mediaType === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveMediaUrl(asset.fileUrl)}
                          alt={asset.fileName}
                          className="h-full w-full object-cover"
                        />
                      ) : asset.mediaType === "video" ? (
                        <Video className="h-7 w-7 text-purple-500" />
                      ) : asset.mediaType === "document" ? (
                        <FileText className="h-7 w-7 text-blue-500" />
                      ) : (
                        <File className="h-7 w-7 text-muted-foreground" />
                      )}

                      {asset.width && asset.height && (
                        <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1 py-0.5 text-[8px] font-mono text-white shadow-sm">
                          {asset.width}×{asset.height}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="mt-1.5 min-w-0">
                      <p className="truncate text-xs font-medium text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {asset.fileName}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {formatFileSize(asset.fileSize)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-6 py-3.5">
          <div className="text-xs text-muted-foreground">
            {selectedMap.size > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {selectedMap.size} file terpilih
              </span>
            ) : (
              "Belum ada file yang dipilih"
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmSelection}
              disabled={selectedMap.size === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 shadow-sm"
            >
              Gunakan Media Terpilih
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
