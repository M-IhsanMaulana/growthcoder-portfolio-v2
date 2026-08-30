"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
  Layers,
  Sparkles,
} from "lucide-react";
import { Button, Badge } from "@growthcoder/ui";
import { resolveMediaUrl } from "@/lib/api-client";
import type { Experience } from "@growthcoder/types";

interface ExperienceTabProps {
  experiences: Experience[];
  isLoading: boolean;
  onEdit: (item: Experience) => void;
  onDelete: (item: Experience) => void;
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

function calculateDuration(
  startDateStr: string,
  endDateStr?: string | null,
  isCurrent?: boolean,
): string {
  try {
    const start = new Date(startDateStr);
    const end = isCurrent || !endDateStr ? new Date() : new Date(endDateStr);

    let months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth());
    if (months < 0) months = 0;

    const years = Math.floor(months / 12);
    const remMonths = months % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} thn`);
    if (remMonths > 0 || years === 0) parts.push(`${remMonths} bln`);

    return parts.join(" ");
  } catch {
    return "";
  }
}

export function ExperienceTab({
  experiences,
  isLoading,
  onEdit,
  onDelete,
  onOpenCreate,
}: ExperienceTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-border bg-card/60 animate-pulse flex flex-col gap-3"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
            <div className="h-12 bg-muted rounded-lg w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <Briefcase className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Belum ada Pengalaman Kerja
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
          Catat riwayat karir profesional, peran, tanggung jawab, dan teknologi
          yang pernah Anda gunakan.
        </p>
        <Button
          onClick={onOpenCreate}
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          Tambah Pengalaman Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {experiences.map((exp, index) => {
        const isExpanded = expandedId === exp.id;
        const duration = calculateDuration(
          exp.startDate,
          exp.endDate,
          exp.isCurrent,
        );

        return (
          <div
            key={exp.id}
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left Info: Logo & Details */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Company Logo / Placeholder */}
                <div className="w-12 h-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                  {exp.companyLogoUrl ? (
                    exp.companyLogoUrl.startsWith("<svg") ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                        dangerouslySetInnerHTML={{ __html: exp.companyLogoUrl }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(exp.companyLogoUrl)}
                        alt={exp.company}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    )
                  ) : (
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Company & Role Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-foreground tracking-tight">
                      {exp.position}
                    </h4>
                    <span className="text-muted-foreground font-medium text-sm">
                      •
                    </span>
                    <span className="text-sm font-medium text-foreground/90">
                      {exp.company}
                    </span>

                    {exp.isCurrent ? (
                      <Badge
                        variant="default"
                        className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      >
                        Saat Ini
                      </Badge>
                    ) : null}

                    {exp.employmentType && (
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase font-semibold px-2 py-0.5"
                      >
                        {exp.employmentType}
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {formatDate(exp.startDate)} –{" "}
                      {exp.isCurrent ? "Saat Ini" : formatDate(exp.endDate)}
                      {duration && (
                        <span className="text-foreground/70">({duration})</span>
                      )}
                    </span>

                    {exp.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        {exp.location}
                      </span>
                    )}

                    <span className="text-[11px] text-muted-foreground/60 font-mono">
                      Order: #{exp.order ?? index}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(exp)}
                  className="h-8 px-2.5 text-xs text-foreground/80 hover:text-primary rounded-lg"
                  title="Edit Pengalaman"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(exp)}
                  className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                  title="Hapus Pengalaman"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Attached Tech Stacks */}
            {exp.techStacks && exp.techStacks.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-border/60 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 mr-1">
                  <Layers className="w-3 h-3 text-primary" />
                  Tech:
                </span>
                {exp.techStacks.map((stack) => (
                  <span
                    key={stack.id}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted/60 text-foreground border border-border/60"
                  >
                    {stack.iconSvg && (
                      <span
                        className="w-3 h-3 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full"
                        dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
                      />
                    )}
                    <span>{stack.name}</span>
                  </span>
                ))}
              </div>
            )}

            {/* Description Preview / Expand */}
            {exp.description && (
              <div className="mt-3">
                <div
                  className={`text-xs text-muted-foreground prose prose-xs dark:prose-invert max-w-none transition-all duration-200 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
                {exp.description.length > 120 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(exp.id)}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline mt-1.5 cursor-pointer"
                  >
                    {isExpanded ? (
                      <>
                        Sembunyikan <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        Selengkapnya <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
