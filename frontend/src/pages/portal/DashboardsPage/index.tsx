import { LayoutDashboard } from "lucide-react";

import { PortalPagePlaceholder } from "../../../components/layout/PortalPagePlaceholder";

import "./index.css";

export function DashboardsPage() {
  return (
    <PortalPagePlaceholder
      eyebrow="Inteligência territorial"
      title="Painéis"
      description="Visualizações interativas para acompanhamento territorial e produtivo."
      emptyTitle="Painéis analíticos"
      emptyDescription="Os painéis interativos e suas ferramentas de análise serão adicionados nas próximas etapas."
      icon={LayoutDashboard}
    />
  );
}
