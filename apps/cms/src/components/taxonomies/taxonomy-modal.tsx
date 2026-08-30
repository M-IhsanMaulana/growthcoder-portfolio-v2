"use client";

import React, { useState, useEffect } from "react";
import { X, Loader2, Sparkles, FolderPlus, Tags, Hash } from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  FormError,
  FormRequiredMark,
} from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { Category, ProjectCategory, Tag } from "@growthcoder/types";

export type TaxonomyType = "category" | "project-category" | "tag";

export interface TaxonomyItem {
  id?: string;
  name: string;
  slug: string;
  description?: string;
  order?: number;
}

interface TaxonomyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: TaxonomyType;
  initialData?: TaxonomyItem | null;
  onSuccess: (createdOrUpdated: TaxonomyItem) => void;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TaxonomyModal({
  open,
  onOpenChange,
  type,
  initialData,
  onSuccess,
}: TaxonomyModalProps) {
  const isEditing = Boolean(initialData?.id);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (initialData) {
        setName(initialData.name || "");
        setSlug(initialData.slug || "");
        setDescription(initialData.description || "");
        setOrder(initialData.order ?? 0);
        setIsAutoSlug(false);
      } else {
        setName("");
        setSlug("");
        setDescription("");
        setOrder(0);
        setIsAutoSlug(true);
      }
    }
  }, [open, initialData]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNameChange = (val: string) => {
    setName(val);
    clearFieldError("name");
    if (isAutoSlug) {
      setSlug(generateSlug(val));
      clearFieldError("slug");
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    setIsAutoSlug(false);
    clearFieldError("slug");
  };

  const getEndpoint = () => {
    switch (type) {
      case "category":
        return isEditing
          ? `/api/admin/categories/${initialData?.id}`
          : "/api/admin/categories";
      case "project-category":
        return isEditing
          ? `/api/admin/project-categories/${initialData?.id}`
          : "/api/admin/project-categories";
      case "tag":
        return isEditing
          ? `/api/admin/tags/${initialData?.id}`
          : "/api/admin/tags";
    }
  };

  const getTitle = () => {
    const action = isEditing ? "Edit" : "Tambah";
    switch (type) {
      case "category":
        return `${action} Kategori Artikel`;
      case "project-category":
        return `${action} Kategori Proyek`;
      case "tag":
        return `${action} Tag`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "category":
        return <FolderPlus className="h-5 w-5 text-emerald-500" />;
      case "project-category":
        return <Tags className="h-5 w-5 text-indigo-500" />;
      case "tag":
        return <Hash className="h-5 w-5 text-amber-500" />;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = `Nama ${type === "tag" ? "tag" : "kategori"} wajib diisi`;
    }
    const finalSlug = slug.trim() || generateSlug(name);
    if (!finalSlug) {
      newErrors.slug = "Slug URL wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Mohon lengkapi field wajib yang belum terisi.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        name: name.trim(),
        slug: (slug.trim() || generateSlug(name)).toLowerCase(),
      };

      if (type !== "tag") {
        payload.description = description.trim() || null;
      }

      if (type === "project-category") {
        payload.order = Number(order) || 0;
      }

      const endpoint = getEndpoint();
      const res = isEditing
        ? await apiClient.put<Category | ProjectCategory | Tag>(
            endpoint,
            payload,
          )
        : await apiClient.post<Category | ProjectCategory | Tag>(
            endpoint,
            payload,
          );

      if (res.success && res.data) {
        toast.success(
          isEditing
            ? `${getTitle().replace("Edit ", "")} berhasil diperbarui!`
            : `${getTitle().replace("Tambah ", "")} berhasil ditambahkan!`,
        );
        onSuccess(res.data as unknown as TaxonomyItem);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gagal menyimpan data taxonomy.");
      }
    } catch (err: unknown) {
      const e = err as Error & {
        message?: string;
        data?: {
          errors?:
            | Array<{ field: string; message: string }>
            | Record<string, string[]>;
        };
      };
      if (e.data?.errors) {
        const serverErrors: Record<string, string> = {};
        if (Array.isArray(e.data.errors)) {
          e.data.errors.forEach((errItem) => {
            if (errItem.field) serverErrors[errItem.field] = errItem.message;
          });
        } else if (typeof e.data.errors === "object") {
          Object.entries(e.data.errors).forEach(([k, v]) => {
            serverErrors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
        setErrors(serverErrors);
      }
      toast.error(e.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted/60 border border-border">
              {getIcon()}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-base">
                {getTitle()}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? "Perbarui informasi taxonomy ini"
                  : "Buat taxonomy baru untuk relasi data"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center">
                <span>Nama {type === "tag" ? "Tag" : "Kategori"}</span>
                <FormRequiredMark />
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder={
                  type === "tag"
                    ? "contoh: nextjs, adonisjs, typescript"
                    : "contoh: Frontend Engineering"
                }
                error={errors.name}
                className="h-10 text-sm"
                autoFocus
              />
              <FormError message={errors.name} />
            </div>

            {/* Slug Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground flex items-center">
                  <span>Slug URL</span>
                  <FormRequiredMark />
                </label>
                {isAutoSlug && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Sparkles className="h-2.5 w-2.5" /> Auto
                  </span>
                )}
              </div>
              <Input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="frontend-engineering"
                error={errors.slug}
                className="h-10 text-xs font-mono"
              />
              <FormError message={errors.slug} />
            </div>

            {/* Description (for Categories) */}
            {type !== "tag" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Deskripsi{" "}
                  <span className="text-muted-foreground text-[10px] font-normal">
                    (opsional)
                  </span>
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Deskripsi singkat mengenai kategori ini..."
                  className="text-xs resize-none"
                />
              </div>
            )}

            {/* Order (for Project Category) */}
            {type === "project-category" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Urutan Tampilan (Order)
                </label>
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  min={0}
                  className="w-32 h-9 text-xs"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border bg-muted/30 px-6 py-3.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Perbarui"
              ) : (
                "Simpan Data"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
