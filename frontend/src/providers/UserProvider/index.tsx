import { useCallback, useMemo, useState, type ReactNode } from "react";
import { DOMINIOS_JSON } from "../../config/dominios";
import { UserContext } from "./context";

import type { LoginResult, UsuarioAutenticado, UserContextValue } from "./type";

const ACCESS_TOKEN_KEY = "access_token";
const USER_KEY = "usuario";

interface UserProviderProps {
  children: ReactNode;
}

function getStoredToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getStoredUser(): UsuarioAutenticado | null {
  const storedUser = localStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as UsuarioAutenticado;
  } catch {
    localStorage.removeItem(USER_KEY);

    return null;
  }
}

export function UserProvider({ children }: UserProviderProps) {
  const [token, setToken] = useState<string | null>(() => getStoredToken());

  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(() =>
    getStoredUser(),
  );

  const setUserSession = useCallback((resultado: LoginResult) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, resultado.access_token);

    localStorage.setItem(USER_KEY, JSON.stringify(resultado.usuario));

    setToken(resultado.access_token);
    setUsuario(resultado.usuario);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    setToken(null);
    setUsuario(null);
  }, []);

  const value = useMemo<UserContextValue>(() => {
    const isAuthenticated = Boolean(token && usuario);

    const tipoUsuario = isAuthenticated ? usuario?.co_tp_usuario : null;

    const isMaster = tipoUsuario === DOMINIOS_JSON.TIPO_USUARIO.MASTER;

    const isAdmin =
      isMaster || tipoUsuario === DOMINIOS_JSON.TIPO_USUARIO.ADMINISTRADOR;

    return {
      usuario,
      token,
      isAuthenticated,
      isMaster,
      isAdmin,
      setUserSession,
      logout,
    };
  }, [usuario, token, setUserSession, logout]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
