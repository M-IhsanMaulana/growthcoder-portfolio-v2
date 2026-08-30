"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  sizeVariant?: "sm" | "default" | "lg";
  error?: boolean | string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, sizeVariant = "default", error, ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8.5 text-xs px-2.5 rounded-lg",
      default: "h-10 text-sm px-3 rounded-xl",
      lg: "h-11 text-base px-3.5 rounded-xl",
    };

    const hasError = Boolean(error);
    const isDateType =
      type === "date" ||
      type === "datetime-local" ||
      type === "month" ||
      type === "time";

    return (
      <input
        type={type}
        aria-invalid={hasError ? "true" : undefined}
        className={cn(
          "flex w-full border border-input bg-background font-normal text-foreground shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50",
          isDateType &&
            "relative cursor-pointer [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 hover:[&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-datetime-edit]:w-full [&::-webkit-datetime-edit]:pr-6 dark:[&::-webkit-calendar-picker-indicator]:invert",
          hasError &&
            "border-destructive text-destructive placeholder:text-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20",
          sizeClasses[sizeVariant],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
