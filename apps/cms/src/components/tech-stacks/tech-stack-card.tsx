"use client";

import React from "react";
import {
  Star,
  Edit2,
  Trash2,
  Layers,
  MoreVertical,
  Sliders,
} from "lucide-react";
import {
  Card,
  Badge,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@growthcoder/ui";
import type { TechStack, TechCategory } from "@growthcoder/types";

interface TechStackCardProps {
  item: TechStack;
  onEdit: (item: TechStack) => void;
  onDelete: (item: TechStack) => void;
  onToggleFeatured?: (item: TechStack) => void;
}

const CATEGORY_META: Record<
  TechCategory,
  { label: string; bgClass: string; textClass: string; borderClass: string }
> = {
  frontend: {
    label: "Frontend",
    bgClass: "bg-cyan-500/10 dark:bg-cyan-500/20",
    textClass: "text-cyan-600 dark:text-cyan-400",
    borderClass: "border-cyan-500/30",
  },
  backend: {
    label: "Backend",
    bgClass: "bg-emerald-500/10 dark:bg-emerald-500/20",
    textClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-500/30",
  },
  database: {
    label: "Database",
    bgClass: "bg-amber-500/10 dark:bg-amber-500/20",
    textClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-500/30",
  },
  devops: {
    label: "DevOps & Cloud",
    bgClass: "bg-purple-500/10 dark:bg-purple-500/20",
    textClass: "text-purple-600 dark:text-purple-400",
    borderClass: "border-purple-500/30",
  },
  tools: {
    label: "Tools",
    bgClass: "bg-pink-500/10 dark:bg-pink-500/20",
    textClass: "text-pink-600 dark:text-pink-400",
    borderClass: "border-pink-500/30",
  },
};

export function TechStackCard({
  item,
  onEdit,
  onDelete,
  onToggleFeatured,
}: TechStackCardProps) {
  const cat = CATEGORY_META[item.category] || CATEGORY_META.tools;

  return (
    <Card className="relative overflow-hidden group hover:border-emerald-500/40 hover:shadow-md transition-all duration-300 bg-card/80 backdrop-blur-sm flex flex-col justify-between p-4">
      {/* Top Row: Category Badge & Dropdown Actions */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${cat.bgClass} ${cat.textClass} ${cat.borderClass}`}
        >
          {cat.label}
        </span>

        <div className="flex items-center gap-1">
          {item.isFeatured && (
            <span
              className="p-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20"
              title="Featured Tech Stack"
            >
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </span>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => onEdit(item)}
                className="cursor-pointer"
              >
                <Edit2 className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Edit</span>
              </DropdownMenuItem>
              {onToggleFeatured && (
                <DropdownMenuItem
                  onClick={() => onToggleFeatured(item)}
                  className="cursor-pointer"
                >
                  <Star className="w-4 h-4 mr-2 text-amber-500" />
                  <span>
                    {item.isFeatured ? "Hapus Featured" : "Jadikan Featured"}
                  </span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(item)}
                className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span>Hapus</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Middle Row: Icon & Name */}
      <div className="flex items-center gap-3.5 my-3.5">
        <div className="w-12 h-12 rounded-xl border border-border/80 bg-muted/40 p-2 shrink-0 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-2xs">
          {item.iconSvg ? (
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
              dangerouslySetInnerHTML={{ __html: item.iconSvg }}
            />
          ) : (
            <Layers className="w-6 h-6 text-muted-foreground/50" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {item.name}
          </h4>
          <p className="text-[11px] text-muted-foreground font-mono truncate">
            {item.slug}
          </p>
        </div>
      </div>

      {/* Bottom Row: Proficiency Level or Order Info */}
      <div className="pt-2 border-t border-border/50">
        {item.level !== null && item.level !== undefined ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">Proficiency</span>
              <span className="font-medium text-foreground">{item.level}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, item.level))}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Order Priority</span>
            <span className="font-mono">#{item.order || 0}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
