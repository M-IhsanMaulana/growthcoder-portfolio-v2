import * as React from "react";
import { Compass, Code2 } from "lucide-react";
import type { DevelopmentPhilosophy } from "@growthcoder/types";

interface EngineeringPhilosophiesSectionProps {
  philosophies: DevelopmentPhilosophy[];
}

export function EngineeringPhilosophiesSection({
  philosophies = [],
}: EngineeringPhilosophiesSectionProps) {
  if (!philosophies || philosophies.length === 0) {
    return null;
  }

  return (
    <section className="py-14 md:py-20 border-b border-border/60 relative">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section Header */}
        <div className="space-y-2 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Prinsip &amp; Standar Kerja</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
            Filosofi Rekayasa Perangkat Lunak
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
            Prinsip fundamental dan pola pikir rekayasa yang saya pegang teguh
            dalam merancang dan memelihara sistem perangkat lunak berkualitas
            enterprise.
          </p>
        </div>

        {/* Philosophies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {philosophies.map((phil, idx) => (
            <div
              key={phil.id || idx}
              className="group relative rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-7 backdrop-blur-md shadow-xs hover:border-primary/50 hover:shadow-md transition-all space-y-4"
            >
              {/* Top Row: Icon & Index */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  {phil.iconSvg ? (
                    <div
                      className="w-5 h-5 [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: phil.iconSvg }}
                    />
                  ) : (
                    <Code2 className="w-5 h-5" />
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-muted-foreground/60">
                  #0{idx + 1}
                </span>
              </div>

              {/* Title & Tagline */}
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {phil.title}
                </h3>
                {phil.tagline && (
                  <p className="text-xs font-semibold text-primary/90 italic">
                    &ldquo;{phil.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {phil.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
