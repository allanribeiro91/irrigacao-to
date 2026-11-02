import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";

import { Offcanvas } from "../offcanvas";
import type { SelectedMapFeature } from "./type";

import "./index.css";

interface MapFeatureInfoProps {
  selection: SelectedMapFeature;
  onClose: () => void;
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  return String(value);
}

function formatArea(value: unknown): string {
  if (typeof value !== "number") return "—";

  return `${value.toLocaleString("pt-BR", {
    maximumFractionDigits: 3,
  })} km²`;
}

export function MapFeatureInfo({ selection, onClose }: MapFeatureInfoProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const properties = selection.properties;

  const isUf = properties.CD_UF != null;

  const ibgeCode = properties.CD_UF ?? properties.CD_REGIAO;

  const code =
    ibgeCode ??
    properties.id ??
    properties.OBJECTID ??
    properties.terrai_codigo;

  // A área das terras indígenas está informada em hectares.
  const area =
    typeof properties.AREA_KM2 === "number"
      ? formatArea(properties.AREA_KM2)
      : typeof properties.superficie_perimetro_ha === "number"
        ? `${properties.superficie_perimetro_ha.toLocaleString("pt-BR", {
            maximumFractionDigits: 4,
          })} ha`
        : null;

  const additionalFields = [
    {
      label: "Sigla",
      value: properties.SIGLA_UF ?? properties.SIGLA_RG,
    },
    {
      label: "Região",
      value: isUf ? properties.NM_REGIAO : undefined,
    },
    {
      label: "Tipologia",
      value: properties.Tipologia,
    },
    {
      label: "UF",
      value: properties.uf_sigla,
    },
    {
      label: "Município(s)",
      value: properties.municipio_nome,
    },
    {
      label: "Etnia(s)",
      value: properties.etnia_nome,
    },
    {
      label: "Fase",
      value: properties.fase_ti,
    },
    {
      label: "Modalidade",
      value: properties.modalidade_ti,
    },
    {
      label: "Atualização",
      value: properties.data_atualizacao,
    },
  ];

  const summary = [
    {
      label: ibgeCode != null ? "Código IBGE" : "Código no arquivo",
      value: formatValue(code),
    },

    ...additionalFields
      .filter(
        (item) =>
          item.value !== null && item.value !== undefined && item.value !== "",
      )
      .map((item) => ({
        label: item.label,
        value: formatValue(item.value),
      })),

    ...(area !== null
      ? [
          {
            label: "Área informada",
            value: area,
          },
        ]
      : []),
  ];

  const details = [
    {
      label: "Nome",
      value: selection.name,
    },
    ...summary,
    ...(isUf
      ? [
          {
            label: "Código da região",
            value: formatValue(properties.CD_REGIAO),
          },
          {
            label: "Sigla da região",
            value: formatValue(properties.SIGLA_RG),
          },
        ]
      : []),
    {
      label: "Fonte",
      value: "IBGE",
    },
    {
      label: "Ano de referência",
      value: "2025",
    },
  ];

  return (
    <>
      <section
        className="map-feature-info"
        aria-label={`Informações de ${selection.name}`}
      >
        <header className="map-feature-info__header">
          <div className="map-feature-info__heading">
            <span className="map-feature-info__layer">
              <MapPin size={14} aria-hidden="true" />
              {selection.layerName}
            </span>

            <h2>{selection.name}</h2>
          </div>

          <button
            type="button"
            className="map-feature-info__close"
            onClick={onClose}
            aria-label="Fechar informações do território"
          >
            <X size={18} />
          </button>
        </header>

        <dl className="map-feature-info__summary">
          {summary.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <footer className="map-feature-info__footer">
          <span>IBGE · 2025</span>

          <button
            type="button"
            className="map-feature-info__more"
            onClick={() => setDetailsOpen(true)}
          >
            <Plus size={16} aria-hidden="true" />
            Mais informações
          </button>
        </footer>
      </section>

      <Offcanvas
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        title={selection.name}
        subtitle={selection.layerName}
        width={600}
      >
        <section className="map-feature-details">
          <h3>Informações do território</h3>

          <dl className="map-feature-details__list">
            {details.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </Offcanvas>
    </>
  );
}
