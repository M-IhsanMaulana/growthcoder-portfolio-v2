"use client";

import React, { useState, useMemo } from "react";
import {
  Sparkles,
  Code2,
  Image as ImageIcon,
  Check,
  Search,
  Trash2,
  HelpCircle,
  FolderOpen,
} from "lucide-react";
import { Button, Input, Textarea, Badge } from "@growthcoder/ui";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset } from "@growthcoder/types";

// PRESET POPULAR ICONS SVG
export const PRESET_DEV_ICONS: Array<{
  name: string;
  category: string;
  svg: string;
}> = [
  {
    name: "TypeScript",
    category: "language",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#3178C6" d="M0 0h128v128H0z"/><path fill="#FFF" d="M37.3 54.8h-11v46.7h-9.5V54.8h-11v-7.9h31.5v7.9zm27.4 33.2c1.9 2.5 4.8 4.2 8.4 4.2 4.1 0 6.6-2.1 6.6-5.1 0-3.3-2.6-4.6-7.3-6.5-6.5-2.6-11.4-5.8-11.4-13 0-7.3 5.8-13.3 15-13.3 5.7 0 10.3 2 13.5 5.5l-5.3 5.6c-2.4-2.5-5.2-3.8-8.2-3.8-3.7 0-5.8 2-5.8 4.5 0 2.8 2.2 3.9 6.8 5.7 7.1 2.8 11.9 6.1 11.9 13.8 0 8.2-6.5 13.9-16.1 13.9-7.3 0-12.8-2.6-16.6-7.1l5.5-5.4z"/></svg>`,
  },
  {
    name: "JavaScript",
    category: "language",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#F7DF1E" d="M0 0h128v128H0z"/><path fill="#000" d="M67.3 101.4c2.8 4.6 6.8 7.6 13.5 7.6 5.8 0 9.5-2.9 9.5-6.9 0-4.8-3.8-6.6-10.2-9.4l-3.5-1.5c-10.1-4.3-16.8-9.7-16.8-21 0-10.5 8.1-18.4 20.8-18.4 9 0 15.5 3.3 19.8 10.9l-7.7 4.9c-2.3-4.1-5.3-6.1-12.1-6.1-5.4 0-8.8 2.5-8.8 5.9 0 4.1 2.6 5.8 8.6 8.4l3.5 1.5c11.9 5.1 18.5 10.5 18.5 22.2 0 12.7-9.9 19.6-22.7 19.6-12.7 0-20.9-6.3-24.9-14.7l10.5-4.5zm-38 1.4c2.1 3.5 4.5 6.4 9.1 6.4 4.7 0 7.7-2.4 7.7-11.4V52.7h12.5v43.9c0 14.7-8.6 21.1-20.2 21.1-10.4 0-16.5-5.3-19.8-13.1l10.7-6.9z"/></svg>`,
  },
  {
    name: "React",
    category: "frontend",
    svg: `<svg viewBox="-11.5 -10.232 23 20.463" width="100%" height="100%"><circle cx="0" cy="0" r="2.05" fill="#61dafb"/><g stroke="#61dafb" stroke-width="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>`,
  },
  {
    name: "Next.js",
    category: "frontend",
    svg: `<svg viewBox="0 0 180 180" width="100%" height="100%"><mask height="180" id="next-mask" maskUnits="userSpaceOnUse" width="180" x="0" y="0"><circle cx="90" cy="90" fill="#fff" r="90"/></mask><g mask="url(#next-mask)"><circle cx="90" cy="90" fill="#000" r="90"/><path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.16 149.508 157.52Z" fill="#fff"/><path d="M115 54H127.114V126H115V54Z" fill="#fff"/></g></svg>`,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    svg: `<svg viewBox="0 0 32 32" width="100%" height="100%"><path fill="#38BDF8" d="M16 6.4c-5.333 0-8.533 2.667-9.6 8 2.133-2.667 4.8-3.733 8-3.2 1.829.305 3.136 1.633 4.583 3.102C21.34 16.685 24.115 19.5 30.4 19.5c5.333 0 8.533-2.667 9.6-8-2.133 2.667-4.8 3.733-8 3.2-1.829-.305-3.136-1.633-4.583-3.102C25.06 9.215 22.285 6.4 16 6.4zm-9.6 9.6C1.067 16-2.133 18.667-3.2 24c2.133-2.667 4.8-3.733 8-3.2 1.829.305 3.136 1.633 4.583 3.102C11.74 26.285 14.515 29.1 20.8 29.1c5.333 0 8.533-2.667 9.6-8-2.133 2.667-4.8 3.733-8 3.2-1.829-.305-3.136-1.633-4.583-3.102C15.46 18.815 12.685 16 6.4 16z"/></svg>`,
  },
  {
    name: "Vue.js",
    category: "frontend",
    svg: `<svg viewBox="0 0 261.76 226.69" width="100%" height="100%"><path d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z" fill="#41B883"/><path d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z" fill="#34495E"/></svg>`,
  },
  {
    name: "Node.js",
    category: "backend",
    svg: `<svg viewBox="0 0 256 289" width="100%" height="100%"><path fill="#339933" d="M128 0L0 74v141l128 74 128-74V74L128 0zm0 28.5l103.3 59.6v113.8L128 261.5 24.7 201.9V88.1L128 28.5z"/><path fill="#66CC33" d="M128 47.7l86.6 50v95.6L128 243.3 41.4 193.3V97.7L128 47.7z"/></svg>`,
  },
  {
    name: "AdonisJS",
    category: "backend",
    svg: `<svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" rx="20" fill="#5A45FF"/><path d="M50 18L18 78h16l8-16h16l8 16h16L50 18zm0 22l8 16H42l8-16z" fill="#FFFFFF"/></svg>`,
  },
  {
    name: "Python",
    category: "language",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#3776AB" d="M63.7 3.3c-15.5 0-25.1 6.8-25.1 19.8v14.4h25.4v3.6H25.4C11.4 41.1 0 52.1 0 66.5c0 14.1 11.8 24.7 25.4 24.7h7.2v-11.8c0-14.4 12.3-26.4 26.6-26.4h25.4V34.5c0-12.7-10.9-31.2-40.9-31.2zm-9.5 8.1c2.8 0 5.1 2.3 5.1 5.1 0 2.8-2.3 5.1-5.1 5.1-2.8 0-5.1-2.3-5.1-5.1 0-2.8 2.3-5.1 5.1-5.1z"/><path fill="#FFD43B" d="M64.3 124.7c15.5 0 25.1-6.8 25.1-19.8V90.5H64v-3.6h38.6c14 0 25.4-11 25.4-25.4 0-14.1-11.8-24.7-25.4-24.7h-7.2v11.8c0 14.4-12.3 26.4-26.6 26.4H43.4v18.5c0 12.7 10.9 31.2 40.9 31.2zm9.5-8.1c-2.8 0-5.1-2.3-5.1-5.1 0-2.8 2.3-5.1 5.1-5.1 2.8 0 5.1 2.3 5.1 5.1 0 2.8-2.3 5.1-5.1 5.1z"/></svg>`,
  },
  {
    name: "PostgreSQL",
    category: "database",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#336791" d="M64 4C30.9 4 4 30.9 4 64s26.9 60 60 60 60-26.9 60-60S97.1 4 64 4zm28.8 84.8c-2.6 5.8-9 9.3-15.6 9.3-7.8 0-14.7-4.8-17.5-12.2l-4.7 1.8c3.5 9.3 12.3 15.3 22.2 15.3 8.4 0 16.5-4.5 19.8-11.9l-4.2-2.3zm-17-48c0-8.7-7-15.7-15.7-15.7-8.7 0-15.7 7-15.7 15.7 0 8.7 7 15.7 15.7 15.7 8.7 0 15.7-7 15.7-15.7z"/></svg>`,
  },
  {
    name: "Redis",
    category: "database",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#DC382D" d="M117.8 85.9L68.5 114.4c-2.8 1.6-6.2 1.6-9 0L10.2 85.9c-2.8-1.6-4.5-4.6-4.5-7.9V49.9c0-3.2 1.7-6.2 4.5-7.9l49.3-28.5c2.8-1.6 6.2-1.6 9 0l49.3 28.5c2.8 1.6 4.5 4.6 4.5 7.9V78c0 3.3-1.7 6.3-4.5 7.9z"/><path fill="#FFF" d="M64 45L40 59v28l24 14 24-14V59L64 45z"/></svg>`,
  },
  {
    name: "Docker",
    category: "devops",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#2496ED" d="M123.8 54.8c-1.3-.9-6.3-4.1-16.1-2.9-.6-2.9-2.3-5.5-4.8-7.3-3.6-2.5-8.5-3.2-12.7-1.8-1.6-6.9-6.5-12.4-13.4-14.7l-4.1-1.4-2.5 3.6c-4.7 6.7-6.2 14.9-4.2 22.8-.7.4-1.5.8-2.2 1.3H3.6c-2 0-3.6 1.6-3.6 3.6 0 17 6.7 32.8 18.9 44.5 12.6 12 29.5 18.6 47.7 18.6 36.9 0 62.4-23.7 62.8-24.1l3.1-2.9-.8-4.2c-.7-3.9-.2-8 1.5-11.6 1.4-3.1 3.5-5.6 5.8-7.3l2.8-2.1-3.6-1.1zM28.3 54h11.9v11.9H28.3V54zm14.9 0h11.9v11.9H43.2V54zm14.9 0H70v11.9H58.1V54zm-29.8-14.9h11.9V51H28.3V39.1zm14.9 0h11.9V51H43.2V39.1zm14.9 0H70V51H58.1V39.1zM73 54h11.9v11.9H73V54zm0-14.9h11.9V51H73V39.1zM58.1 24.2H70v11.9H58.1V24.2z"/></svg>`,
  },
  {
    name: "Git",
    category: "tools",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#F05032" d="M124.7 57.3L70.7 3.3c-4.4-4.4-11.6-4.4-16 0L39.8 18.2l20.2 20.2c4.7-1.6 10.2-.5 13.9 3.2 3.7 3.7 4.8 9.2 3.2 13.9l19.5 19.5c4.7-1.6 10.2-.5 13.9 3.2 5.3 5.3 5.3 13.9 0 19.2-5.3 5.3-13.9 5.3-19.2 0-4-4-4.9-9.9-2.9-14.8L70.2 64.5v30.9c1.4.7 2.7 1.8 3.7 2.8 5.3 5.3 5.3 13.9 0 19.2s-13.9 5.3-19.2 0c-5.3-5.3-5.3-13.9 0-19.2 1.3-1.3 2.9-2.3 4.6-2.9V63.5c1.7-.6 3.3-1.6 4.6-2.9 2-2 3.1-4.6 3.3-7.3L48.1 34.2 3.3 79c-4.4 4.4-4.4 11.6 0 16l54 54c4.4 4.4 11.6 4.4 16 0l51.4-51.4c4.4-4.4 4.4-11.6 0-16.3z"/></svg>`,
  },
  {
    name: "Figma",
    category: "tools",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#0ACF83" d="M44 128c11 0 20-9 20-20V88H44c-11 0-20 9-20 20s9 20 20 20z"/><path fill="#A259FF" d="M24 68c0-11 9-20 20-20h20v40H44c-11 0-20-9-20-20z"/><path fill="#F24E1E" d="M24 28c0-11 9-20 20-20h20v40H44c-11 0-20-9-20-20z"/><path fill="#FF7262" d="M64 8h20c11 0 20 9 20 20s-9 20-20 20H64V8z"/><path fill="#1ABCFE" d="M104 68c0 11-9 20-20 20s-20-9-20-20 9-20 20-20 20 9 20 20z"/></svg>`,
  },
  {
    name: "GraphQL",
    category: "backend",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#E10098" d="M64 10.9L18 37.5v53l46 26.6 46-26.6v-53L64 10.9zm0 8.7l38.5 22.2-18.7 32.4H44.2L25.5 41.8 64 19.6zm-38 68.2V48.1l15.8 27.3L26 87.8zm6.5 3.8l16.1-27.9 15.4 26.7v31.4L32.5 91.6zm63-3.8l-15.8-27.4L95.5 48v39.8zm-6.5 3.8L64 121.8v-31.4l15.4-26.7 16.1 27.9z"/></svg>`,
  },
  {
    name: "Kubernetes",
    category: "devops",
    svg: `<svg viewBox="0 0 128 128" width="100%" height="100%"><path fill="#326CE5" d="M64 4.5l52.1 29.8v59.4L64 123.5 11.9 93.7V34.3L64 4.5zm0 13.9L24 41.2v45.6L64 109.6l40-22.8V41.2L64 18.4z"/></svg>`,
  },
];

interface TechStackIconPickerProps {
  value: string | null | undefined;
  onChange: (svg: string | null) => void;
}

export function TechStackIconPicker({
  value,
  onChange,
}: TechStackIconPickerProps) {
  const [mode, setMode] = useState<"preset" | "raw" | "media">("preset");
  const [search, setSearch] = useState("");
  const [rawSvgInput, setRawSvgInput] = useState(value || "");
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);

  // Filter preset icons
  const filteredPresets = useMemo(() => {
    if (!search.trim()) return PRESET_DEV_ICONS;
    const q = search.toLowerCase();
    return PRESET_DEV_ICONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [search]);

  const handleSelectPreset = (svg: string) => {
    onChange(svg);
    setRawSvgInput(svg);
  };

  const handleApplyRawSvg = () => {
    if (!rawSvgInput.trim()) {
      onChange(null);
    } else {
      onChange(rawSvgInput.trim());
    }
  };

  const handleSelectMedia = (assetOrAssets: MediaAsset | MediaAsset[]) => {
    const asset = Array.isArray(assetOrAssets)
      ? assetOrAssets[0]
      : assetOrAssets;
    if (asset && asset.fileUrl) {
      // If it's a URL/path, create an img/svg container representation
      const imgTag = `<img src="${asset.fileUrl}" alt="${asset.fileName}" class="w-full h-full object-contain" />`;
      onChange(imgTag);
      setRawSvgInput(imgTag);
      setMediaPickerOpen(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Active Preview Box & Actions */}
      <div className="flex items-center gap-4 p-3 rounded-xl border border-border bg-muted/30">
        <div className="relative w-14 h-14 rounded-xl border border-border bg-card flex items-center justify-center p-2.5 shrink-0 overflow-hidden shadow-xs">
          {value ? (
            <div
              className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>img]:w-full [&>img]:h-full [&>img]:object-contain"
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <Sparkles className="w-6 h-6 text-muted-foreground/40" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-foreground">
            {value ? "Icon Terpasang" : "Belum Ada Icon"}
          </p>
          <p className="text-[11px] text-muted-foreground truncate">
            {value
              ? "Icon SVG aktif siap ditampilkan di kartu dan studi kasus"
              : "Pilih dari preset library, paste custom SVG, atau ambil dari Media Library"}
          </p>
        </div>

        {value && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              onChange(null);
              setRawSvgInput("");
            }}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-2.5"
            title="Hapus icon"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            <span className="text-xs">Hapus</span>
          </Button>
        )}
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-lg border border-border w-fit">
        <button
          type="button"
          onClick={() => setMode("preset")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "preset"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          Preset Library
        </button>
        <button
          type="button"
          onClick={() => setMode("raw")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "raw"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-blue-500" />
          Custom Raw SVG
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("media");
            setMediaPickerOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
            mode === "media"
              ? "bg-card text-foreground shadow-xs font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
          Media Library
        </button>
      </div>

      {/* Tab 1: Preset Dev Icons Grid */}
      {mode === "preset" && (
        <div className="space-y-2.5 p-3 rounded-xl border border-border bg-card">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari preset icon (e.g. React, Next, Docker, TypeScript)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-xs"
            />
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 scrollbar-thin">
            {filteredPresets.map((item) => {
              const isSelected = value === item.svg;
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleSelectPreset(item.svg)}
                  className={`group relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    isSelected
                      ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
                      : "border-border/60 hover:border-border hover:bg-muted/50"
                  }`}
                  title={item.name}
                >
                  <div
                    className="w-6 h-6 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full transition-transform group-hover:scale-110"
                    dangerouslySetInnerHTML={{ __html: item.svg }}
                  />
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground mt-1 truncate w-full text-center">
                    {item.name}
                  </span>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Custom Raw SVG Code */}
      {mode === "raw" && (
        <div className="space-y-2.5 p-3 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">
              Paste Kode SVG Langsung:
            </label>
            <span className="text-[11px] text-muted-foreground">
              Mendukung tag &lt;svg&gt;
            </span>
          </div>

          <Textarea
            rows={4}
            value={rawSvgInput}
            onChange={(e) => setRawSvgInput(e.target.value)}
            placeholder='<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="..."/></svg>'
            className="font-mono text-xs"
          />

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setRawSvgInput(value || "")}
              className="h-8 text-xs"
            >
              Reset
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleApplyRawSvg}
              className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Terapkan SVG
            </Button>
          </div>
        </div>
      )}

      {/* Tab 3: Media Library */}
      {mode === "media" && (
        <div className="p-4 rounded-xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-center space-y-2">
          <FolderOpen className="w-8 h-8 text-muted-foreground/60" />
          <p className="text-xs font-medium text-foreground">
            Pilih Asset Icon dari Media Library
          </p>
          <p className="text-[11px] text-muted-foreground max-w-xs">
            Unggah dan pilih file SVG atau PNG transparan beresolusi tinggi
            langsung dari penyimpanan terpusat.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMediaPickerOpen(true)}
            className="text-xs h-8 mt-1"
          >
            Buka Media Library
          </Button>
        </div>
      )}

      {/* Media Picker Dialog */}
      <MediaPickerDialog
        open={mediaPickerOpen}
        onOpenChange={setMediaPickerOpen}
        onSelect={handleSelectMedia}
        multiple={false}
        acceptTypes={["image"]}
        title="Pilih Icon Tech Stack"
      />
    </div>
  );
}
