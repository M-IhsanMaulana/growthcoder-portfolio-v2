"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DashboardStats } from "@growthcoder/types";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { TrafficChart } from "@/components/dashboard/traffic-chart";
import { ContentDistributionChart } from "@/components/dashboard/content-distribution-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UnreadInboxWidget } from "@/components/dashboard/unread-inbox-widget";
import { RecentActivityWidget } from "@/components/dashboard/recent-activity-widget";
import { Button } from "@growthcoder/ui";
import { RotateCw, Sparkles, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const { user } = useAuth();

  const {
    data: stats,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get<DashboardStats>("/api/admin/dashboard");
      return res.data;
    },
    refetchInterval: 30_000,
  });

  const todayFormatted = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Welcome Banner & Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">
              Executive Overview
            </span>
            <span className="text-xs text-muted-foreground">
              • {todayFormatted}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground tracking-tight flex items-center gap-2">
            Selamat Datang, {user?.name || "Admin"}{" "}
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground">
            Pantau ringkasan performa portofolio, publikasi artikel, dan pesan
            masuk secara real-time.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
            className="border-border bg-card hover:bg-muted text-foreground text-xs font-medium flex items-center gap-2 h-9 px-3 cursor-pointer shadow-sm"
          >
            <RotateCw
              className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-emerald-500" : ""}`}
            />
            <span>{isFetching ? "Menyinkronkan..." : "Segarkan Data"}</span>
          </Button>
        </div>
      </div>

      {/* Error state if backend fails */}
      {isError && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Gagal memuat data dari API Backend:{" "}
              {error instanceof Error ? error.message : "Koneksi terputus"}.
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
            className="border-destructive/30 text-destructive hover:bg-destructive/10 text-xs h-7"
          >
            Coba Lagi
          </Button>
        </div>
      )}

      {/* Section 1: 4 Key Metric Cards */}
      <MetricCards stats={stats} isLoading={isLoading} />

      {/* Section 2: Analytics & Visual Charts (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrafficChart data={stats?.trafficSeries} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-1">
          <ContentDistributionChart
            data={stats?.categoryDistribution}
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Section 3: Quick Actions & Emergency Maintenance Mode Control */}
      <QuickActions isMaintenanceActive={stats?.isMaintenanceActive} />

      {/* Section 4: Feeds & Recent Activity (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UnreadInboxWidget
          inboxes={stats?.recentInboxes}
          unreadCount={stats?.unreadInboxes}
          isLoading={isLoading}
        />
        <RecentActivityWidget
          activities={stats?.recentActivities}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
