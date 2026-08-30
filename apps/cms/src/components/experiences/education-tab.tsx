"use client";

import React, { useState } from "react";
import {
  GraduationCap,
  Building,
  Calendar,
  Award,
  BookOpen,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import { Button, Badge } from "@growthcoder/ui";
import { resolveMediaUrl } from "@/lib/api-client";
import type { Education } from "@growthcoder/types";

interface EducationTabProps {
  educations: Education[];
  isLoading: boolean;
  onEdit: (item: Education) => void;
  onDelete: (item: Education) => void;
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

export function EducationTab({
  educations,
  isLoading,
  onEdit,
  onDelete,
  onOpenCreate,
}: EducationTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
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
          </div>
        ))}
      </div>
    );
  }

  if (educations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <GraduationCap className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          Belum ada Riwayat Pendidikan
        </h3>
        <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
          Catat riwayat pendidikan tinggi, gelar, program studi, dan penghargaan
          akademis Anda.
        </p>
        <Button
          onClick={onOpenCreate}
          size="sm"
          className="gap-1.5 bg-primary text-primary-foreground"
        >
          <Plus className="w-4 h-4" />
          Tambah Pendidikan Pertama
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {educations.map((edu, index) => {
        const isExpanded = expandedId === edu.id;

        return (
          <div
            key={edu.id}
            className="group p-5 rounded-2xl border border-border/80 bg-card hover:border-primary/40 hover:shadow-xs transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left Info: Logo & Details */}
              <div className="flex items-start gap-4 min-w-0 flex-1">
                {/* Institution Logo / Placeholder */}
                <div className="w-12 h-12 rounded-xl border border-border bg-muted/40 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-2xs group-hover:scale-105 transition-transform">
                  {edu.institutionLogoUrl ? (
                    edu.institutionLogoUrl.startsWith("<svg") ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                        dangerouslySetInnerHTML={{
                          __html: edu.institutionLogoUrl,
                        }}
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(edu.institutionLogoUrl)}
                        alt={edu.institution}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    )
                  ) : (
                    <Building className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>

                {/* Institution & Degree Details */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-base font-semibold text-foreground tracking-tight">
                      {edu.degree}
                    </h4>
                    <span className="text-muted-foreground font-medium text-sm">
                      •
                    </span>
                    <span className="text-sm font-medium text-foreground/90">
                      {edu.fieldOfStudy}
                    </span>

                    {edu.isCurrent ? (
                      <Badge
                        variant="default"
                        className="text-[10px] px-2 py-0.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      >
                        Sedang Studi
                      </Badge>
                    ) : null}

                    {edu.grade && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-medium px-2 py-0.5 bg-primary/5 text-primary border-primary/20"
                      >
                        {edu.grade}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-primary" />
                    {edu.institution}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-0.5">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      {formatDate(edu.startDate)} –{" "}
                      {edu.isCurrent ? "Saat Ini" : formatDate(edu.endDate)}
                    </span>

                    <span className="text-[11px] text-muted-foreground/60 font-mono">
                      Order: #{edu.order ?? index}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(edu)}
                  className="h-8 px-2.5 text-xs text-foreground/80 hover:text-primary rounded-lg"
                  title="Edit Pendidikan"
                >
                  <Pencil className="w-3.5 h-3.5 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(edu)}
                  className="h-8 px-2.5 text-xs text-destructive hover:bg-destructive/10 rounded-lg"
                  title="Hapus Pendidikan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>

            {/* Description Preview / Expand */}
            {edu.description && (
              <div className="mt-3.5 pt-3 border-t border-border/60">
                <div
                  className={`text-xs text-muted-foreground prose prose-xs dark:prose-invert max-w-none transition-all duration-200 ${
                    isExpanded ? "" : "line-clamp-2"
                  }`}
                  dangerouslySetInnerHTML={{ __html: edu.description }}
                />
                {edu.description.length > 120 && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(edu.id)}
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
