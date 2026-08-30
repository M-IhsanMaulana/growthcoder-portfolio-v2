"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Save,
  Loader2,
  Calendar,
  Award,
  BookOpen,
  Building,
  Sparkles,
} from "lucide-react";
import { Button, Input, FormError, FormRequiredMark } from "@/components/ui";
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
import { RichEditor } from "@/components/editor/rich-editor";
import type { Education } from "@growthcoder/types";

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: Education | null;
  onSuccess: (savedItem: Education) => void;
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSuccess,
}: EducationDialogProps) {
  const isEditing = Boolean(education);

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institutionLogoUrl, setInstitutionLogoUrl] = useState<string | null>(
    null,
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate or reset form
  useEffect(() => {
    if (open) {
      setErrors({});
      if (education) {
        setInstitution(education.institution || "");
        setDegree(education.degree || "");
        setFieldOfStudy(education.fieldOfStudy || "");
        setInstitutionLogoUrl(education.institutionLogoUrl || null);
        setStartDate(
          education.startDate ? education.startDate.split("T")[0] : "",
        );
        setEndDate(education.endDate ? education.endDate.split("T")[0] : "");
        setIsCurrent(Boolean(education.isCurrent));
        setGrade(education.grade || "");
        setDescription(education.description || "");
        setOrder(education.order || 0);
      } else {
        setInstitution("");
        setDegree("");
        setFieldOfStudy("");
        setInstitutionLogoUrl(null);
        setStartDate("");
        setEndDate("");
        setIsCurrent(false);
        setGrade("");
        setDescription("");
        setOrder(0);
      }
    }
  }, [open, education]);

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
    if (!institution.trim()) {
      newErrors.institution = "Nama Institusi / Universitas wajib diisi";
    }
    if (!degree.trim()) {
      newErrors.degree = "Gelar / Jenjang Pendidikan wajib diisi";
    }
    if (!fieldOfStudy.trim()) {
      newErrors.fieldOfStudy = "Jurusan / Program Studi wajib diisi";
    }
    if (!startDate) {
      newErrors.startDate = "Tanggal Mulai wajib diisi";
    }
    if (!isCurrent && !endDate) {
      newErrors.endDate = "Tanggal Selesai wajib diisi jika sudah lulus";
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
        institution: institution.trim(),
        degree: degree.trim(),
        fieldOfStudy: fieldOfStudy.trim(),
        institutionLogoUrl: institutionLogoUrl || null,
        startDate,
        endDate: isCurrent ? null : endDate || null,
        isCurrent,
        grade: grade.trim() || null,
        description: description.trim() || null,
        order,
      };

      let res;
      if (isEditing && education) {
        res = await apiClient.put<Education>(
          `/api/admin/educations/${education.id}`,
          payload,
        );
      } else {
        res = await apiClient.post<Education>("/api/admin/educations", payload);
      }

      if (res.success && res.data) {
        toast.success(
          isEditing
            ? "Riwayat pendidikan berhasil diperbarui"
            : "Riwayat pendidikan baru berhasil ditambahkan",
        );
        onSuccess(res.data);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gagal menyimpan riwayat pendidikan");
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
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing
                  ? "Edit Riwayat Pendidikan"
                  : "Tambah Riwayat Pendidikan"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Isi data perguruan tinggi, jenjang gelar, masa studi, dan logo
                institusi
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          noValidate
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* Institution & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  Institusi / Universitas <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: Universitas Indonesia / ITB"
                  value={institution}
                  onChange={(e) => {
                    setInstitution(e.target.value);
                    clearFieldError("institution");
                  }}
                  error={errors.institution}
                  className="h-10 text-sm"
                />
                <FormError message={errors.institution} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  Gelar / Jenjang <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: Sarjana Komputer (S.Kom) / Bachelor"
                  value={degree}
                  onChange={(e) => {
                    setDegree(e.target.value);
                    clearFieldError("degree");
                  }}
                  error={errors.degree}
                  className="h-10 text-sm"
                />
                <FormError message={errors.degree} />
              </div>
            </div>

            {/* Field of Study & Grade/GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  Jurusan / Program Studi <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: Teknik Informatika / Computer Science"
                  value={fieldOfStudy}
                  onChange={(e) => {
                    setFieldOfStudy(e.target.value);
                    clearFieldError("fieldOfStudy");
                  }}
                  error={errors.fieldOfStudy}
                  className="h-10 text-sm"
                />
                <FormError message={errors.fieldOfStudy} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-muted-foreground" />
                  Nilai / IPK / Predikat
                </Label>
                <Input
                  placeholder="Contoh: IPK 3.88 / 4.00 (Cum Laude)"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Logo Picker */}
            <LogoPickerField
              label="Logo Institusi / Kampus"
              description="Pilih logo kampus dari Media Library (format PNG/SVG/WebP)"
              value={institutionLogoUrl}
              onChange={setInstitutionLogoUrl}
              placeholderText="Pilih logo kampus dari Media Library"
            />

            {/* Dates & Ongoing status */}
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Masa Studi
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Tentukan tanggal awal dan akhir masa perkuliahan
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="isCurrentEdu"
                    className="text-xs cursor-pointer select-none text-muted-foreground font-normal"
                  >
                    Masih menempuh studi
                  </Label>
                  <Switch
                    id="isCurrentEdu"
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

            {/* Rich Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Aktivitas, Organisasi & Prestasi Akademik
              </Label>
              <RichEditor
                value={description}
                onChange={setDescription}
                placeholder="Tuliskan mata kuliah fokus, judul skripsi/thesis, keikutsertaan organisasi, atau publikasi..."
              />
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

          {/* Footer Buttons */}
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
                  {isEditing ? "Simpan Perubahan" : "Tambah Pendidikan"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
