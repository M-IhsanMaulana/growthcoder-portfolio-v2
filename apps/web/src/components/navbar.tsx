"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, ArrowUpRight, Sparkles, Send } from "lucide-react";
import { Button } from "@growthcoder/ui";
import { ThemeToggle } from "@/components/theme-toggle";
import { FullWidthNavbar } from "@/components/full-width-navbar";
import { MagneticButton } from "@/components/animations/magnetic-button";
import type { SiteProfile, NavbarStyle } from "@growthcoder/types";

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

export interface NavbarProps {
  profile?: SiteProfile;
  navbarStyle?: NavbarStyle;
}

export function Navbar({ profile, navbarStyle = "floating" }: NavbarProps) {
  if (navbarStyle === "full_width") {
    return <FullWidthNavbar profile={profile} />;
  }

  return <FloatingNavbar profile={profile} />;
}

export function FloatingNavbar({ profile }: { profile?: SiteProfile }) {
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

  // Close mobile menu on route change
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
        className={`fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] sm:w-[94%] max-w-5xl transition-all duration-300 ${
          isScrolled ? "scale-[0.99] top-3 sm:top-3.5" : "scale-100"
        }`}
      >
        <nav
          className={`relative flex items-center justify-between rounded-full px-3.5 sm:px-5 py-2 transition-all duration-300 ${
            isScrolled
              ? "bg-background/75 dark:bg-background/80 border border-border/70 dark:border-white/10 shadow-lg shadow-black/10 backdrop-blur-2xl"
              : "bg-background/55 dark:bg-background/60 border border-border/40 dark:border-white/[0.08] shadow-md shadow-black/5 backdrop-blur-xl"
          }`}
          aria-label="Main navigation"
        >
          {/* Logo Brand matching CMS */}
          <Link
            href="/"
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 pl-1"
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
          <div className="hidden md:flex items-center gap-1 bg-muted/30 dark:bg-muted/20 border border-border/30 rounded-full px-2 py-1">
            {NAV_ITEMS.map((item) => {
              const active = isActiveLink(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                    active
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="active-nav-pill"
                      className="absolute inset-0 bg-primary rounded-full shadow-sm"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Items (Theme Toggle & CTA) */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            <MagneticButton strength={0.2} className="hidden sm:inline-block">
              <Button
                asChild
                size="sm"
                className="rounded-full px-4 h-9 text-xs font-semibold gap-1.5 shadow-sm transition-all hover:shadow-md hover:scale-[1.02]"
              >
                <Link href="/kontak">
                  <Send className="h-3 w-3" />
                  <span>Hubungi</span>
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

            {/* Slide Down Menu Box */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm rounded-3xl border border-border/60 bg-background/95 backdrop-blur-2xl p-5 shadow-2xl md:hidden"
            >
              <div className="flex flex-col gap-1.5">
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
