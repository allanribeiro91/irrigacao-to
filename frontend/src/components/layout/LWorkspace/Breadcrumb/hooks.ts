import { useContext, useEffect } from "react";

import { BreadcrumbContext } from "./context";

function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error(
      "useBreadcrumb deve ser utilizado dentro de BreadcrumbProvider",
    );
  }

  return context;
}

export function useBreadcrumb(title: string) {
  const { setBreadcrumb } = useBreadcrumbContext();

  useEffect(() => {
    setBreadcrumb(title);

    return () => {
      setBreadcrumb("Portal de Dados");
    };
  }, [title, setBreadcrumb]);
}

export function useBreadcrumbValue() {
  return useBreadcrumbContext().breadcrumb;
}
