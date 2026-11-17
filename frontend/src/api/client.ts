import axios, {
  AxiosError,
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import API_PATHS from "./paths";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  access_token: string;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

// Requisições sem interceptors para renovação.
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 30000,
  withCredentials: true,
});

let refreshPromise: Promise<string> | null = null;

function renovarToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshResponse>(API_PATHS.AUTH.REFRESH, {})
      .then(({ data }) => {
        if (!data.access_token) {
          throw new Error("Token de acesso não retornado.");
        }

        localStorage.setItem("access_token", data.access_token);

        return data.access_token;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// =========================================================
// REQUEST INTERCEPTOR
// =========================================================

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error: unknown) => Promise.reject(error),
);

// =========================================================
// RESPONSE INTERCEPTOR
// =========================================================

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryRequestConfig | undefined;

    const status = error.response?.status;

    if (!originalRequest || status !== 401) {
      return Promise.reject(error);
    }

    const requestPath = originalRequest.url ?? "";

    const authPaths: string[] = [
      API_PATHS.AUTH.LOGIN,
      API_PATHS.AUTH.REFRESH,
      API_PATHS.AUTH.LOGOUT,
    ];

    if (
      originalRequest._retry ||
      authPaths.some((path) =>
        requestPath.split("?")[0].replace(/\/$/, "").endsWith(path),
      )
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const token = await renovarToken();

      originalRequest.headers = AxiosHeaders.from(originalRequest.headers);

      originalRequest.headers.set("Authorization", `Bearer ${token}`);

      return apiClient(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("access_token");

      return Promise.reject(refreshError);
    }
  },
);

// =========================================================
// ERROR HELPERS
// =========================================================

export const isApiError = (error: unknown): error is AxiosError =>
  axios.isAxiosError(error);

export const isApiCancel = (error: unknown): boolean => axios.isCancel(error);

function extractMessage(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (Array.isArray(value)) {
    const messages = value
      .map((item) => {
        if (typeof item === "string") return item;

        if (item && typeof item === "object" && "msg" in item) {
          return typeof item.msg === "string" ? item.msg : "";
        }

        return "";
      })
      .filter(Boolean);

    return messages.length ? messages.join("\n") : null;
  }

  return null;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Erro inesperado. Tente novamente.",
): string {
  if (!isApiError(error)) {
    return error instanceof Error && error.message ? error.message : fallback;
  }

  const data = error.response?.data;

  if (data && typeof data === "object") {
    const response = data as Record<string, unknown>;

    for (const field of ["detail", "message", "error"]) {
      const message = extractMessage(response[field]);

      if (message) return message;
    }
  }

  return error.message || fallback;
}

export default apiClient;
