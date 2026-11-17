import { useEffect, useState, type FormEvent } from "react";
import {
  CalendarDays,
  FileText,
  Globe2,
  Info,
  Layers3,
  Link2,
  LoaderCircle,
  Save,
  Trash2,
} from "lucide-react";

import { apiGet } from "../../../../api/requests/get";
import { apiDeleteRequest } from "../../../../api/requests/delete";
import { apiSave } from "../../../../api/functionts/save";
import API_PATHS from "../../../../api/paths";
import { getApiErrorMessage } from "../../../../api/client";
import { CustomSwal } from "../../../../components/CustomSwal";

import {
  catalogToForm,
  formToCatalogPayload,
  initialCatalogForm,
  validateCatalogForm,
  type CatalogFormData,
} from "./form";
import type { CatalogData } from "../type";
import CustomInputText from "../../../../components/CustomInputText";
import CustomInputDate from "../../../../components/CustomInputDate";
import CustomSelect from "../../../../components/CustomSelect";
import CustomRow from "../../../../components/CustomRow";
import CustomCol from "../../../../components/CustomCol";
import CustomBox from "../../../../components/CustomBox";
import "./index.css";

type FieldName = keyof CatalogFormData;

interface EditCatalogProps {
  catalogId?: number | null;
  onSaved?: () => void | Promise<void>;
  onClose?: () => void;
}

export function EditCatalog({
  catalogId = null,
  onSaved,
  onClose,
}: EditCatalogProps) {
  const isEditing = catalogId !== null;
  const invalidId =
    isEditing && (!Number.isSafeInteger(catalogId) || catalogId <= 0);

  const [form, setForm] = useState<CatalogFormData>({ ...initialCatalogForm });
  const [dataRaw, setDataRaw] = useState<CatalogFormData | null>(null);
  const [loading, setLoading] = useState(isEditing && !invalidId);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(name: FieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  // Cada edição consulta os dados do registro diretamente na API.
  // O CatalogPage já define uma key por catalogId.
  useEffect(() => {
    if (!isEditing || invalidId || catalogId === null) return;

    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await apiGet<CatalogData>(
          API_PATHS.CATALOG.GET_BY_ID(catalogId!),
        );
        if (!active) return;
        const currentForm = catalogToForm(result);
        setForm(currentForm);
        setDataRaw(currentForm);
      } catch (err) {
        if (active) {
          setError(
            getApiErrorMessage(err, "Não foi possível carregar o cadastro."),
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [catalogId, invalidId, isEditing]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || deleting || loading || invalidId) return;

    const validationError = validateCatalogForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const saved = await apiSave({
        path: API_PATHS.CATALOG.POST,
        pathUpdate: (id) => API_PATHS.CATALOG.PUT(Number(id)),
        id: catalogId,
        formMain: form,
        dataRaw,
        updateMethod: "put", // Trocar para "put" se o FastAPI utilizar PUT.
        preparePayload: (values) => ({ ...formToCatalogPayload(values) }),
        camposObrigatorios: {
          NO_CONJUNTO_DADO: "Nome do conjunto de dados",
          DS_DESCRICAO: "Descrição",
          CO_TP_DADO: "Tipo de dado",
          NO_FONTE: "Fonte",
        },
      });

      if (!saved) return;

      if (isEditing) {
        // Mantém os dados atualizados no formulário de edição.
        setDataRaw({ ...form });
      } else {
        // Limpa o formulário para permitir um novo cadastro.
        setForm({ ...initialCatalogForm });
        setDataRaw(null);
      }

      // Atualiza a listagem do CatalogPage.
      await onSaved?.();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Não foi possível concluir o salvamento."),
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing || catalogId === null || invalidId || saving || deleting)
      return;

    const confirmed = await CustomSwal.confirm({
      title: "Inativar conjunto de dados",
      text: "Deseja realmente inativar este conjunto de dados?",
      icon: "warning",
      confirmButtonText: "Sim, inativar",
      confirmButtonColor: "#dc2626",
    });
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      await apiDeleteRequest(API_PATHS.CATALOG.DELETE(catalogId));
      await CustomSwal.alert({
        title: "Registro inativado",
        text: "O conjunto de dados foi inativado com sucesso.",
        icon: "success",
      });
      await onSaved?.();
      onClose?.();
    } catch (err) {
      await CustomSwal.alert({
        title: "Erro ao inativar",
        text: getApiErrorMessage(err, "Não foi possível inativar o cadastro."),
        icon: "error",
      });
    } finally {
      setDeleting(false);
    }
  }

  const busy = loading || saving || deleting;

  if (loading)
    return (
      <div className="edit-catalog__loading">
        <LoaderCircle size={24} className="edit-catalog__spin" />
        Carregando dados do catálogo...
      </div>
    );

  if (invalidId || (isEditing && error && !dataRaw)) {
    return (
      <div className="edit-catalog__alert" role="alert">
        {error || "Identificador inválido."}
      </div>
    );
  }

  return (
    <div className="edit-catalog edit-catalog--embedded">
      {error && (
        <div className="edit-catalog__alert" role="alert">
          {error}
        </div>
      )}

      <form className="edit-catalog__form" onSubmit={handleSubmit}>
        <fieldset className="edit-catalog__fieldset" disabled={busy}>
          <CustomBox
            icon={<FileText size={19} />}
            title="Identificação"
            description="Informações gerais que identificam o conjunto de dados."
            keepMounted
          >
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="NO_CONJUNTO_DADO"
                  title="Nome do conjunto de dados"
                  value={form.NO_CONJUNTO_DADO}
                  onChange={(e) =>
                    updateField("NO_CONJUNTO_DADO", e.target.value)
                  }
                  required
                  maxLength={255}
                  placeholder="Ex.: Limites municipais do Tocantins"
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_DESCRICAO"
                  title="Descrição"
                  type="textArea"
                  rows={4}
                  value={form.DS_DESCRICAO}
                  onChange={(e) => updateField("DS_DESCRICAO", e.target.value)}
                  required
                  placeholder="Descreva o conteúdo e a finalidade do conjunto de dados."
                />
              </CustomCol>
            </CustomRow>
          </CustomBox>

          <CustomBox
            icon={<Layers3 size={19} />}
            title="Classificação"
            description="Classificação temática e natureza dos dados."
            keepMounted
          >
            <CustomRow>
              <CustomCol>
                <CustomSelect
                  name="CO_TP_DADO"
                  title="Tipo de dado"
                  dominio="TIPO_DADO"
                  value={form.CO_TP_DADO}
                  onChange={(e) => updateField("CO_TP_DADO", e.target.value)}
                  required
                />
              </CustomCol>
              <CustomCol>
                <CustomSelect
                  name="CO_TEMA"
                  title="Tema"
                  dominio="TEMA_DADO"
                  value={form.CO_TEMA}
                  onChange={(e) => updateField("CO_TEMA", e.target.value)}
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="NO_FORMATO"
                  title="Formato"
                  value={form.NO_FORMATO}
                  onChange={(e) => updateField("NO_FORMATO", e.target.value)}
                  maxLength={50}
                  placeholder="Ex.: CSV, GeoJSON, KML"
                />
              </CustomCol>
              <CustomCol>
                <CustomInputText
                  name="DS_GRANULARIDADE"
                  title="Granularidade"
                  value={form.DS_GRANULARIDADE}
                  onChange={(e) =>
                    updateField("DS_GRANULARIDADE", e.target.value)
                  }
                  maxLength={150}
                  placeholder="Ex.: Município, imóvel rural, ponto"
                />
              </CustomCol>
            </CustomRow>
          </CustomBox>

          <CustomBox
            icon={<Link2 size={19} />}
            title="Fonte e origem"
            description="Procedência, identificação e condições de acesso aos dados."
            keepMounted
          >
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="NO_FONTE"
                  title="Fonte"
                  value={form.NO_FONTE}
                  onChange={(e) => updateField("NO_FONTE", e.target.value)}
                  required
                  maxLength={200}
                  placeholder="Ex.: IBGE, ANA, INCRA"
                />
              </CustomCol>
              <CustomCol>
                <CustomInputText
                  name="DS_ORIGEM"
                  title="Origem"
                  value={form.DS_ORIGEM}
                  onChange={(e) => updateField("DS_ORIGEM", e.target.value)}
                  maxLength={255}
                  placeholder="Ex.: Base cartográfica oficial"
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_IDENTIFICADOR_ORIGEM"
                  title="Identificador na origem"
                  value={form.DS_IDENTIFICADOR_ORIGEM}
                  onChange={(e) =>
                    updateField("DS_IDENTIFICADOR_ORIGEM", e.target.value)
                  }
                  maxLength={255}
                  placeholder="Código ou identificador original"
                />
              </CustomCol>
              <CustomCol>
                <CustomInputText
                  name="DS_LICENCA"
                  title="Licença de uso"
                  value={form.DS_LICENCA}
                  onChange={(e) => updateField("DS_LICENCA", e.target.value)}
                  placeholder="Ex.: CC BY 4.0"
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_URL_FONTE"
                  title="URL da fonte"
                  type="url"
                  value={form.DS_URL_FONTE}
                  onChange={(e) => updateField("DS_URL_FONTE", e.target.value)}
                  placeholder="https://..."
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_URL_ACESSO"
                  title="URL de acesso"
                  type="url"
                  value={form.DS_URL_ACESSO}
                  onChange={(e) => updateField("DS_URL_ACESSO", e.target.value)}
                  placeholder="https://..."
                  hint="Endereço para consulta ou obtenção dos dados."
                />
              </CustomCol>
            </CustomRow>
          </CustomBox>

          <CustomBox
            icon={<CalendarDays size={19} />}
            title="Atualização e referência"
            description="Periodicidade, atualização da fonte e período de referência."
            keepMounted
          >
            <CustomRow>
              <CustomCol>
                <CustomSelect
                  name="CO_PERIODICIDADE"
                  title="Periodicidade"
                  dominio="PERIODICIDADE_DADO"
                  value={form.CO_PERIODICIDADE}
                  onChange={(e) =>
                    updateField("CO_PERIODICIDADE", e.target.value)
                  }
                />
              </CustomCol>
              <CustomCol>
                <CustomInputDate
                  name="DT_ULTIMA_BUSCA"
                  title="Última busca"
                  type="datetime-local"
                  value={form.DT_ULTIMA_BUSCA}
                  onChange={(e) =>
                    updateField("DT_ULTIMA_BUSCA", e.target.value)
                  }
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol width="calc(50% - 10px)">
                <CustomInputDate
                  name="DT_ATUALIZACAO_FONTE"
                  title="Atualização da fonte"
                  value={form.DT_ATUALIZACAO_FONTE}
                  onChange={(e) =>
                    updateField("DT_ATUALIZACAO_FONTE", e.target.value)
                  }
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputDate
                  name="DT_REFERENCIA_INICIO"
                  title="Início da referência"
                  value={form.DT_REFERENCIA_INICIO}
                  max={form.DT_REFERENCIA_FIM || undefined}
                  onChange={(e) =>
                    updateField("DT_REFERENCIA_INICIO", e.target.value)
                  }
                />
              </CustomCol>
              <CustomCol>
                <CustomInputDate
                  name="DT_REFERENCIA_FIM"
                  title="Fim da referência"
                  value={form.DT_REFERENCIA_FIM}
                  min={form.DT_REFERENCIA_INICIO || undefined}
                  onChange={(e) =>
                    updateField("DT_REFERENCIA_FIM", e.target.value)
                  }
                />
              </CustomCol>
            </CustomRow>
          </CustomBox>

          <CustomBox
            icon={<Globe2 size={19} />}
            title="Abrangência territorial"
            description="Cobertura geográfica representada pelo conjunto de dados."
            keepMounted
          >
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_ABRANGENCIA_TERRITORIAL"
                  title="Abrangência territorial"
                  type="textArea"
                  rows={3}
                  value={form.DS_ABRANGENCIA_TERRITORIAL}
                  onChange={(e) =>
                    updateField("DS_ABRANGENCIA_TERRITORIAL", e.target.value)
                  }
                  placeholder="Ex.: Estado do Tocantins, municípios do Polo..."
                />
              </CustomCol>
            </CustomRow>
          </CustomBox>

          <CustomBox
            icon={<Info size={19} />}
            title="Informações complementares"
            description="Limitações conhecidas e observações sobre os dados."
            defaultOpen={false}
            keepMounted
          >
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_LIMITACOES"
                  title="Limitações"
                  type="textArea"
                  rows={3}
                  value={form.DS_LIMITACOES}
                  onChange={(e) => updateField("DS_LIMITACOES", e.target.value)}
                  placeholder="Descreva limitações metodológicas, espaciais ou temporais."
                />
              </CustomCol>
            </CustomRow>
            <CustomRow>
              <CustomCol>
                <CustomInputText
                  name="DS_OBSERVACOES"
                  title="Observações"
                  type="textArea"
                  rows={3}
                  value={form.DS_OBSERVACOES}
                  onChange={(e) =>
                    updateField("DS_OBSERVACOES", e.target.value)
                  }
                  placeholder="Informações adicionais relevantes."
                />
              </CustomCol>
            </CustomRow>
          </CustomBox>
        </fieldset>

        <footer className="edit-catalog__actions">
          {isEditing && (
            <button
              type="button"
              className="edit-catalog__button edit-catalog__button--danger"
              onClick={() => void handleDelete()}
              disabled={busy}
            >
              <Trash2 size={17} /> {deleting ? "Inativando..." : "Inativar"}
            </button>
          )}
          <div className="edit-catalog__actions-right">
            <button
              type="submit"
              className="edit-catalog__button edit-catalog__button--primary"
              disabled={busy}
            >
              {saving ? (
                <LoaderCircle size={17} className="edit-catalog__spin" />
              ) : (
                <Save size={17} />
              )}
              {saving
                ? "Salvando..."
                : isEditing
                  ? "Salvar alterações"
                  : "Cadastrar conjunto"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
