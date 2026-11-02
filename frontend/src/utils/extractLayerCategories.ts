import type { FeatureCollection } from "geojson";
import type {
  MapLayerDefinition,
  MapLayerLegendItem,
} from "../config/mapLayers";
export function extractLayerCategories(
  geojson: FeatureCollection,
  definition: MapLayerDefinition,
): MapLayerLegendItem[] {
  // Prioriza categorias configuradas manualmente.
  if (definition.legend.length > 0) {
    return definition.legend;
  }

  const categories = new Set<string>();

  for (const feature of geojson.features) {
    const value = feature.properties?.[definition.categoryProperty];

    if (value !== null && value !== undefined && value !== "") {
      categories.add(String(value));
    }
  }

  return Array.from(categories)
    .sort((a, b) =>
      a.localeCompare(b, "pt-BR", {
        numeric: true,
      }),
    )
    .map((value) => ({
      value,
      label: value,
      color: definition.color,
    }));
}
