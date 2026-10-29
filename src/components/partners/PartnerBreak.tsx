"use client";

import { useEffect, useState } from "react";
import type { Partner } from "@/data/partners";
import { PartnerSpot } from "./PartnerSpot";

// Tempo mínimo de anúncio (com a aba visível) antes de revelar o resultado e as respostas.
const PARTNER_BREAK_SECONDS = 5;

// Anúncio de fim de jogo: o botão só libera depois de PARTNER_BREAK_SECONDS com a aba visível.
export function PartnerBreak({
  partner,
  label,
  revealIn,
  revealLabel,
  onDone,
}: {
  partner: Partner;
  label: string;
  revealIn: (seconds: number) => string;
  revealLabel: string;
  onDone: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState(PARTNER_BREAK_SECONDS);

  // Soma só o tempo com a aba visível, medido em milissegundos para garantir os 5 s inteiros.
  useEffect(() => {
    let visibleMs = 0;
    let lastTick = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      if (document.visibilityState === "visible") visibleMs += now - lastTick;
      lastTick = now;
      setSecondsLeft(Math.max(Math.ceil((PARTNER_BREAK_SECONDS * 1000 - visibleMs) / 1000), 0));
    }, 200);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3">
      <PartnerSpot partner={partner} label={label} variant="card" />
      <button
        type="button"
        onClick={onDone}
        disabled={secondsLeft > 0}
        className="cs-cut-sm w-full bg-cs-orange px-3 py-2.5 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a] disabled:cursor-wait disabled:bg-cs-raised disabled:text-cs-text/50"
      >
        {secondsLeft > 0 ? revealIn(secondsLeft) : revealLabel}
      </button>
    </div>
  );
}
