import { Outlet, useLocation } from "react-router";

import { Breadcrumb } from "./Breadcrumb";
import { getBreadcrumbByPath } from "../../../config/paths.helper";

import "./index.css";

export function LWorkspace() {
  const { pathname } = useLocation();

  const breadcrumb = getBreadcrumbByPath(pathname);

  return (
    <main className="l-workspace">
      <header className="l-workspace__header">
        <Breadcrumb title={breadcrumb} />
      </header>

      <section className="l-workspace__content">
        <div className="l-workspace__scroll">
          <Outlet />
        </div>
      </section>
    </main>
  );
}
