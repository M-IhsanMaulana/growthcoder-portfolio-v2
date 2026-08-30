"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@growthcoder/ui";
import { MediaPickerDialog } from "@/components/media/media-picker-dialog";
import { resolveMediaUrl } from "@/lib/api-client";
import type { MediaAsset } from "@growthcoder/types";

export interface GalleryItemState {
  id?: string;
  imageUrl: string;
  caption?: string;
  sortOrder: number;
}

interface ProjectGalleryManagerProps {
  items: GalleryItemState[];
  onChange: (items: GalleryItemState[]) => void;
}

export function ProjectGalleryManager({
  items,
  onChange,
}: ProjectGalleryManagerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    caption?: string;
  } | null>(null);

  const handleAddMedia = (selected: MediaAsset | MediaAsset[]) => {
    const assets = Array.isArray(selected) ? selected : [selected];
    if (assets.length === 0) return;

    const newItems: GalleryItemState[] = assets.map((asset, idx) => ({
      imageUrl: asset.fileUrl,
      caption: asset.altText || "",
      sortOrder: items.length + idx,
    }));

    onChange([...items, ...newItems]);
    setPickerOpen(false);
  };

  const handleUpdateCaption = (index: number, caption: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], caption };
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = items
      .filter((_, i) => i !== index)
      .map((it, idx) => ({
        ...it,
        sortOrder: idx,
      }));
    onChange(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;

    // Resync sortOrder
    const normalized = updated.map((it, idx) => ({ ...it, sortOrder: idx }));
    onChange(normalized);
  };

  const handleMoveDown = (index: number) => {
    if (index === items.length - 1) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;

    // Resync sortOrder
    const normalized = updated.map((it, idx) => ({ ...it, sortOrder: idx }));
    onChange(normalized);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-1">
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            Galeri Screenshot Proyek ({items.length})
          </h3>
          <p className="text-xs text-muted-foreground">
            Unggah dan susun tangkapan layar antarmuka atau arsitektur sistem
            dari Media Library.
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setPickerOpen(true)}
          size="sm"
          variant="outline"
          className="h-8 text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-medium shrink-0"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Tambah dari Media Library
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-border bg-card/40 text-center flex flex-col items-center justify-center space-y-2.5">
          <div className="p-3 rounded-2xl bg-muted/60 text-muted-foreground">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-foreground">
              Belum ada screenshot galeri
            </p>
            <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5">
              Pilih satu atau beberapa gambar sekaligus dari Media Library untuk
              ditampilkan sebagai galeri/lightbox proyek.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => setPickerOpen(true)}
            size="sm"
            className="text-xs h-8 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Pilih Media
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item, index) => (
            <div
              key={`${item.imageUrl}-${index}`}
              className="p-3 rounded-xl border border-border bg-card hover:border-border/80 transition-all flex flex-col justify-between space-y-2.5 shadow-2xs group"
            >
              {/* Image Preview & Order Badge */}
              <div className="relative aspect-video rounded-lg overflow-hidden border border-border/80 bg-muted/40 flex items-center justify-center">
                <Image
                  src={resolveMediaUrl(item.imageUrl)}
                  alt={item.caption || `Screenshot #${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 300px"
                />

                {/* Sort Order Badge */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-mono font-bold shadow-xs">
                  #{index + 1}
                </div>

                {/* Quick Overlay Action Buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setPreviewImage({
                        url: item.imageUrl,
                        caption: item.caption,
                      })
                    }
                    className="h-7 w-7 p-0 bg-black/60 hover:bg-black/80 text-white rounded-md backdrop-blur-sm"
                    title="Lihat ukuran penuh"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(index)}
                    className="h-7 w-7 p-0 bg-destructive/80 hover:bg-destructive text-white rounded-md backdrop-blur-sm"
                    title="Hapus dari galeri"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              {/* Caption Input & Sorting Controls */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 min-w-0">
                  <Input
                    placeholder="Caption screenshot (e.g. Dashboard View)..."
                    value={item.caption || ""}
                    onChange={(e) => handleUpdateCaption(index, e.target.value)}
                    className="h-7.5 text-xs bg-muted/30"
                  />
                </div>

                {/* Move Up / Down */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMoveUp(index)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Geser ke atas / kiri"
                  >
                    <MoveUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={index === items.length - 1}
                    onClick={() => handleMoveDown(index)}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
                    title="Geser ke bawah / kanan"
                  >
                    <MoveDown className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Picker Dialog Multi-Select */}
      <MediaPickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleAddMedia}
        multiple={true}
        acceptTypes={["image"]}
        title="Pilih Screenshot Proyek dari Media Library"
      />

      {/* Lightbox Preview Modal */}
      <Dialog
        open={Boolean(previewImage)}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogContent className="max-w-4xl p-5 bg-background/95 backdrop-blur-xl rounded-2xl border-border shadow-2xl">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base font-bold truncate text-foreground">
              {previewImage?.caption || "Preview Screenshot"}
            </DialogTitle>
          </DialogHeader>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/90 flex items-center justify-center border border-border/40">
            {previewImage && (
              <Image
                src={resolveMediaUrl(previewImage.url)}
                alt={previewImage.caption || "Full Preview"}
                fill
                unoptimized
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1000px"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
