"use client";

import * as React from "react";
import { ListCollapse, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TocItem } from "@/lib/toc";

export type { TocItem };

interface BlogTableOfContentsProps {
  items: TocItem[];
  variant?: "desktop" | "mobile" | "all";
}

export function BlogTableOfContents({
  items,
  variant = "all",
}: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = React.useState<string>("");
  const [isOpenMobile, setIsOpenMobile] = React.useState(false);

  React.useEffect(() => {
    if (!items || items.length === 0) return;

    const handleScroll = () => {
      const headingElements = items
        .map((item) => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[];

      const scrollPosition = window.scrollY + 140;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const el = headingElements[i];
        if (el.offsetTop <= scrollPosition) {
          setActiveId(items[i].id);
          return;
        }
      }

      if (headingElements.length > 0) {
        setActiveId(items[0].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const topOffset =
        element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
      setActiveId(id);
      setIsOpenMobile(false);
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  const renderMobileTOC = () => (
    <div className="lg:hidden my-6 rounded-2xl border border-border/80 bg-card/70 dark:bg-card/40 backdrop-blur-xl p-3.5 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpenMobile((prev) => !prev)}
        className="w-full flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-foreground cursor-pointer"
        aria-expanded={isOpenMobile}
      >
        <span className="flex items-center gap-2">
          <ListCollapse className="h-4 w-4 text-primary" />
          <span>Daftar Isi Artikel</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
            {items.length} bagian
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 text-muted-foreground ${
            isOpenMobile ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpenMobile && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-border/40 space-y-1 max-h-[300px] overflow-y-auto">
              {items.map((item) => {
                const isActive = activeId === item.id;
                return (
                  <button
                    key={`mob-${item.id}`}
                    type="button"
                    onClick={() => scrollToHeading(item.id)}
                    className={`block w-full text-left text-xs transition-colors py-1.5 px-2 rounded-lg cursor-pointer ${
                      item.level === 3
                        ? "pl-5 text-muted-foreground/80 text-[11px]"
                        : "font-medium text-foreground"
                    } ${
                      isActive
                        ? "text-primary dark:text-emerald-400 font-semibold bg-primary/10"
                        : "hover:text-primary hover:bg-muted/50"
                    }`}
                  >
                    <span className="line-clamp-1">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );

  const renderDesktopTOC = () => (
    <div className="sticky top-28 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground pb-2 border-b border-border/40">
        <span className="flex items-center gap-2">
          <ListCollapse className="h-3.5 w-3.5 text-primary" />
          <span>Daftar Isi</span>
        </span>
        <span className="text-[10px] font-mono font-normal lowercase text-muted-foreground/70">
          {items.length} bagian
        </span>
      </div>

      {/* Navigation List with continuous left border rail */}
      <nav className="relative pl-2.5 border-l border-border/50 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
        {items.map((item) => {
          const isActive = activeId === item.id;
          return (
            <button
              key={`desk-${item.id}`}
              type="button"
              onClick={() => scrollToHeading(item.id)}
              className={`block w-full text-left text-xs transition-all duration-150 py-1.5 px-2.5 rounded-lg cursor-pointer relative ${
                item.level === 3
                  ? "pl-4 text-muted-foreground/80 text-[11px]"
                  : "font-medium"
              } ${
                isActive
                  ? "text-primary dark:text-emerald-400 font-semibold bg-primary/10 shadow-xs translate-x-1"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {/* Active left indicator accent */}
              {isActive && (
                <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary rounded-full" />
              )}
              <span className="line-clamp-2 leading-relaxed">{item.text}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  if (variant === "desktop") {
    return renderDesktopTOC();
  }

  if (variant === "mobile") {
    return renderMobileTOC();
  }

  return (
    <>
      {renderMobileTOC()}
      <div className="hidden lg:block">{renderDesktopTOC()}</div>
    </>
  );
}
