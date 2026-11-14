import { matchPath } from "react-router";

import { CENTRAL_PATHS } from "./paths";

export function getPathConfig(pathname: string) {
  const routes = Object.values(CENTRAL_PATHS);

  // Prioriza correspondências exatas.
  const exactMatch = routes.find((route) =>
    matchPath({ path: route.path, end: true }, pathname),
  );

  return exactMatch ?? null;
}

export function getBreadcrumbByPath(pathname: string): string {
  const route = getPathConfig(pathname);

  return route?.breadcrumb ?? "Portal de Dados";
}
