"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Send,
  Mail,
  ArrowUp,
  Globe,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { MagneticButton } from "@/components/animations/magnetic-button";
import type { SiteProfile } from "@growthcoder/types";

interface FooterProps {
  profile?: SiteProfile;
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = profile?.socials || {};

  return (
    <footer className="relative border-t border-border/50 bg-background/50 backdrop-blur-xl mt-auto overflow-hidden">
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-border/40">
          {/* Column 1: Brand, Tagline, & Availability (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center transition-opacity hover:opacity-90"
            >
              {/* Light Mode Logo */}
              <div className="flex items-center dark:hidden">
                <Image
                  src="/logo-gc-dark.png"
                  alt={profile?.siteName || "GrowthCoder"}
                  width={180}
                  height={42}
                  className="h-9 sm:h-10 w-auto max-w-[190px] object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
              {/* Dark Mode Logo */}
              <div className="hidden dark:flex items-center">
                <Image
                  src="/logo-gc-light.png"
                  alt={profile?.siteName || "GrowthCoder"}
                  width={180}
                  height={42}
                  className="h-9 sm:h-10 w-auto max-w-[190px] object-contain"
                  style={{ width: "auto", height: "auto" }}
                />
              </div>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {profile?.bio ||
                "Full-Stack Software Engineer specializing in Next.js, AdonisJS, TypeScript, and high-performance cloud applications."}
            </p>

            {/* Availability Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Available for engineering & consulting projects</span>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Navigasi
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Beranda", href: "/" },
                { name: "Tentang", href: "/about" },
                { name: "Layanan", href: "/services" },
                { name: "Proyek", href: "/projects" },
                { name: "Blog", href: "/blog" },
                { name: "Kontak", href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Socials & Connect (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-foreground">
              Terhubung & Media Sosial
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ikuti catatan teknis, rilis proyek open-source, dan diskusikan
              peluang kolaborasi.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {socials.github && (
                <MagneticButton strength={0.25}>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <a
                      href={socials.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="GitHub Profile"
                    >
                      <Github className="h-4 w-4" />
                    </a>
                  </Button>
                </MagneticButton>
              )}

              {socials.linkedin && (
                <MagneticButton strength={0.25}>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <a
                      href={socials.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="h-4 w-4 text-blue-500" />
                    </a>
                  </Button>
                </MagneticButton>
              )}

              {socials.twitter && (
                <MagneticButton strength={0.25}>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <a
                      href={socials.twitter}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Twitter/X Profile"
                    >
                      <Twitter className="h-4 w-4 text-sky-400" />
                    </a>
                  </Button>
                </MagneticButton>
              )}

              {socials.instagram && (
                <MagneticButton strength={0.25}>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <a
                      href={socials.instagram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="h-4 w-4 text-pink-500" />
                    </a>
                  </Button>
                </MagneticButton>
              )}

              {socials.telegram && (
                <MagneticButton strength={0.25}>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <a
                      href={socials.telegram}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Telegram Direct"
                    >
                      <Send className="h-4 w-4 text-blue-400" />
                    </a>
                  </Button>
                </MagneticButton>
              )}

              {profile?.email && (
                <MagneticButton strength={0.25}>
                  <Button
                    asChild
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 rounded-xl border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors"
                  >
                    <a
                      href={`mailto:${profile.email}`}
                      aria-label="Direct Email"
                    >
                      <Mail className="h-4 w-4 text-emerald-500" />
                    </a>
                  </Button>
                </MagneticButton>
              )}
            </div>

            {profile?.location && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                <Globe className="h-3.5 w-3.5 text-muted-foreground/80" />
                <span>Berbasis di {profile.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {currentYear} {profile?.siteName || "Growthcoder"} Portfolio.
            All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built with <span className="text-rose-500">❤️</span> by{" "}
            <strong className="text-foreground font-semibold">
              {profile?.ownerName || "Muhammad Ihsan Maulana"}
            </strong>
          </p>
        </div>
      </div>
    </footer>
  );
}
