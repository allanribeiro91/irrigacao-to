import { useEffect, useMemo, useState } from "react";

import {
  Database,
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";

import { CustomOffcanvas } from "../../../components/CustomOffcanvas";
import { getHttpErrorMessage } from "../../../services/httpClient";

import { CardCatalog } from "./CardCatalog";
import { ViewCatalog } from "./ViewCatalog";
import { EditCatalog } from "./EditCatalog";

import { getCatalog, getCatalogById } from "./service";

import type { CatalogData } from "./type";

import "./index.css";
import { useUser } from "../../../providers/UserProvider/context";

type CatalogMode = "view" | "edit" | "create";

export function CatalogPage() {
  const [items, setItems] = useState<CatalogData[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCatalog, setSelectedCatalog] = useState<CatalogData | null>(
    null,
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [mode, setMode] = useState<CatalogMode>("view");

  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const [panelOpen, setPanelOpen] = useState(false);

  // Integrar com as permissões reais do usuário.
  // A API também deve validar essas permissões.
  const { isAdmin } = useUser();

  const canManageCatalog = isAdmin;

  // O container é o box principal da workspace.
  const overlayContainer =
    typeof document !== "undefined"
      ? document.querySelector<HTMLElement>(".l-workspace__content")
      : null;

  async function loadCatalog(showLoading = true) {
    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const data = await getCatalog({
        offset: 0,
        limit: 100,
      });

      setItems(data);
      setError(null);
    } catch (err) {
      setError(
        getHttpErrorMessage(err, "Não foi possível carregar o catálogo."),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getCatalog({
          offset: 0,
          limit: 100,
        });

        if (active) {
          setItems(data);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(
            getHttpErrorMessage(err, "Não foi possível carregar o catálogo."),
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  // Consulta os metadados completos do item selecionado.
  useEffect(() => {
    if (!panelOpen || mode === "create" || selectedId === null) {
      return;
    }

    let active = true;

    async function loadDetails() {
      try {
        setDetailsLoading(true);
        setDetailsError(null);

        const data = await getCatalogById(selectedId!);

        if (active) {
          setSelectedCatalog(data);
        }
      } catch (err) {
        if (active) {
          setDetailsError(
            getHttpErrorMessage(err, "Não foi possível carregar os detalhes."),
          );
        }
      } finally {
        if (active) setDetailsLoading(false);
      }
    }

    void loadDetails();

    return () => {
      active = false;
    };
  }, [panelOpen, selectedId, mode === "create"]);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");

    if (!term) return items;

    return items.filter((item) =>
      [
        item.NO_CONJUNTO_DADO,
        item.DS_DESCRICAO,
        item.NO_FONTE,
        item.NO_FORMATO,
      ].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("pt-BR")
          .includes(term),
      ),
    );
  }, [items, search]);

  function openCatalog(catalog: CatalogData) {
    setSelectedCatalog(catalog);
    setSelectedId(catalog.CO_SEQ_CATALOGO_DADO);
    setMode("view");
    setDetailsError(null);
    setPanelOpen(true);
  }

  function openCreate() {
    if (!canManageCatalog) return;

    setSelectedCatalog(null);
    setSelectedId(null);
    setMode("create");
    setDetailsError(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setMode("view");
  }

  async function handleSaved() {
    await loadCatalog();

    if (mode === "create") {
      closePanel();
      return;
    }

    if (selectedId !== null) {
      const updated = await getCatalogById(selectedId);
      setSelectedCatalog(updated);
    }

    setMode("view");
  }

  async function handleDeleted() {
    closePanel();
    await loadCatalog();
  }

  const panelTitle =
    mode === "create"
      ? "Novo conjunto de dados"
      : mode === "edit"
        ? "Editar conjunto de dados"
        : (selectedCatalog?.NO_CONJUNTO_DADO ?? "Conjunto de dados");

  return (
    <section className="catalog-page">
      {/* FILTROS E AÇÕES */}
      <div className="catalog-page__toolbar">
        <label className="catalog-page__search">
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            aria-label="Pesquisar conjuntos de dados"
            placeholder="Pesquisar conjuntos de dados..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <div className="catalog-page__toolbar-actions">
          <button
            type="button"
            className="catalog-page__secondary-button"
            onClick={() => void loadCatalog()}
            disabled={loading}
          >
            <RefreshCw size={17} />
            Atualizar
          </button>

          {canManageCatalog && (
            <button
              type="button"
              className="catalog-page__primary-button"
              onClick={openCreate}
            >
              <Plus size={17} />
              Novo cadastro
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="catalog-page__error" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="catalog-page__state">
          <LoaderCircle size={22} className="catalog-page__spin" />
          Carregando catálogo...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="catalog-page__state">
          <Database size={28} />
          Nenhum conjunto de dados encontrado.
        </div>
      ) : (
        <div className="catalog-page__list">
          {filteredItems.map((catalog) => (
            <CardCatalog
              key={catalog.CO_SEQ_CATALOGO_DADO}
              catalog={catalog}
              onClick={openCatalog}
            />
          ))}
        </div>
      )}

      <footer className="catalog-page__footer">
        {filteredItems.length} registros exibidos
      </footer>

      <CustomOffcanvas
        open={panelOpen}
        onClose={closePanel}
        container={overlayContainer}
        width={"60vw"}
        title={panelTitle}
        subtitle="Catálogo de dados"
        footer={
          mode === "view" && selectedCatalog && canManageCatalog ? (
            <button
              type="button"
              className="catalog-page__primary-button"
              onClick={() => setMode("edit")}
            >
              <Pencil size={16} />
              Editar conjunto de dados
            </button>
          ) : undefined
        }
      >
        {mode === "create" || mode === "edit" ? (
          canManageCatalog ? (
            <EditCatalog
              catalog={mode === "edit" ? selectedCatalog : null}
              embedded
              onCancel={() => {
                if (mode === "create") {
                  closePanel();
                } else {
                  setMode("view");
                }
              }}
              onSaved={() => void handleSaved()}
              onDeleted={() => void handleDeleted()}
            />
          ) : null
        ) : detailsLoading ? (
          <div className="catalog-page__state">Carregando detalhes...</div>
        ) : detailsError ? (
          <div className="catalog-page__error" role="alert">
            {detailsError}
          </div>
        ) : selectedCatalog ? (
          <ViewCatalog catalog={selectedCatalog} />
        ) : null}
      </CustomOffcanvas>
    </section>
  );
}
