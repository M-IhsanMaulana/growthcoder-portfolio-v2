"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Plus,
  RefreshCw,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Tag as TagIcon,
  Folder,
  CheckCircle2,
  Clock,
  FileEdit,
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart2,
} from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Combobox,
} from "@/components/ui";
import { apiClient, resolveMediaUrl } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  Article,
  Category,
  ArticleStatus,
  PaginatedResponse,
} from "@growthcoder/types";

export function ArticleTable() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ArticleStatus | "all">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [lastPage, setLastPage] = useState(1);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Status updating state
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleOpenPreview = async (article: Article) => {
    try {
      const res = await apiClient.get<{ previewUrl: string }>(
        `/api/admin/articles/${article.id}/preview-url`,
      );
      if (res.success && res.data?.previewUrl) {
        window.open(res.data.previewUrl, "_blank");
        return;
      }
    } catch (_err) {
      // fallback
    }
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://growthcoder.id";
    window.open(`${siteUrl}/blog/${article.slug}?preview=true`, "_blank");
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiClient.get<Category[]>("/api/admin/categories");
      if (res.success && res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  }, []);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }
      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (categoryFilter !== "all") {
        params.set("categoryId", categoryFilter);
      }

      const res = (await apiClient.get<Article[]>(
        `/api/admin/articles?${params.toString()}`,
      )) as unknown as PaginatedResponse<Article>;

      if (res.success && res.data) {
        setArticles(res.data);
        if (res.meta) {
          setTotal(res.meta.total);
          setLastPage(res.meta.lastPage);
        }
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleQuickStatusChange = async (
    article: Article,
    newStatus: ArticleStatus,
  ) => {
    setUpdatingId(article.id);
    try {
      const res = await apiClient.patch<Article>(
        `/api/admin/articles/${article.id}/status`,
        {
          status: newStatus,
        },
      );
      if (res.success && res.data) {
        toast.success(
          `Status artikel '${article.title}' diubah ke ${newStatus.toUpperCase()}`,
        );
        fetchArticles();
      } else {
        toast.error(res.message || "Gagal mengubah status artikel.");
      }
    } catch (err: unknown) {
      const e = err as Error & { message?: string };
      toast.error(e.message || "Terjadi kesalahan.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(
        `/api/admin/articles/${deleteTarget.id}`,
      );
      if (res.success) {
        toast.success(`Artikel '${deleteTarget.title}' berhasil dihapus.`);
        setDeleteTarget(null);
        fetchArticles();
      } else {
        toast.error(res.message || "Gagal menghapus artikel.");
      }
    } catch (err: unknown) {
      const e = err as Error & { message?: string };
      toast.error(e.message || "Terjadi kesalahan saat menghapus.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "-";
    const d = new Date(isoString);
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur-md">
        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari judul / konten artikel..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val as ArticleStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36 h-9 text-xs">
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">
                Semua Status
              </SelectItem>
              <SelectItem value="published" className="text-xs">
                Published
              </SelectItem>
              <SelectItem value="draft" className="text-xs">
                Draft
              </SelectItem>
              <SelectItem value="scheduled" className="text-xs">
                Scheduled
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter (Searchable Combobox) */}
          <div className="w-44 sm:w-48">
            <Combobox
              options={[
                { value: "all", label: "Semua Kategori" },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                })),
              ]}
              value={categoryFilter}
              onValueChange={(val) => {
                setCategoryFilter(val || "all");
                setPage(1);
              }}
              placeholder="Semua Kategori"
              searchPlaceholder="Cari kategori..."
              size="sm"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchArticles}
            disabled={isLoading}
            className="h-9 w-9 p-0 rounded-xl"
            title="Refresh"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        {/* Action Button */}
        <Link href="/articles/create">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tulis Artikel Baru</span>
          </Button>
        </Link>
      </div>

      {/* Table Section */}
      {isLoading ? (
        <div className="flex h-72 items-center justify-center rounded-2xl border border-border bg-card/50">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/30 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-3">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="font-semibold text-foreground text-sm">
            Tidak ada artikel ditemukan
          </h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            {search || statusFilter !== "all" || categoryFilter !== "all"
              ? "Coba ubah kata kunci pencarian atau reset filter untuk melihat data lain."
              : "Mulai buat artikel teknis atau blog pertama Anda untuk dibagikan ke publik."}
          </p>
          <div className="mt-4">
            <Link href="/articles/create">
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Buat Artikel Sekarang
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-semibold">Artikel</th>
                  <th className="px-5 py-3 font-semibold">Kategori & Tags</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-center">
                    Statistik
                  </th>
                  <th className="px-5 py-3 font-semibold">Tanggal</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((article) => {
                  return (
                    <tr
                      key={article.id}
                      className="hover:bg-muted/30 transition-colors group"
                    >
                      {/* Title & Cover */}
                      <td className="px-5 py-3.5 max-w-md">
                        <div className="flex items-start gap-3">
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted/50 border border-border">
                            {article.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={resolveMediaUrl(article.coverImage)}
                                alt={article.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                                <FileText className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/articles/${article.id}`}
                              className="font-semibold text-foreground text-sm hover:text-primary transition-colors line-clamp-1"
                            >
                              {article.title}
                            </Link>
                            <p className="font-mono text-[10px] text-muted-foreground truncate">
                              /{article.slug}
                            </p>
                            {article.excerpt && (
                              <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                                {article.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Taxonomies */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="space-y-1.5">
                          {article.category ? (
                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <Folder className="h-3 w-3" />
                              {article.category.name}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground italic">
                              Tanpa kategori
                            </span>
                          )}

                          {article.tags && article.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag.id}
                                  className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                                >
                                  #{tag.name}
                                </span>
                              ))}
                              {article.tags.length > 3 && (
                                <span className="text-[10px] text-muted-foreground">
                                  +{article.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <Select
                            value={article.status}
                            disabled={updatingId === article.id}
                            onValueChange={(val) =>
                              handleQuickStatusChange(
                                article,
                                val as ArticleStatus,
                              )
                            }
                          >
                            <SelectTrigger
                              className={`h-7 px-2.5 text-[11px] font-semibold border rounded-lg shadow-none ${
                                article.status === "published"
                                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                  : article.status === "scheduled"
                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              }`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="min-w-[7rem]">
                              <SelectItem
                                value="published"
                                className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                              >
                                Published
                              </SelectItem>
                              <SelectItem
                                value="draft"
                                className="text-xs text-amber-600 dark:text-amber-400 font-medium"
                              >
                                Draft
                              </SelectItem>
                              <SelectItem
                                value="scheduled"
                                className="text-xs text-indigo-600 dark:text-indigo-400 font-medium"
                              >
                                Scheduled
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          {updatingId === article.id && (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          )}
                        </div>
                      </td>

                      {/* Stats */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="flex items-center gap-1 font-mono text-xs font-semibold text-foreground">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            {article.viewCount || 0}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            ~{article.readingTimeMinutes || 1} min read
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap">
                        <p className="text-[11px] font-medium text-foreground">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {article.status === "published"
                            ? "Dipublikasikan"
                            : "Dibuat"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/articles/${article.id}`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                            title="Detail & Analitik Artikel"
                          >
                            <BarChart2 className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleOpenPreview(article)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors cursor-pointer"
                            title="Pratinjau di Web Publik (Preview Mode)"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>

                          <Link
                            href={`/articles/${article.id}/edit`}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                            title="Edit Artikel"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTarget(article)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {total > perPage && (
            <div className="flex items-center justify-between border-t border-border bg-muted/20 px-6 py-3 text-xs text-muted-foreground">
              <span>
                Menampilkan {(page - 1) * perPage + 1} -{" "}
                {Math.min(page * perPage, total)} dari {total} artikel
              </span>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-8 px-2.5 rounded-lg text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Sebelumnya
                </Button>
                <span className="font-mono text-foreground px-2">
                  {page} / {lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= lastPage}
                  onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                  className="h-8 px-2.5 rounded-lg text-xs"
                >
                  Berikutnya <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-500 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-base">
                  Hapus Artikel
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="text-xs text-foreground/80 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus artikel{" "}
              <strong className="text-foreground font-semibold">
                &quot;{deleteTarget.title}&quot;
              </strong>
              ? Data artikel dan seluruh relasi tagging akan dihapus permanen.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium px-4 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus Artikel"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
