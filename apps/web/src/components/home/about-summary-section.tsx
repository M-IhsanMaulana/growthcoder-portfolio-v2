"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@growthcoder/ui";
import { ArrowRight, Sparkles, Layers, Cpu, CheckCircle2 } from "lucide-react";
import type { SiteProfile, Expertise, StatItem } from "@growthcoder/types";
import { AnimatedCounter } from "@/components/animations/animated-counter";
import { TiltCard } from "@/components/animations/tilt-card";
import { MagneticButton } from "@/components/animations/magnetic-button";
import { DEFAULT_STATS, FALLBACK_EXPERTISES } from "@/lib/api";

interface AboutSummarySectionProps {
  profile?: SiteProfile;
  expertises?: Expertise[];
  stats?: StatItem[];
}

export function AboutSummarySection({
  profile: _profile,
  expertises = FALLBACK_EXPERTISES,
  stats = DEFAULT_STATS,
}: AboutSummarySectionProps) {
  const displayExpertises =
    expertises.length > 0 ? expertises : FALLBACK_EXPERTISES;
  const displayStats = stats.length > 0 ? stats : DEFAULT_STATS;

  return (
    <section className="relative py-16 sm:py-24 border-t border-border/40 bg-muted/20 overflow-hidden">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary dark:text-emerald-400 mb-4 shadow-2xs">
            <Cpu className="h-3.5 w-3.5" />
            <span>Keahlian &amp; Spesialisasi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground mb-4">
            Keahlian Utama dalam Pengembangan Web &amp; Sistem Modern
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Kombinasi keahlian dalam membangun arsitektur backend yang andal,
            antarmuka pengguna yang responsif, serta penerapan standar
            pengembangan modern.
          </p>
        </div>

        {/* Dynamic Expertise Cards Grid with 3D Tilt */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {displayExpertises.map((item, idx) => (
            <motion.div
              key={item.id || item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="h-full"
            >
              <TiltCard maxTilt={5} className="h-full rounded-3xl">
                <div className="rounded-3xl border border-border/60 bg-card/60 backdrop-blur-xl p-7 sm:p-8 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 flex flex-col justify-between h-full group">
                  <div className="space-y-4">
                    {/* Top Icon & Subtitle Pill */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center p-2.5 shrink-0 text-primary transition-transform duration-300 group-hover:scale-105 shadow-2xs">
                        {item.iconSvg ? (
                          <div
                            className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
                            dangerouslySetInnerHTML={{ __html: item.iconSvg }}
                          />
                        ) : (
                          <Cpu className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted/80 border border-border/70 text-[11px] font-semibold text-foreground/90">
                        <Sparkles className="w-3 h-3 text-primary shrink-0" />
                        <span>{item.subtitle}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>

                    {/* Connected Tech Stacks Badges */}
                    {item.techStacks && item.techStacks.length > 0 && (
                      <div className="pt-3 border-t border-border/40">
                        <div className="text-[11px] font-semibold text-muted-foreground/80 mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-primary" />
                          <span>Teknologi &amp; Tools Kunci:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.techStacks.map((stack) => (
                            <span
                              key={stack.id}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-background/80 border border-border/60 text-xs font-medium text-foreground hover:border-primary/40 transition-colors"
                            >
                              {stack.iconSvg ? (
                                <span
                                  className="w-3.5 h-3.5 shrink-0 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                                  dangerouslySetInnerHTML={{
                                    __html: stack.iconSvg,
                                  }}
                                />
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              )}
                              <span>{stack.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Standard Footer */}
                  <div className="mt-6 pt-4 border-t border-border/30 flex items-center gap-2 text-xs font-semibold text-primary">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Best Practice &amp; Standar Kualitas</span>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Stats Row & CTA */}
        <div className="rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl p-8 sm:p-10 shadow-sm">
          <div
            className={`grid grid-cols-2 md:grid-cols-${Math.min(
              displayStats.length,
              4,
            )} gap-8 divide-y md:divide-y-0 md:divide-x divide-border/40 text-center`}
          >
            {displayStats.map((stat, i) => (
              <div
                key={stat.id || stat.label}
                className={i > 0 ? "pt-6 md:pt-0 md:pl-6" : ""}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-heading tracking-tight bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent mb-1">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-base font-semibold text-foreground font-heading">
                Ingin melihat riwayat karir, latar belakang, dan sertifikasi
                lengkap?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Ketahui lebih banyak mengenai perjalanan karir dan latar
                belakang teknis saya.
              </p>
            </div>

            <MagneticButton strength={0.25}>
              <Button
                asChild
                variant="outline"
                className="rounded-full px-6 border-border/80 hover:border-primary/50 text-xs sm:text-sm font-semibold shrink-0 gap-2"
              >
                <Link href="/about">
                  <span>Pelajari Tentang Saya</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
