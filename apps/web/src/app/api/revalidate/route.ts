import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret =
      searchParams.get("secret") ||
      request.headers.get("x-revalidate-secret") ||
      request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    const expectedSecret =
      process.env.REVALIDATE_SECRET || "growthcoder-revalidate-secret";

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { success: false, message: "Invalid revalidation secret token" },
        { status: 401 }
      );
    }

    const tag = searchParams.get("tag");
    const path = searchParams.get("path");

    if (tag) {
      // Revalidate all caches associated with this tag in Next.js
      // @ts-ignore Next.js version differences
      revalidateTag(tag, "max");
      return NextResponse.json({
        success: true,
        revalidated: true,
        type: "tag",
        target: tag,
        now: Date.now(),
      });
    }

    if (path) {
      // Revalidate specific page path
      revalidatePath(path, "page");
      return NextResponse.json({
        success: true,
        revalidated: true,
        type: "path",
        target: path,
        now: Date.now(),
      });
    }

    // Default: Purge entire site layout cache across all pages
    revalidatePath("/", "layout");
    return NextResponse.json({
      success: true,
      revalidated: true,
      type: "all",
      target: "/",
      now: Date.now(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to revalidate cache",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return POST(request);
}
