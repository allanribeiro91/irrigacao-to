export interface LoginRequest {
  co_cpf: string;
  ds_senha: string;
}

export interface UsuarioAutenticado {
  co_seq_usuario: number;
  no_nome: string;
  ds_email: string;
  co_tp_usuario: number;
  no_tipo_usuario: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: UsuarioAutenticado;
}
