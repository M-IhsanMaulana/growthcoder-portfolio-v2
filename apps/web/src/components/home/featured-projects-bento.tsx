"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@growthcoder/ui";
import {
  ArrowUpRight,
  ArrowRight,
  FolderGit2,
  ExternalLink,
  Layers,
  Sparkles,
} from "lucide-react";
import type { Project } from "@growthcoder/types";
import { TiltCard } from "@/components/animations/tilt-card";
import { MagneticButton } from "@/components/animations/magnetic-button";

interface FeaturedProjectsBentoProps {
  projects: Project[];
}

export function FeaturedProjectsBento({
  projects,
}: FeaturedProjectsBentoProps) {
  const featuredList = projects.slice(0, 3);
  const primaryProject = featuredList[0];
  const secondaryProjects = featuredList.slice(1, 3);

  if (!primaryProject) {
    return null;
  }

  return (
    <section className="relative py-16 sm:py-24 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Proyek Pilihan</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground">
              Karya &amp; Studi Kasus Unggulan
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-xl">
              Beberapa proyek pilihan yang merangkum pendekatan saya dalam
              memecahkan masalah melalui rekayasa kode, desain antarmuka, dan
              sistem yang efisien.
            </p>
          </div>

          <MagneticButton strength={0.25}>
            <Button
              asChild
              variant="outline"
              className="rounded-full px-6 border-border/80 hover:border-primary/50 text-xs sm:text-sm font-semibold shrink-0 gap-2 self-start md:self-auto"
            >
              <Link href="/projects">
                <span>Semua Proyek</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </MagneticButton>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Primary Featured Card (Span 7 on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col"
          >
            <TiltCard maxTilt={4} className="h-full rounded-3xl">
              <div className="flex flex-col justify-between h-full rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl overflow-hidden shadow-md hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
                {/* Visual Cover Preview */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-muted">
                  {primaryProject.coverImage ? (
                    <Image
                      src={primaryProject.coverImage}
                      alt={primaryProject.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground font-mono text-xs">
                      Cover Image Showcase
                    </div>
                  )}

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-sm pointer-events-auto">
                      {primaryProject.projectYear || 2026}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary text-primary-foreground shadow-md pointer-events-auto">
                      Featured Case Study
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground mb-3 group-hover:text-primary transition-colors">
                      <Link href={`/projects/${primaryProject.slug}`}>
                        {primaryProject.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                      {primaryProject.excerpt}
                    </p>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {primaryProject.techStacks?.map((tech) => (
                        <span
                          key={tech.id || tech.name}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-muted/80 text-foreground border border-border/50"
                        >
                          <Layers className="h-3 w-3 text-primary" />
                          {tech.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                    <Link
                      href={`/projects/${primaryProject.slug}`}
                      className="text-xs sm:text-sm font-semibold text-primary inline-flex items-center gap-1.5 group/btn"
                    >
                      <span>Baca Detail Studi Kasus</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>

                    {primaryProject.demoUrl && (
                      <a
                        href={primaryProject.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <span>Live Demo</span>
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Secondary Cards Column (Span 5 on desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6 sm:gap-8">
            {secondaryProjects.map((project, idx) => (
              <motion.div
                key={project.id || project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx + 1) * 0.15 }}
                className="flex-1 flex flex-col"
              >
                <TiltCard maxTilt={5} className="h-full rounded-3xl">
                  <div className="h-full flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-muted text-muted-foreground border border-border/60">
                          {project.projectYear || 2025}
                        </span>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="h-8 w-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors"
                          aria-label={`Lihat proyek ${project.title}`}
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <h4 className="text-lg sm:text-xl font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors">
                        <Link href={`/projects/${project.slug}`}>
                          {project.title}
                        </Link>
                      </h4>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-5">
                        {project.excerpt}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.techStacks?.slice(0, 3).map((tech) => (
                          <span
                            key={tech.id || tech.name}
                            className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-muted/60 text-foreground border border-border/40"
                          >
                            {tech.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/30 flex items-center justify-between text-xs">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="font-medium text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Pelajari Solusi</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                        >
                          <span>Demo</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}

            {secondaryProjects.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-dashed border-border p-8 text-center text-muted-foreground">
                <FolderGit2 className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium">
                  Proyek unggulan tambahan akan segera dirilis.
                </p>
                <Link
                  href="/projects"
                  className="text-xs text-primary mt-2 hover:underline"
                >
                  Lihat direktori proyek lengkap
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
