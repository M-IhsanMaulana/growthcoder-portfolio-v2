"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FolderPlus,
  Tags,
  Hash,
  Search,
  Plus,
  RefreshCw,
  Folder,
  Layers,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { TaxonomyModal, type TaxonomyType } from "./taxonomy-modal";
import { TaxonomyTable, type TaxonomyRowData } from "./taxonomy-table";

export function TaxonomiesTabView() {
  const [activeTab, setActiveTab] = useState<TaxonomyType>("category");
  const [search, setSearch] = useState("");

  // Data states
  const [categories, setCategories] = useState<TaxonomyRowData[]>([]);
  const [projectCategories, setProjectCategories] = useState<TaxonomyRowData[]>(
    [],
  );
  const [tags, setTags] = useState<TaxonomyRowData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TaxonomyRowData | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [resCat, resProjCat, resTags] = await Promise.all([
        apiClient.get<TaxonomyRowData[]>("/api/admin/categories"),
        apiClient.get<TaxonomyRowData[]>("/api/admin/project-categories"),
        apiClient.get<TaxonomyRowData[]>("/api/admin/tags"),
      ]);

      if (resCat.success && resCat.data) {
        setCategories(resCat.data);
      }
      if (resProjCat.success && resProjCat.data) {
        setProjectCategories(resProjCat.data);
      }
      if (resTags.success && resTags.data) {
        setTags(resTags.data);
      }
    } catch (err: unknown) {
      console.error("Error fetching taxonomies:", err);
      const errObj = err as Error;
      if (
        errObj.message?.includes("Failed to fetch") ||
        errObj.message?.includes("NetworkError")
      ) {
        setError(
          "Gagal terhubung ke API backend (http://localhost:3333). Pastikan server backend AdonisJS sudah dijalankan.",
        );
      } else {
        setError(errObj.message || "Gagal memuat data taksonomi.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenCreate = () => {
    setEditItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: TaxonomyRowData) => {
    setEditItem(item);
    setModalOpen(true);
  };

  // Filter items based on active tab and search
  const getCurrentItems = (): TaxonomyRowData[] => {
    let list: TaxonomyRowData[] = [];
    if (activeTab === "category") list = categories;
    if (activeTab === "project-category") list = projectCategories;
    if (activeTab === "tag") list = tags;

    if (!search.trim()) return list;
    const q = search.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)),
    );
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case "category":
        return "Tambah Kategori Artikel";
      case "project-category":
        return "Tambah Kategori Proyek";
      case "tag":
        return "Tambah Tag";
    }
  };

  return (
    <div className="space-y-6">
      {/* Error / Offline Alert */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Koneksi Backend Terputus</p>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80 mt-0.5">
                {error}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => fetchData()}
            className="shrink-0 h-8 text-xs border-rose-500/30 hover:bg-rose-500/20"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          onClick={() => setActiveTab("category")}
          className={`relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer shadow-sm ${
            activeTab === "category"
              ? "border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/20"
              : "border-border bg-card hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kategori Artikel
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Folder className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground font-mono">
            {categories.length}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Taksonomi untuk artikel & blog
          </p>
        </div>

        <div
          onClick={() => setActiveTab("project-category")}
          className={`relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer shadow-sm ${
            activeTab === "project-category"
              ? "border-indigo-500/50 bg-indigo-500/10 ring-2 ring-indigo-500/20"
              : "border-border bg-card hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kategori Proyek
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground font-mono">
            {projectCategories.length}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Kategori showcase & studi kasus
          </p>
        </div>

        <div
          onClick={() => setActiveTab("tag")}
          className={`relative overflow-hidden rounded-2xl border p-5 transition-all cursor-pointer shadow-sm ${
            activeTab === "tag"
              ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/20"
              : "border-border bg-card hover:border-border/80"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tags Master
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Hash className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-bold text-foreground font-mono">
            {tags.length}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Label kata kunci multi-tagging
          </p>
        </div>
      </div>

      {/* Main Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-md">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              setActiveTab("category");
              setSearch("");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "category"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <FolderPlus className="h-4 w-4 text-emerald-500" />
            Kategori Artikel ({categories.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("project-category");
              setSearch("");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "project-category"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Tags className="h-4 w-4 text-indigo-500" />
            Kategori Proyek ({projectCategories.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("tag");
              setSearch("");
            }}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
              activeTab === "tag"
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            }`}
          >
            <Hash className="h-4 w-4 text-amber-500" />
            Tags ({tags.length})
          </button>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari taxonomy..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="h-9 w-9 p-0 rounded-xl"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>

          <Button
            size="sm"
            onClick={handleOpenCreate}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>{getAddButtonText()}</span>
          </Button>
        </div>
      </div>

      {/* Table View */}
      <TaxonomyTable
        type={activeTab}
        items={getCurrentItems()}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onRefresh={fetchData}
      />

      {/* Create / Edit Modal */}
      <TaxonomyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        type={activeTab}
        initialData={editItem}
        onSuccess={fetchData}
      />
    </div>
  );
}
