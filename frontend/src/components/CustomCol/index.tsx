import type { CSSProperties, ReactNode } from "react";

import "./index.css";

interface CustomColProps {
  children?: ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
  helpText?: string;
  className?: string;
  style?: CSSProperties;
  grow?: number;
}

function formatSize(value: string | number): string {
  return typeof value === "number" ? `${value}px` : value;
}

export default function CustomCol({
  children,
  width,
  minWidth,
  maxWidth,
  helpText,
  className = "",
  style,
  grow,
}: CustomColProps) {
  const hasChildren =
    children !== undefined && children !== null && children !== false;

  const colStyle: CSSProperties = {
    flex:
      grow !== undefined
        ? `${grow} 1 0%`
        : width !== undefined
          ? `0 0 ${formatSize(width)}`
          : "1 1 0%",
    minWidth: minWidth !== undefined ? formatSize(minWidth) : 0,
    ...(width !== undefined && {
      width: formatSize(width),
    }),
    ...(maxWidth !== undefined && {
      maxWidth: formatSize(maxWidth),
    }),
    ...style,
  };

  return (
    <div className={`custom-col ${className}`} style={colStyle}>
      {hasChildren ? children : null}

      {helpText && <small className="custom-col__help">{helpText}</small>}
    </div>
  );
}
