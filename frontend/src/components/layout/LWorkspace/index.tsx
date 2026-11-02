import { Outlet } from "react-router";

import "./index.css";

export function LWorkspace() {
  return (
    <main className="l-workspace">
      <Outlet />
    </main>
  );
}
