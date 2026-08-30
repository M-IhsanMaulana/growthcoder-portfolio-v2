"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Briefcase,
  Layers,
  Calendar,
  ExternalLink,
  Github,
  Star,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import type { Project, ProjectGallery } from "@growthcoder/types";

interface ProjectOverviewTabProps {
  project: Project;
}

function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function ProjectOverviewTab({ project }: ProjectOverviewTabProps) {
  const [selectedGallery, setSelectedGallery] = useState<ProjectGallery | null>(
    null,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ================= LEFT COLUMN: MAIN CONTENT & CASE STUDY (8 COLS) ================= */}
      <div className="lg:col-span-8 space-y-6">
        {/* Case Study Content Card */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Narasi Studi Kasus Teknis (Case Study Story)
            </h2>
            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Edit Konten
              </Button>
            </Link>
          </div>

          {project.content ? (
            <div
              className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed prose-headings:font-bold prose-headings:tracking-tight prose-a:text-emerald-500 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: project.content }}
            />
          ) : (
            <div className="py-12 text-center text-muted-foreground space-y-2">
              <FileText className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">
                Belum ada narasi studi kasus yang ditulis.
              </p>
              <Link href={`/projects/${project.id}/edit`}>
                <Button variant="outline" size="sm" className="text-xs">
                  Tulis Studi Kasus Sekarang
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Screenshot Gallery Grid */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <h2 className="text-base font-bold text-foreground">
                Galeri Screenshot & Mockup
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                {project.galleries?.length || 0}
              </span>
            </div>

            <Link href={`/projects/${project.id}/edit`}>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                Kelola Galeri
              </Button>
            </Link>
          </div>

          {project.galleries && project.galleries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {project.galleries.map((gallery, index) => (
                <div
                  key={gallery.id || index}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-muted/40 transition-all hover:border-emerald-500/50 hover:shadow-md cursor-pointer"
                  onClick={() => setSelectedGallery(gallery)}
                >
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={resolveMediaUrl(gallery.imageUrl)}
                      alt={gallery.caption || `Screenshot ${index + 1}`}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md text-white">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {gallery.caption && (
                    <div className="p-2.5 bg-card border-t border-border">
                      <p className="text-[11px] text-muted-foreground font-medium truncate">
                        {gallery.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground space-y-2">
              <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-xs">
                Belum ada screenshot yang diunggah ke galeri proyek.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT COLUMN: METADATA & SPECS (4 COLS) ================= */}
      <div className="lg:col-span-4 space-y-6">
        {/* Project Meta Card */}
        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Informasi & Spesifikasi Proyek
          </h3>

          <div className="space-y-3 divide-y divide-border/60 text-xs">
            <div className="flex items-center justify-between pt-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                Kategori
              </span>
              <span className="font-semibold text-foreground">
                {project.category?.name || "Uncategorized"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                Tahun Rilis
              </span>
              <span className="font-semibold text-foreground">
                {project.projectYear}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-muted-foreground">Nama Klien / Brand</span>
              <span className="font-semibold text-foreground">
                {project.clientName || "Internal Project"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-500" />
                Featured di Beranda
              </span>
              <span
                className={`font-semibold px-2 py-0.5 rounded-md text-[10px] ${
                  project.isFeatured
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {project.isFeatured ? "Ya (Featured)" : "Tidak"}
              </span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-muted-foreground">Urutan Tampilan</span>
              <span className="font-mono font-semibold text-foreground">
                #{project.order}
              </span>
            </div>
          </div>
        </div>

        {/* Tech Stacks & Tools Card */}
        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-500" />
              Tech Stacks ({project.techStacks?.length || 0})
            </h3>
            <Link href={`/projects/${project.id}/edit`}>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-[11px] px-2 text-emerald-600"
              >
                Ubah
              </Button>
            </Link>
          </div>

          {project.techStacks && project.techStacks.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.techStacks.map((stack) => (
                <div
                  key={stack.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 text-foreground border border-border text-xs font-medium"
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>{stack.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Belum ada tech stack yang ditautkan.
            </p>
          )}
        </div>

        {/* Action Links Card */}
        <div className="p-5 rounded-3xl border border-border bg-card shadow-xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tautan Eksternal
          </h3>

          <div className="space-y-2">
            {project.demoUrl ? (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-all group"
              >
                <div className="flex items-center gap-2 truncate">
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold truncate">
                    {project.demoUrl}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold shrink-0">
                  Buka Demo &rarr;
                </span>
              </a>
            ) : (
              <div className="p-3 rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
                Tidak ada URL Live Demo
              </div>
            )}

            {project.repositoryUrl ? (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl border border-border bg-muted/40 hover:bg-muted/70 text-foreground transition-all group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Github className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-semibold truncate">
                    {project.repositoryUrl}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground shrink-0">
                  Repo &rarr;
                </span>
              </a>
            ) : (
              <div className="p-3 rounded-2xl border border-dashed border-border text-muted-foreground text-xs">
                Tidak ada Repository Source Code
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox / Modal Zoom Screenshot */}
      {selectedGallery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-4xl w-full bg-card rounded-3xl overflow-hidden border border-border shadow-2xl space-y-2">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <p className="text-xs font-bold text-foreground">
                {selectedGallery.caption || "Screenshot Preview"}
              </p>
              <button
                onClick={() => setSelectedGallery(null)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black/50">
              <Image
                src={resolveMediaUrl(selectedGallery.imageUrl)}
                alt={selectedGallery.caption || "Screenshot"}
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
