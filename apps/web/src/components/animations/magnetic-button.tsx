"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { gsap, isReducedMotion } from "@/lib/gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number; // Distance multiplier, default 0.35
  active?: boolean;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  active = true,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!active || isReducedMotion() || !containerRef.current) return;

    const { clientX, clientY } = e;
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();

    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * strength;
    const deltaY = (clientY - centerY) * strength;

    gsap.to(containerRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </div>
  );
}
