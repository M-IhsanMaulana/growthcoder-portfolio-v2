"use client";

import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Hash,
  Folder,
  Layers,
  ArrowUpDown,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { TaxonomyType, TaxonomyItem } from "./taxonomy-modal";

export interface TaxonomyRowData extends TaxonomyItem {
  postsCount?: number;
  projectsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface TaxonomyTableProps {
  type: TaxonomyType;
  items: TaxonomyRowData[];
  isLoading: boolean;
  onEdit: (item: TaxonomyRowData) => void;
  onRefresh: () => void;
}

export function TaxonomyTable({
  type,
  items,
  isLoading,
  onEdit,
  onRefresh,
}: TaxonomyTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<TaxonomyRowData | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const getEndpoint = (id: string) => {
    switch (type) {
      case "category":
        return `/api/admin/categories/${id}`;
      case "project-category":
        return `/api/admin/project-categories/${id}`;
      case "tag":
        return `/api/admin/tags/${id}`;
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return;
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(getEndpoint(deleteTarget.id));
      if (res.success) {
        toast.success(`'${deleteTarget.name}' berhasil dihapus.`);
        setDeleteTarget(null);
        onRefresh();
      } else {
        toast.error(res.message || "Gagal menghapus data.");
      }
    } catch (err: unknown) {
      const e = err as Error & { message?: string };
      toast.error(e.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card/50">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
          {type === "tag" ? (
            <Hash className="h-6 w-6" />
          ) : type === "project-category" ? (
            <Layers className="h-6 w-6" />
          ) : (
            <Folder className="h-6 w-6" />
          )}
        </div>
        <h3 className="font-semibold text-foreground text-sm">
          Belum ada data
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Klik tombol &quot;Tambah&quot; di atas untuk membuat entri{" "}
          {type === "tag" ? "tag" : "kategori"} baru.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Nama & Slug</th>
                {type !== "tag" && (
                  <th className="px-5 py-3 font-semibold">Deskripsi</th>
                )}
                {type === "project-category" && (
                  <th className="px-5 py-3 font-semibold">
                    <span className="flex items-center gap-1">
                      <ArrowUpDown className="h-3 w-3" /> Urutan
                    </span>
                  </th>
                )}
                <th className="px-5 py-3 font-semibold text-center">
                  Penggunaan
                </th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((item) => {
                const usageCount =
                  type === "project-category"
                    ? (item.projectsCount ?? 0)
                    : (item.postsCount ?? 0);

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted/70 text-foreground font-semibold border border-border/50 shrink-0">
                          {type === "tag" ? (
                            <Hash className="h-4 w-4 text-amber-500" />
                          ) : type === "project-category" ? (
                            <Layers className="h-4 w-4 text-indigo-500" />
                          ) : (
                            <Folder className="h-4 w-4 text-emerald-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {item.name}
                          </p>
                          <p className="font-mono text-[11px] text-muted-foreground">
                            /{item.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {type !== "tag" && (
                      <td className="px-5 py-3.5 max-w-xs text-muted-foreground truncate">
                        {item.description || (
                          <span className="italic text-muted-foreground/50">
                            Tidak ada deskripsi
                          </span>
                        )}
                      </td>
                    )}

                    {type === "project-category" && (
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center justify-center rounded-md bg-muted px-2 py-0.5 font-mono text-[11px] font-semibold text-foreground">
                          {item.order ?? 0}
                        </span>
                      </td>
                    )}

                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                          usageCount > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {usageCount}{" "}
                        {type === "project-category" ? "Proyek" : "Artikel"}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(item)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-500 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  Konfirmasi Hapus
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="text-xs text-foreground/80 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus{" "}
              {type === "tag" ? "tag" : "kategori"}{" "}
              <strong className="text-foreground font-semibold">
                &quot;{deleteTarget.name}&quot;
              </strong>
              ?
              {(type === "project-category"
                ? (deleteTarget.projectsCount ?? 0)
                : (deleteTarget.postsCount ?? 0)) > 0 && (
                <span className="block mt-2 font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  ⚠️ Perhatian: Taxonomy ini saat ini terhubung ke{" "}
                  {type === "project-category"
                    ? deleteTarget.projectsCount
                    : deleteTarget.postsCount}{" "}
                  item data.
                </span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-4 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
