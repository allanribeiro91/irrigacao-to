export interface CatalogDataPayload {
  NO_CONJUNTO_DADO: string;
  DS_DESCRICAO: string;

  CO_TP_DADO: number;
  CO_TEMA: number | null;

  NO_FONTE: string;
  DS_ORIGEM: string | null;
  DS_IDENTIFICADOR_ORIGEM: string | null;
  DS_URL_FONTE: string | null;
  DS_URL_ACESSO: string | null;
  NO_FORMATO: string | null;
  DS_LICENCA: string | null;

  CO_PERIODICIDADE: number | null;
  DT_ULTIMA_BUSCA: string | null;
  DT_ATUALIZACAO_FONTE: string | null;
  DT_REFERENCIA_INICIO: string | null;
  DT_REFERENCIA_FIM: string | null;

  DS_ABRANGENCIA_TERRITORIAL: string | null;
  DS_GRANULARIDADE: string | null;
  DS_LIMITACOES: string | null;
  DS_OBSERVACOES: string | null;
}

export interface CatalogData extends CatalogDataPayload {
  CO_SEQ_CATALOGO_DADO: number;

  DT_REGISTRO: string;
  CO_USUARIO_REGISTRO: number;

  DT_ATUALIZACAO: string;
  CO_USUARIO_ATUALIZACAO: number;

  ST_REGISTRO_ATIVO: number;
}
