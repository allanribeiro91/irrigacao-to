import type { AxiosRequestConfig } from "axios";

import apiClient from "../client";

export async function apiGet<TResponse = unknown>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.get<TResponse>(path, config);

  return response.data;
}
