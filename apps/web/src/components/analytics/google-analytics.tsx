import Script from "next/script";

interface GoogleAnalyticsProps {
  gaId?: string;
  /**
   * By default, analytics only runs in production to avoid polluting stats with local testing.
   * Can be overridden by NEXT_PUBLIC_GA_FORCE_DEV="true".
   */
  forceEnable?: boolean;
}

export function GoogleAnalytics({
  gaId,
  forceEnable = false,
}: GoogleAnalyticsProps) {
  const isProduction = process.env.NODE_ENV === "production";
  const shouldEnable = Boolean(
    gaId &&
    (isProduction ||
      forceEnable ||
      process.env.NEXT_PUBLIC_GA_FORCE_DEV === "true"),
  );

  if (!shouldEnable || !gaId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}
