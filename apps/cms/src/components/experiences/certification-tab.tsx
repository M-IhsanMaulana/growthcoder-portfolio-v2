"use client";

import React from "react";
import {
  Award,
  Building,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";
import { Button, Badge } from "@growthcoder/ui";
import { resolveMediaUrl } from "@/lib/api-client";
import type { Certification } from "@growthcoder/types";

interface CertificationTabProps {
  certifications: Certification[];
  isLoading: boolean;
  onEdit: (item: Certification) => void;
  onDelete: (item: Certification) => void;
  onOpenCreate: () => void;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function isExpired(expirationDateStr?: string | null): boolean {
  if (!expirationDateStr) return false;
  return new Date(expirationDateStr) < new Date();
}

export function CertificationTab({
  certifications,
  isLoading,
  onEdit,
  onDelete,
  onOpenCreate,
}: CertificationTabProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border bg-card/60 animate-pulse flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (certifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Award className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Belum ada Sertifikasi
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
          Tambahkan sertifikasi keahlian, lisensi profesional, atau sertifikat
          kompetensi terverifikasi Anda.
        </p>
        <Button
          onClick={onOpenCreate}
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          Tambah Sertifikasi Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {certifications.map((cert, index) => {
        const expired = isExpired(cert.expirationDate);

        return (
          <div
            key={cert.id}
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              {/* Header Info */}
              <div className="flex items-start gap-4">
                {/* Issuer Logo */}
                <div className="w-12 h-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                  {cert.issuerLogoUrl ? (
                    cert.issuerLogoUrl.startsWith("<svg") ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                        dangerouslySetInnerHTML={{ __html: cert.issuerLogoUrl }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(cert.issuerLogoUrl)}
                        alt={cert.issuer}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    )
                  ) : (
                    <Award className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-semibold text-foreground tracking-tight line-clamp-2">
                      {cert.name}
                    </h4>

                    {expired ? (
                      <Badge
                        variant="destructive"
                        className="text-[10px] px-2 py-0.5 shrink-0"
                      >
                        Kedaluwarsa
                      </Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shrink-0"
                      >
                        Aktif
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-primary" />
                    {cert.issuer}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      Terbit: {formatDate(cert.issueDate)}
                    </span>

                    {cert.expirationDate ? (
                      <span>Hingga: {formatDate(cert.expirationDate)}</span>
                    ) : (
                      <span className="text-foreground/70 font-medium">
                        Seumur Hidup
                      </span>
                    )}
                  </div>

                  {cert.credentialId && (
                    <p className="text-[11px] font-mono text-muted-foreground/80 flex items-center gap-1 pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      ID: {cert.credentialId}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between gap-2">
              <span className="text-[11px] text-muted-foreground/60 font-mono">
                Order: #{cert.order ?? index}
              </span>

              <div className="flex items-center gap-1.5">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 h-8 px-2.5 text-xs text-primary hover:bg-primary/10 rounded-lg transition-colors font-medium"
                    title="Buka Link Verifikasi Kredensial"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Verifikasi
                  </a>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(cert)}
                  className="h-8 px-2.5 text-xs text-foreground/80 hover:text-primary rounded-lg"
                  title="Edit Sertifikasi"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(cert)}
                  className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                  title="Hapus Sertifikasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
