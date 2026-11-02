// src/services/usuarioService.ts

import httpClient from "../../../services/httpClient";

export interface UsuarioCreate {
  co_cpf: string;
  no_nome: string;
  ds_email: string;
  ds_celular?: string | null;
  ds_senha: string;
}

export interface UsuarioResponse {
  co_seq_usuario: number;
  co_cpf: string;
  no_nome: string;
  ds_email: string;
  ds_celular: string | null;
  co_status: number;
  co_tp_usuario: number;
}

export const criarUsuario = async (
  payload: UsuarioCreate,
): Promise<UsuarioResponse> => {
  const response = await httpClient.post<UsuarioResponse>("/usuarios", payload);

  return response.data;
};
