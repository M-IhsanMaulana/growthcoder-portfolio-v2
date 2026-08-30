import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Grid } from "lucide-react";
import { Button } from "@growthcoder/ui";
import type { Project } from "@growthcoder/types";

interface ProjectAdjacentNavProps {
  prev: Project | null;
  next: Project | null;
}

export function ProjectAdjacentNav({ prev, next }: ProjectAdjacentNavProps) {
  if (!prev && !next) {
    return null;
  }

  return (
    <section className="pt-10 border-t border-border/40">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
          Eksplorasi Studi Kasus Lainnya
        </h4>

        <Button
          asChild
          variant="ghost"
          size="sm"
          className="rounded-full text-xs font-semibold gap-1.5"
        >
          <Link href="/projects">
            <Grid className="h-3.5 w-3.5" />
            <span>Semua Proyek</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Previous Project Card */}
        {prev ? (
          <Link
            href={`/projects/${prev.slug}`}
            className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card/90 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md"
          >
            <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
              {prev.coverImage ? (
                <Image
                  src={prev.coverImage}
                  alt={prev.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
              ) : null}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-1">
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-primary" />
                <span>Proyek Sebelumnya</span>
              </div>
              <h5 className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors truncate">
                {prev.title}
              </h5>
            </div>
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}

        {/* Next Project Card */}
        {next ? (
          <Link
            href={`/projects/${next.slug}`}
            className="group flex items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card/90 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md text-right md:text-right"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground font-mono mb-1">
                <span>Proyek Selanjutnya</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 text-primary" />
              </div>
              <h5 className="text-sm font-bold font-heading text-foreground group-hover:text-primary transition-colors truncate">
                {next.title}
              </h5>
            </div>

            <div className="relative h-16 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
              {next.coverImage ? (
                <Image
                  src={next.coverImage}
                  alt={next.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="80px"
                />
              ) : null}
            </div>
          </Link>
        ) : (
          <div className="hidden md:block" />
        )}
      </div>
    </section>
  );
}
