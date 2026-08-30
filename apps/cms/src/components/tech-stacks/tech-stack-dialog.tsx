"use client";

import React, { useState, useEffect } from "react";
import { Layers, Save, Loader2, Sliders, Star } from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
  Label,
  Switch,
} from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { TechStackIconPicker } from "./tech-stack-icon-picker";
import type { TechStack, TechCategory } from "@growthcoder/types";

interface TechStackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  techStack?: TechStack | null;
  onSuccess: (savedItem: TechStack) => void;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function TechStackDialog({
  open,
  onOpenChange,
  techStack,
  onSuccess,
}: TechStackDialogProps) {
  const isEditing = Boolean(techStack);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [category, setCategory] = useState<TechCategory>("frontend");
  const [iconSvg, setIconSvg] = useState<string | null>(null);
  const [level, setLevel] = useState<number>(85);
  const [hasLevel, setHasLevel] = useState<boolean>(true);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset or Populate form on open
  useEffect(() => {
    if (open) {
      setErrors({});
      if (techStack) {
        setName(techStack.name);
        setSlug(techStack.slug);
        setIsAutoSlug(false);
        setCategory(techStack.category);
        setIconSvg(techStack.iconSvg || null);
        setLevel(
          techStack.level !== null && techStack.level !== undefined
            ? techStack.level
            : 85,
        );
        setHasLevel(techStack.level !== null && techStack.level !== undefined);
        setIsFeatured(techStack.isFeatured);
        setOrder(techStack.order || 0);
      } else {
        setName("");
        setSlug("");
        setIsAutoSlug(true);
        setCategory("frontend");
        setIconSvg(null);
        setLevel(85);
        setHasLevel(true);
        setIsFeatured(false);
        setOrder(0);
      }
    }
  }, [open, techStack]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    clearFieldError("name");
    if (isAutoSlug) {
      setSlug(generateSlug(val));
      clearFieldError("slug");
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsAutoSlug(false);
    clearFieldError("slug");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Nama teknologi wajib diisi";
    }
    const finalSlug = slug.trim() || generateSlug(name);
    if (!finalSlug) {
      newErrors.slug = "Slug URL wajib diisi";
    }
    if (!category) {
      newErrors.category = "Kategori tools wajib dipilih";
    }
    if (hasLevel && (level < 0 || level > 100)) {
      newErrors.level = "Tingkat kemahiran harus antara 0 - 100%";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi data yang bertanda wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: name.trim(),
      slug: slug.trim() || generateSlug(name),
      category,
      iconSvg: iconSvg || null,
      level: hasLevel ? Number(level) : null,
      isFeatured,
      order: Number(order) || 0,
    };

    try {
      let res;
      if (isEditing && techStack) {
        res = await apiClient.put<TechStack>(
          `/api/admin/tech-stacks/${techStack.id}`,
          payload,
        );
        toast.success(`Tech stack "${payload.name}" berhasil diperbarui`);
      } else {
        res = await apiClient.post<TechStack>(
          "/api/admin/tech-stacks",
          payload,
        );
        toast.success(`Tech stack "${payload.name}" berhasil ditambahkan`);
      }

      if (res.success && res.data) {
        onSuccess(res.data);
        onOpenChange(false);
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
      toast.error(error.message || "Gagal menyimpan data tech stack");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing ? "Edit Tech Stack" : "Tambah Tech Stack Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                {isEditing
                  ? "Perbarui informasi tools, kategori, icon, dan level kecakapan."
                  : "Daftarkan teknologi atau tools yang digunakan dalam proyek portofolio Anda."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          noValidate
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {/* Row 1: Name & Slug */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="tech-name" className="text-xs font-semibold">
                  Nama Teknologi <FormRequiredMark />
                </Label>
                <Input
                  id="tech-name"
                  placeholder="e.g. Next.js, AdonisJS, PostgreSQL"
                  value={name}
                  onChange={handleNameChange}
                  error={errors.name}
                  className="h-10 text-sm"
                />
                <FormError message={errors.name} />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="tech-slug" className="text-xs font-semibold">
                    Slug URL <FormRequiredMark />
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsAutoSlug(!isAutoSlug)}
                    className="text-[10px] text-muted-foreground hover:text-emerald-500 font-medium"
                  >
                    {isAutoSlug ? "Mode Manual" : "Auto-Sync"}
                  </button>
                </div>
                <Input
                  id="tech-slug"
                  placeholder="e.g. next-js"
                  value={slug}
                  onChange={handleSlugChange}
                  error={errors.slug}
                  className="h-10 text-sm"
                />
                <FormError message={errors.slug} />
              </div>
            </div>

            {/* Row 2: Category & Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="tech-category"
                  className="text-xs font-semibold"
                >
                  Kategori Tools <FormRequiredMark />
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => {
                    setCategory(val as TechCategory);
                    clearFieldError("category");
                  }}
                >
                  <SelectTrigger
                    id="tech-category"
                    className={`h-10 text-sm ${errors.category ? "border-destructive text-destructive" : ""}`}
                  >
                    <SelectValue placeholder="Pilih Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                        <span>Frontend & UI</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="backend">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <span>Backend & API</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="database">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                        <span>Database & Cache</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="devops">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                        <span>DevOps & Cloud</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="tools">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                        <span>Development Tools</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormError message={errors.category} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tech-order" className="text-xs font-semibold">
                  Urutan Tampilan (Order)
                </Label>
                <Input
                  id="tech-order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => {
                    setOrder(parseInt(e.target.value) || 0);
                    clearFieldError("order");
                  }}
                  error={errors.order}
                  className="h-10 text-sm"
                />
                <FormError message={errors.order} />
              </div>
            </div>

            {/* Row 3: Icon SVG Picker */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold">
                Icon SVG / Brand Logo
              </Label>
              <TechStackIconPicker value={iconSvg} onChange={setIconSvg} />
            </div>

            {/* Row 4: Proficiency Level & Featured Toggle */}
            <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Tingkat Kemahiran / Proficiency
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Aktifkan untuk menampilkan persentase skill di publik
                    </p>
                  </div>
                </div>
                <Switch checked={hasLevel} onCheckedChange={setHasLevel} />
              </div>

              {hasLevel && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Level Penguasaan:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {level}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={level}
                    onChange={(e) => {
                      setLevel(Number(e.target.value));
                      clearFieldError("level");
                    }}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-muted rounded-lg"
                  />
                  <FormError message={errors.level} />
                </div>
              )}

              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star
                    className={`w-4 h-4 ${isFeatured ? "text-amber-500 fill-amber-500" : "text-muted-foreground"}`}
                  />
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Highlight Featured Stack
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Tampilkan di kartu sorotan halaman utama
                    </p>
                  </div>
                </div>
                <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
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
              className="text-xs h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {isEditing ? "Perbarui Tech Stack" : "Simpan Tech Stack"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
