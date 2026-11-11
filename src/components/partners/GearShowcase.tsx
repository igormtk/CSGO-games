"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

type GearShowcaseState = {
  // Loja Amazon do visitante, para mostrar a foto do modelo vendido nela.
  store: "br" | "us";
  // Posição na vitrine (src/data/gear.ts) dos produtos em exibição agora.
  start: number;
};

const GearShowcaseContext = createContext<GearShowcaseState>({ store: "us", start: 0 });

// Passo a cada página: par, para as colunas laterais manterem os pares com foto e sem foto.
const STEP_PER_PAGE = 2;

// Vitrine de produtos com link de afiliado. Começa num ponto sorteado no servidor (o mesmo na
// hidratação) e anda a cada troca de página, para quem navega entre os jogos ver produtos
// diferentes. Não troca sozinha com o tempo: anúncio que se mexe distrai quem está jogando.
export function GearShowcaseProvider({ store, initialStart, children }: { store: "br" | "us"; initialStart: number; children: ReactNode }) {
  const pathname = usePathname();
  const [view, setView] = useState({ pathname, start: initialStart });
  // Ajuste durante a renderização (padrão do React para estado que acompanha uma prop).
  if (view.pathname !== pathname) setView({ pathname, start: view.start + STEP_PER_PAGE });

  return <GearShowcaseContext.Provider value={{ store, start: view.start }}>{children}</GearShowcaseContext.Provider>;
}

export const useGearShowcase = () => useContext(GearShowcaseContext);
