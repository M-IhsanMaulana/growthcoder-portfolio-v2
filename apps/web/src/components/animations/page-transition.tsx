"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { isReducedMotion } from "@/lib/gsap";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    // Trigger brief loading bar animation on pathname change
    setIsNavigating(true);
    const timer = setTimeout(() => {
      setIsNavigating(false);
    }, 450);

    return () => clearTimeout(timer);
  }, [pathname]);

  const reduced = typeof window !== "undefined" && isReducedMotion();

  return (
    <>
      {/* Route Navigation Top Progress Indicator */}
      <AnimatePresence>
        {isNavigating && !reduced && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-primary to-teal-300 origin-left z-[999] shadow-[0_0_12px_rgba(16,185,129,0.7)] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Page Content Subtle Fade-Up Entrance */}
      <motion.div
        key={pathname}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="flex-1 flex flex-col w-full"
      >
        {children}
      </motion.div>
    </>
  );
}
