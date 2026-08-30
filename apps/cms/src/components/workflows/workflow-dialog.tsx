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
} from "@growthcoder/ui";
import {
  Loader2,
  GitBranch,
  Plus,
  Trash2,
  Search,
  PenTool,
  Code2,
  Rocket,
  Layers,
  Sparkles,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { WorkflowStep, WorkflowStepFormPayload } from "@growthcoder/types";

interface WorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  step?: WorkflowStep | null;
  onSuccess: (step: WorkflowStep) => void;
}

const PRESET_ICONS = [
  { label: "Search / Riset", value: "Search", icon: Search },
  { label: "PenTool / Desain", value: "PenTool", icon: PenTool },
  { label: "Code2 / Koding", value: "Code2", icon: Code2 },
  { label: "Rocket / Rilis", value: "Rocket", icon: Rocket },
  { label: "Layers / Arsitektur", value: "Layers", icon: Layers },
  { label: "Sparkles / AI & Fitur", value: "Sparkles", icon: Sparkles },
];

export function WorkflowDialog({
  open,
  onOpenChange,
  step,
  onSuccess,
}: WorkflowDialogProps) {
  const isEditing = !!step;

  const [stepNumber, setStepNumber] = useState("01");
  const [title, setTitle] = useState("");
  const [shortTitle, setShortTitle] = useState("");
  const [description, setDescription] = useState("");
  const [iconSvg, setIconSvg] = useState<string>("Search");
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Activities list
  const [activities, setActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setErrors({});
      if (step) {
        setStepNumber(step.stepNumber || "01");
        setTitle(step.title || "");
        setShortTitle(step.shortTitle || "");
        setDescription(step.description || "");
        setIconSvg(step.iconSvg || "Search");
        setOrder(step.order ?? 0);
        setIsActive(step.isActive ?? true);
        setActivities(step.activities ? [...step.activities] : []);
      } else {
        setStepNumber("01");
        setTitle("");
        setShortTitle("");
        setDescription("");
        setIconSvg("Search");
        setOrder(0);
        setIsActive(true);
        setActivities([]);
      }
      setNewActivity("");
    }
  }, [open, step]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleAddActivity = () => {
    const val = newActivity.trim();
    if (!val) return;
    setActivities((prev) => [...prev, val]);
    setNewActivity("");
  };

  const handleRemoveActivity = (index: number) => {
    setActivities((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!stepNumber.trim())
      newErrors.stepNumber = "Nomor tahap wajib diisi (e.g. 01)";
    if (!title.trim()) newErrors.title = "Judul tahapan wajib diisi";
    if (!shortTitle.trim())
      newErrors.shortTitle = "Judul singkat / tab label wajib diisi";
    if (!description.trim())
      newErrors.description = "Deskripsi alur kerja wajib diisi";

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
    const payload: WorkflowStepFormPayload = {
      stepNumber: stepNumber.trim(),
      title: title.trim(),
      shortTitle: shortTitle.trim(),
      description: description.trim(),
      activities: activities.filter((a) => a.trim().length > 0),
      iconSvg: iconSvg || null,
      order: Number(order) || 0,
      isActive,
    };

    try {
      if (isEditing && step) {
        const res = await apiClient.put<WorkflowStep>(
          `/api/admin/workflows/${step.id}`,
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Tahapan "${res.data.title}" berhasil diperbarui`);
          onSuccess(res.data);
          onOpenChange(false);
        }
      } else {
        const res = await apiClient.post<WorkflowStep>(
          "/api/admin/workflows",
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Tahapan "${res.data.title}" berhasil ditambahkan`);
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
      toast.error(error.message || "Gagal menyimpan tahapan alur kerja");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary dark:text-emerald-400 shadow-xs shrink-0">
              <GitBranch className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing ? "Edit Tahapan Alur Kerja" : "Tambah Tahapan Baru"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Definisikan proses kolaborasi dan deliverables di setiap sprint
                atau milestone.
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
            {/* Step Number & Short Title Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-1">
                <label className="text-xs font-semibold text-foreground">
                  Nomor Tahap <FormRequiredMark />
                </label>
                <Input
                  placeholder="e.g. 01"
                  value={stepNumber}
                  onChange={(e) => {
                    setStepNumber(e.target.value);
                    clearFieldError("stepNumber");
                  }}
                  error={errors.stepNumber}
                  className="text-sm h-10 font-mono"
                />
                <FormError message={errors.stepNumber} />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Label Singkat (Tab Pill) <FormRequiredMark />
                </label>
                <Input
                  placeholder="e.g. Analisis Kebutuhan"
                  value={shortTitle}
                  onChange={(e) => {
                    setShortTitle(e.target.value);
                    clearFieldError("shortTitle");
                  }}
                  error={errors.shortTitle}
                  className="text-sm h-10"
                />
                <FormError message={errors.shortTitle} />
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Judul Lengkap Tahapan <FormRequiredMark />
              </label>
              <Input
                placeholder="e.g. Discovery & Konsultasi Kebutuhan"
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

            {/* Icon Preset Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Icon Representatif
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PRESET_ICONS.map((p) => {
                  const IconComp = p.icon;
                  const isSelected = iconSvg === p.value;
                  return (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setIconSvg(p.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary dark:text-emerald-400 font-semibold shadow-2xs"
                          : "border-border/70 hover:bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      <IconComp className="w-4 h-4 shrink-0" />
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Deskripsi Alur Kerja <FormRequiredMark />
              </label>
              <Textarea
                placeholder="Jelaskan apa yang dilakukan pada tahap ini dan bagaimana klien berkolaborasi..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  clearFieldError("description");
                }}
                error={errors.description}
                className="text-sm min-h-[90px] resize-y custom-scrollbar"
              />
              <FormError message={errors.description} />
            </div>

            {/* Dynamic Activities List */}
            <div className="space-y-2 pt-2 border-t border-border/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  Aktivitas Kunci &amp; Deliverables
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {activities.length} butir ditambahkan
                </span>
              </div>

              {/* Input for new activity */}
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Tambah aktivitas (e.g. Wawancara requirement, Demo staging)..."
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddActivity();
                    }
                  }}
                  className="text-xs h-9"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleAddActivity}
                  disabled={!newActivity.trim()}
                  className="text-xs h-9 px-3 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Tambah
                </Button>
              </div>

              {/* Added items list */}
              {activities.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {activities.map((act, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 px-3 rounded-xl border border-border/60 bg-muted/30 text-xs"
                    >
                      <span className="leading-snug truncate">{act}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveActivity(idx)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded-md transition-colors cursor-pointer"
                        title="Hapus butir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Order & Active Switch */}
            <div className="flex items-center justify-between pt-3 border-t border-border/60">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-foreground">
                  Urutan Tampil:
                </label>
                <Input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="text-xs w-24 h-8 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="workflow-active-switch"
                  className="text-xs font-medium text-muted-foreground cursor-pointer"
                >
                  {isActive ? "Aktif (Ditampilkan)" : "Draft (Disembunyikan)"}
                </label>
                <Switch
                  id="workflow-active-switch"
                  checked={isActive}
                  onCheckedChange={setIsActive}
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
              className="text-xs h-9 px-4 cursor-pointer"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="text-xs h-9 px-4 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Menyimpan...
                </>
              ) : isEditing ? (
                "Simpan Perubahan"
              ) : (
                "Buat Tahapan"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
