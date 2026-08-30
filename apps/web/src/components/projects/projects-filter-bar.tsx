"use client";

import * as React from "react";
import {
  Search,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  Loader2,
  Code2,
  Sparkles,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@growthcoder/ui";
import type { ProjectCategory, TechStack } from "@growthcoder/types";

interface ProjectsFilterBarProps {
  categories: ProjectCategory[];
  techStacks: TechStack[];
  selectedCategory: string;
  selectedTechStacks?: string[];
  selectedTechStack?: string; // Legacy single support
  searchQuery: string;
  totalFiltered: number;
  totalProjects: number;
  onCategoryChange: (category: string) => void;
  onTechStacksChange?: (techStacks: string[]) => void;
  onTechStackChange?: (techStack: string) => void; // Legacy single support
  onSearchChange: (query: string) => void;
  onReset: () => void;
}

// Category badge color helper
const getCategoryBadgeClass = (category?: string) => {
  switch (category?.toLowerCase()) {
    case "frontend":
      return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
    case "backend":
      return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "database":
      return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "devops":
      return "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30";
    case "tools":
      return "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30";
    default:
      return "bg-muted text-muted-foreground border-border/60";
  }
};

export function ProjectsFilterBar({
  categories,
  techStacks,
  selectedCategory,
  selectedTechStacks: propSelectedTechStacks,
  selectedTechStack: propSelectedTechStack,
  searchQuery,
  totalFiltered,
  totalProjects,
  onCategoryChange,
  onTechStacksChange,
  onTechStackChange,
  onSearchChange,
  onReset,
}: ProjectsFilterBarProps) {
  // Normalize multi-select tech stacks
  const selectedTechStacks = React.useMemo(() => {
    if (propSelectedTechStacks) return propSelectedTechStacks;
    if (propSelectedTechStack && propSelectedTechStack !== "all") {
      return [propSelectedTechStack];
    }
    return [];
  }, [propSelectedTechStacks, propSelectedTechStack]);

  const handleStacksChange = React.useCallback(
    (newStacks: string[]) => {
      if (onTechStacksChange) {
        onTechStacksChange(newStacks);
      } else if (onTechStackChange) {
        onTechStackChange(
          newStacks.length === 1
            ? newStacks[0]
            : newStacks.length > 1
              ? newStacks.join(",")
              : "all",
        );
      }
    },
    [onTechStacksChange, onTechStackChange],
  );

  // Local search state for debouncing
  const [localSearch, setLocalSearch] = React.useState(searchQuery);
  const [isDebouncing, setIsDebouncing] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Tech stack dropdown state
  const [isTechDropdownOpen, setIsTechDropdownOpen] = React.useState(false);
  const [techSearch, setTechSearch] = React.useState("");
  const [highlightedIndex, setHighlightedIndex] = React.useState<number>(0);

  const techTriggerRef = React.useRef<HTMLButtonElement>(null);
  const techDropdownRef = React.useRef<HTMLDivElement>(null);
  const techSearchInputRef = React.useRef<HTMLInputElement>(null);
  const listContainerRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  // Sync local search when external searchQuery changes (e.g. on Reset)
  React.useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  // Debounce search query changes
  React.useEffect(() => {
    if (localSearch === searchQuery) {
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
      setIsDebouncing(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [localSearch, searchQuery, onSearchChange]);

  // Handle immediate search submit / enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsDebouncing(false);
      onSearchChange(localSearch);
    }
  };

  // Clear search immediately
  const handleClearSearch = () => {
    setLocalSearch("");
    setIsDebouncing(false);
    onSearchChange("");
    searchInputRef.current?.focus();
  };

  // Filtered tech stacks based on search inside dropdown
  const filteredTechStacks = React.useMemo(() => {
    if (!techSearch.trim()) return techStacks;
    const query = techSearch.toLowerCase().trim();
    return techStacks.filter(
      (tech) =>
        tech.name.toLowerCase().includes(query) ||
        tech.category.toLowerCase().includes(query) ||
        tech.slug.toLowerCase().includes(query),
    );
  }, [techStacks, techSearch]);

  // Total selectable items in dropdown: index 0 is "Semua Tech Stack", indices 1..N are filteredTechStacks
  const totalDropdownItems = filteredTechStacks.length + 1;

  // Reset highlighted index when filtered list changes or dropdown opens
  React.useEffect(() => {
    setHighlightedIndex(0);
  }, [techSearch, isTechDropdownOpen]);

  // Auto-scroll highlighted item into view
  React.useEffect(() => {
    if (isTechDropdownOpen && itemRefs.current[highlightedIndex]) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex, isTechDropdownOpen]);

  // Toggle or select a tech stack
  const toggleTechStack = React.useCallback(
    (slug: string) => {
      const isSelected = selectedTechStacks.some(
        (s) => s === slug || s.toLowerCase() === slug.toLowerCase(),
      );
      if (isSelected) {
        handleStacksChange(
          selectedTechStacks.filter(
            (s) => s !== slug && s.toLowerCase() !== slug.toLowerCase(),
          ),
        );
      } else {
        handleStacksChange([...selectedTechStacks, slug]);
      }
    },
    [selectedTechStacks, handleStacksChange],
  );

  // Close dropdown on outside click or escape
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        techDropdownRef.current &&
        !techDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTechDropdownOpen(false);
      }
    };

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (!isTechDropdownOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setIsTechDropdownOpen(false);
        techTriggerRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % totalDropdownItems);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex(
          (prev) => (prev - 1 + totalDropdownItems) % totalDropdownItems,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlightedIndex === 0) {
          handleStacksChange([]);
        } else if (filteredTechStacks[highlightedIndex - 1]) {
          const tech = filteredTechStacks[highlightedIndex - 1];
          toggleTechStack(tech.slug || tech.name);
        }
      }
    };

    if (isTechDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleGlobalKeyDown);
      // Auto focus tech search input on open
      setTimeout(() => techSearchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [
    isTechDropdownOpen,
    totalDropdownItems,
    highlightedIndex,
    filteredTechStacks,
    handleStacksChange,
    toggleTechStack,
  ]);

  // Selected tech stack labels for trigger display
  const selectedTechObjects = React.useMemo(() => {
    return selectedTechStacks
      .map((slug) =>
        techStacks.find(
          (t) =>
            t.slug === slug ||
            t.id === slug ||
            t.name.toLowerCase() === slug.toLowerCase(),
        ),
      )
      .filter((t): t is TechStack => Boolean(t));
  }, [techStacks, selectedTechStacks]);

  const isFiltered =
    selectedCategory !== "all" ||
    selectedTechStacks.length > 0 ||
    searchQuery.trim().length > 0;

  return (
    <div className="relative z-40 bg-card/80 dark:bg-card/60 backdrop-blur-2xl border border-border/80 dark:border-border/60 rounded-3xl p-4 sm:p-6 shadow-xl shadow-black/5 dark:shadow-black/20 space-y-4 sm:space-y-5 transition-all">
      {/* Top Row: Search Input & Custom Multi-Select Searchable Tech Stack Dropdown */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input with Debounce & Loading Status */}
        <div className="relative flex-1 group">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
            {isDebouncing ? (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </div>

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Cari judul proyek, masalah bisnis, atau nama klien..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-24 py-2.5 sm:py-3 rounded-2xl bg-background/90 dark:bg-background/60 border border-border/80 dark:border-border/60 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all shadow-xs"
          />

          {/* Right actions: Loading badge / Clear button */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {isDebouncing && (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded-full bg-primary/10 text-primary animate-pulse">
                Mencari...
              </span>
            )}

            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all cursor-pointer"
                title="Hapus pencarian"
                aria-label="Hapus pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Custom Searchable Multi-Select Tech Stack Dropdown Container */}
        <div className="relative sm:w-72 shrink-0 z-50" ref={techDropdownRef}>
          {/* Dropdown Trigger Button */}
          <button
            ref={techTriggerRef}
            type="button"
            onClick={() => {
              setIsTechDropdownOpen(!isTechDropdownOpen);
              setTechSearch("");
            }}
            className={`w-full py-2.5 sm:py-3 px-3.5 rounded-2xl bg-background/90 dark:bg-background/60 border text-sm text-foreground flex items-center justify-between gap-2 transition-all cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/30 ${
              isTechDropdownOpen
                ? "border-primary ring-2 ring-primary/20"
                : "border-border/80 dark:border-border/60 hover:border-border"
            }`}
            aria-haspopup="listbox"
            aria-expanded={isTechDropdownOpen}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1 text-left">
              <Code2 className="h-4 w-4 shrink-0 text-muted-foreground" />

              {selectedTechObjects.length === 0 ? (
                <span className="truncate font-medium text-xs sm:text-sm text-muted-foreground">
                  Semua Tech Stack
                </span>
              ) : selectedTechObjects.length === 1 ? (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate font-medium text-xs sm:text-sm text-foreground">
                    {selectedTechObjects[0].name}
                  </span>
                  <span
                    className={`hidden xs:inline-block text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.5 rounded-md border shrink-0 ${getCategoryBadgeClass(
                      selectedTechObjects[0].category,
                    )}`}
                  >
                    {selectedTechObjects[0].category}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="truncate font-medium text-xs sm:text-sm text-foreground">
                    {selectedTechObjects[0].name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                    +{selectedTechObjects.length - 1}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              {selectedTechStacks.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStacksChange([]);
                  }}
                  className="p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors cursor-pointer"
                  title="Hapus semua filter tech stack"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                  isTechDropdownOpen ? "rotate-180 text-primary" : ""
                }`}
              />
            </div>
          </button>

          {/* Dropdown Popover Menu */}
          <AnimatePresence>
            {isTechDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-2 w-full sm:w-84 bg-popover dark:bg-card border border-border/90 shadow-2xl rounded-2xl z-[999] p-3 overflow-hidden flex flex-col max-h-[420px] overscroll-contain ring-1 ring-black/10 dark:ring-white/10"
              >
                {/* Search Bar inside Tech Stack Dropdown */}
                <div className="relative mb-2.5 shrink-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input
                    ref={techSearchInputRef}
                    type="text"
                    placeholder="Cari teknologi (e.g. React, Docker)..."
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    className="w-full pl-8.5 pr-7 py-2 text-xs rounded-xl bg-muted/60 dark:bg-muted/40 border border-border/70 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  />
                  {techSearch && (
                    <button
                      type="button"
                      onClick={() => setTechSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>

                {/* Header status bar for Multi-select info */}
                <div className="flex items-center justify-between px-1 pb-2 text-[11px] font-medium text-muted-foreground border-b border-border/40 mb-1.5 shrink-0">
                  <span>
                    {selectedTechStacks.length === 0
                      ? "Pilih satu atau lebih teknologi"
                      : `${selectedTechStacks.length} teknologi dipilih`}
                  </span>
                  {selectedTechStacks.length > 0 && (
                    <button
                      type="button"
                      onClick={() => handleStacksChange([])}
                      className="text-primary hover:underline text-[11px] cursor-pointer font-semibold"
                    >
                      Reset pilihan
                    </button>
                  )}
                </div>

                {/* Tech Stacks Scrollable List */}
                <div
                  ref={listContainerRef}
                  data-lenis-prevent="true"
                  data-lenis-prevent-wheel="true"
                  onWheel={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                  className="overflow-y-auto space-y-1 max-h-[250px] pr-1 overscroll-contain scrollbar-thin scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40"
                >
                  {/* Option: Semua Tech Stack (Index 0) */}
                  <button
                    ref={(el) => {
                      itemRefs.current[0] = el;
                    }}
                    type="button"
                    onClick={() => {
                      handleStacksChange([]);
                    }}
                    onMouseEnter={() => setHighlightedIndex(0)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                      selectedTechStacks.length === 0
                        ? "bg-primary/15 text-primary font-semibold border border-primary/30"
                        : "text-foreground hover:bg-muted/70"
                    } ${
                      highlightedIndex === 0
                        ? "ring-1 ring-primary/40 bg-muted/80"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                      <div
                        className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                          selectedTechStacks.length === 0
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-border/80 bg-background/60"
                        }`}
                      >
                        {selectedTechStacks.length === 0 && (
                          <Check className="h-3 w-3 stroke-[3]" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 opacity-80" />
                        <span>Semua Tech Stack</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono ml-auto shrink-0">
                      ({techStacks.length})
                    </span>
                  </button>

                  <div className="my-1 border-t border-border/40" />

                  {/* List of Tech Stack Options with Checkbox & Aligned Badges (Indices 1..N) */}
                  {filteredTechStacks.length > 0 ? (
                    filteredTechStacks.map((tech, idx) => {
                      const itemIndex = idx + 1;
                      const isSelected = selectedTechStacks.some(
                        (s) =>
                          s === tech.slug ||
                          s === tech.id ||
                          s.toLowerCase() === tech.name.toLowerCase(),
                      );
                      const isHighlighted = highlightedIndex === itemIndex;

                      return (
                        <button
                          key={tech.id || tech.slug}
                          ref={(el) => {
                            itemRefs.current[itemIndex] = el;
                          }}
                          type="button"
                          onClick={() =>
                            toggleTechStack(tech.slug || tech.name)
                          }
                          onMouseEnter={() => setHighlightedIndex(itemIndex)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer group ${
                            isSelected
                              ? "bg-primary/10 text-primary font-semibold border border-primary/25"
                              : "text-foreground hover:bg-muted/70"
                          } ${
                            isHighlighted
                              ? "ring-1 ring-primary/40 bg-muted/80"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 flex-1 text-left">
                            {/* Checkbox Icon */}
                            <div
                              className={`h-4 w-4 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                                isSelected
                                  ? "bg-primary border-primary text-primary-foreground shadow-xs"
                                  : "border-border/80 bg-background/60 group-hover:border-primary/50"
                              }`}
                            >
                              {isSelected && (
                                <Check className="h-3 w-3 stroke-[3]" />
                              )}
                            </div>

                            {/* Tech Stack Name */}
                            <span className="truncate font-medium text-xs text-foreground flex-1 min-w-0">
                              {tech.name}
                            </span>

                            {/* Category Badge - Aligned cleanly on the right */}
                            <span
                              className={`ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border shrink-0 transition-colors ${getCategoryBadgeClass(
                                tech.category,
                              )}`}
                            >
                              {tech.category}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-6 px-3 text-center text-xs text-muted-foreground">
                      <p>Tidak ada teknologi yang cocok</p>
                      <button
                        type="button"
                        onClick={() => setTechSearch("")}
                        className="mt-2 text-primary hover:underline text-[11px] cursor-pointer"
                      >
                        Reset pencarian teknologi
                      </button>
                    </div>
                  )}
                </div>

                {/* Footer action button */}
                <div className="pt-2.5 mt-1.5 border-t border-border/40 flex items-center justify-end shrink-0">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => setIsTechDropdownOpen(false)}
                    className="rounded-xl text-xs h-8 px-4 font-semibold cursor-pointer shadow-xs"
                  >
                    Tutup
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="rounded-2xl text-xs text-muted-foreground hover:text-foreground hover:bg-muted/80 gap-1.5 h-10 px-3.5 self-center sm:self-auto shrink-0 group transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-rotate-90" />
            <span>Reset Filter</span>
          </Button>
        )}
      </div>

      {/* Bottom Row: Category Pills Filter & Results Status */}
      <div className="pt-3 border-t border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Category Pills (Scrollable horizontally if needed) */}
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => onCategoryChange("all")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/20 scale-[1.02]"
                : "bg-muted/60 dark:bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40"
            }`}
          >
            <Sparkles className="h-3 w-3 opacity-70" />
            <span>Semua</span>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedCategory === "all"
                  ? "bg-white/20 text-white"
                  : "bg-background/80 text-muted-foreground"
              }`}
            >
              {totalProjects}
            </span>
          </button>

          {categories.map((cat) => {
            const isSelected =
              selectedCategory === cat.slug || selectedCategory === cat.id;
            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => onCategoryChange(cat.slug || cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 ring-2 ring-primary/20 scale-[1.02]"
                    : "bg-muted/60 dark:bg-muted/40 text-muted-foreground hover:text-foreground hover:bg-muted border border-border/40"
                }`}
              >
                <span>{cat.name}</span>
                {cat.projectsCount !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-background/80 text-muted-foreground"
                    }`}
                  >
                    {cat.projectsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Results Counter Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0 self-end md:self-auto">
          {isFiltered && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}
          <span>
            Menampilkan{" "}
            <span className="font-semibold text-foreground">
              {totalFiltered}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-foreground">
              {totalProjects}
            </span>{" "}
            proyek
          </span>
        </div>
      </div>
    </div>
  );
}
