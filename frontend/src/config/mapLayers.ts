export interface MapLayerLegendItem {
  value: string;
  label: string;
  color: string;
}

export interface MapLayerDefinition {
  id: string;
  group: string;
  name: string;
  description: string;
  color: string;
  url: string;
  enabled: boolean;
  nameProperty: string;
  categoryProperty: string;
  legend: MapLayerLegendItem[];
}

export const MAP_LAYERS: MapLayerDefinition[] = [
  //CAR
  {
    id: "to-car-area-imovel",
    group: "CAR",
    name: "Área dos imóveis",
    description: "Tocantins · Imóveis cadastrados no CAR",
    color: "#fbbf249b",
    url:
      `${import.meta.env.BASE_URL}` +
      "data/brasil/car/tocantins/CAR_AreaImovel.geojson",
    enabled: false,
    nameProperty: "cod_imovel",
    categoryProperty: "ind_status",
    legend: [],
  },
  //POLÍTICO
  {
    id: "to-municipios",
    group: "Político",
    name: "Municípios do Tocantins",
    description: "Tocantins · Limites municipais",
    color: "#98fca042",
    url:
      `${import.meta.env.BASE_URL}` +
      "data/brasil/politico/municipios/tocantins/Mapa-Tocantins_Municipios.geojson",
    enabled: false,
    nameProperty: "name",
    categoryProperty: "id",
    legend: [],
  },
  {
    id: "br-ufs-2025",
    group: "Político",
    name: "Unidades da Federação",
    description: "Brasil · 26 estados e Distrito Federal · IBGE 2025",
    color: "#60a5fa6c",
    url:
      `${import.meta.env.BASE_URL}` +
      "data/brasil/politico/ufs/2025/BR_UF_2025.geojson",
    enabled: false,
    nameProperty: "NM_UF",
    categoryProperty: "CD_UF",
    legend: [],
  },
  {
    id: "br-grandes-regioes-2025",
    group: "Político",
    name: "Grandes Regiões",
    description: "Brasil · Divisão político-administrativa · IBGE 2025",
    color: "#58c8949b",
    url:
      `${import.meta.env.BASE_URL}` +
      "data/brasil/politico/grandes-regioes/2025/BR_Regioes_2025.geojson",
    enabled: true,
    nameProperty: "NM_REGIAO",
    categoryProperty: "CD_REGIAO",
    legend: [
      {
        value: "1",
        label: "Norte",
        color: "#58c8946c",
      },
      {
        value: "2",
        label: "Nordeste",
        color: "#58c8946c",
      },
      {
        value: "5",
        label: "Centro-Oeste",
        color: "#58c8946c",
      },
      {
        value: "3",
        label: "Sudeste",
        color: "#58c8946c",
      },
      {
        value: "4",
        label: "Sul",
        color: "#58c8946c",
      },
    ],
  },

  //IRRIGAÇÃO
  {
    id: "br-polos-nacionais-irrigacao-2021",
    group: "Irrigação",
    name: "Polos nacionais de irrigação",
    description: "Brasil · 28 polos · 2021",
    color: "#22d3ee9b",
    url:
      `${import.meta.env.BASE_URL}` +
      "data/brasil/irrigacao/polos-nacionais/2021/Polos_Nacionais_2021.geojson",
    enabled: false,
    nameProperty: "Polo_irrig",
    categoryProperty: "Tipologia",
    legend: [
      {
        value: "Pivô Central",
        label: "Pivô central",
        color: "#22d3ee9b",
      },
      {
        value: "Arroz por Inundação",
        label: "Arroz por inundação",
        color: "#a78bfa9b",
      },
      {
        value: "Outros",
        label: "Outros",
        color: "#fbbf249b",
      },
    ],
  },
  //TERRAS INDÍGENAS
  {
    id: "br-terras-indigenas",
    group: "Fundiário",
    name: "Terras indígenas",
    description: "Brasil · Terras indígenas poligonais",
    color: "#fb71859b",
    url:
      `${import.meta.env.BASE_URL}` +
      "data/brasil/fundiario/terras-indigenas/tis_poligonais.geojson",
    enabled: false,
    nameProperty: "terrai_nome",
    categoryProperty: "fase_ti",
    legend: [],
  },
];
