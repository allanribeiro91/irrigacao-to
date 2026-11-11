import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Database,
  Layers3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

import type {
  MapLayerDefinition,
  MapLayerLegendItem,
} from "../../../config/mapLayers";

import "./index.css";

interface MapToolsPanelProps {
  layers: MapLayerDefinition[];
  layerFilters: Record<string, string[]>;
  layerCategories: Record<string, MapLayerLegendItem[]>;
  onToggleLayer: (layerId: string) => void;
  onToggleLayerFilter: (layerId: string, value: string) => void;
  onSelectAllLayerFilters: (layerId: string) => void;
  onClearLayers: () => void;
}

export function MapToolsPanel({
  layers,
  layerFilters,
  layerCategories,
  onToggleLayer,
  onToggleLayerFilter,
  onSelectAllLayerFilters,
  onClearLayers,
}: MapToolsPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSearch, setFilterSearch] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<string[]>([]);
  const [filterLayerId, setFilterLayerId] = useState<string | null>(null);

  const searchTerm = search.trim().toLocaleLowerCase("pt-BR");
  const filteredLayers = layers.filter((layer) =>
    `${layer.name} ${layer.group} ${layer.description}`
      .toLocaleLowerCase("pt-BR")
      .includes(searchTerm),
  );

  const groups = Array.from(
    new Set(filteredLayers.map((layer) => layer.group)),
  ).map((name) => ({
    name,
    layers: filteredLayers.filter((layer) => layer.group === name),
  }));

  const activeLayers = layers.filter((layer) => layer.enabled);
  const filterLayer = layers.find(
    (layer) => layer.id === filterLayerId && layer.enabled,
  );

  // const isFiltersView = filterLayerId !== null && !!filterLayer;
  const filterCategories = filterLayer
    ? (layerCategories[filterLayer.id] ?? filterLayer.legend)
    : [];
  const selectedFilterValues = filterLayer
    ? (layerFilters[filterLayer.id] ??
      filterCategories.map((item) => item.value))
    : [];
  const filterSearchTerm = filterSearch.trim().toLocaleLowerCase("pt-BR");
  const visibleFilterCategories = filterCategories.filter((item) =>
    `${item.label} ${item.value}`
      .toLocaleLowerCase("pt-BR")
      .includes(filterSearchTerm),
  );

  function toggleGroup(groupName: string) {
    setCollapsedGroups((current) =>
      current.includes(groupName)
        ? current.filter((name) => name !== groupName)
        : [...current, groupName],
    );
  }

  function openFilters(layerId: string) {
    setFilterSearch("");
    setFilterLayerId(layerId);
  }

  function closeFilters() {
    setFilterLayerId(null);
    setFilterSearch("");
  }

  function collapsePanel() {
    closeFilters();
    setExpanded(false);
  }

  return (
    <aside
      className={`map-tools ${expanded ? "map-tools--expanded" : "map-tools--collapsed"}`}
      aria-label="Camadas do mapa"
    >
      {!expanded ? (
        <button
          type="button"
          className="map-tools__expand"
          onClick={() => setExpanded(true)}
          title="Expandir camadas"
          aria-label="Expandir painel de camadas"
        >
          <Layers3 size={20} aria-hidden="true" />
          {activeLayers.length > 0 && (
            <strong className="map-tools__counter">
              {activeLayers.length}
            </strong>
          )}
          <ChevronRight size={15} aria-hidden="true" />
        </button>
      ) : (
        <div className="map-tools__panel">
          <header className="map-tools__header">
            <div>
              <span>Mapa</span>
              <h2>Camadas</h2>
            </div>
            <button
              type="button"
              className="map-tools__close"
              onClick={collapsePanel}
              title="Recolher painel"
              aria-label="Recolher painel de camadas"
            >
              <ChevronLeft size={19} aria-hidden="true" />
            </button>
          </header>

          <div className="map-tools__content">
            <label className="map-tools__search">
              <Search size={17} aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar camada..."
                aria-label="Buscar camada"
              />
            </label>

            <section className="map-tools__section">
              <div className="map-tools__section-header">
                <div>
                  <Layers3 size={16} aria-hidden="true" />
                  <h3>Camadas disponíveis</h3>
                </div>
                <span>{layers.length}</span>
              </div>

              <div className="map-tools__groups">
                {groups.map((group) => {
                  const isOpen =
                    searchTerm.length > 0 ||
                    !collapsedGroups.includes(group.name);

                  return (
                    <div className="map-tools__group" key={group.name}>
                      <button
                        type="button"
                        className="map-tools__group-header"
                        onClick={() => toggleGroup(group.name)}
                        aria-expanded={isOpen}
                        disabled={searchTerm.length > 0}
                      >
                        <span className="map-tools__group-title">
                          <ChevronDown
                            size={16}
                            className={`map-tools__group-chevron ${!isOpen ? "map-tools__group-chevron--collapsed" : ""}`}
                            aria-hidden="true"
                          />
                          <strong>{group.name}</strong>
                        </span>
                        <span className="map-tools__group-count">
                          {group.layers.length}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="map-tools__layer-list">
                          {group.layers.map((layer) => {
                            const categories =
                              layerCategories[layer.id] ?? layer.legend;
                            const selectedValues =
                              layerFilters[layer.id] ??
                              categories.map((item) => item.value);
                            const hasFilters = categories.length > 0;
                            const isFiltered =
                              hasFilters &&
                              selectedValues.length !== categories.length;

                            return (
                              <div
                                className="map-tools__layer-container"
                                key={layer.id}
                              >
                                <label
                                  className={`map-tools__layer ${layer.enabled ? "map-tools__layer--active" : ""}`}
                                >
                                  <span
                                    className="map-tools__layer-color"
                                    style={{ backgroundColor: layer.color }}
                                    aria-hidden="true"
                                  />
                                  <span className="map-tools__layer-information">
                                    <strong>{layer.name}</strong>
                                    <small>{layer.description}</small>
                                  </span>
                                  <input
                                    type="checkbox"
                                    checked={layer.enabled}
                                    onChange={() => onToggleLayer(layer.id)}
                                    aria-label={`Exibir ${layer.name}`}
                                  />
                                  <span
                                    className="map-tools__switch"
                                    aria-hidden="true"
                                  />
                                </label>

                                {layer.enabled && (
                                  <div className="map-tools__layer-actions">
                                    <div className="map-tools__layer-filter-summary">
                                      <SlidersHorizontal
                                        size={14}
                                        aria-hidden="true"
                                      />
                                      <span>
                                        {categories.length > 0
                                          ? `${selectedValues.length} de ${categories.length} ${categories.length === 1 ? "categoria" : "categorias"}`
                                          : "Filtros da camada"}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      className={`map-tools__filter-button ${isFiltered ? "map-tools__filter-button--active" : ""}`}
                                      onClick={() => openFilters(layer.id)}
                                      aria-label={`Configurar filtros de ${layer.name}`}
                                    >
                                      Filtrar
                                      <ChevronRight
                                        size={14}
                                        aria-hidden="true"
                                      />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {groups.length === 0 && (
                  <div className="map-tools__empty">
                    Nenhuma camada encontrada.
                  </div>
                )}
              </div>
            </section>

            {activeLayers.length > 0 && (
              <section className="map-tools__section">
                <div className="map-tools__section-header">
                  <div>
                    <Database size={16} aria-hidden="true" />
                    <h3>Camadas ativas</h3>
                  </div>
                  <button type="button" onClick={onClearLayers}>
                    Limpar
                  </button>
                </div>
                <div className="map-tools__active-layers">
                  {activeLayers.map((layer) => (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => onToggleLayer(layer.id)}
                      title={`Remover ${layer.name}`}
                    >
                      <span style={{ backgroundColor: layer.color }} />
                      {layer.name}
                      <X size={13} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {filterLayer && (
            <div
              className="map-tools__filters-panel"
              aria-label={`Filtros de ${filterLayer.name}`}
            >
              <header className="map-tools__filters-header">
                <button
                  type="button"
                  className="map-tools__filters-back"
                  onClick={closeFilters}
                  title="Voltar para camadas"
                  aria-label="Voltar para camadas"
                >
                  <ChevronLeft size={19} aria-hidden="true" />
                </button>
                <div>
                  <span>Filtros da camada</span>
                  <h2>{filterLayer.name}</h2>
                </div>
              </header>

              <div className="map-tools__filters-content">
                {filterCategories.length > 0 ? (
                  <>
                    <label className="map-tools__search">
                      <Search size={17} aria-hidden="true" />
                      <input
                        type="search"
                        value={filterSearch}
                        onChange={(event) =>
                          setFilterSearch(event.target.value)
                        }
                        placeholder="Buscar categoria..."
                        aria-label="Buscar categoria"
                      />
                    </label>

                    <div className="map-tools__filters-summary">
                      <span>
                        {selectedFilterValues.length} de{" "}
                        {filterCategories.length} selecionados
                      </span>
                      <button
                        type="button"
                        onClick={() => onSelectAllLayerFilters(filterLayer.id)}
                      >
                        Selecionar todos
                      </button>
                    </div>

                    <div className="map-tools__filter-list">
                      {visibleFilterCategories.map((item) => (
                        <label
                          key={item.value}
                          className="map-tools__filter-item"
                        >
                          <input
                            type="checkbox"
                            checked={selectedFilterValues.includes(item.value)}
                            onChange={() =>
                              onToggleLayerFilter(filterLayer.id, item.value)
                            }
                          />
                          <span
                            className="map-tools__filter-color"
                            style={{ backgroundColor: item.color }}
                            aria-hidden="true"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                      {visibleFilterCategories.length === 0 && (
                        <div className="map-tools__empty">
                          Nenhuma categoria encontrada.
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="map-tools__empty">
                    As categorias ainda não foram carregadas ou não há filtros
                    disponíveis para esta camada.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
