"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@growthcoder/ui";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { PieChart as PieIcon } from "lucide-react";
import type { ContentDistributionItem } from "@growthcoder/types";

interface ContentDistributionChartProps {
  data?: ContentDistributionItem[];
  isLoading?: boolean;
}

export function ContentDistributionChart({
  data,
  isLoading,
}: ContentDistributionChartProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <div className="h-5 w-36 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted/60 rounded animate-pulse mt-1" />
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <div className="w-40 h-40 rounded-full border-4 border-muted border-t-emerald-500 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const chartData =
    data && data.length > 0
      ? data
      : [
          {
            name: "Full-Stack Web App",
            count: 6,
            percentage: 45,
            color: "#2bb673",
          },
          {
            name: "Backend API & Microservices",
            count: 4,
            percentage: 30,
            color: "#2d2a6f",
          },
          {
            name: "Automation & Telegram Bot",
            count: 2,
            percentage: 15,
            color: "#38bdf8",
          },
          {
            name: "DevOps & Cloud Infra",
            count: 1,
            percentage: 10,
            color: "#f59e0b",
          },
        ];

  const totalItems = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <PieIcon className="w-4 h-4 text-emerald-500" />
          <CardTitle className="text-base font-heading font-semibold text-foreground">
            Distribusi Portofolio
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Proporsi proyek berdasarkan kategori keahlian
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-44 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={4}
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#2bb673"} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown, name: unknown) => [
                  `${value} Proyek (${Math.round((Number(value || 0) / (totalItems || 1)) * 100)}%)`,
                  String(name || ""),
                ]}
                contentStyle={{
                  backgroundColor: "var(--color-popover, #ffffff)",
                  borderColor: "var(--color-border, #e2e8f0)",
                  borderRadius: "0.5rem",
                  fontSize: "12px",
                  color: "var(--color-popover-foreground, #0f172a)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-heading font-bold text-foreground">
              {totalItems}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Proyek
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="space-y-1.5 pt-2 border-t border-border">
          {chartData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || "#2bb673" }}
                />
                <span className="text-foreground/90 truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-muted-foreground shrink-0">
                {item.count} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
