import * as React from "react";
import Image from "next/image";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  CheckCircle,
} from "lucide-react";
import type { Certification } from "@growthcoder/types";
import { resolveMediaUrl } from "@/lib/api";

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({
  certifications = [],
}: CertificationsSectionProps) {
  if (!certifications || certifications.length === 0) {
    return null;
  }

  const formatCertDate = (dStr: string) => {
    try {
      const d = new Date(dStr);
      return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
    } catch {
      return dStr;
    }
  };

  return (
    <section className="py-14 md:py-20 border-b border-border/60 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section Header */}
        <div className="space-y-2 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Kredensial &amp; Kompetensi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Sertifikasi &amp; Lisensi Profesional
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Bukti kompetensi terverifikasi dari penyedia cloud, arsitektur
            software, dan standar metodologi industri global.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {certifications.map((cert) => {
            const logoSrc = cert.issuerLogoUrl
              ? resolveMediaUrl(cert.issuerLogoUrl)
              : null;
            const issueFormatted = formatCertDate(cert.issueDate);
            const expFormatted = cert.expirationDate
              ? formatCertDate(cert.expirationDate)
              : null;

            return (
              <div
                key={cert.id}
                className="group relative rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 backdrop-blur-md shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar: Issuer Logo/Badge & Verified Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {logoSrc ? (
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-border/60 bg-muted shrink-0 shadow-2xs">
                          <Image
                            src={logoSrc}
                            alt={cert.issuer}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {cert.issuer}
                        </span>
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                          <CheckCircle className="w-3 h-3" />
                          <span>Terverifikasi</span>
                        </div>
                      </div>
                    </div>

                    {cert.credentialId && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/60 shrink-0">
                        ID: {cert.credentialId}
                      </span>
                    )}
                  </div>

                  {/* Cert Title */}
                  <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {cert.name}
                  </h3>
                </div>

                {/* Bottom Footer: Dates & Verification Link */}
                <div className="pt-4 mt-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      Terbit {issueFormatted}
                      {expFormatted
                        ? ` • Berlaku s/d ${expFormatted}`
                        : " • Tanpa Kedaluwarsa"}
                    </span>
                  </div>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <span>Lihat Kredensial</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
