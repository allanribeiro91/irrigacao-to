import type { AxiosRequestConfig } from "axios";

import apiClient from "../client";

export async function apiPut<TResponse = unknown, TBody = unknown>(
  path: string,
  body: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.put<TResponse>(path, body, config);

  return response.data;
}
