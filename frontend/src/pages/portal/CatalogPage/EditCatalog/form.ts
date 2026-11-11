import type { CatalogData, CatalogDataPayload } from "../type";

export type CatalogFormData = {
  [K in keyof CatalogDataPayload]: string;
};

export const initialCatalogForm: CatalogFormData = {
  NO_CONJUNTO_DADO: "",
  DS_DESCRICAO: "",

  CO_TP_DADO: "",
  CO_TEMA: "",

  NO_FONTE: "",
  DS_ORIGEM: "",
  DS_IDENTIFICADOR_ORIGEM: "",
  DS_URL_FONTE: "",
  DS_URL_ACESSO: "",
  NO_FORMATO: "",
  DS_LICENCA: "",

  CO_PERIODICIDADE: "",
  DT_ULTIMA_BUSCA: "",
  DT_ATUALIZACAO_FONTE: "",
  DT_REFERENCIA_INICIO: "",
  DT_REFERENCIA_FIM: "",

  DS_ABRANGENCIA_TERRITORIAL: "",
  DS_GRANULARIDADE: "",
  DS_LIMITACOES: "",
  DS_OBSERVACOES: "",
};

export const tipoDadoOptions = [
  { value: 10, label: "Tabular" },
  { value: 11, label: "Geoespacial vetorial" },
  { value: 12, label: "Geoespacial raster" },
  { value: 13, label: "Documental" },
];

export const temaOptions = [
  { value: 15, label: "Recursos hídricos" },
  { value: 16, label: "Agropecuária e irrigação" },
  { value: 17, label: "Fundiário" },
  { value: 18, label: "Meio ambiente" },
  { value: 19, label: "Infraestrutura" },
  { value: 20, label: "Socioeconomia e demografia" },
];

export const periodicidadeOptions = [
  { value: 22, label: "Diária" },
  { value: 23, label: "Semanal" },
  { value: 24, label: "Mensal" },
  { value: 25, label: "Trimestral" },
  { value: 26, label: "Semestral" },
  { value: 27, label: "Anual" },
  { value: 28, label: "Decenal" },
  { value: 29, label: "Eventual" },
  { value: 30, label: "Não informada" },
];

const toStringValue = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
};

const toNullableString = (value: string): string | null => {
  const normalized = value.trim();
  return normalized || null;
};

const toNullableNumber = (value: string): number | null => {
  return value === "" ? null : Number(value);
};

const toDateTimeLocal = (value: string | null): string => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 16);
};

export function catalogToForm(catalog: CatalogData): CatalogFormData {
  return {
    NO_CONJUNTO_DADO: catalog.NO_CONJUNTO_DADO,
    DS_DESCRICAO: catalog.DS_DESCRICAO,

    CO_TP_DADO: toStringValue(catalog.CO_TP_DADO),
    CO_TEMA: toStringValue(catalog.CO_TEMA),

    NO_FONTE: catalog.NO_FONTE,
    DS_ORIGEM: toStringValue(catalog.DS_ORIGEM),
    DS_IDENTIFICADOR_ORIGEM: toStringValue(catalog.DS_IDENTIFICADOR_ORIGEM),
    DS_URL_FONTE: toStringValue(catalog.DS_URL_FONTE),
    DS_URL_ACESSO: toStringValue(catalog.DS_URL_ACESSO),
    NO_FORMATO: toStringValue(catalog.NO_FORMATO),
    DS_LICENCA: toStringValue(catalog.DS_LICENCA),

    CO_PERIODICIDADE: toStringValue(catalog.CO_PERIODICIDADE),
    DT_ULTIMA_BUSCA: toDateTimeLocal(catalog.DT_ULTIMA_BUSCA),
    DT_ATUALIZACAO_FONTE: toStringValue(catalog.DT_ATUALIZACAO_FONTE),
    DT_REFERENCIA_INICIO: toStringValue(catalog.DT_REFERENCIA_INICIO),
    DT_REFERENCIA_FIM: toStringValue(catalog.DT_REFERENCIA_FIM),

    DS_ABRANGENCIA_TERRITORIAL: toStringValue(
      catalog.DS_ABRANGENCIA_TERRITORIAL,
    ),
    DS_GRANULARIDADE: toStringValue(catalog.DS_GRANULARIDADE),
    DS_LIMITACOES: toStringValue(catalog.DS_LIMITACOES),
    DS_OBSERVACOES: toStringValue(catalog.DS_OBSERVACOES),
  };
}

export function formToCatalogPayload(
  form: CatalogFormData,
): CatalogDataPayload {
  return {
    NO_CONJUNTO_DADO: form.NO_CONJUNTO_DADO.trim(),
    DS_DESCRICAO: form.DS_DESCRICAO.trim(),

    CO_TP_DADO: Number(form.CO_TP_DADO),
    CO_TEMA: toNullableNumber(form.CO_TEMA),

    NO_FONTE: form.NO_FONTE.trim(),
    DS_ORIGEM: toNullableString(form.DS_ORIGEM),
    DS_IDENTIFICADOR_ORIGEM: toNullableString(form.DS_IDENTIFICADOR_ORIGEM),
    DS_URL_FONTE: toNullableString(form.DS_URL_FONTE),
    DS_URL_ACESSO: toNullableString(form.DS_URL_ACESSO),
    NO_FORMATO: toNullableString(form.NO_FORMATO),
    DS_LICENCA: toNullableString(form.DS_LICENCA),

    CO_PERIODICIDADE: toNullableNumber(form.CO_PERIODICIDADE),
    DT_ULTIMA_BUSCA: form.DT_ULTIMA_BUSCA
      ? new Date(form.DT_ULTIMA_BUSCA).toISOString()
      : null,
    DT_ATUALIZACAO_FONTE: form.DT_ATUALIZACAO_FONTE || null,
    DT_REFERENCIA_INICIO: form.DT_REFERENCIA_INICIO || null,
    DT_REFERENCIA_FIM: form.DT_REFERENCIA_FIM || null,

    DS_ABRANGENCIA_TERRITORIAL: toNullableString(
      form.DS_ABRANGENCIA_TERRITORIAL,
    ),
    DS_GRANULARIDADE: toNullableString(form.DS_GRANULARIDADE),
    DS_LIMITACOES: toNullableString(form.DS_LIMITACOES),
    DS_OBSERVACOES: toNullableString(form.DS_OBSERVACOES),
  };
}

export function validateCatalogForm(form: CatalogFormData): string | null {
  if (form.NO_CONJUNTO_DADO.trim().length < 2) {
    return "Informe o nome do conjunto de dados.";
  }

  if (!form.DS_DESCRICAO.trim()) {
    return "Informe a descrição do conjunto de dados.";
  }

  if (!form.CO_TP_DADO) {
    return "Selecione o tipo de dado.";
  }

  if (!form.NO_FONTE.trim()) {
    return "Informe a fonte dos dados.";
  }

  if (
    form.DT_REFERENCIA_INICIO &&
    form.DT_REFERENCIA_FIM &&
    form.DT_REFERENCIA_INICIO > form.DT_REFERENCIA_FIM
  ) {
    return "A data inicial não pode ser posterior à data final.";
  }

  return null;
}
