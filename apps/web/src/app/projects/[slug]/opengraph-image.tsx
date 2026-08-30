import { ImageResponse } from "next/og";
import { getProjectBySlug } from "@/lib/api";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt = "Project Case Study";
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
  const project = await getProjectBySlug(slug);
  const logoSrc = getLogoBase64();

  const title = project?.title || "Studi Kasus Rekayasa Perangkat Lunak";
  const categoryName = project?.category?.name || "Full-Stack Project";
  const clientName = project?.clientName || "Production Platform";
  const year = project?.projectYear
    ? String(project.projectYear)
    : "2024 - Present";
  const subtitle = `${clientName} • ${year}`;
  const excerpt =
    project?.excerpt ||
    "Arsitektur sistem, rancangan basis data terdistribusi, dan performa tinggi.";
  const techStackList = project?.techStacks?.slice(0, 4).map((t) => t.name) || [
    "Next.js",
    "AdonisJS",
    "PostgreSQL",
    "TypeScript",
  ];

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
            {subtitle}
          </div>
        </div>
      </div>

      {/* Center: Title & Excerpt */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 50 ? "46px" : "52px",
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

      {/* Footer: Tech Stack Pills & CTA */}
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
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          {techStackList.map((t) => (
            <div
              key={t}
              style={{
                display: "flex",
                padding: "7px 16px",
                borderRadius: "8px",
                backgroundColor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                color: "#334155",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "16px",
            fontWeight: 800,
            color: "#5C59D9",
          }}
        >
          Studi Kasus &amp; Arsitektur →
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
