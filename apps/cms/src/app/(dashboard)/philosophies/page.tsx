"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Lightbulb,
  Plus,
  Search,
  RefreshCw,
  Sparkles,
  Layers,
  Trash2,
  Loader2,
  AlertCircle,
  BookOpen,
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
import { PhilosophyCard } from "@/components/philosophies/philosophy-card";
import { PhilosophyDialog } from "@/components/philosophies/philosophy-dialog";
import type { DevelopmentPhilosophy } from "@growthcoder/types";

export default function PhilosophiesPage() {
  const [philosophies, setPhilosophies] = useState<DevelopmentPhilosophy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DevelopmentPhilosophy | null>(
    null,
  );

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<DevelopmentPhilosophy | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPhilosophies = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<DevelopmentPhilosophy[]>(
        "/api/admin/philosophies",
      );
      if (res.success && res.data) {
        setPhilosophies(res.data);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat filosofi rekayasa");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhilosophies();
  }, [fetchPhilosophies]);

  // Filtered list
  const filteredPhilosophies = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return philosophies;
    return philosophies.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.tagline.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [philosophies, search]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: DevelopmentPhilosophy) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSaveSuccess = (savedItem: DevelopmentPhilosophy) => {
    setPhilosophies((prev) => {
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
      await apiClient.delete(`/api/admin/philosophies/${deleteItem.id}`);
      setPhilosophies((prev) => prev.filter((x) => x.id !== deleteItem.id));
      toast.success(`Filosofi "${deleteItem.title}" berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus filosofi");
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
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-2xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Filosofi & Nilai Rekayasa
              </h1>
              <p className="text-xs text-muted-foreground">
                Prinsip dan standar rekayasa perangkat lunak untuk thought
                leadership dan personal branding.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchPhilosophies}
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
            Tambah Filosofi
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/40">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari judul filosofi, tagline, atau deskripsi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="px-3 py-1.5 rounded-lg bg-muted/60 border border-border/60 font-medium">
            Total {philosophies.length} Prinsip Terdaftar
          </span>
        </div>
      </div>

      {/* Philosophies Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-56 rounded-2xl border border-border bg-card/40 animate-pulse p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-16 h-5 rounded-md bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="w-2/3 h-5 rounded-md bg-muted" />
                <div className="w-full h-14 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredPhilosophies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPhilosophies.map((item) => (
            <PhilosophyCard
              key={item.id}
              philosophy={item}
              onEdit={handleOpenEdit}
              onDelete={(p) => setDeleteItem(p)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 mx-auto flex items-center justify-center text-muted-foreground">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {search
                ? "Tidak ada filosofi yang cocok dengan pencarian"
                : "Belum Ada Filosofi Rekayasa Terdaftar"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search
                ? "Coba gunakan kata kunci lain."
                : "Definisikan standar dan pendekatan rekayasa software terbaik Anda di sini."}
            </p>
          </div>
          {!search && (
            <Button
              onClick={handleOpenCreate}
              size="sm"
              className="text-xs h-8 bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Tambah Filosofi Pertama
            </Button>
          )}
        </div>
      )}

      {/* Philosophy Create / Edit Dialog */}
      <PhilosophyDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        philosophy={editingItem}
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
              Hapus Filosofi?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus prinsip filosofi{" "}
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
                "Ya, Hapus Filosofi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
