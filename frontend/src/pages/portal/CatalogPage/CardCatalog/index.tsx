import { CalendarDays, ChevronRight, Database, FileType } from "lucide-react";

import type { CatalogData } from "../type";

import "./index.css";

interface CardCatalogProps {
  catalog: CatalogData;
  onClick: (catalog: CatalogData) => void;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Não informada";

  const date = new Date(`${value.slice(0, 10)}T12:00:00`);

  return Number.isNaN(date.getTime())
    ? "Não informada"
    : date.toLocaleDateString("pt-BR");
}

export function CardCatalog({ catalog, onClick }: CardCatalogProps) {
  return (
    <button
      type="button"
      className="card-catalog"
      onClick={() => onClick(catalog)}
      aria-label={`Visualizar ${catalog.NO_CONJUNTO_DADO}`}
    >
      <span className="card-catalog__icon">
        <Database size={23} strokeWidth={1.7} />
      </span>

      <span className="card-catalog__content">
        <strong className="card-catalog__title">
          {catalog.NO_CONJUNTO_DADO}
        </strong>

        <span className="card-catalog__description">
          {catalog.DS_DESCRICAO}
        </span>

        <span className="card-catalog__metadata">
          <span>{catalog.NO_FONTE}</span>

          {catalog.NO_FORMATO && (
            <span>
              <FileType size={13} />
              {catalog.NO_FORMATO}
            </span>
          )}

          <span>
            <CalendarDays size={13} />
            {formatDate(catalog.DT_ATUALIZACAO_FONTE)}
          </span>
        </span>
      </span>

      <ChevronRight
        size={19}
        className="card-catalog__arrow"
        aria-hidden="true"
      />
    </button>
  );
}
