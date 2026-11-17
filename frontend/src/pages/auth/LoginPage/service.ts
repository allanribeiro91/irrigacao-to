import { apiPost } from "../../../api/requests/post";
import API_PATHS from "../../../api/paths";

import type { LoginRequest, LoginResponse } from "./type";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  return apiPost<LoginResponse, LoginRequest>(API_PATHS.AUTH.LOGIN, payload);
}
