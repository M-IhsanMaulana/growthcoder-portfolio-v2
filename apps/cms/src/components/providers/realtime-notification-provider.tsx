"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getTransmitClient } from "@/lib/transmit";
import { playNotificationChime } from "@/lib/sound";
import type { ContactInbox } from "@growthcoder/types";

export function RealtimeNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    let isSubscribed = true;
    const transmit = getTransmitClient();
    let subscription: ReturnType<typeof transmit.subscription> | null = null;

    async function initSubscription() {
      try {
        subscription = transmit.subscription("inbox/new");
        await subscription.create();

        subscription.onMessage((data: unknown) => {
          if (!isSubscribed) return;

          const inbox = data as ContactInbox;
          // Play audio notification
          playNotificationChime();

          // Trigger Sonner notification with actionable CTA
          toast(
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Pesan Masuk Baru!
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {inbox.name}
                </span>
              </div>
              <p className="text-xs font-semibold text-foreground truncate">
                {inbox.subject || "Pertanyaan Proyek Baru"}
              </p>
              <p className="text-[11px] text-muted-foreground line-clamp-2">
                {inbox.message}
              </p>
            </div>,
            {
              duration: 8000,
              action: {
                label: "Buka Inbox",
                onClick: () => router.push("/inbox"),
              },
            },
          );

          // Invalidate queries so unread counters & table refresh instantly
          queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
          queryClient.invalidateQueries({ queryKey: ["admin-inboxes"] });
          queryClient.invalidateQueries({ queryKey: ["inbox"] });

          // Dispatch window event for open inbox page
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("growthcoder:new-inbox", { detail: inbox }),
            );
          }
        });
      } catch (err) {
        console.warn("Realtime Transmit subscription notice:", err);
      }
    }

    initSubscription();

    return () => {
      isSubscribed = false;
      if (subscription) {
        subscription.delete().catch(() => {});
      }
    };
  }, [queryClient, router]);

  return <>{children}</>;
}
