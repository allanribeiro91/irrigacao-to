import { useState } from "react";

import { GeographicMap } from "../../../components/map/GeographicMap";
import { MapToolsPanel } from "../../../components/map/MapToolsPanel";
import { MAP_LAYERS, type MapLayerLegendItem } from "../../../config/mapLayers";

import "./index.css";

export function GeoPage() {
  const [layers, setLayers] = useState(MAP_LAYERS);

  const [layerFilters, setLayerFilters] = useState<Record<string, string[]>>(
    {},
  );

  const [layerCategories, setLayerCategories] = useState<
    Record<string, MapLayerLegendItem[]>
  >({});

  function toggleLayer(layerId: string) {
    setLayers((current) =>
      current.map((layer) =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer,
      ),
    );
  }

  function clearActiveLayers() {
    setLayers((current) =>
      current.map((layer) => ({
        ...layer,
        enabled: false,
      })),
    );
  }

  function toggleLayerFilter(layerId: string, value: string) {
    const layer = layers.find((item) => item.id === layerId);

    if (!layer) return;

    const categories = layerCategories[layerId] ?? layer.legend;

    setLayerFilters((current) => {
      const selected = current[layerId] ?? categories.map((item) => item.value);

      return {
        ...current,
        [layerId]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  }

  function selectAllLayerFilters(layerId: string) {
    const layer = layers.find((item) => item.id === layerId);

    if (!layer) return;

    const categories = layerCategories[layerId] ?? layer.legend;

    setLayerFilters((current) => ({
      ...current,
      [layerId]: categories.map((item) => item.value),
    }));
  }

  function handleLayerCategoriesLoaded(
    layerId: string,
    categories: MapLayerLegendItem[],
  ) {
    setLayerCategories((current) => ({
      ...current,
      [layerId]: categories,
    }));
  }

  return (
    <section className="geo-page">
      <div className="geo-page__content">
        <MapToolsPanel
          layers={layers}
          layerFilters={layerFilters}
          layerCategories={layerCategories}
          onToggleLayer={toggleLayer}
          onToggleLayerFilter={toggleLayerFilter}
          onSelectAllLayerFilters={selectAllLayerFilters}
          onClearLayers={clearActiveLayers}
        />

        <div className="geo-page__map">
          <GeographicMap
            layers={layers}
            layerFilters={layerFilters}
            onLayerCategoriesLoaded={handleLayerCategoriesLoaded}
          />
        </div>
      </div>
    </section>
  );
}
