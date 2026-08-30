"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@growthcoder/ui";
import {
  ArrowRight,
  FileDown,
  Send,
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  MessageCircle,
  Command,
  Briefcase,
} from "lucide-react";
import type { SiteProfile, SiteAboutConfig } from "@growthcoder/types";
import { resolveMediaUrl } from "@/lib/api";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { TiltCard } from "@/components/animations/tilt-card";
import { gsap, isReducedMotion } from "@/lib/gsap";

interface HeroSectionProps {
  profile: SiteProfile;
  about?: SiteAboutConfig;
}

const DEFAULT_ROLES = ["Full-Stack Web Developer"];

function TypewriterRole({
  roles,
  fallback,
}: {
  roles?: string[];
  fallback?: string;
}) {
  const roleList = useMemo(() => {
    if (
      Array.isArray(roles) &&
      roles.filter((r) => r && r.trim().length > 0).length > 0
    ) {
      return roles.filter((r) => r && r.trim().length > 0);
    }
    return [fallback || "Full-Stack Web Developer"];
  }, [roles, fallback]);

  const [displayText, setDisplayText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTarget =
      roleList[roleIdx % roleList.length] || "Full-Stack Web Developer";
    const typingSpeed = isDeleting ? 40 : 80;
    const isWordComplete =
      !isDeleting && displayText.length === currentTarget.length;
    const isWordDeleted = isDeleting && displayText.length === 0;

    const delay = isWordComplete ? 2500 : isWordDeleted ? 500 : typingSpeed;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentTarget.length) {
          setDisplayText(currentTarget.slice(0, displayText.length + 1));
        } else {
          setIsDeleting(true);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentTarget.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setRoleIdx((prev) => (prev + 1) % roleList.length);
        }
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIdx, roleList]);

  return (
    <span className="relative inline-flex items-center text-foreground font-semibold border-b-2 border-primary/60 pb-0.5 min-h-[1.3em]">
      <span>{displayText || "\u00A0"}</span>
      <span
        className="inline-block w-[2px] sm:w-[3px] h-[1.1em] ml-1 bg-primary animate-pulse"
        aria-hidden="true"
      />
    </span>
  );
}

export function HeroSection({ profile, about }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const socials = profile?.socials || {};

  const socialLinks = useMemo(() => {
    const list: Array<{
      name: string;
      url?: string;
      icon: React.ComponentType<{ className?: string }>;
      hoverColor: string;
    }> = [
      {
        name: "GitHub",
        url: socials.github,
        icon: Github,
        hoverColor: "group-hover:text-foreground",
      },
      {
        name: "LinkedIn",
        url: socials.linkedin,
        icon: Linkedin,
        hoverColor: "group-hover:text-[#0A66C2]",
      },
      {
        name: "Twitter / X",
        url: socials.twitter,
        icon: Twitter,
        hoverColor: "group-hover:text-[#1DA1F2]",
      },
      {
        name: "Instagram",
        url: socials.instagram,
        icon: Instagram,
        hoverColor: "group-hover:text-[#E4405F]",
      },
      {
        name: "Telegram",
        url: socials.telegram
          ? socials.telegram.startsWith("http")
            ? socials.telegram
            : `https://t.me/${socials.telegram.replace("@", "")}`
          : undefined,
        icon: Send,
        hoverColor: "group-hover:text-[#229ED9]",
      },
      {
        name: "WhatsApp",
        url: socials.whatsapp
          ? socials.whatsapp.startsWith("http")
            ? socials.whatsapp
            : `https://wa.me/${socials.whatsapp.replace(/[^0-9]/g, "")}`
          : undefined,
        icon: MessageCircle,
        hoverColor: "group-hover:text-[#25D366]",
      },
    ];

    return list.filter((item) => Boolean(item.url && item.url.trim()));
  }, [socials]);

  // GSAP subtle stagger intro on mount
  useEffect(() => {
    if (isReducedMotion() || !heroRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.6 },
      )
        .fromTo(
          ".hero-headline",
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power4.out" },
          "-=0.4",
        )
        .fromTo(
          ".hero-role",
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          ".hero-bio",
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3",
        )
        .fromTo(
          ".hero-actions",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.3",
        )
        .fromTo(
          ".hero-stack-tag",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            stagger: 0.08,
            duration: 0.4,
            clearProps: "all",
          },
          "-=0.2",
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-primary/20 via-emerald-500/15 to-teal-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline & Action CTAs */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Status Pill Badge */}
            <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary dark:text-emerald-400 mb-6 backdrop-blur-md shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>
                {about?.availabilityActive && about?.availabilityStatus
                  ? about.availabilityStatus
                  : "Tersedia untuk Kontrak & Konsultasi"}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              ref={headlineRef}
              className="hero-headline text-4xl sm:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-foreground leading-[1.12] mb-4"
            >
              Membangun Aplikasi Web Modern, Skalabel &amp;{" "}
              <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Berperforma Tinggi
              </span>
              .
            </h1>

            {/* Dynamic Role Switcher with Typewriter Effect */}
            <div className="hero-role h-10 sm:h-12 flex items-center mb-6 text-lg sm:text-2xl font-mono font-medium text-muted-foreground">
              <span className="text-primary mr-2.5 font-bold">&gt;</span>
              <TypewriterRole
                roles={profile.roles}
                fallback={profile.tagline || "Full-Stack Web Developer"}
              />
            </div>

            {/* Bio Narration */}
            <p className="hero-bio text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed mb-8">
              Halo! Saya{" "}
              <strong className="text-foreground font-semibold">
                {profile.ownerName}
              </strong>
              .{" "}
              {profile.bio ||
                "Software engineer yang berfokus pada pengembangan aplikasi web skala penuh, arsitektur sistem modern, dan database performa tinggi."}
            </p>

            {/* Action Buttons with Magnetic Pull */}
            <div className="hero-actions flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <MagneticButton strength={0.25} className="w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all hover:scale-[1.02] gap-2"
                >
                  <Link href="/projects">
                    <span>Lihat Portofolio</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </MagneticButton>

              <MagneticButton strength={0.25} className="w-full sm:w-auto">
                {profile.cvFileUrl ? (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-7 h-12 text-sm font-semibold border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all gap-2"
                  >
                    <a
                      href={profile.cvFileUrl}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      <FileDown className="h-4 w-4 text-primary" />
                      <span>Unduh Resume (PDF)</span>
                    </a>
                  </Button>
                ) : (
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-7 h-12 text-sm font-semibold border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all gap-2"
                  >
                    <Link href="/kontak">
                      <Send className="h-4 w-4 text-primary" />
                      <span>Hubungi Saya</span>
                    </Link>
                  </Button>
                )}
              </MagneticButton>
            </div>

            {/* Social Media Links from API */}
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mt-10 pt-8 border-t border-border/40 w-full">
                {socialLinks.map((item) => (
                  <MagneticButton key={item.name} strength={0.25}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.name}
                      title={item.name}
                      className="hero-stack-tag inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-muted/90 text-foreground border border-border/60 hover:border-primary/40 transition-all group shadow-sm hover:shadow"
                    >
                      <item.icon
                        className={`h-3.5 w-3.5 text-muted-foreground transition-all duration-200 group-hover:scale-110 ${item.hoverColor}`}
                      />
                      <span>{item.name}</span>
                    </a>
                  </MagneticButton>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Interactive 3D Tilt Card & Visual Showcase */}
          <div className="lg:col-span-5 flex justify-center">
            <TiltCard maxTilt={8} className="w-full max-w-md rounded-3xl">
              <div className="relative rounded-3xl border border-border/80 bg-card/60 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-primary/5 overflow-hidden">
                {/* Accent top gradient line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-400" />

                {/* Avatar with gradient border */}
                <div className="relative flex items-center gap-5 mb-6">
                  <div className="relative h-20 w-20 rounded-2xl p-1 bg-gradient-to-br from-primary via-emerald-500 to-teal-400 shadow-md">
                    <div className="relative h-full w-full rounded-xl overflow-hidden bg-background">
                      {profile.avatarUrl ? (
                        <Image
                          src={resolveMediaUrl(profile.avatarUrl)}
                          alt={profile.ownerName}
                          fill
                          unoptimized={
                            profile.avatarUrl.includes("localhost") ||
                            profile.avatarUrl.includes("127.0.0.1")
                          }
                          className="object-cover"
                          sizes="80px"
                          priority
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold text-2xl font-heading">
                          {profile.ownerName.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold font-heading text-foreground">
                      {profile.ownerName}
                    </h2>
                    <p className="text-xs font-mono text-primary font-medium">
                      @{profile.siteName.toLowerCase()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      {profile.location || "Indonesia"} &bull; Remote Available
                    </p>
                  </div>
                </div>

                {/* Engineering / Portfolio Highlights in card */}
                <div className="space-y-3 bg-muted/40 rounded-2xl p-4 border border-border/50 font-mono text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground font-semibold flex items-center gap-1.5 shrink-0">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />{" "}
                      Speciality
                    </span>
                    <span
                      className="text-emerald-500 dark:text-emerald-400 font-medium text-right truncate max-w-[190px]"
                      title={profile.tagline || "Full-Stack Web & SaaS"}
                    >
                      {profile.tagline || "Full-Stack Web & SaaS"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground font-semibold flex items-center gap-1.5 shrink-0">
                      <Briefcase className="h-3.5 w-3.5 text-blue-500" />{" "}
                      Experience
                    </span>
                    <span className="text-blue-500 dark:text-blue-400 font-medium text-right">
                      {about?.yearsOfExperience
                        ? about.yearsOfExperience
                            .toLowerCase()
                            .includes("exp") ||
                          about.yearsOfExperience
                            .toLowerCase()
                            .includes("tahun") ||
                          about.yearsOfExperience.toLowerCase().includes("year")
                          ? about.yearsOfExperience
                          : `${about.yearsOfExperience} Exp`
                        : "5+ Years Exp"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground font-semibold flex items-center gap-1.5 shrink-0">
                      <Command className="h-3.5 w-3.5 text-teal-500" />{" "}
                      Currently
                    </span>
                    <span className="text-teal-500 dark:text-teal-400 font-medium text-right">
                      Building &amp; Learning
                    </span>
                  </div>
                </div>

                {/* Interactive CTA Link */}
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/40 text-xs font-medium">
                  <span className="text-muted-foreground">
                    Tertarik berkolaborasi?
                  </span>
                  <Link
                    href="/kontak"
                    className="text-primary hover:text-primary/80 font-semibold inline-flex items-center gap-1 group"
                  >
                    <span>Kirim Pesan</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
}
