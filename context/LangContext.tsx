"use client";

import { createContext, useContext, type ReactNode } from "react";

type Lang = "es" | "en" | "pt";

interface LangContextType {
  lang: Lang;
}

const LangContext = createContext<LangContextType>({
  lang: "es",
});

export function LangProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Lang;
}) {
  return (
    <LangContext.Provider value={{ lang: locale }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
