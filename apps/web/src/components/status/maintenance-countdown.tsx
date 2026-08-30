"use client";

import * as React from "react";
import { Clock } from "lucide-react";

interface MaintenanceCountdownProps {
  targetDate: string;
}

export function MaintenanceCountdown({
  targetDate,
}: MaintenanceCountdownProps) {
  const [timeLeft, setTimeLeft] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  React.useEffect(() => {
    const target = new Date(targetDate).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPassed: false,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft.isPassed) {
    return (
      <div className="flex items-center justify-center gap-2 text-xs font-medium text-emerald-500 bg-emerald-500/10 rounded-2xl py-3 px-5 mb-8 border border-emerald-500/30">
        <Clock className="h-4 w-4 text-emerald-500 animate-pulse" />
        <span>
          Pemeliharaan sedang dalam tahap finalisasi &amp; verifikasi akhir
          sistem.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3 bg-muted/40 rounded-2xl p-4 mb-8 border border-border/40">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Clock className="h-3.5 w-3.5 text-primary" />
        <span>Estimasi Waktu Tersisa:</span>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center w-full max-w-sm">
        <div className="bg-background/80 rounded-xl p-2 border border-border/40 shadow-xs">
          <span className="block text-xl sm:text-2xl font-bold font-heading text-primary">
            {String(timeLeft.days).padStart(2, "0")}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
            Hari
          </span>
        </div>
        <div className="bg-background/80 rounded-xl p-2 border border-border/40 shadow-xs">
          <span className="block text-xl sm:text-2xl font-bold font-heading text-primary">
            {String(timeLeft.hours).padStart(2, "0")}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
            Jam
          </span>
        </div>
        <div className="bg-background/80 rounded-xl p-2 border border-border/40 shadow-xs">
          <span className="block text-xl sm:text-2xl font-bold font-heading text-primary">
            {String(timeLeft.minutes).padStart(2, "0")}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
            Menit
          </span>
        </div>
        <div className="bg-background/80 rounded-xl p-2 border border-border/40 shadow-xs">
          <span className="block text-xl sm:text-2xl font-bold font-heading text-primary">
            {String(timeLeft.seconds).padStart(2, "0")}
          </span>
          <span className="block text-[10px] uppercase tracking-wider text-muted-foreground">
            Detik
          </span>
        </div>
      </div>
    </div>
  );
}
