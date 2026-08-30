"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { User, LoginResponse } from "@growthcoder/types";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { startAuthentication } from "@simplewebauthn/browser";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithPassword: (
    email: string,
    password: string,
  ) => Promise<LoginResponse>;
  loginWithPasskey: (email?: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          setUser(data.data.user);
          setToken(data.data.token);
          apiClient.setToken(data.data.token);
          return;
        }
      }
      setUser(null);
      setToken(null);
      apiClient.setToken(null);
    } catch {
      setUser(null);
      setToken(null);
      apiClient.setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginWithPassword = async (
    email: string,
    password: string,
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Login gagal. Silakan periksa kredensial Anda.",
        );
      }

      const loggedInUser = data.data.user;
      const authToken = data.data.token;

      setUser(loggedInUser);
      setToken(authToken);
      apiClient.setToken(authToken);

      router.push("/");
      return {
        user: loggedInUser,
        token: { type: "bearer", token: authToken },
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPasskey = async (email?: string): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      // 1. Generate challenge authentication options dari backend AdonisJS
      const optRes = await fetch(
        `${API_BASE_URL}/api/auth/passkey/generate-authentication-options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email?.trim() || undefined }),
        },
      );

      const optData = await optRes.json();
      if (!optRes.ok || !optData.success) {
        throw new Error(
          optData.message || "Gagal menyiapkan autentikasi Passkey.",
        );
      }

      const options = optData.data?.options || optData.data;
      if (!options || !options.challenge) {
        throw new Error(
          "Format challenge autentikasi Passkey tidak valid dari server.",
        );
      }

      // 2. Prompt biometrik pada browser (FaceID, TouchID, Windows Hello)
      let authResponse;
      try {
        authResponse = await startAuthentication({
          optionsJSON: options,
        });
      } catch (browserErr: unknown) {
        const errorName = (browserErr as Error)?.name || "";
        const errorMsg = (browserErr as Error)?.message || "";
        if (
          errorName === "NotAllowedError" ||
          errorMsg.includes("cancelled") ||
          errorMsg.includes("abort")
        ) {
          throw new Error("Autentikasi biometrik dibatalkan oleh pengguna.");
        }
        if (
          errorMsg.includes("allowCredentials") ||
          errorName === "InvalidStateError"
        ) {
          throw new Error(
            "Belum ada Passkey biometrik yang terdaftar pada akun ini. Silakan masuk menggunakan kata sandi terlebih dahulu, lalu daftarkan Passkey di Pengaturan Keamanan.",
          );
        }
        throw new Error(`Sensor biometrik tidak dapat diakses: ${errorMsg}`);
      }

      // 3. Verifikasi response challenge ke backend AdonisJS
      const verifyRes = await fetch(
        `${API_BASE_URL}/api/auth/passkey/verify-authentication`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            response: authResponse,
          }),
        },
      );

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(
          verifyData.message || "Verifikasi Passkey biometrik gagal.",
        );
      }

      const verifiedUser = verifyData.data.user;
      const authToken = verifyData.data.token?.token || verifyData.data.token;

      // 4. Set HTTP-only cookie via Next.js Route Handler
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          directToken: authToken,
          user: verifiedUser,
        }),
      });

      setUser(verifiedUser);
      setToken(authToken);
      apiClient.setToken(authToken);

      router.push("/");
      return {
        user: verifiedUser,
        token: { type: "bearer", token: authToken },
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      setUser(null);
      setToken(null);
      apiClient.setToken(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        loginWithPassword,
        loginWithPasskey,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
