"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";
import type { ProjectGallery } from "@growthcoder/types";

interface ProjectGalleryLightboxProps {
  galleries: ProjectGallery[];
  projectTitle: string;
}

export function ProjectGalleryLightbox({
  galleries,
  projectTitle,
}: ProjectGalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isOpen = selectedIndex !== null;
  const currentImage = selectedIndex !== null ? galleries[selectedIndex] : null;

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = React.useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev === 0 ? galleries.length - 1 : prev - 1) : 0,
    );
  }, [selectedIndex, galleries.length]);

  const handleNext = React.useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev !== null ? (prev === galleries.length - 1 ? 0 : prev + 1) : 0,
    );
  }, [selectedIndex, galleries.length]);

  // Lock body scroll and handle keyboard navigation
  React.useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "ArrowRight") {
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handlePrev, handleNext]);

  if (!galleries || galleries.length === 0) {
    return null;
  }

  const modalContent = (
    <AnimatePresence>
      {isOpen && currentImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 w-screen h-screen z-[9999] flex flex-col items-center justify-between p-4 sm:p-8 bg-black/95 backdrop-blur-2xl select-none"
          onClick={handleClose}
        >
          {/* Top Bar Controls */}
          <div
            className="w-full max-w-6xl flex items-center justify-between pointer-events-auto shrink-0 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-white/10 text-white/90 backdrop-blur-md border border-white/15 shadow-sm">
                {(selectedIndex ?? 0) + 1} / {galleries.length}
              </span>
              <span className="hidden sm:inline-block text-xs text-white/60 font-mono truncate max-w-sm">
                {projectTitle}
              </span>
            </div>

            <button
              onClick={handleClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 hover:scale-105 active:scale-95 shadow-md"
              aria-label="Tutup lightbox"
              title="Tutup (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Centered Image Container */}
          <div
            className="relative w-full max-w-5xl flex-1 max-h-[75vh] flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentImage.imageUrl}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative w-full h-full max-h-[72vh] rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-black/40 flex items-center justify-center"
            >
              <Image
                src={currentImage.imageUrl}
                alt={currentImage.caption || `${projectTitle} Screenshot`}
                fill
                priority
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </motion.div>

            {/* Left Navigation Arrow */}
            {galleries.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/15 backdrop-blur-md shadow-xl hover:scale-110 active:scale-95 z-20"
                aria-label="Screenshot sebelumnya"
                title="Sebelumnya (Panah Kiri)"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Right Navigation Arrow */}
            {galleries.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-all border border-white/15 backdrop-blur-md shadow-xl hover:scale-110 active:scale-95 z-20"
                aria-label="Screenshot selanjutnya"
                title="Selanjutnya (Panah Kanan)"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Bottom Caption Overlay */}
          <div
            className="w-full max-w-3xl text-center shrink-0 z-10 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {currentImage.caption ? (
              <p className="text-xs sm:text-sm text-white/90 font-medium bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10 inline-block shadow-lg">
                {currentImage.caption}
              </p>
            ) : (
              <div className="h-4" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <ImageIcon className="h-4 w-4" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-foreground">
            Galeri Screenshot &amp; Antarmuka
          </h3>
        </div>
        <span className="text-xs font-mono text-muted-foreground">
          {galleries.length} Cuplikan Layar
        </span>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {galleries.map((item, index) => (
          <motion.div
            key={item.id || index}
            whileHover={{ y: -4 }}
            className="group relative aspect-video rounded-2xl overflow-hidden border border-border/70 bg-card/60 cursor-pointer shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            onClick={() => handleOpen(index)}
          >
            <Image
              src={item.imageUrl}
              alt={item.caption || `${projectTitle} Screenshot ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />

            {/* Hover overlay with zoom icon & caption */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 backdrop-blur-[2px]">
              <div className="self-end p-2 rounded-full bg-black/60 text-white/90">
                <Maximize2 className="h-4 w-4" />
              </div>
              {item.caption && (
                <p className="text-xs text-white/90 font-medium line-clamp-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl">
                  {item.caption}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Render Modal into Portal directly on document.body */}
      {mounted && typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null}
    </section>
  );
}
