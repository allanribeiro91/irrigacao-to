import { useId, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import "./index.css";

export interface CustomBoxProps {
  title: ReactNode;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;

  open?: boolean;
  defaultOpen?: boolean;
  alwaysOpen?: boolean;
  keepMounted?: boolean;

  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
  headerClassName?: string;

  onToggle?: (open: boolean) => void;
}

export default function CustomBox({
  title,
  description,
  icon,
  children,
  open,
  defaultOpen = true,
  alwaysOpen = false,
  keepMounted = false,
  className = "",
  style,
  contentClassName = "",
  headerClassName = "",
  onToggle,
}: CustomBoxProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const contentId = useId();

  const isControlled = open !== undefined;

  const isOpen = isControlled ? open : internalOpen;

  const expanded = alwaysOpen || isOpen;

  function handleToggle() {
    if (alwaysOpen) return;

    const nextOpen = !expanded;

    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onToggle?.(nextOpen);
  }

  const headerContent = (
    <>
      <div className="custom-box__heading">
        {icon && (
          <div className="custom-box__icon" aria-hidden="true">
            {icon}
          </div>
        )}

        <div className="custom-box__heading-text">
          <div className="custom-box__title">{title}</div>

          {description && (
            <p className="custom-box__description">{description}</p>
          )}
        </div>
      </div>

      {!alwaysOpen && (
        <span className="custom-box__chevron" aria-hidden="true">
          {expanded ? <ChevronUp size={19} /> : <ChevronDown size={19} />}
        </span>
      )}
    </>
  );

  return (
    <section
      className={[
        "custom-box",
        expanded && "custom-box--expanded",
        alwaysOpen && "custom-box--always-open",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {alwaysOpen ? (
        <header className={`custom-box__header ${headerClassName}`}>
          {headerContent}
        </header>
      ) : (
        <button
          type="button"
          className={`custom-box__header custom-box__header--button ${headerClassName}`}
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls={contentId}
        >
          {headerContent}
        </button>
      )}

      {(keepMounted || expanded) && (
        <div
          id={contentId}
          className={`custom-box__content ${contentClassName}`}
          hidden={!expanded}
        >
          {children}
        </div>
      )}
    </section>
  );
}
