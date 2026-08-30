"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Plus,
  Search,
  RefreshCw,
  ExternalLink,
  Github,
  Star,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Layers,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Combobox,
} from "@/components/ui";
import {
  Badge,
  Switch,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import { apiClient, resolveMediaUrl } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  Project,
  ProjectCategory,
  TechStack,
  PaginatedResponse,
} from "@growthcoder/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTechStack, setSelectedTechStack] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "standard"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Delete modal state
  const [deleteItem, setDeleteItem] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Master Data
  const fetchFilterOptions = useCallback(async () => {
    try {
      const [resCats, resStacks] = await Promise.all([
        apiClient.get<ProjectCategory[]>("/api/admin/project-categories"),
        apiClient.get<TechStack[]>("/api/admin/tech-stacks"),
      ]);
      if (resCats.success && resCats.data) setCategories(resCats.data);
      if (resStacks.success && resStacks.data) setTechStacks(resStacks.data);
    } catch (err) {
      console.error("Error loading project filter options:", err);
    }
  }, []);

  // Fetch Projects List
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        perPage: "10",
      });

      if (search.trim()) params.set("search", search.trim());
      if (selectedCategory !== "all")
        params.set("categoryId", selectedCategory);

      const res = await apiClient.get<Project[]>(
        `/api/admin/projects?${params.toString()}`,
      );
      if (res.success && res.data) {
        let items = res.data;
        const meta = (res as unknown as PaginatedResponse<Project>).meta;

        // Client-side filtering for tech stacks and featured status if not done on server
        if (selectedTechStack !== "all") {
          items = items.filter((p) =>
            p.techStacks?.some((s) => s.id === selectedTechStack),
          );
        }

        if (featuredFilter === "featured") {
          items = items.filter((p) => p.isFeatured);
        } else if (featuredFilter === "standard") {
          items = items.filter((p) => !p.isFeatured);
        }

        setProjects(items);
        if (meta) {
          setTotalPages(meta.lastPage || 1);
          setTotalCount(meta.total || items.length);
        } else {
          setTotalCount(items.length);
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat katalog proyek");
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    search,
    selectedCategory,
    selectedTechStack,
    featuredFilter,
  ]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Quick Toggle Featured
  const handleToggleFeatured = async (project: Project) => {
    const nextFeatured = !project.isFeatured;
    try {
      await apiClient.put(`/api/admin/projects/${project.id}`, {
        isFeatured: nextFeatured,
      });
      setProjects((prev) =>
        prev.map((p) =>
          p.id === project.id ? { ...p, isFeatured: nextFeatured } : p,
        ),
      );
      toast.success(
        nextFeatured
          ? `"${project.title}" ditandai sebagai Featured Project`
          : `"${project.title}" dihapus dari Featured Project`,
      );
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal mengubah status featured");
    }
  };

  // Delete Action
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/api/admin/projects/${deleteItem.id}`);
      setProjects((prev) => prev.filter((p) => p.id !== deleteItem.id));
      toast.success(`Proyek "${deleteItem.title}" berhasil dihapus`);
      setDeleteItem(null);
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus proyek");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Portofolio & Studi Kasus
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Kelola katalog proyek, studi kasus teknis, implementasi
                arsitektur, dan galeri screenshot.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProjects}
            disabled={isLoading}
            className="h-9 text-xs"
            title="Muat ulang katalog proyek"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Link href="/projects/new">
            <Button
              size="sm"
              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Buat Proyek Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-2xl border border-border bg-card space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari judul proyek, klien..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-8.5 text-xs bg-muted/30"
            />
          </div>

          {/* Category Filter (Searchable Combobox) */}
          <div className="w-44">
            <Combobox
              options={[
                { value: "all", label: "Semua Kategori" },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })),
              ]}
              value={selectedCategory}
              onValueChange={(val) => {
                setSelectedCategory(val || "all");
                setCurrentPage(1);
              }}
              placeholder="Semua Kategori"
              searchPlaceholder="Cari kategori..."
              size="sm"
            />
          </div>

          {/* Tech Stack Filter (Searchable Combobox) */}
          <div className="w-48">
            <Combobox
              options={[
                { value: "all", label: "Semua Tech Stack" },
                ...techStacks.map((stack) => ({
                  value: stack.id,
                  label: stack.name,
                })),
              ]}
              value={selectedTechStack}
              onValueChange={(val) => {
                setSelectedTechStack(val || "all");
                setCurrentPage(1);
              }}
              placeholder="Semua Tech Stack"
              searchPlaceholder="Cari tech stack..."
              size="sm"
            />
          </div>

          {/* Featured Filter */}
          <Select
            value={featuredFilter}
            onValueChange={(val) => {
              setFeaturedFilter(val as "all" | "featured" | "standard");
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8.5 text-xs bg-muted/30 w-36">
              <SelectValue placeholder="Status Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                Semua Status
              </SelectItem>
              <SelectItem value="featured" className="text-xs">
                Hanya Featured (Bento)
              </SelectItem>
              <SelectItem value="standard" className="text-xs">
                Non-Featured
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-xs text-muted-foreground font-medium">
              Memuat katalog portofolio...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
              <Briefcase className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {search ||
                selectedCategory !== "all" ||
                selectedTechStack !== "all"
                  ? "Tidak ada proyek yang sesuai dengan filter"
                  : "Belum ada proyek portofolio"}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                {search || selectedCategory !== "all"
                  ? "Silakan coba ubah parameter pencarian atau reset filter di atas."
                  : "Mulai dokumentasikan karya dan studi kasus teknis terbaik Anda sekarang."}
              </p>
            </div>
            <Link href="/projects/new">
              <Button
                size="sm"
                className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Buat Proyek Pertama
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/30 transition-colors group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Cover Thumbnail */}
                  <div className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-xl overflow-hidden border border-border/80 bg-muted/40 shrink-0 flex items-center justify-center">
                    {project.coverImage ? (
                      <Image
                        src={resolveMediaUrl(project.coverImage)}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="120px"
                      />
                    ) : (
                      <Briefcase className="w-6 h-6 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        <Link href={`/projects/${project.id}`}>
                          {project.title}
                        </Link>
                      </h3>

                      {project.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Featured
                        </span>
                      )}

                      {project.category && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {project.category.name}
                        </span>
                      )}

                      {project.role && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {project.role}
                        </span>
                      )}

                      {project.projectYear && (
                        <span className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.projectYear}
                        </span>
                      )}

                      <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 ml-auto sm:ml-0">
                        <Eye className="w-3 h-3 text-emerald-500" />
                        {project.viewCount || 0} views
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1 max-w-2xl">
                      {project.excerpt}
                    </p>

                    {/* Tech Stacks Badges */}
                    {project.techStacks && project.techStacks.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        {project.techStacks.slice(0, 5).map((stack) => (
                          <span
                            key={stack.id}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-muted text-muted-foreground border border-border/80"
                          >
                            {stack.iconSvg && (
                              <span
                                className="w-3 h-3 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full"
                                dangerouslySetInnerHTML={{
                                  __html: stack.iconSvg,
                                }}
                              />
                            )}
                            <span>{stack.name}</span>
                          </span>
                        ))}
                        {project.techStacks.length > 5 && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            +{project.techStacks.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Quick Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                      title="Buka Demo Proyek"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {project.repositoryUrl && (
                    <a
                      href={project.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Lihat Source Code GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  <Link href={`/projects/${project.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2.5 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Detail
                    </Button>
                  </Link>

                  <Link href={`/projects/${project.id}/edit`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs px-2.5"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                  </Link>

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
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/projects/${project.id}`}
                          className="cursor-pointer text-xs flex items-center"
                        >
                          <Eye className="w-3.5 h-3.5 mr-2 text-emerald-500" />
                          <span>Rincian & Analitik</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a
                          href={`${process.env.NEXT_PUBLIC_SITE_URL || "https://growthcoder.id"}/projects/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer text-xs flex items-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-2 text-primary" />
                          <span>Lihat di Web Publik</span>
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/projects/${project.id}/edit`}>
                          <Edit2 className="w-3.5 h-3.5 mr-2" />
                          <span>Edit Studi Kasus</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleToggleFeatured(project)}
                        className="cursor-pointer text-xs"
                      >
                        <Star className="w-3.5 h-3.5 mr-2 text-amber-500" />
                        <span>
                          {project.isFeatured
                            ? "Hapus Featured"
                            : "Jadikan Featured"}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteItem(project)}
                        className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-2" />
                        <span>Hapus Proyek</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Pagination Bar */}
        {!isLoading && totalPages > 1 && (
          <div className="p-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-card/40">
            <span>
              Total <strong>{totalCount}</strong> proyek (Halaman {currentPage}{" "}
              dari {totalPages})
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-7 text-xs px-2"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="h-7 text-xs px-2"
              >
                Selanjutnya
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={Boolean(deleteItem)}
        onOpenChange={(open) => !open && setDeleteItem(null)}
      >
        <DialogContent className="max-w-md p-6">
          <DialogHeader className="space-y-2">
            <div className="w-11 h-11 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-center mb-1">
              <AlertCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">
              Hapus Proyek Portofolio?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus proyek{" "}
              <strong className="text-foreground">
                &quot;{deleteItem?.title}&quot;
              </strong>
              ? Data galeri screenshot dan relasi tech stack pada proyek ini
              akan dihapus secara permanen.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center justify-end gap-3 mt-5 pt-4 border-t border-border/70">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteItem(null)}
              disabled={isDeleting}
              className="text-xs h-9 px-4"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="text-xs h-9 px-4 font-semibold shadow-xs"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Menghapus...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Ya, Hapus Proyek
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
