import { useEffect, useMemo, useState } from "react";
import { Database, LoaderCircle, Pencil, Plus, Search } from "lucide-react";
import { CustomOffcanvas } from "../../../components/CustomOffcanvas";
import { getApiErrorMessage, isApiCancel } from "../../../api/client";
import { useUser } from "../../../providers/UserProvider/context";
import { CardCatalog } from "./CardCatalog";
import { ViewCatalog } from "./ViewCatalog";
import { EditCatalog } from "./EditCatalog";
import type { CatalogData } from "./type";
import { apiGet } from "../../../api/requests/get";
import API_PATHS from "../../../api/paths";
import "./index.css";

type CatalogMode = "view" | "edit" | "create";

export function CatalogPage() {
  const { isAdmin } = useUser();
  const canManageCatalog = isAdmin;

  // =========================================================
  // LISTAGEM
  // =========================================================
  const [items, setItems] = useState<CatalogData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================================================
  // OFFCANVAS
  // =========================================================
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [mode, setMode] = useState<CatalogMode>("view");

  const overlayContainer =
    typeof document !== "undefined"
      ? document.querySelector<HTMLElement>(".l-workspace__content")
      : null;

  // =========================================================
  // RECARREGAR CATÁLOGO
  // =========================================================
  async function refreshCatalog() {
    try {
      const data = await apiGet<CatalogData[]>(API_PATHS.CATALOG.LIST, {
        params: {
          offset: 0,
          limit: 100,
        },
      });

      setItems(data);
      setError(null);
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Não foi possível atualizar o catálogo."),
      );
    }
  }

  // =========================================================
  // GET ALL - CARREGAMENTO INICIAL
  // =========================================================
  useEffect(() => {
    const controller = new AbortController();

    async function loadCatalog() {
      try {
        const data = await apiGet<CatalogData[]>(API_PATHS.CATALOG.LIST, {
          params: {
            offset: 0,
            limit: 100,
          },
          signal: controller.signal,
        });

        if (controller.signal.aborted) return;

        setItems(data);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted || isApiCancel(err)) return;

        setError(
          getApiErrorMessage(err, "Não foi possível carregar o catálogo."),
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadCatalog();

    return () => {
      controller.abort();
    };
  }, []);

  // =========================================================
  // FILTRO LOCAL
  // =========================================================
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

  // =========================================================
  // AÇÕES DO OFFCANVAS
  // =========================================================
  function openCatalog(catalog: CatalogData) {
    setSelectedId(catalog.CO_SEQ_CATALOGO_DADO);
    setMode("view");
    setPanelOpen(true);
  }

  function openCreate() {
    if (!canManageCatalog) return;

    setSelectedId(null);
    setMode("create");
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setMode("view");
    setSelectedId(null);
  }

  // =========================================================
  // CONFIGURAÇÃO DO OFFCANVAS
  // =========================================================
  const selectedItem = items.find(
    (item) => item.CO_SEQ_CATALOGO_DADO === selectedId,
  );

  const panelTitle =
    mode === "create"
      ? "Novo conjunto de dados"
      : mode === "edit"
        ? "Editar conjunto de dados"
        : (selectedItem?.NO_CONJUNTO_DADO ?? "Conjunto de dados");

  // =========================================================
  // RENDER
  // =========================================================
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

      {/* ERRO */}
      {error && (
        <div className="catalog-page__error" role="alert">
          {error}
        </div>
      )}

      {/* LISTAGEM */}
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

      {/* OFFCANVAS */}
      <CustomOffcanvas
        open={panelOpen}
        onClose={closePanel}
        container={overlayContainer}
        width="60vw"
        title={panelTitle}
        subtitle="Catálogo de dados"
        headerActions={
          mode === "view" && selectedId !== null && canManageCatalog ? (
            <button
              type="button"
              className="catalog-page__edit-button"
              onClick={() => setMode("edit")}
              title="Editar conjunto de dados"
              aria-label="Editar conjunto de dados"
            >
              <Pencil size={17} strokeWidth={1.8} />
            </button>
          ) : undefined
        }
      >
        {/* VISUALIZAÇÃO */}
        {mode === "view" && selectedId !== null && (
          <ViewCatalog key={`view-${selectedId}`} catalogId={selectedId} />
        )}

        {/* CADASTRO OU EDIÇÃO */}
        {(mode === "create" || mode === "edit") && canManageCatalog && (
          <EditCatalog
            key={
              mode === "create"
                ? "catalog-create"
                : `catalog-edit-${selectedId}`
            }
            catalogId={mode === "edit" ? selectedId : null}
            onSaved={refreshCatalog}
            onClose={closePanel}
          />
        )}
      </CustomOffcanvas>
    </section>
  );
}
