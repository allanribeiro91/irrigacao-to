export interface UsuarioAutenticado {
  co_seq_usuario: number;
  no_nome: string;
  ds_email: string;
  co_tp_usuario: number;
  no_tipo_usuario: string;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  usuario: UsuarioAutenticado;
}

export interface UserContextValue {
  usuario: UsuarioAutenticado | null;
  token: string | null;
  isAuthenticated: boolean;

  setUserSession: (resultado: LoginResult) => void;
  logout: () => void;
}
