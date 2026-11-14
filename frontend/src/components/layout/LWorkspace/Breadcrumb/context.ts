import { createContext } from "react";

export interface BreadcrumbContextType {
  breadcrumb: string;
  setBreadcrumb: (value: string) => void;
}

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);
