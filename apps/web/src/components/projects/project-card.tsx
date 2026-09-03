"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
} from "lucide-react";
import { trackProjectClick } from "@/lib/api";
import type { Project } from "@growthcoder/types";
import { TiltCard } from "@/components/animations/tilt-card";

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const handleTrack = (
    e: React.MouseEvent,
    type: "demo_click" | "repo_click",
  ) => {
    e.stopPropagation();
    trackProjectClick(project.slug, type);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="h-full flex flex-col"
    >
      <TiltCard maxTilt={5} className="h-full rounded-3xl">
        <article className="relative group flex flex-col justify-between rounded-3xl border border-border/70 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm hover:shadow-2xl hover:border-primary/50 transition-all duration-300 h-full cursor-pointer">
          {/* Cover Image & Overlay Badges */}
          <div className="relative w-full aspect-video overflow-hidden bg-muted">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/60 text-muted-foreground font-mono text-xs">
                {project.title}
              </div>
            )}

            {/* Top Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
              <div className="flex items-center gap-1.5">
                {project.category && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-background/90 backdrop-blur-md text-foreground border border-border/60 shadow-sm">
                    {project.category.name}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-background/80 backdrop-blur-md text-muted-foreground border border-border/40">
                  {project.projectYear || 2026}
                </span>
              </div>

              {project.isFeatured && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="h-3 w-3" />
                  <span>Unggulan</span>
                </span>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
            <div>
              {project.clientName && (
                <p className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 line-clamp-1">
                  Klien:{" "}
                  <span className="text-foreground font-medium">
                    {project.clientName}
                  </span>
                </p>
              )}

              <h3 className="text-lg sm:text-xl font-bold font-heading text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="after:absolute after:inset-0 after:z-10 focus:outline-none"
                >
                  {project.title}
                </Link>
              </h3>

              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                {project.excerpt}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {project.techStacks?.slice(0, 4).map((tech) => (
                  <span
                    key={tech.id || tech.name}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono bg-muted/60 text-foreground border border-border/40"
                  >
                    <Layers className="h-2.5 w-2.5 text-primary" />
                    {tech.name}
                  </span>
                ))}
                {(project.techStacks?.length || 0) > 4 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-muted text-muted-foreground border border-border/30">
                    +{(project.techStacks?.length || 0) - 4}
                  </span>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-border/40 flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm font-semibold text-primary inline-flex items-center gap-1">
                <span>Studi Kasus</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>

              <div className="relative z-20 flex items-center gap-1.5">
                {project.repositoryUrl && (
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => handleTrack(e, "repo_click")}
                    className="h-8 w-8 rounded-full border border-border/60 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors"
                    title="Lihat GitHub Repository"
                    aria-label={`GitHub Repository ${project.title}`}
                  >
                    <Github className="h-3.5 w-3.5" />
                  </a>
                )}

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => handleTrack(e, "demo_click")}
                    className="h-8 w-8 rounded-full border border-border/60 bg-muted/40 hover:bg-primary hover:text-primary-foreground hover:border-primary text-muted-foreground flex items-center justify-center transition-colors"
                    title="Buka Live Demo"
                    aria-label={`Live Demo ${project.title}`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}
