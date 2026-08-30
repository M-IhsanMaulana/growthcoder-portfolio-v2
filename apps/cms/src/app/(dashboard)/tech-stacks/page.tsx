"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Layers,
  Plus,
  Search,
  RefreshCw,
  Sparkles,
  Filter,
  CheckCircle2,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { TechStackCard } from "@/components/tech-stacks/tech-stack-card";
import { TechStackDialog } from "@/components/tech-stacks/tech-stack-dialog";
import type { TechStack, TechCategory } from "@growthcoder/types";

const CATEGORY_TABS: Array<{ id: TechCategory | "all"; label: string }> = [
  { id: "all", label: "Semua Kategori" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "devops", label: "DevOps & Cloud" },
  { id: "tools", label: "Tools" },
];

export default function TechStacksPage() {
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TechCategory | "all"
  >("all");

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TechStack | null>(null);

  // Delete modal states
  const [deleteItem, setDeleteItem] = useState<TechStack | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTechStacks = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<TechStack[]>("/api/admin/tech-stacks");
      if (res.success && res.data) {
        setTechStacks(res.data);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat daftar tech stack");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTechStacks();
  }, [fetchTechStacks]);

  // Filtered Tech Stacks
  const filteredTechStacks = useMemo(() => {
    return techStacks.filter((item) => {
      const matchesCat =
        selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch =
        !search.trim() ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.slug.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [techStacks, selectedCategory, search]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: TechStack) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSaveSuccess = (savedItem: TechStack) => {
    setTechStacks((prev) => {
      const exists = prev.some((x) => x.id === savedItem.id);
      if (exists) {
        return prev.map((x) => (x.id === savedItem.id ? savedItem : x));
      }
      return [savedItem, ...prev];
    });
  };

  const handleToggleFeatured = async (item: TechStack) => {
    const newFeatured = !item.isFeatured;
    try {
      const res = await apiClient.put<TechStack>(
        `/api/admin/tech-stacks/${item.id}`,
        {
          isFeatured: newFeatured,
        },
      );
      if (res.success && res.data) {
        setTechStacks((prev) =>
          prev.map((x) =>
            x.id === item.id ? { ...x, isFeatured: newFeatured } : x,
          ),
        );
        toast.success(
          newFeatured
            ? `"${item.name}" ditandai sebagai featured stack`
            : `"${item.name}" dihapus dari featured stack`,
        );
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengubah status featured");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/tech-stacks/${deleteItem.id}`);
      setTechStacks((prev) => prev.filter((x) => x.id !== deleteItem.id));
      toast.success(`Tech stack "${deleteItem.name}" berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus tech stack");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Tech Stacks & Tools
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kelola master data framework, bahasa, database, dan tools yang
                dipakai pada proyek portofolio.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTechStacks}
            disabled={isLoading}
            className="h-9 text-xs"
            title="Muat ulang data"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Tech Stack
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Live Search */}
        <div className="relative md:w-72 shrink-0">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari teknologi atau slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8.5 text-xs bg-muted/30"
          />
        </div>
      </div>

      {/* Tech Stacks Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl border border-border bg-card/40 p-4 animate-pulse space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="w-16 h-5 bg-muted rounded-md" />
                <div className="w-6 h-6 bg-muted rounded-md" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 bg-muted rounded-xl" />
                <div className="space-y-1.5 flex-1">
                  <div className="w-24 h-4 bg-muted rounded" />
                  <div className="w-16 h-3 bg-muted rounded" />
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full mt-4" />
            </div>
          ))}
        </div>
      ) : filteredTechStacks.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-border bg-muted/10 text-center flex flex-col items-center justify-center space-y-3">
          <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {search || selectedCategory !== "all"
                ? "Tidak ada tech stack yang cocok"
                : "Belum ada data tech stack"}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              {search || selectedCategory !== "all"
                ? "Coba ubah kata kunci pencarian atau ganti filter kategori di atas."
                : "Mulai daftarkan framework, bahasa pemrograman, atau tools yang sering Anda gunakan."}
            </p>
          </div>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Tech Stack Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Menampilkan <strong>{filteredTechStacks.length}</strong> teknologi
              {selectedCategory !== "all" &&
                ` pada kategori "${selectedCategory}"`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTechStacks.map((item) => (
              <TechStackCard
                key={item.id}
                item={item}
                onEdit={handleOpenEdit}
                onDelete={(it) => setDeleteItem(it)}
                onToggleFeatured={handleToggleFeatured}
              />
            ))}
          </div>
        </div>
      )}

      {/* Create / Edit Dialog Modal */}
      <TechStackDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        techStack={editingItem}
        onSuccess={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Hapus Tech Stack?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="text-foreground">
                &quot;{deleteItem?.name}&quot;
              </strong>
              ? Jika teknologi ini terhubung ke proyek portofolio, relasi
              tersebut akan dilepaskan.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteItem(null)}
              disabled={isDeleting}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs h-9 px-4 font-semibold shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Ya, Hapus
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
