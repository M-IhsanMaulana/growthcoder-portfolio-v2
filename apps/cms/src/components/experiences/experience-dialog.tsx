"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Save,
  Loader2,
  Calendar,
  MapPin,
  Building2,
  Layers,
  Sparkles,
} from "lucide-react";
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
import { LogoPickerField } from "./logo-picker-field";
import { TechStackMultiSelector } from "@/components/projects/tech-stack-multi-selector";
import { RichEditor } from "@/components/editor/rich-editor";
import type { Experience, TechStack } from "@growthcoder/types";

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: Experience | null;
  availableTechStacks: TechStack[];
  onSuccess: (savedItem: Experience) => void;
}

const EMPLOYMENT_TYPES = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
  availableTechStacks,
  onSuccess,
}: ExperienceDialogProps) {
  const isEditing = Boolean(experience);

  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<
    "full-time" | "part-time" | "contract" | "freelance"
  >("full-time");
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [techStackIds, setTechStackIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate or reset form
  useEffect(() => {
    if (open) {
      setErrors({});
      if (experience) {
        setCompany(experience.company || "");
        setPosition(experience.position || "");
        setLocation(experience.location || "");
        setEmploymentType((experience.employmentType as any) || "full-time");
        setCompanyLogoUrl(experience.companyLogoUrl || null);
        setStartDate(
          experience.startDate ? experience.startDate.split("T")[0] : "",
        );
        setEndDate(experience.endDate ? experience.endDate.split("T")[0] : "");
        setIsCurrent(Boolean(experience.isCurrent));
        setTechStackIds(
          experience.techStacks
            ? experience.techStacks.map((s) => s.id)
            : experience.techStackIds || [],
        );
        setDescription(experience.description || "");
        setOrder(experience.order || 0);
      } else {
        setCompany("");
        setPosition("");
        setLocation("");
        setEmploymentType("full-time");
        setCompanyLogoUrl(null);
        setStartDate("");
        setEndDate("");
        setIsCurrent(false);
        setTechStackIds([]);
        setDescription("");
        setOrder(0);
      }
    }
  }, [open, experience]);

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
    if (!company.trim()) {
      newErrors.company = "Nama Perusahaan wajib diisi";
    }
    if (!position.trim()) {
      newErrors.position = "Posisi / Jabatan wajib diisi";
    }
    if (!startDate) {
      newErrors.startDate = "Tanggal Mulai wajib diisi";
    }
    if (!isCurrent && !endDate) {
      newErrors.endDate = "Tanggal Selesai wajib diisi jika tidak aktif";
    }
    if (
      startDate &&
      endDate &&
      !isCurrent &&
      new Date(startDate) > new Date(endDate)
    ) {
      newErrors.endDate =
        "Tanggal selesai tidak boleh lebih awal dari tanggal mulai";
    }
    if (!description.trim() || description === "<p></p>") {
      newErrors.description =
        "Deskripsi pekerjaan / tanggung jawab wajib diisi";
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
    try {
      const payload = {
        company: company.trim(),
        position: position.trim(),
        location: location.trim() || null,
        employmentType,
        companyLogoUrl: companyLogoUrl || null,
        startDate,
        endDate: isCurrent ? null : endDate || null,
        isCurrent,
        techStackIds,
        description,
        order,
      };

      let res;
      if (isEditing && experience) {
        res = await apiClient.put<Experience>(
          `/api/admin/experiences/${experience.id}`,
          payload,
        );
      } else {
        res = await apiClient.post<Experience>(
          "/api/admin/experiences",
          payload,
        );
      }

      if (res.success && res.data) {
        toast.success(
          isEditing
            ? "Pengalaman kerja berhasil diperbarui"
            : "Pengalaman kerja baru berhasil ditambahkan",
        );
        onSuccess(res.data);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gagal menyimpan pengalaman kerja");
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
      toast.error(error.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs shrink-0">
              <Briefcase className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing
                  ? "Edit Pengalaman Kerja"
                  : "Tambah Pengalaman Kerja"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Isi riwayat pekerjaan, teknologi yang digunakan, serta logo dari
                Media Library
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          noValidate
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* Company & Position */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-primary" />
                  Nama Perusahaan <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: PT Teknologi Bangsa / Google"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    clearFieldError("company");
                  }}
                  error={errors.company}
                  className="h-10 text-sm"
                />
                <FormError message={errors.company} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  Posisi / Jabatan <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: Senior Fullstack Engineer"
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    clearFieldError("position");
                  }}
                  error={errors.position}
                  className="h-10 text-sm"
                />
                <FormError message={errors.position} />
              </div>
            </div>

            {/* Logo Picker */}
            <LogoPickerField
              label="Logo Perusahaan"
              description="Pilih logo perusahaan dari Media Library (format PNG/SVG/WebP)"
              value={companyLogoUrl}
              onChange={setCompanyLogoUrl}
              placeholderText="Pilih logo perusahaan dari Media Library"
            />

            {/* Employment Type & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Tipe Pekerjaan
                </Label>
                <Select
                  value={employmentType}
                  onValueChange={(val: any) => setEmploymentType(val)}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  Lokasi Kerja
                </Label>
                <Input
                  placeholder="Contoh: Jakarta, Indonesia (Hybrid / Remote)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Dates & Ongoing status */}
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Periode Bekerja
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Tentukan tanggal awal dan akhir masa kerja
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="isCurrent"
                    className="text-xs cursor-pointer select-none text-muted-foreground font-normal"
                  >
                    Saat ini masih bekerja di sini
                  </Label>
                  <Switch
                    id="isCurrent"
                    checked={isCurrent}
                    onCheckedChange={(checked) => {
                      setIsCurrent(checked);
                      if (checked) {
                        setEndDate("");
                        clearFieldError("endDate");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Tanggal Mulai <FormRequiredMark />
                  </Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      clearFieldError("startDate");
                    }}
                    error={errors.startDate}
                    className="h-9 text-xs"
                  />
                  <FormError message={errors.startDate} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Tanggal Selesai {!isCurrent && <FormRequiredMark />}
                  </Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      clearFieldError("endDate");
                    }}
                    disabled={isCurrent}
                    error={errors.endDate}
                    placeholder={isCurrent ? "Saat Ini" : ""}
                    className="h-9 text-xs disabled:opacity-50 disabled:bg-muted"
                  />
                  <FormError message={errors.endDate} />
                </div>
              </div>
            </div>

            {/* Tech Stacks Multi Selector */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  Tech Stacks & Tools Digunakan
                </Label>
                <span className="text-[11px] text-muted-foreground">
                  {techStackIds.length} dipilih
                </span>
              </div>
              <TechStackMultiSelector
                availableStacks={availableTechStacks}
                selectedIds={techStackIds}
                onChange={setTechStackIds}
              />
            </div>

            {/* Rich Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Tanggung Jawab & Pencapaian <FormRequiredMark />
              </Label>
              <RichEditor
                value={description}
                onChange={(val) => {
                  setDescription(val);
                  clearFieldError("description");
                }}
                placeholder="Tuliskan poin-poin tanggung jawab, pencapaian kunci, atau kontribusi arsitektur di perusahaan..."
              />
              <FormError message={errors.description} />
            </div>

            {/* Order / Urutan */}
            <div className="space-y-1.5 max-w-[200px]">
              <Label className="text-xs font-semibold text-foreground">
                Urutan Tampil (Order)
              </Label>
              <Input
                type="number"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                min={0}
                className="h-9 text-xs w-36"
              />
              <p className="text-[10px] text-muted-foreground">
                Nilai lebih kecil tampil lebih awal
              </p>
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
              className="text-xs h-9 px-4 min-w-[120px] bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {isEditing ? "Simpan Perubahan" : "Tambah Pengalaman"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
