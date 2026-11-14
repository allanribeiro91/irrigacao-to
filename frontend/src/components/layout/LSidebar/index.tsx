import { CENTRAL_PATHS } from "../../../config/paths";

import {
  ChartNoAxesCombined,
  Database,
  FileText,
  LayoutDashboard,
  Layers3,
  Map,
} from "lucide-react";

import { NavLink } from "react-router";

import { SidebarUser } from "./SidebarUser";

import "./index.css";

interface LSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    label: "Geo",
    path: CENTRAL_PATHS.GEO.path,
    icon: Map,
  },
  {
    label: "Painéis",
    path: CENTRAL_PATHS.PAINEIS.path,
    icon: LayoutDashboard,
  },
  {
    label: "Indicadores",
    path: CENTRAL_PATHS.INDICADORES.path,
    icon: ChartNoAxesCombined,
  },
  {
    label: "Catálogo",
    path: CENTRAL_PATHS.CATALOGO.path,
    icon: Database,
  },
  {
    label: "Relatórios",
    path: CENTRAL_PATHS.RELATORIOS.path,
    icon: FileText,
  },
];

export function LSidebar({ expanded, onToggle }: LSidebarProps) {
  return (
    <aside
      className={`l-sidebar ${
        expanded ? "l-sidebar--expanded" : "l-sidebar--collapsed"
      }`}
    >
      {/* IDENTIDADE VISUAL */}
      <header className="l-sidebar__header">
        <button
          type="button"
          className="l-sidebar__brand"
          onClick={onToggle}
          aria-label={
            expanded ? "Recolher menu lateral" : "Expandir menu lateral"
          }
          aria-expanded={expanded}
          title={expanded ? "Recolher menu" : "Expandir menu"}
        >
          <span className="l-sidebar__brand-symbol">
            <Layers3 size={24} strokeWidth={1.8} aria-hidden="true" />
          </span>

          <span className="l-sidebar__brand-text">
            <strong>Portal de Dados</strong>
            <span>Irrigação Tocantins</span>
          </span>
        </button>
      </header>

      {/* NAVEGAÇÃO */}
      <nav className="l-sidebar__navigation" aria-label="Navegação principal">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={({ isActive }) =>
                ["l-sidebar__item", isActive ? "l-sidebar__item--active" : ""]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <Icon size={20} strokeWidth={1.8} aria-hidden="true" />

              <span className="l-sidebar__item-label">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* USUÁRIO */}
      <footer className="l-sidebar__footer">
        <SidebarUser expanded={expanded} />
      </footer>
    </aside>
  );
}
