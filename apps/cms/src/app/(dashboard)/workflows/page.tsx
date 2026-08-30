"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  GitBranch,
  Plus,
  Search,
  RefreshCw,
  CheckCircle2,
  ListOrdered,
  Layers,
  AlertCircle,
  Loader2,
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
import { WorkflowCard } from "@/components/workflows/workflow-card";
import { WorkflowDialog } from "@/components/workflows/workflow-dialog";
import type { WorkflowStep } from "@growthcoder/types";

export default function WorkflowsPage() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<"all" | "active" | "draft">(
    "all",
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkflowStep | null>(null);

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<WorkflowStep | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSteps = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<WorkflowStep[]>("/api/admin/workflows");
      if (res.success && res.data) {
        setSteps(res.data);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat tahapan alur kerja");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSteps();
  }, [fetchSteps]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = steps.length;
    const active = steps.filter((s) => s.isActive).length;
    const totalActivities = steps.reduce(
      (acc, s) => acc + (s.activities?.length || 0),
      0,
    );
    return { total, active, totalActivities };
  }, [steps]);

  // Filtered steps
  const filteredSteps = useMemo(() => {
    return steps.filter((item) => {
      const matchesStatus =
        filterActive === "all" ||
        (filterActive === "active" && item.isActive) ||
        (filterActive === "draft" && !item.isActive);

      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.shortTitle.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.stepNumber.toLowerCase().includes(q) ||
        item.activities?.some((a) => a.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });
  }, [steps, filterActive, search]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: WorkflowStep) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSaveSuccess = (savedItem: WorkflowStep) => {
    setSteps((prev) => {
      const exists = prev.some((x) => x.id === savedItem.id);
      if (exists) {
        return prev.map((x) => (x.id === savedItem.id ? savedItem : x));
      }
      return [...prev, savedItem];
    });
  };

  const handleToggleActive = async (item: WorkflowStep) => {
    const newActive = !item.isActive;
    try {
      const res = await apiClient.put<WorkflowStep>(
        `/api/admin/workflows/${item.id}`,
        {
          ...item,
          isActive: newActive,
        },
      );
      if (res.success && res.data) {
        setSteps((prev) =>
          prev.map((x) =>
            x.id === item.id ? { ...x, isActive: newActive } : x,
          ),
        );
        toast.success(
          newActive
            ? `Tahap "${item.title}" diaktifkan`
            : `Tahap "${item.title}" dinonaktifkan`,
        );
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengubah status aktif");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/workflows/${deleteItem.id}`);
      setSteps((prev) => prev.filter((x) => x.id !== deleteItem.id));
      toast.success(`Tahapan "${deleteItem.title}" berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus tahapan");
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
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary dark:text-emerald-400 shadow-2xs">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Alur Kerja &amp; Metodologi (Workflows)
              </h1>
              <p className="text-xs text-muted-foreground">
                Kelola tahapan kolaborasi, deliverables, dan aktivitas di setiap
                milestone proyek.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchSteps}
            disabled={isLoading}
            className="text-xs h-9 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreate}
            size="sm"
            className="text-xs h-9 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Tambah Tahapan
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Tahapan</span>
            <ListOrdered className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground">
            Tahapan terdaftar di database
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Tahap Aktif</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.active}</p>
          <p className="text-[11px] text-muted-foreground">
            Tampil di web portfolio
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Aktivitas</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalActivities}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Butir deliverables tercatat
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/40">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari tahapan, nomor, atau aktivitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant={filterActive === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterActive("all")}
            className="h-8 text-xs rounded-lg cursor-pointer"
          >
            Semua ({steps.length})
          </Button>
          <Button
            variant={filterActive === "active" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterActive("active")}
            className="h-8 text-xs rounded-lg cursor-pointer"
          >
            Aktif Saja ({stats.active})
          </Button>
          <Button
            variant={filterActive === "draft" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterActive("draft")}
            className="h-8 text-xs rounded-lg cursor-pointer"
          >
            Draft ({steps.length - stats.active})
          </Button>
        </div>
      </div>

      {/* Workflows Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-56 rounded-2xl border border-border bg-card/40 animate-pulse p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-muted" />
                <div className="w-14 h-5 rounded-full bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 rounded-md bg-muted" />
                <div className="w-full h-12 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSteps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSteps.map((item) => (
            <WorkflowCard
              key={item.id}
              step={item}
              onEdit={handleOpenEdit}
              onDelete={(s) => setDeleteItem(s)}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 mx-auto flex items-center justify-center text-muted-foreground">
            <GitBranch className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {search || filterActive !== "all"
                ? "Tidak ada tahapan yang sesuai kriteria"
                : "Belum Ada Tahapan Alur Kerja"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search || filterActive !== "all"
                ? "Coba ganti kata kunci pencarian atau reset filter di atas."
                : "Mulai buat tahapan alur kerja untuk mendemonstrasikan transparansi proses rekayasa Anda."}
            </p>
          </div>
          {!search && filterActive === "all" && (
            <Button
              onClick={handleOpenCreate}
              size="sm"
              className="text-xs h-8 bg-primary text-primary-foreground font-semibold cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Buat Tahapan Pertama
            </Button>
          )}
        </div>
      )}

      {/* Workflow Create / Edit Dialog */}
      <WorkflowDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        step={editingItem}
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
              Hapus Tahapan Alur Kerja?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus tahapan{" "}
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
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs h-9 px-4 font-semibold shadow-xs cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus Tahapan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
