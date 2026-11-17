import { CustomSwal } from "../../components/CustomSwal";

import { apiPost } from "../requests/post";
import { apiPatch } from "../requests/patch";
import { apiPut } from "../requests/put";

import { getApiErrorMessage } from "../client";

type RegistroId = string | number;

type CamposAjustar<T extends object> = {
  number?: Array<keyof T>;
  string?: Array<keyof T>;
  date?: Array<keyof T>;
};

type Payload = Record<string, unknown>;

type MetodoUpdate = "patch" | "put";

export interface ApiSaveParams<TForm extends object, TResponse = unknown> {
  path: string;
  pathUpdate?: (id: RegistroId) => string;

  id?: RegistroId | null;
  formMain: TForm;
  dataRaw?: TForm | null;

  updateMethod?: MetodoUpdate;

  camposObrigatorios?: Partial<Record<keyof TForm, string>>;

  camposAjustar?: CamposAjustar<TForm>;

  camposOmitir?: Array<keyof TForm>;

  preparePayload?: (form: TForm) => Payload;

  onSuccess?: (
    registro: TResponse,
    typeSave: "create" | "update",
  ) => void | Promise<void>;

  mostrarSucesso?: boolean;
  mostrarErro?: boolean;
  verificarAlteracoes?: boolean;
}

// =========================================================
// HELPERS
// =========================================================

function isEmpty(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    value === 0 ||
    value === "0" ||
    (typeof value === "string" && !value.trim()) ||
    (Array.isArray(value) && value.length === 0)
  );
}

function getMissingFields<T extends object>(
  form: T,
  required?: Partial<Record<keyof T, string>>,
): string[] {
  if (!required) return [];

  const values = form as Record<string, unknown>;

  return Object.entries(required)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .filter(([field]) => isEmpty(values[field]))
    .map(([, label]) => label);
}

function ajustarCampos<T extends object>(
  form: T,
  campos?: CamposAjustar<T>,
): Payload {
  const payload: Payload = { ...form };

  if (!campos) return payload;

  campos.number?.forEach((campo) => {
    const key = String(campo);
    const value = payload[key];

    if (value === "" || value == null) {
      payload[key] = null;
      return;
    }

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      throw new Error(`Valor numérico inválido para o campo ${key}.`);
    }

    payload[key] = parsed;
  });

  campos.string?.forEach((campo) => {
    const key = String(campo);
    const value = payload[key];

    payload[key] =
      value === null || value === undefined ? null : String(value).trim();
  });

  campos.date?.forEach((campo) => {
    const key = String(campo);
    const value = payload[key];

    payload[key] =
      value === null || value === undefined || value === ""
        ? null
        : String(value);
  });

  return payload;
}

function prepararPayload<T extends object>(
  form: T,
  camposAjustar?: CamposAjustar<T>,
  camposOmitir?: Array<keyof T>,
  preparePayload?: (form: T) => Payload,
): Payload {
  const payload = preparePayload
    ? { ...preparePayload(form) }
    : ajustarCampos(form, camposAjustar);

  camposOmitir?.forEach((campo) => {
    delete payload[String(campo)];
  });

  return payload;
}

function normalizarParaComparacao(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizarParaComparacao);
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, normalizarParaComparacao(item)]),
    );
  }

  return value;
}

function houveAlteracao(original: Payload, atual: Payload): boolean {
  return (
    JSON.stringify(normalizarParaComparacao(original)) !==
    JSON.stringify(normalizarParaComparacao(atual))
  );
}

// =========================================================
// SAVE
// =========================================================

export async function apiSave<TForm extends object, TResponse = unknown>({
  path,
  pathUpdate,
  id,
  formMain,
  dataRaw,
  updateMethod = "patch",
  camposObrigatorios,
  camposAjustar,
  camposOmitir,
  preparePayload,
  onSuccess,
  mostrarSucesso = true,
  mostrarErro = true,
  verificarAlteracoes = true,
}: ApiSaveParams<TForm, TResponse>): Promise<boolean> {
  const isEditing = id !== undefined && id !== null && id !== "" && id !== 0;

  const typeSave = isEditing ? "update" : "create";

  // =======================================================
  // VALIDAÇÃO
  // =======================================================

  const missingFields = getMissingFields(formMain, camposObrigatorios);

  if (missingFields.length > 0) {
    await CustomSwal.alert({
      title: "Campos obrigatórios",
      text: [
        "Preencha os seguintes campos:",
        "",
        ...missingFields.map((label) => `• ${label}`),
      ].join("\n"),
      icon: "warning",
    });

    return false;
  }

  let registro: TResponse;

  try {
    // =====================================================
    // PREPARAÇÃO DOS DADOS
    // =====================================================

    const payload = prepararPayload(
      formMain,
      camposAjustar,
      camposOmitir,
      preparePayload,
    );

    // =====================================================
    // VERIFICAÇÃO DE ALTERAÇÕES
    // =====================================================

    if (isEditing && verificarAlteracoes && dataRaw != null) {
      const original = prepararPayload(
        dataRaw,
        camposAjustar,
        camposOmitir,
        preparePayload,
      );

      if (!houveAlteracao(original, payload)) {
        await CustomSwal.alert({
          title: "Nenhuma alteração",
          text: "Não houve alterações no registro.",
          icon: "info",
        });

        return false;
      }
    }

    // =====================================================
    // REQUISIÇÃO HTTP
    // =====================================================

    if (isEditing) {
      if (!pathUpdate) {
        throw new Error("O endpoint de atualização não foi informado.");
      }

      const updatePath = pathUpdate(id);

      if (updateMethod === "put") {
        registro = await apiPut<TResponse, Payload>(updatePath, payload);
      } else {
        registro = await apiPatch<TResponse, Payload>(updatePath, payload);
      }
    } else {
      registro = await apiPost<TResponse, Payload>(path, payload);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Erro ao salvar registro:", error);
    }

    if (mostrarErro) {
      await CustomSwal.alert({
        title: "Erro ao salvar",
        text: getApiErrorMessage(error, "Não foi possível salvar o registro."),
        icon: "error",
      });
    }

    return false;
  }

  // =======================================================
  // SUCESSO
  // =======================================================

  if (mostrarSucesso) {
    await CustomSwal.alert({
      title: "Sucesso!",
      text:
        typeSave === "create"
          ? "Registro cadastrado com sucesso."
          : "Registro atualizado com sucesso.",
      icon: "success",
    });
  }

  await onSuccess?.(registro, typeSave);

  return true;
}
