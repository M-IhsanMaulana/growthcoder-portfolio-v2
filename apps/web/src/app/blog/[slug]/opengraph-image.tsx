import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/api";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "Article Cover";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

interface Props {
  params: Promise<{ slug: string }>;
}

function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo-gc-dark.png");
    if (fs.existsSync(logoPath)) {
      const buffer = fs.readFileSync(logoPath);
      return `data:image/png;base64,${buffer.toString("base64")}`;
    }
  } catch (err) {
    console.error("[OG Image] Failed to load logo:", err);
  }
  return "";
}

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  const logoSrc = getLogoBase64();

  const title =
    article?.title || "Artikel Teknologi & Rekayasa Perangkat Lunak";
  const categoryName = article?.category?.name || "Engineering";
  const readingTime = article?.readingTimeMinutes
    ? `${article.readingTimeMinutes} min read`
    : "5 min read";
  const excerpt =
    article?.excerpt ||
    "Wawasan mendalam seputar arsitektur web modern, TypeScript, Next.js, dan optimasi performa.";

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at 92% 8%, rgba(92, 89, 217, 0.09) 0%, transparent 55%), radial-gradient(circle at 8% 92%, rgba(43, 182, 115, 0.08) 0%, transparent 55%)",
        color: "#111827",
        padding: "60px 70px",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Header Badges & Branding */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* Brand Logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {logoSrc ? (
            <img
              src={logoSrc}
              alt="GrowthCoder Logo"
              style={{
                height: "44px",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "24px",
                fontWeight: 800,
                color: "#2D2A6F",
              }}
            >
              <span>growthcoder</span>
              <span style={{ color: "#2BB673" }}>.id</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "#E8E7FF",
              border: "1px solid #D5D2FF",
              color: "#2D2A6F",
              fontSize: "15px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {categoryName}
          </div>
          <div
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "#F1F5F9",
              border: "1px solid #E2E8F0",
              color: "#475569",
              fontSize: "15px",
              fontWeight: 600,
            }}
          >
            {readingTime}
          </div>
        </div>
      </div>

      {/* Center: Article Title & Excerpt */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 60 ? "46px" : "52px",
            fontWeight: 900,
            lineHeight: 1.18,
            letterSpacing: "-1.2px",
            color: "#2D2A6F",
            maxWidth: "1050px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "22px",
            lineHeight: 1.45,
            color: "#4B5563",
            maxWidth: "980px",
          }}
        >
          {excerpt}
        </div>
      </div>

      {/* Footer: Author Info & CTA */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #E5E7EB",
          paddingTop: "24px",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#2D2A6F",
              border: "2px solid #5C59D9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: 800,
              fontSize: "18px",
            }}
          >
            MI
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: "18px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Muhammad Ihsan Maulana
            </div>
            <div
              style={{ display: "flex", fontSize: "14px", color: "#6B7280" }}
            >
              Full-Stack Engineer &amp; System Architect
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "16px",
            fontWeight: 800,
            color: "#2BB673",
          }}
        >
          Baca Selengkapnya →
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
