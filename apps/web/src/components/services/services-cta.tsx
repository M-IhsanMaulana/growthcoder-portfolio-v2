"use client";

import React from "react";
import type { SiteProfile } from "@growthcoder/types";
import { LeadCaptureCta } from "@/components/home/lead-capture-cta";

interface ServicesCtaProps {
  profile?: SiteProfile;
  className?: string;
}

export function ServicesCta({ profile, className }: ServicesCtaProps) {
  const fallbackProfile: SiteProfile = profile || {
    siteName: "GrowthCoder",
    ownerName: "Muhammad Ihsan Maulana",
    tagline: "Software Engineer & Full-Stack Architect",
    bio: "",
    email: "contact@growthcoder.id",
    socials: {
      telegram: "https://t.me/growthcoder",
    },
  };

  return <LeadCaptureCta profile={fallbackProfile} className={className} />;
}
