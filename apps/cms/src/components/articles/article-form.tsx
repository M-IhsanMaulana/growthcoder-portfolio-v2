"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  Sparkles,
  Clock,
  FileText,
  Trash2,
  Calendar,
  Hash,
  Plus,
  X,
} from "lucide-react";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Combobox,
  FormError,
  FormRequiredMark,
} from "@/components/ui";
import { RichEditor } from "@/components/editor/rich-editor";
import { GoogleSerpPreview } from "./google-serp-preview";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { TaxonomyModal } from "@/components/taxonomies/taxonomy-modal";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import type { Article, ArticleStatus, Category, Tag } from "@growthcoder/types";

interface ArticleFormProps {
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

export function ArticleForm({ initialId }: ArticleFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialId);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [status, setStatus] = useState<ArticleStatus>("draft");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  // UI / Async States
  const [isFetching, setIsFetching] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [quickCatOpen, setQuickCatOpen] = useState(false);
  const [quickTagOpen, setQuickTagOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Fetch Taxonomy Masters
  const fetchTaxonomies = useCallback(async () => {
    try {
      const [catsRes, tagsRes] = await Promise.all([
        apiClient.get<Category[]>("/api/admin/categories"),
        apiClient.get<Tag[]>("/api/admin/tags"),
      ]);
      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data);
      }
      if (tagsRes.success && tagsRes.data) {
        setTags(tagsRes.data);
      }
    } catch (err) {
      console.error("Error fetching taxonomies:", err);
    }
  }, []);

  // Fetch Article if Editing
  const fetchArticleData = useCallback(async () => {
    if (!initialId) return;
    setIsFetching(true);
    try {
      const res = await apiClient.get<Article>(
        `/api/admin/articles/${initialId}`,
      );
      if (res.success && res.data) {
        const a = res.data;
        setTitle(a.title || "");
        setSlug(a.slug || "");
        setIsAutoSlug(false);
        setContent(a.content || "");
        setExcerpt(a.excerpt || "");
        setCoverImage(a.coverImage || null);
        setStatus(a.status || "draft");
        setCategoryId(a.categoryId || "");
        setSelectedTagIds(a.tags ? a.tags.map((t) => t.id) : []);
        setMetaTitle(a.metaTitle || "");
        setMetaDescription(a.metaDescription || "");
        if (a.publishedAt) {
          setPublishedAt(new Date(a.publishedAt).toISOString().slice(0, 16));
        }
        if (a.scheduledAt) {
          setScheduledAt(new Date(a.scheduledAt).toISOString().slice(0, 16));
        }
      } else {
        toast.error("Artikel tidak ditemukan.");
        router.push("/articles");
      }
    } catch (err) {
      console.error("Error fetching article:", err);
      toast.error("Gagal memuat artikel.");
    } finally {
      setIsFetching(false);
    }
  }, [initialId, router]);

  useEffect(() => {
    fetchTaxonomies();
    if (isEditing) {
      fetchArticleData();
    }
  }, [fetchTaxonomies, isEditing, fetchArticleData]);

  // Handle Title change
  const handleTitleChange = (val: string) => {
    setTitle(val);
    clearFieldError("title");
    if (isAutoSlug) {
      setSlug(generateSlug(val));
      clearFieldError("slug");
    }
    if (!metaTitle || metaTitle === title) {
      setMetaTitle(val);
    }
  };

  // Handle Excerpt change
  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    clearFieldError("excerpt");
    if (!metaDescription || metaDescription === excerpt) {
      setMetaDescription(val);
    }
  };

  // Word count & Reading time calculation
  const cleanText = content.replace(/<[^>]*>?/gm, "").trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Toggle Tag Selection
  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  // Quick Create Handlers
  const handleQuickCategorySuccess = (item: any) => {
    fetchTaxonomies();
    if (item.id) {
      setCategoryId(item.id);
      clearFieldError("categoryId");
    }
  };

  const handleQuickTagSuccess = (item: any) => {
    fetchTaxonomies();
    if (item.id) {
      setSelectedTagIds((prev) => [...prev, item.id]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Judul artikel wajib diisi";
    }
    const currentSlug = slug.trim() || generateSlug(title);
    if (!currentSlug) {
      newErrors.slug = "Slug URL wajib diisi";
    }
    if (!excerpt.trim()) {
      newErrors.excerpt = "Deskripsi singkat wajib diisi";
    }
    if (!content.trim() || content === "<p></p>") {
      newErrors.content = "Konten artikel tidak boleh kosong";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (submitStatus?: ArticleStatus) => {
    if (!validateForm()) {
      toast.error("Mohon lengkapi field artikel yang bertanda wajib diisi.");
      return;
    }

    const currentSlug = slug.trim() || generateSlug(title);

    setIsSubmitting(true);
    const targetStatus = submitStatus || status;

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: currentSlug.toLowerCase(),
      content,
      excerpt: excerpt.trim(),
      coverImage: coverImage || null,
      status: targetStatus,
      categoryId: categoryId || null,
      tagIds: selectedTagIds,
      metaTitle: metaTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || excerpt.trim(),
      readingTimeMinutes: readingTime,
    };

    if (targetStatus === "published" && publishedAt) {
      payload.publishedAt = new Date(publishedAt).toISOString();
    }

    if (targetStatus === "scheduled" && scheduledAt) {
      payload.scheduledAt = new Date(scheduledAt).toISOString();
    }

    try {
      const res = isEditing
        ? await apiClient.put<Article>(
            `/api/admin/articles/${initialId}`,
            payload,
          )
        : await apiClient.post<Article>("/api/admin/articles", payload);

      if (res.success && res.data) {
        toast.success(
          isEditing
            ? "Artikel berhasil diperbarui!"
            : targetStatus === "published"
              ? "Artikel berhasil dipublikasikan!"
              : "Draft artikel berhasil disimpan!",
        );
        router.push(`/articles/${res.data.id}`);
      } else {
        toast.error(res.message || "Gagal menyimpan artikel.");
      }
    } catch (err: unknown) {
      const e = err as Error & {
        message?: string;
        data?: {
          errors?:
            | Array<{ field: string; message: string }>
            | Record<string, string[]>;
        };
      };
      if (e.data?.errors) {
        const serverErrors: Record<string, string> = {};
        if (Array.isArray(e.data.errors)) {
          e.data.errors.forEach((errItem) => {
            if (errItem.field) serverErrors[errItem.field] = errItem.message;
          });
        } else if (typeof e.data.errors === "object") {
          Object.entries(e.data.errors).forEach(([k, v]) => {
            serverErrors[k] = Array.isArray(v) ? v[0] : String(v);
          });
        }
        setErrors(serverErrors);
      }
      toast.error(e.message || "Terjadi kesalahan pada server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Top Action Header */}
      <div className="sticky top-16 z-30 -mx-4 -mt-6 sm:-mx-6 sm:-mt-6 px-4 sm:px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href={isEditing ? `/articles/${initialId}` : "/articles"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title={
              isEditing
                ? "Kembali ke Detail Artikel"
                : "Kembali ke Daftar Artikel"
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-foreground">
              {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {isEditing
                ? `ID: ${initialId}`
                : "CKEditor 5 Developer Studio & SEO Engine"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSubmit("draft")}
            disabled={isSubmitting}
            className="text-xs rounded-xl"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1.5" />
            )}
            Simpan Draft
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => handleSubmit("published")}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 rounded-xl shadow-sm"
          >
            {isSubmitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
            ) : (
              <Send className="h-3.5 w-3.5 mr-1.5" />
            )}
            {isEditing ? "Perbarui Artikel" : "Publikasikan Sekarang"}
          </Button>
        </div>
      </div>

      {/* 2-Column Grid Studio */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Main Canvas & Editor (8 cols) */}
        <div className="space-y-6 lg:col-span-8">
          {/* Title & Slug Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center">
                <span>Judul Artikel</span>
                <FormRequiredMark />
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Masukkan judul artikel yang memikat..."
                className={`w-full bg-transparent text-2xl sm:text-3xl font-extrabold text-foreground placeholder:text-muted-foreground/40 focus:outline-none tracking-tight rounded-lg px-2 py-1 transition-all ${
                  errors.title
                    ? "border border-destructive ring-1 ring-destructive/20"
                    : ""
                }`}
                autoFocus={!isEditing}
              />
              <FormError message={errors.title} />
            </div>

            {/* Slug Bar */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-border/60 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-muted-foreground flex items-center">
                  URL Permalink <FormRequiredMark />:
                </span>
                <span className="font-mono text-muted-foreground/60">
                  growthcoder.id/artikel/
                </span>
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setIsAutoSlug(false);
                      clearFieldError("slug");
                    }}
                    placeholder="slug-artikel"
                    className={`w-full rounded-lg border bg-background px-2.5 py-1 font-mono text-xs text-emerald-600 dark:text-emerald-400 focus:border-emerald-500 focus:outline-none ${
                      errors.slug ? "border-destructive" : "border-border"
                    }`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAutoSlug(true);
                    setSlug(generateSlug(title));
                    clearFieldError("slug");
                  }}
                  className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                    isAutoSlug
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Sparkles className="h-3 w-3" /> Auto
                </button>
              </div>
              <FormError message={errors.slug} />
            </div>

            {/* Deskripsi Singkat (Excerpt) */}
            <div className="space-y-1.5 pt-2 border-t border-border/60">
              <label className="text-xs font-semibold text-muted-foreground flex items-center">
                <span>Deskripsi Singkat</span>
                <FormRequiredMark />
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="Tulis deskripsi ringkas 1-2 kalimat untuk preview kartu artikel dan meta description..."
                className={`w-full rounded-xl border bg-background p-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm resize-none ${
                  errors.excerpt ? "border-destructive" : "border-border"
                }`}
              />
              <FormError message={errors.excerpt} />
            </div>
          </div>

          {/* Editor Container */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground text-sm flex items-center">
                  <span>Konten Artikel</span>
                  <FormRequiredMark />
                </h3>
              </div>

              {/* Stats Badge */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5 text-emerald-500" />
                  {wordCount} kata
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />~
                  {readingTime} min baca
                </span>
              </div>
            </div>

            {/* Rich Editor Canvas */}
            <div
              className={
                errors.content ? "border border-destructive rounded-xl p-1" : ""
              }
            >
              <RichEditor
                value={content}
                onChange={(val) => {
                  setContent(val);
                  clearFieldError("content");
                }}
                placeholder="Mulai menulis konten artikel teknis atau tutorial Anda..."
              />
            </div>
            <FormError message={errors.content} />
          </div>
        </div>

        {/* Right Column: Studio Sidebar (4 cols) */}
        <div className="space-y-6 lg:col-span-4">
          {/* Cover Image Picker Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Gambar Sampul (Cover)
              </h4>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="text-xs text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Hapus
                </button>
              )}
            </div>

            {coverImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveMediaUrl(coverImage)}
                  alt="Cover Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setCoverPickerOpen(true)}
                    className="bg-white/90 text-neutral-900 hover:bg-white text-xs font-medium shadow-md"
                  >
                    Ganti Gambar
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setCoverPickerOpen(true)}
                className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center cursor-pointer hover:border-emerald-500/50 hover:bg-muted/50 transition-all"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                  <ImageIcon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium text-foreground">
                  Pilih dari Media Library
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  Rasio rekomendasi 16:9
                </p>
              </div>
            )}
          </div>

          {/* Publishing Settings Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Pengaturan Publikasi
            </h4>

            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Status Artikel
              </label>
              <Select
                value={status}
                onValueChange={(val) => setStatus(val as ArticleStatus)}
              >
                <SelectTrigger className="w-full h-10 text-sm">
                  <SelectValue placeholder="Pilih status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span>Draft (Disimpan privat)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="published" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>Published (Tayang publik)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="scheduled" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                      <span>Scheduled (Terjadwal)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Picker if Scheduled */}
            {status === "scheduled" && (
              <div className="space-y-1.5 animate-in fade-in duration-200">
                <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  Jadwal Publikasi Otomatis
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2 px-3 text-xs text-foreground focus:border-emerald-500 focus:outline-none shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Taxonomies Card */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Taksonomi & Kategori
            </h4>

            {/* Category Select (Searchable Combobox) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Kategori Artikel
                </label>
                <button
                  type="button"
                  onClick={() => setQuickCatOpen(true)}
                  className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="h-3 w-3" /> Buat Baru
                </button>
              </div>
              <Combobox
                options={categories.map((c) => ({
                  value: c.id,
                  label: c.name,
                  description:
                    c.description || (c.slug ? `/${c.slug}` : undefined),
                  icon: <Sparkles className="h-4 w-4 text-emerald-500" />,
                }))}
                value={categoryId}
                onValueChange={(val) => {
                  setCategoryId(val);
                  clearFieldError("categoryId");
                }}
                placeholder="Pilih Kategori Artikel..."
                searchPlaceholder="Cari nama kategori..."
                emptyText="Kategori tidak ditemukan"
                clearable
              />
              <FormError message={errors.categoryId} />
            </div>

            {/* Tags Multi-select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">
                  Tags (Multi-tagging)
                </label>
                <button
                  type="button"
                  onClick={() => setQuickTagOpen(true)}
                  className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  <Plus className="h-3 w-3" /> Buat Tag
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1.5 rounded-xl border border-border bg-muted/20">
                {tags.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground p-2">
                    Belum ada tag master
                  </p>
                ) : (
                  tags.map((tag) => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => toggleTag(tag.id)}
                        className={`rounded-lg px-2 py-1 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : "bg-card text-muted-foreground border border-border hover:text-foreground"
                        }`}
                      >
                        <Hash className="h-3 w-3" />
                        {tag.name}
                        {isSelected && <X className="h-2.5 w-2.5 ml-0.5" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* SEO & SERP Preview Card */}
          <GoogleSerpPreview
            title={metaTitle || title}
            slug={slug || "url-artikel"}
            description={metaDescription || excerpt}
          />

          {/* Meta SEO Detail Inputs */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Konfigurasi Meta SEO
            </h4>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-foreground">
                Custom Meta Title
              </label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                placeholder={title || "Judul artikel"}
                className="w-full rounded-xl border border-border bg-background py-1.5 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none shadow-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-foreground">
                Custom Meta Description
              </label>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                placeholder={excerpt || "Deskripsi artikel"}
                className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-emerald-500 focus:outline-none shadow-sm resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Dialog for Cover Image */}
      <MediaPickerDialog
        open={coverPickerOpen}
        onOpenChange={setCoverPickerOpen}
        multiple={false}
        acceptTypes={["image"]}
        title="Pilih Gambar Sampul Artikel"
        onSelect={(selected) => {
          const asset = Array.isArray(selected) ? selected[0] : selected;
          if (asset) {
            setCoverImage(asset.fileUrl);
          }
        }}
      />

      {/* Quick Create Modals */}
      <TaxonomyModal
        open={quickCatOpen}
        onOpenChange={setQuickCatOpen}
        type="category"
        onSuccess={handleQuickCategorySuccess}
      />

      <TaxonomyModal
        open={quickTagOpen}
        onOpenChange={setQuickTagOpen}
        type="tag"
        onSuccess={handleQuickTagSuccess}
      />
    </div>
  );
}
