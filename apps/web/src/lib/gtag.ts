/**
 * Google Analytics (GA4) & SEO Utility Functions
 */

export interface GtagEventParams {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

// Extend global window object for TypeScript safety
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetIdOrEventName: string | Date,
      params?: Record<string, unknown> | unknown,
    ) => void;
  }
}

/**
 * Sanitize Google Search Console verification token.
 * Handles cases where user inputs full meta tag (e.g. <meta name="google-site-verification" content="XYZ" />)
 * or prefixes like 'google-site-verification=XYZ'.
 */
export function sanitizeGscToken(token?: string | null): string | undefined {
  if (!token) return undefined;
  let clean = token.trim();

  // If full meta tag is pasted: extract content="..."
  const metaMatch = clean.match(/content=["']([^"']+)["']/i);
  if (metaMatch && metaMatch[1]) {
    return metaMatch[1].trim();
  }

  // If prefix "google-site-verification=" is pasted:
  if (clean.toLowerCase().startsWith("google-site-verification=")) {
    clean = clean.substring("google-site-verification=".length);
  }

  // Strip wrapping quotes if any
  clean = clean.replace(/^["']|["']$/g, "").trim();

  return clean.length > 0 ? clean : undefined;
}

/**
 * Resolves the Google Analytics Measurement ID with priority:
 * 1. CMS Settings (settings.seo.googleAnalyticsId)
 * 2. Environment Variable (NEXT_PUBLIC_GA_MEASUREMENT_ID)
 */
export function resolveGaMeasurementId(
  cmsGaId?: string | null,
): string | undefined {
  const id =
    cmsGaId?.trim() || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id && id.length > 0 ? id : undefined;
}

/**
 * Resolves the Google Search Console Verification Token with priority:
 * 1. CMS Settings (settings.seo.googleSiteVerification)
 * 2. Environment Variable (NEXT_PUBLIC_GSC_VERIFICATION_CODE)
 */
export function resolveGscVerificationToken(
  cmsGscToken?: string | null,
): string | undefined {
  const rawToken =
    cmsGscToken?.trim() ||
    process.env.NEXT_PUBLIC_GSC_VERIFICATION_CODE?.trim();
  return sanitizeGscToken(rawToken);
}

/**
 * Track custom event in GA4
 */
export function trackEvent({
  action,
  category,
  label,
  value,
  ...rest
}: GtagEventParams) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
    ...rest,
  });
}
