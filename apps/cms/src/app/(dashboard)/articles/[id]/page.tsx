"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  TrendingUp,
  History,
  Globe,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui";
import { ArticleDetailHeader } from "@/components/articles/article-detail-header";
import { ArticleOverviewTab } from "@/components/articles/article-overview-tab";
import { ArticleAnalyticsTab } from "@/components/articles/article-analytics-tab";
import { ArticleActivityTab } from "@/components/articles/article-activity-tab";
import { ArticleSeoTab } from "@/components/articles/article-seo-tab";
import { apiClient } from "@/lib/api-client";
import type { Article } from "@growthcoder/types";

type TabType = "overview" | "analytics" | "activity" | "seo";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType;
    if (
      tabParam &&
      ["overview", "analytics", "activity", "seo"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadArticle() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<Article>(
          `/api/admin/articles/${resolvedParams.id}`,
        );
        if (res.success && res.data) {
          setArticle(res.data);
        } else {
          setError(res.message || "Artikel tidak ditemukan");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat detail artikel");
      } finally {
        setIsLoading(false);
      }
    }

    loadArticle();
  }, [resolvedParams.id]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState({}, "", url.toString());
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground">
          Memuat rincian artikel...
        </p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">
            Gagal Membuka Artikel
          </h2>
          <p className="text-xs text-muted-foreground">
            {error || "Artikel tidak ditemukan atau telah dihapus."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/articles")}
          className="text-xs gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Artikel
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "overview" as const, label: "Overview & Konten", icon: FileText },
    {
      id: "analytics" as const,
      label: "Performance & Analytics",
      icon: TrendingUp,
    },
    { id: "activity" as const, label: "Riwayat Aktivitas", icon: History },
    { id: "seo" as const, label: "SEO & Metadata", icon: Globe },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <ArticleDetailHeader
        article={article}
        onArticleUpdated={(updated) => setArticle(updated)}
      />

      {/* Tabs Navigation Bar */}
      <div className="border-b border-border/80 sticky top-0 bg-background/95 backdrop-blur-md z-10 py-1">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "border-primary text-primary font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div className="animate-in fade-in-50 duration-200">
        {activeTab === "overview" && <ArticleOverviewTab article={article} />}
        {activeTab === "analytics" && <ArticleAnalyticsTab article={article} />}
        {activeTab === "activity" && <ArticleActivityTab article={article} />}
        {activeTab === "seo" && <ArticleSeoTab article={article} />}
      </div>
    </div>
  );
}
