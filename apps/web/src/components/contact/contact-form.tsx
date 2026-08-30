"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  RefreshCw,
  Mail,
  User,
  MessageSquare,
  Lock,
} from "lucide-react";
import confetti from "canvas-confetti";
import { Button, Input, Textarea, Badge } from "@growthcoder/ui";
import { submitContactInbox } from "@/lib/api";
import { trackEvent } from "@/lib/gtag";
import type { CreateInboxRequest } from "@growthcoder/types";

const CATEGORY_OPTIONS = [
  "Konsultasi / Diskusi Teknis",
  "Pengembangan Web & Aplikasi",
  "Peluang Kerja Sama / Freelance",
  "Tanya Jawab Seputar Karir & Tech",
  "Lainnya",
];

export function ContactForm() {
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [projectCategory, setProjectCategory] = useState<string>(
    "Konsultasi / Diskusi Teknis",
  );
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Auto pre-select from URL searchParams ?service= or ?category=
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const serviceParam = searchParams.get("service");

    if (categoryParam) {
      const match = CATEGORY_OPTIONS.find((c) =>
        c.toLowerCase().includes(categoryParam.toLowerCase()),
      );
      if (match) {
        setProjectCategory(match);
      } else {
        setProjectCategory(categoryParam);
      }
    } else if (serviceParam) {
      if (serviceParam.includes("web"))
        setProjectCategory("Full-Stack Web App");
      else if (serviceParam.includes("api") || serviceParam.includes("backend"))
        setProjectCategory("Backend & API Architecture");
      else if (
        serviceParam.includes("bot") ||
        serviceParam.includes("telegram")
      )
        setProjectCategory("Telegram Bot & Automation");
      else if (
        serviceParam.includes("performance") ||
        serviceParam.includes("audit")
      )
        setProjectCategory("Performance & Code Audit");
    }
  }, [searchParams]);

  const validate = () => {
    const errs: { name?: string; email?: string; message?: string } = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name = "Nama lengkap wajib diisi (minimal 2 karakter).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = "Alamat email tidak valid.";
    }

    if (!message.trim() || message.trim().length < 5) {
      errs.message = "Pesan wajib diisi (minimal 5 karakter).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload: CreateInboxRequest = {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || `Pertanyaan: ${projectCategory}`,
        projectCategory,
        message: message.trim(),
        honeypot: honeypot.trim() || undefined,
      };

      const res = await submitContactInbox(payload);

      if (res.success) {
        setIsSubmitted(true);

        // Track custom conversion event in Google Analytics
        trackEvent({
          action: "submit_contact_form",
          category: "Contact",
          label: projectCategory,
        });

        // Fire celebratory confetti animation
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#10b981", "#14b8a6", "#06b6d4", "#3b82f6"],
          });
        } catch {
          // ignore if canvas not supported
        }
      } else {
        setSubmitError(
          res.message || "Gagal mengirim pesan. Silakan coba lagi.",
        );
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      setSubmitError(error.message || "Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-2xl shadow-xl">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          /* Celebratory Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="text-center py-8 sm:py-12 space-y-6"
          >
            <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/30 text-primary dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-primary/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">
                Pesan Berhasil Terkirim!
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Terima kasih telah menghubungi,{" "}
                <strong className="text-foreground">{name}</strong>. Pesan Anda
                telah kami terima dan notifikasi real-time telah dikirimkan ke
                admin.
              </p>
            </div>

            {/* Submission Summary Card */}
            <div className="p-4 rounded-2xl border border-border/60 bg-muted/20 text-left text-xs space-y-2 max-w-md mx-auto">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="text-muted-foreground">Kategori Proyek:</span>
                <span className="font-semibold text-foreground">
                  {projectCategory}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Email Konfirmasi:</span>
                <span className="font-semibold text-foreground">{email}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-xl text-xs h-10 px-5 gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Kirim Pesan Lainnya</span>
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Form Input State */
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Form Header */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-bold font-heading tracking-tight text-foreground">
                Formulir Diskusi &amp; Kolaborasi
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Lengkapi formulir di bawah ini agar saya dapat memahami topik
                atau ide yang ingin Anda diskusikan.
              </p>
            </div>

            {/* Error Banner if any */}
            {submitError && (
              <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-2.5 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            {/* Honeypot Spam Trap (Hidden) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_honeypot"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* Name & Email Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Nama Lengkap *</span>
                </label>
                <Input
                  placeholder="cth. Budi Santoso"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={`h-11 rounded-xl bg-background/60 border-border/80 text-xs sm:text-sm focus:outline-none focus-visible:outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/30 transition-all ${
                    errors.name
                      ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                      : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-[11px] text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Alamat Email *</span>
                </label>
                <Input
                  type="email"
                  placeholder="cth. budi@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`h-11 rounded-xl bg-background/60 border-border/80 text-xs sm:text-sm focus:outline-none focus-visible:outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/30 transition-all ${
                    errors.email
                      ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                      : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-[11px] text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Project Category (Interactive Pills) */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Topik atau Keperluan Diskusi</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((cat) => {
                  const isSelected = projectCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setProjectCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-semibold ring-2 ring-emerald-500/25 shadow-xs"
                          : "border-border/70 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Subjek Pesan{" "}
                <span className="text-muted-foreground font-normal">
                  (Opsional)
                </span>
              </label>
              <Input
                placeholder="cth. Diskusi Pengembangan Web App / Konsultasi Arsitektur"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-11 rounded-xl bg-background/60 border-border/80 text-xs sm:text-sm focus:outline-none focus-visible:outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/30 transition-all"
              />
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                <span>Pesan atau Detail Diskusi *</span>
              </label>
              <Textarea
                placeholder="Tuliskan pesan, gambaran kebutuhan, pertanyaan teknis, atau rencana yang ingin Anda diskusikan..."
                rows={5}
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  if (errors.message)
                    setErrors((prev) => ({ ...prev, message: undefined }));
                }}
                className={`rounded-2xl bg-background/60 border-border/80 text-xs sm:text-sm leading-relaxed focus:outline-none focus-visible:outline-none focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/30 dark:focus-visible:border-emerald-400 dark:focus-visible:ring-emerald-400/30 transition-all ${
                  errors.message
                    ? "border-destructive focus-visible:ring-destructive focus-visible:border-destructive"
                    : ""
                }`}
              />
              {errors.message && (
                <p className="text-[11px] text-destructive">{errors.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 space-y-2.5">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35 transition-all text-xs sm:text-sm gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim Pesan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Pesan Sekarang</span>
                  </>
                )}
              </Button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
                <Lock className="w-3 h-3 text-muted-foreground/80 shrink-0" />
                <span>
                  Data dan informasi pesan Anda terjaga secara aman &amp;
                  rahasia.
                </span>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
