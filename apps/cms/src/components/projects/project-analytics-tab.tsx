"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Users,
  ExternalLink,
  Github,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Calendar,
  RefreshCw,
  Loader2,
  Percent,
  Sparkles,
  MousePointerClick,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { apiClient } from "@/lib/api-client";
import type { Project, ProjectAnalyticsData } from "@growthcoder/types";

interface ProjectAnalyticsTabProps {
  project: Project;
}

export function ProjectAnalyticsTab({ project }: ProjectAnalyticsTabProps) {
  const [period, setPeriod] = useState<string>("30d");
  const [customFrom, setCustomFrom] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [customTo, setCustomTo] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });

  const [analyticsData, setAnalyticsData] =
    useState<ProjectAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/projects/${project.id}/analytics?period=${period}`;
      if (period === "custom") {
        url += `&from=${customFrom}&to=${customTo}`;
      }

      const res = await apiClient.get<ProjectAnalyticsData>(url);
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error("Failed to load project analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [project.id, period, customFrom, customTo]);

  useEffect(() => {
    if (period !== "custom") {
      fetchAnalytics();
    }
  }, [period, fetchAnalytics]);

  useEffect(() => {
    fetchAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = analyticsData?.summary;

  const formatDateRange = (from?: string, to?: string) => {
    if (!from || !to) return "";
    try {
      const f = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(from));
      const t = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(to));
      return `${f} — ${t}`;
    } catch {
      return `${from} — ${to}`;
    }
  };

  const getDeviceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("mobile"))
      return <Smartphone className="w-4 h-4 text-emerald-500" />;
    if (n.includes("tablet"))
      return <Tablet className="w-4 h-4 text-blue-500" />;
    return <Monitor className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="space-y-6">
      {/* Top Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-border bg-card shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Performance & Engagement Hub
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {formatDateRange(
                analyticsData?.dateFrom,
                analyticsData?.dateTo,
              ) || "Memuat periode analitik..."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="w-40">
            <Select value={period} onValueChange={(val) => setPeriod(val)}>
              <SelectTrigger className="h-8.5 text-xs">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Hari Terakhir</SelectItem>
                <SelectItem value="30d">30 Hari Terakhir</SelectItem>
                <SelectItem value="90d">90 Hari Terakhir</SelectItem>
                <SelectItem value="year">1 Tahun Terakhir</SelectItem>
                <SelectItem value="custom">Kustom Rentang Tanggal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === "custom" && (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="h-8.5 text-xs w-36"
              />
              <span className="text-xs text-muted-foreground">s/d</span>
              <Input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="h-8.5 text-xs w-36"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalytics}
                className="h-8.5 text-xs"
              >
                Terapkan
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAnalytics}
            disabled={isLoading}
            className="h-8.5 text-xs gap-1.5 px-2.5"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Segarkan
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3 p-12 rounded-3xl border border-border bg-card">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs font-medium text-muted-foreground">
            Menganalisis traffic & interaksi proyek...
          </p>
        </div>
      ) : (
        <>
          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* KPI 1: Total Views */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Total Views</span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-foreground">
                  {summary?.totalViews.toLocaleString() ?? 0}
                </p>
                <div className="flex items-center gap-1 text-[10px]">
                  {(summary?.periodGrowth ?? 0) >= 0 ? (
                    <span className="text-emerald-500 font-bold flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />+{summary?.periodGrowth}
                      %
                    </span>
                  ) : (
                    <span className="text-rose-500 font-bold flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3" />
                      {summary?.periodGrowth}%
                    </span>
                  )}
                  <span className="text-muted-foreground">vs periode lalu</span>
                </div>
              </div>
            </div>

            {/* KPI 2: Unique Visitors */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Unique Visitors</span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-foreground">
                  {summary?.uniqueVisitors.toLocaleString() ?? 0}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Pengunjung unik
                </p>
              </div>
            </div>

            {/* KPI 3: Demo Clicks */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Live Demo Clicks</span>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-foreground">
                  {summary?.demoClicks.toLocaleString() ?? 0}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Klik tombol Live Website
                </p>
              </div>
            </div>

            {/* KPI 4: Repo Clicks */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">
                  GitHub Repo Clicks
                </span>
                <div className="p-1.5 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-300">
                  <Github className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-foreground">
                  {summary?.repoClicks.toLocaleString() ?? 0}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Klik Source Code
                </p>
              </div>
            </div>

            {/* KPI 5: Conversion Rate CTR */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-2 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-semibold">Outbound CTR</span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold text-foreground">
                  {summary?.conversionRate ?? 0}%
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Total Clicks / Views
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Timeline Chart (Views vs Outbound Clicks) */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-500" />
                  Tren Traffic & Interaksi Harian
                </h3>
                <p className="text-xs text-muted-foreground">
                  Perbandingan tayangan studi kasus dengan klik aksi (Live Demo
                  & Repo)
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-muted-foreground">Page Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
                  <span className="text-muted-foreground">Outbound Clicks</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              {analyticsData?.timeSeries &&
              analyticsData.timeSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={analyticsData.timeSeries}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="projectViewsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#10b981"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#10b981"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="projectClicksGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      opacity={0.15}
                    />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#888888" }}
                      tickFormatter={(val) => {
                        try {
                          const d = new Date(val);
                          return `${d.getDate()} ${d.toLocaleString("id-ID", { month: "short" })}`;
                        } catch {
                          return val;
                        }
                      }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#888888" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const dataPoint = payload[0]?.payload;
                          return (
                            <div className="bg-popover/95 border border-border backdrop-blur-md p-3 rounded-xl shadow-xl text-xs space-y-1.5">
                              <p className="font-bold text-foreground border-b border-border/60 pb-1">
                                {label}
                              </p>
                              <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" /> Views:
                                </span>
                                <strong>{dataPoint?.views || 0}</strong>
                              </div>
                              <div className="flex items-center justify-between gap-4 text-blue-500">
                                <span className="flex items-center gap-1">
                                  <ExternalLink className="w-3 h-3" /> Demo
                                  Clicks:
                                </span>
                                <strong>{dataPoint?.demoClicks || 0}</strong>
                              </div>
                              <div className="flex items-center justify-between gap-4 text-slate-600 dark:text-slate-300">
                                <span className="flex items-center gap-1">
                                  <Github className="w-3 h-3" /> Repo Clicks:
                                </span>
                                <strong>{dataPoint?.repoClicks || 0}</strong>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="views"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#projectViewsGradient)"
                      name="Page Views"
                    />
                    <Area
                      type="monotone"
                      dataKey="totalClicks"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#projectClicksGradient)"
                      name="Outbound Clicks"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-xs">
                  Belum ada data interaksi di periode ini.
                </div>
              )}
            </div>
          </div>

          {/* Demographics & Traffic Breakdown Grid (4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Traffic Sources / Referrer */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                Sumber Referrer (Traffic)
              </h4>
              <div className="space-y-2 text-xs">
                {analyticsData?.sources && analyticsData.sources.length > 0 ? (
                  analyticsData.sources.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{
                            width: `${Math.min(100, item.percentage)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-[11px]">
                    Belum ada data referrer.
                  </p>
                )}
              </div>
            </div>

            {/* 2. Device Breakdown */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                Perangkat Pengunjung
              </h4>
              <div className="space-y-2 text-xs">
                {analyticsData?.devices && analyticsData.devices.length > 0 ? (
                  analyticsData.devices.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          {getDeviceIcon(item.name)}
                          {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${Math.min(100, item.percentage)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-[11px]">
                    Belum ada data perangkat.
                  </p>
                )}
              </div>
            </div>

            {/* 3. Browser Breakdown */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-500" />
                Browser Pengunjung
              </h4>
              <div className="space-y-2 text-xs">
                {analyticsData?.browsers &&
                analyticsData.browsers.length > 0 ? (
                  analyticsData.browsers.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full"
                          style={{
                            width: `${Math.min(100, item.percentage)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-[11px]">
                    Belum ada data browser.
                  </p>
                )}
              </div>
            </div>

            {/* 4. Operating Systems */}
            <div className="p-4 rounded-2xl border border-border bg-card shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-amber-500" />
                Sistem Operasi (OS)
              </h4>
              <div className="space-y-2 text-xs">
                {analyticsData?.operatingSystems &&
                analyticsData.operatingSystems.length > 0 ? (
                  analyticsData.operatingSystems.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-medium text-foreground truncate">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{
                            width: `${Math.min(100, item.percentage)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-[11px]">
                    Belum ada data OS.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Conversion & Engagement Insights Card */}
          <div className="p-6 rounded-3xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Lightbulb className="w-5 h-5" />
              <h3 className="text-sm font-bold text-foreground">
                Ringkasan Minat & Konversi Proyek
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Proyek ini memiliki tingkat konversi outbound (CTR) sebesar{" "}
              <strong className="text-foreground">
                {summary?.conversionRate || 0}%
              </strong>
              .
              {(summary?.conversionRate || 0) > 15 ? (
                <span>
                  {" "}
                  Proyek ini memiliki daya tarik yang sangat tinggi bagi
                  recruiter/klien karena rasio klik ke Live Demo dan Source Code
                  sangat aktif. Pertahankan proyek ini di posisi Featured!
                </span>
              ) : (
                <span>
                  {" "}
                  Pastikan tautan Live Demo dan Source Code dapat diakses dengan
                  cepat, serta tambahkan screenshot yang menarik di galeri untuk
                  meningkatkan interaksi pengunjung.
                </span>
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
