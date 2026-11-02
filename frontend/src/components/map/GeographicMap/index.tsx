import { useCallback, useEffect, useState } from "react";

import { geoJSON } from "leaflet";
import type { GeoJSON as LeafletGeoJSON } from "leaflet";

import {
  LayersControl,
  MapContainer,
  ScaleControl,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";

import type {
  MapLayerDefinition,
  MapLayerLegendItem,
} from "../../../config/mapLayers";

import "./index.css";
import type { SelectedMapFeature } from "../../MapFeatureInfo/type";
import { MapFeatureInfo } from "../../MapFeatureInfo";
import { filterLayerGeoJSON } from "./filterLayerGeoJSON";
import { extractLayerCategories } from "../../../utils/extractLayerCategories";

const TOCANTINS_CENTER: [number, number] = [-10.1753, -48.2982];

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const updateMapSize = () => {
      map.invalidateSize({
        animate: false,
        pan: false,
      });
    };

    /*
     * Aguarda o navegador concluir o primeiro cálculo
     * das dimensões do layout.
     */
    const frameId = window.requestAnimationFrame(updateMapSize);

    /*
     * Recalcula o Leaflet sempre que o workspace mudar
     * de tamanho.
     */
    const resizeObserver = new ResizeObserver(updateMapSize);

    resizeObserver.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [map]);

  return null;
}

interface LocalGeoJsonLayerProps {
  definition: MapLayerDefinition;
  selectedValues?: string[];
  onSelect: (selection: SelectedMapFeature) => void;
  onClearSelection: (layerId: string) => void;
  onLayerCategoriesLoaded: (
    layerId: string,
    categories: MapLayerLegendItem[],
  ) => void;
}

function LocalGeoJsonLayer({
  definition,
  selectedValues,
  onSelect,
  onClearSelection,
  onLayerCategoriesLoaded,
}: LocalGeoJsonLayerProps) {
  const map = useMap();

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const controller = new AbortController();

    let overlay: LeafletGeoJSON | undefined;

    async function loadLayer() {
      try {
        setStatus("loading");

        // 1. Carregar o arquivo GeoJSON
        const response = await fetch(definition.url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Não foi possível carregar a camada: HTTP ${response.status}`,
          );
        }

        const data = await response.json();

        // 2. Validar a estrutura do GeoJSON
        if (
          data.type !== "FeatureCollection" ||
          !Array.isArray(data.features) ||
          data.features.length === 0
        ) {
          throw new Error("O arquivo não contém uma camada GeoJSON válida.");
        }

        if (controller.signal.aborted) return;

        // 3. Extrair automaticamente as categorias
        const categories = extractLayerCategories(data, definition);

        // 4. Informar as categorias disponíveis ao componente pai
        onLayerCategoriesLoaded(definition.id, categories);

        // 5. Filtrar as feições conforme as categorias selecionadas
        const filteredGeoJSON = filterLayerGeoJSON(
          data,
          definition,
          selectedValues,
        );

        if (controller.signal.aborted) return;

        // 6. Criar a camada GeoJSON do Leaflet
        overlay = geoJSON(filteredGeoJSON, {
          attribution:
            'Dados geográficos: <a href="https://www.ibge.gov.br/" target="_blank" rel="noopener noreferrer">IBGE</a>',

          // Estilização das feições
          style: (feature) => {
            const category = String(
              feature?.properties?.[definition.categoryProperty] ?? "",
            );

            const legendItem = categories.find(
              (item) => item.value === category,
            );

            return {
              color: "#f1f5f9",
              weight: 1.5,
              opacity: 0.9,
              fillColor: legendItem?.color ?? definition.color,
              fillOpacity: 0.42,
            };
          },

          // Configuração das interações com as feições
          onEachFeature: (feature, layer) => {
            const properties: Record<string, unknown> =
              feature.properties ?? {};

            const name = String(
              properties[definition.nameProperty] ?? definition.name,
            );

            // Tooltip com o nome da feição
            const tooltip = document.createElement("span");
            tooltip.textContent = name;

            layer.bindTooltip(tooltip, {
              sticky: true,
              className: "geographic-map__tooltip",
            });

            // Selecionar feição ao clicar
            layer.on("click", () => {
              layer.closeTooltip();

              onSelect({
                id: String(
                  feature.id ??
                    properties.CD_UF ??
                    properties.CD_REGIAO ??
                    properties.id ??
                    properties.OBJECTID ??
                    properties.terrai_codigo ??
                    name,
                ),
                layerId: definition.id,
                layerName: definition.name,
                name,
                properties,
              });
            });
          },
        });

        // 7. Adicionar a camada ao mapa
        if (controller.signal.aborted) return;

        overlay.addTo(map);

        // Não alterar automaticamente zoom ou posição do mapa.

        // 8. Finalizar carregamento
        setStatus("ready");
      } catch (error) {
        if (controller.signal.aborted) return;

        overlay?.remove();

        console.error(`Erro ao carregar a camada "${definition.name}":`, error);

        setStatus("error");
      }
    }

    void loadLayer();

    return () => {
      controller.abort();
      overlay?.remove();
      onClearSelection(definition.id);
    };
  }, [definition, selectedValues, map, onSelect, onClearSelection]);

  if (status === "ready") return null;

  return (
    <div
      className="geographic-map__layer-status"
      role={status === "error" ? "alert" : "status"}
    >
      {status === "loading"
        ? `Carregando ${definition.name}...`
        : `Não foi possível carregar ${definition.name}. Atualize a página para tentar novamente.`}
    </div>
  );
}

interface GeographicMapProps {
  layers: MapLayerDefinition[];
  layerFilters: Record<string, string[]>;
  onLayerCategoriesLoaded: (
    layerId: string,
    categories: MapLayerLegendItem[],
  ) => void;
}

export function GeographicMap({
  layers,
  layerFilters,
  onLayerCategoriesLoaded,
}: GeographicMapProps) {
  const [selectedFeature, setSelectedFeature] =
    useState<SelectedMapFeature | null>(null);

  const clearLayerSelection = useCallback((layerId: string) => {
    setSelectedFeature((current) =>
      current?.layerId === layerId ? null : current,
    );
  }, []);

  return (
    <div className="geographic-map">
      <MapContainer
        center={TOCANTINS_CENTER}
        zoom={6}
        minZoom={2}
        maxZoom={19}
        zoomControl={false}
        className="geographic-map__container"
      >
        <MapResizeHandler />

        {layers
          .filter((definition) => definition.enabled)
          .map((definition) => (
            <LocalGeoJsonLayer
              key={definition.id}
              definition={definition}
              selectedValues={layerFilters[definition.id]}
              onSelect={setSelectedFeature}
              onClearSelection={clearLayerSelection}
              onLayerCategoriesLoaded={onLayerCategoriesLoaded}
            />
          ))}

        <ZoomControl position="topright" />

        <ScaleControl position="bottomleft" imperial={false} metric />

        <LayersControl position="topright">
          {/* RODOVIÁRIO */}
          <LayersControl.BaseLayer name="Rodoviário" checked>
            <TileLayer
              attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>

          {/* RELEVO */}
          <LayersControl.BaseLayer name="Relevo">
            <TileLayer
              attribution='© OpenStreetMap contributors | © <a href="https://opentopomap.org/">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
              maxZoom={17}
            />
          </LayersControl.BaseLayer>

          {/* SATÉLITE */}
          <LayersControl.BaseLayer name="Satélite">
            <TileLayer
              attribution="Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics and the GIS User Community"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
      </MapContainer>

      {selectedFeature && (
        <MapFeatureInfo
          key={`${selectedFeature.layerId}:${selectedFeature.id}`}
          selection={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </div>
  );
}
