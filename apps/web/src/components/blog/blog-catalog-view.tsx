"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Layers,
  Tag as TagIcon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Check,
  RotateCcw,
  Filter,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { ArticleCard } from "./article-card";
import type { Article, Category, Tag } from "@growthcoder/types";

interface BlogCatalogViewProps {
  initialArticles: Article[];
  categories: Category[];
  tags: Tag[];
}

const ITEMS_PER_PAGE = 6;

export function BlogCatalogView({
  initialArticles,
  categories,
  tags,
}: BlogCatalogViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse multi-select params from URL (comma-separated or single)
  const parseParamArray = (paramVal: string | null): string[] => {
    if (!paramVal || paramVal === "all") return [];
    return paramVal
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const initialCategories = parseParamArray(searchParams.get("category"));
  const initialTags = parseParamArray(searchParams.get("tag"));
  const initialSearch = searchParams.get("q") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [selectedCategories, setSelectedCategories] =
    React.useState<string[]>(initialCategories);
  const [selectedTags, setSelectedTags] = React.useState<string[]>(initialTags);
  const [searchQuery, setSearchQuery] = React.useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = React.useState<number>(
    initialPage || 1,
  );

  // Tag filter dropdown state
  const [isTagDropdownOpen, setIsTagDropdownOpen] = React.useState(false);
  const [tagSearch, setTagSearch] = React.useState("");
  const tagDropdownRef = React.useRef<HTMLDivElement>(null);
  const tagTriggerRef = React.useRef<HTMLButtonElement>(null);

  const catalogTopRef = React.useRef<HTMLDivElement>(null);

  // Sync state with URL changes
  React.useEffect(() => {
    setSelectedCategories(parseParamArray(searchParams.get("category")));
    setSelectedTags(parseParamArray(searchParams.get("tag")));
    setSearchQuery(searchParams.get("q") || "");
    setCurrentPage(parseInt(searchParams.get("page") || "1", 10));
  }, [searchParams]);

  // Close tag dropdown on click outside or Escape
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tagDropdownRef.current &&
        !tagDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTagDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isTagDropdownOpen) {
        setIsTagDropdownOpen(false);
        tagTriggerRef.current?.focus();
      }
    };

    if (isTagDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTagDropdownOpen]);

  // Update URL helper
  const updateUrlParams = (
    newCats: string[],
    newTags: string[],
    newSearch: string,
    newPage: number,
  ) => {
    const params = new URLSearchParams();
    if (newCats.length > 0) params.set("category", newCats.join(","));
    if (newTags.length > 0) params.set("tag", newTags.join(","));
    if (newSearch.trim()) params.set("q", newSearch.trim());
    if (newPage > 1) params.set("page", String(newPage));

    const queryString = params.toString();
    router.push(`/blog${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  };

  // Toggle category in multi-select array
  const handleToggleCategory = (catSlug: string) => {
    let next: string[];
    if (catSlug === "all") {
      next = [];
    } else {
      if (selectedCategories.includes(catSlug)) {
        next = selectedCategories.filter((c) => c !== catSlug);
      } else {
        next = [...selectedCategories, catSlug];
      }
    }
    setSelectedCategories(next);
    setCurrentPage(1);
    updateUrlParams(next, selectedTags, searchQuery, 1);
  };

  // Toggle tag in multi-select array
  const handleToggleTag = (tagSlug: string) => {
    let next: string[];
    if (tagSlug === "all") {
      next = [];
    } else {
      if (selectedTags.includes(tagSlug)) {
        next = selectedTags.filter((t) => t !== tagSlug);
      } else {
        next = [...selectedTags, tagSlug];
      }
    }
    setSelectedTags(next);
    setCurrentPage(1);
    updateUrlParams(selectedCategories, next, searchQuery, 1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCurrentPage(1);
    updateUrlParams(selectedCategories, selectedTags, val, 1);
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedTags([]);
    setSearchQuery("");
    setCurrentPage(1);
    router.push("/blog", { scroll: false });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams(selectedCategories, selectedTags, searchQuery, newPage);

    // Smooth scroll to top of catalog
    if (catalogTopRef.current) {
      const topOffset =
        catalogTopRef.current.getBoundingClientRect().top +
        window.scrollY -
        100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  // Filtered tags for dropdown search
  const filteredTags = React.useMemo(() => {
    if (!tagSearch.trim()) return tags;
    const q = tagSearch.toLowerCase().trim();
    return tags.filter((t) => t.name.toLowerCase().includes(q));
  }, [tags, tagSearch]);

  // Exact published article counts per category (computed strictly from published articles on page)
  const categoryCountMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const art of initialArticles) {
      if (art.categoryId) {
        map.set(art.categoryId, (map.get(art.categoryId) || 0) + 1);
      }
      if (art.category?.slug) {
        map.set(art.category.slug, (map.get(art.category.slug) || 0) + 1);
      }
      if (art.category?.name) {
        map.set(
          art.category.name.toLowerCase(),
          (map.get(art.category.name.toLowerCase()) || 0) + 1,
        );
      }
    }
    return map;
  }, [initialArticles]);

  // Exact published article counts per tag (computed strictly from published articles on page)
  const tagCountMap = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const art of initialArticles) {
      if (art.tags && Array.isArray(art.tags)) {
        for (const t of art.tags) {
          if (t.id) map.set(t.id, (map.get(t.id) || 0) + 1);
          if (t.slug) map.set(t.slug, (map.get(t.slug) || 0) + 1);
          if (t.name)
            map.set(
              t.name.toLowerCase(),
              (map.get(t.name.toLowerCase()) || 0) + 1,
            );
        }
      }
    }
    return map;
  }, [initialArticles]);

  // Filter articles client-side with multi-select logic
  const filteredArticles = React.useMemo(() => {
    return initialArticles.filter((article) => {
      // Multi-Category match (if any selected, article must match at least one)
      if (selectedCategories.length > 0) {
        const articleCatSlug =
          article.category?.slug || article.categoryId || "";
        const articleCatName = article.category?.name?.toLowerCase() || "";
        const matchesCat = selectedCategories.some(
          (slug) =>
            slug.toLowerCase() === articleCatSlug.toLowerCase() ||
            slug.toLowerCase() === articleCatName,
        );
        if (!matchesCat) return false;
      }

      // Multi-Tag match (if any selected, article must match at least one)
      if (selectedTags.length > 0) {
        const matchesTag = article.tags?.some((t) =>
          selectedTags.some(
            (sel) =>
              sel.toLowerCase() === (t.slug || "").toLowerCase() ||
              sel.toLowerCase() === (t.id || "").toLowerCase() ||
              sel.toLowerCase() === (t.name || "").toLowerCase(),
          ),
        );
        if (!matchesTag) return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = article.title.toLowerCase().includes(q);
        const matchesExcerpt = article.excerpt.toLowerCase().includes(q);
        const matchesContent = article.content
          ? article.content.toLowerCase().includes(q)
          : false;
        if (!matchesTitle && !matchesExcerpt && !matchesContent) return false;
      }

      return true;
    });
  }, [initialArticles, selectedCategories, selectedTags, searchQuery]);

  // Pagination calculation
  const totalItems = filteredArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedArticles = React.useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredArticles, validCurrentPage]);

  // Generate page numbers array (with ellipsis if needed)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          validCurrentPage - 1,
          validCurrentPage,
          validCurrentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    searchQuery.trim() !== "";

  return (
    <div ref={catalogTopRef} className="space-y-8">
      {/* Compact Modern Multi-Select Search & Filter Bar */}
      <div className="relative z-40 rounded-2xl border border-border/80 bg-card/80 dark:bg-card/60 backdrop-blur-xl p-3 sm:p-4 shadow-sm space-y-3">
        {/* Row 1: Search Input & Multi-Select Tag Dropdown Popover */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Live Search Input */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Cari artikel, topik karir, edukasi, tips, atau teknologi..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-background/80 dark:bg-background/50 border border-border/70 text-foreground placeholder:text-muted-foreground/70 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                  updateUrlParams(selectedCategories, selectedTags, "", 1);
                }}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Multi-Select Tag Dropdown Trigger */}
          {tags && tags.length > 0 && (
            <div ref={tagDropdownRef} className="relative z-50 shrink-0">
              <button
                ref={tagTriggerRef}
                type="button"
                onClick={() => setIsTagDropdownOpen((prev) => !prev)}
                className={`w-full sm:w-auto h-[42px] px-3.5 rounded-xl text-xs font-medium flex items-center justify-between sm:justify-center gap-2 transition-all cursor-pointer border ${
                  selectedTags.length > 0
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold shadow-xs"
                    : "bg-background/80 dark:bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70"
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <TagIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                  <span className="truncate">
                    {selectedTags.length === 0
                      ? "Filter Tag"
                      : selectedTags.length === 1
                        ? `#${tags.find((t) => t.slug === selectedTags[0] || t.id === selectedTags[0])?.name || selectedTags[0]}`
                        : `${selectedTags.length} Tag Dipilih`}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground shrink-0">
                  {selectedTags.length > 0 && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTag("all");
                      }}
                      className="p-0.5 hover:bg-emerald-500/20 rounded-full cursor-pointer text-emerald-600 dark:text-emerald-400"
                      title="Hapus semua tag"
                    >
                      <X className="h-3 w-3" />
                    </span>
                  )}
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${
                      isTagDropdownOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Tag Dropdown Popover */}
              <AnimatePresence>
                {isTagDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-full sm:w-72 bg-popover dark:bg-card border border-border/90 shadow-2xl rounded-2xl z-[999] p-3 overflow-hidden flex flex-col max-h-[340px] ring-1 ring-black/10 dark:ring-white/10"
                  >
                    {/* Header info / Reset */}
                    <div className="flex items-center justify-between px-1 pb-2 mb-1.5 border-b border-border/40 text-[11px] font-medium text-muted-foreground shrink-0">
                      <span>
                        {selectedTags.length === 0
                          ? "Pilih satu atau lebih tag"
                          : `${selectedTags.length} tag aktif`}
                      </span>
                      {selectedTags.length > 0 && (
                        <button
                          type="button"
                          onClick={() => handleToggleTag("all")}
                          className="text-primary hover:underline font-semibold cursor-pointer"
                        >
                          Reset pilihan
                        </button>
                      )}
                    </div>

                    {/* Search inside tags */}
                    {tags.length > 5 && (
                      <div className="relative mb-2 shrink-0">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                        <input
                          type="text"
                          placeholder="Cari tag..."
                          value={tagSearch}
                          onChange={(e) => setTagSearch(e.target.value)}
                          className="w-full pl-7 pr-6 py-1.5 text-xs rounded-lg bg-muted/60 dark:bg-muted/40 border border-border/60 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {tagSearch && (
                          <button
                            type="button"
                            onClick={() => setTagSearch("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    )}

                    {/* Tag Options List with Checkmarks */}
                    <div className="overflow-y-auto space-y-1 max-h-[220px] pr-1">
                      {filteredTags.map((t) => {
                        const isSelected =
                          selectedTags.includes(t.slug) ||
                          selectedTags.includes(t.id) ||
                          selectedTags.includes(t.name.toLowerCase());
                        const count =
                          tagCountMap.get(t.slug) ??
                          tagCountMap.get(t.id) ??
                          tagCountMap.get(t.name.toLowerCase()) ??
                          t.postsCount ??
                          0;

                        return (
                          <button
                            key={t.id || t.slug}
                            type="button"
                            onClick={() => handleToggleTag(t.slug)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                              isSelected
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div
                                className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                  isSelected
                                    ? "bg-emerald-500 border-emerald-500 text-white"
                                    : "border-border/80 bg-background/80"
                                }`}
                              >
                                {isSelected && (
                                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                                )}
                              </div>
                              <span className="truncate">#{t.name}</span>
                            </div>

                            {count > 0 && (
                              <span className="text-[10px] text-muted-foreground opacity-70 ml-1 font-mono">
                                {count}
                              </span>
                            )}
                          </button>
                        );
                      })}

                      {filteredTags.length === 0 && (
                        <div className="py-3 text-center text-xs text-muted-foreground">
                          Tag tidak ditemukan
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Row 2: Category Pills Multi-Select (Horizontal Scroll on mobile / Flex Wrap on desktop) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sm:flex-wrap no-scrollbar">
          <button
            type="button"
            onClick={() => handleToggleCategory("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 ${
              selectedCategories.length === 0
                ? "bg-foreground text-background shadow-xs scale-[1.02] font-semibold"
                : "bg-background/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
            }`}
          >
            Semua
          </button>

          {categories.map((cat) => {
            const isSelected =
              selectedCategories.includes(cat.slug) ||
              selectedCategories.includes(cat.id) ||
              selectedCategories.includes(cat.name.toLowerCase());

            const count =
              categoryCountMap.get(cat.slug) ??
              categoryCountMap.get(cat.id) ??
              categoryCountMap.get(cat.name.toLowerCase()) ??
              cat.postsCount ??
              0;

            return (
              <button
                key={cat.id || cat.slug}
                type="button"
                onClick={() => handleToggleCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-foreground text-background shadow-xs scale-[1.02] font-semibold"
                    : "bg-background/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[2.5]" />}
                <span>{cat.name}</span>
                {count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected
                        ? "bg-background/20 text-background font-semibold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Row 3 (Conditional): Active Filter Summary & Removable Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border/40 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
              <span>
                Menampilkan{" "}
                <strong className="text-foreground">{totalItems}</strong>{" "}
                artikel
              </span>

              {/* Active Category Chips */}
              {selectedCategories.map((slug) => {
                const catObj = categories.find(
                  (c) => c.slug === slug || c.id === slug,
                );
                return (
                  <button
                    key={`chip-cat-${slug}`}
                    onClick={() => handleToggleCategory(slug)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 text-[11px] font-medium hover:bg-primary/20 transition-colors cursor-pointer"
                    title="Klik untuk menghapus filter ini"
                  >
                    <span>{catObj?.name || slug}</span>
                    <X className="h-3 w-3" />
                  </button>
                );
              })}

              {/* Active Tag Chips */}
              {selectedTags.map((slug) => {
                const tagObj = tags.find(
                  (t) => t.slug === slug || t.id === slug,
                );
                return (
                  <button
                    key={`chip-tag-${slug}`}
                    onClick={() => handleToggleTag(slug)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-mono hover:bg-emerald-500/25 transition-colors cursor-pointer"
                    title="Klik untuk menghapus filter ini"
                  >
                    <span>#{tagObj?.name || slug}</span>
                    <X className="h-3 w-3" />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold cursor-pointer shrink-0 ml-auto"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Semua</span>
            </button>
          </div>
        )}
      </div>

      {/* Articles Grid / Empty State */}
      <AnimatePresence mode="wait">
        {totalItems === 0 ? (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 flex flex-col items-center justify-center p-12 sm:p-16 text-center rounded-3xl border border-dashed border-border bg-card/40 backdrop-blur-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-foreground mb-2">
              Tidak Ada Artikel yang Ditemukan
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              Tidak ditemukan artikel yang sesuai dengan filter atau kata kunci
              pencarian Anda. Coba sesuaikan kata kunci atau bersihkan filter.
            </p>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="rounded-full px-6"
            >
              Tampilkan Semua Artikel
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={`page-${validCurrentPage}-${selectedCategories.join(",")}-${selectedTags.join(",")}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative z-10 space-y-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedArticles.map((article, idx) => (
                <ArticleCard
                  key={article.id || article.slug}
                  article={article}
                  index={idx}
                />
              ))}
            </div>

            {/* Numbered Pagination Bar */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-2">
                {/* Prev Button */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage <= 1}
                  onClick={() => handlePageChange(validCurrentPage - 1)}
                  className="rounded-xl h-10 px-3.5 border-border/80 gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </Button>

                {/* Page Number Buttons */}
                <div className="flex items-center gap-1.5">
                  {getPageNumbers().map((p, i) => {
                    if (typeof p === "string") {
                      return (
                        <span
                          key={`ellipsis-${i}`}
                          className="px-2 py-1 text-sm font-mono text-muted-foreground"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = p === validCurrentPage;
                    return (
                      <button
                        key={`page-btn-${p}`}
                        onClick={() => handlePageChange(p)}
                        className={`h-10 min-w-10 px-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                            : "bg-card/70 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={validCurrentPage >= totalPages}
                  onClick={() => handlePageChange(validCurrentPage + 1)}
                  className="rounded-xl h-10 px-3.5 border-border/80 gap-1"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
