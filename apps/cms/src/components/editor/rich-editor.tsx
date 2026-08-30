"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Dynamically import the CKEditor custom component with SSR disabled
const CKEditorCustomDynamic = dynamic(
  () => import("./ckeditor-custom").then((mod) => mod.CKEditorCustom),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] w-full flex-col items-center justify-center rounded-2xl border border-border bg-card/60 p-6 text-center animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500 mb-2" />
        <p className="text-xs font-medium text-foreground">
          Memuat CKEditor 5 Studio...
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">
          Menyiapkan toolbar rich developer dan upload adapter
        </p>
      </div>
    ),
  },
);

export function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  return (
    <div className="w-full">
      <CKEditorCustomDynamic
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}
