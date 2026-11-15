import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CalendarDays,
  Database,
  FileText,
  Globe2,
  Info,
  Layers3,
  Link2,
  LoaderCircle,
  Save,
  Trash2,
} from "lucide-react";

import {
  createCatalog,
  deleteCatalog,
  getCatalogById,
  updateCatalog,
} from "../service";
import { getHttpErrorMessage } from "../../../../services/httpClient";
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
  catalog?: CatalogData | null;
  embedded?: boolean;
  onCancel?: () => void;
  onSaved?: () => void | Promise<void>;
  onDeleted?: () => void | Promise<void>;
}

export function EditCatalog({
  catalog,
  embedded = false,
  onCancel,
  onSaved,
  onDeleted,
}: EditCatalogProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const catalogId =
    catalog !== undefined
      ? (catalog?.CO_SEQ_CATALOGO_DADO ?? null)
      : id
        ? Number(id)
        : null;
  const isEditing = catalog !== undefined ? catalog !== null : id !== undefined;
  const invalidId =
    isEditing &&
    (catalogId === null || !Number.isSafeInteger(catalogId) || catalogId <= 0);

  const [form, setForm] = useState<CatalogFormData>(() =>
    catalog ? catalogToForm(catalog) : { ...initialCatalogForm },
  );
  const [loading, setLoading] = useState(isEditing && catalog === undefined);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goBack() {
    if (embedded && onCancel) {
      onCancel();
      return;
    }
    navigate("/portal/catalogo");
  }

  function updateField(name: FieldName, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  useEffect(() => {
    if (catalog !== undefined) {
      // Dados recebidos do pai: não há requisição a executar.
      // Em aplicações com troca frequente de registros, prefira uma key
      // no componente pai para reinicializar o formulário por registro.
      return;
    }
    if (!isEditing || invalidId || catalogId === null) return;

    let active = true;
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const result = await getCatalogById(catalogId!);
        if (active) setForm(catalogToForm(result));
      } catch (err) {
        if (active)
          setError(
            getHttpErrorMessage(err, "Não foi possível carregar o cadastro."),
          );
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [catalog, catalogId, invalidId, isEditing]);

  // Os dados embutidos são usados na montagem inicial do formulário.
  // Para outro registro, o pai deve utilizar key={catalog?.CO_SEQ_CATALOGO_DADO ?? "novo"}.
  // Caso a edição embutida exija sincronização sem remontagem, faça-a no pai.

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || deleting || loading) return;
    const validationError = validateCatalogForm(form);
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    try {
      setSaving(true);
      setError(null);
      const payload = formToCatalogPayload(form);
      if (isEditing && catalogId !== null && !invalidId) {
        await updateCatalog(catalogId, payload);
      } else if (!isEditing) {
        await createCatalog(payload);
      } else {
        throw new Error("Identificador do catálogo inválido.");
      }
      if (embedded && onSaved) await onSaved();
      else navigate("/portal/catalogo");
    } catch (err) {
      setError(getHttpErrorMessage(err, "Não foi possível salvar o cadastro."));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing || catalogId === null || invalidId || saving || deleting)
      return;
    if (!window.confirm("Deseja realmente inativar este conjunto de dados?"))
      return;
    try {
      setDeleting(true);
      setError(null);
      await deleteCatalog(catalogId);
      if (embedded && onDeleted) await onDeleted();
      else navigate("/portal/catalogo");
    } catch (err) {
      setError(
        getHttpErrorMessage(err, "Não foi possível inativar o cadastro."),
      );
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

  if (isEditing && (invalidId || (error && !form.NO_CONJUNTO_DADO)))
    return (
      <div className="edit-catalog">
        <button type="button" className="edit-catalog__back" onClick={goBack}>
          <ArrowLeft size={17} /> Voltar ao catálogo
        </button>
        <div className="edit-catalog__alert" role="alert">
          {error || "Identificador inválido."}
        </div>
      </div>
    );

  return (
    <div
      className={
        embedded ? "edit-catalog edit-catalog--embedded" : "edit-catalog"
      }
    >
      {!embedded && (
        <header className="edit-catalog__page-header">
          <button type="button" className="edit-catalog__back" onClick={goBack}>
            <ArrowLeft size={17} /> Voltar ao catálogo
          </button>
          <div className="edit-catalog__page-heading">
            <div className="edit-catalog__page-icon">
              <Database size={24} />
            </div>
            <div>
              <span>Governança de dados</span>
              <h1>
                {isEditing
                  ? "Editar conjunto de dados"
                  : "Novo conjunto de dados"}
              </h1>
              <p>
                {isEditing
                  ? "Atualize os metadados do conjunto de dados."
                  : "Cadastre um conjunto de dados no catálogo."}
              </p>
            </div>
          </div>
        </header>
      )}

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
              type="button"
              className="edit-catalog__button edit-catalog__button--secondary"
              onClick={goBack}
              disabled={busy}
            >
              Cancelar
            </button>
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
