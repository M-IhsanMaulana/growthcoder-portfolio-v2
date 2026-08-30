import * as React from "react";
import type { TechStack } from "@growthcoder/types";

// High-quality SVG icons for popular developer tools and stacks
const TECH_ICONS: Record<string, string> = {
  tailwind: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#38BDF8"/></svg>`,
  tailwindcss: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" fill="#38BDF8"/></svg>`,
  vue: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M1.5 3.5h4.2l6.3 11 6.3-11h4.2L12 21.5 1.5 3.5z" fill="#41B883"/><path d="M6.5 3.5h4.2L12 5.8l1.3-2.3h4.2L12 13.5 6.5 3.5z" fill="#35495E"/></svg>`,
  vuejs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M1.5 3.5h4.2l6.3 11 6.3-11h4.2L12 21.5 1.5 3.5z" fill="#41B883"/><path d="M6.5 3.5h4.2L12 5.8l1.3-2.3h4.2L12 13.5 6.5 3.5z" fill="#35495E"/></svg>`,
  laravel: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M19.8 4.2 13.5.6a2.6 2.6 0 0 0-2.6 0L4.6 4.2A2.6 2.6 0 0 0 3.3 6.5v8.7a2.6 2.6 0 0 0 1.3 2.3l6.3 3.6a2.6 2.6 0 0 0 2.6 0l6.3-3.6a2.6 2.6 0 0 0 1.3-2.3V6.5a2.6 2.6 0 0 0-1.3-2.3zm-7.6 16.3-6.3-3.6V8.2l6.3 3.6v8.7zm1.3 0V11.8l2.5-1.4v6.4l-2.5 1.4v2.3zm0-10.5L7.2 6.4 12.2 3.5l5 2.9-3.7 2.1z" fill="#FF2D20"/></svg>`,
  mysql: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M16.5 4.5c-2.3 0-4.2 1.3-5.2 3.2-1-.7-2.3-1.2-3.8-1.2-3.3 0-6 2.7-6 6s2.7 6 6 6c1.6 0 3.1-.6 4.2-1.7.9 1.1 2.3 1.7 3.8 1.7 2.8 0 5-2.2 5-5s-1.8-9-4-9zm-9 12c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4zm9 0c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3z" fill="#00758F"/></svg>`,
  react: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" transform="rotate(30 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" transform="rotate(90 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" stroke="#61DAFB" stroke-width="1.5" transform="rotate(150 12 12)"/><circle cx="12" cy="12" r="1.8" fill="#61DAFB"/></svg>`,
  nextjs: `<svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-foreground"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.666 18.067-6.26-8.528v8.528H9.866V5.933h1.68l6.12 8.44V5.933h1.54v12.134h-1.54z"/></svg>`,
  typescript: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><rect width="24" height="24" rx="4" fill="#3178C6"/><path d="M5.5 10.5h6.5v2h-2.2v6.5h-2.1v-6.5h-2.2v-2zm7.7 5.2c.4.8 1.1 1.4 2.2 1.4 1.1 0 1.8-.5 1.8-1.3 0-.8-.6-1.1-1.7-1.5l-.8-.3c-1.6-.6-2.5-1.5-2.5-2.8 0-1.8 1.4-3 3.4-3 1.5 0 2.6.6 3.3 1.8l-1.6 1c-.4-.7-.9-1-1.7-1-.8 0-1.4.5-1.4 1.1 0 .6.4.9 1.4 1.3l.8.3c1.9.7 2.8 1.6 2.8 3 0 1.9-1.5 3.1-3.7 3.1-2 0-3.3-.9-4-2.2l1.6-1.2z" fill="#ffffff"/></svg>`,
  javascript: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><rect width="24" height="24" rx="4" fill="#F7DF1E"/><path d="M7 17.5c.8.5 1.8.8 2.8.8 2 0 3.2-1 3.2-3v-6.8h-2v6.8c0 .8-.4 1.2-1.2 1.2-.6 0-1.2-.2-1.6-.5l-1.2 1.5zm8.5-.2c.9.6 2 1 3.2 1 2.2 0 3.6-1.1 3.6-2.8 0-1.7-1-2.4-2.7-3.1l-.8-.3c-1.1-.4-1.6-.8-1.6-1.4 0-.6.5-1.1 1.4-1.1.8 0 1.6.3 2.2.8l1-1.5c-.8-.7-1.9-1.1-3.2-1.1-2.2 0-3.4 1.2-3.4 2.7 0 1.6 1 2.4 2.6 3l.8.3c1.2.5 1.7.9 1.7 1.5 0 .7-.6 1.2-1.6 1.2-1 0-2-.4-2.8-1l-1.1 1.6z" fill="#000000"/></svg>`,
  postgresql: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.5h-2v-4h2v4zm4-6h-2v-2h2v2zm-8 0H7v-2h2v2z" fill="#336791"/></svg>`,
  docker: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M13.9 6.2h2.2v2.2h-2.2zm-2.7 0h2.2v2.2h-2.2zm-2.7 0h2.2v2.2H8.5zm5.4 2.7h2.2v2.2h-2.2zm-2.7 0h2.2v2.2h-2.2zm-2.7 0h2.2v2.2H8.5zm-2.7 0h2.2v2.2H5.8zm15.4 2.5c-.4-.3-1.4-.4-2.1 0-.3.2-.6.4-.8.7-.3-.1-.6-.1-.9-.1-1.6 0-2.8 1.1-3 2.6H2.1c-.3 1.5.3 3.1 1.5 4.1 2 1.6 4.7 2.1 7.2 1.4 3.7-1 6.5-4 7.2-7.8.8.1 1.7-.1 2.2-.6.4-.4.8-1.2.6-1.8-.1-.4-.3-.6-.6-.7z" fill="#2496ED"/></svg>`,
  adonisjs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2.5 3 19.5h18L12 2.5zm0 4.8 5.5 10.2h-11L12 7.3z" fill="#5A45FF"/></svg>`,
  nodejs: `<svg viewBox="0 0 24 24" fill="none" class="w-full h-full"><path d="M12 2 2 7.7v11.5l10 5.8 10-5.8V7.7L12 2zm7.9 16-7.9 4.6-7.9-4.6V8.9l7.9-4.6 7.9 4.6v9.1z" fill="#68A063"/></svg>`,
};

interface TechStackIconProps {
  tech: TechStack;
  className?: string;
}

export function TechStackIcon({
  tech,
  className = "w-4 h-4 shrink-0",
}: TechStackIconProps) {
  // 1. If explicit custom SVG is in the database
  if (tech.iconSvg && tech.iconSvg.trim().startsWith("<svg")) {
    return (
      <span
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: tech.iconSvg }}
      />
    );
  }

  // 2. Normalized slug or name lookup
  const cleanKey = (tech.slug || tech.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const matchedIcon =
    TECH_ICONS[cleanKey] ||
    Object.entries(TECH_ICONS).find(([key]) => cleanKey.includes(key))?.[1];

  if (matchedIcon) {
    return (
      <span
        className={`${className} flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
        dangerouslySetInnerHTML={{ __html: matchedIcon }}
      />
    );
  }

  // 3. Fallback: stylized colored dot
  return (
    <span className="h-2 w-2 rounded-full bg-primary/80 ring-2 ring-primary/20 shrink-0" />
  );
}
