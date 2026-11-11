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
  periodicidadeOptions,
  temaOptions,
  tipoDadoOptions,
  validateCatalogForm,
  type CatalogFormData,
} from "./form";

import "./index.css";

type FieldName = keyof CatalogFormData;

type SelectOption = {
  value: number;
  label: string;
};

interface FormFieldProps {
  name: FieldName;
  label: string;
  value: string;
  onChange: (name: FieldName, value: string) => void;
  required?: boolean;
  type?: "text" | "date" | "datetime-local" | "url";
  multiline?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  hint?: string;
  maxLength?: number;
}

function FormField({
  name,
  label,
  value,
  onChange,
  required = false,
  type = "text",
  multiline = false,
  options,
  placeholder,
  hint,
  maxLength,
}: FormFieldProps) {
  const id = `catalog-${name.toLowerCase()}`;

  return (
    <div className="edit-catalog__field">
      <label htmlFor={id}>
        {label}
        {required && <span className="edit-catalog__required"> *</span>}
      </label>

      {options ? (
        <select
          id={id}
          name={name}
          value={value}
          required={required}
          onChange={(event) => onChange(name, event.target.value)}
        >
          <option value="">Selecione...</option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea
          id={id}
          name={name}
          value={value}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={4}
          onChange={(event) => onChange(name, event.target.value)}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          onChange={(event) => onChange(name, event.target.value)}
        />
      )}

      {hint && <small className="edit-catalog__hint">{hint}</small>}
    </div>
  );
}

interface FormSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}

function FormSection({ icon, title, description, children }: FormSectionProps) {
  return (
    <section className="edit-catalog__section">
      <header className="edit-catalog__section-header">
        <div className="edit-catalog__section-icon">{icon}</div>

        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </header>

      <div className="edit-catalog__section-content">{children}</div>
    </section>
  );
}

export function EditCatalog() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const catalogId = id ? Number(id) : null;
  const isEditing = id !== undefined;
  const invalidId =
    isEditing &&
    (!Number.isSafeInteger(catalogId) || catalogId === null || catalogId <= 0);

  const [form, setForm] = useState<CatalogFormData>({ ...initialCatalogForm });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goBack() {
    navigate("/portal/catalogo");
  }

  function updateField(name: FieldName, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (!isEditing) {
      setForm({ ...initialCatalogForm });
      setError(null);
      setLoading(false);
      return;
    }

    if (invalidId || catalogId === null) {
      setError("Identificador do catálogo inválido.");
      setLoading(false);
      return;
    }

    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const catalog = await getCatalogById(catalogId!);

        if (active) {
          setForm(catalogToForm(catalog));
        }
      } catch (err) {
        if (active) {
          setError(
            getHttpErrorMessage(err, "Não foi possível carregar o cadastro."),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [catalogId, invalidId, isEditing]);

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

      if (isEditing) {
        if (catalogId === null || invalidId) {
          throw new Error("Identificador inválido.");
        }

        await updateCatalog(catalogId, payload);
      } else {
        await createCatalog(payload);
      }

      navigate("/portal/catalogo");
    } catch (err) {
      setError(getHttpErrorMessage(err, "Não foi possível salvar o cadastro."));

      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!isEditing || catalogId === null || invalidId || saving || deleting) {
      return;
    }

    const confirmed = window.confirm(
      "Deseja realmente inativar este conjunto de dados?",
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError(null);

      await deleteCatalog(catalogId);
      navigate("/portal/catalogo");
    } catch (err) {
      setError(
        getHttpErrorMessage(err, "Não foi possível inativar o cadastro."),
      );
    } finally {
      setDeleting(false);
    }
  }

  const busy = loading || saving || deleting;

  if (loading) {
    return (
      <div className="edit-catalog__loading">
        <LoaderCircle size={24} className="edit-catalog__spin" />
        Carregando dados do catálogo...
      </div>
    );
  }

  if (isEditing && (invalidId || (error && !form.NO_CONJUNTO_DADO))) {
    return (
      <div className="edit-catalog">
        <button type="button" className="edit-catalog__back" onClick={goBack}>
          <ArrowLeft size={17} />
          Voltar ao catálogo
        </button>
        <div className="edit-catalog__alert" role="alert">
          {error || "Identificador inválido."}
        </div>
      </div>
    );
  }

  return (
    <div className="edit-catalog">
      <header className="edit-catalog__page-header">
        <button type="button" className="edit-catalog__back" onClick={goBack}>
          <ArrowLeft size={17} />
          Voltar ao catálogo
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

      {error && (
        <div className="edit-catalog__alert" role="alert">
          {error}
        </div>
      )}

      <form className="edit-catalog__form" onSubmit={handleSubmit}>
        <fieldset className="edit-catalog__fieldset" disabled={busy}>
          <FormSection
            icon={<FileText size={19} />}
            title="Identificação"
            description="Informações gerais que identificam o conjunto de dados."
          >
            <div className="edit-catalog__grid">
              <div className="edit-catalog__full">
                <FormField
                  name="NO_CONJUNTO_DADO"
                  label="Nome do conjunto de dados"
                  value={form.NO_CONJUNTO_DADO}
                  onChange={updateField}
                  required
                  maxLength={255}
                  placeholder="Ex.: Limites municipais do Tocantins"
                />
              </div>

              <div className="edit-catalog__full">
                <FormField
                  name="DS_DESCRICAO"
                  label="Descrição"
                  value={form.DS_DESCRICAO}
                  onChange={updateField}
                  required
                  multiline
                  placeholder="Descreva o conteúdo e a finalidade do conjunto de dados."
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={<Layers3 size={19} />}
            title="Classificação"
            description="Classificação temática e natureza dos dados."
          >
            <div className="edit-catalog__grid">
              <FormField
                name="CO_TP_DADO"
                label="Tipo de dado"
                value={form.CO_TP_DADO}
                onChange={updateField}
                options={tipoDadoOptions}
                required
              />

              <FormField
                name="CO_TEMA"
                label="Tema"
                value={form.CO_TEMA}
                onChange={updateField}
                options={temaOptions}
              />

              <FormField
                name="NO_FORMATO"
                label="Formato"
                value={form.NO_FORMATO}
                onChange={updateField}
                maxLength={50}
                placeholder="Ex.: CSV, GeoJSON, KML"
              />

              <FormField
                name="DS_GRANULARIDADE"
                label="Granularidade"
                value={form.DS_GRANULARIDADE}
                onChange={updateField}
                maxLength={150}
                placeholder="Ex.: Município, imóvel rural, ponto"
              />
            </div>
          </FormSection>

          <FormSection
            icon={<Link2 size={19} />}
            title="Fonte e origem"
            description="Procedência, identificação e condições de acesso aos dados."
          >
            <div className="edit-catalog__grid">
              <FormField
                name="NO_FONTE"
                label="Fonte"
                value={form.NO_FONTE}
                onChange={updateField}
                required
                maxLength={200}
                placeholder="Ex.: IBGE, ANA, INCRA"
              />

              <FormField
                name="DS_ORIGEM"
                label="Origem"
                value={form.DS_ORIGEM}
                onChange={updateField}
                maxLength={255}
                placeholder="Ex.: Base cartográfica oficial"
              />

              <FormField
                name="DS_IDENTIFICADOR_ORIGEM"
                label="Identificador na origem"
                value={form.DS_IDENTIFICADOR_ORIGEM}
                onChange={updateField}
                maxLength={255}
                placeholder="Código ou identificador original"
              />

              <FormField
                name="DS_LICENCA"
                label="Licença de uso"
                value={form.DS_LICENCA}
                onChange={updateField}
                placeholder="Ex.: CC BY 4.0"
              />

              <div className="edit-catalog__full">
                <FormField
                  name="DS_URL_FONTE"
                  label="URL da fonte"
                  type="url"
                  value={form.DS_URL_FONTE}
                  onChange={updateField}
                  placeholder="https://..."
                />
              </div>

              <div className="edit-catalog__full">
                <FormField
                  name="DS_URL_ACESSO"
                  label="URL de acesso"
                  type="url"
                  value={form.DS_URL_ACESSO}
                  onChange={updateField}
                  placeholder="https://..."
                  hint="Endereço para consulta ou obtenção dos dados."
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={<CalendarDays size={19} />}
            title="Atualização e referência"
            description="Periodicidade, atualização da fonte e período de referência."
          >
            <div className="edit-catalog__grid">
              <FormField
                name="CO_PERIODICIDADE"
                label="Periodicidade"
                value={form.CO_PERIODICIDADE}
                onChange={updateField}
                options={periodicidadeOptions}
              />

              <FormField
                name="DT_ULTIMA_BUSCA"
                label="Última busca"
                type="datetime-local"
                value={form.DT_ULTIMA_BUSCA}
                onChange={updateField}
              />

              <FormField
                name="DT_ATUALIZACAO_FONTE"
                label="Atualização da fonte"
                type="date"
                value={form.DT_ATUALIZACAO_FONTE}
                onChange={updateField}
              />

              <div />

              <FormField
                name="DT_REFERENCIA_INICIO"
                label="Início da referência"
                type="date"
                value={form.DT_REFERENCIA_INICIO}
                onChange={updateField}
              />

              <FormField
                name="DT_REFERENCIA_FIM"
                label="Fim da referência"
                type="date"
                value={form.DT_REFERENCIA_FIM}
                onChange={updateField}
              />
            </div>
          </FormSection>

          <FormSection
            icon={<Globe2 size={19} />}
            title="Abrangência territorial"
            description="Cobertura geográfica representada pelo conjunto de dados."
          >
            <div className="edit-catalog__grid">
              <div className="edit-catalog__full">
                <FormField
                  name="DS_ABRANGENCIA_TERRITORIAL"
                  label="Abrangência territorial"
                  value={form.DS_ABRANGENCIA_TERRITORIAL}
                  onChange={updateField}
                  multiline
                  placeholder="Ex.: Estado do Tocantins, municípios do Polo..."
                />
              </div>
            </div>
          </FormSection>

          <FormSection
            icon={<Info size={19} />}
            title="Informações complementares"
            description="Limitações conhecidas e observações sobre os dados."
          >
            <div className="edit-catalog__grid">
              <div className="edit-catalog__full">
                <FormField
                  name="DS_LIMITACOES"
                  label="Limitações"
                  value={form.DS_LIMITACOES}
                  onChange={updateField}
                  multiline
                  placeholder="Descreva limitações metodológicas, espaciais ou temporais."
                />
              </div>

              <div className="edit-catalog__full">
                <FormField
                  name="DS_OBSERVACOES"
                  label="Observações"
                  value={form.DS_OBSERVACOES}
                  onChange={updateField}
                  multiline
                  placeholder="Informações adicionais relevantes."
                />
              </div>
            </div>
          </FormSection>
        </fieldset>

        <footer className="edit-catalog__actions">
          {isEditing && (
            <button
              type="button"
              className="edit-catalog__button edit-catalog__button--danger"
              onClick={() => void handleDelete()}
              disabled={busy}
            >
              <Trash2 size={17} />
              {deleting ? "Inativando..." : "Inativar"}
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
