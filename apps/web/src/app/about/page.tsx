import type { Metadata } from "next";
import { SiteLayout } from "@/components/site-layout";
import {
  getSiteSettings,
  getCareerAndEducation,
  getPhilosophies,
  resolveMediaUrl,
} from "@/lib/api";
import { AboutHeroSection } from "@/components/about/about-hero-section";
import { InteractiveTimelineSection } from "@/components/about/interactive-timeline-section";
import { CertificationsSection } from "@/components/about/certifications-section";
import { EngineeringPhilosophiesSection } from "@/components/about/engineering-philosophies-section";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const { profile, seo } = settings;

  const title = `Tentang Saya & Riwayat Karir — ${profile.ownerName}`;
  const description =
    profile.bio ||
    `Biografi mendalam, rekam jejak karir profesional, riwayat pendidikan, sertifikasi, dan filosofi rekayasa perangkat lunak ${profile.ownerName}.`;

  const ogImage = seo?.ogImageUrl
    ? resolveMediaUrl(seo.ogImageUrl)
    : profile.avatarUrl
      ? resolveMediaUrl(profile.avatarUrl)
      : undefined;

  return {
    title,
    description,
    keywords: [
      ...(seo?.metaKeywords || []),
      "Tentang Saya",
      "About Muhammad Ihsan Maulana",
      "Full-Stack Engineer Karir",
      "Software Architect Indonesia",
      "Curriculum Vitae",
      "Riwayat Pendidikan",
      "Sertifikasi Cloud",
    ],
    openGraph: {
      title,
      description,
      type: "profile",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function AboutPage() {
  const [settings, careerData, philosophies] = await Promise.all([
    getSiteSettings(),
    getCareerAndEducation(),
    getPhilosophies(),
  ]);

  const { profile, about } = settings;

  // JSON-LD Structured Data Schema for Person & ProfilePage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: profile.ownerName,
      jobTitle: profile.tagline,
      description: profile.bio,
      image: profile.avatarUrl ? resolveMediaUrl(profile.avatarUrl) : undefined,
      email: profile.email,
      url: "https://growthcoder.id/about",
      sameAs: [
        profile.socials?.github,
        profile.socials?.linkedin,
        profile.socials?.twitter,
      ].filter(Boolean),
      alumniOf: careerData.educations.map((edu) => ({
        "@type": "EducationalOrganization",
        name: edu.institution,
      })),
      hasCredential:
        careerData.certifications && careerData.certifications.length > 0
          ? careerData.certifications.map((cert) => ({
              "@type": "EducationalOccupationalCredential",
              name: cert.name,
              credentialCategory: "certification",
              recognizedBy: {
                "@type": "Organization",
                name: cert.issuer,
              },
            }))
          : undefined,
    },
  };

  return (
    <SiteLayout settings={settings}>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 01. Hero Profile Photo (Left) + CKEditor Biography (Right) + Quick Metrics (Bottom) */}
      <AboutHeroSection profile={profile} about={about} />

      {/* 02. Interactive Timeline (Work Experiences & Education) */}
      <InteractiveTimelineSection
        experiences={careerData.experiences}
        educations={careerData.educations}
      />

      {/* 03. Professional Certifications & Licenses */}
      {careerData.certifications && careerData.certifications.length > 0 ? (
        <CertificationsSection certifications={careerData.certifications} />
      ) : null}

      {/* 04. Software Engineering Core Philosophies */}
      <EngineeringPhilosophiesSection philosophies={philosophies} />

      {/* 05. Call to Action Banner */}
      <LeadCaptureCta profile={profile} />
    </SiteLayout>
  );
}
