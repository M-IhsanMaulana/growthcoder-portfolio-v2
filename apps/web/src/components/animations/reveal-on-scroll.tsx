"use client";

import { useRef, useEffect, type ReactNode } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

export type RevealVariant =
  | "fade-up"
  | "fade-down"
  | "fade-left"
  | "fade-right"
  | "zoom-in"
  | "stagger-children";

interface RevealOnScrollProps {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  threshold?: string; // e.g. "top 85%"
  once?: boolean;
}

export function RevealOnScroll({
  children,
  variant = "fade-up",
  duration = 0.8,
  delay = 0,
  stagger = 0.12,
  className = "",
  threshold = "top 88%",
  once = true,
}: RevealOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isReducedMotion()) return;

    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      let fromVars: gsap.TweenVars = { opacity: 0 };

      switch (variant) {
        case "fade-up":
          fromVars = { opacity: 0, y: 35 };
          break;
        case "fade-down":
          fromVars = { opacity: 0, y: -35 };
          break;
        case "fade-left":
          fromVars = { opacity: 0, x: 40 };
          break;
        case "fade-right":
          fromVars = { opacity: 0, x: -40 };
          break;
        case "zoom-in":
          fromVars = { opacity: 0, scale: 0.92 };
          break;
        case "stagger-children":
          fromVars = { opacity: 0, y: 30 };
          break;
      }

      if (variant === "stagger-children") {
        const targets = el.children;
        gsap.from(targets, {
          ...fromVars,
          duration,
          delay,
          stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: threshold,
            once,
          },
        });
      } else {
        gsap.from(el, {
          ...fromVars,
          duration,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: threshold,
            once,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [variant, duration, delay, stagger, threshold, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
