import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SiteLayout } from "@/components/site-layout";
import {
  getSiteSettings,
  getArticleBySlug,
  getAdjacentArticles,
  getRelatedArticles,
  resolveMediaUrl,
} from "@/lib/api";
import { BlogReadingProgress } from "@/components/blog/blog-reading-progress";
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents";
import { ArticleContentRenderer } from "@/components/blog/article-content-renderer";
import { extractTocFromContent } from "@/lib/toc";
import { BlogShareButtons } from "@/components/blog/blog-share-buttons";
import { AuthorBioCard } from "@/components/blog/author-bio-card";
import { ArticleAdjacentNav } from "@/components/blog/article-adjacent-nav";
import { RelatedArticles } from "@/components/blog/related-articles";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Home,
} from "lucide-react";
import { Button } from "@growthcoder/ui";

export const revalidate = 60; // ISR revalidation 60s

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string; token?: string }>;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "Terbaru";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const isPreview = search.preview === "true" || search.preview === "1";
  const token = search.token;

  const [settings, article] = await Promise.all([
    getSiteSettings(),
    getArticleBySlug(slug, { preview: isPreview, token }),
  ]);

  if (!article) {
    return {
      title: `Artikel Tidak Ditemukan — ${settings.profile.siteName}`,
    };
  }

  const title =
    article.metaTitle || `${article.title} — ${settings.profile.siteName}`;
  const description = article.metaDescription || article.excerpt;
  const ogImage = article.coverImage || settings.seo.ogImageUrl;

  return {
    title,
    description,
    keywords: article.tags?.map((t) => t.name) || [
      "Software Engineering",
      "TypeScript",
      "Next.js",
      "AdonisJS",
    ],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt || article.createdAt,
      authors: [settings.profile.ownerName || "Muhammad Ihsan Maulana"],
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({
  params,
  searchParams,
}: ArticleDetailPageProps) {
  const { slug } = await params;
  const search = searchParams ? await searchParams : {};
  const isPreview = search.preview === "true" || search.preview === "1";
  const token = search.token;

  const [settings, article] = await Promise.all([
    getSiteSettings(),
    getArticleBySlug(slug, { preview: isPreview, token }),
  ]);

  if (!article) {
    notFound();
  }

  const [adjacent, related] = await Promise.all([
    getAdjacentArticles(article.slug),
    getRelatedArticles(
      article.slug,
      article.categoryId,
      article.tags?.map((t) => t.slug),
    ),
  ]);

  const tocItems = extractTocFromContent(article.content);

  const breadcrumbItems = [
    { name: "Beranda", url: "https://growthcoder.id" },
    { name: "Blog", url: "https://growthcoder.id/blog" },
    ...(article.category
      ? [
          {
            name: article.category.name,
            url: `https://growthcoder.id/blog?category=${article.category.slug || article.category.id}`,
          },
        ]
      : []),
    { name: article.title, url: `https://growthcoder.id/blog/${article.slug}` },
  ];

  return (
    <SiteLayout settings={settings}>
      {/* Draft Preview Indicator Banner */}
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-md text-amber-950 px-4 py-2 text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-md">
          <Sparkles className="h-4 w-4 shrink-0" />
          <span>
            Mode Pratinjau Draft: Artikel ini belum dipublikasikan ke publik.
          </span>
        </div>
      )}

      {/* Top Reading Progress Bar */}
      <BlogReadingProgress />

      {/* Structured Data (Schema.org JSON-LD) */}
      <ArticleJsonLd article={article} settings={settings} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <article className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/10 dark:bg-primary/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Article Header Container (Full width inside max-w-7xl) */}
          <header className="w-full mb-10 text-left">
            {/* Breadcrumb Navigation (Exact same style as projects) */}
            <nav
              className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono mb-8"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="hover:text-foreground transition-colors"
              >
                Beranda
              </Link>

              <ChevronRight className="h-3 w-3" />

              <Link
                href="/blog"
                className="hover:text-foreground transition-colors"
              >
                Blog
              </Link>

              {article.category && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <Link
                    href={`/blog?category=${article.category.slug || article.category.id}`}
                    className="hover:text-primary transition-colors text-foreground/80"
                  >
                    {article.category.name}
                  </Link>
                </>
              )}

              <ChevronRight className="h-3 w-3" />

              <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
                {article.title}
              </span>
            </nav>

            {/* Category / Primary Tag Pill */}
            <div className="flex items-center gap-2 mb-5">
              <Link
                href={
                  article.category
                    ? `/blog?category=${article.category.slug}`
                    : "/blog"
                }
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 hover:bg-primary/20 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{article.category?.name || "Blog & Catatan"}</span>
              </Link>
            </div>

            {/* Article Main Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-foreground leading-[1.18] mb-6">
              {article.title}
            </h1>

            {/* Article Excerpt */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-4xl">
              {article.excerpt}
            </p>

            {/* Article Meta Bar (View Counter completely excluded) */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-border/50 text-xs sm:text-sm text-muted-foreground font-mono">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative w-7 h-7 rounded-full overflow-hidden border border-primary/40">
                    {settings.profile.avatarUrl ? (
                      <Image
                        src={resolveMediaUrl(settings.profile.avatarUrl)}
                        alt="Author"
                        fill
                        unoptimized={
                          settings.profile.avatarUrl.includes("localhost") ||
                          settings.profile.avatarUrl.includes("127.0.0.1")
                        }
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                        GC
                      </div>
                    )}
                  </div>
                  <span className="font-sans font-medium text-foreground">
                    {settings.profile.ownerName || "Muhammad Ihsan Maulana"}
                  </span>
                </div>

                <span>&bull;</span>

                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>

                <span>&bull;</span>

                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary" />
                  {article.readingTimeMinutes || 6} min baca
                </span>
              </div>

              {/* Quick Share Buttons in Header */}
              <div className="hidden sm:block">
                <BlogShareButtons title={article.title} slug={article.slug} />
              </div>
            </div>
          </header>

          {/* Featured Cover Image (Full width of container) */}
          {article.coverImage && (
            <div className="w-full my-8 sm:my-12">
              <div className="relative aspect-[21/10] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden border border-border/80 shadow-2xl bg-muted">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1280px"
                />
              </div>
            </div>
          )}

          {/* 2-Column Content Grid: Left Sticky Sidebar (TOC & Share) + Right Article Body */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-10 lg:gap-14 pt-4">
            {/* Left Sidebar (Desktop TOC + Sticky Share Bar) */}
            <aside className="hidden lg:block space-y-8">
              <BlogTableOfContents items={tocItems} variant="desktop" />

              <div className="pt-6 border-t border-border/40">
                <BlogShareButtons
                  title={article.title}
                  slug={article.slug}
                  showLabel
                />
              </div>

              {/* Back to Blog catalog link */}
              <div className="pt-4">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5 -ml-2"
                >
                  <Link href="/blog">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Kembali ke Semua Artikel</span>
                  </Link>
                </Button>
              </div>
            </aside>

            {/* Right Main Article Content Body */}
            <main className="min-w-0">
              {/* Mobile Table of Contents */}
              <BlogTableOfContents items={tocItems} variant="mobile" />

              {/* Rich Content Renderer (HTML/Markdown + Terminal Code Blocks) */}
              <div className="article-body">
                <ArticleContentRenderer content={article.content} />
              </div>

              {/* Tags Cloud at bottom of article */}
              {article.tags && article.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-border/40">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground mr-1">
                      Topik:
                    </span>
                    {article.tags.map((t) => (
                      <Link
                        key={t.id || t.slug}
                        href={`/blog?tag=${t.slug}`}
                        className="px-3 py-1 rounded-lg text-xs font-mono bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-border/40 transition-all cursor-pointer"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Share Buttons on Mobile */}
              <div className="my-8 pt-6 border-t border-border/40 flex items-center justify-between">
                <BlogShareButtons title={article.title} slug={article.slug} />
              </div>

              {/* Author Bio Box */}
              <AuthorBioCard profile={settings.profile} />

              {/* Previous & Next Article Navigation */}
              <ArticleAdjacentNav prev={adjacent.prev} next={adjacent.next} />
            </main>
          </div>

          {/* Full-width Related Articles Section (Aligned with Header and Featured Cover Image) */}
          <RelatedArticles articles={related} />
        </div>
      </article>

      {/* Bottom Lead Capture CTA */}
      <LeadCaptureCta profile={settings.profile} />
    </SiteLayout>
  );
}
