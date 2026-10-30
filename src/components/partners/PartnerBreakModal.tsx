"use client";

import { useState } from "react";
import type { Partner } from "@/data/partners";
import { useLanguage } from "@/lib/language";
import { PartnerBreak } from "./PartnerBreak";

const modalCopy = {
  pt: { title: "Fim de jogo", label: "Publicidade", revealIn: (seconds: number) => `Resultado em ${seconds}s`, reveal: "Ver resultado" },
  en: { title: "Game over", label: "Advertisement", revealIn: (seconds: number) => `Result in ${seconds}s`, reveal: "See result" },
  es: { title: "Fin del juego", label: "Publicidad", revealIn: (seconds: number) => `Resultado en ${seconds}s`, reveal: "Ver resultado" },
};

// Anúncio de fim de jogo em modal, igual ao do bingo: cobre a tela (com desfoque, para não dar
// para ler a resposta por trás) e só fecha depois dos 5 s do PartnerBreak.
export function PartnerBreakModal({
  partner,
  revealIn,
  revealLabel,
  onDone,
}: {
  partner: Partner;
  revealIn?: (seconds: number) => string;
  revealLabel?: string;
  onDone: () => void;
}) {
  const copy = modalCopy[useLanguage()];
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="cs-cut max-h-[90dvh] w-full max-w-md overflow-y-auto border-t-2 border-cs-orange bg-cs-surface p-5 text-base text-cs-text shadow-2xl">
        <h2 className="mb-4 text-2xl font-bold uppercase tracking-wider">{copy.title}</h2>
        <PartnerBreak
          partner={partner}
          label={copy.label}
          revealIn={revealIn ?? copy.revealIn}
          revealLabel={revealLabel ?? copy.reveal}
          onDone={onDone}
        />
      </div>
    </div>
  );
}

const readSeen = (storageKey: string | undefined) => {
  if (!storageKey) return false;
  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
};

// Se o anúncio de fim de jogo já foi visto. Com chave, fica salvo (o desafio diário não repete o
// anúncio ao recarregar); sem chave, vale só enquanto a página estiver aberta.
export const useBreakSeen = (storageKey?: string) => {
  const [seen, setSeen] = useState(() => readSeen(storageKey));
  const markSeen = () => {
    setSeen(true);
    if (!storageKey) return;
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Sem armazenamento: o anúncio volta na próxima visita, mas o jogo segue.
    }
  };
  return [seen, markSeen, () => setSeen(false)] as const;
};
