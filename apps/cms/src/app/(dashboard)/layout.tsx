"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { RealtimeNotificationProvider } from "@/components/providers/realtime-notification-provider";
import type { DashboardStats } from "@growthcoder/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Query unread inboxes count to show in sidebar & topbar badges
  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiClient.get<DashboardStats>("/api/admin/dashboard");
      return res.data;
    },
    refetchInterval: 30_000, // Poll every 30s
  });

  const unreadCount = dashboardData?.unreadInboxes || 0;

  return (
    <RealtimeNotificationProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-row transition-colors">
        {/* Collapsible Sidebar */}
        <Sidebar
          unreadInboxCount={unreadCount}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={() => setIsMobileSidebarOpen(false)}
          isCollapsed={isCollapsed}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            onMobileMenuToggle={() =>
              setIsMobileSidebarOpen(!isMobileSidebarOpen)
            }
            unreadCount={unreadCount}
            isCollapsed={isCollapsed}
            onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
          />
          <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1920px] w-full mx-auto space-y-8 animate-in fade-in-50 duration-300">
            {children}
          </main>
        </div>
      </div>
    </RealtimeNotificationProvider>
  );
}
