"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Eye,
  Users,
  Clock,
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
  FileCheck,
  Award,
  ArrowRight,
  Filter,
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
import type { Article, ArticleAnalyticsData } from "@growthcoder/types";

interface ArticleAnalyticsTabProps {
  article: Article;
}

export function ArticleAnalyticsTab({ article }: ArticleAnalyticsTabProps) {
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
    useState<ArticleAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = `/api/admin/articles/${article.id}/analytics?period=${period}`;
      if (period === "custom") {
        url += `&from=${customFrom}&to=${customTo}`;
      }

      const res = await apiClient.get<ArticleAnalyticsData>(url);
      if (res.success && res.data) {
        setAnalyticsData(res.data);
      }
    } catch (err) {
      console.error("Failed to load article analytics:", err);
    } finally {
      setIsLoading(false);
    }
  }, [article.id, period, customFrom, customTo]);

  useEffect(() => {
    if (period !== "custom") {
      fetchAnalytics();
    }
  }, [period, fetchAnalytics]);

  // Initial load
  useEffect(() => {
    fetchAnalytics();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = analyticsData?.summary;
  const evaluation = analyticsData?.contentEvaluation;

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

  return (
    <div className="space-y-6">
      {/* Analytics Toolbar / Filters */}
      <div className="rounded-2xl border border-border bg-card shadow-xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Performa & Analitik Pembaca
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {analyticsData?.dateFrom && analyticsData?.dateTo ? (
                <span>
                  Periode aktif:{" "}
                  <strong className="text-foreground font-semibold">
                    {formatDateRange(
                      analyticsData.dateFrom,
                      analyticsData.dateTo,
                    )}
                  </strong>
                </span>
              ) : (
                "Laporan interaksi, pertumbuhan pembaca, dan evaluasi struktur konten"
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Select
              value={period}
              onValueChange={(val) => {
                setPeriod(val);
              }}
            >
              <SelectTrigger className="w-[170px] h-9 text-xs font-medium bg-card">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d" className="text-xs">
                  7 Hari Terakhir
                </SelectItem>
                <SelectItem value="30d" className="text-xs">
                  30 Hari Terakhir
                </SelectItem>
                <SelectItem value="90d" className="text-xs">
                  90 Hari Terakhir
                </SelectItem>
                <SelectItem value="year" className="text-xs">
                  1 Tahun Terakhir
                </SelectItem>
                <SelectItem
                  value="custom"
                  className="text-xs font-semibold text-primary"
                >
                  📅 Kustom Rentang Tanggal...
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchAnalytics}
              disabled={isLoading}
              className="h-9 px-3 text-xs"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
              />
              Segarkan
            </Button>
          </div>
        </div>

        {/* Custom Date Range Selector Bar */}
        {period === "custom" && (
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Tentukan Rentang Tanggal Kustom:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Dari:</span>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">
                  Sampai:
                </span>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="h-8 px-2.5 text-xs rounded-lg border border-border bg-card text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <Button
                size="sm"
                onClick={fetchAnalytics}
                disabled={isLoading || !customFrom || !customTo}
                className="h-8 px-3.5 text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-xs"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                ) : (
                  <Filter className="w-3.5 h-3.5 mr-1" />
                )}
                Terapkan Filter
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading && !analyticsData ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-border bg-card/50 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">
            Memuat data analitik...
          </p>
        </div>
      ) : (
        <>
          {/* KPI Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Views Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Total Tayangan
                </span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {summary?.totalViews || 0}
                </span>
                {summary?.periodGrowth !== undefined && (
                  <span
                    className={`inline-flex items-center text-[11px] font-semibold ${
                      summary.periodGrowth >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {summary.periodGrowth >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    )}
                    {summary.periodGrowth >= 0
                      ? `+${summary.periodGrowth}%`
                      : `${summary.periodGrowth}%`}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Dalam rentang tanggal terpilih
              </p>
            </div>

            {/* Unique Visitors Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Pengunjung Unik
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {summary?.uniqueVisitors || 0}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Berdasarkan sidik jari browser
              </p>
            </div>

            {/* Avg Reading Time Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Estimasi Waktu Baca
                </span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  ~{summary?.avgReadingTime || 1} min
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Standar 200 kata/menit
              </p>
            </div>

            {/* Readability Score Card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Tingkat Keterbacaan
                </span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {evaluation?.readabilityGrade || "Moderate"}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  ({evaluation?.readabilityScore || 75}/100)
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Berdasarkan struktur teks & kata
              </p>
            </div>
          </div>

          {/* Time-Series Views Chart Card */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Tren Tayangan & Pengunjung Harian
                </h3>
                <p className="text-xs text-muted-foreground">
                  Aktivitas kunjungan artikel sepanjang rentang waktu terpilih
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span className="text-muted-foreground">Tayangan</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-muted-foreground">Pengunjung Unik</span>
                </div>
              </div>
            </div>

            <div className="h-[280px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={analyticsData?.timeSeries || []}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="viewsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#3b82f6"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="visitorsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop
                        offset="95%"
                        stopColor="#10b981"
                        stopOpacity={0.0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="formattedDate"
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{
                      fontSize: 11,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.75rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="views"
                    name="Tayangan"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#viewsGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="uniqueVisitors"
                    name="Pengunjung Unik"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#visitorsGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demographic & Sources Grid (2 Columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referrer Sources Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Sumber Trafik / Referrer
              </h3>

              <div className="space-y-3">
                {analyticsData?.sources && analyticsData.sources.length > 0 ? (
                  analyticsData.sources.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground font-mono">
                          {item.count} kunjungan ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(item.percentage, 5)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic text-center py-6">
                    Belum ada data sumber trafik.
                  </p>
                )}
              </div>
            </div>

            {/* Device & Platform Breakdown Card */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-primary" />
                Distribusi Perangkat & Browser
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {/* Devices */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Perangkat
                  </span>
                  <div className="space-y-1.5">
                    {analyticsData?.devices.map((d, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-foreground">{d.name}</span>
                        <span className="font-mono text-muted-foreground">
                          {d.count} ({d.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browsers */}
                <div className="p-3.5 rounded-xl bg-muted/40 border border-border space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                    Browser Populer
                  </span>
                  <div className="space-y-1.5">
                    {analyticsData?.browsers.map((b, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-foreground">{b.name}</span>
                        <span className="font-mono text-muted-foreground">
                          {b.count} ({b.percentage}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* OS Summary */}
              <div className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Sistem Operasi Terbanyak:
                </span>
                <span className="font-semibold text-foreground font-mono">
                  {analyticsData?.operatingSystems?.[0]?.name || "Windows"} (
                  {analyticsData?.operatingSystems?.[0]?.percentage || 100}%)
                </span>
              </div>
            </div>
          </div>

          {/* Content Structure & Readability Evaluation Card */}
          {evaluation && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    Evaluasi Struktur Konten & Readability
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Analisis komposisi teks, heading, dan rekomendasi optimasi
                    keterbacaan
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Score: {evaluation.readabilityScore}/100
                </div>
              </div>

              {/* Stats Metrics Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground block">
                    Jumlah Paragraf
                  </span>
                  <span className="text-lg font-bold text-foreground font-mono">
                    {evaluation.paragraphCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground block">
                    Total Heading (H1-H3)
                  </span>
                  <span className="text-lg font-bold text-foreground font-mono">
                    {evaluation.headingCount.total} (
                    {evaluation.headingCount.h2} H2)
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground block">
                    Gambar Ilustrasi
                  </span>
                  <span className="text-lg font-bold text-foreground font-mono">
                    {evaluation.imageCount}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-center">
                  <span className="text-[11px] text-muted-foreground block">
                    Tautan (Links)
                  </span>
                  <span className="text-lg font-bold text-foreground font-mono">
                    {evaluation.linkCount}
                  </span>
                </div>
              </div>

              {/* Recommendations Box */}
              {evaluation.recommendations &&
                evaluation.recommendations.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs">
                      <Lightbulb className="w-4 h-4" />
                      <span>Saran Optimasi Konten:</span>
                    </div>
                    <ul className="space-y-1.5 pl-6 list-disc text-xs text-muted-foreground">
                      {evaluation.recommendations.map((rec, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
