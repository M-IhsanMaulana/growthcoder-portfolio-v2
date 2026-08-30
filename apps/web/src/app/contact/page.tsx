import React, { Suspense } from "react";
import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactInfoCard } from "@/components/contact/contact-info-card";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/lib/api";
import { Loader2 } from "lucide-react";

export const revalidate = 60; // ISR 60s

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `Kontak & Konsultasi Proyek — ${settings.profile.siteName || "GrowthCoder"}`;
  const description =
    "Hubungi Muhammad Ihsan Maulana untuk konsultasi proyek web Next.js/AdonisJS, perancangan arsitektur sistem, otomasi bot Telegram, atau kolaborasi freelance.";

  return {
    title,
    description,
    keywords: [
      "Kontak GrowthCoder",
      "Hubungi Developer",
      "Konsultasi Web Development",
      "Hire Next.js Developer",
      "Hire Backend Engineer",
      "Freelance Software Engineer",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://growthcoder.id/contact",
      siteName: settings.profile.siteName || "GrowthCoder",
      locale: "id_ID",
      images: [
        {
          url: settings.seo.ogImageUrl || "/og-contact.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@growthcoder",
    },
    alternates: {
      canonical: "https://growthcoder.id/contact",
    },
  };
}

export default async function ContactPage() {
  const settings = await getSiteSettings();

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        "@id": "https://growthcoder.id/contact#webpage",
        url: "https://growthcoder.id/contact",
        name: "Kontak & Konsultasi Proyek - GrowthCoder",
        description:
          "Formulir kontak dan saluran komunikasi langsung dengan Muhammad Ihsan Maulana.",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Beranda",
              item: "https://growthcoder.id",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Kontak",
              item: "https://growthcoder.id/contact",
            },
          ],
        },
      },
    ],
  };

  return (
    <SiteLayout settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-16 md:pb-24">
        <ContactHero />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-6">
          {/* Left Column: Direct Info & Availability (4 cols on lg) */}
          <div className="lg:col-span-5">
            <ContactInfoCard profile={settings.profile} />
          </div>

          {/* Right Column: Interactive Form Card (7 cols on lg) */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="p-12 rounded-3xl border border-border/80 bg-card/60 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-emerald-500" />
                  <p className="text-xs text-muted-foreground mt-3">
                    Memuat formulir kontak...
                  </p>
                </div>
              }
            >
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
