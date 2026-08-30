"use client";

import * as React from "react";

export function BlogReadingProgress() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const percentage = Math.min(
          100,
          Math.max(0, (scrollY / docHeight) * 100),
        );
        setProgress(percentage);
      }
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-background/20 backdrop-blur-xs pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-primary via-emerald-400 to-teal-400 transition-all duration-100 ease-out shadow-sm shadow-primary/30"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
