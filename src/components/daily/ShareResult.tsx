"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { useLanguage } from "@/lib/language";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/language";

const shareCopy: Record<Language, { share: string; copied: string; failed: string; postOn: string }> = {
  pt: { share: "Compartilhar resultado", copied: "Resultado copiado!", failed: "Não foi possível copiar o resultado.", postOn: "Postar no" },
  en: { share: "Share result", copied: "Result copied!", failed: "Could not copy the result.", postOn: "Post on" },
  es: { share: "Compartir resultado", copied: "¡Resultado copiado!", failed: "No se pudo copiar el resultado.", postOn: "Publicar en" },
};

// Celular/tablet: abre o menu de compartilhar do sistema (WhatsApp, Instagram, X...).
// Desktop: o menu do sistema é pobre ou não existe, então copia o texto.
const canUseNativeShare = () =>
  typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches;

type Props = {
  // Monta o texto na hora do clique (emojis, placar, sequência e link).
  getText: () => string;
  // secondary: quando já existe outro botão laranja ao lado (ex.: "Jogar de novo").
  tone?: "primary" | "secondary";
};

export function ShareResult({ getText, tone = "primary" }: Props) {
  const language = useLanguage();
  const copy = shareCopy[language];
  const [status, setStatus] = useState<"copied" | "failed">();

  const handleShare = async () => {
    const text = getText();
    if (canUseNativeShare()) {
      try {
        await navigator.share({ text });
        return;
      } catch (error) {
        // Fechar o menu sem escolher nada não é erro; qualquer outra falha cai na cópia.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  };

  // O texto só existe no clique (o link usa window), por isso botões e não <a href>.
  const openShortcut = (base: string) => {
    window.open(`${base}${encodeURIComponent(getText())}`, "_blank", "noopener,noreferrer");
  };

  const shortcutClass =
    "cs-cut-sm inline-flex flex-1 items-center justify-center bg-cs-raised px-3 py-2 text-sm font-bold uppercase tracking-wider text-cs-text/80 transition hover:text-cs-orange";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleShare}
        className={cn(
          "cs-cut-sm inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 text-base font-bold uppercase tracking-wider transition",
          tone === "primary" ? "bg-cs-orange text-cs-bg hover:bg-[#ffb85a]" : "bg-cs-raised text-cs-text hover:text-cs-orange"
        )}
      >
        <Share2 className="h-4 w-4" /> {copy.share}
      </button>
      <div className="flex gap-2">
        <button type="button" onClick={() => openShortcut("https://x.com/intent/post?text=")} className={shortcutClass}>
          {copy.postOn} X
        </button>
        <button type="button" onClick={() => openShortcut("https://wa.me/?text=")} className={shortcutClass}>
          WhatsApp
        </button>
      </div>
      {status ? (
        <p role="status" className="text-sm font-semibold text-cs-text/70">
          {status === "copied" ? copy.copied : copy.failed}
        </p>
      ) : null}
    </div>
  );
}
