import { useState, type ReactNode } from "react";

import { LSidebar } from "../LSidebar";

import "./index.css";

interface LMainBodyProps {
  children: ReactNode;
}

export function LMainBody({ children }: LMainBodyProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div
      className={`l-main-body ${
        sidebarExpanded ? "l-main-body--expanded" : ""
      }`}
    >
      <div className="l-main-body__sidebar">
        <LSidebar
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((value) => !value)}
        />
      </div>

      <div className="l-main-body__workspace">{children}</div>
    </div>
  );
}
