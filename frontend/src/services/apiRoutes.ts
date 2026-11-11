const API_ROUTES = {
  CATALOG: {
    LIST: "/catalogo-dados",
    GET_BY_ID: (id: number) => `/catalogo-dados/${id}`,
    CREATE: "/catalogo-dados",
    UPDATE: (id: number) => `/catalogo-dados/${id}`,
    DELETE: (id: number) => `/catalogo-dados/${id}`,
  },

  USER: {
    GET_PROFILE: "/auth/me",
  },

  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    REGISTER: "/usuarios",
  },
} as const;

export default API_ROUTES;
