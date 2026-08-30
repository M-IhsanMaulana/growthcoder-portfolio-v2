"use client";

import * as React from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FolderX } from "lucide-react";
import { Button } from "@growthcoder/ui";
import { ProjectsFilterBar } from "./projects-filter-bar";
import { ProjectCard } from "./project-card";
import type { Project, ProjectCategory, TechStack } from "@growthcoder/types";

interface ProjectsCatalogViewProps {
  initialProjects: Project[];
  categories: ProjectCategory[];
  techStacks: TechStack[];
}

export function ProjectsCatalogView({
  initialProjects,
  categories,
  techStacks,
}: ProjectsCatalogViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = React.useState<string>(
    searchParams.get("q") || "",
  );
  const [selectedCategory, setSelectedCategory] = React.useState<string>(
    searchParams.get("category") || "all",
  );

  // Parse multi tech stacks from comma-separated URL param
  const [selectedTechStacks, setSelectedTechStacks] = React.useState<string[]>(
    () => {
      const stackParam = searchParams.get("stack");
      if (!stackParam || stackParam === "all") return [];
      return stackParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    },
  );

  // Sync URL search parameters when filters change
  const updateUrlParams = React.useCallback(
    (cat: string, stacks: string[], query: string) => {
      const params = new URLSearchParams();
      if (cat && cat !== "all") params.set("category", cat);
      if (stacks.length > 0) params.set("stack", stacks.join(","));
      if (query.trim()) params.set("q", query.trim());

      const qs = params.toString();
      const newUrl = qs ? `${pathname}?${qs}` : pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [pathname],
  );

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    updateUrlParams(cat, selectedTechStacks, searchQuery);
  };

  const handleTechStacksChange = (stacks: string[]) => {
    setSelectedTechStacks(stacks);
    updateUrlParams(selectedCategory, stacks, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    updateUrlParams(selectedCategory, selectedTechStacks, query);
  };

  const handleReset = () => {
    setSelectedCategory("all");
    setSelectedTechStacks([]);
    setSearchQuery("");
    router.replace(pathname);
  };

  // Filter projects in-memory
  const filteredProjects = React.useMemo(() => {
    return initialProjects.filter((project) => {
      // Category filter
      if (selectedCategory !== "all") {
        const matchesCategory =
          project.category?.slug === selectedCategory ||
          project.categoryId === selectedCategory ||
          project.category?.name.toLowerCase() ===
            selectedCategory.toLowerCase();
        if (!matchesCategory) return false;
      }

      // Multi Tech Stack filter (match ANY of the selected tech stacks)
      if (selectedTechStacks.length > 0) {
        const matchesTech = project.techStacks?.some((t) =>
          selectedTechStacks.some(
            (selected) =>
              t.slug === selected ||
              t.id === selected ||
              t.name.toLowerCase() === selected.toLowerCase(),
          ),
        );
        if (!matchesTech) return false;
      }

      // Search Query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = project.title.toLowerCase().includes(q);
        const matchesExcerpt = project.excerpt?.toLowerCase().includes(q);
        const matchesClient = project.clientName?.toLowerCase().includes(q);
        const matchesTech = project.techStacks?.some((t) =>
          t.name.toLowerCase().includes(q),
        );

        if (
          !matchesTitle &&
          !matchesExcerpt &&
          !matchesClient &&
          !matchesTech
        ) {
          return false;
        }
      }

      return true;
    });
  }, [initialProjects, selectedCategory, selectedTechStacks, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Filter Bar with elevated z-index so dropdown is never covered by content below */}
      <div className="relative z-40">
        <ProjectsFilterBar
          categories={categories}
          techStacks={techStacks}
          selectedCategory={selectedCategory}
          selectedTechStacks={selectedTechStacks}
          searchQuery={searchQuery}
          totalFiltered={filteredProjects.length}
          totalProjects={initialProjects.length}
          onCategoryChange={handleCategoryChange}
          onTechStacksChange={handleTechStacksChange}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </div>

      {/* Projects Grid / Empty State */}
      <div className="relative z-10">
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <ProjectCard
                  key={project.id || project.slug}
                  project={project}
                  priority={idx < 3}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-3xl border border-dashed border-border/80 bg-card/30 backdrop-blur-xl p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto"
          >
            <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center text-muted-foreground mb-4">
              <FolderX className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold font-heading text-foreground mb-2">
              Tidak Ada Proyek yang Ditemukan
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
              Kombinasi kata kunci pencarian atau filter yang Anda pilih saat
              ini tidak memiliki proyek yang sesuai.
            </p>
            <Button
              onClick={handleReset}
              variant="outline"
              className="rounded-full px-6 text-xs font-semibold cursor-pointer"
            >
              Hapus Semua Filter
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
