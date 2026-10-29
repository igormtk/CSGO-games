"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { adsenseClient } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Se o script do AdSense não processar o bloco nesse tempo (bloqueador, rede), mostra o espaço próprio.
const LOAD_TIMEOUT_MS = 3000;

type GoogleSpotProps = {
  slot: string;
  variant: "card" | "banner" | "rail";
  label: string;
  // O que aparece quando o Google não tem anúncio ou foi bloqueado.
  fallback: ReactNode;
};

const insProps = {
  card: { style: { display: "block" }, "data-ad-format": "auto", "data-full-width-responsive": "true" },
  banner: { style: { display: "block", minHeight: 90 }, "data-ad-format": "horizontal", "data-full-width-responsive": "true" },
  rail: { style: { display: "inline-block", width: 160, height: 600 } },
} as const;

// Bloco do Google AdSense com o mesmo rótulo "Publicidade" dos patrocinadores diretos.
export function GoogleSpot({ slot, variant, label, fallback }: GoogleSpotProps) {
  const insRef = useRef<HTMLModElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ins = insRef.current;
    // Coluna lateral escondida (tela estreita) tem largura 0: o Google recusa blocos sem espaço.
    // O status presente indica bloco já preenchido (o modo estrito do React roda o efeito duas vezes).
    if (!ins || ins.offsetWidth === 0 || ins.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Erro do AdSense ao montar o bloco: o prazo abaixo troca pelo espaço próprio.
    }
    // "unfilled": o Google não tinha anúncio para este espaço agora.
    const observer = new MutationObserver(() => {
      if (ins.dataset.adStatus === "unfilled") setFailed(true);
    });
    observer.observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
    const timeout = window.setTimeout(() => {
      if (!ins.dataset.adsbygoogleStatus) setFailed(true);
    }, LOAD_TIMEOUT_MS);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  if (failed) return fallback;

  return (
    <div className={variant === "rail" ? "w-[160px] bg-cs-surface/90" : "cs-cut-sm bg-cs-panel"}>
      <p className="px-2 py-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-cs-text/40">{label}</p>
      {/* A classe "adsbygoogle" é exigida pelo Google, mesmo sendo a que os bloqueadores procuram. */}
      <ins ref={insRef} className="adsbygoogle" data-ad-client={adsenseClient} data-ad-slot={slot} {...insProps[variant]} />
    </div>
  );
}
