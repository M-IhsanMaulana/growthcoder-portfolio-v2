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
  School,
  Sparkles,
  Layers,
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
  Badge,
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

type EducationLevel = "smp" | "sma_smk" | "higher_ed" | "other";

const LEVEL_OPTIONS: Array<{
  value: EducationLevel;
  label: string;
  badge: string;
  icon: React.ElementType;
}> = [
  {
    value: "higher_ed",
    label: "Perguruan Tinggi (Diploma / S1 / S2 / S3)",
    badge: "Universitas / Kampus",
    icon: GraduationCap,
  },
  {
    value: "sma_smk",
    label: "SMA / SMK / MA / Sederajat",
    badge: "Sekolah Menengah Kejuruan / Atas",
    icon: BookOpen,
  },
  {
    value: "smp",
    label: "SMP / MTs / Sederajat",
    badge: "Sekolah Menengah Pertama",
    icon: School,
  },
  {
    value: "other",
    label: "Non-Formal / Bootcamp / Pelatihan",
    badge: "Kursus & Pelatihan",
    icon: Layers,
  },
];

const PRESET_DEGREES: Record<EducationLevel, string[]> = {
  smp: ["SMP (Sekolah Menengah Pertama)", "MTs (Madrasah Tsanawiyah)"],
  sma_smk: [
    "SMK (Sekolah Menengah Kejuruan)",
    "SMA (Sekolah Menengah Atas)",
    "MA (Madrasah Aliyah)",
  ],
  higher_ed: [
    "Sarjana (S1)",
    "Diploma 3 (D3)",
    "Diploma 4 (D4)",
    "Magister (S2)",
    "Doktor (S3)",
  ],
  other: [
    "Bootcamp Intensive",
    "Professional Certification",
    "Kursus Keahlian",
  ],
};

function detectEducationLevel(edu?: Education | null): EducationLevel {
  if (!edu) return "higher_ed";
  const deg = (edu.degree || "").toLowerCase();
  const inst = (edu.institution || "").toLowerCase();

  if (
    deg.includes("smp") ||
    deg.includes("mts") ||
    deg.includes("menengah pertama") ||
    inst.includes("smp") ||
    inst.includes("mts")
  ) {
    return "smp";
  }
  if (
    deg.includes("smk") ||
    deg.includes("sma") ||
    deg.includes("kejuruan") ||
    deg.includes("aliyah") ||
    deg.includes("menengah atas") ||
    inst.includes("smk") ||
    inst.includes("sma") ||
    inst.includes("man ")
  ) {
    return "sma_smk";
  }
  if (
    deg.includes("bootcamp") ||
    deg.includes("kursus") ||
    deg.includes("course") ||
    deg.includes("sertifikasi")
  ) {
    return "other";
  }
  return "higher_ed";
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSuccess,
}: EducationDialogProps) {
  const isEditing = Boolean(education);

  const [level, setLevel] = useState<EducationLevel>("higher_ed");
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
        setLevel(detectEducationLevel(education));
        setInstitution(education.institution || "");
        setDegree(education.degree || "");
        setFieldOfStudy(
          education.fieldOfStudy === "-" ? "" : education.fieldOfStudy || "",
        );
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
        setLevel("higher_ed");
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

  const handleLevelChange = (newLevel: EducationLevel) => {
    setLevel(newLevel);
    if (newLevel === "smp") {
      clearFieldError("fieldOfStudy");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!institution.trim()) {
      newErrors.institution =
        level === "smp" || level === "sma_smk"
          ? "Nama Sekolah wajib diisi"
          : "Nama Institusi / Kampus wajib diisi";
    }
    if (!degree.trim()) {
      newErrors.degree = "Jenjang / Gelar Pendidikan wajib diisi";
    }
    if (level !== "smp" && !fieldOfStudy.trim()) {
      newErrors.fieldOfStudy =
        level === "sma_smk"
          ? "Jurusan / Bidang Keahlian wajib diisi"
          : "Jurusan / Program Studi wajib diisi";
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
        fieldOfStudy: fieldOfStudy.trim() || (level === "smp" ? "-" : ""),
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

  // Dynamic placeholders and labels based on level
  const institutionLabel =
    level === "smp" || level === "sma_smk"
      ? "Nama Sekolah"
      : level === "other"
        ? "Lembaga / Penyelenggara"
        : "Institusi / Universitas";

  const institutionPlaceholder =
    level === "smp"
      ? "Contoh: SMP Negeri 1 Jakarta / SMP IT Al-Azhar"
      : level === "sma_smk"
        ? "Contoh: SMKN 1 Cimahi / SMAN 3 Bandung"
        : level === "other"
          ? "Contoh: Hacktiv8 / Dicoding Academy"
          : "Contoh: Universitas Indonesia / ITB";

  const degreePlaceholder =
    level === "smp"
      ? "Contoh: Sekolah Menengah Pertama (SMP)"
      : level === "sma_smk"
        ? "Contoh: SMK (Sekolah Menengah Kejuruan)"
        : level === "other"
          ? "Contoh: Intensive Bootcamp Certificate"
          : "Contoh: Bachelor of Computer Science (S.Kom)";

  const fieldOfStudyLabel =
    level === "sma_smk"
      ? "Jurusan / Konsentrasi Keahlian"
      : level === "smp"
        ? "Jurusan / Peminatan (Opsional)"
        : level === "other"
          ? "Topik / Bidang Spesialisasi"
          : "Jurusan / Program Studi";

  const fieldOfStudyPlaceholder =
    level === "sma_smk"
      ? "Contoh: Rekayasa Perangkat Lunak (RPL) / TKJ"
      : level === "smp"
        ? "Tidak ada jurusan (bisa dikosongkan)"
        : level === "other"
          ? "Contoh: Full-Stack Web Development"
          : "Contoh: Teknik Informatika / Computer Science";

  const gradePlaceholder =
    level === "smp" || level === "sma_smk"
      ? "Contoh: Nilai Akhir: 89.5 / 100 atau Rata-rata UN: 88.0"
      : level === "other"
        ? "Contoh: Score: 95/100 (Distinction)"
        : "Contoh: IPK 3.85 / 4.00 (Cum Laude)";

  const descriptionPlaceholder =
    level === "smp"
      ? "Tuliskan keaktifan organisasi OSIS, ekstrakurikuler (Pramuka, PMR, Paskibra), atau prestasi lomba..."
      : level === "sma_smk"
        ? "Tuliskan fokus kejuruan, proyek tugas akhir/kejuruan, magang/PKL industri, organisasi..."
        : level === "other"
          ? "Tuliskan silabus utama, portofolio capstone project yang dibangun, dan sertifikat kelulusan..."
          : "Tuliskan mata kuliah fokus, judul skripsi/thesis, keikutsertaan organisasi, atau publikasi...";

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
                Isi data jenjang pendidikan (SMP, SMA/SMK, Perguruan Tinggi), masa
                studi, dan logo institusi
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
            {/* Education Level Selector */}
            <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-2">
              <Label className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  Tingkat / Kategori Pendidikan <FormRequiredMark />
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  Sesuaikan form otomatis untuk SMP, SMK, atau Kuliah
                </span>
              </Label>
              <Select
                value={level}
                onValueChange={(val) =>
                  handleLevelChange(val as EducationLevel)
                }
              >
                <SelectTrigger className="h-10 text-xs sm:text-sm bg-background">
                  <SelectValue placeholder="Pilih Tingkat Pendidikan" />
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-medium">{opt.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Institution & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  {institutionLabel} <FormRequiredMark />
                </Label>
                <Input
                  placeholder={institutionPlaceholder}
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
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-primary" />
                    Gelar / Jenjang <FormRequiredMark />
                  </Label>
                </div>
                <Input
                  placeholder={degreePlaceholder}
                  value={degree}
                  onChange={(e) => {
                    setDegree(e.target.value);
                    clearFieldError("degree");
                  }}
                  error={errors.degree}
                  className="h-10 text-sm"
                />
                {/* Preset Suggestions */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] text-muted-foreground mr-1 self-center">
                    Pilihan cepat:
                  </span>
                  {PRESET_DEGREES[level].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setDegree(preset);
                        clearFieldError("degree");
                      }}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-muted/80 hover:bg-primary/10 hover:text-primary border border-border/60 transition-colors cursor-pointer text-muted-foreground font-medium"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <FormError message={errors.degree} />
              </div>
            </div>

            {/* Field of Study & Grade/GPA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-primary" />
                  {fieldOfStudyLabel} {level !== "smp" && <FormRequiredMark />}
                </Label>
                <Input
                  placeholder={fieldOfStudyPlaceholder}
                  value={fieldOfStudy}
                  onChange={(e) => {
                    setFieldOfStudy(e.target.value);
                    clearFieldError("fieldOfStudy");
                  }}
                  error={errors.fieldOfStudy}
                  className="h-10 text-sm"
                />
                {level === "smp" && (
                  <p className="text-[11px] text-muted-foreground">
                    💡 SMP tidak memiliki penjurusan, field ini boleh
                    dikosongkan.
                  </p>
                )}
                <FormError message={errors.fieldOfStudy} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-muted-foreground" />
                  Nilai / Nilai Akhir / IPK / Predikat
                </Label>
                <Input
                  placeholder={gradePlaceholder}
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
            </div>

            {/* Logo Picker */}
            <LogoPickerField
              label="Logo Sekolah / Institusi / Kampus"
              description="Pilih logo sekolah atau kampus dari Media Library (format PNG/SVG/WebP)"
              value={institutionLogoUrl}
              onChange={setInstitutionLogoUrl}
              placeholderText="Pilih logo sekolah / kampus dari Media Library"
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
                    Tentukan tanggal awal dan akhir masa studi
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
                placeholder={descriptionPlaceholder}
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
