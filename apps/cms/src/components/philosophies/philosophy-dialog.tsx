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
} from "@growthcoder/ui";
import { Loader2, Lightbulb } from "lucide-react";
import { UniversalIconPicker } from "@/components/common/universal-icon-picker";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  DevelopmentPhilosophy,
  PhilosophyFormPayload,
} from "@growthcoder/types";

interface PhilosophyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  philosophy?: DevelopmentPhilosophy | null;
  onSuccess: (philosophy: DevelopmentPhilosophy) => void;
}

export function PhilosophyDialog({
  open,
  onOpenChange,
  philosophy,
  onSuccess,
}: PhilosophyDialogProps) {
  const isEditing = !!philosophy;

  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [iconSvg, setIconSvg] = useState<string | null>(null);
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (philosophy) {
        setTitle(philosophy.title);
        setTagline(philosophy.tagline);
        setDescription(philosophy.description);
        setIconSvg(philosophy.iconSvg || null);
        setOrder(philosophy.order ?? 0);
      } else {
        setTitle("");
        setTagline("");
        setDescription("");
        setIconSvg(null);
        setOrder(0);
      }
    }
  }, [open, philosophy]);

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
      newErrors.title = "Nama prinsip / filosofi wajib diisi";
    }
    if (!tagline.trim()) {
      newErrors.tagline = "Tagline / highlight prinsip wajib diisi";
    }
    if (!description.trim()) {
      newErrors.description = "Deskripsi penjelasan filosofi wajib diisi";
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
    const payload: PhilosophyFormPayload = {
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      iconSvg: iconSvg || null,
      order: Number(order) || 0,
    };

    try {
      if (isEditing && philosophy) {
        const res = await apiClient.put<DevelopmentPhilosophy>(
          `/api/admin/philosophies/${philosophy.id}`,
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Filosofi "${res.data.title}" berhasil diperbarui`);
          onSuccess(res.data);
          onOpenChange(false);
        }
      } else {
        const res = await apiClient.post<DevelopmentPhilosophy>(
          "/api/admin/philosophies",
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Filosofi "${res.data.title}" berhasil ditambahkan`);
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
      toast.error(error.message || "Gagal menyimpan filosofi rekayasa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-xs shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing
                  ? "Edit Filosofi Rekayasa"
                  : "Tambah Prinsip / Filosofi Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Prinsip rekayasa perangkat lunak untuk personal branding &
                thought leadership.
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
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Nama Prinsip / Filosofi <FormRequiredMark />
              </label>
              <Input
                placeholder="e.g. Clean Code & Maintainable Architecture"
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Tagline Singkat <FormRequiredMark />
              </label>
              <Input
                placeholder="e.g. Code is read much more often than written"
                value={tagline}
                onChange={(e) => {
                  setTagline(e.target.value);
                  clearFieldError("tagline");
                }}
                error={errors.tagline}
                className="text-sm h-10"
              />
              <FormError message={errors.tagline} />
            </div>

            {/* Universal Icon Picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Icon Representatif
              </label>
              <UniversalIconPicker
                value={iconSvg}
                onChange={setIconSvg}
                defaultCategory="philosophies"
                label="Pilih Icon Filosofi"
                description="Pilih dari preset filosofi/mindset, custom SVG, atau Media Library"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Lengkap <FormRequiredMark />
              </label>
              <Textarea
                placeholder="Jelaskan secara mendalam bagaimana Anda menerapkan filosofi ini dalam pengembangan sistem, pertimbangan arsitektur, dan dampaknya terhadap produk..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearFieldError("description");
                }}
                error={errors.description}
                className="text-sm min-h-[120px] resize-y custom-scrollbar"
              />
              <FormError message={errors.description} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Urutan Tampil (Sort Order)
              </label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="text-sm w-36 h-9"
              />
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
                "Buat Filosofi"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
