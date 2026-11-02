import httpClient from "../../../services/httpClient";
import type { LoginRequest, LoginResponse } from "./type";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await httpClient.post<LoginResponse>("/auth/login", payload);

  return response.data;
}
