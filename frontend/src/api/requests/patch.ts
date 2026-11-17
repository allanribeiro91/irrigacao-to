import type { AxiosRequestConfig } from "axios";

import apiClient from "../client";

export async function apiPatch<TResponse = unknown, TBody = unknown>(
  path: string,
  body: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  const response = await apiClient.patch<TResponse>(path, body, config);

  return response.data;
}
