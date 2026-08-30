"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@growthcoder/ui";
import {
  Send,
  Mail,
  MessageSquare,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import type { SiteProfile } from "@growthcoder/types";
import { TiltCard } from "@/components/animations/tilt-card";
import { MagneticButton } from "@/components/animations/magnetic-button";

interface LeadCaptureCtaProps {
  profile: SiteProfile;
  className?: string;
}

export function LeadCaptureCta({
  profile,
  className = "",
}: LeadCaptureCtaProps) {
  const ownerName = profile.ownerName || "Muhammad Ihsan Maulana";
  const telegram = profile.socials?.telegram;
  const whatsapp = profile.socials?.whatsapp;
  const email = profile.email;

  return (
    <section className={`relative py-20 sm:py-28 overflow-hidden ${className}`}>
      {/* Background glow mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-primary/20 via-emerald-500/20 to-teal-400/15 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <TiltCard maxTilt={3} className="rounded-3xl">
            <div className="relative rounded-3xl border border-border/80 bg-card/60 backdrop-blur-2xl p-8 sm:p-14 lg:p-16 text-center shadow-2xl shadow-primary/10 overflow-hidden">
              {/* Top subtle highlight border */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-400" />

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary dark:text-emerald-400 mb-6 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Terbuka untuk Kolaborasi &amp; Konsultasi Teknis</span>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-foreground max-w-3xl mx-auto mb-6 leading-tight">
                Punya Ide Proyek atau Membutuhkan{" "}
                <span className="bg-gradient-to-r from-primary via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Technical Partner?
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                Mari diskusikan perancangan arsitektur sistem, pengembangan
                aplikasi web enterprise, atau konsultasi engineering bersama{" "}
                <span className="font-semibold text-foreground">
                  {ownerName}
                </span>{" "}
                untuk mewujudkan produk digital yang andal, scalable, dan
                berkinerja tinggi.
              </p>

              {/* Action CTAs with Magnetic Pull */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                <MagneticButton strength={0.3} className="w-full sm:w-auto">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto rounded-full px-8 h-12 text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-all hover:scale-[1.02] gap-2 cursor-pointer"
                  >
                    <Link href="/kontak">
                      <Send className="h-4 w-4" />
                      <span>Mulai Percakapan</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </MagneticButton>

                {telegram && (
                  <MagneticButton strength={0.3} className="w-full sm:w-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-7 h-12 text-sm font-semibold border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all gap-2 cursor-pointer"
                    >
                      <a
                        href={
                          telegram.startsWith("http")
                            ? telegram
                            : `https://t.me/${telegram.replace("@", "")}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageSquare className="h-4 w-4 text-primary" />
                        <span>Telegram Chat</span>
                      </a>
                    </Button>
                  </MagneticButton>
                )}

                {whatsapp && !telegram && (
                  <MagneticButton strength={0.3} className="w-full sm:w-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-7 h-12 text-sm font-semibold border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all gap-2 cursor-pointer"
                    >
                      <a
                        href={
                          whatsapp.startsWith("http")
                            ? whatsapp
                            : `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span>WhatsApp</span>
                      </a>
                    </Button>
                  </MagneticButton>
                )}

                {email && !telegram && !whatsapp && (
                  <MagneticButton strength={0.3} className="w-full sm:w-auto">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto rounded-full px-7 h-12 text-sm font-semibold border-border/80 hover:border-primary/50 hover:bg-primary/5 transition-all gap-2 cursor-pointer"
                    >
                      <a href={`mailto:${email}`}>
                        <Mail className="h-4 w-4 text-primary" />
                        <span>Kirim Email</span>
                      </a>
                    </Button>
                  </MagneticButton>
                )}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}
