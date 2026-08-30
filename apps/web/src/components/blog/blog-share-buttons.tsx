"use client";

import * as React from "react";
import { Link2, Check, Share2 } from "lucide-react";

interface BlogShareButtonsProps {
  title: string;
  slug: string;
  showLabel?: boolean;
}

export function BlogShareButtons({
  title,
  slug,
  showLabel = false,
}: BlogShareButtonsProps) {
  const [copied, setCopied] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(`${window.location.origin}/blog/${slug}`);
    }
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (_err) {
      console.error("Failed to copy link");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: currentUrl,
        });
      } catch (_err) {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {showLabel && (
        <span className="text-xs font-semibold text-muted-foreground mr-1">
          Bagikan:
        </span>
      )}

      {/* X / Twitter */}
      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70 hover:border-foreground/30 transition-all shadow-xs cursor-pointer"
        title="Bagikan ke X"
        aria-label="Bagikan ke X"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-card/80 hover:bg-muted text-muted-foreground hover:text-[#0A66C2] border border-border/70 hover:border-[#0A66C2]/40 transition-all shadow-xs cursor-pointer"
        title="Bagikan ke LinkedIn"
        aria-label="Bagikan ke LinkedIn"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.27 1.64 1.64 0 0 0 0-3.27" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-card/80 hover:bg-muted text-muted-foreground hover:text-emerald-500 border border-border/70 hover:border-emerald-500/40 transition-all shadow-xs cursor-pointer"
        title="Bagikan ke WhatsApp"
        aria-label="Bagikan ke WhatsApp"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.82 2.42c-1.46 0-2.89-.39-4.14-1.13l-.3-.18-3.08.81.82-3-.2-.31a8.216 8.216 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24m4.54 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.3" />
        </svg>
      </a>

      {/* Copy Link */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={`inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl border transition-all shadow-xs cursor-pointer ${
          copied
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 scale-105"
            : "bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground border-border/70 hover:border-primary/40"
        }`}
        title={copied ? "Tautan Tersalin!" : "Salin Tautan"}
        aria-label={copied ? "Tautan Tersalin!" : "Salin Tautan"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-emerald-500 stroke-[2.5]" />
        ) : (
          <Link2 className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Native Web Share Button (on supported mobile devices) */}
      <button
        type="button"
        onClick={handleNativeShare}
        className="sm:hidden inline-flex items-center justify-center h-8.5 w-8.5 rounded-xl bg-card/80 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/70 transition-all text-xs shadow-xs cursor-pointer"
        title="Bagikan"
        aria-label="Bagikan"
      >
        <Share2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
