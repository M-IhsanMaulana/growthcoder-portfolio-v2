"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@growthcoder/ui";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { TrendingUp, BarChart3 } from "lucide-react";
import type { TrafficSeriesItem } from "@growthcoder/types";

interface TrafficChartProps {
  data?: TrafficSeriesItem[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-popover border border-border p-3 shadow-xl backdrop-blur-md text-xs space-y-1.5 min-w-[140px] text-popover-foreground">
        <p className="font-semibold text-foreground border-b border-border pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry, index) => (
            <div
              key={`item-${index}`}
              className="flex items-center justify-between gap-3"
            >
              <span className="text-muted-foreground capitalize">
                {entry.name === "views" ? "Total Views" : "Artikel Diterbitkan"}
                :
              </span>
              <span className="font-bold text-foreground">
                {entry.value.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

export function TrafficChart({ data, isLoading }: TrafficChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="h-5 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted/60 rounded animate-pulse mt-1" />
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="h-64 w-full bg-muted/40 rounded-xl animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Fallback demo data if empty
  const chartData =
    data && data.length > 0
      ? data
      : [
          { period: "Mar 2026", views: 240, articles: 2 },
          { period: "Apr 2026", views: 420, articles: 4 },
          { period: "Mei 2026", views: 680, articles: 3 },
          { period: "Jun 2026", views: 950, articles: 5 },
          { period: "Jul 2026", views: 1350, articles: 6 },
          { period: "Agu 2026", views: 1820, articles: 8 },
        ];

  const totalViewsInPeriod = chartData.reduce(
    (acc, curr) => acc + curr.views,
    0,
  );

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <CardTitle className="text-base font-heading font-semibold text-foreground">
              Trafik View & Publikasi Blog
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Performa pembaca dan frekuensi rilis artikel 6 bulan terakhir
          </CardDescription>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{totalViewsInPeriod.toLocaleString("id-ID")} Total Views</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2bb673" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2bb673" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient
                  id="articlesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-muted/30"
                vertical={false}
              />
              <XAxis
                dataKey="period"
                stroke="currentColor"
                className="text-muted-foreground text-[11px]"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="currentColor"
                className="text-muted-foreground text-[11px]"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="views"
                name="views"
                stroke="#2bb673"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="articles"
                name="articles"
                stroke="#38bdf8"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#articlesGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 border-t border-border text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Trafik Pembaca (Views)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-500" />
            <span>Artikel Diterbitkan</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
