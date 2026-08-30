"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@growthcoder/ui";

export function ServicesHero() {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/20 via-emerald-500/15 to-teal-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-emerald-400 text-xs font-semibold backdrop-blur-md shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span>Terbuka untuk Freelance &amp; Kolaborasi Proyek</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-foreground leading-[1.18]"
        >
          Layanan Pengembangan Web &amp;{" "}
          <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
            Rekayasa Perangkat Lunak
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Membantu Anda merancang dan membangun aplikasi web modern, arsitektur
          backend API yang tangguh, serta solusi otomasi yang terstruktur, rapi,
          dan mudah dikelola.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 pt-2"
        >
          <Button
            asChild
            size="lg"
            className="rounded-xl px-6 font-semibold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 cursor-pointer"
          >
            <Link href="/kontak" id="services-hero-cta-contact">
              <span>Konsultasi / Diskusi Proyek</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-xl px-6 border-border hover:bg-muted/70 gap-2 cursor-pointer"
          >
            <a href="#services-list" id="services-hero-cta-explore">
              <Sparkles className="w-4 h-4 text-primary dark:text-emerald-400" />
              <span>Lihat Spesialisasi Layanan</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
