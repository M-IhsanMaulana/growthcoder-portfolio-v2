"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Code2,
  MessagesSquare,
  Zap,
  CheckCircle2,
} from "lucide-react";

const GUARANTEES = [
  {
    icon: Code2,
    title: "Clean Code & Arsitektur Terstruktur",
    description:
      "Menerapkan prinsip arsitektur modular dan TypeScript strict mode agar basis kode mudah dipahami, dirawat, dan siap dikembangkan lebih lanjut oleh Anda atau tim di masa depan.",
    badge: "Maintainable Code",
  },
  {
    icon: ShieldCheck,
    title: "Dukungan & Pendampingan Pasca-Rilis",
    description:
      "Menyediakan masa pendampingan teknis dan perbaikan bug setelah peluncuran untuk memastikan aplikasi berjalan stabil dan lancar di lingkungan produksi.",
    badge: "Post-Launch Support",
  },
  {
    icon: MessagesSquare,
    title: "Komunikasi Terbuka & Transparan",
    description:
      "Pembaruan progres berkala, link staging demo yang selalu sinkron, dan saluran komunikasi langsung (Telegram / WhatsApp / Email) selama proses pengerjaan.",
    badge: "Direct Collaboration",
  },
  {
    icon: Zap,
    title: "Performa & Best Practices Modern",
    description:
      "Memperhatikan efisiensi rendering, caching yang tepat, dan optimasi query database agar aplikasi web cepat diakses dan nyaman digunakan pengguna.",
    badge: "Performance Mindset",
  },
];

export function ClientGuarantees() {
  return (
    <section className="py-12 md:py-16">
      <div className="space-y-4 mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-emerald-400 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Komitmen &amp; Pendekatan</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-foreground">
          Standar Kualitas &amp; Prinsip Kerja
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Prinsip dasar yang saya terapkan dalam setiap proyek untuk
          menghasilkan perangkat lunak yang andal, rapi, dan mudah dikembangkan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {GUARANTEES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="p-6 sm:p-7 rounded-3xl border border-border/80 bg-card/50 hover:bg-card/80 backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-lg space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 text-primary dark:text-emerald-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-primary dark:text-emerald-400 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/20">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold font-heading text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-foreground/80 font-medium pt-2 border-t border-border/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary dark:text-emerald-400" />
                <span>Standar mutu dijaga di setiap tahapan pengerjaan</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
