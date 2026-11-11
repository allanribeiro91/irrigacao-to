import { LMainBody } from "../../components/layout/LMainBody";
import { LWorkspace } from "../../components/layout/LWorkspace";

import "./index.css";

export function LPortalLayout() {
  return (
    <div className="l-portal-layout">
      <LMainBody>
        <LWorkspace />
      </LMainBody>
    </div>
  );
}
