"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Save,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  Github,
  Star,
  FileText,
  Plus,
} from "lucide-react";
import {
  Button,
  Input,
  Textarea,
  Combobox,
  FormError,
  FormRequiredMark,
} from "@/components/ui";
import { Label, Switch } from "@growthcoder/ui";
import { RichEditor } from "@/components/editor/rich-editor";
import {
  ProjectGalleryManager,
  GalleryItemState,
} from "./project-gallery-manager";
import { TechStackMultiSelector } from "./tech-stack-multi-selector";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { TaxonomyModal } from "@/components/taxonomies/taxonomy-modal";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type {
  Project,
  ProjectCategory,
  TechStack,
  MediaAsset,
} from "@growthcoder/types";

interface ProjectFormProps {
  initialId?: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function resolveMediaUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  return `${baseUrl}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function ProjectForm({ initialId }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialId);

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [role, setRole] = useState("");
  const [projectYear, setProjectYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [demoUrl, setDemoUrl] = useState("");
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [order, setOrder] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTechStackIds, setSelectedTechStackIds] = useState<string[]>(
    [],
  );
  const [galleries, setGalleries] = useState<GalleryItemState[]>([]);

  // Async / Select Options states
  const [categories, setCategories] = useState<ProjectCategory[]>([]);
  const [techStacks, setTechStacks] = useState<TechStack[]>([]);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modals
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [quickCatOpen, setQuickCatOpen] = useState(false);

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Load masters (Categories & Tech Stacks)
  const fetchMasters = useCallback(async () => {
    try {
      const [catsRes, stacksRes] = await Promise.all([
        apiClient.get<ProjectCategory[]>("/api/admin/project-categories"),
        apiClient.get<TechStack[]>("/api/admin/tech-stacks"),
      ]);
      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data);
      }
      if (stacksRes.success && stacksRes.data) {
        setTechStacks(stacksRes.data);
      }
    } catch (err) {
      console.error("Error fetching project form masters:", err);
    }
  }, []);

  // Load project for edit
  const fetchProjectData = useCallback(async () => {
    if (!initialId) return;
    setIsFetching(true);
    try {
      const res = await apiClient.get<Project>(
        `/api/admin/projects/${initialId}`,
      );
      if (res.success && res.data) {
        const p = res.data;
        setTitle(p.title);
        setSlug(p.slug);
        setIsAutoSlug(false);
        setExcerpt(p.excerpt || "");
        setContent(p.content || "");
        setClientName(p.clientName || "");
        setRole(p.role || "");
        setProjectYear(p.projectYear || new Date().getFullYear());
        setCoverImage(p.coverImage);
        setDemoUrl(p.demoUrl || "");
        setRepositoryUrl(p.repositoryUrl || "");
        setIsFeatured(Boolean(p.isFeatured));
        setOrder(p.order || 0);
        setCategoryId(p.categoryId || "");
        setSelectedTechStackIds(
          p.techStacks ? p.techStacks.map((s) => s.id) : [],
        );
        setGalleries(
          p.galleries
            ? p.galleries.map((g) => ({
                id: g.id,
                imageUrl: g.imageUrl,
                caption: g.caption || "",
                sortOrder: g.sortOrder || 0,
              }))
            : [],
        );
      } else {
        toast.error("Data proyek tidak ditemukan");
        router.push("/projects");
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat detail proyek");
    } finally {
      setIsFetching(false);
    }
  }, [initialId, router]);

  useEffect(() => {
    fetchMasters();
    if (isEditing) {
      fetchProjectData();
    }
  }, [fetchMasters, isEditing, fetchProjectData]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    clearFieldError("title");
    if (isAutoSlug) {
      setSlug(generateSlug(val));
      clearFieldError("slug");
    }
  };

  const handleSelectCover = (asset: MediaAsset | MediaAsset[]) => {
    const selected = Array.isArray(asset) ? asset[0] : asset;
    if (selected) {
      setCoverImage(selected.fileUrl);
      clearFieldError("coverImage");
      toast.success("Cover image berhasil dipilih");
    }
  };

  // Insert case study template
  const handleInsertCaseStudyTemplate = () => {
    const template = `
<h2>1. Background & Problem Statement</h2>
<p>Jelaskan latar belakang permasalahan bisnis, tantangan teknis, atau kebutuhan sistem yang harus dipecahkan...</p>

<h2>2. Technical Solution & System Design</h2>
<p>Rincian arsitektur sistem, pemilihan teknologi, dan pendekatan teknis yang diterapkan untuk menyelesaikan masalah...</p>

<h2>3. Architecture & Tech Decisions</h2>
<p>Jelaskan keputusan arsitektural penting (misal: SSR vs SPA, caching strategy, event-driven pattern, skema database)...</p>

<h2>4. Key Results & Business Impact</h2>
<p>Hasil terukur yang dicapai, seperti performa Core Web Vitals, efisiensi waktu, atau metrik pertumbuhan bisnis...</p>
`;
    if (
      !content.trim() ||
      confirm("Sisipkan template studi kasus ke dalam editor?")
    ) {
      setContent((prev) => (prev ? prev + "<hr/>" + template : template));
      toast.info("Template studi kasus berhasil disisipkan");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Judul proyek wajib diisi";
    }
    const finalSlug = slug.trim() || generateSlug(title);
    if (!finalSlug) {
      newErrors.slug = "Slug URL wajib diisi";
    }
    if (!excerpt.trim()) {
      newErrors.excerpt = "Ringkasan singkat (excerpt) proyek wajib diisi";
    }
    if (!coverImage) {
      newErrors.coverImage =
        "Cover image proyek wajib dipilih dari Media Library";
    }
    if (!projectYear || projectYear < 1990 || projectYear > 2100) {
      newErrors.projectYear =
        "Tahun proyek harus berupa angka valid (misal: 2024)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Mohon lengkapi field proyek yang bertanda wajib diisi.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      excerpt: excerpt.trim(),
      content: content.trim() || "<p></p>",
      clientName: clientName.trim() || null,
      role: role.trim() || null,
      projectYear: Number(projectYear) || new Date().getFullYear(),
      coverImage: coverImage,
      demoUrl: demoUrl.trim() || null,
      repositoryUrl: repositoryUrl.trim() || null,
      isFeatured,
      order: Number(order) || 0,
      categoryId: categoryId || null,
      techStackIds: selectedTechStackIds,
      galleries: galleries.map((g, idx) => ({
        imageUrl: g.imageUrl,
        caption: g.caption?.trim() || null,
        sortOrder: idx,
      })),
    };

    try {
      if (isEditing && initialId) {
        await apiClient.put(`/api/admin/projects/${initialId}`, payload);
        toast.success(`Proyek "${payload.title}" berhasil diperbarui!`);
      } else {
        await apiClient.post("/api/admin/projects", payload);
        toast.success(`Proyek "${payload.title}" berhasil dipublikasikan!`);
      }
      router.push("/projects");
    } catch (err: unknown) {
      const error = err as {
        message?: string;
        data?: {
          errors?:
            | Array<{ field: string; message: string }>
            | Record<string, string[]>;
        };
      };
      if (error.data?.errors) {
        const serverErrors: Record<string, string> = {};
        if (Array.isArray(error.data.errors)) {
          error.data.errors.forEach((errItem) => {
            if (errItem.field) serverErrors[errItem.field] = errItem.message;
          });
        } else if (typeof error.data.errors === "object") {
          Object.entries(error.data.errors).forEach(([k, v]) => {
            serverErrors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
        setErrors(serverErrors);
      }
      toast.error(error.message || "Gagal menyimpan data proyek");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm text-muted-foreground font-medium">
          Memuat data proyek...
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 w-full pb-16"
        noValidate
      >
        {/* Top Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-16 z-20 py-3 bg-background/90 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-3">
            <Link href="/projects">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 px-3 text-xs"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-foreground sm:text-xl flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-500" />
                {isEditing
                  ? `Edit Proyek: ${title || "Untitled"}`
                  : "Buat Proyek Portofolio Baru"}
              </h1>
              <p className="text-[11px] text-muted-foreground">
                {isEditing
                  ? "Perbarui detail studi kasus, tech stacks, dan galeri screenshot"
                  : "Publikasikan studi kasus teknis dan karya portofolio unggulan"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/projects">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 text-xs"
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-1.5" />
                  {isEditing ? "Simpan Perubahan" : "Publikasikan Proyek"}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 2-Column Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ================= LEFT COLUMN: MAIN CONTENT (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card 1: Title & Slug & Excerpt */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="project-title"
                  className="text-xs font-semibold"
                >
                  Judul Proyek <FormRequiredMark />
                </Label>
                <Input
                  id="project-title"
                  placeholder="e.g. GrowthCoder - High-Performance Developer Portfolio & CMS"
                  value={title}
                  onChange={handleTitleChange}
                  error={errors.title}
                  className="text-base font-semibold h-11"
                />
                <FormError message={errors.title} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="project-slug"
                    className="text-xs font-semibold"
                  >
                    Slug URL <FormRequiredMark />
                  </Label>
                  <button
                    type="button"
                    onClick={() => setIsAutoSlug(!isAutoSlug)}
                    className="text-[11px] text-muted-foreground hover:text-emerald-500 font-medium"
                  >
                    {isAutoSlug ? "Mode Manual" : "Auto-Sync dari Judul"}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-lg border border-border">
                    /proyek/
                  </span>
                  <Input
                    id="project-slug"
                    placeholder="growthcoder-developer-portfolio"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsAutoSlug(false);
                      clearFieldError("slug");
                    }}
                    error={errors.slug}
                    className="font-mono text-xs h-9 flex-1"
                  />
                </div>
                <FormError message={errors.slug} />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="project-excerpt"
                  className="text-xs font-semibold"
                >
                  Ringkasan Singkat (Excerpt) <FormRequiredMark />
                </Label>
                <Textarea
                  id="project-excerpt"
                  rows={3}
                  placeholder="Ringkasan 1-2 kalimat tentang apa yang dibangun, nilai bisnis yang dihadirkan, dan highlight teknologi..."
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    clearFieldError("excerpt");
                  }}
                  error={errors.excerpt}
                  className="text-xs"
                />
                <FormError message={errors.excerpt} />
              </div>
            </div>

            {/* Card 2: Structured Case Study Editor (CKEditor 5) */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-border pb-3">
                <div>
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Studi Kasus Lengkap (Case Study Story)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Tuliskan narasi teknis, perancangan arsitektur, dan hasil
                    terukur.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleInsertCaseStudyTemplate}
                  className="h-8 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  Sisipkan Format Studi Kasus
                </Button>
              </div>

              <div className="pt-1">
                <RichEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Tuliskan narasi studi kasus teknis proyek di sini..."
                />
              </div>
            </div>

            {/* Card 3: Project Screenshot Gallery Manager */}
            <div className="p-5 rounded-2xl border border-border bg-card shadow-2xs">
              <ProjectGalleryManager
                items={galleries}
                onChange={setGalleries}
              />
            </div>
          </div>

          {/* ================= RIGHT COLUMN: METADATA & SETTINGS (4 COLS) ================= */}
          <div className="lg:col-span-4 space-y-5">
            {/* Section 1: Cover Image Picker */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-500" />
                  Cover Image Proyek <FormRequiredMark />
                </Label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage(null)}
                    className="text-[11px] text-destructive hover:underline"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {coverImage ? (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-border/80 bg-muted/30 group">
                  <Image
                    src={resolveMediaUrl(coverImage)}
                    alt="Project Cover"
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setCoverPickerOpen(true)}
                      className="text-xs h-8 bg-white/10 hover:bg-white/20 text-white border-white/20"
                    >
                      Ganti Cover
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setCoverPickerOpen(true)}
                  className={`aspect-video rounded-xl border border-dashed hover:border-emerald-500/50 bg-muted/20 hover:bg-muted/40 transition-colors flex flex-col items-center justify-center p-4 text-center cursor-pointer space-y-2 ${
                    errors.coverImage
                      ? "border-destructive bg-destructive/5"
                      : "border-border"
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-muted text-muted-foreground">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-medium text-foreground">
                    Pilih Cover Image
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Dari Media Library
                  </p>
                </div>
              )}
              <FormError message={errors.coverImage} />
            </div>

            {/* Section 2: Category & Tech Stacks */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="project-category"
                    className="text-xs font-semibold"
                  >
                    Kategori Proyek
                  </Label>
                  <button
                    type="button"
                    onClick={() => setQuickCatOpen(true)}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    Kategori Baru
                  </button>
                </div>

                <Combobox
                  options={categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                    description:
                      cat.description ||
                      (cat.slug ? `/${cat.slug}` : undefined),
                    icon: <Briefcase className="h-4 w-4 text-emerald-500" />,
                  }))}
                  value={categoryId}
                  onValueChange={setCategoryId}
                  placeholder="Pilih Kategori Proyek..."
                  searchPlaceholder="Cari kategori..."
                  emptyText="Kategori tidak ditemukan"
                  clearable
                />
              </div>

              {/* Tech Stack Multi-Selector */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-semibold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-500" />
                  Tech Stacks & Tools
                </Label>
                <TechStackMultiSelector
                  availableStacks={techStacks}
                  selectedIds={selectedTechStackIds}
                  onChange={setSelectedTechStackIds}
                />
              </div>
            </div>

            {/* Section 3: Project Meta (Year & Client) */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="project-year"
                    className="text-xs font-semibold"
                  >
                    Tahun Proyek <FormRequiredMark />
                  </Label>
                  <Input
                    id="project-year"
                    type="number"
                    min={2000}
                    max={2100}
                    value={projectYear}
                    onChange={(e) => {
                      setProjectYear(
                        parseInt(e.target.value) || new Date().getFullYear(),
                      );
                      clearFieldError("projectYear");
                    }}
                    error={errors.projectYear}
                    className="h-8.5 text-xs font-mono"
                  />
                  <FormError message={errors.projectYear} />
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="project-order"
                    className="text-xs font-semibold"
                  >
                    Urutan Tampilan
                  </Label>
                  <Input
                    id="project-order"
                    type="number"
                    min={0}
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                    className="h-8.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="project-client"
                  className="text-xs font-semibold"
                >
                  Nama Klien / Perusahaan
                </Label>
                <Input
                  id="project-client"
                  placeholder="e.g. PT Tech Innovator, Personal Project"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="h-8.5 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="project-role"
                  className="text-xs font-semibold"
                >
                  Peran / Tanggung Jawab (Role)
                </Label>
                <Input
                  id="project-role"
                  placeholder="e.g. Full-Stack Developer, Lead Architect"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-8.5 text-xs"
                />
              </div>
            </div>

            {/* Section 4: Action Links */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                Tautan Proyek (Links)
              </h4>

              <div className="space-y-1.5">
                <Label
                  htmlFor="project-demo"
                  className="text-[11px] text-muted-foreground"
                >
                  Live Demo / URL Website
                </Label>
                <Input
                  id="project-demo"
                  type="url"
                  placeholder="https://example.com"
                  value={demoUrl}
                  onChange={(e) => setDemoUrl(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="project-repo"
                  className="text-[11px] text-muted-foreground flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  Repository GitHub / Source Code
                </Label>
                <Input
                  id="project-repo"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repositoryUrl}
                  onChange={(e) => setRepositoryUrl(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Section 5: Highlight Featured Switch */}
            <div
              onClick={() => setIsFeatured(!isFeatured)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none bg-card shadow-2xs ${
                isFeatured
                  ? "border-amber-500/40 bg-amber-500/5"
                  : "border-border hover:border-border/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl transition-colors ${
                      isFeatured
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 transition-all ${
                        isFeatured
                          ? "fill-amber-500 text-amber-500 scale-110"
                          : ""
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Featured Project
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Tampilkan di section Bento Grid Beranda
                    </p>
                  </div>
                </div>
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                    aria-label="Toggle Featured Project"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Cover Image Picker Dialog */}
      <MediaPickerDialog
        open={coverPickerOpen}
        onOpenChange={setCoverPickerOpen}
        onSelect={handleSelectCover}
        multiple={false}
        acceptTypes={["image"]}
        title="Pilih Cover Image Proyek dari Media Library"
      />

      {/* Quick Category Modal */}
      <TaxonomyModal
        open={quickCatOpen}
        onOpenChange={setQuickCatOpen}
        type="project-category"
        onSuccess={(created) => {
          if (created.id) {
            setCategories((prev) => [
              {
                id: created.id!,
                name: created.name,
                slug: created.slug,
                description: created.description,
                order: created.order || 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              ...prev,
            ]);
            setCategoryId(created.id);
            toast.success(
              `Kategori "${created.name}" berhasil dibuat & dipilih`,
            );
          }
        }}
      />
    </>
  );
}
