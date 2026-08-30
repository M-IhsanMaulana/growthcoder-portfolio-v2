"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Code2,
  Image as ImageIcon,
  Check,
  Search,
  Trash2,
  Layers,
  Wrench,
  Lightbulb,
  Palette,
  FolderOpen,
} from "lucide-react";
import { Button, Input, Textarea } from "@growthcoder/ui";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import type { MediaAsset } from "@growthcoder/types";

export type IconCategory = "tech" | "services" | "philosophies" | "general";

export interface PresetIconItem {
  id: string;
  name: string;
  category: IconCategory;
  tags?: string[];
  svg: string;
}

export const PRESET_UNIVERSAL_ICONS: PresetIconItem[] = [
  // ==========================================
  // 1. SERVICES & SOLUTIONS ICONS
  // ==========================================
  {
    id: "svc-fullstack",
    name: "Full-Stack Web Development",
    category: "services",
    tags: ["web", "frontend", "backend", "saas", "application"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/><path d="m7 8 2 2-2 2"/><path d="M13 12h4"/></svg>`,
  },
  {
    id: "svc-api",
    name: "Backend API & Microservices",
    category: "services",
    tags: ["api", "backend", "server", "rest", "microservices"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/><path d="M18 10v4"/><path d="m15 12 3 2 3-2"/></svg>`,
  },
  {
    id: "svc-database",
    name: "Database Architecture & Tuning",
    category: "services",
    tags: ["database", "sql", "postgresql", "redis", "optimization"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>`,
  },
  {
    id: "svc-telegram-bot",
    name: "Telegram & Automation Bots",
    category: "services",
    tags: ["bot", "telegram", "automation", "webhook", "integration"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-400"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  },
  {
    id: "svc-devops",
    name: "Cloud Infrastructure & DevOps",
    category: "services",
    tags: ["cloud", "devops", "docker", "ci/cd", "deployment"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-500"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><path d="m12 12-2 3h4l-2 3"/></svg>`,
  },
  {
    id: "svc-security",
    name: "Security Audit & Hardening",
    category: "services",
    tags: ["security", "auth", "passkey", "audit", "shield"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>`,
  },
  {
    id: "svc-mobile",
    name: "Mobile & Responsive Web Apps",
    category: "services",
    tags: ["mobile", "responsive", "pwa", "ios", "android"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-500"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
  },
  {
    id: "svc-uiux",
    name: "UI/UX & Interactive Design",
    category: "services",
    tags: ["ui", "ux", "design", "figma", "frontend", "tailwind"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-pink-500"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
  },
  {
    id: "svc-maintenance",
    name: "Maintenance & SLA Support",
    category: "services",
    tags: ["maintenance", "support", "sla", "monitoring", "bugfix"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  },
  {
    id: "svc-ai",
    name: "AI Integration & Agentic Systems",
    category: "services",
    tags: ["ai", "agent", "llm", "automation", "intelligence"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>`,
  },

  // ==========================================
  // 2. PHILOSOPHIES & MINDSET ICONS
  // ==========================================
  {
    id: "phil-clean-code",
    name: "Clean Code & Architecture",
    category: "philosophies",
    tags: ["clean", "code", "solid", "architecture", "maintainable"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-emerald-500"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/><line x1="14" x2="10" y1="4" y2="20"/></svg>`,
  },
  {
    id: "phil-pragmatism",
    name: "Pragmatic & Solution-Oriented",
    category: "philosophies",
    tags: ["pragmatic", "balance", "delivery", "value", "engineering"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-500"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  },
  {
    id: "phil-automation",
    name: "Automation & CI/CD First",
    category: "philosophies",
    tags: ["automation", "cicd", "workflow", "efficiency", "repeatability"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>`,
  },
  {
    id: "phil-tdd",
    name: "Testing & Quality Assurance (TDD)",
    category: "philosophies",
    tags: ["test", "tdd", "qa", "reliability", "confidence"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  },
  {
    id: "phil-performance",
    name: "Performance & Fast Latency",
    category: "philosophies",
    tags: ["speed", "performance", "latency", "optimization", "lightning"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  },
  {
    id: "phil-security-design",
    name: "Security by Design",
    category: "philosophies",
    tags: ["security", "privacy", "auth", "protection", "resilience"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  },
  {
    id: "phil-continuous-learning",
    name: "Continuous Learning & Evolution",
    category: "philosophies",
    tags: ["learning", "growth", "knowledge", "mindset", "innovation"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`,
  },
  {
    id: "phil-scalability",
    name: "Scalability & High Availability",
    category: "philosophies",
    tags: ["scale", "scalability", "growth", "distributed", "resilience"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/></svg>`,
  },
  {
    id: "phil-dx",
    name: "Developer Experience (DX)",
    category: "philosophies",
    tags: ["dx", "developer", "experience", "ergonomics", "tooling"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-fuchsia-500"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
  },

  // ==========================================
  // 3. TECH STACKS & LOGOS (Branded SVG)
  // ==========================================
  {
    id: "tech-typescript",
    name: "TypeScript",
    category: "tech",
    tags: ["typescript", "ts", "javascript", "lang"],
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#3178C6" d="M0 0h128v128H0z"/><path fill="#FFF" d="M37.3 54.8h-11v46.7h-9.5V54.8h-11v-7.9h31.5v7.9zm27.4 33.2c1.9 2.5 4.8 4.2 8.4 4.2 4.1 0 6.6-2.1 6.6-5.1 0-3.3-2.6-4.6-7.3-6.5-6.5-2.6-11.4-5.8-11.4-13 0-7.3 5.8-13.3 15-13.3 5.7 0 10.3 2 13.5 5.5l-5.3 5.6c-2.4-2.5-5.2-3.8-8.2-3.8-3.7 0-5.8 2-5.8 4.5 0 2.8 2.2 3.9 6.8 5.7 7.1 2.8 11.9 6.1 11.9 13.8 0 8.2-6.5 13.9-16.1 13.9-7.3 0-12.8-2.6-16.6-7.1l5.5-5.4z"/></svg>`,
  },
  {
    id: "tech-javascript",
    name: "JavaScript",
    category: "tech",
    tags: ["javascript", "js", "es6", "web"],
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#F7DF1E" d="M0 0h128v128H0z"/><path fill="#000" d="M67.3 101.4c2.8 4.6 6.8 7.6 13.5 7.6 5.8 0 9.5-2.9 9.5-6.9 0-4.8-3.8-6.6-10.2-9.4l-3.5-1.5c-10.1-4.3-16.8-9.7-16.8-21 0-10.5 8.1-18.4 20.8-18.4 9 0 15.5 3.3 19.8 10.9l-7.7 4.9c-2.3-4.1-5.3-6.1-12.1-6.1-5.4 0-8.8 2.5-8.8 5.9 0 4.1 2.6 5.8 8.6 8.4l3.5 1.5c11.9 5.1 18.5 10.5 18.5 22.2 0 12.7-9.9 19.6-22.7 19.6-12.7 0-20.9-6.3-24.9-14.7l10.5-4.5zm-38 1.4c2.1 3.5 4.5 6.4 9.1 6.4 4.7 0 7.7-2.4 7.7-11.4V52.7h12.5v43.9c0 14.7-8.6 21.1-20.2 21.1-10.4 0-16.5-5.3-19.8-13.1l10.7-6.9z"/></svg>`,
  },
  {
    id: "tech-react",
    name: "React",
    category: "tech",
    tags: ["react", "ui", "frontend", "components"],
    svg: `<svg viewBox="-11.5 -10.232 23 20.463" width="100%" height="100%"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
  },
  {
    id: "tech-nextjs",
    name: "Next.js",
    category: "tech",
    tags: ["next", "nextjs", "ssr", "react", "fullstack"],
    svg: `<svg viewBox="0 0 180 180" width="100%" height="100%"><mask height="180" id="next-mask" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="#fff" r="90"/></mask><g mask="url(#next-mask)"><circle cx="90" cy="90" fill="#000" r="90"/><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z" fill="#fff"/><path d="M115 54H127.114V126H115V54Z" fill="#fff"/></g></svg>`,
  },
  {
    id: "tech-tailwind",
    name: "Tailwind CSS",
    category: "tech",
    tags: ["tailwind", "css", "ui", "styling"],
    svg: `<svg viewBox="0 0 32 32" width="100%" height="100%"><path fill="#38BDF8" d="M16 6.4c-5.333 0-8.533 2.667-9.6 8 2.133-2.667 4.8-3.733 8-3.2 1.829.305 3.136 1.633 4.583 3.102C21.34 16.685 24.115 19.5 30.4 19.5c5.333 0 8.533-2.667 9.6-8-2.133 2.667-4.8 3.733-8 3.2-1.829-.305-3.136-1.633-4.583-3.102C25.06 9.215 22.285 6.4 16 6.4zm-9.6 9.6C1.067 16-2.133 18.667-3.2 24c2.133-2.667 4.8-3.733 8-3.2 1.829.305 3.136 1.633 4.583 3.102C11.74 26.285 14.515 29.1 20.8 29.1c5.333 0 8.533-2.667 9.6-8-2.133 2.667-4.8 3.733-8 3.2-1.829-.305-3.136-1.633-4.583-3.102C15.46 18.815 12.685 16 6.4 16z"/></svg>`,
  },
  {
    id: "tech-adonisjs",
    name: "AdonisJS",
    category: "tech",
    tags: ["adonis", "adonisjs", "backend", "node", "mvc"],
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" rx="20" fill="#5A45FF"/><path d="M50 18L18 78h16l8-16h16l8 16h16L50 18zm0 22l8 16H42l8-16z" fill="#FFFFFF"/></svg>`,
  },
  {
    id: "tech-nodejs",
    name: "Node.js",
    category: "tech",
    tags: ["node", "nodejs", "backend", "javascript"],
    svg: `<svg viewBox="0 0 256 289" width="100%" height="100%"><path fill="#339933" d="M128 0L0 74v141l128 74 128-74V74L128 0zm0 28.5l103.3 59.6v113.8L128 261.5 24.7 201.9V88.1L128 28.5z"/><path fill="#66CC33" d="M128 47.7l86.6 50v95.6L128 243.3 41.4 193.3V97.7L128 47.7z"/></svg>`,
  },
  {
    id: "tech-postgresql",
    name: "PostgreSQL",
    category: "tech",
    tags: ["postgres", "postgresql", "sql", "database"],
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#336791" d="M64 4C30.9 4 4 30.9 4 64s26.9 60 60 60 60-26.9 60-60S97.1 4 64 4zm28.8 84.8c-2.6 5.8-9 9.3-15.6 9.3-7.8 0-14.7-4.8-17.5-12.2l-4.7 1.8c3.5 9.3 12.3 15.3 22.2 15.3 8.4 0 16.5-4.5 19.8-11.9l-4.2-2.3zm-17-48c0-8.7-7-15.7-15.7-15.7-8.7 0-15.7 7-15.7 15.7 0 8.7 7 15.7 15.7 15.7 8.7 0 15.7-7 15.7-15.7z"/></svg>`,
  },
  {
    id: "tech-docker",
    name: "Docker",
    category: "tech",
    tags: ["docker", "container", "devops", "cloud"],
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#2496ED" d="M123.8 54.8c-1.3-.9-6.3-4.1-16.1-2.9-.6-2.9-2.3-5.5-4.8-7.3-3.6-2.5-8.5-3.2-12.7-1.8-1.6-6.9-6.5-12.4-13.4-14.7l-4.1-1.4-2.5 3.6c-4.7 6.7-6.2 14.9-4.2 22.8-.7.4-1.5.8-2.2 1.3H3.6c-2 0-3.6 1.6-3.6 3.6 0 17 6.7 32.8 18.9 44.5 12.6 12 29.5 18.6 47.7 18.6 36.9 0 62.4-23.7 62.8-24.1l3.1-2.9-.8-4.2c-.7-3.9-.2-8 1.5-11.6 1.4-3.1 3.5-5.6 5.8-7.3l2.8-2.1-3.6-1.1zM28.3 54h11.9v11.9H28.3V54zm14.9 0h11.9v11.9H43.2V54zm14.9 0H70v11.9H58.1V54zm-29.8-14.9h11.9V51H28.3V39.1zm14.9 0h11.9V51H43.2V39.1zm14.9 0H70V51H58.1V39.1zM73 54h11.9v11.9H73V54zm0-14.9h11.9V51H73V39.1zM58.1 24.2H70v11.9H58.1V24.2z"/></svg>`,
  },
  {
    id: "tech-git",
    name: "Git",
    category: "tech",
    tags: ["git", "vcs", "github", "tools"],
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#F05032" d="M124.7 57.3L70.7 3.3c-4.4-4.4-11.6-4.4-16 0L39.8 18.2l20.2 20.2c4.7-1.6 10.2-.5 13.9 3.2 3.7 3.7 4.8 9.2 3.2 13.9l19.5 19.5c4.7-1.6 10.2-.5 13.9 3.2 5.3 5.3 5.3 13.9 0 19.2-5.3 5.3-13.9 5.3-19.2 0-4-4-4.9-9.9-2.9-14.8L70.2 64.5v30.9c1.4.7 2.7 1.8 3.7 2.8 5.3 5.3 5.3 13.9 0 19.2s-13.9 5.3-19.2 0c-5.3-5.3-5.3-13.9 0-19.2 1.3-1.3 2.9-2.3 4.6-2.9V63.5c1.7-.6 3.3-1.6 4.6-2.9 2-2 3.1-4.6 3.3-7.3L48.1 34.2 3.3 79c-4.4 4.4-4.4 11.6 0 16l54 54c4.4 4.4 11.6 4.4 16 0l51.4-51.4c4.4-4.4 4.4-11.6 0-16.3z"/></svg>`,
  },
  {
    id: "tech-figma",
    name: "Figma",
    category: "tech",
    tags: ["figma", "design", "ui", "ux"],
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#0ACF83" d="M44 128c11 0 20-9 20-20V88H44c-11 0-20 9-20 20s9 20 20 20z"/><path fill="#A259FF" d="M24 68c0-11 9-20 20-20h20v40H44c-11 0-20-9-20-20z"/><path fill="#F24E1E" d="M24 28c0-11 9-20 20-20h20v40H44c-11 0-20-9-20-20z"/><path fill="#FF7262" d="M64 8h20c11 0 20 9 20 20s-9 20-20 20H64V8z"/><path fill="#1ABCFE" d="M104 68c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20z"/></svg>`,
  },

  // ==========================================
  // 4. GENERAL VECTOR SYMBOLS
  // ==========================================
  {
    id: "gen-rocket",
    name: "Rocket Launch",
    category: "general",
    tags: ["rocket", "launch", "startup", "growth"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
  },
  {
    id: "gen-sparkles",
    name: "Magic Sparkles",
    category: "general",
    tags: ["sparkles", "magic", "feature", "modern"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-400"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
  },
  {
    id: "gen-trophy",
    name: "Achievement Trophy",
    category: "general",
    tags: ["trophy", "award", "quality", "excellence"],
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-yellow-500"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.45.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
  },
];

interface UniversalIconPickerProps {
  value: string | null | undefined;
  onChange: (svg: string | null) => void;
  defaultCategory?: IconCategory | "all";
  label?: string;
  description?: string;
}

export function UniversalIconPicker({
  value,
  onChange,
  defaultCategory = "all",
  label = "Icon Representatif",
  description = "Pilih dari preset library, input custom SVG, atau ambil dari Media Library",
}: UniversalIconPickerProps) {
  const [mode, setMode] = useState<"preset" | "raw" | "media">("preset");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    IconCategory | "all"
  >(defaultCategory);
  const [rawSvgInput, setRawSvgInput] = useState(value || "");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Filter preset icons
  const filteredPresets = useMemo(() => {
    return PRESET_UNIVERSAL_ICONS.filter((item) => {
      const matchCat =
        selectedCategory === "all" || item.category === selectedCategory;
      if (!matchCat) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchTags =
        item.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
      return matchName || matchTags;
    });
  }, [search, selectedCategory]);

  const handleSelectPreset = (svg: string) => {
    onChange(svg);
    setRawSvgInput(svg);
  };

  const handleApplyRawSvg = () => {
    if (!rawSvgInput.trim()) {
      onChange(null);
    } else {
      onChange(rawSvgInput.trim());
    }
  };

  const handleSelectMedia = (assetOrAssets: MediaAsset | MediaAsset[]) => {
    const asset = Array.isArray(assetOrAssets)
      ? assetOrAssets[0]
      : assetOrAssets;
    if (asset && asset.fileUrl) {
      const imgTag = `<img src="${asset.fileUrl}" alt="${asset.fileName}" class="w-full h-full object-contain" />`;
      onChange(imgTag);
      setRawSvgInput(imgTag);
      setMediaPickerOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Active Preview Box & Actions */}
      <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/30">
        <div className="relative w-14 h-14 rounded-xl border border-border bg-card flex items-center justify-center p-2.5 shrink-0 overflow-hidden shadow-xs">
          {value ? (
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <Sparkles className="w-6 h-6 text-muted-foreground/40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">
            {value ? "Icon Terpasang" : label}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {value
              ? "Icon aktif siap ditampilkan di kartu dan showcase"
              : description}
          </p>
        </div>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(null);
              setRawSvgInput("");
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2.5"
            title="Hapus icon"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="text-xs">Hapus</span>
          </Button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
        <button
          type="button"
          onClick={() => setMode("preset")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "preset"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Preset Library
        </button>
        <button
          type="button"
          onClick={() => setMode("raw")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "raw"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          Custom Raw SVG
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("media");
            setMediaPickerOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "media"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
          Media Library
        </button>
      </div>

      {/* Tab 1: Preset Icons Grid with Category Filters */}
      {mode === "preset" && (
        <div className="space-y-2.5 p-3 rounded-xl border border-border bg-card">
          {/* Category Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pb-1 border-b border-border/50">
            <Button
              type="button"
              variant={selectedCategory === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="h-6 px-2 text-[11px] rounded-full"
            >
              Semua ({PRESET_UNIVERSAL_ICONS.length})
            </Button>
            <Button
              type="button"
              variant={selectedCategory === "services" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("services")}
              className="h-6 px-2 text-[11px] rounded-full flex items-center gap-1"
            >
              <Wrench className="w-3 h-3" />
              Layanan & Solusi
            </Button>
            <Button
              type="button"
              variant={
                selectedCategory === "philosophies" ? "default" : "ghost"
              }
              size="sm"
              onClick={() => setSelectedCategory("philosophies")}
              className="h-6 px-2 text-[11px] rounded-full flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Filosofi & Mindset
            </Button>
            <Button
              type="button"
              variant={selectedCategory === "tech" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("tech")}
              className="h-6 px-2 text-[11px] rounded-full flex items-center gap-1"
            >
              <Layers className="w-3 h-3" />
              Tech Stacks
            </Button>
            <Button
              type="button"
              variant={selectedCategory === "general" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory("general")}
              className="h-6 px-2 text-[11px] rounded-full flex items-center gap-1"
            >
              <Palette className="w-3 h-3" />
              Umum
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari preset icon (e.g. Full-Stack, Clean Code, API, Docker, DevOps)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>

          {/* Icon Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
            {filteredPresets.map((item) => {
              const isSelected = value === item.svg;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectPreset(item.svg)}
                  title={item.name}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all aspect-square text-center ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-2 ring-primary/20"
                      : "border-border bg-muted/20 hover:border-muted-foreground/40 hover:bg-muted/50"
                  }`}
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full transition-transform group-hover:scale-110"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span className="text-[10px] text-muted-foreground truncate w-full mt-1.5 px-0.5 leading-tight font-medium">
                    {item.name}
                  </span>
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
            {filteredPresets.length === 0 && (
              <div className="col-span-full py-6 text-center text-xs text-muted-foreground">
                Tidak ada preset icon yang cocok dengan &quot;{search}&quot;
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Custom Raw SVG Code */}
      {mode === "raw" && (
        <div className="space-y-2.5 p-3 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-foreground">
              Paste Kode Raw &lt;svg&gt;...&lt;/svg&gt;
            </span>
            <span className="text-[11px] text-muted-foreground">
              Support valid inline SVG
            </span>
          </div>

          <Textarea
            value={rawSvgInput}
            onChange={(e) => setRawSvgInput(e.target.value)}
            placeholder='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ...>...</svg>'
            className="font-mono text-xs h-24 resize-y"
          />

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRawSvgInput("");
                onChange(null);
              }}
              className="h-7 text-xs"
            >
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyRawSvg}
              className="h-7 text-xs bg-primary text-primary-foreground"
            >
              Terapkan SVG
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Media Library Modal Helper */}
      {mode === "media" && (
        <div className="p-4 rounded-xl border border-border bg-card flex flex-col items-center justify-center text-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">
              Pilih dari Media Library
            </p>
            <p className="text-[11px] text-muted-foreground max-w-sm">
              Gunakan aset logo/icon SVG atau PNG transparan yang sudah diupload
              ke Media Storage.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => setMediaPickerOpen(true)}
            className="h-8 text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-xs"
          >
            <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
            Buka Media Picker
          </Button>
        </div>
      )}

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleSelectMedia}
        multiple={false}
        title="Pilih Icon dari Media Library"
      />
    </div>
  );
}
