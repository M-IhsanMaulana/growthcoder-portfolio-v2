import type { Metadata, Viewport } from "next";
import { Outfit, Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Toaster } from "@growthcoder/ui";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteSettings } from "@/lib/api";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/seo/json-ld";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import {
  resolveGaMeasurementId,
  resolveGscVerificationToken,
} from "@/lib/gtag";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://growthcoder.id";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090d16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const baseUrl = SITE_URL.replace(/\/$/, "");
  const gscVerification = resolveGscVerificationToken(
    settings.seo?.googleSiteVerification,
  );

  const siteTitle =
    settings.seo.metaTitle ||
    `${settings.profile.siteName} — Full-Stack Engineer & System Architect`;
  const description =
    settings.seo.metaDescription ||
    settings.profile.bio ||
    "Portofolio & blog rekayasa perangkat lunak Muhammad Ihsan Maulana (GrowthCoder).";

    const ogImage = settings.seo?.ogImageUrl || "/og-image.png";

    return {
      metadataBase: new URL(baseUrl),
      title: {
        default: siteTitle,
        template: `%s — ${settings.profile.siteName || "GrowthCoder"}`,
      },
      description,
      icons: {
        icon: [
          { url: "/gc-icon.png?v=2", type: "image/png" },
          { url: "/icon.png?v=2", type: "image/png" },
        ],
        apple: [{ url: "/gc-icon.png?v=2" }],
        shortcut: ["/gc-icon.png?v=2"],
      },
      keywords: settings.seo.metaKeywords || [
        "Software Engineer",
        "Full-Stack Developer",
        "Next.js",
        "AdonisJS",
        "PostgreSQL",
        "TypeScript",
        "System Architecture",
        "Muhammad Ihsan Maulana",
        "GrowthCoder",
      ],
      authors: [
        {
          name: settings.profile.ownerName || "Muhammad Ihsan Maulana",
          url: baseUrl,
        },
      ],
      creator: settings.profile.ownerName || "Muhammad Ihsan Maulana",
      publisher: settings.profile.siteName || "GrowthCoder",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      alternates: {
        canonical: baseUrl,
        types: {
          "application/rss+xml": [
            {
              url: `${baseUrl}/feed.xml`,
              title: `${settings.profile.siteName} RSS Feed`,
            },
            {
              url: `${baseUrl}/rss.xml`,
              title: `${settings.profile.siteName} RSS Feed (Alt)`,
            },
          ],
        },
      },
      openGraph: {
        type: "website",
        locale: "id_ID",
        url: baseUrl,
        title: siteTitle,
        description,
        siteName: settings.profile.siteName || "GrowthCoder",
        images: ogImage
          ? [
              {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: siteTitle,
              },
            ]
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: siteTitle,
        description,
        creator: "@growthcoder",
        images: ogImage ? [ogImage] : undefined,
      },
      verification: gscVerification
        ? {
            google: gscVerification,
          }
        : undefined,
    };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const gaMeasurementId = resolveGaMeasurementId(
    settings.seo?.googleAnalyticsId,
  );

  return (
    <html
      lang="id"
      className={`${outfit.variable} ${plusJakartaSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/gc-icon.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/gc-icon.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/gc-icon.png?v=2" />
        <PersonJsonLd settings={settings} />
        <WebSiteJsonLd settings={settings} />
        <GoogleAnalytics gaId={gaMeasurementId} />
      </head>
      <body
        className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-200"
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          enableColorScheme={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
