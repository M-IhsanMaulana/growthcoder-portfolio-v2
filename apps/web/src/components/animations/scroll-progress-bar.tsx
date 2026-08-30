"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "./smooth-scroll-provider";

export function ScrollProgressBar() {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [showBackToTop, setShowBackToTop] = useState(false);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setShowBackToTop(latest > 350);
    });
  }, [scrollY]);

  const handleBackToTop = () => {
    scrollTo(0, { duration: 1.2 });
  };

  return (
    <>
      {/* Top Global Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-emerald-400 to-teal-400 origin-left z-[100] shadow-[0_0_8px_rgba(16,185,129,0.5)] pointer-events-none"
      />

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBackToTop}
            aria-label="Kembali ke atas halaman"
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-card/85 hover:bg-card border border-border/80 text-foreground hover:text-primary shadow-xl backdrop-blur-md transition-colors group flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5 transition-transform group-hover:-translate-y-0.5 text-primary" />
            <span className="sr-only">Kembali ke Atas</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
