export const DOMINIOS_JSON = {
  TIPO_USUARIO: {
    USUARIO_COMUM: 2,
    ADMINISTRADOR: 3,
    MASTER: 4,
  },

  STATUS_USUARIO: {
    ATIVO: 6,
    INATIVO: 7,
    BLOQUEADO: 8,
  },

  TIPO_DADO: {
    TABULAR: 10,
    GEOESPACIAL_VETORIAL: 11,
    GEOESPACIAL_RASTER: 12,
    DOCUMENTAL: 13,
  },

  TEMA_DADO: {
    RECURSOS_HIDRICOS: 15,
    AGROPECUARIA_IRRIGACAO: 16,
    FUNDIARIO: 17,
    MEIO_AMBIENTE: 18,
    INFRAESTRUTURA: 19,
    SOCIOECONOMIA_DEMOGRAFIA: 20,
  },

  PERIODICIDADE_DADO: {
    DIARIA: 22,
    SEMANAL: 23,
    MENSAL: 24,
    TRIMESTRAL: 25,
    SEMESTRAL: 26,
    ANUAL: 27,
    DECENAL: 28,
    EVENTUAL: 29,
    NAO_INFORMADA: 30,
  },
} as const;

export const DOMINIOS_LABELS = {
  TIPO_USUARIO: {
    2: "Usuário Comum",
    3: "Administrador",
    4: "Master",
  },

  STATUS_USUARIO: {
    6: "Ativo",
    7: "Inativo",
    8: "Bloqueado",
  },

  TIPO_DADO: {
    10: "Tabular",
    11: "Geoespacial vetorial",
    12: "Geoespacial raster",
    13: "Documental",
  },

  TEMA_DADO: {
    15: "Recursos hídricos",
    16: "Agropecuária e irrigação",
    17: "Fundiário",
    18: "Meio ambiente",
    19: "Infraestrutura",
    20: "Socioeconomia e demografia",
  },

  PERIODICIDADE_DADO: {
    22: "Diária",
    23: "Semanal",
    24: "Mensal",
    25: "Trimestral",
    26: "Semestral",
    27: "Anual",
    28: "Decenal",
    29: "Eventual",
    30: "Não informada",
  },
} as const;

export type DominioKey = keyof typeof DOMINIOS_JSON;
