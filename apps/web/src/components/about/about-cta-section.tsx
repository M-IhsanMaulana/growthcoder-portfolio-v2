import * as React from "react";
import type { SiteProfile } from "@growthcoder/types";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";

interface AboutCtaSectionProps {
  profile: SiteProfile;
  className?: string;
}

export function AboutCtaSection({ profile, className }: AboutCtaSectionProps) {
  return <LeadCaptureCta profile={profile} className={className} />;
}
