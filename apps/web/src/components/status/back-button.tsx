"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@growthcoder/ui";

interface BackButtonProps {
  label?: string;
  variant?: "outline" | "default" | "secondary" | "ghost";
  className?: string;
}

export function BackButton({
  label = "Kembali ke Halaman Sebelumnya",
  variant = "outline",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleBack}
      className={`rounded-full gap-2 transition-all duration-200 cursor-pointer ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span>{label}</span>
    </Button>
  );
}

export function RefreshButton({
  label = "Cek Status Sistem Ulang",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleRefresh}
      disabled={isRefreshing}
      className={`rounded-full gap-2 transition-all duration-200 cursor-pointer ${className}`}
    >
      <RefreshCw
        className={`h-4 w-4 text-primary ${isRefreshing ? "animate-spin" : ""}`}
      />
      <span>{isRefreshing ? "Memeriksa..." : label}</span>
    </Button>
  );
}
