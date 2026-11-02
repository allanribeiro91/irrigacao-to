import { FileText } from "lucide-react";

import { PortalPagePlaceholder } from "../../../components/layout/PortalPagePlaceholder";

import "./index.css";

export function ReportsPage() {
  return (
    <PortalPagePlaceholder
      eyebrow="Publicações"
      title="Relatórios"
      description="Relatórios executivos, diagnósticos e estudos territoriais."
      emptyTitle="Relatórios e estudos"
      emptyDescription="Os relatórios produzidos a partir da plataforma poderão ser consultados e baixados neste ambiente."
      icon={FileText}
    />
  );
}
