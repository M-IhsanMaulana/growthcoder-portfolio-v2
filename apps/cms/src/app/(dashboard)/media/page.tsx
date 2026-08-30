"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  HardDrive,
  FileText,
  Video,
  Layers,
  Upload,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { MediaUploadDropzone } from "@/components/media/media-upload-dropzone";
import { MediaFilterBar } from "@/components/media/media-filter-bar";
import { MediaGrid } from "@/components/media/media-grid";
import { MediaTable } from "@/components/media/media-table";
import { MediaDetailDrawer } from "@/components/media/media-detail-drawer";
import { useAuth } from "@/hooks/use-auth";

import type {
  MediaAsset,
  MediaType,
  MediaStats,
  PaginationMeta,
  BulkDeleteMediaRequest,
} from "@growthcoder/types";

export default function MediaLibraryPage() {
  const { isLoading: isAuthLoading, isAuthenticated } = useAuth();

  // State for data
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [stats, setStats] = useState<MediaStats | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    perPage: 24,
    lastPage: 1,
  });

  // State for filters & view
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<MediaType | "all">("all");
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Selection & Inspector state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectingAssetId, setInspectingAssetId] = useState<string | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await apiClient.get<MediaStats>("/api/admin/media/stats");
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error("Error fetching media stats:", err);
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  // Fetch media assets
  const fetchAssets = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const [sortColumn, sortDirection] = sortBy.split("_");
        // handle created_at_desc vs file_name_asc
        const direction = sortBy.endsWith("_asc") ? "asc" : "desc";
        const column = sortBy.replace(/_(asc|desc)$/, "");

        const params = new URLSearchParams({
          page: String(page),
          perPage: "24",
          sortBy: column,
          sortOrder: direction,
        });

        if (activeType !== "all") {
          params.set("type", activeType);
        }
        if (search.trim()) {
          params.set("search", search.trim());
        }

        const res = await apiClient.get<MediaAsset[]>(
          `/api/admin/media?${params.toString()}`,
        );
        if (res.success && res.data) {
          setAssets(res.data);
          if ((res as unknown as { meta: PaginationMeta }).meta) {
            setPagination((res as unknown as { meta: PaginationMeta }).meta);
          }
        }
      } catch (err: unknown) {
        toast.error((err as Error).message || "Gagal memuat media library");
      } finally {
        setIsLoading(false);
      }
    },
    [activeType, search, sortBy],
  );

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      fetchStats();
    }
  }, [fetchStats, isAuthLoading, isAuthenticated]);

  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      fetchAssets(1);
    }
  }, [fetchAssets, isAuthLoading, isAuthenticated]);

  // Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleToggleSelectAll = () => {
    if (assets.every((a) => selectedIds.includes(a.id))) {
      setSelectedIds([]);
    } else {
      setSelectedIds(assets.map((a) => a.id));
    }
  };

  const handleInspect = (asset: MediaAsset) => {
    setInspectingAssetId(asset.id);
    setIsDrawerOpen(true);
  };

  const handleUpdated = (updatedAsset: MediaAsset) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)),
    );
  };

  const handleDeleted = (deletedId: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== deletedId));
    setSelectedIds((prev) => prev.filter((id) => id !== deletedId));
    fetchStats();
  };

  const handleSingleDelete = (asset: MediaAsset) => {
    setInspectingAssetId(asset.id);
    setIsDrawerOpen(true);
  };

  const handleBulkDeleteConfirm = async (force = false) => {
    if (selectedIds.length === 0) return;

    setIsBulkDeleting(true);
    try {
      const res = await apiClient.post<{
        deletedIds: string[];
        failedIds: Array<{ id: string; fileName: string; reason: string }>;
      }>(`/api/admin/media/bulk-delete${force ? "?force=true" : ""}`, {
        ids: selectedIds,
      } as BulkDeleteMediaRequest);

      if (res.success && res.data) {
        toast.success(res.message || "File terpilih berhasil dihapus");
        setSelectedIds([]);
        setBulkDeleteModalOpen(false);
        fetchAssets(pagination.page);
        fetchStats();
      }
    } catch (err: unknown) {
      toast.error((err as Error).message || "Gagal menghapus beberapa file");
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <ImageIcon className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
            Media Library & Storage
          </h1>
          <p className="mt-1 text-xs md:text-sm text-muted-foreground">
            Manajemen terpusat untuk semua aset gambar, dokumen, dan media
            portofolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchAssets(pagination.page);
              fetchStats();
              toast.success("Media library diperbarui");
            }}
            className="text-xs border-border bg-card hover:bg-muted text-foreground gap-1.5 shadow-sm"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isLoading ? "animate-spin text-emerald-500" : ""}`}
            />
            Segarkan
          </Button>

          <Button
            size="sm"
            onClick={() => setIsUploadOpen(!isUploadOpen)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium gap-1.5 shadow-md shadow-emerald-950/20"
          >
            <Upload className="h-3.5 w-3.5" />
            {isUploadOpen ? "Tutup Uploader" : "Unggah Media"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Total Files */}
        <div
          onClick={() => setActiveType("all")}
          className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
            activeType === "all"
              ? "border-emerald-500/50 bg-card ring-1 ring-emerald-500/20"
              : "border-border bg-card hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Total File
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl lg:text-3xl font-heading font-bold text-foreground tracking-tight">
            {isStatsLoading ? "..." : stats?.totalFiles || 0}
          </p>
          <span className="text-[11px] text-muted-foreground">
            Semua aset tersimpan
          </span>
        </div>

        {/* Total Storage Used */}
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Penyimpanan Terpakai
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              <HardDrive className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl lg:text-3xl font-heading font-bold text-foreground font-mono tracking-tight">
            {isStatsLoading ? "..." : formatFileSize(stats?.totalSize || 0)}
          </p>
          <span className="text-[11px] text-muted-foreground">
            Kapasitas drive lokal
          </span>
        </div>

        {/* Total Images */}
        <div
          onClick={() => setActiveType("image")}
          className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
            activeType === "image"
              ? "border-emerald-500/50 bg-card ring-1 ring-emerald-500/20"
              : "border-border bg-card hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Gambar (Images)
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ImageIcon className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl lg:text-3xl font-heading font-bold text-foreground tracking-tight">
            {isStatsLoading ? "..." : stats?.imageCount || 0}
          </p>
          <span className="text-[11px] text-muted-foreground">
            PNG, JPG, WebP, SVG
          </span>
        </div>

        {/* Documents & Others */}
        <div
          onClick={() => setActiveType("document")}
          className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition-all cursor-pointer ${
            activeType === "document"
              ? "border-purple-500/50 bg-card ring-1 ring-purple-500/20"
              : "border-border bg-card hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Dokumen & Video
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl lg:text-3xl font-heading font-bold text-foreground tracking-tight">
            {isStatsLoading
              ? "..."
              : (stats?.documentCount || 0) +
                (stats?.videoCount || 0) +
                (stats?.otherCount || 0)}
          </p>
          <span className="text-[11px] text-muted-foreground">
            PDF, DOCX, MP4
          </span>
        </div>
      </div>

      {/* Upload Dropzone (Collapsible) */}
      {isUploadOpen && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-300">
          <MediaUploadDropzone
            onSuccess={() => {
              fetchAssets(1);
              fetchStats();
            }}
            onCancel={() => setIsUploadOpen(false)}
          />
        </div>
      )}

      {/* Filter Bar */}
      <MediaFilterBar
        search={search}
        onSearchChange={setSearch}
        activeType={activeType}
        onTypeChange={setActiveType}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setBulkDeleteModalOpen(true)}
        onClearSelection={() => setSelectedIds([])}
        isUploadOpen={isUploadOpen}
        onToggleUpload={() => setIsUploadOpen(!isUploadOpen)}
        isBulkDeleting={isBulkDeleting}
      />

      {/* Main Content (Grid / Table) */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card/50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-xs text-muted-foreground font-medium">
              Memuat media assets...
            </p>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <MediaGrid
          assets={assets}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onInspect={handleInspect}
          onDeleteSingle={handleSingleDelete}
        />
      ) : (
        <MediaTable
          assets={assets}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onToggleSelectAll={handleToggleSelectAll}
          onInspect={handleInspect}
          onDeleteSingle={handleSingleDelete}
        />
      )}

      {/* Pagination Bar */}
      {pagination.lastPage > 1 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">
            Menampilkan halaman{" "}
            <strong className="text-foreground">{pagination.page}</strong> dari{" "}
            <strong className="text-foreground">{pagination.lastPage}</strong>{" "}
            (Total {pagination.total} file)
          </span>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1 || isLoading}
              onClick={() => fetchAssets(pagination.page - 1)}
              className="text-xs border-border bg-card hover:bg-muted text-foreground gap-1 shadow-sm"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.lastPage || isLoading}
              onClick={() => fetchAssets(pagination.page + 1)}
              className="text-xs border-border bg-card hover:bg-muted text-foreground gap-1 shadow-sm"
            >
              Selanjutnya
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Inspector Drawer */}
      <MediaDetailDrawer
        assetId={inspectingAssetId}
        open={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setInspectingAssetId(null);
        }}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />

      {/* Bulk Delete Modal */}
      {bulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  Hapus {selectedIds.length} File Terpilih?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tindakan ini akan menghapus file fisik dari storage.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              File yang sedang aktif digunakan oleh modul portofolio atau blog
              mungkin gagal dihapus kecuali dipaksa.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setBulkDeleteModalOpen(false)}
                className="text-xs text-foreground hover:bg-muted"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={() => handleBulkDeleteConfirm(false)}
                disabled={isBulkDeleting}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium shadow-sm"
              >
                {isBulkDeleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : null}
                Hapus Permanen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
