import { useEffect, useId, useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

import "./index.css";

interface OffcanvasProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  width?: number | string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Offcanvas({
  open,
  onClose,
  title,
  subtitle,
  width = 560,
  children,
  footer,
}: OffcanvasProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="offcanvas"
      style={{ width }}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;

        const bounds = event.currentTarget.getBoundingClientRect();

        const clickedOutside =
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom;

        if (clickedOutside) onClose();
      }}
    >
      <header className="offcanvas__header">
        <div className="offcanvas__heading">
          {subtitle && <span className="offcanvas__subtitle">{subtitle}</span>}

          <h2 id={titleId}>{title}</h2>
        </div>

        <button
          type="button"
          className="offcanvas__close"
          onClick={onClose}
          aria-label="Fechar painel"
          autoFocus
        >
          <X size={20} />
        </button>
      </header>

      <div className="offcanvas__body">{children}</div>

      {footer && <footer className="offcanvas__footer">{footer}</footer>}
    </dialog>,
    document.body,
  );
}
