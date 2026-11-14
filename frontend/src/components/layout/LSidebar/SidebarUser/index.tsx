import { useEffect, useRef, useState } from "react";

import { ChevronDown, LogOut, UserRound } from "lucide-react";

import { useNavigate } from "react-router";

import { CENTRAL_PATHS } from "../../../../config/paths";

import { useUser } from "../../../../providers/UserProvider/context";

import httpClient from "../../../../services/httpClient";

import "./index.css";

interface SidebarUserProps {
  expanded: boolean;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "US";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 2) {
    return parts.join(" ") || "Usuário";
  }

  return `${parts[0]} ${parts[parts.length - 1]}`;
}

export function SidebarUser({ expanded }: SidebarUserProps) {
  const navigate = useNavigate();

  const { usuario, isMaster, logout } = useUser();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);

  const userName = usuario?.no_nome || "Usuário";
  const displayName = getDisplayName(userName);
  const initials = getInitials(userName);
  const userEmail = usuario?.ds_email || "";

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

    navigate(CENTRAL_PATHS.USUARIO.path);
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

      navigate(CENTRAL_PATHS.LOGIN.path, {
        replace: true,
      });
    }
  }

  return (
    <div className="sidebar-user" ref={userMenuRef}>
      {userMenuOpen && (
        <div className="sidebar-user__menu">
          <div className="sidebar-user__menu-header">
            <strong>{userName}</strong>
            <span>{userEmail}</span>
          </div>

          <button
            type="button"
            className="sidebar-user__menu-item"
            onClick={handleMyProfile}
          >
            <UserRound size={17} />
            Meus Dados
          </button>

          <button
            type="button"
            className="sidebar-user__menu-item sidebar-user__logout"
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
        className="sidebar-user__trigger"
        onClick={() => setUserMenuOpen((current) => !current)}
        aria-label={`Opções do usuário ${displayName}`}
        aria-expanded={userMenuOpen}
        aria-haspopup="true"
        title={!expanded ? displayName : undefined}
      >
        <span className="sidebar-user__avatar">{initials}</span>

        <span className="sidebar-user__info">
          <span className="sidebar-user__name-row">
            <strong className="sidebar-user__name">{displayName}</strong>

            {isMaster && (
              <span
                className="sidebar-user__master"
                title="Usuário Master"
                aria-label="Perfil Master"
              >
                M
              </span>
            )}
          </span>
        </span>

        <ChevronDown
          size={15}
          className={`sidebar-user__chevron ${
            userMenuOpen ? "sidebar-user__chevron--open" : ""
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
