"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Tags,
  Layers,
  GraduationCap,
  Sparkles,
  Lightbulb,
  GitBranch,
  Inbox,
  Image as ImageIcon,
  ScrollText,
  Settings,
  ShieldCheck,
  ExternalLink,
  Cpu,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: "default" | "emerald" | "amber";
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

interface SidebarProps {
  unreadInboxCount?: number;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
}

export function Sidebar({
  unreadInboxCount = 0,
  isMobileOpen = false,
  onMobileClose,
  isCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();

  const navGroups: NavGroup[] = [
    {
      groupName: "Overview",
      items: [
        {
          title: "Dashboard & Analytics",
          href: "/",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      groupName: "Konten & Portofolio",
      items: [
        {
          title: "Blog & Artikel",
          href: "/articles",
          icon: FileText,
        },
        {
          title: "Proyek & Studi Kasus",
          href: "/projects",
          icon: Briefcase,
        },
        {
          title: "Kategori & Tags",
          href: "/categories",
          icon: Tags,
        },
        {
          title: "Tech Stacks & Skills",
          href: "/tech-stacks",
          icon: Layers,
        },
        {
          title: "Keahlian & Spesialisasi",
          href: "/expertises",
          icon: Cpu,
        },
        {
          title: "Karir & Pendidikan",
          href: "/experiences",
          icon: GraduationCap,
        },
      ],
    },
    {
      groupName: "Layanan & Komunikasi",
      items: [
        {
          title: "Layanan & Jasa",
          href: "/services",
          icon: Sparkles,
        },
        {
          title: "Filosofi Coding",
          href: "/philosophies",
          icon: Lightbulb,
        },
        {
          title: "Alur Kerja (Workflow)",
          href: "/workflows",
          icon: GitBranch,
        },
        {
          title: "Pesan Masuk (Inbox)",
          href: "/inbox",
          icon: Inbox,
          badge: unreadInboxCount > 0 ? unreadInboxCount : undefined,
          badgeVariant: "emerald",
        },
      ],
    },
    {
      groupName: "Media & Sistem",
      items: [
        {
          title: "Media Library",
          href: "/media",
          icon: ImageIcon,
        },
        {
          title: "Activity Logs",
          href: "/activity-logs",
          icon: ScrollText,
        },
        {
          title: "Pengaturan Global",
          href: "/settings",
          icon: Settings,
        },
        {
          title: "Keamanan & Passkey",
          href: "/settings/security",
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href === "/settings") {
      return pathname === "/settings";
    }
    if (pathname === href) {
      return true;
    }
    return pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onMobileClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-50 h-screen bg-card/95 border-r border-border backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Top Branding Section - Exactly h-16 (64px) matching Topbar Navbar */}
        <div className="h-16 flex items-center justify-center px-4 border-b border-border">
          <Link
            href="/"
            className="flex items-center justify-center transition-opacity overflow-hidden w-full"
          >
            {isCollapsed ? (
              /* Collapsed Icon */
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <Image
                  src="/gc-icon.png"
                  alt="GrowthCoder"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain rounded-xl shadow-sm hover:scale-105 transition-transform"
                  priority
                />
              </div>
            ) : (
              /* Expanded Dynamic Logo (Dark on Light, Light on Dark) */
              <div className="relative flex items-center justify-center h-11 w-full">
                {/* Light mode: uses logo-gc-dark.png */}
                <div className="flex items-center justify-center dark:hidden w-full">
                  <Image
                    src="/logo-gc-dark.png"
                    alt="GrowthCoder"
                    width={200}
                    height={48}
                    className="h-11 w-auto max-w-[190px] object-contain"
                    priority
                  />
                </div>
                {/* Dark mode: uses logo-gc-light.png */}
                <div className="hidden dark:flex items-center justify-center w-full">
                  <Image
                    src="/logo-gc-light.png"
                    alt="GrowthCoder"
                    width={200}
                    height={48}
                    className="h-11 w-auto max-w-[190px] object-contain"
                    priority
                  />
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation Links Scroll Container */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-muted">
          {navGroups.map((group) => (
            <div key={group.groupName} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground/75 mb-1.5">
                  {group.groupName}
                </h3>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isLinkActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onMobileClose}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group relative",
                        active
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        isCollapsed && "justify-center px-2",
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-[18px] h-[18px] shrink-0 transition-transform group-hover:scale-105",
                          active
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
                      {!isCollapsed && (
                        <span className="truncate flex-1">{item.title}</span>
                      )}

                      {/* Badge if present */}
                      {!isCollapsed && item.badge !== undefined && (
                        <span
                          className={cn(
                            "text-[9.5px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                            item.badgeVariant === "emerald"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 animate-pulse"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}

                      {/* Small dot badge if collapsed */}
                      {isCollapsed && item.badge !== undefined && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick Link to Public Web */}
        <div className="p-3 border-t border-border bg-card/60">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors group",
              isCollapsed && "justify-center px-2",
            )}
            title="Buka Web Publik"
          >
            <ExternalLink className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
            {!isCollapsed && <span>Buka Web Publik</span>}
          </a>
        </div>
      </aside>
    </>
  );
}
