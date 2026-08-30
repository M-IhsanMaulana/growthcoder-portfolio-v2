import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import {
  getSiteSettings,
  getFeaturedProjects,
  getTechStacks,
  getCareerTimeline,
  getLatestArticles,
  getExpertises,
} from "@/lib/api";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSummarySection } from "@/components/home/about-summary-section";
import { FeaturedProjectsBento } from "@/components/home/featured-projects-bento";
import { InteractiveTechStack } from "@/components/home/interactive-tech-stack";
import { CareerSnapshot } from "@/components/home/career-snapshot";
import { LatestArticlesSection } from "@/components/home/latest-articles-section";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const { profile, seo } = settings;

  const title = seo.metaTitle || `${profile.siteName} — ${profile.tagline}`;
  const description =
    seo.metaDescription || profile.bio || "Portofolio & Engineering Journal";

  return {
    title,
    description,
    keywords: seo.metaKeywords || [
      "Full-Stack Developer",
      "Next.js",
      "AdonisJS",
      "PostgreSQL",
      "TypeScript",
    ],
    openGraph: {
      title,
      description,
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl }] : undefined,
    },
  };
}

export default async function HomePage() {
  // Parallel fetching from backend AdonisJS endpoints with fallback data
  const [
    settings,
    featuredProjects,
    techStacks,
    careerTimeline,
    latestArticles,
    expertises,
  ] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getTechStacks(),
    getCareerTimeline(),
    getLatestArticles(3),
    getExpertises(),
  ]);

  return (
    <SiteLayout settings={settings}>
      {/* 01. Hero Section */}
      <HeroSection profile={settings.profile} about={settings.about} />

      {/* 02. Engineering Expertise & Stats Summary */}
      <AboutSummarySection
        profile={settings.profile}
        expertises={expertises}
        stats={settings.stats}
      />

      {/* 03. Featured Projects Bento Grid */}
      <FeaturedProjectsBento projects={featuredProjects} />

      {/* 04. Interactive Tech Stack Logo Grid */}
      <InteractiveTechStack techStacks={techStacks} />

      {/* 05. Career Snapshot Timeline */}
      <CareerSnapshot experiences={careerTimeline} />

      {/* 06. Latest Articles Preview */}
      <LatestArticlesSection articles={latestArticles} />

      {/* 07. Lead Capture Call-To-Action */}
      <LeadCaptureCta profile={settings.profile} />
    </SiteLayout>
  );
}
