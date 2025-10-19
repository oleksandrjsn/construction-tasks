import { useContext } from "react";
import DbContext from "./context";
import type { DbContextValue } from "./types";

export const useDb = (): DbContextValue => {
  const context = useContext(DbContext);

  if (!context) {
    throw new Error("useDb must be used within DbProvider");
  }

  return context;
};
