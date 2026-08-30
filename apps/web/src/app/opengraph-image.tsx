import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const alt =
  "Muhammad Ihsan Maulana — Full-Stack Engineer & System Architect";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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

export default async function Image() {
  const logoSrc = getLogoBase64();

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
        padding: "64px 72px",
        fontFamily: "sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Top Header */}
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
                fontSize: "26px",
                fontWeight: 800,
                color: "#2D2A6F",
              }}
            >
              <span>growthcoder</span>
              <span style={{ color: "#2BB673" }}>.id</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            padding: "10px 22px",
            borderRadius: "9999px",
            backgroundColor: "#E6F7EF",
            border: "1px solid #B8ECCF",
            color: "#1E8752",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#2BB673",
              boxShadow: "0 0 8px #2BB673",
            }}
          />
          Available for Architecture &amp; Consulting
        </div>
      </div>

      {/* Center Content */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            fontSize: "18px",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#5C59D9",
          }}
        >
          Full-Stack Software Engineer &amp; System Architect
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "56px",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-1.5px",
            color: "#2D2A6F",
            maxWidth: "960px",
          }}
        >
          Muhammad Ihsan Maulana
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "24px",
            lineHeight: 1.45,
            color: "#4B5563",
            maxWidth: "880px",
          }}
        >
          Membangun sistem terdistribusi, Next.js App Router &amp; AdonisJS v6
          dengan end-to-end type safety, performa tinggi, dan arsitektur modern.
        </div>
      </div>

      {/* Bottom Tech Pills */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        {[
          "Next.js 16",
          "AdonisJS v6",
          "PostgreSQL",
          "TypeScript",
          "BullMQ & Redis",
          "Tailwind CSS",
        ].map((tech) => (
          <div
            key={tech}
            style={{
              display: "flex",
              padding: "8px 18px",
              borderRadius: "10px",
              backgroundColor: "#F8FAFC",
              border: "1px solid #E2E8F0",
              color: "#334155",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {tech}
          </div>
        ))}
      </div>
    </div>,
    {
      ...size,
    },
  );
}
