import { ChartNoAxesCombined } from "lucide-react";

import { PortalPagePlaceholder } from "../../../components/layout/PortalPagePlaceholder";

import "./index.css";

export function IndicatorsPage() {
  return (
    <PortalPagePlaceholder
      eyebrow="Inteligência territorial"
      title="Indicadores"
      description="Consulta estruturada dos principais indicadores territoriais."
      emptyTitle="Indicadores territoriais"
      emptyDescription="As fichas, séries históricas e comparações de indicadores serão disponibilizadas neste ambiente."
      icon={ChartNoAxesCombined}
    />
  );
}
