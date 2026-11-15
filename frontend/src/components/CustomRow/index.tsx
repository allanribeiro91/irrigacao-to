import type { CSSProperties, ReactNode } from "react";

import "./index.css";

interface CustomRowProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  gap?: number | string;
  rowGap?: number | string;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
}

const alignMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
} as const;

const justifyMap = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
} as const;

function formatSize(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

export default function CustomRow({
  children,
  style,
  className = "",
  gap = 20,
  rowGap,
  align = "start",
  justify = "start",
  wrap = true,
}: CustomRowProps) {
  const rowStyle: CSSProperties = {
    columnGap: formatSize(gap),
    rowGap: formatSize(rowGap ?? gap),
    alignItems: alignMap[align],
    justifyContent: justifyMap[justify],
    flexWrap: wrap ? "wrap" : "nowrap",
    ...style,
  };

  return (
    <div className={`custom-row ${className}`} style={rowStyle}>
      {children}
    </div>
  );
}
