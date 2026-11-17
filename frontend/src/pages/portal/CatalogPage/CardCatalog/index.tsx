import {
  CalendarDays,
  ChevronRight,
  Database,
  FileType2,
  Landmark,
  RefreshCw,
} from "lucide-react";

import type { CatalogData } from "../type";

// Ajuste o caminho conforme a estrutura do projeto
import { getDominioLabelByKey } from "../../../../config/dominios";

import "./index.css";

interface CardCatalogProps {
  catalog: CatalogData;
  onClick: (catalog: CatalogData) => void;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Não informada";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? "Não informada"
    : date.toLocaleDateString("pt-BR");
}

export function CardCatalog({ catalog, onClick }: CardCatalogProps) {
  const tipoDado = getDominioLabelByKey("TIPO_DADO", catalog.CO_TP_DADO);

  const tema = catalog.CO_TEMA
    ? getDominioLabelByKey("TEMA_DADO", catalog.CO_TEMA)
    : null;

  const periodicidade = catalog.CO_PERIODICIDADE
    ? getDominioLabelByKey("PERIODICIDADE_DADO", catalog.CO_PERIODICIDADE)
    : null;

  return (
    <button
      type="button"
      className="card-catalog"
      onClick={() => onClick(catalog)}
      aria-label={`Visualizar ${catalog.NO_CONJUNTO_DADO}`}
    >
      <span className="card-catalog__icon">
        <Database size={21} strokeWidth={1.7} />
      </span>

      <span className="card-catalog__body">
        {/* IDENTIFICAÇÃO */}
        <span className="card-catalog__header">
          <strong className="card-catalog__title">
            {catalog.NO_CONJUNTO_DADO}
          </strong>
        </span>

        <span className="card-catalog__description">
          {catalog.DS_DESCRICAO}
        </span>

        {/* CLASSIFICAÇÃO E METADADOS */}
        <span className="card-catalog__footer">
          <span className="card-catalog__tags">
            <span className="card-catalog__tag">{tipoDado}</span>

            {tema && <span className="card-catalog__tag">{tema}</span>}

            {catalog.NO_FORMATO && (
              <span className="card-catalog__tag">
                <FileType2 size={12} />
                {catalog.NO_FORMATO}
              </span>
            )}
          </span>

          <span className="card-catalog__metadata">
            <span
              className="card-catalog__metadata-item"
              title="Fonte dos dados"
            >
              <Landmark size={13} />
              {catalog.NO_FONTE}
            </span>

            {periodicidade && (
              <span
                className="card-catalog__metadata-item"
                title="Periodicidade"
              >
                <RefreshCw size={12} />
                {periodicidade}
              </span>
            )}

            <span
              className="card-catalog__metadata-item"
              title="Última atualização da fonte"
            >
              <CalendarDays size={13} />
              {formatDate(catalog.DT_ATUALIZACAO_FONTE)}
            </span>
          </span>
        </span>
      </span>

      <ChevronRight
        size={18}
        className="card-catalog__arrow"
        aria-hidden="true"
      />
    </button>
  );
}
