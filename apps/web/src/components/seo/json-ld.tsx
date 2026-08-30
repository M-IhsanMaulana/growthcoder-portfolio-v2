import React from "react";
import type { Article, Project, SiteSettingsData } from "@growthcoder/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://growthcoder.id";

interface PersonJsonLdProps {
  settings: SiteSettingsData;
}

export function PersonJsonLd({ settings }: PersonJsonLdProps) {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const profile = settings.profile;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${baseUrl}/#person`,
    name: profile.ownerName || "Muhammad Ihsan Maulana",
    alternateName: ["GrowthCoder", "Ihsan Maulana"],
    jobTitle:
      profile.tagline || "Full-Stack Software Engineer & System Architect",
    description:
      profile.bio ||
      "Software Engineer & Architect specializing in Full-Stack TypeScript, Next.js, and AdonisJS.",
    url: baseUrl,
    image: profile.avatarUrl || `${baseUrl}/opengraph-image`,
    email: profile.email || "admin@growthcoder.id",
    sameAs: [
      profile.socials?.github || "https://github.com/growthcoder",
      profile.socials?.linkedin || "https://linkedin.com/in/growthcoder",
      profile.socials?.twitter || "https://twitter.com/growthcoder",
      profile.socials?.instagram || "https://instagram.com/growthcoder",
    ].filter(Boolean),
    knowsAbout: [
      "Software Engineering",
      "System Architecture",
      "TypeScript",
      "Next.js App Router",
      "AdonisJS v6",
      "PostgreSQL",
      "Redis Caching & Queues",
      "Web Security & Authentication",
      "Passkeys WebAuthn",
      "Docker & Cloud Deployment",
    ],
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "BINUS University",
    },
    worksFor: {
      "@type": "Organization",
      name: "GrowthCoder Solutions",
      url: baseUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd({ settings }: { settings: SiteSettingsData }) {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: settings.profile.siteName || "GrowthCoder",
    description:
      settings.seo.metaDescription ||
      "Portofolio & blog rekayasa perangkat lunak Muhammad Ihsan Maulana.",
    publisher: {
      "@id": `${baseUrl}/#person`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    inLanguage: "id-ID",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleJsonLdProps {
  article: Article;
  settings: SiteSettingsData;
}

export function ArticleJsonLd({ article, settings }: ArticleJsonLdProps) {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const articleUrl = `${baseUrl}/blog/${encodeURIComponent(article.slug)}`;
  const authorName = settings.profile.ownerName || "Muhammad Ihsan Maulana";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
    headline: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image:
      article.coverImage ||
      `${baseUrl}/blog/${encodeURIComponent(article.slug)}/opengraph-image`,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: {
      "@type": "Person",
      name: authorName,
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: settings.profile.siteName || "GrowthCoder",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/opengraph-image`,
      },
    },
    articleSection: article.category?.name || "Technology",
    keywords:
      article.tags?.map((t) => t.name).join(", ") ||
      "TypeScript, Next.js, AdonisJS",
    wordCount: article.content
      ? article.content.replace(/<[^>]*>?/gm, "").split(/\s+/).length
      : undefined,
    timeRequired: article.readingTimeMinutes
      ? `PT${article.readingTimeMinutes}M`
      : "PT5M",
    inLanguage: "id-ID",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProjectJsonLdProps {
  project: Project;
  settings: SiteSettingsData;
}

export function ProjectJsonLd({ project, settings }: ProjectJsonLdProps) {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const projectUrl = `${baseUrl}/projects/${encodeURIComponent(project.slug)}`;
  const authorName = settings.profile.ownerName || "Muhammad Ihsan Maulana";

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    description: project.excerpt,
    url: projectUrl,
    image:
      project.coverImage ||
      `${baseUrl}/projects/${encodeURIComponent(project.slug)}/opengraph-image`,
    applicationCategory: project.category?.name || "BusinessApplication",
    operatingSystem: "Web",
    author: {
      "@type": "Person",
      name: authorName,
      url: baseUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    keywords: project.techStacks?.map((t) => t.name).join(", "),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
