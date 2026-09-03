import * as React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import {
  getSiteSettings,
  getAllProjects,
  getProjectCategories,
  getTechStacks,
} from "@/lib/api";
import { ProjectsCatalogView } from "@/components/projects/projects-catalog-view";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";
import { Sparkles } from "lucide-react";

export const revalidate = 60; // ISR revalidation 60s

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `Portofolio & Proyek — ${settings.profile.siteName}`;
  const description =
    "Koleksi portofolio proyek dan studi kasus pengembangan web serta rekayasa perangkat lunak.";

  return {
    title,
    description,
    keywords: [
      "Portofolio Personal",
      "Studi Kasus Proyek",
      "Full-Stack Web App",
      "Software Developer",
      "Next.js Portfolio",
      "TypeScript",
      "PostgreSQL",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      images: settings.seo.ogImageUrl
        ? [{ url: settings.seo.ogImageUrl }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function ProjectsLoadingFallback() {
  return (
    <div className="space-y-10 animate-pulse">
      <div className="h-28 rounded-3xl bg-card/40 border border-border/60" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border/60 bg-card/40 h-80 flex flex-col justify-between p-6"
          >
            <div className="w-full aspect-video bg-muted/60 rounded-2xl mb-4" />
            <div className="h-4 bg-muted/60 rounded-md w-3/4 mb-2" />
            <div className="h-3 bg-muted/40 rounded-md w-full mb-4" />
            <div className="flex gap-2">
              <div className="h-6 w-16 bg-muted/60 rounded-md" />
              <div className="h-6 w-16 bg-muted/60 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ProjectsPage() {
  const [settings, projectsResponse, categories, techStacks] =
    await Promise.all([
      getSiteSettings(),
      getAllProjects({ perPage: 50 }),
      getProjectCategories(),
      getTechStacks(),
    ]);

  const projects = projectsResponse.data;

  return (
    <SiteLayout settings={settings}>
      <div className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/10 dark:bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Showcase Section - Personal Branding Focused */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Portofolio &amp; Karya Terpilih</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight text-foreground leading-[1.15] mb-4">
              Kumpulan Proyek &amp; Studi Kasus
            </h1>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Koleksi proyek nyata dan studi kasus yang pernah saya
              bangun—merancang solusi digital mulai dari aplikasi web modern,
              integrasi sistem, hingga pengalaman pengguna yang fungsional dan
              terukur.
            </p>
          </div>

          {/* Interactive Catalog View with live filter & search wrapped in Suspense */}
          <Suspense fallback={<ProjectsLoadingFallback />}>
            <ProjectsCatalogView
              initialProjects={projects}
              categories={categories}
              techStacks={techStacks}
            />
          </Suspense>
        </div>
      </div>

      {/* Bottom Lead Capture CTA */}
      <LeadCaptureCta profile={settings.profile} />
    </SiteLayout>
  );
}
