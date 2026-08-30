import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Sesi tidak ditemukan atau telah berakhir.",
        },
        { status: 401 },
      );
    }

    const backendRes = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Sesi tidak valid.",
        },
        { status: 401 },
      );
      // Hapus cookie kadaluarsa
      response.cookies.set("admin_token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
      });
      return response;
    }

    return NextResponse.json({
      success: true,
      data: {
        user: data.data.user || data.data,
        token,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Gagal memverifikasi sesi.",
      },
      { status: 500 },
    );
  }
}
