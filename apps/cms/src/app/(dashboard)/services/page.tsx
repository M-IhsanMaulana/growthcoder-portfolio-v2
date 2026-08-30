"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  Plus,
  Search,
  RefreshCw,
  Star,
  Layers,
  HelpCircle,
  FileCheck,
  Trash2,
  Loader2,
  AlertCircle,
  Briefcase,
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
import { ServiceCard } from "@/components/services/service-card";
import { ServiceDialog } from "@/components/services/service-dialog";
import type { Service } from "@growthcoder/types";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterFeatured, setFilterFeatured] = useState<"all" | "featured">(
    "all",
  );

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service | null>(null);

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<Service[]>("/api/admin/services");
      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat daftar layanan");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = services.length;
    const featured = services.filter((s) => s.isFeatured).length;
    const totalDeliverables = services.reduce(
      (acc, s) => acc + (s.deliverables?.length || 0),
      0,
    );
    const totalFaqs = services.reduce(
      (acc, s) => acc + (s.faqs?.length || 0),
      0,
    );
    return { total, featured, totalDeliverables, totalFaqs };
  }, [services]);

  // Filtered Services
  const filteredServices = useMemo(() => {
    return services.filter((item) => {
      const matchesFeatured =
        filterFeatured === "all" ||
        (filterFeatured === "featured" && item.isFeatured);
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.shortDescription.toLowerCase().includes(q) ||
        item.deliverables?.some((d) => d.toLowerCase().includes(q));
      return matchesFeatured && matchesSearch;
    });
  }, [services, filterFeatured, search]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (item: Service) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleSaveSuccess = (savedItem: Service) => {
    setServices((prev) => {
      const exists = prev.some((x) => x.id === savedItem.id);
      if (exists) {
        return prev.map((x) => (x.id === savedItem.id ? savedItem : x));
      }
      return [...prev, savedItem];
    });
  };

  const handleToggleFeatured = async (item: Service) => {
    const newFeatured = !item.isFeatured;
    try {
      const res = await apiClient.put<Service>(
        `/api/admin/services/${item.id}`,
        {
          ...item,
          isFeatured: newFeatured,
        },
      );
      if (res.success && res.data) {
        setServices((prev) =>
          prev.map((x) =>
            x.id === item.id ? { ...x, isFeatured: newFeatured } : x,
          ),
        );
        toast.success(
          newFeatured
            ? `"${item.title}" ditandai sebagai layanan unggulan`
            : `"${item.title}" dihapus dari layanan unggulan`,
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
      await apiClient.delete(`/api/admin/services/${deleteItem.id}`);
      setServices((prev) => prev.filter((x) => x.id !== deleteItem.id));
      toast.success(`Layanan "${deleteItem.title}" berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus layanan");
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
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Layanan & Jasa (Services)
              </h1>
              <p className="text-xs text-muted-foreground">
                Kelola portofolio layanan profesional, value proposition,
                deliverables, dan FAQ klien.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchServices}
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
            Tambah Layanan
          </Button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Layanan</span>
            <Briefcase className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
          <p className="text-[11px] text-muted-foreground">
            Layanan aktif terdaftar
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Layanan Unggulan</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <p className="text-2xl font-bold text-foreground">{stats.featured}</p>
          <p className="text-[11px] text-muted-foreground">
            Ditampilkan di homepage
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Deliverables</span>
            <FileCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalDeliverables}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Total butir deliverables
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">FAQ Klien</span>
            <HelpCircle className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalFaqs}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Pertanyaan umum terhubung
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-border bg-card/40">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari layanan, slug, atau deliverables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant={filterFeatured === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterFeatured("all")}
            className="h-8 text-xs rounded-lg"
          >
            Semua ({services.length})
          </Button>
          <Button
            variant={filterFeatured === "featured" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilterFeatured("featured")}
            className="h-8 text-xs rounded-lg flex items-center gap-1"
          >
            <Star className="w-3 h-3 text-amber-500" />
            Featured Saja ({stats.featured})
          </Button>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 rounded-2xl border border-border bg-card/40 animate-pulse p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="w-16 h-5 rounded-full bg-muted" />
              </div>
              <div className="space-y-2">
                <div className="w-3/4 h-5 rounded-md bg-muted" />
                <div className="w-full h-12 rounded-md bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredServices.map((item) => (
            <ServiceCard
              key={item.id}
              service={item}
              onEdit={handleOpenEdit}
              onDelete={(s) => setDeleteItem(s)}
              onToggleFeatured={handleToggleFeatured}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-muted/60 mx-auto flex items-center justify-center text-muted-foreground">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {search || filterFeatured !== "all"
                ? "Tidak ada layanan yang sesuai kriteria"
                : "Belum Ada Layanan Terdaftar"}
            </p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              {search || filterFeatured !== "all"
                ? "Coba ganti kata kunci pencarian atau reset filter di atas."
                : "Mulai tawarkan keahlian dan solusi Anda dengan membuat penawaran layanan baru."}
            </p>
          </div>
          {!search && filterFeatured === "all" && (
            <Button
              onClick={handleOpenCreate}
              size="sm"
              className="text-xs h-8 bg-primary text-primary-foreground font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Buat Layanan Pertama
            </Button>
          )}
        </div>
      )}

      {/* Service Create / Edit Dialog */}
      <ServiceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        service={editingItem}
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
              Hapus Layanan?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus layanan{" "}
              <strong className="text-foreground">
                &quot;{deleteItem?.title}&quot;
              </strong>
              ? Seluruh FAQ dan deliverables terkait layanan ini akan ikut
              terhapus permanen.
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
                "Ya, Hapus Layanan"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
