"use client";

import React from "react";
import Image from "next/image";
import {
  Mail,
  Send,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";
import type { SiteProfile } from "@growthcoder/types";
import { resolveMediaUrl } from "@/lib/api";

interface ContactInfoCardProps {
  profile?: SiteProfile;
}

export function ContactInfoCard({ profile }: ContactInfoCardProps) {
  const email = profile?.email || "admin@growthcoder.id";
  const location = profile?.location || "Indonesia (WIB / GMT+7)";
  const telegram = profile?.socials?.telegram || "https://t.me/growthcoder";
  const whatsapp = profile?.socials?.whatsapp || "https://wa.me/628123456789";
  const github = profile?.socials?.github || "https://github.com/growthcoder";
  const linkedin =
    profile?.socials?.linkedin || "https://linkedin.com/in/growthcoder";

  return (
    <div className="space-y-6">
      {/* Profile & Availability Card */}
      <div className="p-6 sm:p-7 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl space-y-5 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-primary/40 bg-muted shrink-0 shadow-md transition-transform duration-300 hover:scale-105">
            {profile?.avatarUrl ? (
              <Image
                src={resolveMediaUrl(profile.avatarUrl)}
                alt={profile.ownerName || "Muhammad Ihsan Maulana"}
                fill
                unoptimized={
                  profile.avatarUrl.includes("localhost") ||
                  profile.avatarUrl.includes("127.0.0.1")
                }
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-primary to-brand-secondary text-white font-bold text-lg">
                GC
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold font-heading text-foreground truncate">
              {profile?.ownerName || "Muhammad Ihsan Maulana"}
            </h3>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.tagline || "Full-Stack Software Engineer"}
            </p>
            <div className="inline-flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-primary dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Terbuka untuk Kolaborasi &amp; Konsultasi</span>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Senang berdiskusi dan membantu Anda dalam perancangan arsitektur
          sistem, konsultasi teknis, hingga implementasi aplikasi web modern
          yang andal dan scalable.
        </p>

        {/* Direct Channels List */}
        <div className="space-y-2.5 pt-2 border-t border-border/60 text-xs">
          {/* Email */}
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-primary/5 hover:border-primary/40 hover:translate-x-1 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-200">
                <Mail className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium group-hover:text-primary transition-colors">
                  Email Langsung
                </p>
                <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {email}
                </p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </a>

          {/* Telegram */}
          <a
            href={
              telegram.startsWith("http")
                ? telegram
                : `https://t.me/${telegram.replace("@", "")}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-cyan-500/5 hover:border-cyan-500/40 hover:translate-x-1 transition-all duration-200 group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-200">
                <Send className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground font-medium group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  Telegram Chat
                </p>
                <p className="font-semibold text-foreground truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  @growthcoder
                </p>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
          </a>

          {/* WhatsApp */}
          {whatsapp && (
            <a
              href={
                whatsapp.startsWith("http")
                  ? whatsapp
                  : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl border border-border/60 bg-muted/20 hover:bg-emerald-500/5 hover:border-emerald-500/40 hover:translate-x-1 transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-200">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground font-medium group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    WhatsApp Direct
                  </p>
                  <p className="font-semibold text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    Chat Langsung
                  </p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
            </a>
          )}
        </div>

        {/* Social Links Row */}
        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-medium">
            Profil &amp; Media Sosial
          </span>
          <div className="flex items-center gap-2">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary text-muted-foreground hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-border/60 bg-muted/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary text-muted-foreground hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Response SLA & Confidentiality Card */}
      <div className="p-5 sm:p-6 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl space-y-3.5 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 group">
        <div className="flex items-center gap-2.5 text-xs font-semibold text-foreground">
          <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-200">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <span>Respon Langsung &lt; 24 Jam</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed pl-9.5">
          Pesan Anda terhubung langsung ke notifikasi pribadi saya, sehingga
          dapat segera saya baca dan balas secepat mungkin.
        </p>

        <div className="pt-3 border-t border-border/60 flex items-center gap-2.5 text-xs text-muted-foreground">
          <div className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-medium text-foreground/80">
            Kerahasiaan topik &amp; ide diskusi terjaga secara personal
          </span>
        </div>
      </div>
    </div>
  );
}
