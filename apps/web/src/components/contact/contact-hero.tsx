"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Clock, ShieldCheck } from "lucide-react";

export function ContactHero() {
  return (
    <section className="relative pt-12 pb-10 md:pt-16 md:pb-12 text-center space-y-5 overflow-hidden">
      {/* Ambient background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-gradient-to-tr from-primary/20 via-emerald-500/15 to-teal-400/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-emerald-400 text-xs font-semibold backdrop-blur-md"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Terbuka untuk Kolaborasi &amp; Diskusi</span>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-5xl md:text-6xl font-bold font-heading tracking-tight text-foreground leading-tight"
      >
        Mari Terhubung &amp;{" "}
        <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
          Mulai Berdiskusi
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
      >
        Saya selalu terbuka untuk bertukar pikiran seputar rekayasa software,
        konsultasi arsitektur sistem, peluang kerja sama, maupun sekadar
        berjejaring santai. Kirimkan pesan Anda dan saya akan merespon secepat
        mungkin.
      </motion.p>
    </section>
  );
}
