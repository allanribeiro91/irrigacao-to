import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { createPortal } from "react-dom";

import "./index.css";

interface CustomOffcanvasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number | string;
  children: ReactNode;
  footer?: ReactNode;
  container?: HTMLElement | null;
  closeDisabled?: boolean;
  headerActions?: React.ReactNode;
}

export function CustomOffcanvas({
  open,
  onClose,
  title,
  subtitle,
  width = 640,
  children,
  footer,
  container,
  closeDisabled = false,
  headerActions,
}: CustomOffcanvasProps) {
  const titleId = useId();

  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  // Controla a entrada do painel após o navegador
  // renderizar sua posição inicial fora da workspace.
  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [open]);

  // Fechamento e gerenciamento do foco.
  useEffect(() => {
    if (!open) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !closeDisabled) {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      previousFocusRef.current?.focus();
    };
  }, [open, onClose, closeDisabled]);

  function handleClose() {
    if (closeDisabled) return;

    setIsVisible(false);
    onClose();
  }

  // Mantém o portal associado à workspace.
  if (!container) return null;

  const visible = open && isVisible;

  return createPortal(
    <div
      className={`custom-offcanvas__overlay ${
        visible ? "custom-offcanvas__overlay--open" : ""
      }`}
      aria-hidden={!open}
    >
      {/* FUNDO */}
      <div
        className="custom-offcanvas__backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* PAINEL */}
      <section
        ref={panelRef}
        className="custom-offcanvas"
        style={{
          width: typeof width === "number" ? `${width}px` : width,
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="custom-offcanvas__header">
          <div className="custom-offcanvas__heading">
            {subtitle && (
              <span className="custom-offcanvas__subtitle">{subtitle}</span>
            )}

            <h2 id={titleId}>{title}</h2>
          </div>
          {headerActions}
        </header>

        <div className="custom-offcanvas__body">{children}</div>

        {footer && (
          <footer className="custom-offcanvas__footer">{footer}</footer>
        )}
      </section>
    </div>,
    container,
  );
}
