// src/services/httpClient.ts

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestHeaders,
} from "axios";

const httpClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  withCredentials: true,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    const originalRequest = error.config;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${httpClient.defaults.baseURL}/auth/refresh`,
          {},
          {
            withCredentials: true,
          },
        );

        const { access_token } = response.data;

        localStorage.setItem("access_token", access_token);

        originalRequest.headers = originalRequest.headers || {};

        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        return httpClient(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export const isHttpError = (error: unknown): error is AxiosError =>
  axios.isAxiosError(error);

export const isHttpCancel = (error: unknown): boolean => axios.isCancel(error);

export const getHttpErrorMessage = (
  error: unknown,
  fallback = "Erro inesperado. Tente novamente.",
): string => {
  if (!isHttpError(error)) {
    return fallback;
  }

  const data = error.response?.data;

  if (data && typeof data === "object") {
    if ("detail" in data) {
      const detail = (data as { detail?: unknown }).detail;

      if (typeof detail === "string" && detail.trim().length > 0) {
        return detail;
      }
    }

    if ("message" in data) {
      const message = (data as { message?: unknown }).message;

      if (typeof message === "string" && message.trim().length > 0) {
        return message;
      }
    }
  }

  if (typeof error.message === "string" && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
};

export default httpClient;
