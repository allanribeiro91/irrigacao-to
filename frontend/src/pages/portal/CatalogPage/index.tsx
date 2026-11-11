import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Database, Pencil, Plus, RefreshCw, Search } from "lucide-react";

import { getHttpErrorMessage } from "../../../services/httpClient";
import { getCatalog } from "./service";
import type { CatalogData } from "./type";

import "./index.css";

export function CatalogPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState<CatalogData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCatalog() {
    try {
      setLoading(true);
      setError(null);

      const data = await getCatalog({
        offset: 0,
        limit: 100,
      });

      setItems(data);
    } catch (error) {
      setError(
        getHttpErrorMessage(error, "Não foi possível carregar o catálogo."),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadCatalog();
  }, []);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return items;

    return items.filter((item) =>
      [
        item.NO_CONJUNTO_DADO,
        item.DS_DESCRICAO,
        item.NO_FONTE,
        item.NO_FORMATO,
      ].some((value) => value?.toLowerCase().includes(term)),
    );
  }, [items, search]);

  return (
    <section className="catalog-page">
      <header className="catalog-page__header">
        <div className="catalog-page__heading">
          <Database size={25} />

          <div>
            <span>Governança de dados</span>
            <h1>Catálogo de dados</h1>
            <p>Inventário de bases, fontes e metadados.</p>
          </div>
        </div>

        <button
          type="button"
          className="catalog-page__primary-button"
          onClick={() => navigate("/portal/catalogo/novo")}
        >
          <Plus size={18} />
          Novo cadastro
        </button>
      </header>

      <div className="catalog-page__toolbar">
        <div className="catalog-page__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Pesquisar conjuntos de dados..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="catalog-page__secondary-button"
          onClick={() => void loadCatalog()}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Atualizar
        </button>
      </div>

      {error && (
        <div className="catalog-page__error" role="alert">
          {error}
        </div>
      )}

      <div className="catalog-page__table-wrapper">
        <table className="catalog-page__table">
          <thead>
            <tr>
              <th>Conjunto de dados</th>
              <th>Fonte</th>
              <th>Formato</th>
              <th>Última atualização</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>Carregando catálogo...</td>
              </tr>
            ) : filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5}>Nenhum conjunto de dados encontrado.</td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.CO_SEQ_CATALOGO_DADO}>
                  <td>
                    <strong>{item.NO_CONJUNTO_DADO}</strong>
                    <small>{item.DS_DESCRICAO}</small>
                  </td>

                  <td>{item.NO_FONTE}</td>
                  <td>{item.NO_FORMATO || "—"}</td>

                  <td>
                    {item.DT_ATUALIZACAO_FONTE
                      ? new Date(
                          `${item.DT_ATUALIZACAO_FONTE}T12:00:00`,
                        ).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>

                  <td>
                    <button
                      type="button"
                      className="catalog-page__edit-button"
                      title="Editar conjunto de dados"
                      aria-label={`Editar ${item.NO_CONJUNTO_DADO}`}
                      onClick={() =>
                        navigate(
                          `/portal/catalogo/${item.CO_SEQ_CATALOGO_DADO}/editar`,
                        )
                      }
                    >
                      <Pencil size={17} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="catalog-page__footer">
        {filteredItems.length} registros exibidos
      </footer>
    </section>
  );
}
