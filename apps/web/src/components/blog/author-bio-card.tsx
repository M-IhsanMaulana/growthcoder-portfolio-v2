"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Github,
  Linkedin,
  Twitter,
  ArrowUpRight,
} from "lucide-react";
import { resolveMediaUrl } from "@/lib/api";
import type { SiteProfile } from "@growthcoder/types";

interface AuthorBioCardProps {
  profile: SiteProfile;
}

export function AuthorBioCard({ profile }: AuthorBioCardProps) {
  return (
    <div className="my-10 p-6 sm:p-8 rounded-3xl border border-border/80 bg-gradient-to-br from-card/80 via-card/50 to-background backdrop-blur-xl shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6">
        {/* Avatar */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-primary/40 shadow-md shrink-0">
          {profile.avatarUrl ? (
            <Image
              src={resolveMediaUrl(profile.avatarUrl)}
              alt={profile.ownerName || "Author"}
              fill
              unoptimized={
                profile.avatarUrl.includes("localhost") ||
                profile.avatarUrl.includes("127.0.0.1")
              }
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
              GC
            </div>
          )}
        </div>

        {/* Bio info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 border border-primary/20">
              Penulis
            </span>
            <h4 className="text-lg sm:text-xl font-bold font-heading text-foreground">
              {profile.ownerName || "Muhammad Ihsan Maulana"}
            </h4>
          </div>

          <p className="text-xs sm:text-sm text-primary font-mono font-medium mb-2">
            {profile.tagline ||
              "Full-Stack Software Engineer & System Architect"}
          </p>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {profile.bio ||
              "Software Engineer berdedikasi dengan spesialisasi ekosistem Full-Stack TypeScript (Next.js, AdonisJS, Node.js), arsitektur sistem terdistribusi, serta aplikasi web berperforma tinggi dan skalabel."}
          </p>

          {/* Social links */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-border/40 text-xs">
            {profile.socials?.github && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-3.5 w-3.5" />
                <span>GitHub</span>
              </a>
            )}

            {profile.socials?.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="h-3.5 w-3.5" />
                <span>LinkedIn</span>
              </a>
            )}

            {profile.socials?.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-3.5 w-3.5" />
                <span>Twitter / X</span>
              </a>
            )}

            <Link
              href="/about"
              className="ml-auto font-semibold text-primary inline-flex items-center gap-1 hover:underline"
            >
              <span>Profil Lengkap</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
