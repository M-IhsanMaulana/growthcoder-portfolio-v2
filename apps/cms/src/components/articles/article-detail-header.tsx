"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Calendar,
  Clock,
  Eye,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { Article, ArticleStatus } from "@growthcoder/types";

interface ArticleDetailHeaderProps {
  article: Article;
  onArticleUpdated: (updated: Article) => void;
}

export function ArticleDetailHeader({
  article,
  onArticleUpdated,
}: ArticleDetailHeaderProps) {
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleStatusChange = async (newStatus: ArticleStatus) => {
    if (newStatus === article.status) return;
    setIsUpdatingStatus(true);
    try {
      const res = await apiClient.patch<Article>(
        `/api/admin/articles/${article.id}/status`,
        { status: newStatus },
      );
      if (res.success && res.data) {
        onArticleUpdated(res.data);
        toast.success(`Status artikel berhasil diubah ke ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal memperbarui status artikel");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(`/api/admin/articles/${article.id}`);
      if (res.success) {
        toast.success("Artikel berhasil dihapus");
        router.push("/articles");
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus artikel");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Kembali ke Daftar Artikel</span>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <a
            href={`http://localhost:3000/artikel/${article.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/50 hover:bg-secondary rounded-lg border border-border transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Web Publik</span>
          </a>

          <Link
            href={`/articles/${article.id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg shadow-xs transition-colors"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Artikel</span>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-8 px-2.5 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Title & Meta Header Card */}
      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              {/* Category */}
              {article.category && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
                  {article.category.name}
                </span>
              )}

              {/* Status Selector */}
              <div className="flex items-center gap-1.5">
                <Select
                  value={article.status}
                  disabled={isUpdatingStatus}
                  onValueChange={(val) =>
                    handleStatusChange(val as ArticleStatus)
                  }
                >
                  <SelectTrigger
                    className={`h-6.5 px-2.5 text-[11px] font-semibold border rounded-md shadow-none ${
                      article.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : article.status === "scheduled"
                          ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                    }`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-[8rem]">
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
                {isUpdatingStatus && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                )}
              </div>

              {/* Reading Time */}
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                <Clock className="h-3 w-3" />~{article.readingTimeMinutes || 1}{" "}
                menit baca
              </span>

              {/* Total Views Count */}
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md">
                <Eye className="h-3 w-3 text-primary" />
                {article.viewCount || 0} tayangan
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-2">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* Timestamps Bar */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 pt-3 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground/80" />
            <span>
              Dipublikasi:{" "}
              <strong className="text-foreground font-medium">
                {formatDate(article.publishedAt || article.createdAt)}
              </strong>
            </span>
          </div>

          {article.updatedAt && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground/80" />
              <span>
                Terakhir Diubah:{" "}
                <strong className="text-foreground font-medium">
                  {formatDate(article.updatedAt)}
                </strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-muted-foreground/70">Slug:</span>
            <span className="text-primary font-medium">/{article.slug}</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center gap-3 text-rose-500">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">
                  Hapus Artikel?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus artikel{" "}
              <strong className="text-foreground">"{article.title}"</strong>{" "}
              beserta seluruh riwayat analitik dan log aktivitas terkait?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="text-xs"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isDeleting}
                onClick={handleDelete}
                className="text-xs font-semibold"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
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
