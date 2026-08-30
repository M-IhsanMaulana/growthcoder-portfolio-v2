import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import { ServicesHero } from "@/components/services/services-hero";
import { ServicesGrid } from "@/components/services/services-grid";
import { WorkflowVisualizer } from "@/components/services/workflow-visualizer";
import { ClientGuarantees } from "@/components/services/client-guarantees";
import { ServicesFaq } from "@/components/services/services-faq";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";
import { getServices, getSiteSettings, getWorkflowSteps } from "@/lib/api";

export const revalidate = 60; // ISR 60s

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `Layanan & Spesialisasi Teknis — ${settings.profile.siteName || "GrowthCoder"}`;
  const description =
    "Layanan pengembangan aplikasi web full-stack Next.js & AdonisJS, arsitektur REST API, database engineering, otomasi bot Telegram, dan optimasi performa web.";

  return {
    title,
    description,
    keywords: [
      "Jasa Pembuatan Web Modern",
      "Full-Stack Web Development",
      "Next.js Developer",
      "AdonisJS Backend Engineer",
      "Telegram Bot Automation",
      "API Architecture",
      "Database Optimization",
      "Freelance Software Engineer Indonesia",
    ],
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://growthcoder.id/services",
      siteName: settings.profile.siteName || "GrowthCoder",
      locale: "id_ID",
      images: [
        {
          url: settings.seo.ogImageUrl || "/og-services.jpg",
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
      canonical: "https://growthcoder.id/services",
    },
  };
}

export default async function ServicesPage() {
  const [services, settings, workflowSteps] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getWorkflowSteps(),
  ]);

  // Schema.org JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://growthcoder.id/services#webpage",
        url: "https://growthcoder.id/services",
        name: "Layanan & Jasa Rekayasa Perangkat Lunak - GrowthCoder",
        description:
          "Layanan pengembangan aplikasi web full-stack, backend API, otomasi Telegram bot, dan audit performa sistem.",
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
              name: "Layanan",
              item: "https://growthcoder.id/services",
            },
          ],
        },
      },
      ...services.map((service) => ({
        "@type": "Service",
        name: service.title,
        description: service.shortDescription,
        provider: {
          "@type": "Person",
          name: settings.profile.ownerName || "Muhammad Ihsan Maulana",
          url: "https://growthcoder.id",
        },
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
        },
      })),
    ],
  };

  return (
    <SiteLayout settings={settings}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <ServicesHero />
        <ServicesGrid services={services} />
        <WorkflowVisualizer workflowSteps={workflowSteps} />
        <ClientGuarantees />
        <ServicesFaq services={services} />
      </div>
      <LeadCaptureCta profile={settings.profile} />
    </SiteLayout>
  );
}
