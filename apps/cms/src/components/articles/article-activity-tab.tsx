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
  CheckCircle2,
  RefreshCw,
  Loader2,
  ChevronRight,
  Code,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui";
import { ActivityLogDiffDialog } from "@/components/activity-logs/activity-log-diff-dialog";
import { apiClient } from "@/lib/api-client";
import type { Article, ActivityLog, ActivityAction } from "@growthcoder/types";

interface ArticleActivityTabProps {
  article: Article;
}

export function ArticleActivityTab({ article }: ArticleActivityTabProps) {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [isDiffOpen, setIsDiffOpen] = useState(false);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<ActivityLog[]>(
        `/api/admin/activity-logs?entity=article&entityId=${article.id}&perPage=50`,
      );
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error("Failed to load article activity logs:", err);
    } finally {
      setIsLoading(false);
    }
  }, [article.id]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getActionBadge = (action: ActivityAction) => {
    switch (action) {
      case "create":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <PlusCircle className="w-3 h-3" /> Artikel Dibuat
          </span>
        );
      case "update":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <Edit3 className="w-3 h-3" /> Konten Diperbarui
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-xs">
        <div>
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Riwayat Aktivitas & Audit Trail
          </h2>
          <p className="text-xs text-muted-foreground">
            Lacak seluruh perubahan status, penyuntingan konten, dan operator
            yang bertanggung jawab
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchLogs}
          disabled={isLoading}
          className="h-9 px-3 text-xs"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Segarkan Log
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 rounded-2xl border border-border bg-card/50 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">
            Memuat riwayat aktivitas...
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/30 space-y-3">
          <History className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm font-semibold text-foreground">
            Belum ada riwayat aktivitas
          </p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Aktivitas penyuntingan atau pembaruan status pada artikel ini akan
            otomatis dicatat di sini.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-border">
            {logs.map((log) => {
              const hasDiff =
                log.payload && Object.keys(log.payload).length > 0;
              const changesSummary = (log.payload as any)?.changesSummary;

              return (
                <div key={log.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[27px] sm:-left-[35px] top-1.5 w-4 h-4 rounded-full bg-card border-2 border-primary group-hover:scale-125 transition-transform" />

                  <div className="p-4 sm:p-5 rounded-xl border border-border bg-card/60 hover:bg-muted/30 transition-colors space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getActionBadge(log.action)}
                        {changesSummary && (
                          <span className="text-xs text-muted-foreground">
                            • {changesSummary}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>

                    {/* Operator & Client details */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/50 text-xs">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1.5 text-foreground font-medium">
                          <User className="w-3.5 h-3.5 text-primary" />
                          {log.user?.name ||
                            (log.userId
                              ? `User ID: ${log.userId.slice(0, 8)}`
                              : "Sistem")}
                        </span>

                        {log.ipAddress && (
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Globe className="w-3 h-3" />
                            {log.ipAddress}
                          </span>
                        )}
                      </div>

                      {hasDiff && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDiffOpen(true);
                          }}
                          className="h-7 px-2.5 text-xs gap-1"
                        >
                          <Code className="w-3 h-3" />
                          <span>Lihat Snapshot Diff</span>
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Diff Inspector Modal */}
      <ActivityLogDiffDialog
        open={isDiffOpen}
        onOpenChange={setIsDiffOpen}
        log={selectedLog}
      />
    </div>
  );
}
