"use client";

import { ExternalLink } from "lucide-react";
import { gearImage } from "@/data/gear";
import type { GearProduct } from "@/data/gear";
import { useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

// Coluna lateral sem campanha vendida: dois produtos de equipamento com link de afiliado da Amazon.
// O aviso de associado da Amazon é exigido perto dos links.

const copy: Record<Language, { label: string; cta: string; note: string }> = {
  pt: { label: "Links de afiliado", cta: "Ver na Amazon", note: "Como associado da Amazon, ganhamos com compras qualificadas." },
  en: { label: "Affiliate links", cta: "See on Amazon", note: "As an Amazon Associate we earn from qualifying purchases." },
  es: { label: "Enlaces de afiliado", cta: "Ver en Amazon", note: "Como asociado de Amazon, ganamos con compras que cumplen los requisitos." },
};

// store: loja Amazon do visitante, para mostrar a foto do modelo vendido nela.
export function GearRail({ products, store }: { products: GearProduct[]; store: "br" | "us" }) {
  const language = useLanguage();
  const text = copy[language];

  return (
    <div className="cs-cut-sm flex h-[600px] w-[160px] flex-col overflow-hidden border-t-2 border-cs-gold bg-cs-surface/90">
      <span className="px-2 pt-2 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-cs-text/40">{text.label}</span>
      <div className="cs-grid-bg mt-2 flex flex-1 flex-col divide-y-2 divide-cs-line bg-cs-bg">
        {products.map((product) => {
          const image = gearImage(product, store);
          return (
          <a
            key={product.id}
            href={`/go/amazon/${product.id}`}
            target="_blank"
            rel="sponsored nofollow noopener"
            className="group flex flex-1 flex-col items-center justify-center gap-2 px-3 text-center transition hover:bg-cs-raised"
          >
            {image ? (
              // Fotos de produto costumam ter fundo branco: o quadro claro evita um recorte feio no tema escuro.
              <span className="cs-cut-sm grid h-24 w-full place-items-center bg-white p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={product.name}
                  loading="lazy"
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>
            ) : null}
            <span className={`${image ? "text-base" : "text-xl"} font-bold uppercase leading-tight tracking-wide text-cs-gold`}>
              {product.name}
            </span>
            <span className={`${image ? "text-xs leading-4" : "text-sm leading-5"} font-semibold text-cs-text/60`}>
              {product.pitch[language]}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cs-gold">
              {text.cta} <ExternalLink className="h-3 w-3" />
            </span>
          </a>
          );
        })}
      </div>
      <span className="px-2 py-2 text-center text-[10px] font-semibold leading-3 text-cs-text/40">{text.note}</span>
    </div>
  );
}
