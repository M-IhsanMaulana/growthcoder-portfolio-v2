import { getAllArticles, getSiteSettings, resolveMediaUrl } from "@/lib/api";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://growthcoder.id";

export const revalidate = 3600; // Cache 1 hour

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const [settings, { data: articles }] = await Promise.all([
    getSiteSettings(),
    getAllArticles({ perPage: 50 }),
  ]);

  const siteTitle = escapeXml(settings.profile.siteName || "GrowthCoder");
  const siteDescription = escapeXml(
    settings.seo.metaDescription ||
      settings.profile.tagline ||
      "Portofolio dan artikel teknologi oleh Muhammad Ihsan Maulana.",
  );
  const authorName = escapeXml(
    settings.profile.ownerName || "Muhammad Ihsan Maulana",
  );
  const authorEmail = escapeXml(
    settings.profile.email || "admin@growthcoder.id",
  );
  const lastBuildDate = new Date().toUTCString();

  const itemsXml = articles
    .map((article) => {
      const link = `${baseUrl}/blog/${encodeURIComponent(article.slug)}`;
      const pubDate = new Date(
        article.publishedAt || article.createdAt || Date.now(),
      ).toUTCString();
      const categories = [
        article.category?.name,
        ...(article.tags?.map((t) => t.name) || []),
      ]
        .filter(Boolean)
        .map((cat) => `<category>${escapeXml(cat!)}</category>`)
        .join("\n      ");

      const coverUrl = article.coverImage
        ? resolveMediaUrl(article.coverImage)
        : null;
      const enclosureXml = coverUrl
        ? `<enclosure url="${escapeXml(coverUrl)}" type="image/jpeg" length="0" />`
        : "";

      return `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator><![CDATA[${authorName}]]></dc:creator>
      <author>${authorEmail} (${authorName})</author>
      ${categories}
      ${enclosureXml}
      <description><![CDATA[${article.excerpt || ""}]]></description>
      <content:encoded><![CDATA[${article.content || article.excerpt || ""}]]></content:encoded>
    </item>`;
    })
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
  xmlns:atom="http://www.w3.org/2005/Atom" 
  xmlns:content="http://purl.org/rss/1.0/modules/content/" 
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${siteTitle} — Blog &amp; Insights</title>
    <link>${baseUrl}/blog</link>
    <description>${siteDescription}</description>
    <language>id-ID</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <copyright>© ${new Date().getFullYear()} ${authorName}. All rights reserved.</copyright>
    <generator>GrowthCoder RSS Engine</generator>
    ${itemsXml}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
