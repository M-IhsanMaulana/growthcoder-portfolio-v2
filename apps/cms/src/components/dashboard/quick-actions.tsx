"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
} from "@growthcoder/ui";
import {
  PlusCircle,
  FolderPlus,
  Image as ImageIcon,
  Power,
  Loader2,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@growthcoder/ui";

interface QuickActionsProps {
  isMaintenanceActive?: boolean;
}

export function QuickActions({
  isMaintenanceActive = false,
}: QuickActionsProps) {
  const queryClient = useQueryClient();
  const [maintenance, setMaintenance] = useState(isMaintenanceActive);

  const mutation = useMutation({
    mutationFn: async (newStatus: boolean) => {
      const res = await apiClient.put("/api/admin/settings/single", {
        key: "maintenance",
        value: {
          isActive: newStatus,
          headline: "Sistem Sedang Dalam Pemeliharaan Berkala",
          message:
            "Kami sedang melakukan peningkatan performa dan update modul sistem.",
        },
      });
      return res;
    },
    onSuccess: (_, newStatus) => {
      setMaintenance(newStatus);
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      if (newStatus) {
        toast.warning("Mode Pemeliharaan (Maintenance) DIAKTIFKAN!");
      } else {
        toast.success(
          "Mode Pemeliharaan DINONAKTIFKAN. Web publik kembali live!",
        );
      }
    },
    onError: (error: Error) => {
      toast.error(`Gagal mengubah status maintenance: ${error.message}`);
    },
  });

  const handleToggleMaintenance = () => {
    const nextStatus = !maintenance;
    mutation.mutate(nextStatus);
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <CardTitle className="text-base font-heading font-semibold text-foreground">
            Aksi Cepat & Kontrol Darurat
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Pintasan pembuatan konten dan kendali status sistem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/articles" className="w-full">
            <Button
              variant="outline"
              className="w-full justify-start gap-2.5 h-11 border-border bg-background hover:bg-muted text-foreground text-xs font-medium cursor-pointer shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-emerald-500" />
              <span>Tulis Artikel Baru</span>
            </Button>
          </Link>

          <Link href="/projects" className="w-full">
            <Button
              variant="outline"
              className="w-full justify-start gap-2.5 h-11 border-border bg-background hover:bg-muted text-foreground text-xs font-medium cursor-pointer shadow-sm"
            >
              <FolderPlus className="w-4 h-4 text-sky-500" />
              <span>Tambah Proyek Baru</span>
            </Button>
          </Link>

          <Link href="/media" className="w-full">
            <Button
              variant="outline"
              className="w-full justify-start gap-2.5 h-11 border-border bg-background hover:bg-muted text-foreground text-xs font-medium cursor-pointer shadow-sm"
            >
              <ImageIcon className="w-4 h-4 text-teal-500" />
              <span>Upload Media Aset</span>
            </Button>
          </Link>
        </div>

        {/* Maintenance Mode Emergency Card */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                maintenance
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              }`}
            >
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">
                  Status Web Publik
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    maintenance
                      ? "bg-destructive/20 text-destructive border border-destructive/30"
                      : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                  }`}
                >
                  {maintenance ? "Maintenance Mode" : "Online / Live"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {maintenance
                  ? "Pengunjung diarahkan otomatis ke halaman pemeliharaan"
                  : "Seluruh halaman web publik dapat diakses normal"}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant={maintenance ? "destructive" : "outline"}
            onClick={handleToggleMaintenance}
            disabled={mutation.isPending}
            className={`gap-2 text-xs font-medium cursor-pointer shrink-0 ${
              !maintenance &&
              "border-border bg-background hover:bg-muted text-foreground"
            }`}
          >
            {mutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Power className="w-3.5 h-3.5" />
            )}
            <span>
              {maintenance ? "Matikan Maintenance" : "Aktifkan Maintenance"}
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
