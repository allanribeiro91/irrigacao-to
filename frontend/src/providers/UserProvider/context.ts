import { createContext, useContext } from "react";

import type { UserContextValue } from "./type";

export const UserContext = createContext<UserContextValue | undefined>(
  undefined,
);

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser utilizado dentro de UserProvider.");
  }

  return context;
}
