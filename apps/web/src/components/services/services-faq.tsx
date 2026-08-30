"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  HelpCircle,
  Search,
  MessageCircleQuestion,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";
import { Input, Button, Badge } from "@growthcoder/ui";
import type { Service, ServiceFaq } from "@growthcoder/types";

interface ServicesFaqProps {
  services: Service[];
}

const GENERAL_FAQS: ServiceFaq[] = [
  {
    id: "g-faq-1",
    serviceId: "general",
    question: "Bagaimana skema pembayaran untuk pengerjaan proyek?",
    answer:
      "Skema standar biasanya dibagi menjadi beberapa termin sesuai kesepakatan: DP saat kickoff, pembayaran saat demo progres milestone inti, dan pelunasan saat sistem siap rilis serta serah terima repositori.",
    sortOrder: 1,
  },
  {
    id: "g-faq-2",
    serviceId: "general",
    question: "Apakah melayani integrasi sistem dengan platform pihak ketiga?",
    answer:
      "Ya. Saya berpengalaman dalam mengintegrasikan berbagai API pihak ketiga seperti Payment Gateway (Midtrans, Xendit, Stripe), kurir logistik (RajaOngkir, Biteship), OAuth (Google, GitHub), serta integrasi AI LLM (OpenAI, Claude).",
    sortOrder: 2,
  },
  {
    id: "g-faq-3",
    serviceId: "general",
    question:
      "Bagaimana jika ada kebutuhan penambahan fitur baru di tengah pengerjaan?",
    answer:
      "Saya menerapkan alur penyesuaian yang fleksibel. Kebutuhan fitur baru akan dievaluasi pengaruhnya terhadap timeline dan ruang lingkup, kemudian dijadwalkan setelah didiskusikan bersama.",
    sortOrder: 3,
  },
];

export function ServicesFaq({ services }: ServicesFaqProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>("g-faq-1");
  const [showAll, setShowAll] = useState(false);

  // Combine service specific FAQs and general FAQs
  const allFaqs = useMemo(() => {
    const list: Array<{
      id: string;
      question: string;
      answer: string;
      category: string;
      categoryKey: string;
    }> = [];

    GENERAL_FAQS.forEach((g) => {
      list.push({
        id: g.id,
        question: g.question,
        answer: g.answer,
        category: "Umum & Kolaborasi",
        categoryKey: "general",
      });
    });

    services.forEach((s) => {
      s.faqs?.forEach((f) => {
        list.push({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: s.title,
          categoryKey: s.slug || s.id,
        });
      });
    });

    return list;
  }, [services]);

  // Unique categories for filter pills
  const categories = useMemo(() => {
    const map = new Map<
      string,
      { key: string; label: string; count: number }
    >();
    map.set("all", {
      key: "all",
      label: "Semua Pertanyaan",
      count: allFaqs.length,
    });

    allFaqs.forEach((faq) => {
      if (!map.has(faq.categoryKey)) {
        // Shorten category label for cleaner pill buttons
        let shortLabel = faq.category;
        if (faq.category.includes("Full-Stack")) shortLabel = "Full-Stack Web";
        else if (faq.category.includes("Backend")) shortLabel = "Backend & API";
        else if (faq.category.includes("Telegram")) shortLabel = "Telegram Bot";
        else if (faq.category.includes("Performance"))
          shortLabel = "Audit & Performa";

        map.set(faq.categoryKey, {
          key: faq.categoryKey,
          label: shortLabel,
          count: 0,
        });
      }
      const item = map.get(faq.categoryKey)!;
      item.count += 1;
    });

    return Array.from(map.values());
  }, [allFaqs]);

  const filteredFaqs = useMemo(() => {
    let result = allFaqs;

    if (activeCategory !== "all") {
      result = result.filter((f) => f.categoryKey === activeCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q),
      );
    }

    return result;
  }, [allFaqs, activeCategory, search]);

  // If showing all or searching or specific category is selected, display all filtered;
  // otherwise limit initial view to 5 items to keep it compact.
  const isDefaultView = activeCategory === "all" && !search.trim();
  const visibleFaqs =
    isDefaultView && !showAll ? filteredFaqs.slice(0, 5) : filteredFaqs;

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-12 md:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Side: Header & Interactive Filters */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-emerald-400 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>FAQ &amp; Informasi Teknis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading tracking-tight text-foreground leading-tight">
              Pertanyaan Seputar Kerja Sama
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Ringkasan jawaban seputar alur kerja sama, standar teknis, dan
              proses pengerjaan proyek.
            </p>
          </div>

          {/* Compact Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari pertanyaan / topik..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-9 h-10 rounded-2xl bg-card/60 border-border/80 text-xs sm:text-sm placeholder:text-muted-foreground/70"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer p-0.5 rounded-full"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Kategori Pertanyaan:
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setActiveCategory(cat.key);
                      setShowAll(true);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                        : "bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-border/50"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Direct Help Card */}
          <div className="p-4 sm:p-5 rounded-2xl border border-border/70 bg-card/40 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2.5 text-foreground">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center">
                <MessageCircleQuestion className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold">
                Punya pertanyaan lain?
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Jika butuh penjelasan lebih spesifik terkait kebutuhan proyek
              Anda, silakan hubungi langsung.
            </p>
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full rounded-xl text-xs font-medium h-8 border-border hover:bg-muted/80 gap-1.5 cursor-pointer"
            >
              <Link href="/kontak">
                <span>Kirim Pesan / Konsultasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Right Side: Compact Accordion List */}
        <div className="lg:col-span-7 space-y-3">
          {visibleFaqs.length > 0 ? (
            <>
              {visibleFaqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? "border-primary/40 bg-card/90 shadow-md shadow-primary/5"
                        : "border-border/70 bg-card/40 hover:bg-card/70"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full p-4 sm:p-4.5 text-left flex items-center justify-between gap-3 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="space-y-1 pr-2">
                        <span className="text-[10px] font-bold text-primary dark:text-emerald-400 uppercase tracking-wider">
                          {faq.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold font-heading text-foreground leading-snug">
                          {faq.question}
                        </h4>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border border-border flex items-center justify-center shrink-0 text-muted-foreground transition-transform duration-200 ${
                          isOpen
                            ? "rotate-180 bg-primary text-primary-foreground border-primary"
                            : ""
                        }`}
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                          <div className="px-4 pb-4 pt-1 text-xs sm:text-[13px] text-muted-foreground leading-relaxed border-t border-border/40">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {/* Show More / Show Less Button if in default view */}
              {isDefaultView && filteredFaqs.length > 5 && (
                <div className="pt-2 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    className="rounded-xl text-xs font-medium px-4 h-9 border-border/80 hover:bg-card cursor-pointer"
                  >
                    {showAll ? (
                      <span>Tampilkan Lebih Sedikit</span>
                    ) : (
                      <span>
                        Lihat Semua Pertanyaan ({filteredFaqs.length})
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-card/30 space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Tidak ada pertanyaan yang sesuai dengan kata kunci &quot;
                {search}&quot;.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="text-xs text-primary dark:text-emerald-400 hover:bg-primary/10 cursor-pointer"
              >
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
