"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string | null;
}

export function FormError({ message, className, ...props }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      className={cn(
        "text-[11px] text-destructive font-medium mt-1.5 flex items-center gap-1.5 animate-in fade-in-50 slide-in-from-top-0.5 duration-200",
        className,
      )}
      role="alert"
      {...props}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-destructive" />
      <span>{message}</span>
    </p>
  );
}

interface FormRequiredMarkProps {
  className?: string;
}

export function FormRequiredMark({ className }: FormRequiredMarkProps) {
  return (
    <span
      className={cn("text-destructive font-bold ml-1 select-none", className)}
      title="Wajib diisi"
      aria-hidden="true"
    >
      *
    </span>
  );
}
