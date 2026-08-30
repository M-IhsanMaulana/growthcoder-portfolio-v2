import type { Metadata } from "next";
import Image from "next/image";
import { getSiteSettings } from "@/lib/api";
import {
  Wrench,
  Mail,
  Send,
  Github,
  Linkedin,
  ShieldAlert,
  Phone,
} from "lucide-react";
import { Badge, Button } from "@growthcoder/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { MaintenanceCountdown } from "@/components/status/maintenance-countdown";
import { RefreshButton } from "@/components/status/back-button";

export const metadata: Metadata = {
  title: "Under Maintenance — GrowthCoder",
  description: "Situs sedang dalam pemeliharaan terjadwal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MaintenancePage() {
  const settings = await getSiteSettings();
  const maintenance = settings.maintenance;
  const profile = settings.profile;

  const headline =
    maintenance.headline || "Sistem Sedang Dalam Pemeliharaan Terjadwal";
  const message =
    maintenance.message ||
    "Kami sedang melakukan peningkatan performa infrastruktur dan database untuk memberikan pengalaman yang lebih baik. Kami akan segera kembali.";

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[380px] bg-primary/15 dark:bg-primary/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[280px] bg-emerald-500/10 dark:bg-emerald-500/15 blur-[110px] rounded-full pointer-events-none -z-10" />

      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main Content Card */}
      <main className="w-full max-w-xl text-center relative z-10 my-8">
        {/* Brand Logo Header */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center dark:hidden">
            <Image
              src="/logo-gc-dark.png"
              alt={profile?.siteName || "GrowthCoder"}
              width={200}
              height={48}
              className="h-10 w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <div className="hidden dark:flex items-center">
            <Image
              src="/logo-gc-light.png"
              alt={profile?.siteName || "GrowthCoder"}
              width={200}
              height={48}
              className="h-10 w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
        </div>

        <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-emerald-500 to-primary" />

          {/* Icon with pulsing rings */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-primary/20 opacity-75" />
            <Wrench className="relative h-10 w-10 text-primary animate-pulse" />
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 flex items-center gap-1.5"
            >
              <ShieldAlert className="h-3.5 w-3.5 animate-bounce" />
              Scheduled Maintenance Mode
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-heading text-foreground mb-4">
            {headline}
          </h1>

          {/* Explanation Message */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
            {message}
          </p>

          {/* Live Countdown Timer if estimatedEndTime is set */}
          {maintenance.estimatedEndTime && (
            <MaintenanceCountdown targetDate={maintenance.estimatedEndTime} />
          )}

          {/* Manual Refresh / Status Check Action */}
          <div className="flex justify-center mb-8">
            <RefreshButton label="Cek Apakah Sistem Sudah Aktif" />
          </div>

          <div className="border-t border-border/40 pt-6">
            <p className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
              Perlu Menghubungi Jalur Darurat?
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {profile.email && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 border-border/60 hover:border-primary/50 text-xs"
                >
                  <a href={`mailto:${profile.email}`}>
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>Email Tim</span>
                  </a>
                </Button>
              )}

              {profile.phone && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 border-border/60 hover:border-primary/50 text-xs"
                >
                  <a
                    href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-500" />
                    <span>WhatsApp</span>
                  </a>
                </Button>
              )}

              {profile.socials.telegram && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-full gap-2 border-border/60 hover:border-primary/50 text-xs"
                >
                  <a
                    href={profile.socials.telegram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Send className="h-3.5 w-3.5 text-blue-400" />
                    <span>Telegram</span>
                  </a>
                </Button>
              )}

              {profile.socials.github && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <a
                    href={profile.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}

              {profile.socials.linkedin && (
                <Button
                  asChild
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
                >
                  <a
                    href={profile.socials.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} {profile.ownerName || "GrowthCoder"}
          . All rights reserved.
        </p>
      </main>
    </div>
  );
}
