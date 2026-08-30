"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PenTool,
  Code2,
  Rocket,
  Check,
  ChevronRight,
  Sparkles,
  ArrowRight,
  GitBranch,
  Layers,
} from "lucide-react";
import type { WorkflowStep } from "@growthcoder/types";
import { FALLBACK_WORKFLOW_STEPS } from "@/lib/api";

interface WorkflowVisualizerProps {
  workflowSteps?: WorkflowStep[];
}

function getWorkflowIcon(iconName?: string | null) {
  switch (iconName) {
    case "Search":
      return Search;
    case "PenTool":
      return PenTool;
    case "Code2":
      return Code2;
    case "Rocket":
      return Rocket;
    case "Layers":
      return Layers;
    case "Sparkles":
      return Sparkles;
    default:
      return GitBranch;
  }
}

export function WorkflowVisualizer({ workflowSteps }: WorkflowVisualizerProps) {
  const steps =
    workflowSteps && workflowSteps.length > 0
      ? workflowSteps
      : FALLBACK_WORKFLOW_STEPS;
  const [activeStep, setActiveStep] = useState(0);

  if (!steps || steps.length === 0) return null;

  const currentStep = steps[activeStep] || steps[0];

  return (
    <section className="py-12 md:py-16">
      <div className="space-y-4 mb-10 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary dark:text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Alur Kerja &amp; Kolaborasi</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold font-heading tracking-tight text-foreground">
          Tahapan Kolaborasi dari Konsep Hingga Rilis
        </h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
          Alur kerja terstruktur dan transparan untuk memastikan setiap tahapan
          pengerjaan terarah dan sesuai ekspektasi.
        </p>
      </div>

      {/* Interactive Step Switcher (Pills) on Top */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto mb-8">
        {steps.map((item, idx) => {
          const isActive = activeStep === idx;
          const IconComp = getWorkflowIcon(item.iconSvg);
          return (
            <button
              key={item.id || item.stepNumber || idx}
              onClick={() => setActiveStep(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden ${
                isActive
                  ? "border-primary bg-card shadow-lg shadow-primary/10"
                  : "border-border/80 bg-card/40 hover:bg-card/80 text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${isActive ? "text-primary dark:text-emerald-400" : "text-muted-foreground"}`}
                >
                  Tahap {item.stepNumber || `0${idx + 1}`}
                </span>
                <IconComp
                  className={`w-4 h-4 ${isActive ? "text-primary dark:text-emerald-400" : "text-muted-foreground"}`}
                />
              </div>
              <span className="text-xs sm:text-sm font-semibold truncate text-foreground font-heading">
                {item.shortTitle}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-emerald-500 to-teal-400" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Stage Detailed Card */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {steps.map((item, idx) => {
            if (idx !== activeStep) return null;
            const IconComp = getWorkflowIcon(item.iconSvg);
            const totalSteps = steps.length;
            const totalLabel =
              totalSteps < 10 ? `0${totalSteps}` : `${totalSteps}`;
            const stepNumLabel =
              item.stepNumber || (idx + 1 < 10 ? `0${idx + 1}` : `${idx + 1}`);

            return (
              <motion.div
                key={item.id || item.stepNumber || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="p-6 sm:p-8 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-xl shadow-xl space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-emerald-500 flex items-center justify-center text-white shadow-md">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-primary dark:text-emerald-400">
                        Tahap {stepNumLabel} dari {totalLabel}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {idx > 0 && (
                      <button
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        className="px-3 py-1.5 rounded-xl border border-border bg-muted/40 hover:bg-muted text-xs font-semibold text-foreground transition-colors cursor-pointer"
                      >
                        Kembali
                      </button>
                    )}
                    {idx < steps.length - 1 ? (
                      <button
                        onClick={() => setActiveStep((prev) => prev + 1)}
                        className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <span>Tahap Berikutnya</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href="/kontak"
                        className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-xs font-semibold text-primary-foreground transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <span>Mulai Diskusi Proyek</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {item.description}
                </p>

                {item.activities && item.activities.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Aktivitas Kunci &amp; Deliverables:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {item.activities.map((act, actIdx) => (
                        <div
                          key={actIdx}
                          className="flex items-center gap-2.5 p-3 rounded-xl border border-border/60 bg-muted/20 text-xs text-foreground/90"
                        >
                          <div className="w-5 h-5 rounded-full bg-primary/10 text-primary dark:text-emerald-400 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                          <span className="leading-tight">{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
