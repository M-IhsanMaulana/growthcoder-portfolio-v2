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
import {
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  HelpCircle,
  CheckCircle2,
  FileCheck,
  X,
} from "lucide-react";
import { UniversalIconPicker } from "@/components/common/universal-icon-picker";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  Service,
  ServiceFormPayload,
  ServiceFaqPayload,
} from "@growthcoder/types";

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: Service | null;
  onSuccess: (service: Service) => void;
}

export function ServiceDialog({
  open,
  onOpenChange,
  service,
  onSuccess,
}: ServiceDialogProps) {
  const isEditing = !!service;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [iconSvg, setIconSvg] = useState<string | null>(null);
  const [shortDescription, setShortDescription] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [newDeliverableInput, setNewDeliverableInput] = useState("");
  const [faqs, setFaqs] = useState<ServiceFaqPayload[]>([]);
  const [order, setOrder] = useState<number>(0);
  const [isFeatured, setIsFeatured] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "deliverables" | "faqs">(
    "basic",
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form when opened
  useEffect(() => {
    if (open) {
      setErrors({});
      if (service) {
        setTitle(service.title);
        setSlug(service.slug);
        setIconSvg(service.iconSvg || null);
        setShortDescription(service.shortDescription);
        setValueProposition(service.valueProposition);
        setDeliverables(service.deliverables || []);
        setFaqs(
          service.faqs
            ? service.faqs.map((f, i) => ({
                id: f.id,
                question: f.question,
                answer: f.answer,
                sortOrder: f.sortOrder ?? i,
              }))
            : [],
        );
        setOrder(service.order ?? 0);
        setIsFeatured(service.isFeatured ?? false);
      } else {
        setTitle("");
        setSlug("");
        setIconSvg(null);
        setShortDescription("");
        setValueProposition("");
        setDeliverables([]);
        setNewDeliverableInput("");
        setFaqs([]);
        setOrder(0);
        setIsFeatured(false);
      }
      setActiveTab("basic");
    }
  }, [open, service]);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Auto-generate slug on title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    clearFieldError("title");
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
      clearFieldError("slug");
    }
  };

  // Deliverables handlers
  const handleAddDeliverable = () => {
    const trimmed = newDeliverableInput.trim();
    if (!trimmed) return;
    if (deliverables.includes(trimmed)) {
      toast.error("Deliverable ini sudah ada dalam daftar");
      return;
    }
    setDeliverables((prev) => [...prev, trimmed]);
    setNewDeliverableInput("");
  };

  const handleRemoveDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index));
  };

  // FAQ handlers
  const handleAddFaq = () => {
    setFaqs((prev) => [
      ...prev,
      {
        question: "",
        answer: "",
        sortOrder: prev.length,
      },
    ]);
  };

  const handleUpdateFaq = (
    index: number,
    field: "question" | "answer",
    value: string,
  ) => {
    setFaqs((prev) =>
      prev.map((f, i) => (i === index ? { ...f, [field]: value } : f)),
    );
    clearFieldError(`faq_${index}_${field}`);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Judul layanan wajib diisi";
    }
    if (!shortDescription.trim()) {
      newErrors.shortDescription = "Deskripsi singkat wajib diisi";
    }
    if (!valueProposition.trim()) {
      newErrors.valueProposition = "Value proposition wajib diisi";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (
        newErrors.title ||
        newErrors.shortDescription ||
        newErrors.valueProposition
      ) {
        setActiveTab("basic");
      }
      return false;
    }
    return true;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi seluruh field wajib yang bertanda bintang.");
      return;
    }

    setIsSubmitting(true);
    const payload: ServiceFormPayload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      iconSvg: iconSvg || null,
      shortDescription: shortDescription.trim(),
      valueProposition: valueProposition.trim(),
      deliverables: deliverables,
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
      order: Number(order) || 0,
      isFeatured,
    };

    try {
      if (isEditing && service) {
        const res = await apiClient.put<Service>(
          `/api/admin/services/${service.id}`,
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Layanan "${res.data.title}" berhasil diperbarui`);
          onSuccess(res.data);
          onOpenChange(false);
        }
      } else {
        const res = await apiClient.post<Service>(
          "/api/admin/services",
          payload,
        );
        if (res.success && res.data) {
          toast.success(`Layanan "${res.data.title}" berhasil ditambahkan`);
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
        setActiveTab("basic");
      }
      toast.error(error.message || "Gagal menyimpan layanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          noValidate
        >
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-left space-y-0.5">
                <DialogTitle className="text-lg font-bold text-foreground text-left">
                  {isEditing ? "Edit Layanan" : "Tambah Layanan Baru"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground text-left">
                  Kelola deskripsi layanan, value proposition, deliverables, dan
                  FAQ klien.
                </DialogDescription>
              </div>
            </div>

            {/* Navigation Tabs inside modal */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "basic"
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Informasi Utama
                {(errors.title ||
                  errors.shortDescription ||
                  errors.valueProposition) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("deliverables")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "deliverables"
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                Deliverables ({deliverables.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("faqs")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  activeTab === "faqs"
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                FAQ Client ({faqs.length})
              </button>
            </div>
          </DialogHeader>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {/* TAB 1: BASIC INFO */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Judul Layanan <FormRequiredMark />
                    </label>
                    <Input
                      placeholder="e.g. Full-Stack Web Development"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      error={errors.title}
                      className="text-sm"
                    />
                    <FormError message={errors.title} />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Slug URL
                    </label>
                    <Input
                      placeholder="full-stack-web-development"
                      value={slug}
                      onChange={(e) => {
                        setSlug(e.target.value);
                        clearFieldError("slug");
                      }}
                      error={errors.slug}
                      className="text-sm font-mono"
                    />
                    <FormError message={errors.slug} />
                  </div>
                </div>

                {/* Universal Icon Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Icon Representatif Layanan
                  </label>
                  <UniversalIconPicker
                    value={iconSvg}
                    onChange={setIconSvg}
                    defaultCategory="services"
                    label="Pilih Icon Layanan"
                    description="Pilih dari preset layanan/tools, custom SVG, atau Media Library"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Deskripsi Singkat <FormRequiredMark />
                  </label>
                  <Input
                    placeholder="Ringkasan 1-2 kalimat untuk kartu layanan..."
                    value={shortDescription}
                    onChange={(e) => {
                      setShortDescription(e.target.value);
                      clearFieldError("shortDescription");
                    }}
                    error={errors.shortDescription}
                    className="text-sm"
                  />
                  <FormError message={errors.shortDescription} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Value Proposition <FormRequiredMark />
                  </label>
                  <Textarea
                    placeholder="Jelaskan nilai tambah yang didapatkan klien, metodologi, standar kualitas, dan hasil akhir..."
                    value={valueProposition}
                    onChange={(e) => {
                      setValueProposition(e.target.value);
                      clearFieldError("valueProposition");
                    }}
                    error={errors.valueProposition}
                    className="text-sm min-h-[100px] resize-y"
                  />
                  <FormError message={errors.valueProposition} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Urutan Tampil (Sort Order)
                    </label>
                    <Input
                      type="number"
                      value={order}
                      onChange={(e) => setOrder(Number(e.target.value))}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-6">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-muted peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-xs font-medium text-foreground">
                        Tampilkan sebagai Layanan Unggulan (Featured)
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: DELIVERABLES */}
            {activeTab === "deliverables" && (
              <div className="space-y-4">
                <div className="p-3.5 bg-muted/40 rounded-xl border border-border">
                  <p className="text-xs font-medium text-foreground">
                    Apa saja output / deliverable yang diterima klien?
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Contoh: &quot;Production-ready Web App&quot;, &quot;Clean &
                    Documented Git Repo&quot;, &quot;Automated CI/CD
                    Pipeline&quot;, &quot;1 Bulan Garansi & Support&quot;
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <Input
                      placeholder="Ketik nama deliverable..."
                      value={newDeliverableInput}
                      onChange={(e) => setNewDeliverableInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddDeliverable();
                        }
                      }}
                      className="text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleAddDeliverable}
                      className="text-xs h-9 bg-primary text-primary-foreground font-medium shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Tambah
                    </Button>
                  </div>
                </div>

                {/* Deliverables List Chips */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-foreground">
                    Daftar Deliverables Terpasang ({deliverables.length})
                  </span>

                  {deliverables.length > 0 ? (
                    <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-border bg-card min-h-[80px]">
                      {deliverables.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-foreground text-xs font-medium shadow-2xs group"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDeliverable(idx)}
                            className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                            title="Hapus deliverable"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl border border-dashed border-border bg-card text-xs text-muted-foreground">
                      Belum ada deliverables yang ditambahkan. Ketik di atas
                      untuk menambahkan.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: FAQS */}
            {activeTab === "faqs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold text-foreground">
                      Frequently Asked Questions (FAQ)
                    </h4>
                    <p className="text-[11px] text-muted-foreground">
                      Pertanyaan umum seputar proses kerja, estimasi waktu, atau
                      teknologi layanan ini.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFaq}
                    className="text-xs h-8"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Tambah FAQ
                  </Button>
                </div>

                <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-primary">
                          FAQ #{index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFaq(index)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-6 px-1.5"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">
                          Pertanyaan (Question)
                        </label>
                        <Input
                          placeholder="e.g. Berapa lama rata-rata waktu pengerjaan proyek?"
                          value={faq.question}
                          onChange={(e) =>
                            handleUpdateFaq(index, "question", e.target.value)
                          }
                          className="text-xs"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-muted-foreground">
                          Jawaban (Answer)
                        </label>
                        <Textarea
                          placeholder="Jelaskan jawaban secara ramah dan profesional..."
                          value={faq.answer}
                          onChange={(e) =>
                            handleUpdateFaq(index, "answer", e.target.value)
                          }
                          className="text-xs min-h-[60px] resize-y"
                        />
                      </div>
                    </div>
                  ))}

                  {faqs.length === 0 && (
                    <div className="p-8 text-center rounded-xl border border-dashed border-border bg-card text-xs text-muted-foreground">
                      Belum ada FAQ untuk layanan ini. Klik tombol &quot;Tambah
                      FAQ&quot; di atas untuk menambahkan.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 px-6 border-t border-border/70 shrink-0 bg-muted/30 flex items-center justify-between">
            <div className="text-xs text-muted-foreground font-medium">
              {deliverables.length} Deliverables • {faqs.length} FAQs
            </div>
            <div className="flex items-center gap-2">
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
                  "Buat Layanan"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
