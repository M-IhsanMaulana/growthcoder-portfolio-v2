import React from "react";
import type { Metadata } from "next";
import { ArticleTable } from "@/components/articles/article-table";

export const metadata: Metadata = {
  title: "Blog & Articles Manager | GrowthCoder CMS",
  description:
    "Kelola artikel blog, tutorial teknis, publikasi terjadwal, dan analitik pembaca.",
};

export default function ArticlesPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Blog & Articles Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Manajemen artikel teknis, studi kasus pemikiran, dan publikasi blog
            GrowthCoder.
          </p>
        </div>
      </div>

      {/* Article Table Component */}
      <ArticleTable />
    </div>
  );
}
