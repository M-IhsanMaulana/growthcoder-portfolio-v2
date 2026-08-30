"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  History,
  Clock,
  User,
  Globe,
  PlusCircle,
  Edit3,
  Trash2,
  Sliders,
  RefreshCw,
  Loader2,
  ChevronRight,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui";
import { ActivityLogDiffDialog } from "@/components/activity-logs/activity-log-diff-dialog";
import { apiClient } from "@/lib/api-client";
import type { Project, ActivityLog, ActivityAction } from "@growthcoder/types";

interface ProjectActivityTabProps {
  project: Project;
}

export function ProjectActivityTab({ project }: ProjectActivityTabProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<ActivityLog[]>(
        `/api/admin/activity-logs?entity=project&entityId=${project.id}&perPage=50`,
      );
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Failed to load project activity logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [project.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: ActivityAction) => {
    switch (action) {
      case "create":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <PlusCircle className="w-3 h-3" /> Proyek Dibuat
          </span>
        );
      case "update":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Edit3 className="w-3 h-3" /> Diperbarui
          </span>
        );
      case "delete":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <Trash2 className="w-3 h-3" /> Dihapus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-muted text-muted-foreground border border-border">
            <Sliders className="w-3 h-3" /> {action}
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "medium",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl border border-border bg-card shadow-xs">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-500" />
            Riwayat Aktivitas & Perubahan
          </h2>
          <p className="text-xs text-muted-foreground">
            Audit trail setiap kali studi kasus, tech stacks, atau pengaturan
            proyek diperbarui.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={isLoading}
          className="h-8.5 text-xs gap-1.5"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Segarkan Log
        </Button>
      </div>

      {/* Timeline Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-3 p-12 rounded-3xl border border-border bg-card">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <p className="text-xs font-medium text-muted-foreground">
            Memuat riwayat log aktivitas...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-border bg-card space-y-2">
          <History className="w-8 h-8 mx-auto text-muted-foreground opacity-40" />
          <h3 className="text-sm font-semibold text-foreground">
            Belum Ada Riwayat Aktivitas
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Log aktivitas akan tercatat otomatis saat terjadi pembuatan atau
            pembaruan proyek.
          </p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
          {logs.map((log) => {
            const hasDiff = Boolean(
              log.payload && Object.keys(log.payload).length > 0,
            );

            return (
              <div key={log.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-6 top-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background ring-4 ring-card transition-all group-hover:scale-125" />

                {/* Log Card */}
                <div className="p-4 rounded-2xl border border-border bg-card shadow-xs transition-all hover:border-border/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getActionBadge(log.action)}
                      <span className="text-xs font-semibold text-foreground">
                        {log.user?.name || "Administrator"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/60">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{log.user?.email || "System"}</span>
                    </div>
                    {log.ipAddress && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5" />
                        <span className="font-mono">{log.ipAddress}</span>
                      </div>
                    )}

                    {hasDiff && (
                      <button
                        onClick={() => {
                          setSelectedLog(log);
                          setIsDiffOpen(true);
                        }}
                        className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <Code className="w-3.5 h-3.5" />
                        Lihat Rincian Perubahan
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Diff Dialog */}
      <ActivityLogDiffDialog
        log={selectedLog}
        open={isDiffOpen}
        onOpenChange={setIsDiffOpen}
      />
    </div>
  );
}
