export interface PathConfig {
  path: string;
  breadcrumb: string;
}

export const CENTRAL_PATHS = {
  // Autenticação
  LOGIN: {
    path: "/login",
    breadcrumb: "Login",
  },

  CADASTRO: {
    path: "/cadastro",
    breadcrumb: "Cadastro",
  },

  // Portal
  GEO: {
    path: "/portal/geografico",
    breadcrumb: "Painel Geográfico",
  },

  PAINEIS: {
    path: "/portal/paineis",
    breadcrumb: "Painéis",
  },

  INDICADORES: {
    path: "/portal/indicadores",
    breadcrumb: "Indicadores",
  },

  CATALOGO: {
    path: "/portal/catalogo",
    breadcrumb: "Catálogo de Dados",
  },

  CATALOGO_NOVO: {
    path: "/portal/catalogo/novo",
    breadcrumb: "Catálogo / Novo Cadastro",
  },

  CATALOGO_EDITAR: {
    path: "/portal/catalogo/:id/editar",
    breadcrumb: "Catálogo / Editar Cadastro",
  },

  RELATORIOS: {
    path: "/portal/relatorios",
    breadcrumb: "Relatórios",
  },

  USUARIO: {
    path: "/portal/usuario",
    breadcrumb: "Usuário / Meus Dados",
  },
} as const satisfies Record<string, PathConfig>;

export type CentralPathKey = keyof typeof CENTRAL_PATHS;
