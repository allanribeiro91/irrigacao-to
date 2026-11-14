import { LMainBody } from "../LMainBody";
import { LWorkspace } from "../LWorkspace";

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
