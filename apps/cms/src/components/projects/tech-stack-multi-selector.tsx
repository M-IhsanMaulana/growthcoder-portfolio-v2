"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Check,
  X,
  Layers,
  Sparkles,
  ChevronDown,
  Plus,
} from "lucide-react";
import { Badge, Input, Button } from "@growthcoder/ui";
import type { TechStack, TechCategory } from "@growthcoder/types";

interface TechStackMultiSelectorProps {
  availableStacks: TechStack[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

const CATEGORY_NAMES: Record<TechCategory, string> = {
  frontend: "Frontend & UI",
  backend: "Backend & API",
  database: "Database & Cache",
  devops: "DevOps & Cloud",
  tools: "Dev Tools",
};

export function TechStackMultiSelector({
  availableStacks,
  selectedIds,
  onChange,
}: TechStackMultiSelectorProps) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<TechCategory | "all">(
    "all",
  );

  // Selected stack objects
  const selectedStacks = useMemo(() => {
    return availableStacks.filter((s) => selectedIds.includes(s.id));
  }, [availableStacks, selectedIds]);

  // Filtered available stacks
  const filteredStacks = useMemo(() => {
    return availableStacks.filter((s) => {
      const matchCat =
        activeCategory === "all" || s.category === activeCategory;
      const matchSearch =
        !search.trim() ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.slug.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [availableStacks, activeCategory, search]);

  const toggleStack = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const removeStack = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedIds.filter((x) => x !== id));
  };

  return (
    <div className="space-y-2.5">
      {/* Selected Items Chips / Badges Container */}
      <div className="p-2.5 rounded-xl border border-border bg-card min-h-[46px] flex flex-wrap items-center gap-1.5">
        {selectedStacks.length === 0 ? (
          <span className="text-xs text-muted-foreground italic px-1">
            Belum ada teknologi yang dipilih untuk proyek ini...
          </span>
        ) : (
          selectedStacks.map((stack) => (
            <span
              key={stack.id}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 shadow-2xs group transition-all"
            >
              {stack.iconSvg && (
                <span
                  className="w-3.5 h-3.5 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
                  dangerouslySetInnerHTML={{ __html: stack.iconSvg }}
                />
              )}
              <span>{stack.name}</span>
              <button
                type="button"
                onClick={(e) => removeStack(stack.id, e)}
                className="w-3.5 h-3.5 rounded-full hover:bg-destructive/20 hover:text-destructive text-muted-foreground flex items-center justify-center transition-colors"
                title={`Hapus ${stack.name}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Dropdown / Selector Trigger Button */}
      <div className="relative">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between h-9 text-xs font-medium"
        >
          <span className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Pilih Tech Stacks ({selectedIds.length} Terpilih)</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-30 mt-1.5 p-3 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-xl space-y-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari framework, database, tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-8 text-xs bg-muted/40"
                autoFocus
              />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                type="button"
                onClick={() => setActiveCategory("all")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  activeCategory === "all"
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Semua
              </button>
              {(
                [
                  "frontend",
                  "backend",
                  "database",
                  "devops",
                  "tools",
                ] as TechCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {CATEGORY_NAMES[cat]}
                </button>
              ))}
            </div>

            {/* Stacks Options Grid */}
            <div className="max-h-48 overflow-y-auto space-y-1 p-1 scrollbar-thin">
              {filteredStacks.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  Tidak ada teknologi yang cocok dengan pencarian.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {filteredStacks.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleStack(item.id)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs transition-all border text-left ${
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-medium"
                            : "border-border/40 hover:border-border hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-md bg-muted/60 p-0.5 flex items-center justify-center shrink-0">
                            {item.iconSvg ? (
                              <div
                                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
                                dangerouslySetInnerHTML={{
                                  __html: item.iconSvg,
                                }}
                              />
                            ) : (
                              <Layers className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                          <span className="truncate">{item.name}</span>
                        </div>

                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                            isSelected
                              ? "bg-emerald-500 border-emerald-500 text-white"
                              : "border-muted-foreground/30 bg-card"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer helper */}
            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-[11px] text-muted-foreground">
              <span>{selectedIds.length} dipilih</span>
              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onChange([])}
                    className="hover:text-destructive transition-colors"
                  >
                    Reset Pilihan
                  </button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="h-6 text-[11px] px-2"
                >
                  Selesai
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
