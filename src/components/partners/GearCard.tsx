"use client";

import { ExternalLink } from "lucide-react";
import { gearFeatured, gearImage } from "@/data/gear";
import { useLanguage } from "@/lib/language";
import { gearCopy } from "./GearRail";
import { useGearShowcase } from "./GearShowcase";

// Fim de jogo sem campanha vendida: um produto de equipamento com link de afiliado da Amazon. Aparece
// em qualquer tela (as colunas laterais só aparecem em telas largas) e começa depois dos quatro das
// colunas, para não repetir o que já está ao lado.
export function GearCard() {
  const language = useLanguage();
  const text = gearCopy[language];
  const { store, start } = useGearShowcase();
  const product = gearFeatured(start + 4);
  const image = gearImage(product, store);

  return (
    <a
      href={`/go/amazon/${product.id}?from=post-game`}
      target="_blank"
      rel="sponsored nofollow noopener"
      className="cs-cut group block bg-cs-panel transition hover:bg-cs-raised"
    >
      <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cs-text/40">{text.label} · Amazon</p>
      <div className="flex items-center gap-4 px-3 py-3">
        {image ? (
          // Fundo branco: as fotos de produto vêm com fundo branco.
          <span className="cs-cut-sm grid h-24 w-24 shrink-0 place-items-center bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={product.name}
              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </span>
        ) : null}
        <div className="min-w-0 space-y-1">
          <p className="text-xl font-bold uppercase leading-tight tracking-wide text-cs-gold">{product.name}</p>
          <p className="text-sm font-semibold leading-5 text-cs-text/70">{product.pitch[language]}</p>
          <span className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-cs-gold">
            {text.cta} <ExternalLink className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
      <p className="px-3 pb-2 text-[11px] font-semibold leading-4 text-cs-text/40">{text.note}</p>
    </a>
  );
}
