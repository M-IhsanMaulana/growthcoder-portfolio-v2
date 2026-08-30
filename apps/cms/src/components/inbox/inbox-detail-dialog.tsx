"use client";

import React from "react";
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
  Mail,
  User,
  Calendar,
  DollarSign,
  Briefcase,
  Globe,
  Reply,
  Archive,
  CheckCircle2,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import type { ContactInbox, InboxStatus } from "@growthcoder/types";

interface InboxDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inbox: ContactInbox | null;
  onOpenReply: (inbox: ContactInbox) => void;
  onUpdateStatus: (inbox: ContactInbox, status: InboxStatus) => void;
}

export function InboxDetailDialog({
  open,
  onOpenChange,
  inbox,
  onOpenReply,
  onUpdateStatus,
}: InboxDetailDialogProps) {
  if (!inbox) return null;

  const getStatusBadge = (status: InboxStatus) => {
    switch (status) {
      case "unread":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
            <Clock className="w-3 h-3 mr-1" /> Belum Dibaca
          </Badge>
        );
      case "read":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Sudah Dibaca
          </Badge>
        );
      case "replied":
        return (
          <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 text-xs">
            <Reply className="w-3 h-3 mr-1" /> Telah Dibalas
          </Badge>
        );
      case "archived":
        return (
          <Badge className="bg-muted text-muted-foreground border-border text-xs">
            <Archive className="w-3 h-3 mr-1" /> Diarsipkan
          </Badge>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/70 shrink-0 bg-background/95 backdrop-blur-xs text-left">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xs shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left space-y-0.5">
                <DialogTitle className="text-lg font-bold text-foreground text-left">
                  Detail Pesan Masuk
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground text-left">
                  Diterima pada {formatDate(inbox.createdAt)}
                </DialogDescription>
              </div>
            </div>
            {getStatusBadge(inbox.status)}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Sender Profile Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 p-4 rounded-xl border border-border bg-card/60">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Pengirim
              </span>
              <p className="text-sm font-bold text-foreground">{inbox.name}</p>
              <a
                href={`mailto:${inbox.email}`}
                className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
              >
                <Mail className="w-3.5 h-3.5" /> {inbox.email}
              </a>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Kategori & Budget
              </span>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                {inbox.projectCategory ? (
                  <Badge variant="outline" className="text-[11px] font-medium">
                    {inbox.projectCategory}
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">-</span>
                )}
                {inbox.budgetRange && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium">
                    <DollarSign className="w-3 h-3 mr-0.5" />{" "}
                    {inbox.budgetRange}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Subject & Message Content */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Subjek:
            </span>
            <h3 className="text-sm font-bold text-foreground">
              {inbox.subject || "(Tanpa Subjek)"}
            </h3>

            <div className="p-4 rounded-xl border border-border bg-muted/30 text-xs sm:text-sm text-foreground leading-relaxed whitespace-pre-wrap font-normal select-text">
              {inbox.message}
            </div>
          </div>

          {/* Reply History / Notes if exists */}
          {inbox.replyNotes && (
            <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Reply className="w-3.5 h-3.5" /> Catatan Balasan Admin:
                </span>
                {inbox.repliedAt && <span>{formatDate(inbox.repliedAt)}</span>}
              </div>
              <p className="text-xs text-foreground/90 whitespace-pre-wrap leading-relaxed">
                {inbox.replyNotes}
              </p>
            </div>
          )}

          {/* Technical Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-3 border-t border-border/70">
            {inbox.ipAddress && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" /> IP: {inbox.ipAddress}
              </span>
            )}
            {inbox.userAgent && (
              <span className="truncate max-w-xs" title={inbox.userAgent}>
                Browser: {inbox.userAgent}
              </span>
            )}
          </div>
        </div>

        <DialogFooter className="p-4 px-6 border-t border-border/70 shrink-0 bg-muted/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {inbox.status !== "archived" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(inbox, "archived")}
                className="text-xs h-9 px-3"
              >
                <Archive className="w-3.5 h-3.5 mr-1" />
                Arsipkan
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateStatus(inbox, "read")}
                className="text-xs h-9 px-3"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Batal Arsip
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-9 px-4"
            >
              Tutup
            </Button>

            <Button
              onClick={() => {
                onOpenChange(false);
                onOpenReply(inbox);
              }}
              size="sm"
              className="text-xs h-9 px-4 bg-primary text-primary-foreground font-semibold shadow-xs hover:bg-primary/90"
            >
              <Send className="w-3.5 h-3.5 mr-1.5" />
              Balas Pesan
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
