"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Cpu,
  Plus,
  Search,
  RefreshCw,
  Sparkles,
  Layers,
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
import { ExpertiseCard } from "@/components/expertises/expertise-card";
import { ExpertiseDialog } from "@/components/expertises/expertise-dialog";
import type { Expertise, TechStack } from "@growthcoder/types";

export default function ExpertisesPage() {
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Expertise | null>(null);

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<Expertise | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [expRes, techRes] = await Promise.all([
        apiClient.get<Expertise[]>("/api/admin/expertises"),
        apiClient.get<TechStack[]>("/api/admin/tech-stacks"),
      ]);

      if (expRes.success && expRes.data) {
        setExpertises(expRes.data);
      }
      if (techRes.success && techRes.data) {
        setTechStacks(techRes.data);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat data keahlian");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered list
  const filteredExpertises = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return expertises;
    return expertises.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.techStacks?.some((t) => t.name.toLowerCase().includes(q)),
    );
  }, [expertises, search]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Expertise) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSaveSuccess = (savedItem: Expertise) => {
    setExpertises((prev) => {
      const exists = prev.some((x) => x.id === savedItem.id);
      if (exists) {
        return prev.map((x) => (x.id === savedItem.id ? savedItem : x));
      }
      return [...prev, savedItem];
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/expertises/${deleteItem.id}`);
      setExpertises((prev) => prev.filter((x) => x.id !== deleteItem.id));
      toast.success(`Keahlian "${deleteItem.title}" berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus keahlian");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Keahlian &amp; Spesialisasi
              </h1>
              <p className="text-xs text-muted-foreground">
                Kelola daftar keahlian teknis dan spesialisasi untuk portofolio
                Anda.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={isLoading}
            className="text-xs h-9"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="text-xs h-9 bg-primary text-primary-foreground font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Keahlian
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/40">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari judul keahlian, peran, tech stack, deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-3 py-1.5 rounded-lg bg-muted/60 border border-border/60 font-medium">
            Total {expertises.length} Keahlian Terdaftar
          </span>
        </div>
      </div>

      {/* Expertises Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl border border-border bg-card/40 animate-pulse p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-16 h-5 rounded-md bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="w-2/3 h-5 rounded-md bg-muted" />
                <div className="w-full h-16 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredExpertises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExpertises.map((item) => (
            <ExpertiseCard
              key={item.id}
              expertise={item}
              onEdit={handleOpenEdit}
              onDelete={(p) => setDeleteItem(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 mx-auto flex items-center justify-center text-muted-foreground">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {search
                ? "Tidak ada keahlian yang cocok dengan pencarian"
                : "Belum Ada Keahlian Terdaftar"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? "Coba gunakan kata kunci lain."
                : "Tambahkan pilar keahlian utama dan teknologi yang Anda kuasai di sini."}
            </p>
          </div>
          {!search && (
            <Button
              onClick={handleOpenCreate}
              size="sm"
              className="text-xs h-8 bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tambah Keahlian Pertama
            </Button>
          )}
        </div>
      )}

      {/* Expertise Create / Edit Dialog */}
      <ExpertiseDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        expertise={editingItem}
        availableTechStacks={techStacks}
        onSuccess={handleSaveSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Hapus Keahlian?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus pilar keahlian{" "}
              <strong className="text-foreground">
                &quot;{deleteItem?.title}&quot;
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteItem(null)}
              disabled={isDeleting}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs h-9 px-4 font-semibold shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Keahlian"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
