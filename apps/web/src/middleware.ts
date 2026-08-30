import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static assets, internal Next.js paths, and images
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s fast timeout

    const res = await fetch(`${apiUrl.replace(/\/$/, "")}/api/v1/settings`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      const maintenance = json.data?.maintenance;
      const isMaintenanceActive = Boolean(
        maintenance?.isActive ?? maintenance?.enabled ?? false,
      );

      // If maintenance is ACTIVE and user is not on /maintenance -> redirect to /maintenance
      if (isMaintenanceActive && pathname !== "/maintenance") {
        const maintenanceUrl = new URL("/maintenance", request.url);
        return NextResponse.redirect(maintenanceUrl);
      }

      // If maintenance is INACTIVE and user tries to visit /maintenance -> redirect to /
      if (!isMaintenanceActive && pathname === "/maintenance") {
        const homeUrl = new URL("/", request.url);
        return NextResponse.redirect(homeUrl);
      }
    }
  } catch (err) {
    // If backend is unreachable or timeout occurs, gracefully allow request to continue
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
