"use client";

import React from "react";
import {
  Lightbulb,
  Edit2,
  Trash2,
  Sparkles,
  Quote,
  MoreVertical,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import type { DevelopmentPhilosophy } from "@growthcoder/types";

interface PhilosophyCardProps {
  philosophy: DevelopmentPhilosophy;
  onEdit: (philosophy: DevelopmentPhilosophy) => void;
  onDelete: (philosophy: DevelopmentPhilosophy) => void;
}

export function PhilosophyCard({
  philosophy,
  onEdit,
  onDelete,
}: PhilosophyCardProps) {
  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 transition-all duration-300 hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/5">
      {/* Top Section */}
      <div className="space-y-4">
        {/* Top Header: Icon + Order + Action */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center p-2.5 shrink-0 text-amber-500 transition-transform group-hover:scale-105 shadow-2xs">
            {philosophy.iconSvg ? (
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
                dangerouslySetInnerHTML={{ __html: philosophy.iconSvg }}
              />
            ) : (
              <Lightbulb className="w-6 h-6 text-amber-500" />
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              Order #{philosophy.order}
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
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => onEdit(philosophy)}
                  className="cursor-pointer text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  Edit Filosofi
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(philosophy)}
                  className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Hapus Filosofi
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-base font-bold text-foreground group-hover:text-amber-500 transition-colors">
            {philosophy.title}
          </h3>
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-medium">
            <Quote className="w-3 h-3 shrink-0 opacity-70" />
            <span className="italic">{philosophy.tagline}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed">
          {philosophy.description}
        </p>
      </div>

      {/* Footer Action */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-end">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(philosophy)}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(philosophy)}
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
