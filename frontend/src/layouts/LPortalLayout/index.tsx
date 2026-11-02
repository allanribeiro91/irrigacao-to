import { LSidebar } from "../../components/layout/LSidebar";
import { LTopBar } from "../../components/layout/LTopBar";
import { LWorkspace } from "../../components/layout/LWorkspace";

import "./index.css";

export function LPortalLayout() {
  return (
    <div className="l-portal-layout">
      <div className="l-portal-layout__topbar">
        <LTopBar />
      </div>

      <div className="l-portal-layout__sidebar">
        <LSidebar />
      </div>

      <div className="l-portal-layout__workspace">
        <LWorkspace />
      </div>
    </div>
  );
}
