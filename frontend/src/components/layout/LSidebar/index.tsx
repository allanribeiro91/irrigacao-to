import { useEffect, useRef, useState } from "react";

import {
  ChartNoAxesCombined,
  Database,
  FileText,
  LayoutDashboard,
  Layers3,
  LogOut,
  Map,
  UserRound,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router";

import { useUser } from "../../../providers/UserProvider/context";
import httpClient from "../../../services/httpClient";

import "./index.css";

interface LSidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

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

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "US";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function LSidebar({ expanded, onToggle }: LSidebarProps) {
  const navigate = useNavigate();

  const { usuario, logout } = useUser();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const userName = usuario?.no_nome || "Usuário";
  const userEmail = usuario?.ds_email || "";
  const initials = getInitials(userName);

  useEffect(() => {
    if (!userMenuOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [userMenuOpen]);

  function handleMyProfile() {
    setUserMenuOpen(false);
    navigate("/portal/usuario");
  }

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await httpClient.post("/auth/logout");
    } catch {
      // Limpa a sessão local mesmo se a API não responder.
    } finally {
      logout();
      setUserMenuOpen(false);
      setLoggingOut(false);
      navigate("/login", { replace: true });
    }
  }

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
          onClick={() => {
            setUserMenuOpen(false);
            onToggle();
          }}
          aria-label={
            expanded ? "Recolher menu lateral" : "Expandir menu lateral"
          }
          aria-expanded={expanded}
          title={expanded ? "Recolher menu" : "Expandir menu"}
        >
          <span className="l-sidebar__brand-symbol">
            <Layers3 size={24} strokeWidth={1.8} aria-hidden="true" />
          </span>

          {expanded && (
            <span className="l-sidebar__brand-text">
              <strong>Portal de Dados</strong>
              <span>Irrigação Tocantins</span>
            </span>
          )}
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
        <div className="l-sidebar__user-container" ref={userMenuRef}>
          {userMenuOpen && (
            <div className="l-sidebar__user-menu">
              <div className="l-sidebar__user-menu-header">
                <strong>{userName}</strong>
                <span>{userEmail}</span>
              </div>

              <button type="button" onClick={handleMyProfile}>
                <UserRound size={17} />
                Meus Dados
              </button>

              <button
                type="button"
                className="l-sidebar__logout"
                onClick={() => void handleLogout()}
                disabled={loggingOut}
              >
                <LogOut size={17} />
                {loggingOut ? "Saindo..." : "Sair"}
              </button>
            </div>
          )}

          <button
            type="button"
            className="l-sidebar__user"
            onClick={() => setUserMenuOpen((current) => !current)}
            aria-label="Abrir opções do usuário"
            aria-expanded={userMenuOpen}
            aria-haspopup="menu"
          >
            <span className="l-sidebar__avatar">{initials}</span>

            <span className="l-sidebar__brand-text">
              <strong>Portal de Dados</strong>
              <span>Irrigação Tocantins</span>
            </span>
          </button>
        </div>
      </footer>
    </aside>
  );
}
