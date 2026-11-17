import { useEffect, useState, type ReactNode } from "react";

import {
  CalendarDays,
  ExternalLink,
  FileText,
  Globe2,
  Info,
  Layers3,
  Link2,
  LoaderCircle,
} from "lucide-react";

import { apiGet } from "../../../../api/requests/get";
import API_PATHS from "../../../../api/paths";
import { getApiErrorMessage, isApiCancel } from "../../../../api/client";

import { getDominioLabelByKey } from "../../../../config/dominios";

import type { CatalogData } from "../type";

import "./index.css";

// =========================================================
// TYPES
// =========================================================

interface ViewCatalogProps {
  catalogId: number;
}

interface MetadataFieldProps {
  label: string;
  value?: string | number | null;
  url?: string | null;
  fullWidth?: boolean;
  hideEmpty?: boolean;
}

interface MetadataSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  columns?: 2 | 3;
}

// =========================================================
// HELPERS
// =========================================================

function formatDate(value: string | null | undefined): string {
  if (!value) return "Não informado";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? "Não informado"
    : date.toLocaleDateString("pt-BR");
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "Não informado";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Não informado"
    : date.toLocaleString("pt-BR");
}

function getSafeUrl(value: string | null | undefined): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);

    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

// =========================================================
// METADATA FIELD
// =========================================================

function MetadataField({
  label,
  value,
  url,
  fullWidth = false,
  hideEmpty = false,
}: MetadataFieldProps) {
  const safeUrl = getSafeUrl(url);

  const textValue =
    value === null || value === undefined ? "" : String(value).trim();

  const hasValue =
    textValue !== "" &&
    textValue !== "Não informado" &&
    textValue !== "Não informada";

  if (hideEmpty && !hasValue) {
    return null;
  }

  return (
    <div
      className={[
        "view-catalog__field",
        fullWidth ? "view-catalog__field--full" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="view-catalog__label">{label}</span>

      {safeUrl ? (
        <a
          className="view-catalog__link"
          href={safeUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={safeUrl}
        >
          <span className="view-catalog__link-text">{safeUrl}</span>

          <ExternalLink size={13} aria-hidden="true" />
        </a>
      ) : (
        <span
          className={[
            "view-catalog__value",
            !hasValue ? "view-catalog__value--empty" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {hasValue ? textValue : "Não informado"}
        </span>
      )}
    </div>
  );
}

// =========================================================
// METADATA SECTION
// =========================================================

function MetadataSection({
  title,
  icon,
  children,
  columns = 3,
}: MetadataSectionProps) {
  return (
    <section className="view-catalog__section">
      <h3 className="view-catalog__section-title">
        {icon}
        <span>{title}</span>
      </h3>

      <div className={`view-catalog__grid view-catalog__grid--${columns}`}>
        {children}
      </div>
    </section>
  );
}

// =========================================================
// VIEW CATALOG
// =========================================================

export function ViewCatalog({ catalogId }: ViewCatalogProps) {
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =======================================================
  // GET BY ID
  // =======================================================

  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const data = await apiGet<CatalogData>(
          API_PATHS.CATALOG.GET_BY_ID(catalogId),
          {
            signal: controller.signal,
          },
        );

        if (controller.signal.aborted) return;

        setCatalog(data);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted || isApiCancel(err)) {
          return;
        }

        setError(
          getApiErrorMessage(
            err,
            "Não foi possível carregar os detalhes do conjunto de dados.",
          ),
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      controller.abort();
    };
  }, [catalogId]);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="view-catalog__loading" role="status">
        <LoaderCircle size={22} className="view-catalog__spin" />

        <span>Carregando dados do catálogo...</span>
      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error) {
    return (
      <div className="view-catalog__error" role="alert">
        {error}
      </div>
    );
  }

  // =======================================================
  // EMPTY
  // =======================================================

  if (!catalog) {
    return (
      <div className="view-catalog__empty">
        Conjunto de dados não encontrado.
      </div>
    );
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="view-catalog">
      {/* ===================================================
          IDENTIFICAÇÃO
         =================================================== */}

      <MetadataSection
        title="Identificação"
        icon={<FileText size={16} />}
        columns={2}
      >
        <MetadataField
          label="Nome do conjunto de dados"
          value={catalog.NO_CONJUNTO_DADO}
          fullWidth
        />

        <MetadataField
          label="Descrição"
          value={catalog.DS_DESCRICAO}
          fullWidth
        />
      </MetadataSection>

      {/* ===================================================
          CLASSIFICAÇÃO
         =================================================== */}

      <MetadataSection
        title="Classificação"
        icon={<Layers3 size={16} />}
        columns={3}
      >
        <MetadataField
          label="Tipo de dado"
          value={getDominioLabelByKey("TIPO_DADO", catalog.CO_TP_DADO)}
        />

        <MetadataField
          label="Tema"
          value={
            catalog.CO_TEMA !== null
              ? getDominioLabelByKey("TEMA_DADO", catalog.CO_TEMA)
              : null
          }
          hideEmpty
        />

        <MetadataField label="Formato" value={catalog.NO_FORMATO} hideEmpty />

        <MetadataField
          label="Granularidade"
          value={catalog.DS_GRANULARIDADE}
          hideEmpty
        />
      </MetadataSection>

      {/* ===================================================
          FONTE E ORIGEM
         =================================================== */}

      <MetadataSection
        title="Fonte e origem"
        icon={<Link2 size={16} />}
        columns={3}
      >
        <MetadataField label="Fonte" value={catalog.NO_FONTE} />

        <MetadataField label="Origem" value={catalog.DS_ORIGEM} hideEmpty />

        <MetadataField
          label="Identificador na origem"
          value={catalog.DS_IDENTIFICADOR_ORIGEM}
          hideEmpty
        />

        <MetadataField
          label="Licença de uso"
          value={catalog.DS_LICENCA}
          hideEmpty
        />

        <MetadataField
          label="URL da fonte"
          value={catalog.DS_URL_FONTE}
          url={catalog.DS_URL_FONTE}
          fullWidth
          hideEmpty
        />

        <MetadataField
          label="URL de acesso"
          value={catalog.DS_URL_ACESSO}
          url={catalog.DS_URL_ACESSO}
          fullWidth
          hideEmpty
        />
      </MetadataSection>

      {/* ===================================================
          ATUALIZAÇÃO E REFERÊNCIA
         =================================================== */}

      <MetadataSection
        title="Atualização e referência"
        icon={<CalendarDays size={16} />}
        columns={3}
      >
        <MetadataField
          label="Periodicidade"
          value={
            catalog.CO_PERIODICIDADE !== null
              ? getDominioLabelByKey(
                  "PERIODICIDADE_DADO",
                  catalog.CO_PERIODICIDADE,
                )
              : null
          }
          hideEmpty
        />

        <MetadataField
          label="Última busca"
          value={
            catalog.DT_ULTIMA_BUSCA
              ? formatDateTime(catalog.DT_ULTIMA_BUSCA)
              : null
          }
          hideEmpty
        />

        <MetadataField
          label="Atualização da fonte"
          value={
            catalog.DT_ATUALIZACAO_FONTE
              ? formatDate(catalog.DT_ATUALIZACAO_FONTE)
              : null
          }
          hideEmpty
        />

        <MetadataField
          label="Início da referência"
          value={
            catalog.DT_REFERENCIA_INICIO
              ? formatDate(catalog.DT_REFERENCIA_INICIO)
              : null
          }
          hideEmpty
        />

        <MetadataField
          label="Fim da referência"
          value={
            catalog.DT_REFERENCIA_FIM
              ? formatDate(catalog.DT_REFERENCIA_FIM)
              : null
          }
          hideEmpty
        />
      </MetadataSection>

      {/* ===================================================
          ABRANGÊNCIA TERRITORIAL
         =================================================== */}

      <MetadataSection
        title="Abrangência territorial"
        icon={<Globe2 size={16} />}
        columns={2}
      >
        <MetadataField
          label="Abrangência territorial"
          value={catalog.DS_ABRANGENCIA_TERRITORIAL}
          fullWidth
        />
      </MetadataSection>

      {/* ===================================================
          INFORMAÇÕES COMPLEMENTARES
         =================================================== */}

      {(catalog.DS_LIMITACOES || catalog.DS_OBSERVACOES) && (
        <MetadataSection
          title="Informações complementares"
          icon={<Info size={16} />}
          columns={2}
        >
          <MetadataField
            label="Limitações"
            value={catalog.DS_LIMITACOES}
            fullWidth
            hideEmpty
          />

          <MetadataField
            label="Observações"
            value={catalog.DS_OBSERVACOES}
            fullWidth
            hideEmpty
          />
        </MetadataSection>
      )}
    </div>
  );
}
