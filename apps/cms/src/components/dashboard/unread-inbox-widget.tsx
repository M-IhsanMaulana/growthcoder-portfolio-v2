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
import { Inbox, Mail, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import type { ContactInbox } from "@growthcoder/types";

interface UnreadInboxWidgetProps {
  inboxes?: ContactInbox[];
  unreadCount?: number;
  isLoading?: boolean;
}

export function UnreadInboxWidget({
  inboxes,
  unreadCount = 0,
  isLoading,
}: UnreadInboxWidgetProps) {
  if (isLoading) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <div className="h-5 w-40 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-lg bg-muted/40 animate-pulse"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  const items = inboxes || [];

  return (
    <Card className="border-border bg-card shadow-sm flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-amber-500" />
            <CardTitle className="text-base font-heading font-semibold text-foreground">
              Pesan Kontak Terbaru
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} pesan belum dibaca membutuhkan perhatian`
              : "Semua pesan masuk telah ditanggapi"}
          </CardDescription>
        </div>
        <Link
          href="/inbox"
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
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-xs font-medium text-foreground">
              Belum ada pesan kontak masuk.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Pesan dari formulir publik akan tampil di sini.
            </p>
          </div>
        ) : (
          items.map((inbox) => {
            const isUnread = inbox.status === "unread";
            const formattedDate = new Date(inbox.createdAt).toLocaleDateString(
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
                key={inbox.id}
                className={`p-3 rounded-lg border transition-all duration-150 flex flex-col space-y-1.5 ${
                  isUnread
                    ? "bg-amber-500/10 border-amber-500/30"
                    : "bg-muted/30 border-border hover:border-muted-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-xs text-foreground truncate">
                      {inbox.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      &lt;{inbox.email}&gt;
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formattedDate}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-foreground/90 font-medium truncate flex-1">
                    {inbox.subject}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {inbox.budgetRange && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                        {inbox.budgetRange}
                      </span>
                    )}
                    <a
                      href={`mailto:${inbox.email}?subject=Re: ${encodeURIComponent(inbox.subject || "")}`}
                      className="p-1 rounded bg-muted hover:bg-emerald-600 hover:text-white text-muted-foreground transition-colors cursor-pointer"
                      title="Balas via Email"
                    >
                      <Mail className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground line-clamp-1 italic">
                  &quot;{inbox.message}&quot;
                </p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
