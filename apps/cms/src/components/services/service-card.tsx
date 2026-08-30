"use client";

import React from "react";
import {
  Sparkles,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowUpRight,
  MoreVertical,
} from "lucide-react";
import {
  Button,
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import type { Service } from "@growthcoder/types";

interface ServiceCardProps {
  service: Service;
  onEdit: (service: Service) => void;
  onDelete: (service: Service) => void;
  onToggleFeatured: (service: Service) => void;
}

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onToggleFeatured,
}: ServiceCardProps) {
  const deliverables = service.deliverables || [];
  const visibleDeliverables = deliverables.slice(0, 3);
  const remainingDeliverables = deliverables.length - 3;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Top Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          {/* Icon Container */}
          <div className="relative w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center p-2.5 shrink-0 transition-transform group-hover:scale-105 shadow-2xs">
            {service.iconSvg ? (
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
                dangerouslySetInnerHTML={{ __html: service.iconSvg }}
              />
            ) : (
              <Sparkles className="w-5 h-5 text-primary" />
            )}
          </div>

          {/* Badges & Actions */}
          <div className="flex items-center gap-1.5">
            {service.isFeatured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Featured
              </span>
            )}
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
              #{service.order}
            </span>

            {/* Action Dropdown */}
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
                  onClick={() => onEdit(service)}
                  className="cursor-pointer text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5 mr-2 text-blue-500" />
                  Edit Layanan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onToggleFeatured(service)}
                  className="cursor-pointer text-xs"
                >
                  <Star
                    className={`w-3.5 h-3.5 mr-2 ${
                      service.isFeatured
                        ? "text-amber-500 fill-amber-500"
                        : "text-muted-foreground"
                    }`}
                  />
                  {service.isFeatured ? "Hapus Featured" : "Jadikan Featured"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(service)}
                  className="cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Hapus Layanan
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Title & Slug */}
        <div>
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {service.title}
          </h3>
          <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
            /{service.slug}
          </p>
        </div>

        {/* Short Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Deliverables Preview Chips */}
        {deliverables.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              Key Deliverables:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {visibleDeliverables.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md bg-muted/60 text-foreground border border-border/60"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                  <span className="truncate max-w-[150px]">{item}</span>
                </span>
              ))}
              {remainingDeliverables > 0 && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-medium">
                  +{remainingDeliverables} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info & Quick Actions */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-primary" />
            {service.faqs?.length || 0} FAQs
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onEdit(service)}
            className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <Edit2 className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onToggleFeatured(service)}
            className={`h-7 px-2 text-xs ${
              service.isFeatured
                ? "text-amber-500 hover:text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Toggle Featured"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                service.isFeatured ? "fill-amber-500" : ""
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
