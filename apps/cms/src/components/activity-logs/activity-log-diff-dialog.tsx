"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
  Badge,
} from "@growthcoder/ui";
import {
  ScrollText,
  User,
  Clock,
  Globe,
  Database,
  Code,
  Copy,
  Check,
  PlusCircle,
  Edit3,
  Trash2,
  LogIn,
  LogOut,
  Sliders,
} from "lucide-react";
import type { ActivityLog, ActivityAction } from "@growthcoder/types";
import { toast } from "sonner";

interface ActivityLogDiffDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  log: ActivityLog | null;
}

export function ActivityLogDiffDialog({
  open,
  onOpenChange,
  log,
}: ActivityLogDiffDialogProps) {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<"formatted" | "raw">("formatted");

  if (!log) return null;

  const getActionBadge = (action: ActivityAction) => {
    switch (action) {
      case "create":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs font-semibold">
            <PlusCircle className="w-3 h-3 mr-1" /> CREATE
          </Badge>
        );
      case "update":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs font-semibold">
            <Edit3 className="w-3 h-3 mr-1" /> UPDATE
          </Badge>
        );
      case "delete":
        return (
          <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-semibold">
            <Trash2 className="w-3 h-3 mr-1" /> DELETE
          </Badge>
        );
      case "login":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs font-semibold">
            <LogIn className="w-3 h-3 mr-1" /> LOGIN
          </Badge>
        );
      case "logout":
        return (
          <Badge className="bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/30 text-xs font-semibold">
            <LogOut className="w-3 h-3 mr-1" /> LOGOUT
          </Badge>
        );
      case "setting_change":
        return (
          <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
            <Sliders className="w-3 h-3 mr-1" /> SETTING CHANGE
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs font-mono">
            {action}
          </Badge>
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

  const handleCopyJson = () => {
    if (!log.payload) return;
    navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2));
    setCopied(true);
    toast.success("Payload JSON disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const payloadEntries = log.payload ? Object.entries(log.payload) : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
                <ScrollText className="w-5 h-5" />
              </div>
              <div className="text-left space-y-0.5">
                <DialogTitle className="text-lg font-bold text-foreground text-left">
                  Audit Trail Inspector
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-1.5 text-left">
                  <Clock className="w-3.5 h-3.5" /> {formatDate(log.createdAt)}
                </DialogDescription>
              </div>
            </div>
            {getActionBadge(log.action)}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Metadata Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl border border-border bg-card/60 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" /> User / Operator
              </span>
              <p className="font-semibold text-foreground">
                {log.user?.name ||
                  (log.userId
                    ? `User ID: ${log.userId.slice(0, 8)}...`
                    : "Sistem / Anonim")}
              </p>
              {log.user?.email && (
                <p className="text-muted-foreground text-[11px]">
                  {log.user.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Database className="w-3 h-3" /> Target Entitas
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant="outline" className="text-xs font-mono">
                  {log.entity}
                </Badge>
                {log.entityId && (
                  <span
                    className="text-[11px] font-mono text-muted-foreground truncate max-w-[120px]"
                    title={log.entityId}
                  >
                    #{log.entityId.slice(0, 8)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Client Network Info */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground px-1">
            {log.ipAddress && (
              <span className="flex items-center gap-1 font-mono">
                <Globe className="w-3.5 h-3.5" /> IP: {log.ipAddress}
              </span>
            )}
            {log.userAgent && (
              <span className="truncate max-w-sm" title={log.userAgent}>
                UA: {log.userAgent}
              </span>
            )}
          </div>

          {/* JSONB Payload Diff / Inspector */}
          <div className="space-y-2.5 pt-3 border-t border-border/70">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-primary" />
                Payload Snapshot & Mutasi Data:
              </span>

              <div className="flex items-center gap-1">
                <Button
                  variant={viewMode === "formatted" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("formatted")}
                  className="text-[11px] h-7 px-2"
                >
                  Tabel Field
                </Button>
                <Button
                  variant={viewMode === "raw" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("raw")}
                  className="text-[11px] h-7 px-2"
                >
                  Raw JSON
                </Button>
                {log.payload && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyJson}
                    className="text-[11px] h-7 px-2 text-muted-foreground hover:text-foreground"
                    title="Salin JSON"
                  >
                    {copied ? (
                      <Check className="w-3 h-3 text-emerald-500 mr-1" />
                    ) : (
                      <Copy className="w-3 h-3 mr-1" />
                    )}
                    Salin
                  </Button>
                )}
              </div>
            </div>

            {log.payload ? (
              viewMode === "formatted" ? (
                <div className="rounded-xl border border-border overflow-hidden text-xs">
                  <table className="w-full text-left divide-y divide-border">
                    <thead className="bg-muted/50 text-muted-foreground font-semibold">
                      <tr>
                        <th className="p-3 w-1/3">Key / Field</th>
                        <th className="p-3">Value Snapshot</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card/40">
                      {payloadEntries.map(([key, value]) => (
                        <tr key={key} className="hover:bg-muted/20">
                          <td className="p-3 font-mono font-medium text-foreground align-top">
                            {key}
                          </td>
                          <td className="p-3 font-mono text-muted-foreground break-all align-top">
                            {typeof value === "object" && value !== null ? (
                              <pre className="text-[11px] whitespace-pre-wrap font-mono p-2 bg-muted/40 rounded-lg custom-scrollbar">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              String(value)
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl border border-border bg-zinc-950 text-zinc-100 font-mono text-xs overflow-x-auto max-h-64 custom-scrollbar">
                  <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              )
            ) : (
              <div className="p-6 text-center rounded-xl border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
                Tidak ada payload data tersimpan pada aktivitas ini.
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 px-6 border-t border-border/70 shrink-0 bg-muted/30 flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9 px-4"
          >
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
