"use client";

import React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@growthcoder/ui";
import { ScrollText, ArrowRight, Clock, Shield } from "lucide-react";
import type { ActivityLog } from "@growthcoder/types";

interface RecentActivityWidgetProps {
  activities?: ActivityLog[];
  isLoading?: boolean;
}

export function RecentActivityWidget({
  activities,
  isLoading,
}: RecentActivityWidgetProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="h-5 w-44 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 rounded-lg bg-muted/40 animate-pulse"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = activities || [];

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("STORE")) {
      return {
        label: "CREATE",
        class:
          "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/30",
      };
    }
    if (act.includes("UPDATE") || act.includes("EDIT")) {
      return {
        label: "UPDATE",
        class: "bg-sky-500/20 text-sky-600 dark:text-sky-300 border-sky-500/30",
      };
    }
    if (act.includes("DELETE") || act.includes("DESTROY")) {
      return {
        label: "DELETE",
        class: "bg-destructive/20 text-destructive border-destructive/30",
      };
    }
    if (act.includes("LOGIN") || act.includes("AUTH")) {
      return {
        label: "AUTH",
        class:
          "bg-teal-500/20 text-teal-600 dark:text-teal-300 border-teal-500/30",
      };
    }
    return {
      label: act,
      class: "bg-muted text-muted-foreground border-border",
    };
  };

  return (
    <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-emerald-500" />
            <CardTitle className="text-base font-heading font-semibold text-foreground">
              Riwayat Audit Aktivitas
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            Catatan mutasi data dan aksi admin terkini
          </CardDescription>
        </div>
        <Link
          href="/activity-logs"
          className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        {items.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <Shield className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs font-medium text-foreground">
              Belum ada catatan aktivitas.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Seluruh mutasi data CMS akan tercatat di sini.
            </p>
          </div>
        ) : (
          items.map((log) => {
            const badge = getActionBadge(log.action);
            const formattedDate = new Date(log.createdAt).toLocaleDateString(
              "id-ID",
              {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              },
            );

            return (
              <div
                key={log.id}
                className="p-2.5 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-all flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${badge.class}`}
                  >
                    {badge.label}
                  </span>
                  <div className="flex flex-col truncate">
                    <span className="text-foreground font-medium truncate">
                      {log.entity}{" "}
                      {log.entityId ? `#${log.entityId.slice(0, 6)}` : ""}
                    </span>
                    <span className="text-[11px] text-muted-foreground truncate">
                      Oleh {log.user?.name || "Administrator"}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
