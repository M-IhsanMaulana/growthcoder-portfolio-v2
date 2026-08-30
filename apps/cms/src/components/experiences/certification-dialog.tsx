"use client";

import React, { useState, useEffect } from "react";
import {
  Award,
  Save,
  Loader2,
  Calendar,
  Link as LinkIcon,
  ShieldCheck,
  Building,
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
import type { Certification } from "@growthcoder/types";

interface CertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification?: Certification | null;
  onSuccess: (savedItem: Certification) => void;
}

export function CertificationDialog({
  open,
  onOpenChange,
  certification,
  onSuccess,
}: CertificationDialogProps) {
  const isEditing = Boolean(certification);

  const [name, setName] = useState("");
  const [issuer, setIssuer] = useState("");
  const [issuerLogoUrl, setIssuerLogoUrl] = useState<string | null>(null);
  const [issueDate, setIssueDate] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [neverExpires, setNeverExpires] = useState(true);
  const [credentialId, setCredentialId] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [order, setOrder] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate or reset form
  useEffect(() => {
    if (open) {
      setErrors({});
      if (certification) {
        setName(certification.name || "");
        setIssuer(certification.issuer || "");
        setIssuerLogoUrl(certification.issuerLogoUrl || null);
        setIssueDate(
          certification.issueDate ? certification.issueDate.split("T")[0] : "",
        );
        setExpirationDate(
          certification.expirationDate
            ? certification.expirationDate.split("T")[0]
            : "",
        );
        setNeverExpires(!certification.expirationDate);
        setCredentialId(certification.credentialId || "");
        setCredentialUrl(certification.credentialUrl || "");
        setOrder(certification.order || 0);
      } else {
        setName("");
        setIssuer("");
        setIssuerLogoUrl(null);
        setIssueDate("");
        setExpirationDate("");
        setNeverExpires(true);
        setCredentialId("");
        setCredentialUrl("");
        setOrder(0);
      }
    }
  }, [open, certification]);

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
    if (!name.trim()) {
      newErrors.name = "Nama Sertifikasi wajib diisi";
    }
    if (!issuer.trim()) {
      newErrors.issuer = "Lembaga Penerbit (Issuer) wajib diisi";
    }
    if (!issueDate) {
      newErrors.issueDate = "Tanggal Terbit wajib diisi";
    }
    if (!neverExpires && !expirationDate) {
      newErrors.expirationDate =
        "Tanggal Kadaluarsa wajib diisi jika memiliki masa berlaku";
    }
    if (
      issueDate &&
      expirationDate &&
      !neverExpires &&
      new Date(issueDate) > new Date(expirationDate)
    ) {
      newErrors.expirationDate =
        "Tanggal kadaluarsa tidak boleh lebih awal dari tanggal terbit";
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
        name: name.trim(),
        issuer: issuer.trim(),
        issuerLogoUrl: issuerLogoUrl || null,
        issueDate,
        expirationDate: neverExpires ? null : expirationDate || null,
        credentialId: credentialId.trim() || null,
        credentialUrl: credentialUrl.trim() || null,
        order,
      };

      let res;
      if (isEditing && certification) {
        res = await apiClient.put<Certification>(
          `/api/admin/certifications/${certification.id}`,
          payload,
        );
      } else {
        res = await apiClient.post<Certification>(
          "/api/admin/certifications",
          payload,
        );
      }

      if (res.success && res.data) {
        toast.success(
          isEditing
            ? "Sertifikasi berhasil diperbarui"
            : "Sertifikasi baru berhasil ditambahkan",
        );
        onSuccess(res.data);
        onOpenChange(false);
      } else {
        toast.error(res.message || "Gagal menyimpan sertifikasi");
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
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-xs shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-left space-y-0.5">
              <DialogTitle className="text-lg font-bold text-foreground text-left">
                {isEditing
                  ? "Edit Sertifikasi"
                  : "Tambah Sertifikasi & Lisensi"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-left">
                Tambahkan lisensi kompetensi, issuer logo dari Media Library,
                dan link verifikasi kredensial
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
            {/* Name & Issuer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  Nama Sertifikasi <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: AWS Certified Solutions Architect"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearFieldError("name");
                  }}
                  error={errors.name}
                  className="h-10 text-sm"
                />
                <FormError message={errors.name} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-primary" />
                  Lembaga Penerbit (Issuer) <FormRequiredMark />
                </Label>
                <Input
                  placeholder="Contoh: Amazon Web Services / Google Cloud"
                  value={issuer}
                  onChange={(e) => {
                    setIssuer(e.target.value);
                    clearFieldError("issuer");
                  }}
                  error={errors.issuer}
                  className="h-10 text-sm"
                />
                <FormError message={errors.issuer} />
              </div>
            </div>

            {/* Logo Picker */}
            <LogoPickerField
              label="Logo Lembaga Penerbit / Badge Sertifikat"
              description="Pilih logo issuer atau badge sertifikat dari Media Library"
              value={issuerLogoUrl}
              onChange={setIssuerLogoUrl}
              placeholderText="Pilih logo issuer dari Media Library"
            />

            {/* Dates & Validity */}
            <div className="p-4 rounded-xl border border-border bg-card/60 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Masa Berlaku Sertifikasi
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Tanggal penerbitan dan masa kedaluwarsa
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="neverExpires"
                    className="text-xs cursor-pointer select-none text-muted-foreground font-normal"
                  >
                    Berlaku Seumur Hidup
                  </Label>
                  <Switch
                    id="neverExpires"
                    checked={neverExpires}
                    onCheckedChange={(checked) => {
                      setNeverExpires(checked);
                      if (checked) {
                        setExpirationDate("");
                        clearFieldError("expirationDate");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Tanggal Terbit <FormRequiredMark />
                  </Label>
                  <Input
                    type="date"
                    value={issueDate}
                    onChange={(e) => {
                      setIssueDate(e.target.value);
                      clearFieldError("issueDate");
                    }}
                    error={errors.issueDate}
                    className="h-9 text-xs"
                  />
                  <FormError message={errors.issueDate} />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground">
                    Tanggal Kadaluarsa {!neverExpires && <FormRequiredMark />}
                  </Label>
                  <Input
                    type="date"
                    value={expirationDate}
                    onChange={(e) => {
                      setExpirationDate(e.target.value);
                      clearFieldError("expirationDate");
                    }}
                    disabled={neverExpires}
                    error={errors.expirationDate}
                    placeholder={neverExpires ? "Tidak Ada" : ""}
                    className="h-9 text-xs disabled:opacity-50 disabled:bg-muted"
                  />
                  <FormError message={errors.expirationDate} />
                </div>
              </div>
            </div>

            {/* Credential ID & URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                  Credential ID
                </Label>
                <Input
                  placeholder="Contoh: AWS-PSA-9823412"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="h-10 text-sm font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  Credential URL (Link Verifikasi)
                </Label>
                <Input
                  type="url"
                  placeholder="https://www.credly.com/badges/..."
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  className="h-10 text-sm"
                />
              </div>
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
                  {isEditing ? "Simpan Perubahan" : "Tambah Sertifikasi"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
