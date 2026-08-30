import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/site-layout";
import {
  getSiteSettings,
  getProjectBySlug,
  getAdjacentProjects,
  getAllProjects,
  FALLBACK_ALL_PROJECTS,
} from "@/lib/api";
import { ProjectActionBar } from "@/components/projects/project-action-bar";
import { ProjectCaseStudyContent } from "@/components/projects/project-case-study-content";
import { ProjectGalleryLightbox } from "@/components/projects/project-gallery-lightbox";
import { ProjectAdjacentNav } from "@/components/projects/project-adjacent-nav";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";
import { ProjectJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { TechStackIcon } from "@/components/tech-stack-icon";
import {
  ChevronRight,
  Layers,
  Calendar,
  Building,
  Sparkles,
  CheckCircle2,
  UserCheck,
} from "lucide-react";

export const revalidate = 60; // ISR

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  try {
    const { data } = await getAllProjects({ perPage: 20 });
    const list = data.length > 0 ? data : FALLBACK_ALL_PROJECTS;
    return list.map((project) => ({
      slug: project.slug,
    }));
  } catch {
    return FALLBACK_ALL_PROJECTS.map((project) => ({
      slug: project.slug,
    }));
  }
}

export async function generateMetadata({
  params,
}: ProjectDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, project] = await Promise.all([
    getSiteSettings(),
    getProjectBySlug(slug),
  ]);

  if (!project) {
    return {
      title: `Proyek Tidak Ditemukan — ${settings.profile.siteName}`,
      description: "Halaman studi kasus proyek tidak ditemukan.",
    };
  }

  const title = `${project.title} — Studi Kasus ${settings.profile.siteName}`;
  const description = project.excerpt;
  const ogImage = project.coverImage || settings.seo.ogImageUrl;

  return {
    title,
    description,
    keywords: [
      project.title,
      project.category?.name || "Software Project",
      ...(project.techStacks?.map((t) => t.name) || []),
      "Studi Kasus",
      "Software Engineering",
    ],
    openGraph: {
      title,
      description,
      type: "article",
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

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;
  const [settings, project, adjacent] = await Promise.all([
    getSiteSettings(),
    getProjectBySlug(slug),
    getAdjacentProjects(slug),
  ]);

  if (!project) {
    notFound();
  }

  const breadcrumbItems = [
    { name: "Beranda", url: "https://growthcoder.id" },
    { name: "Proyek", url: "https://growthcoder.id/projects" },
    ...(project.category
      ? [
          {
            name: project.category.name,
            url: `https://growthcoder.id/projects?category=${project.category.slug || project.category.id}`,
          },
        ]
      : []),
    {
      name: project.title,
      url: `https://growthcoder.id/projects/${project.slug}`,
    },
  ];

  return (
    <SiteLayout settings={settings}>
      {/* Structured Data (Schema.org JSON-LD) */}
      <ProjectJsonLd project={project} settings={settings} />
      <BreadcrumbJsonLd items={breadcrumbItems} />

      <article className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-primary/10 dark:bg-primary/15 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            className="flex items-center gap-2 text-xs text-muted-foreground font-mono mb-8"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              Beranda
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href="/projects"
              className="hover:text-foreground transition-colors"
            >
              Proyek
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium truncate max-w-xs sm:max-w-md">
              {project.title}
            </span>
          </nav>

          {/* Hero Header Section */}
          <div className="max-w-4xl mb-10 sm:mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {project.category && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary dark:text-emerald-400 border border-primary/25">
                  {project.category.name}
                </span>
              )}
              {project.role && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>{project.role}</span>
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-muted/80 text-muted-foreground border border-border/50">
                Tahun {project.projectYear || 2026}
              </span>
              {project.isFeatured && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Studi Kasus Unggulan</span>
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight text-foreground leading-[1.2] mb-4">
              {project.title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {project.excerpt}
            </p>
          </div>

          {/* Main Cover Showcase Banner */}
          <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-border/70 bg-muted mb-12 sm:mb-16 shadow-lg">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-cover object-top"
              />
            ) : null}
          </div>

          {/* 2-Column Responsive Grid (Main Content vs Sticky Meta Sidebar) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-16">
            {/* Left Column: Structured Case Study & Lightbox (Span 8) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Case Study Body */}
              <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm">
                <ProjectCaseStudyContent content={project.content} />
              </div>

              {/* Screenshot Lightbox Gallery */}
              {project.galleries && project.galleries.length > 0 && (
                <div className="bg-card/40 backdrop-blur-xl border border-border/60 rounded-3xl p-6 sm:p-10 shadow-sm">
                  <ProjectGalleryLightbox
                    galleries={project.galleries}
                    projectTitle={project.title}
                  />
                </div>
              )}
            </div>

            {/* Right Column: Sticky Sidebar Meta Information (Span 4) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              {/* Action Links & Share Card */}
              <div className="p-6 sm:p-7 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl shadow-sm space-y-6">
                <h3 className="text-base font-bold font-heading text-foreground">
                  Aksi &amp; Tautan Proyek
                </h3>

                <ProjectActionBar project={project} />
              </div>

              {/* Meta Detail Summary Card */}
              <div className="p-6 sm:p-7 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl shadow-sm space-y-5">
                <h3 className="text-base font-bold font-heading text-foreground border-b border-border/40 pb-3">
                  Informasi Proyek
                </h3>

                <div className="space-y-4 text-sm">
                  {project.role && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <UserCheck className="h-4 w-4 text-primary" />
                        <span>Peran</span>
                      </span>
                      <span className="font-semibold text-foreground font-heading text-right">
                        {project.role}
                      </span>
                    </div>
                  )}

                  {project.clientName && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Building className="h-4 w-4 text-primary" />
                        <span>Klien</span>
                      </span>
                      <span className="font-semibold text-foreground font-heading">
                        {project.clientName}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span>Tahun Pengerjaan</span>
                    </span>
                    <span className="font-mono text-foreground font-medium">
                      {project.projectYear || 2026}
                    </span>
                  </div>

                  {project.category && (
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground">Kategori</span>
                      <span className="font-medium text-foreground">
                        {project.category.name}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <span className="text-muted-foreground">Status Sistem</span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Production Ready</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tech Stacks Tag List Card */}
              {project.techStacks && project.techStacks.length > 0 && (
                <div className="p-6 sm:p-7 rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-border/40 pb-3">
                    <h3 className="text-base font-bold font-heading text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-primary" />
                      <span>Teknologi Digunakan</span>
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground">
                      {project.techStacks.length} Stack
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.techStacks.map((tech) => (
                      <span
                        key={tech.id || tech.name}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono bg-muted/60 hover:bg-muted text-foreground border border-border/60 shadow-2xs hover:border-border transition-all"
                      >
                        <TechStackIcon tech={tech} className="w-3.5 h-3.5" />
                        <span className="font-medium">{tech.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Previous / Next Project Navigation */}
          <ProjectAdjacentNav prev={adjacent.prev} next={adjacent.next} />
        </div>
      </article>

      {/* Bottom Lead Capture CTA */}
      <LeadCaptureCta profile={settings.profile} />
    </SiteLayout>
  );
}
