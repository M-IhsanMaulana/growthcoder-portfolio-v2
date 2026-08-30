import type { MetadataRoute } from "next";
import { getAllArticles, getAllProjects } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://growthcoder.id";

export const revalidate = 3600; // Revalidate sitemap every 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL.replace(/\/$/, "");

  // 1. Static Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/proyek`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/layanan`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 2. Dynamic Articles (Blog Posts)
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await getAllArticles({ perPage: 100 });
    articleRoutes = articles.map((article) => ({
      url: `${baseUrl}/blog/${encodeURIComponent(article.slug)}`,
      lastModified: new Date(
        article.updatedAt ||
          article.publishedAt ||
          article.createdAt ||
          Date.now(),
      ),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[Sitemap] Failed to fetch articles for sitemap:", err);
  }

  // 3. Dynamic Projects (Portfolio Showcase)
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: projects } = await getAllProjects({ perPage: 100 });
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/projects/${encodeURIComponent(project.slug)}`,
      lastModified: new Date(
        project.updatedAt || project.createdAt || Date.now(),
      ),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error("[Sitemap] Failed to fetch projects for sitemap:", err);
  }

  return [...staticRoutes, ...articleRoutes, ...projectRoutes];
}
