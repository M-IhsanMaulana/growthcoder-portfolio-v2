"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({
  position = "top-center",
  closeButton = true,
  ...props
}: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position={position}
      closeButton={closeButton}
      className="toaster group"
      icons={{
        success: (
          <CheckCircle2 className="size-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
        ),
        info: (
          <Info className="size-4 text-sky-500 dark:text-sky-400 shrink-0" />
        ),
        warning: (
          <AlertTriangle className="size-4 text-amber-500 dark:text-amber-400 shrink-0" />
        ),
        error: (
          <AlertCircle className="size-4 text-rose-500 dark:text-rose-400 shrink-0" />
        ),
        loading: (
          <Loader2 className="size-4 text-primary animate-spin shrink-0" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card/95 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-card-foreground group-[.toaster]:border-border/70 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-black/10 dark:group-[.toaster]:shadow-black/40 group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:border group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-3 group-[.toaster]:transition-all group-[.toaster]:text-sm group-[.toaster]:font-medium",
          title:
            "group-[.toast]:font-semibold group-[.toast]:text-sm group-[.toast]:tracking-tight",
          description:
            "group-[.toast]:text-xs group-[.toast]:text-muted-foreground group-[.toast]:mt-0.5 leading-relaxed",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:transition-colors group-[.toast]:hover:bg-primary/90 group-[.toast]:shadow-sm",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:text-xs group-[.toast]:font-medium group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:rounded-lg group-[.toast]:transition-colors group-[.toast]:hover:bg-muted/80",
          closeButton:
            "group-[.toast]:border-border/60 group-[.toast]:bg-background/80 group-[.toast]:text-muted-foreground hover:group-[.toast]:text-foreground group-[.toast]:hover:bg-accent group-[.toast]:rounded-full group-[.toast]:transition-colors",
          success:
            "group-[.toaster]:!bg-emerald-500/10 group-[.toaster]:!border-emerald-500/30 group-[.toaster]:!text-emerald-950 dark:group-[.toaster]:!text-emerald-200 dark:group-[.toaster]:!bg-emerald-950/40 dark:group-[.toaster]:!border-emerald-500/30",
          warning:
            "group-[.toaster]:!bg-amber-500/10 group-[.toaster]:!border-amber-500/30 group-[.toaster]:!text-amber-950 dark:group-[.toaster]:!text-amber-200 dark:group-[.toaster]:!bg-amber-950/40 dark:group-[.toaster]:!border-amber-500/30",
          error:
            "group-[.toaster]:!bg-rose-500/10 group-[.toaster]:!border-rose-500/30 group-[.toaster]:!text-rose-950 dark:group-[.toaster]:!text-rose-200 dark:group-[.toaster]:!bg-rose-950/40 dark:group-[.toaster]:!border-rose-500/30",
          info: "group-[.toaster]:!bg-sky-500/10 group-[.toaster]:!border-sky-500/30 group-[.toaster]:!text-sky-950 dark:group-[.toaster]:!text-sky-200 dark:group-[.toaster]:!bg-sky-950/40 dark:group-[.toaster]:!border-sky-500/30",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
