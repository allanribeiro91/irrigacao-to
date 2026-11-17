import type { AxiosRequestConfig } from "axios";

import apiClient from "../client";

export async function apiDeleteRequest<TResponse = unknown>(
  path: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.delete<TResponse>(path, config);

  return response.data;
}
