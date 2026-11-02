import {
  ChartNoAxesCombined,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  Map,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router";

import "./index.css";

const navigationItems = [
  {
    label: "Geo",
    path: "/portal/geografico",
    icon: Map,
  },
  {
    label: "Painéis",
    path: "/portal/paineis",
    icon: LayoutDashboard,
  },
  {
    label: "Indicadores",
    path: "/portal/indicadores",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Catálogo",
    path: "/portal/catalogo",
    icon: Database,
  },
  {
    label: "Relatórios",
    path: "/portal/relatorios",
    icon: FileText,
  },
];

export function LSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    /*
     * Quando houver autenticação real, remova aqui:
     * - token de acesso;
     * - refresh token;
     * - dados do usuário;
     * - demais informações da sessão.
     */

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/login", {
      replace: true,
    });
  }

  return (
    <aside className="l-sidebar">
      <nav className="l-sidebar__navigation" aria-label="Navegação principal">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                ["l-sidebar__item", isActive ? "l-sidebar__item--active" : ""]
                  .filter(Boolean)
                  .join(" ")
              }
              title={item.label}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="l-sidebar__footer">
        <button
          className="l-sidebar__item l-sidebar__item--logout"
          type="button"
          title="Sair da plataforma"
          onClick={handleLogout}
        >
          <LogOut size={21} aria-hidden="true" />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
