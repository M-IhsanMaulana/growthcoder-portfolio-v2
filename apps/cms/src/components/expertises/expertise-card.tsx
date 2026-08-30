"use client";

import React from "react";
import {
  Cpu,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  MoreVertical,
  CheckCircle2,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import type { Expertise } from "@growthcoder/types";

interface ExpertiseCardProps {
  expertise: Expertise;
  onEdit: (expertise: Expertise) => void;
  onDelete: (expertise: Expertise) => void;
}

export function ExpertiseCard({
  expertise,
  onEdit,
  onDelete,
}: ExpertiseCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Top Header: Icon + Order + Action */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center p-2.5 shrink-0 text-primary transition-transform group-hover:scale-105 shadow-2xs">
            {expertise.iconSvg ? (
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
                dangerouslySetInnerHTML={{ __html: expertise.iconSvg }}
              />
            ) : (
              <Cpu className="w-6 h-6 text-primary" />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              Order #{expertise.order}
            </span>

            {/* Dropdown Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => onEdit(expertise)}
                  className="cursor-pointer text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  Edit Keahlian
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(expertise)}
                  className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Hapus Keahlian
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Subtitle / Role Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-[11px] font-semibold">
          <Sparkles className="w-3 h-3 shrink-0" />
          <span>{expertise.subtitle}</span>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {expertise.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {expertise.description}
        </p>

        {/* Connected Tech Stacks */}
        {expertise.techStacks && expertise.techStacks.length > 0 && (
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-muted-foreground/80 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Teknologi & Tools:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {expertise.techStacks.map((stack) => (
                <span
                  key={stack.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-muted/70 border border-border text-[11px] font-medium text-foreground"
                >
                  {stack.iconSvg ? (
                    <span
                      className="w-3.5 h-3.5 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
                    />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                  <span>{stack.name}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-medium">
          {expertise.isFeatured ? (
            <span className="text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Tampil di Beranda
            </span>
          ) : (
            <span className="text-muted-foreground">Disembunyikan</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(expertise)}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(expertise)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
