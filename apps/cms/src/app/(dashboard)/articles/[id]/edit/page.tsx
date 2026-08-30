import React from "react";
import type { Metadata } from "next";
import { ArticleForm } from "@/components/articles/article-form";

export const metadata: Metadata = {
  title: "Edit Artikel | GrowthCoder CMS",
  description: "Perbarui konten artikel blog dan meta SEO.",
};

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const resolvedParams = await params;

  return (
    <div>
      <ArticleForm initialId={resolvedParams.id} />
    </div>
  );
}
