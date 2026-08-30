"use client";

import React from "react";
import {
  GitBranch,
  Edit2,
  Trash2,
  Check,
  MoreVertical,
  Search,
  PenTool,
  Code2,
  Rocket,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
} from "@growthcoder/ui";
import type { WorkflowStep } from "@growthcoder/types";

interface WorkflowCardProps {
  step: WorkflowStep;
  onEdit: (step: WorkflowStep) => void;
  onDelete: (step: WorkflowStep) => void;
  onToggleActive?: (step: WorkflowStep) => void;
}

function getWorkflowIcon(iconName?: string | null) {
  switch (iconName) {
    case "Search":
      return <Search className="w-5 h-5" />;
    case "PenTool":
      return <PenTool className="w-5 h-5" />;
    case "Code2":
      return <Code2 className="w-5 h-5" />;
    case "Rocket":
      return <Rocket className="w-5 h-5" />;
    case "Layers":
      return <Layers className="w-5 h-5" />;
    case "Sparkles":
      return <Sparkles className="w-5 h-5" />;
    default:
      return <GitBranch className="w-5 h-5" />;
  }
}

export function WorkflowCard({
  step,
  onEdit,
  onDelete,
  onToggleActive,
}: WorkflowCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all duration-300 ${
        step.isActive
          ? "border-border/80 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          : "border-dashed border-border/60 opacity-60 bg-muted/20"
      }`}
    >
      {/* Top Section */}
      <div className="space-y-4">
        {/* Header: Step Number, Icon, & Action */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 text-primary dark:text-emerald-400 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              {getWorkflowIcon(step.iconSvg)}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-emerald-400 font-mono">
                Tahap {step.stepNumber}
              </span>
              <div className="text-xs font-semibold text-muted-foreground truncate max-w-[180px]">
                {step.shortTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Badge
              variant={step.isActive ? "default" : "secondary"}
              className={`text-[10px] py-0.5 px-2 ${
                step.isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {step.isActive ? "Aktif" : "Draft"}
            </Badge>

            {/* Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={() => onEdit(step)}
                  className="cursor-pointer text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  Edit Tahapan
                </DropdownMenuItem>
                {onToggleActive && (
                  <DropdownMenuItem
                    onClick={() => onToggleActive(step)}
                    className="cursor-pointer text-xs"
                  >
                    <Check className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                    {step.isActive ? "Jadikan Nonaktif" : "Aktifkan Tahap"}
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(step)}
                  className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Hapus Tahapan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
            {step.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Activities List */}
        {step.activities && step.activities.length > 0 && (
          <div className="pt-2 border-t border-border/50 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Aktivitas ({step.activities.length}):
            </span>
            <ul className="space-y-1.5">
              {step.activities.map((act, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-xs text-foreground/90"
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                  <span className="leading-tight">{act}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Info & Action */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-mono text-[11px]">Order #{step.order}</span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(step)}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onDelete(step)}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
