import { Layers3 } from "lucide-react";
import { Link } from "react-router";

import "./index.css";

export function LTopBar() {
  return (
    <header className="l-topbar">
      <div className="l-topbar__brand">
        <div className="l-topbar__brand-symbol" aria-hidden="true">
          <Layers3 size={24} strokeWidth={1.8} />
        </div>

        <div className="l-topbar__brand-text">
          <strong>Polo de Agricultura Irrigada</strong>

          <span className="l-topbar__brand-region">Sudoeste do Tocantins</span>
        </div>
      </div>

      <div className="l-topbar__actions">
        <Link
          to="/portal/usuario"
          className="l-topbar__user"
          title="Acessar meu perfil"
        >
          <span className="l-topbar__avatar">AR</span>

          <span className="l-topbar__user-information">
            <strong>Allan Ribeiro</strong>
            <small>Minha conta</small>
          </span>
        </Link>
      </div>
    </header>
  );
}
