"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ScrollText,
  Search,
  RefreshCw,
  Download,
  Filter,
  Eye,
  PlusCircle,
  Edit3,
  Trash2,
  LogIn,
  LogOut,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Database,
  User,
  Globe,
  Clock,
  FileSpreadsheet,
  FileCode,
  FileText,
  Loader2,
} from "lucide-react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Combobox,
} from "@/components/ui";
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@growthcoder/ui";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { ActivityLogDiffDialog } from "@/components/activity-logs/activity-log-diff-dialog";
import type {
  ActivityLog,
  ActivityAction,
  PaginatedResponse,
} from "@growthcoder/types";

interface ActivityStats {
  total: number;
  today: number;
  byAction: Record<string, number>;
  topEntities: Array<{ entity: string; count: number }>;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<ActivityStats>({
    total: 0,
    today: 0,
    byAction: {},
    topEntities: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [entityFilter, setEntityFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(20);
  const [meta, setMeta] = useState({ total: 0, lastPage: 1 });

  // Inspector Dialog
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiClient.get<ActivityStats>(
        "/api/admin/activity-logs/stats",
      );
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch {
      // non-blocking
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("perPage", String(perPage));
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (entityFilter !== "all") params.set("entity", entityFilter);
      if (search.trim()) params.set("search", search.trim());
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await apiClient.get<ActivityLog[]>(
        `/api/admin/activity-logs?${params.toString()}`,
      );
      if (res.success && res.data) {
        setLogs(res.data);
        const paginated = res as unknown as PaginatedResponse<ActivityLog>;
        if (paginated.meta) {
          setMeta({
            total: paginated.meta.total,
            lastPage: paginated.meta.lastPage,
          });
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      toast.error(error.message || "Gagal memuat log audit aktivitas");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, actionFilter, entityFilter, search, dateFrom, dateTo]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleOpenInspector = (log: ActivityLog) => {
    setSelectedLog(log);
    setDialogOpen(true);
  };

  // Export handlers
  const handleExport = async (format: "csv" | "json" | "excel") => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== "all") params.set("action", actionFilter);
      if (entityFilter !== "all") params.set("entity", entityFilter);
      if (search.trim()) params.set("search", search.trim());
      if (dateFrom) params.set("dateFrom", dateFrom);
      if (dateTo) params.set("dateTo", dateTo);

      const res = await apiClient.get<ActivityLog[]>(
        `/api/admin/activity-logs/export?${params.toString()}`,
      );
      const data = res.data || logs;

      if (format === "json") {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        downloadBlob(blob, `activity-logs-${Date.now()}.json`);
        toast.success(`Export JSON (${data.length} logs) berhasil diunduh`);
      } else if (format === "csv" || format === "excel") {
        const headers = [
          "Timestamp",
          "Action",
          "Entity",
          "Entity ID",
          "User",
          "IP Address",
          "Payload",
        ];
        const rows = data.map((l) => [
          l.createdAt,
          l.action,
          l.entity,
          l.entityId || "",
          l.user?.name || l.userId || "System",
          l.ipAddress || "",
          JSON.stringify(l.payload || {}).replace(/"/g, '""'),
        ]);

        const csvContent =
          "\uFEFF" +
          [
            headers.join(","),
            ...rows.map((r) => r.map((cell) => `"${cell}"`).join(",")),
          ].join("\n");

        const mimeType =
          format === "excel"
            ? "application/vnd.ms-excel;charset=utf-8;"
            : "text/csv;charset=utf-8;";
        const ext = format === "excel" ? "xls" : "csv";

        const blob = new Blob([csvContent], { type: mimeType });
        downloadBlob(blob, `activity-logs-${Date.now()}.${ext}`);
        toast.success(
          `Export ${format.toUpperCase()} (${data.length} baris) berhasil diunduh`,
        );
      }
    } catch {
      toast.error("Gagal mengekspor log aktivitas");
    } finally {
      setIsExporting(false);
    }
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderActionBadge = (action: ActivityAction) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[11px] font-semibold">
            <PlusCircle className="w-3 h-3 mr-1" /> CREATE
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-[11px] font-semibold">
            <Edit3 className="w-3 h-3 mr-1" /> UPDATE
          </Badge>
        );
      case "delete":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-[11px] font-semibold">
            <Trash2 className="w-3 h-3 mr-1" /> DELETE
          </Badge>
        );
      case "login":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-[11px] font-semibold">
            <LogIn className="w-3 h-3 mr-1" /> LOGIN
          </Badge>
        );
      case "logout":
        return (
          <Badge className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30 text-[11px] font-semibold">
            <LogOut className="w-3 h-3 mr-1" /> LOGOUT
          </Badge>
        );
      case "setting_change":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-[11px] font-semibold">
            <Sliders className="w-3 h-3 mr-1" /> SETTING
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[11px] font-mono">
            {action}
          </Badge>
        );
    }
  };

  const formatDateShort = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return new Intl.DateTimeFormat("id-ID", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const contentMutationsCount = useMemo(() => {
    const creates = stats.byAction?.create || 0;
    const updates = stats.byAction?.update || 0;
    const deletes = stats.byAction?.delete || 0;
    return creates + updates + deletes;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shadow-2xs">
              <ScrollText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                Activity Logs & Audit Trail
              </h1>
              <p className="text-xs text-muted-foreground">
                Rekaman komprehensif seluruh aktivitas pengguna, perubahan data
                CMS, dan autentikasi sistem.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              fetchStats();
              fetchLogs();
            }}
            disabled={isLoading}
            className="text-xs h-9"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                disabled={isExporting || logs.length === 0}
                className="text-xs h-9 bg-primary text-primary-foreground font-semibold shadow-xs"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-1.5" />
                )}
                Ekspor Logs
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={() => handleExport("csv")}
                className="cursor-pointer text-xs"
              >
                <FileText className="w-4 h-4 mr-2 text-emerald-500" />
                Ekspor ke CSV (.csv)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("excel")}
                className="cursor-pointer text-xs"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2 text-green-600" />
                Ekspor ke Excel (.xls)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport("json")}
                className="cursor-pointer text-xs"
              >
                <FileCode className="w-4 h-4 mr-2 text-blue-500" />
                Ekspor ke JSON (.json)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Audit Logs</span>
            <ScrollText className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.total || meta.total}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Seluruh rekaman tersimpan
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Aktivitas Hari Ini</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.today}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Aksi tercatat sejak 00:00
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Mutasi Konten</span>
            <Edit3 className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {contentMutationsCount}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Create, Update & Delete
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-sm space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Perubahan Pengaturan</span>
            <Sliders className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.byAction?.setting_change || 0}
          </p>
          <p className="text-[11px] text-muted-foreground">
            Mutasi konfigurasi sistem
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-3.5 rounded-2xl border border-border bg-card/40 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari entitas, aksi, IP, atau ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-8.5 text-xs bg-muted/30"
            />
          </div>

          {/* Action Filter */}
          <div className="w-44">
            <Combobox
              options={[
                { value: "all", label: "Semua Jenis Aksi" },
                { value: "create", label: "CREATE (Buat Data)" },
                { value: "update", label: "UPDATE (Perbarui Data)" },
                { value: "delete", label: "DELETE (Hapus Data)" },
                { value: "login", label: "LOGIN (Masuk Akun)" },
                { value: "logout", label: "LOGOUT (Keluar)" },
                { value: "setting_change", label: "SETTING CHANGE" },
              ]}
              value={actionFilter}
              onValueChange={(val) => {
                setActionFilter(val || "all");
                setPage(1);
              }}
              placeholder="Jenis Aksi"
              searchPlaceholder="Cari aksi..."
              size="sm"
            />
          </div>

          {/* Entity Filter (Searchable Combobox) */}
          <div className="w-48">
            <Combobox
              options={[
                { value: "all", label: "Semua Target Entitas" },
                { value: "article", label: "Articles / Blog" },
                { value: "project", label: "Projects / Portfolio" },
                { value: "service", label: "Services / Layanan" },
                { value: "tech_stack", label: "Tech Stacks" },
                { value: "philosophy", label: "Philosophies" },
                { value: "site_setting", label: "Site Settings" },
                { value: "inbox", label: "Contact Inboxes" },
                { value: "media", label: "Media Library" },
                { value: "auth", label: "Auth & Session" },
              ]}
              value={entityFilter}
              onValueChange={(val) => {
                setEntityFilter(val || "all");
                setPage(1);
              }}
              placeholder="Target Entitas"
              searchPlaceholder="Cari entitas modul..."
              size="sm"
            />
          </div>

          {/* Date Range Quick Filter */}
          <div className="flex items-center gap-1.5">
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              title="Dari Tanggal"
              className="h-8.5 text-xs bg-muted/30 px-2"
            />
            <span className="text-muted-foreground text-xs">-</span>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              title="Sampai Tanggal"
              className="h-8.5 text-xs bg-muted/30 px-2"
            />
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="rounded-2xl border border-border bg-card/60 overflow-hidden shadow-2xs">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">
              Memuat rekaman log aktivitas...
            </p>
          </div>
        ) : logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground font-semibold border-b border-border">
                <tr>
                  <th className="p-3.5 pl-4">Waktu</th>
                  <th className="p-3.5">User / Operator</th>
                  <th className="p-3.5">Aksi</th>
                  <th className="p-3.5">Target Entitas</th>
                  <th className="p-3.5">Ringkasan Payload</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5 pr-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => {
                  const payloadKeys = log.payload
                    ? Object.keys(log.payload)
                    : [];
                  return (
                    <tr
                      key={log.id}
                      onClick={() => handleOpenInspector(log)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      {/* Timestamp */}
                      <td className="p-3.5 pl-4 text-muted-foreground whitespace-nowrap">
                        {formatDateShort(log.createdAt)}
                      </td>

                      {/* User */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center text-[10px] font-bold text-foreground">
                            {log.user?.name
                              ? log.user.name[0].toUpperCase()
                              : "S"}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground truncate max-w-[120px]">
                              {log.user?.name || "Sistem"}
                            </p>
                            {log.user?.email && (
                              <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">
                                {log.user.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="p-3.5 whitespace-nowrap">
                        {renderActionBadge(log.action)}
                      </td>

                      {/* Entity */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Badge
                            variant="outline"
                            className="text-[11px] font-mono"
                          >
                            {log.entity}
                          </Badge>
                          {log.entityId && (
                            <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[80px]">
                              #{log.entityId.slice(0, 6)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Payload summary */}
                      <td className="p-3.5">
                        {payloadKeys.length > 0 ? (
                          <div className="flex items-center gap-1 flex-wrap max-w-xs">
                            {payloadKeys.slice(0, 3).map((k) => (
                              <span
                                key={k}
                                className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono text-muted-foreground"
                              >
                                {k}
                              </span>
                            ))}
                            {payloadKeys.length > 3 && (
                              <span className="text-[10px] text-muted-foreground font-mono">
                                +{payloadKeys.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[11px]">
                            -
                          </span>
                        )}
                      </td>

                      {/* IP Address */}
                      <td className="p-3.5 font-mono text-muted-foreground whitespace-nowrap">
                        {log.ipAddress || "-"}
                      </td>

                      {/* Action Button */}
                      <td className="p-3.5 pr-4 text-right whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenInspector(log);
                          }}
                          className="h-7 text-xs px-2 text-primary hover:text-primary gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          Inspeksi
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 mx-auto flex items-center justify-center text-muted-foreground">
              <ScrollText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {search || actionFilter !== "all" || entityFilter !== "all"
                  ? "Tidak ada log aktivitas yang cocok dengan filter"
                  : "Belum Ada Log Aktivitas Terdaftar"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {search || actionFilter !== "all" || entityFilter !== "all"
                  ? "Coba ubah kata kunci pencarian atau sesuaikan rentang filter di atas."
                  : "Setiap aksi admin dan perubahan data akan tercatat secara otomatis di sini."}
              </p>
            </div>
          </div>
        )}

        {/* Pagination Footer */}
        {meta.lastPage > 1 && (
          <div className="p-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground bg-card/40">
            <span>
              Halaman {page} dari {meta.lastPage} (Total {meta.total} rekaman
              audit)
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page >= meta.lastPage || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Diff Inspector Modal */}
      <ActivityLogDiffDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        log={selectedLog}
      />
    </div>
  );
}
