"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  FolderOpen,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@growthcoder/ui";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset } from "@growthcoder/types";

interface LogoPickerFieldProps {
  label: string;
  description?: string;
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  placeholderText?: string;
}

export function LogoPickerField({
  label,
  description,
  value,
  onChange,
  placeholderText = "Pilih logo / gambar dari Media Library",
}: LogoPickerFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const handleSelectMedia = (selected: MediaAsset | MediaAsset[]) => {
    const asset = Array.isArray(selected) ? selected[0] : selected;
    if (asset) {
      onChange(asset.fileUrl);
    }
    setPickerOpen(false);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const isSvg =
    value?.toLowerCase().endsWith(".svg") || value?.includes("<svg");

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-xs text-destructive hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Hapus Logo
          </button>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      {value ? (
        <div className="flex items-center gap-3.5 p-3 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
          {/* Logo Preview */}
          <div className="w-12 h-12 rounded-lg border border-border/80 bg-background/80 flex items-center justify-center p-2 shrink-0 overflow-hidden shadow-2xs">
            {value.startsWith("<svg") ? (
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:object-contain"
                dangerouslySetInnerHTML={{ __html: value }}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveMediaUrl(value)}
                alt="Logo preview"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {value}
            </p>
            <span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Tersambung ke Media Library
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPickerOpen(true)}
            className="shrink-0 text-xs h-8 px-3 rounded-lg"
          >
            <FolderOpen className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Ganti
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="w-full border-2 border-dashed border-border/80 hover:border-primary/50 hover:bg-primary/5 rounded-xl p-4 flex items-center justify-center gap-2.5 text-muted-foreground hover:text-foreground transition-all duration-200 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <ImageIcon className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium">{placeholderText}</span>
        </button>
      )}

      {/* Media Picker Dialog Modal */}
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectMedia}
        title={`Pilih ${label}`}
        acceptTypes={["image"]}
      />
    </div>
  );
}
