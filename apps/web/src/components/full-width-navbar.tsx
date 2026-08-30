"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sparkles, Send } from "lucide-react";
import { Button } from "@growthcoder/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { MagneticButton } from "@/components/animations/magnetic-button";
import type { SiteProfile } from "@growthcoder/types";

interface NavItem {
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/about" },
  { name: "Layanan", href: "/services" },
  { name: "Proyek", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "Kontak", href: "/contact" },
];

interface FullWidthNavbarProps {
  profile?: SiteProfile;
}

export function FullWidthNavbar({ profile }: FullWidthNavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/projects" || href === "/proyek") {
      return pathname.startsWith("/projects") || pathname.startsWith("/proyek");
    }
    if (href === "/services" || href === "/layanan") {
      return (
        pathname.startsWith("/services") || pathname.startsWith("/layanan")
      );
    }
    if (href === "/contact" || href === "/kontak") {
      return pathname.startsWith("/contact") || pathname.startsWith("/kontak");
    }
    if (href === "/tentang" || href === "/about") {
      return pathname.startsWith("/tentang") || pathname.startsWith("/about");
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-background/75 dark:bg-background/80 backdrop-blur-2xl border-b border-border/60 dark:border-white/[0.08] shadow-sm shadow-black/5"
            : "bg-background/50 dark:bg-background/55 backdrop-blur-xl border-b border-border/35 dark:border-white/[0.05]"
        }`}
      >
        {/* Subtle glassmorphism top specular highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent pointer-events-none" />

        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4 relative"
          aria-label="Full-width main navigation"
        >
          {/* Logo Brand matching CMS */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          >
            {/* Mobile / Small Screen: Icon Only */}
            <div className="flex sm:hidden relative w-8 h-8 shrink-0 items-center justify-center">
              <Image
                src="/gc-icon.png"
                alt={profile?.siteName || "GrowthCoder"}
                width={32}
                height={32}
                className="h-8 w-8 object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                priority
              />
            </div>

            {/* Desktop / Tablet: Full Logo (Light vs Dark) */}
            <div className="hidden sm:flex relative items-center h-8 sm:h-9">
              {/* Light Mode: logo-gc-dark.png */}
              <div className="flex items-center dark:hidden">
                <Image
                  src="/logo-gc-dark.png"
                  alt={profile?.siteName || "GrowthCoder"}
                  width={160}
                  height={36}
                  className="h-8 sm:h-9 w-auto max-w-[170px] object-contain"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
              {/* Dark Mode: logo-gc-light.png */}
              <div className="hidden dark:flex items-center">
                <Image
                  src="/logo-gc-light.png"
                  alt={profile?.siteName || "GrowthCoder"}
                  width={160}
                  height={36}
                  className="h-8 sm:h-9 w-auto max-w-[170px] object-contain"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5">
            {NAV_ITEMS.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{item.name}</span>
                  {active && (
                    <motion.div
                      layoutId="full-nav-active-pill"
                      className="absolute -bottom-1 left-2 right-2 h-[3px] rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-400 shadow-[0_0_10px_rgba(59,130,246,0.35)] dark:shadow-[0_0_12px_rgba(43,182,115,0.45)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Action Items (Theme Toggle & CTA) */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            <MagneticButton strength={0.2} className="hidden sm:inline-block">
              <Button
                asChild
                size="sm"
                className="rounded-full px-5 h-9 text-xs font-semibold gap-1.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <Link href="/kontak">
                  <Send className="h-3 w-3" />
                  <span>Hubungi Saya</span>
                </Link>
              </Button>
            </MagneticButton>

            {/* Mobile Hamburger Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden h-9 w-9 rounded-full border border-border/40 bg-background/50 backdrop-blur-md"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 text-foreground" />
              ) : (
                <Menu className="h-4 w-4 text-foreground" />
              )}
            </Button>
          </div>
        </nav>
      </header>

      {/* Mobile Drawer Navigation (Framer Motion) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Slide Down Menu Container */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-16 left-0 right-0 z-50 w-full border-b border-border/80 bg-background/95 backdrop-blur-2xl p-6 shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-1.5 max-w-md mx-auto">
                {NAV_ITEMS.map((item) => {
                  const active = isActiveLink(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                        active
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <span>{item.name}</span>
                      {active ? (
                        <Sparkles className="h-4 w-4" />
                      ) : (
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </Link>
                  );
                })}

                <div className="border-t border-border/40 mt-3 pt-3 flex flex-col gap-2">
                  <Button
                    asChild
                    className="w-full rounded-2xl h-11 text-sm font-semibold justify-center gap-2 shadow-sm"
                  >
                    <Link
                      href="/kontak"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Send className="h-4 w-4" />
                      <span>Hubungi Saya</span>
                    </Link>
                  </Button>

                  {profile?.cvFileUrl && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-2xl h-11 text-sm font-medium justify-center gap-2 border-border/60"
                    >
                      <a
                        href={profile.cvFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        download
                      >
                        <span>Unduh Curriculum Vitae</span>
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
