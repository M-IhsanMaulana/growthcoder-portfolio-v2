"use client";

import React from "react";
import {
  Search,
  LayoutGrid,
  List,
  Upload,
  Trash2,
  Image as ImageIcon,
  FileText,
  Video,
  Layers,
  ArrowUpDown,
  X,
} from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import type { MediaType } from "@growthcoder/types";

interface MediaFilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  activeType: MediaType | "all";
  onTypeChange: (type: MediaType | "all") => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
  isUploadOpen: boolean;
  onToggleUpload: () => void;
  isBulkDeleting?: boolean;
}

export function MediaFilterBar({
  search,
  onSearchChange,
  activeType,
  onTypeChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortByChange,
  selectedCount,
  onBulkDelete,
  onClearSelection,
  isUploadOpen,
  onToggleUpload,
  isBulkDeleting = false,
}: MediaFilterBarProps) {
  const mediaTypes: Array<{
    label: string;
    value: MediaType | "all";
    icon: React.ElementType;
  }> = [
    { label: "Semua", value: "all", icon: Layers },
    { label: "Gambar", value: "image", icon: ImageIcon },
    { label: "Dokumen", value: "document", icon: FileText },
    { label: "Video", value: "video", icon: Video },
    { label: "Lainnya", value: "other", icon: Layers },
  ];

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari file berdasarkan nama atau alt text..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-8 text-sm text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-sm"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Right tools */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Sort selector */}
          <Select value={sortBy} onValueChange={(val) => onSortByChange(val)}>
            <SelectTrigger className="h-8.5 text-xs w-44 bg-card">
              <div className="flex items-center gap-1.5 truncate">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <SelectValue placeholder="Urutkan..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at_desc" className="text-xs">
                Terbaru
              </SelectItem>
              <SelectItem value="created_at_asc" className="text-xs">
                Terlama
              </SelectItem>
              <SelectItem value="file_name_asc" className="text-xs">
                Nama (A - Z)
              </SelectItem>
              <SelectItem value="file_name_desc" className="text-xs">
                Nama (Z - A)
              </SelectItem>
              <SelectItem value="file_size_desc" className="text-xs">
                Ukuran (Terbesar)
              </SelectItem>
              <SelectItem value="file_size_asc" className="text-xs">
                Ukuran (Terkecil)
              </SelectItem>
            </SelectContent>
          </Select>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted/50 p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("table")}
              className={`rounded-md p-1.5 transition-colors cursor-pointer ${
                viewMode === "table"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          {/* Upload CTA Button */}
          <Button
            onClick={onToggleUpload}
            className={`text-xs gap-1.5 cursor-pointer ${
              isUploadOpen
                ? "border border-border bg-card text-foreground hover:bg-muted"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            {isUploadOpen ? "Tutup Upload" : "Unggah File"}
          </Button>
        </div>
      </div>

      {/* Filter Tabs & Bulk Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-3">
        {/* Type tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {mediaTypes.map((item) => {
            const Icon = item.icon;
            const isActive = activeType === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onTypeChange(item.value)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Bulk Action Bar (when selected) */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2 rounded-lg bg-card border border-border px-3 py-1 shadow-sm animate-in fade-in slide-in-from-right-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {selectedCount} dipilih
            </span>
            <div className="h-3.5 w-px bg-border" />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Batal
            </Button>
            <Button
              size="sm"
              onClick={onBulkDelete}
              disabled={isBulkDeleting}
              className="h-7 px-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1 shadow-sm"
            >
              <Trash2 className="h-3 w-3" />
              Hapus ({selectedCount})
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
