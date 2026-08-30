"use client";

import * as React from "react";
import {
  ExternalLink,
  Github,
  Share2,
  Check,
  Copy,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { trackProjectClick } from "@/lib/api";
import type { Project } from "@growthcoder/types";

interface ProjectActionBarProps {
  project: Project;
}

export function ProjectActionBar({ project }: ProjectActionBarProps) {
  const [copied, setCopied] = React.useState(false);

  const handleTrack = (eventType: "demo_click" | "repo_click") => {
    trackProjectClick(project.slug, eventType);
  };

  const handleCopyLink = async () => {
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }
  };

  const canonicalUrl = `https://growthcoder.id/projects/${project.slug}`;
  const shareText = `Studi Kasus Proyek: ${project.title} oleh Muhammad Ihsan Maulana`;

  const handleShare = (
    e: React.MouseEvent,
    type: "twitter" | "linkedin" | "whatsapp",
  ) => {
    e.preventDefault();
    const url =
      typeof window !== "undefined" ? window.location.href : canonicalUrl;
    let shareUrl = "";

    if (type === "twitter") {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`;
    } else if (type === "linkedin") {
      shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    } else if (type === "whatsapp") {
      shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${url}`)}`;
    }

    if (shareUrl && typeof window !== "undefined") {
      window.open(shareUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-5">
      {/* Primary Action Buttons (Full width vertical stack in sidebar) */}
      <div className="flex flex-col gap-2.5 w-full">
        {project.demoUrl && (
          <Button
            asChild
            size="lg"
            className="w-full h-11 sm:h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 font-semibold gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] justify-center px-4"
          >
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleTrack("demo_click")}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold"
            >
              <span>Buka Live Demo</span>
              <ExternalLink className="h-4 w-4 shrink-0" />
            </a>
          </Button>
        )}

        {project.repositoryUrl && (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full h-11 sm:h-12 rounded-2xl border-border/80 hover:border-primary/50 text-foreground font-semibold gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] justify-center px-4 bg-card/60 backdrop-blur-sm hover:bg-muted/60"
          >
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => handleTrack("repo_click")}
              className="flex items-center justify-center gap-2 w-full text-sm font-semibold"
            >
              <Github className="h-4 w-4 shrink-0" />
              <span>Lihat Kode GitHub</span>
            </a>
          </Button>
        )}
      </div>

      {/* Share Actions Strip */}
      <div className="flex items-center justify-between pt-4 border-t border-border/40 gap-2">
        <span className="text-xs font-medium text-muted-foreground inline-flex items-center gap-1.5 shrink-0">
          <Share2 className="h-3.5 w-3.5 text-primary" />
          <span>Bagikan:</span>
        </span>

        <div className="flex items-center gap-1">
          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors relative"
            title="Salin tautan"
            aria-label="Salin tautan"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>

          {/* Twitter / X */}
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(canonicalUrl)}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => handleShare(e, "twitter")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Bagikan ke X"
            aria-label="Bagikan ke X"
          >
            <Twitter className="h-4 w-4" />
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => handleShare(e, "linkedin")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Bagikan ke LinkedIn"
            aria-label="Bagikan ke LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n${canonicalUrl}`)}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => handleShare(e, "whatsapp")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
            title="Bagikan ke WhatsApp"
            aria-label="Bagikan ke WhatsApp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
