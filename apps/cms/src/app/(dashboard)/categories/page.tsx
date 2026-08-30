import React from "react";
import type { Metadata } from "next";
import { TaxonomiesTabView } from "@/components/taxonomies/taxonomies-tab-view";

export const metadata: Metadata = {
  title: "Taxonomies & Tags | GrowthCoder CMS",
  description:
    "Kelola Kategori Artikel, Kategori Proyek, dan Tags Master sistem.",
};

export default function CategoriesPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Taxonomies & Tags
          </h1>
          <p className="text-xs text-muted-foreground">
            Pusat manajemen klasifikasi konten, kategori proyek, dan kata kunci
            tag blog.
          </p>
        </div>
      </div>

      {/* Taxonomies Tab View */}
      <TaxonomiesTabView />
    </div>
  );
}
