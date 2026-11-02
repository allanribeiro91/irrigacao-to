import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

import type { MapLayerDefinition } from "../../../config/mapLayers";

export function filterLayerGeoJSON(
  geojson: FeatureCollection<Geometry, GeoJsonProperties>,
  layer: MapLayerDefinition,
  selectedValues?: string[],
): FeatureCollection<Geometry, GeoJsonProperties> {
  // Sem filtro definido, exibe todas as feições.
  if (selectedValues === undefined) {
    return geojson;
  }

  const allowedValues = new Set(selectedValues);

  return {
    ...geojson,
    features: geojson.features.filter((feature) => {
      const category = feature.properties?.[layer.categoryProperty];

      if (category === null || category === undefined) {
        return false;
      }

      return allowedValues.has(String(category));
    }),
  };
}
