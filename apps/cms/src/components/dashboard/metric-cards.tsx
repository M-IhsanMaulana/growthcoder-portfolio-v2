"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@growthcoder/ui";
import { Briefcase, FileText, Inbox, Eye, ArrowUpRight } from "lucide-react";
import type { DashboardStats } from "@growthcoder/types";

interface MetricCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
}

export function MetricCards({ stats, isLoading }: MetricCardsProps) {
  const cards = [
    {
      title: "Total Proyek",
      value: stats?.totalProjects ?? 0,
      description: "Studi kasus & portofolio aktif",
      icon: Briefcase,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      href: "/projects",
    },
    {
      title: "Total Artikel",
      value: stats?.totalArticles ?? 0,
      description: "Draft & artikel dipublikasikan",
      icon: FileText,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10 border-sky-500/20",
      href: "/articles",
    },
    {
      title: "Pesan Belum Dibaca",
      value: stats?.unreadInboxes ?? 0,
      totalValue: stats?.totalInboxes ?? 0,
      description: `dari ${stats?.totalInboxes ?? 0} total pesan masuk`,
      icon: Inbox,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10 border-amber-500/20",
      href: "/inbox",
      hasAlert: (stats?.unreadInboxes ?? 0) > 0,
    },
    {
      title: "Total View Artikel",
      value: (stats?.totalArticleViews ?? 0).toLocaleString("id-ID"),
      description: "Akumulasi pembaca blog",
      icon: Eye,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10 border-teal-500/20",
      href: "/articles",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-muted/60 border border-border animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link key={card.title} href={card.href} className="group">
            <Card className="border-border bg-card hover:bg-muted/40 transition-all duration-200 group-hover:shadow-md">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border ${card.bgColor}`}
                  >
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl lg:text-3xl font-heading font-bold text-foreground tracking-tight">
                      {card.value}
                    </span>
                    {card.hasAlert && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30 animate-pulse">
                        Unread
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="truncate">{card.description}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-500 transition-colors shrink-0" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
