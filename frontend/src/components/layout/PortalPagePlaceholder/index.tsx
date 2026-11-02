import type { LucideIcon } from "lucide-react";

import "./index.css";

interface PortalPagePlaceholderProps {
  eyebrow: string;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
}

export function PortalPagePlaceholder({
  eyebrow,
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon: Icon,
}: PortalPagePlaceholderProps) {
  return (
    <section className="portal-placeholder">
      <header className="portal-placeholder__header">
        <div className="portal-placeholder__title">
          <div className="portal-placeholder__header-icon" aria-hidden="true">
            <Icon size={20} />
          </div>

          <div>
            <span>{eyebrow}</span>
            <h1>{title}</h1>
          </div>
        </div>

        <p className="portal-placeholder__description">{description}</p>
      </header>

      <div className="portal-placeholder__workspace">
        <div className="portal-placeholder__empty">
          <div className="portal-placeholder__empty-icon" aria-hidden="true">
            <Icon size={34} strokeWidth={1.5} />
          </div>

          <h2>{emptyTitle}</h2>
          <p>{emptyDescription}</p>

          <span className="portal-placeholder__status">Em construção</span>
        </div>
      </div>
    </section>
  );
}
