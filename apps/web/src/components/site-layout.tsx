import * as React from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getSiteSettings } from "@/lib/api";
import { SmoothScrollProvider } from "@/components/animations/smooth-scroll-provider";
import { ScrollProgressBar } from "@/components/animations/scroll-progress-bar";
import { PageTransition } from "@/components/animations/page-transition";

import type { SiteSettingsData } from "@growthcoder/types";

interface SiteLayoutProps {
  children: React.ReactNode;
  settings?: SiteSettingsData;
}

export async function SiteLayout({
  children,
  settings: propSettings,
}: SiteLayoutProps) {
  const settings = propSettings || (await getSiteSettings());
  const navbarStyle = settings.appearance?.navbarStyle || "floating";

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
        {/* Global Scroll Progress Bar & Floating Back-To-Top */}
        <ScrollProgressBar />

        {/* Top Ambient Glow Gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[380px] pointer-events-none -z-10 overflow-hidden">
          <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[650px] sm:w-[900px] h-[350px] bg-gradient-to-b from-primary/20 via-emerald-500/10 to-transparent blur-[140px] rounded-full" />
        </div>

        {/* Dynamic Navbar (Floating Pill vs Full-Width Header) */}
        <Navbar profile={settings.profile} navbarStyle={navbarStyle} />

        {/* Page Main Content Area with Route Transition */}
        <main
          className={`flex-1 w-full ${
            navbarStyle === "full_width" ? "pt-16 sm:pt-20" : "pt-20 sm:pt-24"
          }`}
        >
          <PageTransition>{children}</PageTransition>
        </main>

        {/* Dynamic Multi-Column Footer */}
        <Footer profile={settings.profile} />
      </div>
    </SmoothScrollProvider>
  );
}
