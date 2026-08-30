import type { ApiResponse } from "@growthcoder/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

class ApiClient {
  private token: string | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      try {
        this.token = localStorage.getItem("admin_token");
      } catch {
        this.token = null;
      }
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== "undefined") {
      try {
        if (token) {
          localStorage.setItem("admin_token", token);
        } else {
          localStorage.removeItem("admin_token");
        }
      } catch {
        // Ignore localStorage write error
      }
    }
  }

  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      try {
        this.token = localStorage.getItem("admin_token");
      } catch {
        this.token = null;
      }
    }
    return this.token;
  }

  async request<T = unknown>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    const isFormData =
      typeof FormData !== "undefined" && options.body instanceof FormData;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (!isFormData && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    const currentToken = this.getToken();
    if (currentToken && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({
      success: false,
      message: response.statusText || "Gagal memproses respon dari server.",
    }));

    if (!response.ok) {
      const errorMsg =
        data?.message || `HTTP ${response.status}: Request gagal.`;
      const error = new Error(errorMsg) as Error & {
        data?: unknown;
        status?: number;
        usages?: unknown[];
      };
      error.data = data;
      error.status = response.status;
      if (data?.usages) {
        error.usages = data.usages;
      }
      throw error;
    }

    return data as ApiResponse<T>;
  }

  async get<T = unknown>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: "GET", headers });
  }

  async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit,
  ) {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "POST",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async upload<T = unknown>(
    endpoint: string,
    formData: FormData,
    headers?: HeadersInit,
  ) {
    return this.request<T>(endpoint, {
      method: "POST",
      body: formData,
      headers,
    });
  }

  async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit,
  ) {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PUT",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    headers?: HeadersInit,
  ) {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      headers,
    });
  }

  async delete<T = unknown>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: "DELETE", headers });
  }
}

export const apiClient = new ApiClient();

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("blob:") ||
    url.startsWith("data:")
  ) {
    return url;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_URL || apiBase;
  return `${mediaBase.replace(/\/$/, "")}${url.startsWith("/") ? "" : "/"}${url}`;
}
