import { Database } from "lucide-react";

import { PortalPagePlaceholder } from "../../../components/layout/PortalPagePlaceholder";

import "./index.css";

export function CatalogPage() {
  return (
    <PortalPagePlaceholder
      eyebrow="Governança de dados"
      title="Catálogo"
      description="Inventário das bases, camadas, variáveis e fontes de dados."
      emptyTitle="Catálogo de dados"
      emptyDescription="As bases disponíveis, suas fontes, períodos de referência e metadados serão organizados neste espaço."
      icon={Database}
    />
  );
}
