export interface SelectedMapFeature {
  id: string;
  layerId: string;
  layerName: string;
  name: string;
  properties: Record<string, unknown>;
}
