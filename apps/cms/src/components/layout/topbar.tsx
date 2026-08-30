"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from "@growthcoder/ui";
import {
  Menu,
  PanelLeft,
  Sun,
  Moon,
  Laptop,
  LogOut,
  User as UserIcon,
  Shield,
  ChevronRight,
  ExternalLink,
  Bell,
} from "lucide-react";

interface TopbarProps {
  onMobileMenuToggle: () => void;
  unreadCount?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Topbar({
  onMobileMenuToggle,
  unreadCount = 0,
  isCollapsed = false,
  onToggleCollapse,
}: TopbarProps) {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate breadcrumb items from pathname
  const getBreadcrumbs = () => {
    if (pathname === "/") {
      return [{ label: "Dashboard & Analitik", href: "/" }];
    }

    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, idx) => {
      const href = `/${segments.slice(0, idx + 1).join("/")}`;
      let label = seg
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      if (seg === "articles") label = "Blog & Artikel";
      if (seg === "projects") label = "Proyek Portofolio";
      if (seg === "tech-stacks") label = "Tech Stacks";
      if (seg === "experiences") label = "Karir & Pendidikan";
      if (seg === "services") label = "Layanan";
      if (seg === "philosophies") label = "Filosofi Coding";
      if (seg === "inbox") label = "Pesan Masuk";
      if (seg === "media") label = "Media Library";
      if (seg === "activity-logs") label = "Activity Logs";
      if (seg === "settings") label = "Pengaturan Global";
      if (seg === "security") label = "Keamanan & Passkeys";

      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-background/80 border-b border-border backdrop-blur-xl transition-colors">
      {/* Left: Modern Sidebar Collapse Trigger + Mobile Menu + Breadcrumbs */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Modern Desktop Sidebar Collapse Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-xs group"
            title={isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
            aria-label="Toggle Sidebar"
          >
            <PanelLeft
              className={`w-4 h-4 transition-transform duration-200 ${
                isCollapsed
                  ? "rotate-180 text-emerald-500"
                  : "text-muted-foreground group-hover:text-foreground"
              }`}
            />
          </button>
        )}

        {/* Vertical Divider between Sidebar Toggle and Breadcrumbs */}
        <div className="hidden md:block h-4 w-px bg-border/80 mx-0.5" />

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="flex items-center gap-1.5 text-xs md:text-sm"
        >
          <Link
            href="/"
            className="text-muted-foreground hover:text-emerald-500 font-medium transition-colors"
          >
            CMS
          </Link>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={crumb.href}>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                {isLast ? (
                  <span className="font-semibold text-foreground truncate max-w-[200px] md:max-w-none">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-muted-foreground hover:text-emerald-500 font-medium transition-colors"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right Actions: Quick Web, Notification / Inbox Alert, Theme Switcher, User Dropdown */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick link to Web Publik */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground bg-muted/60 border border-border hover:bg-muted hover:text-foreground transition-all shadow-sm"
        >
          <span>Web Publik</span>
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
        </a>

        {/* Inbox notification icon */}
        <Link
          href="/inbox"
          className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          title="Pesan Masuk"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-background" />
          )}
        </Link>

        {/* Theme Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9 border-border bg-muted/40 text-foreground hover:bg-muted hover:text-foreground cursor-pointer shadow-xs"
            >
              {mounted && resolvedTheme === "dark" ? (
                <Moon className="h-4 w-4 text-teal-400 transition-all" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500 transition-all" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-popover border-border text-popover-foreground shadow-lg"
          >
            <DropdownMenuItem
              onClick={() => setTheme("light")}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted"
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Terang (Light)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("dark")}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted"
            >
              <Moon className="w-4 h-4 text-teal-400" />
              <span>Gelap (Dark)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted"
            >
              <Laptop className="w-4 h-4 text-muted-foreground" />
              <span>Sistem Default</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted border border-transparent hover:border-border transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-semibold text-xs shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {user?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                  {user?.role || "superadmin"}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-popover border-border text-popover-foreground shadow-xl"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {user?.name || "Administrator"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "admin@growthcoder.id"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem asChild className="hover:bg-muted cursor-pointer">
              <Link href="/settings" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span>Profil & Akun</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-muted cursor-pointer">
              <Link
                href="/settings/security"
                className="flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span>Keamanan & Passkeys</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-red-500 hover:text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Keluar (Logout)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
