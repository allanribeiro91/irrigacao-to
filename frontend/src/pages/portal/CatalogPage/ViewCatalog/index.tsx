import {
  CalendarDays,
  ExternalLink,
  FileText,
  Globe2,
  Info,
  Layers3,
  Link2,
} from "lucide-react";

import type { ReactNode } from "react";

import type { CatalogData } from "../type";

import {
  periodicidadeOptions,
  temaOptions,
  tipoDadoOptions,
} from "../EditCatalog/form";

import "./index.css";
import { getDominioLabelByKey } from "../../../../config/dominios";

interface ViewCatalogProps {
  catalog: CatalogData;
}

function labelOption(
  value: number | null | undefined,
  options: { value: number; label: string }[],
) {
  return (
    options.find((option) => option.value === value)?.label ?? "Não informado"
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Não informado";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? "Não informado"
    : date.toLocaleDateString("pt-BR");
}

function getSafeUrl(value: string | null | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function MetadataField({
  label,
  value,
  url,
}: {
  label: string;
  value?: string | null;
  url?: string | null;
}) {
  const safeUrl = getSafeUrl(url);

  return (
    <div className="view-catalog__field">
      <span className="view-catalog__label">{label}</span>

      {safeUrl ? (
        <a href={safeUrl} target="_blank" rel="noopener noreferrer">
          Acessar endereço
          <ExternalLink size={14} />
        </a>
      ) : (
        <span className="view-catalog__value">{value || "Não informado"}</span>
      )}
    </div>
  );
}

function MetadataSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="view-catalog__section">
      <h3 className="view-catalog__section-title">
        {icon}
        {title}
      </h3>

      <div className="view-catalog__grid">{children}</div>
    </section>
  );
}

export function ViewCatalog({ catalog }: ViewCatalogProps) {
  return (
    <div className="view-catalog">
      <MetadataSection title="Identificação" icon={<FileText size={18} />}>
        <MetadataField
          label="Nome do conjunto de dados"
          value={catalog.NO_CONJUNTO_DADO}
        />

        <MetadataField label="Descrição" value={catalog.DS_DESCRICAO} />
      </MetadataSection>

      <MetadataSection title="Classificação" icon={<Layers3 size={18} />}>
        <MetadataField
          label="Tipo de dado"
          value={getDominioLabelByKey("TIPO_DADO", catalog.CO_TP_DADO)}
        />

        <MetadataField
          label="Tema"
          value={getDominioLabelByKey("TEMA_DADO", catalog.CO_TEMA)}
        />

        <MetadataField label="Formato" value={catalog.NO_FORMATO} />

        <MetadataField label="Granularidade" value={catalog.DS_GRANULARIDADE} />
      </MetadataSection>

      <MetadataSection title="Fonte e origem" icon={<Link2 size={18} />}>
        <MetadataField label="Fonte" value={catalog.NO_FONTE} />

        <MetadataField label="Origem" value={catalog.DS_ORIGEM} />

        <MetadataField
          label="Identificador na origem"
          value={catalog.DS_IDENTIFICADOR_ORIGEM}
        />

        <MetadataField label="Licença" value={catalog.DS_LICENCA} />

        <MetadataField
          label="URL da fonte"
          value={catalog.DS_URL_FONTE}
          url={catalog.DS_URL_FONTE}
        />

        <MetadataField
          label="URL de acesso"
          value={catalog.DS_URL_ACESSO}
          url={catalog.DS_URL_ACESSO}
        />
      </MetadataSection>

      <MetadataSection
        title="Atualização e referência"
        icon={<CalendarDays size={18} />}
      >
        <MetadataField
          label="Periodicidade"
          value={getDominioLabelByKey(
            "PERIODICIDADE_DADO",
            catalog.CO_PERIODICIDADE,
          )}
        />

        <MetadataField
          label="Última busca"
          value={
            catalog.DT_ULTIMA_BUSCA
              ? new Date(catalog.DT_ULTIMA_BUSCA).toLocaleString("pt-BR")
              : undefined
          }
        />

        <MetadataField
          label="Atualização da fonte"
          value={formatDate(catalog.DT_ATUALIZACAO_FONTE)}
        />

        <MetadataField
          label="Início da referência"
          value={formatDate(catalog.DT_REFERENCIA_INICIO)}
        />

        <MetadataField
          label="Fim da referência"
          value={formatDate(catalog.DT_REFERENCIA_FIM)}
        />
      </MetadataSection>

      <MetadataSection
        title="Abrangência territorial"
        icon={<Globe2 size={18} />}
      >
        <MetadataField
          label="Abrangência"
          value={catalog.DS_ABRANGENCIA_TERRITORIAL}
        />
      </MetadataSection>

      <MetadataSection
        title="Informações complementares"
        icon={<Info size={18} />}
      >
        <MetadataField label="Limitações" value={catalog.DS_LIMITACOES} />

        <MetadataField label="Observações" value={catalog.DS_OBSERVACOES} />
      </MetadataSection>
    </div>
  );
}
