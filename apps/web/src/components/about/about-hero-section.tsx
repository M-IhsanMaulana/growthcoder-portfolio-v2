"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Mail,
  MapPin,
  Sparkles,
  Award,
  Briefcase,
  Users,
  Github,
  Linkedin,
  Twitter,
  Send,
  Instagram,
  ArrowUpRight,
  Lightbulb,
  Star,
  Quote,
} from "lucide-react";
import type { SiteProfile, SiteAboutConfig } from "@growthcoder/types";
import { resolveMediaUrl } from "@/lib/api";
import { sanitizeHtml } from "@/lib/sanitize";
import { TiltCard } from "@/components/animations/tilt-card";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { AnimatedCounter } from "@/components/animations/animated-counter";

function parseStatString(statStr: string) {
  if (!statStr) return { prefix: "", value: 0, suffix: "" };
  const match = statStr.match(/^(\D*)(\d+(?:\.\d+)?)(\D*)$/);
  if (match) {
    return {
      prefix: match[1] || "",
      value: parseFloat(match[2]),
      suffix: match[3] || "",
    };
  }
  return {
    prefix: "",
    value: 0,
    suffix: statStr,
  };
}

interface AboutHeroSectionProps {
  profile: SiteProfile;
  about?: SiteAboutConfig;
}

export function AboutHeroSection({ profile, about }: AboutHeroSectionProps) {
  const avatarSrc = profile.avatarUrl
    ? resolveMediaUrl(profile.avatarUrl)
    : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

  const isAvailable = about?.availabilityActive ?? true;
  const availabilityText =
    about?.availabilityStatus || "Tersedia untuk Kontrak & Konsultasi";

  const yearsExp = about?.yearsOfExperience || "3+ Tahun";
  const projectsCount = about?.projectsCompleted || "30+ Proyek";
  const clientsCount = about?.clientsSatisfied || "20+ Mitra & Klien";

  const parsedYears = parseStatString(yearsExp);
  const parsedProjects = parseStatString(projectsCount);
  const parsedClients = parseStatString(clientsCount);

  const cvDownloadUrl = profile.cvFileUrl
    ? resolveMediaUrl(profile.cvFileUrl)
    : "/uploads/cv-muhammad-ihsan-maulana.pdf";

  const storyHtml =
    about?.storyHtml ||
    `<p>Halo, saya <strong>${profile.ownerName}</strong>, seorang <strong>${profile.tagline}</strong> yang berfokus pada pembangunan sistem perangkat lunak modern yang tangguh, aman, dan berkinerja tinggi.</p>`;
  const cleanStoryHtml = sanitizeHtml(storyHtml);

  return (
    <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden border-b border-border/60">
      {/* Ambient decorative background glows */}
      <div className="absolute top-16 left-1/4 w-[450px] h-[300px] bg-gradient-to-tr from-primary/15 via-blue-500/10 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-32 right-10 w-80 h-80 bg-emerald-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 max-w-6xl space-y-12">
        {/* Main 2-Column Section: Photo Card on Left, Biography on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Photo Card & Quick Contacts (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <TiltCard maxTilt={6} className="rounded-3xl">
              <div className="relative group">
                {/* Glow backdrop behind photo */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 rounded-3xl blur-md opacity-35 group-hover:opacity-60 transition duration-500" />

                {/* Main Photo Card Container */}
                <div className="relative rounded-3xl overflow-hidden border border-border/80 bg-card p-3 shadow-xl">
                  {/* Photo with Star Badge */}
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-2xl overflow-hidden bg-muted">
                    <Image
                      src={avatarSrc}
                      alt={profile.ownerName}
                      fill
                      sizes="(max-width: 768px) 100vw, 450px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                      unoptimized={
                        avatarSrc.includes("localhost") ||
                        avatarSrc.includes("127.0.0.1")
                      }
                    />

                    {/* Gradient shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

                    {/* Top Right Star / Available Pill */}
                    <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5">
                      {isAvailable ? (
                        <div className="px-3 py-1 rounded-full bg-black/60 border border-emerald-500/40 text-emerald-400 text-[11px] font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                          </span>
                          <span>{availabilityText}</span>
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center shadow-md">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                      )}
                    </div>

                    {/* Bottom Floating Glassmorphic Pill */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 border border-white/40 dark:border-zinc-800/80 backdrop-blur-xl shadow-lg flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/15 text-primary flex items-center justify-center shrink-0 shadow-2xs">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-foreground truncate">
                          {profile.tagline}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          Membangun solusi digital dengan kode yang bersih &amp;
                          terukur.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location & Email Details */}
                  <div className="p-3 pt-3.5 space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{profile.location || "Jakarta, Indonesia"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                      <a
                        href={`mailto:${profile.email}`}
                        className="hover:text-foreground transition-colors truncate"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>

            {/* Social Channels Card */}
            <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-foreground">
                Sosial &amp; Jejaring
              </span>
              <div className="flex items-center gap-1.5">
                {profile.socials?.github && (
                  <MagneticButton strength={0.2}>
                    <a
                      href={profile.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-background hover:bg-muted/80 hover:text-foreground text-muted-foreground transition-all inline-block"
                      title="GitHub"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  </MagneticButton>
                )}
                {profile.socials?.linkedin && (
                  <MagneticButton strength={0.2}>
                    <a
                      href={profile.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-background hover:bg-muted/80 hover:text-blue-500 text-muted-foreground transition-all inline-block"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                    </a>
                  </MagneticButton>
                )}
                {profile.socials?.twitter && (
                  <MagneticButton strength={0.2}>
                    <a
                      href={profile.socials.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-background hover:bg-muted/80 hover:text-sky-400 text-muted-foreground transition-all inline-block"
                      title="Twitter / X"
                    >
                      <Twitter className="w-3.5 h-3.5" />
                    </a>
                  </MagneticButton>
                )}
                {profile.socials?.telegram && (
                  <MagneticButton strength={0.2}>
                    <a
                      href={profile.socials.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-background hover:bg-muted/80 hover:text-sky-500 text-muted-foreground transition-all inline-block"
                      title="Telegram"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </a>
                  </MagneticButton>
                )}
                {profile.socials?.instagram && (
                  <MagneticButton strength={0.2}>
                    <a
                      href={profile.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl border border-border bg-background hover:bg-muted/80 hover:text-pink-500 text-muted-foreground transition-all inline-block"
                      title="Instagram"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                    </a>
                  </MagneticButton>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Hero Heading, Tagline & Detailed Biography from CKEditor (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Pill Badge: • TENTANG SAYA */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>TENTANG SAYA</span>
            </div>

            {/* Big Greeting Heading */}
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
                Hai, Saya{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 dark:from-blue-400 dark:via-indigo-300 dark:to-emerald-300">
                  {profile.ownerName}
                </span>{" "}
                👋
              </h1>
              <p className="text-base sm:text-lg font-semibold text-muted-foreground">
                {profile.tagline}
              </p>
            </div>

            {/* Gradient Line Accent */}
            <div className="h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

            {/* CKEditor Biography Narrative Content (Natural Typography, Unboxed) */}
            <div
              className="rich-content-body article-content-rendered text-sm sm:text-base leading-relaxed text-muted-foreground/90 space-y-4 pt-1"
              dangerouslySetInnerHTML={{ __html: cleanStoryHtml }}
            />

            {/* Action Buttons with Magnetic Pull */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <MagneticButton strength={0.25}>
                <a
                  href={cvDownloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Unduh Curriculum Vitae (PDF)</span>
                </a>
              </MagneticButton>

              <MagneticButton strength={0.25}>
                <Link
                  href="/kontak"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-card/80 hover:bg-muted/80 text-foreground font-semibold text-xs backdrop-blur-md transition-all"
                >
                  <span>Mulai Kolaborasi</span>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom Section: Quick Metrics & Stats Cards (Underneath the photo + bio) */}
        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TiltCard maxTilt={4} className="rounded-2xl">
              <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-1 hover:border-primary/50 hover:shadow-md transition-all h-full group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Award className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
                  {parsedYears.value > 0 ? (
                    <AnimatedCounter
                      value={parsedYears.value}
                      prefix={parsedYears.prefix}
                      suffix={parsedYears.suffix}
                      duration={1.8}
                    />
                  ) : (
                    yearsExp
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Dedikasi Rekayasa Software
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  Pengalaman intensif di ekosistem Full-Stack
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={4} className="rounded-2xl">
              <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-1 hover:border-primary/50 hover:shadow-md transition-all h-full group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
                  {parsedProjects.value > 0 ? (
                    <AnimatedCounter
                      value={parsedProjects.value}
                      prefix={parsedProjects.prefix}
                      suffix={parsedProjects.suffix}
                      duration={1.8}
                    />
                  ) : (
                    projectsCount
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Proyek Web &amp; Sistem Selesai
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  Aplikasi enterprise, web app &amp; REST API
                </p>
              </div>
            </TiltCard>

            <TiltCard maxTilt={4} className="rounded-2xl">
              <div className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs space-y-1 hover:border-primary/50 hover:shadow-md transition-all h-full group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-heading text-foreground tracking-tight">
                  {parsedClients.value > 0 ? (
                    <AnimatedCounter
                      value={parsedClients.value}
                      prefix={parsedClients.prefix}
                      suffix={parsedClients.suffix}
                      duration={1.8}
                    />
                  ) : (
                    clientsCount
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Klien, Tim &amp; Mitra Industri
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  Kolaborasi sukses di berbagai skala bisnis
                </p>
              </div>
            </TiltCard>
          </div>

          {/* Featured Quote Callout with Typewriter Animation */}
          {about?.quote && (
            <TypewriterQuote text={about.quote} author={about.quoteAuthor} />
          )}
        </div>
      </div>
    </section>
  );
}

function TypewriterQuote({ text, author }: { text: string; author?: string }) {
  const [displayedText, setDisplayedText] = React.useState("");
  const [isFinished, setIsFinished] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Start typing when the element scrolls into view
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  React.useEffect(() => {
    if (!hasStarted) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 35);
      return () => clearTimeout(timeout);
    } else {
      setIsFinished(true);
    }
  }, [hasStarted, displayedText, text]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card/80 to-emerald-500/10 p-5 sm:p-6 backdrop-blur-md shadow-md"
    >
      <Quote className="w-8 h-8 text-primary/30 absolute -top-1 -left-1 transform -rotate-12 pointer-events-none" />
      <div className="relative space-y-2 z-10 pl-2 sm:pl-4">
        <p className="text-sm sm:text-base font-medium text-foreground italic leading-relaxed min-h-[1.75rem]">
          &ldquo;{hasStarted ? displayedText : text}&rdquo;
          {hasStarted && !isFinished && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
          )}
        </p>

        {author && (
          <div
            className={`flex items-center gap-2 pt-1 transition-all duration-700 ${
              isFinished || !hasStarted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            <div className="h-0.5 w-5 bg-primary" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-primary">
              {author}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
