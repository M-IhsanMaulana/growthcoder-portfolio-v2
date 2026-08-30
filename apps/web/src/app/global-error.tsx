"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@growthcoder/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("[Web App Global Error]:", error);

    try {
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          digest: error.digest || "N/A",
          message: error.message || "Global layout error",
          pathname:
            typeof window !== "undefined" ? window.location.pathname : "/",
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "",
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    } catch {
      // Ignore
    }
  }, [error]);

  return (
    <html lang="id" className="dark">
      <body className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <div className="relative w-full max-w-xl text-center z-10">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
            <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-inner">
              <AlertTriangle className="h-10 w-10 text-rose-500 animate-pulse" />
            </div>

            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-rose-500/10 text-rose-400 border border-rose-500/30 mb-4">
              Fatal Error &bull; 500
            </span>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              Terjadi Kesalahan Sistem
            </h1>

            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Terjadi kendala kritis pada sistem. Tim pengembang telah menerima
              notifikasi insiden ini secara otomatis.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                onClick={() => reset()}
                className="rounded-full gap-2 px-6 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Coba Muat Ulang</span>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full gap-2 px-6 border-slate-700 text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                <Link href="/">
                  <Home className="h-4 w-4" />
                  <span>Ke Beranda</span>
                </Link>
              </Button>
            </div>
          </div>

          <p className="mt-8 text-xs text-slate-500">
            &copy; {new Date().getFullYear()} GrowthCoder. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  );
}
