import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, directToken, user: directUser } = body;

    // 1. If directToken and directUser are provided (e.g. from successful Passkey login)
    if (directToken && directUser) {
      const response = NextResponse.json({
        success: true,
        data: {
          user: directUser,
          token: directToken,
        },
      });

      response.cookies.set("admin_token", directToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      return response;
    }

    // 2. Standard Email/Password login ke AdonisJS
    const backendRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            data.message || "Login gagal. Periksa kembali email dan password.",
          errors: data.errors,
        },
        { status: backendRes.status || 400 },
      );
    }

    const token = data.data.token?.token || data.data.token;
    const user = data.data.user;

    const response = NextResponse.json({
      success: true,
      data: {
        user,
        token,
      },
    });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan pada server login.",
      },
      { status: 500 },
    );
  }
}
