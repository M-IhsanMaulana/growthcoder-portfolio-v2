"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@growthcoder/ui";
import {
  Briefcase,
  Calendar,
  MapPin,
  ArrowRight,
  Layers,
  Terminal,
  Cpu,
  Database,
} from "lucide-react";
import type { Experience } from "@growthcoder/types";
import { resolveMediaUrl } from "@/lib/api";

interface CareerSnapshotProps {
  experiences: Experience[];
}

// Brand gradient palette for company fallback avatars
const AVATAR_GRADIENTS = [
  "from-emerald-500/20 via-teal-500/20 to-cyan-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "from-teal-500/20 via-emerald-500/20 to-green-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "from-cyan-500/20 via-teal-500/20 to-emerald-500/20 text-teal-600 dark:text-teal-400 border-teal-500/30",
  "from-emerald-500/20 via-green-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
];

function getCompanyInitials(name: string): string {
  if (!name) return "CO";
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return (words[0][0] + words[1][0]).toUpperCase();
}

function getAvatarGradient(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
}

function formatPeriod(
  startDate: string,
  endDate?: string,
  isCurrent?: boolean,
) {
  const start = new Date(startDate).getFullYear();
  if (isCurrent || !endDate) {
    return `${start} — Sekarang`;
  }
  const end = new Date(endDate).getFullYear();
  return start === end ? `${start}` : `${start} — ${end}`;
}

function getPeriodSublabel(isCurrent?: boolean, endDate?: string): string {
  if (isCurrent || !endDate) {
    return "Present";
  }
  return "Completed";
}

function formatEmploymentType(type?: string): string | null {
  if (!type) return null;
  const map: Record<string, string> = {
    "full-time": "Full-time",
    "part-time": "Part-time",
    contract: "Contract",
    freelance: "Freelance",
  };
  return map[type.toLowerCase()] || type;
}

// Clean HTML tags for rendering description excerpts gracefully
function cleanDescription(htmlOrText: string): string {
  if (!htmlOrText) return "";
  return htmlOrText
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Tech Icon / Badge Mini Identifier
function TechStackPill({ name }: { name: string }) {
  const lower = name.toLowerCase();

  let prefixBadge = null;
  if (lower.includes("typescript") || lower.includes("ts")) {
    prefixBadge = (
      <span className="h-4 w-4 rounded-xs bg-[#3178C6] text-white flex items-center justify-center text-[9px] font-bold">
        TS
      </span>
    );
  } else if (lower.includes("next")) {
    prefixBadge = (
      <span className="h-4 w-4 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[9px] font-black">
        N
      </span>
    );
  } else if (lower.includes("adonis")) {
    prefixBadge = (
      <span className="h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center text-[8px] font-bold">
        ▲
      </span>
    );
  } else if (
    lower.includes("postgres") ||
    lower.includes("sql") ||
    lower.includes("database")
  ) {
    prefixBadge = (
      <Database className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
    );
  } else if (lower.includes("react")) {
    prefixBadge = <Cpu className="h-3.5 w-3.5 text-cyan-500" />;
  } else if (lower.includes("docker") || lower.includes("linux")) {
    prefixBadge = <Terminal className="h-3.5 w-3.5 text-blue-500" />;
  } else {
    prefixBadge = <Layers className="h-3.5 w-3.5 text-primary" />;
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-muted/60 dark:bg-muted/40 hover:bg-primary/10 hover:text-primary text-foreground/90 border border-border/60 transition-colors duration-200">
      {prefixBadge}
      <span>{name}</span>
    </span>
  );
}

function CompanyLogoBox({
  logoUrl,
  companyName,
}: {
  logoUrl?: string;
  companyName: string;
}) {
  const [imageError, setImageError] = useState(false);
  const resolvedSrc = logoUrl ? resolveMediaUrl(logoUrl) : null;
  const isSvgString = logoUrl?.trim().startsWith("<svg");
  const gradientClass = getAvatarGradient(companyName);
  const initials = getCompanyInitials(companyName);

  if (isSvgString && logoUrl) {
    return (
      <div
        className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-card dark:bg-card/95 border-2 border-primary/25 dark:border-primary/40 p-2.5 shadow-md shrink-0 flex items-center justify-center text-primary dark:text-emerald-400 group-hover:border-primary group-hover:shadow-lg transition-all duration-300 [&>svg]:w-full [&>svg]:h-full"
        dangerouslySetInnerHTML={{ __html: logoUrl }}
      />
    );
  }

  if (resolvedSrc && !imageError) {
    return (
      <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-card dark:bg-card/95 border-2 border-primary/25 dark:border-primary/40 p-2 shadow-md shrink-0 flex items-center justify-center group-hover:border-primary group-hover:shadow-lg transition-all duration-300 overflow-hidden">
        <Image
          src={resolvedSrc}
          alt={companyName}
          fill
          sizes="56px"
          className="object-contain p-1.5"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback initial avatar with curated brand gradient
  return (
    <div
      className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br ${gradientClass} border-2 flex items-center justify-center font-heading font-bold text-sm sm:text-base tracking-wider shrink-0 shadow-md transition-all duration-300 group-hover:scale-105 group-hover:border-primary`}
      title={companyName}
    >
      <span>{initials}</span>
    </div>
  );
}

export function CareerSnapshot({ experiences }: CareerSnapshotProps) {
  const topExperiences = experiences.slice(0, 3);

  if (topExperiences.length === 0) {
    return null;
  }

  return (
    <section className="relative py-20 sm:py-28 border-t border-border/40 overflow-hidden bg-background/50">
      {/* Subtle Background Glow with Brand Tone */}
      <div className="absolute top-1/3 left-0 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 sm:mb-20 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-3.5 backdrop-blur-sm">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Pengalaman Kerja</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground">
              Rekam Jejak Karir
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-2xl leading-relaxed">
              Pengalaman dalam mengembangkan aplikasi web modern, merancang
              arsitektur backend &amp; frontend, serta membangun produk digital
              yang andal.
            </p>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-full px-6 py-5 border-border/80 hover:border-primary/50 hover:bg-primary/5 text-xs sm:text-sm font-semibold shrink-0 gap-2 self-start md:self-auto shadow-xs transition-all duration-300"
          >
            <Link href="/about">
              <span>Riwayat Lengkap &amp; Sertifikasi</span>
              <ArrowRight className="h-4 w-4 text-primary" />
            </Link>
          </Button>
        </div>

        {/* Timeline List */}
        <div className="relative">
          {/* Vertical Timeline Guide Line (Desktop & Tablet) */}
          <div className="hidden md:block absolute left-[145px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-emerald-500/40 via-border/60 to-border/30" />

          <div className="space-y-8 sm:space-y-12">
            {topExperiences.map((exp, idx) => {
              const formattedPeriod = formatPeriod(
                exp.startDate,
                exp.endDate,
                exp.isCurrent,
              );
              const sublabel = getPeriodSublabel(exp.isCurrent, exp.endDate);
              const employmentType = formatEmploymentType(exp.employmentType);
              const cleanedDesc = cleanDescription(exp.description);

              return (
                <motion.div
                  key={exp.id || exp.company}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: idx * 0.12 }}
                  className="relative flex flex-col md:flex-row md:items-start group"
                >
                  {/* Left Column: Date & Present Label (Desktop) */}
                  <div className="hidden md:flex flex-col items-end justify-center w-[125px] pr-5 pt-8 shrink-0 text-right">
                    <span
                      className={`text-sm font-bold font-heading ${exp.isCurrent ? "text-primary dark:text-emerald-400" : "text-foreground/90"}`}
                    >
                      {formattedPeriod}
                    </span>
                    <span
                      className={`text-xs font-medium mt-0.5 ${exp.isCurrent ? "text-primary/80 dark:text-emerald-400/80 font-semibold" : "text-muted-foreground"}`}
                    >
                      {sublabel}
                    </span>
                  </div>

                  {/* Concentric Circle Timeline Node with Green Pulse (Desktop) */}
                  <div className="hidden md:flex absolute left-[145px] top-8 -translate-x-1/2 items-center justify-center z-10">
                    <div className="relative flex items-center justify-center">
                      {exp.isCurrent ? (
                        <>
                          <span className="absolute -inset-1.5 rounded-full bg-emerald-500/35 animate-ping pointer-events-none" />
                          <div className="h-7 w-7 rounded-full bg-emerald-500/15 dark:bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                            <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500" />
                          </div>
                        </>
                      ) : (
                        <div className="h-7 w-7 rounded-full bg-card dark:bg-card border-2 border-border/80 flex items-center justify-center shadow-xs group-hover:border-emerald-500/60 group-hover:scale-110 transition-all duration-300">
                          <div className="h-3 w-3 rounded-full bg-muted-foreground/50 group-hover:bg-emerald-500 transition-colors duration-300" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Experience Card Container (Clean, Spacious & Elegant) */}
                  <div className="flex-1 md:ml-10 rounded-3xl border border-border/70 dark:border-border/50 bg-card/85 dark:bg-card/45 backdrop-blur-xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300">
                    {/* Card Header with Inside Logo & Info */}
                    <div className="flex items-start gap-4 sm:gap-5 mb-5">
                      <CompanyLogoBox
                        logoUrl={exp.companyLogoUrl}
                        companyName={exp.company}
                      />

                      <div className="flex-1 min-w-0">
                        {/* Top Badges: Period + Location */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border ${
                                exp.isCurrent
                                  ? "bg-primary/10 text-primary dark:text-emerald-400 border-primary/25"
                                  : "bg-muted/80 text-foreground/80 border-border/60"
                              }`}
                            >
                              <Calendar className="h-3 w-3" />
                              <span>{formattedPeriod}</span>
                            </span>

                            {exp.isCurrent && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>Peran Aktif</span>
                              </span>
                            )}
                          </div>

                          {exp.location && (
                            <span className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 shrink-0">
                              <MapPin className="h-3.5 w-3.5 opacity-60" />
                              <span>{exp.location}</span>
                            </span>
                          )}
                        </div>

                        {/* Job Position */}
                        <h3 className="text-lg sm:text-2xl font-bold font-heading text-foreground tracking-tight mb-1">
                          {exp.position}
                        </h3>

                        {/* Company Name & Employment Type */}
                        <div className="flex flex-wrap items-center gap-2.5 text-sm">
                          <span className="font-semibold text-primary dark:text-emerald-400">
                            {exp.company}
                          </span>
                          {employmentType && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-muted-foreground border border-border/40">
                              {employmentType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                      {cleanedDesc}
                    </p>

                    {/* Tech Stack Pills (Icons + Text) */}
                    {exp.techStacks && exp.techStacks.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                        {exp.techStacks.map((tech) => (
                          <TechStackPill
                            key={tech.id || tech.name}
                            name={tech.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
