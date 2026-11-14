import { Navigate, Route, Routes } from "react-router";

import { CENTRAL_PATHS } from "./config/paths";

import { LPortalLayout } from "./components/layout/LIndex";

import { LoginPage } from "./pages/auth/LoginPage";
import { CadastroPage } from "./pages/auth/Cadastro";

import { CatalogPage } from "./pages/portal/CatalogPage";
import { DashboardsPage } from "./pages/portal/DashboardsPage";
import { GeoPage } from "./pages/portal/GeoPage";
import { IndicatorsPage } from "./pages/portal/IndicatorsPage";
import { ReportsPage } from "./pages/portal/ReportsPage";
import { UserPage } from "./pages/portal/UserPage";
import { EditCatalog } from "./pages/portal/CatalogPage/EditCatalog";

import "./styles/global.css";

function portalPath(path: string): string {
  return path.replace(/^\/portal\//, "");
}

function App() {
  return (
    <Routes>
      {/* ROTAS PÚBLICAS */}
      <Route path={CENTRAL_PATHS.LOGIN.path} element={<LoginPage />} />

      <Route path={CENTRAL_PATHS.CADASTRO.path} element={<CadastroPage />} />

      {/* PORTAL DE DADOS */}
      <Route path="/portal" element={<LPortalLayout />}>
        <Route
          index
          element={<Navigate to={CENTRAL_PATHS.GEO.path} replace />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.GEO.path)}
          element={<GeoPage />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.PAINEIS.path)}
          element={<DashboardsPage />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.INDICADORES.path)}
          element={<IndicatorsPage />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.CATALOGO.path)}
          element={<CatalogPage />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.CATALOGO_NOVO.path)}
          element={<EditCatalog />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.CATALOGO_EDITAR.path)}
          element={<EditCatalog />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.RELATORIOS.path)}
          element={<ReportsPage />}
        />

        <Route
          path={portalPath(CENTRAL_PATHS.USUARIO.path)}
          element={<UserPage />}
        />

        <Route
          path="*"
          element={<Navigate to={CENTRAL_PATHS.GEO.path} replace />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to={CENTRAL_PATHS.LOGIN.path} replace />}
      />
    </Routes>
  );
}

export default App;
