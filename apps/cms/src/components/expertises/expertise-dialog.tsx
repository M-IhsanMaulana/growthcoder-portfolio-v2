"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Textarea,
  FormError,
  FormRequiredMark,
} from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Switch,
  Label,
} from "@growthcoder/ui";
import { Loader2, Cpu, Layers } from "lucide-react";
import { UniversalIconPicker } from "@/components/common/universal-icon-picker";
import { TechStackMultiSelector } from "@/components/projects/tech-stack-multi-selector";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  Expertise,
  ExpertiseFormPayload,
  TechStack,
} from "@growthcoder/types";

interface ExpertiseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expertise?: Expertise | null;
  availableTechStacks: TechStack[];
  onSuccess: (expertise: Expertise) => void;
}

export function ExpertiseDialog({
  open,
  onOpenChange,
  expertise,
  availableTechStacks,
  onSuccess,
}: ExpertiseDialogProps) {
  const isEditing = Boolean(expertise);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconSvg, setIconSvg] = useState<string | null>(null);
  const [techStackIds, setTechStackIds] = useState<string[]>([]);
  const [order, setOrder] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (expertise) {
        setTitle(expertise.title);
        setSlug(expertise.slug || "");
        setSubtitle(expertise.subtitle);
        setDescription(expertise.description);
        setIconSvg(expertise.iconSvg || null);
        setTechStackIds(
          expertise.techStacks
            ? expertise.techStacks.map((s) => s.id)
            : expertise.techStackIds || [],
        );
        setOrder(expertise.order ?? 0);
        setIsFeatured(expertise.isFeatured ?? true);
      } else {
        setTitle("");
        setSlug("");
        setSubtitle("");
        setDescription("");
        setIconSvg(null);
        setTechStackIds([]);
        setOrder(0);
        setIsFeatured(true);
      }
    }
  }, [open, expertise]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Nama keahlian / spesialisasi wajib diisi";
    }
    if (!subtitle.trim()) {
      newErrors.subtitle = "Subjudul / peran spesialisasi wajib diisi";
    }
    if (!description.trim()) {
      newErrors.description = "Deskripsi keahlian wajib diisi";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi seluruh field wajib yang bertanda bintang.");
      return;
    }

    setIsSubmitting(true);
    const payload: ExpertiseFormPayload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      subtitle: subtitle.trim(),
      description: description.trim(),
      iconSvg: iconSvg || null,
      order: Number(order) || 0,
      isFeatured,
      techStackIds,
    };

    try {
      if (isEditing && expertise) {
        const res = await apiClient.put<Expertise>(
          `/api/admin/expertises/${expertise.id}`,
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Keahlian "${res.data.title}" berhasil diperbarui`);
          onSuccess(res.data);
          onOpenChange(false);
        }
      } else {
        const res = await apiClient.post<Expertise>(
          "/api/admin/expertises",
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Keahlian "${res.data.title}" berhasil ditambahkan`);
          onSuccess(res.data);
          onOpenChange(false);
        }
      }
    } catch (err: unknown) {
      const error = err as {
        message?: string;
        data?: {
          errors?:
            | Array<{ field: string; message: string }>
            | Record<string, string[]>;
        };
      };
      if (error.data?.errors) {
        const serverErrors: Record<string, string> = {};
        if (Array.isArray(error.data.errors)) {
          error.data.errors.forEach((errItem) => {
            if (errItem.field) serverErrors[errItem.field] = errItem.message;
          });
        } else if (typeof error.data.errors === "object") {
          Object.entries(error.data.errors).forEach(([k, v]) => {
            serverErrors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
        setErrors(serverErrors);
      }
      toast.error(error.message || "Gagal menyimpan keahlian");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing
                  ? "Edit Keahlian & Spesialisasi"
                  : "Tambah Keahlian Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Bidang keahlian dan spesialisasi teknis untuk portofolio.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          noValidate
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4.5 custom-scrollbar">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Keahlian / Spesialisasi <FormRequiredMark />
              </label>
              <Input
                placeholder="e.g. Backend Architecture & Distributed Systems"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  clearFieldError("title");
                }}
                error={errors.title}
                className="text-sm h-10"
              />
              <FormError message={errors.title} />
            </div>

            {/* Subtitle / Role Badge */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Subjudul / Peran Spesialisasi <FormRequiredMark />
              </label>
              <Input
                placeholder="e.g. Spesialisasi Backend & Data Systems"
                value={subtitle}
                onChange={(e) => {
                  setSubtitle(e.target.value);
                  clearFieldError("subtitle");
                }}
                error={errors.subtitle}
                className="text-sm h-10"
              />
              <FormError message={errors.subtitle} />
            </div>

            {/* Universal Icon Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Icon Representatif
              </label>
              <UniversalIconPicker
                value={iconSvg}
                onChange={setIconSvg}
                defaultCategory="services"
                label="Pilih Icon Keahlian"
                description="Pilih dari preset icon, custom SVG, atau Media Library"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Lengkap <FormRequiredMark />
              </label>
              <Textarea
                placeholder="Jelaskan cakupan keahlian, teknologi yang dikuasai, dan pendekatan rekayasa dalam menyelesaikan masalah teknis..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearFieldError("description");
                }}
                error={errors.description}
                className="text-sm min-h-[110px] resize-y custom-scrollbar"
              />
              <FormError message={errors.description} />
            </div>

            {/* Connected Tech Stacks */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>Teknologi & Tools Terkait</span>
              </div>
              <p className="text-[11.5px] text-muted-foreground">
                Pilih teknologi dari Tech Stacks yang mendukung keahlian ini
                untuk ditampilkan sebagai badge chips.
              </p>
              <TechStackMultiSelector
                availableStacks={availableTechStacks}
                selectedIds={techStackIds}
                onChange={setTechStackIds}
              />
            </div>

            {/* Order & Featured Switch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Urutan Tampil (Sort Order)
                </label>
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="text-sm w-full h-9"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-muted/20">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="is-featured-expertise"
                    className="text-xs font-semibold text-foreground cursor-pointer"
                  >
                    Tampilkan di Beranda
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Aktifkan untuk menampilkan di summary section
                  </p>
                </div>
                <Switch
                  id="is-featured-expertise"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 px-6 border-t border-border/70 shrink-0 bg-muted/30 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 px-4 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Buat Keahlian"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
