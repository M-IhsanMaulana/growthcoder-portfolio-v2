"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Layers,
  Server,
  Bot,
  Zap,
  CheckCircle2,
  ArrowRight,
  Code2,
  Sparkles,
} from "lucide-react";
import { Button, Badge } from "@growthcoder/ui";
import type { Service } from "@growthcoder/types";
import { TiltCard } from "@/components/animations/tilt-card";
import { MagneticButton } from "@/components/animations/magnetic-button";

interface ServicesGridProps {
  services: Service[];
}

function getServiceIcon(iconSvg?: string | null) {
  switch (iconSvg) {
    case "Layers":
      return <Layers className="w-6 h-6 text-emerald-500" />;
    case "Server":
      return <Server className="w-6 h-6 text-teal-500" />;
    case "Bot":
      return <Bot className="w-6 h-6 text-cyan-500" />;
    case "Zap":
      return <Zap className="w-6 h-6 text-amber-500" />;
    default:
      return <Code2 className="w-6 h-6 text-emerald-500" />;
  }
}

export function ServicesGrid({ services }: ServicesGridProps) {
  return (
    <section id="services-list" className="py-12 md:py-16">
      <div className="space-y-4 mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spesialisasi &amp; Layanan</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-foreground">
          Bidang Layanan &amp; Keahlian Teknis
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Fokus pada penulisan kode yang bersih, arsitektur modular, dan solusi
          teknis yang disesuaikan dengan kebutuhan proyek Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id || service.slug}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-full flex flex-col"
          >
            <TiltCard maxTilt={4} className="h-full rounded-3xl">
              <div className="group relative rounded-3xl border border-border/80 bg-card/60 hover:bg-card/90 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 h-full">
                {/* Top accent badge & icon */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted/80 border border-border/80 flex items-center justify-center shadow-xs group-hover:scale-105 group-hover:border-primary/30 transition-transform">
                      {getServiceIcon(service.iconSvg)}
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-primary/5 text-primary dark:text-emerald-400 border-primary/20 text-xs py-1 px-3"
                    >
                      {service.valueProposition}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground group-hover:text-primary dark:group-hover:text-emerald-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="pt-3 border-t border-border/60 space-y-2.5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Cakupan Pekerjaan (Deliverables):
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-foreground/90">
                      {service.deliverables?.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-6 mt-6 border-t border-border/60 flex items-center justify-between gap-4">
                  <span className="text-xs text-muted-foreground font-medium">
                    Estimasi pengerjaan fleksibel sesuai lingkup kebutuhan
                  </span>
                  <MagneticButton strength={0.25}>
                    <Button
                      asChild
                      className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-xs font-semibold px-4 h-9 shadow-sm group/btn cursor-pointer"
                    >
                      <Link
                        href={`/kontak?service=${encodeURIComponent(service.slug)}&category=${encodeURIComponent(service.title)}`}
                        id={`service-cta-${service.slug}`}
                      >
                        <span>Diskusikan Layanan</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </Link>
                    </Button>
                  </MagneticButton>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
