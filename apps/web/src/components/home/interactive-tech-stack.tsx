"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Database,
  Cloud,
  Wrench,
  Sparkles,
  Layers,
} from "lucide-react";
import type { TechStack, TechCategory } from "@growthcoder/types";

interface InteractiveTechStackProps {
  techStacks: TechStack[];
}

const CATEGORY_TABS: Array<{
  id: string;
  label: string;
  icon: React.ElementType;
  category?: TechCategory;
}> = [
  { id: "all", label: "Semua Stack", icon: Layers },
  { id: "frontend", label: "Frontend", icon: Code2, category: "frontend" },
  { id: "backend", label: "Backend & API", icon: Server, category: "backend" },
  { id: "database", label: "Database", icon: Database, category: "database" },
  { id: "devops", label: "DevOps & Cloud", icon: Cloud, category: "devops" },
  { id: "tools", label: "Tools & Ecosystem", icon: Wrench, category: "tools" },
];

export function InteractiveTechStack({
  techStacks,
}: InteractiveTechStackProps) {
  const [activeTab, setActiveTab] = useState("all");

  const filteredStacks = useMemo(() => {
    if (activeTab === "all") return techStacks;
    return techStacks.filter((s) => s.category === activeTab);
  }, [activeTab, techStacks]);

  return (
    <section className="relative py-16 sm:py-24 border-t border-border/40 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-4">
            <Code2 className="h-3.5 w-3.5" />
            <span>Tech Stack &amp; Tools</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground mb-4">
            Teknologi &amp; Toolkit Pilihan
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            Kumpulan instrumen, bahasa pemrograman, dan infrastruktur modern
            yang saya gunakan untuk mengembangkan aplikasi skalabel dan
            berperforma tinggi.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-2 cursor-pointer select-none ${
                  isActive
                    ? "text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:scale-[1.02] active:scale-95"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="techTab"
                    className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/25"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tech Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredStacks.map((tech) => (
              <motion.div
                key={tech.id || tech.slug}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xl p-4 sm:p-5 flex flex-col items-center text-center justify-center gap-3 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-emerald-500/40 transition-all duration-300 cursor-pointer select-none"
              >
                {/* Featured Star Badge */}
                {tech.isFeatured && (
                  <div className="absolute top-2.5 right-2.5">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span
                        className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                        title="Core Specialization"
                      ></span>
                    </span>
                  </div>
                )}

                {/* SVG Icon or Fallback Icon */}
                <div className="h-12 w-12 rounded-xl bg-muted/80 p-2 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-200">
                  {tech.iconSvg ? (
                    <div
                      className="h-8 w-8 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full"
                      dangerouslySetInnerHTML={{ __html: tech.iconSvg }}
                    />
                  ) : (
                    <Layers className="h-6 w-6 text-primary" />
                  )}
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                    {tech.name}
                  </h3>
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block mt-0.5">
                    {tech.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
