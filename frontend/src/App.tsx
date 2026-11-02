import { Navigate, Route, Routes } from "react-router";

import { LPortalLayout } from "./layouts/LPortalLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { CadastroPage } from "./pages/auth/Cadastro";
import "./styles/global.css";
import { CatalogPage } from "./pages/portal/CatalogPage";
import { DashboardsPage } from "./pages/portal/DashboardsPage";
import { GeoPage } from "./pages/portal/GeoPage";
import { IndicatorsPage } from "./pages/portal/IndicatorsPage";
import { ReportsPage } from "./pages/portal/ReportsPage";
import { UserPage } from "./pages/portal/UserPage";

function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />

      {/* Portal de dados */}
      <Route path="/portal" element={<LPortalLayout />}>
        <Route index element={<Navigate to="geografico" replace />} />

        <Route path="geografico" element={<GeoPage />} />
        <Route path="paineis" element={<DashboardsPage />} />
        <Route path="indicadores" element={<IndicatorsPage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="relatorios" element={<ReportsPage />} />
        <Route path="usuario" element={<UserPage />} />

        <Route path="*" element={<Navigate to="geografico" replace />} />
      </Route>

      {/*
        Área administrativa futura:

        <Route path="/admin" element={<LAdminLayout />}>
          <Route index element={<AdminHomePage />} />
          <Route path="usuarios" element={<AdminUsersPage />} />
          <Route path="camadas" element={<AdminLayersPage />} />
          <Route path="paineis" element={<AdminDashboardsPage />} />
        </Route>
      */}

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
