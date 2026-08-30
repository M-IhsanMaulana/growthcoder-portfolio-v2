"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  TrendingUp,
  History,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui";
import { ProjectDetailHeader } from "@/components/projects/project-detail-header";
import { ProjectOverviewTab } from "@/components/projects/project-overview-tab";
import { ProjectAnalyticsTab } from "@/components/projects/project-analytics-tab";
import { ProjectActivityTab } from "@/components/projects/project-activity-tab";
import { apiClient } from "@/lib/api-client";
import type { Project } from "@growthcoder/types";

type TabType = "overview" | "analytics" | "activity";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabType;
    if (tabParam && ["overview", "analytics", "activity"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await apiClient.get<Project>(
          `/api/admin/projects/${resolvedParams.id}`,
        );
        if (res.success && res.data) {
          setProject(res.data);
        } else {
          setError(res.message || "Proyek tidak ditemukan");
        }
      } catch (err: unknown) {
        const errorObj = err as { message?: string };
        setError(errorObj.message || "Gagal memuat detail proyek");
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
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
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <p className="text-sm font-medium text-muted-foreground">
          Memuat rincian studi kasus proyek...
        </p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">
            Gagal Membuka Proyek
          </h2>
          <p className="text-xs text-muted-foreground">
            {error || "Proyek tidak ditemukan atau telah dihapus."}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/projects")}
          className="text-xs gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Proyek
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
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <ProjectDetailHeader
        project={project}
        onProjectUpdated={(updated) => setProject(updated)}
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
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-emerald-500" : "text-muted-foreground"}`}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div className="animate-in fade-in-50 duration-200">
        {activeTab === "overview" && <ProjectOverviewTab project={project} />}
        {activeTab === "analytics" && <ProjectAnalyticsTab project={project} />}
        {activeTab === "activity" && <ProjectActivityTab project={project} />}
      </div>
    </div>
  );
}
