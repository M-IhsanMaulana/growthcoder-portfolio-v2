import React from "react";
import type { Metadata } from "next";
import { ArticleForm } from "@/components/articles/article-form";

export const metadata: Metadata = {
  title: "Tulis Artikel Baru | GrowthCoder CMS",
  description:
    "Buat artikel blog baru dengan CKEditor 5 dan Google SERP preview.",
};

export default function CreateArticlePage() {
  return (
    <div>
      <ArticleForm />
    </div>
  );
}
