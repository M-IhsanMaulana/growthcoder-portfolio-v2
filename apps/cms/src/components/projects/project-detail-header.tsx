"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Github,
  Calendar,
  Eye,
  Star,
  Loader2,
  AlertCircle,
  Briefcase,
  Layers,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { Project } from "@growthcoder/types";

interface ProjectDetailHeaderProps {
  project: Project;
  onProjectUpdated?: (updated: Project) => void;
}

function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function ProjectDetailHeader({ project }: ProjectDetailHeaderProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await apiClient.delete(`/api/admin/projects/${project.id}`);
      if (res.success) {
        toast.success("Proyek berhasil dihapus");
        router.push("/projects");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal menghapus proyek");
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCopyLink = () => {
    const webUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_WEB_URL ||
      "https://growthcoder.id";
    const fullUrl = `${webUrl.replace(/\/$/, "")}/projects/${project.slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Tautan proyek berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  const webUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_WEB_URL ||
    "https://growthcoder.id";
  const publicProjectUrl = `${webUrl.replace(/\/$/, "")}/projects/${project.slug}`;

  return (
    <div className="space-y-4">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Kembali ke Daftar Portofolio
        </Link>

        <div className="flex items-center gap-2">
          <a
            href={publicProjectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/10 gap-1.5"
              title="Buka halaman detail proyek di website publik"
            >
              <Eye className="w-3.5 h-3.5" />
              Lihat di Web
            </Button>
          </a>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Demo
              </Button>
            </a>
          )}

          {project.repositoryUrl && (
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold text-muted-foreground hover:text-foreground gap-1.5"
              >
                <Github className="w-3.5 h-3.5" />
                Source Code
              </Button>
            </a>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="h-8 text-xs gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                Disalin
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin URL
              </>
            )}
          </Button>

          <Link href={`/projects/${project.id}/edit`}>
            <Button
              size="sm"
              className="h-8 text-xs bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5 shadow-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Proyek
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="h-8 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 px-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Banner Card */}
      <div className="p-6 rounded-3xl border border-border bg-card shadow-xs relative overflow-hidden">
        {/* Background gradient accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Cover Thumbnail */}
          <div className="relative w-full md:w-56 h-36 rounded-2xl overflow-hidden border border-border/80 shrink-0 bg-muted group">
            {project.coverImage ? (
              <Image
                src={resolveMediaUrl(project.coverImage)}
                alt={project.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <Briefcase className="w-8 h-8 opacity-40 mb-1" />
                <span className="text-[10px]">Tanpa Cover</span>
              </div>
            )}

            {project.isFeatured && (
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-white" />
                Featured
              </div>
            )}
          </div>

          {/* Project Info & Meta Badges */}
          <div className="flex-1 space-y-3 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {project.category && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Briefcase className="w-3 h-3" />
                  {project.category.name}
                </span>
              )}

              {project.role && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  Peran: {project.role}
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Calendar className="w-3 h-3" />
                {project.projectYear}
              </span>

              {project.clientName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted/60 text-foreground border border-border">
                  Klien: {project.clientName}
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-muted/50 text-muted-foreground border border-border">
                Urutan: #{project.order}
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground line-clamp-2">
                {project.title}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {project.excerpt}
              </p>
            </div>

            {/* Quick Metrics Bar & Tech Stacks */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                {project.techStacks && project.techStacks.length > 0 ? (
                  project.techStacks.slice(0, 5).map((ts) => (
                    <span
                      key={ts.id}
                      className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground border border-border"
                    >
                      {ts.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-muted-foreground">
                    Belum ada tech stack
                  </span>
                )}
                {project.techStacks && project.techStacks.length > 5 && (
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    +{project.techStacks.length - 5} lainnya
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <strong className="text-foreground font-bold">
                    {project.viewCount || 0}
                  </strong>{" "}
                  Views
                </span>
                <span className="inline-flex items-center gap-1">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
                  <strong className="text-foreground font-bold">
                    {project.demoClickCount || 0}
                  </strong>{" "}
                  Demo Clicks
                </span>
                <span className="inline-flex items-center gap-1">
                  <Github className="w-3.5 h-3.5 text-foreground" />
                  <strong className="text-foreground font-bold">
                    {project.repoClickCount || 0}
                  </strong>{" "}
                  Repo Clicks
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground">
                  Hapus Proyek Portofolio?
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tindakan ini permanen. Seluruh galeri dan data analitik untuk
                  proyek{" "}
                  <span className="font-semibold text-foreground">
                    &quot;{project.title}&quot;
                  </span>{" "}
                  akan dihapus dari sistem.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="text-xs h-9"
              >
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-xs h-9 bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Menghapus...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                    Ya, Hapus Proyek
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
