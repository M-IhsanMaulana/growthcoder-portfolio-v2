"use client";

import { useRef, useEffect, useState } from "react";
import { gsap, ScrollTrigger, isReducedMotion } from "@/lib/gsap";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  duration = 1.8,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  useEffect(() => {
    if (isReducedMotion()) {
      setDisplayValue(value);
      return;
    }

    const el = elementRef.current;
    if (!el) return;

    const counterObj = { val: 0 };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          if (hasAnimatedRef.current) return;
          hasAnimatedRef.current = true;

          gsap.to(counterObj, {
            val: value,
            duration,
            ease: "power2.out",
            onUpdate: () => {
              setDisplayValue(
                decimals > 0
                  ? Number(counterObj.val.toFixed(decimals))
                  : Math.round(counterObj.val),
              );
            },
          });
        },
      });
    }, el);

    return () => {
      ctx.revert();
    };
  }, [value, duration, decimals]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : displayValue.toLocaleString("id-ID");

  return (
    <span ref={elementRef} className={`tabular-nums font-bold ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
