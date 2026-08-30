"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Briefcase,
  BookOpen,
  Sparkles,
  Mail,
} from "lucide-react";
import { Badge, Button } from "@growthcoder/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { BackButton } from "@/components/status/back-button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const QUICK_LINKS = [
  {
    href: "/",
    title: "Beranda Utama",
    description: "Kembali ke halaman utama portfolio",
    icon: Home,
    color: "text-primary bg-primary/10 border-primary/20",
  },
  {
    href: "/proyek",
    title: "Katalog Proyek",
    description: "Jelajahi showcase aplikasi & sistem",
    icon: Briefcase,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    href: "/blog",
    title: "Blog & Artikel",
    description: "Baca artikel rekayasa & teknologi",
    icon: BookOpen,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  {
    href: "/services",
    title: "Layanan & Jasa",
    description: "Kapabilitas rekayasa & solusi",
    icon: Sparkles,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
  {
    href: "/contact",
    title: "Hubungi Admin",
    description: "Laporkan kendala langsung ke tim",
    icon: Mail,
    color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  },
];

export default function ErrorPage({ error, reset }: ErrorProps) {
  const pathname = usePathname();

  // Send telemetry and notify Telegram in the background
  React.useEffect(() => {
    // Log to browser console for dev debugging
    console.error("[Web App Runtime Error]:", error);

    // Dispatch background telemetry
    try {
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          digest: error.digest || "N/A",
          message: error.message || "Unknown error",
          pathname:
            pathname ||
            (typeof window !== "undefined" ? window.location.pathname : ""),
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          timestamp: new Date().toISOString(),
        }),
      }).catch((telemetryErr) => {
        console.warn(
          "Failed to dispatch client error telemetry:",
          telemetryErr,
        );
      });
    } catch {
      // Ignore network errors in telemetry
    }
  }, [error, pathname]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[400px] bg-rose-500/15 dark:bg-rose-500/20 blur-[130px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-1/6 right-1/4 w-[350px] sm:w-[450px] h-[300px] bg-amber-500/10 dark:bg-amber-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Background Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      {/* Top Bar with Brand Logo & Theme Toggle */}
      <header className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 max-w-5xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-opacity hover:opacity-90"
        >
          <div className="flex items-center dark:hidden">
            <Image
              src="/logo-gc-dark.png"
              alt="GrowthCoder"
              width={160}
              height={36}
              className="h-8 w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
          <div className="hidden dark:flex items-center">
            <Image
              src="/logo-gc-light.png"
              alt="GrowthCoder"
              width={160}
              height={36}
              className="h-8 w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </header>

      {/* Main Glassmorphic Card Container */}
      <main className="w-full max-w-3xl text-center relative z-10 my-16">
        <div className="rounded-3xl border border-border/50 bg-card/60 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          {/* Top warning accent line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-400 to-rose-500" />

          {/* Glowing Warning Icon Header */}
          <div className="relative mx-auto mb-6 flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-3xl bg-rose-500/15 opacity-75 duration-1000" />
            <AlertTriangle className="relative h-12 w-12 sm:h-14 sm:w-14 text-rose-500 animate-pulse" />
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 mb-4">
            <Badge
              variant="outline"
              className="px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30 flex items-center gap-2"
            >
              <AlertTriangle className="h-3.5 w-3.5" />
              Status: 500 &bull; Terjadi Gangguan Sistem
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading text-foreground mb-4">
            Terjadi Kendala Sementara
          </h1>

          {/* Subtitle / Narrative */}
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed mb-8">
            Mohon maaf atas ketidaknyamanan Anda. Terjadi kendala saat memproses
            permintaan pada halaman ini. Notifikasi insiden telah otomatis
            diteruskan ke tim pengembang untuk penanganan segera.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-10">
            <Button
              type="button"
              onClick={() => reset()}
              size="lg"
              className="rounded-full shadow-lg shadow-primary/20 gap-2 px-6 font-semibold cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Coba Muat Ulang</span>
            </Button>

            <Button
              asChild
              variant="secondary"
              size="lg"
              className="rounded-full gap-2 px-6 font-semibold"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                <span>Ke Beranda</span>
              </Link>
            </Button>

            <BackButton
              variant="outline"
              className="h-11 px-6 border-border/70 hover:border-primary/50"
            />
          </div>

          {/* Quick Hub Navigation Divider */}
          <div className="border-t border-border/40 pt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              Atau Akses Menu Alternatif Berikut
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
              {QUICK_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative flex items-start gap-3.5 p-3.5 rounded-2xl border border-border/40 bg-muted/20 hover:bg-muted/50 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${item.color} group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-xs text-muted-foreground/60">
          &copy; {new Date().getFullYear()} GrowthCoder. Muhammad Ihsan Maulana.
          All rights reserved.
        </p>
      </main>
    </div>
  );
}
