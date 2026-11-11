import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { getGearProduct } from "@/data/gear";
import type { Language } from "@/lib/language";

// Link de afiliado. Fica fora do LocalLink: /go/amazon não tem versão por idioma.
// rel="sponsored" é o que o Google pede para links pagos.
export function AmazonLink({ product, children }: { product: string; children?: ReactNode }) {
  const item = getGearProduct(product);
  if (!item) return <>{children}</>;
  return (
    <a href={`/go/amazon/${item.id}?from=guide`} target="_blank" rel="sponsored nofollow noopener" className="inline-flex items-center gap-1">
      {children ?? item.name} <ExternalLink className="h-3.5 w-3.5" aria-hidden />
    </a>
  );
}

const disclosure: Record<Language, string> = {
  pt: "Este guia tem links de afiliado: como associado da Amazon, o CS Games ganha com compras qualificadas, sem custo extra para você. Isso não muda as recomendações.",
  en: "This guide contains Amazon affiliate links: as an Amazon Associate, CS Games earns from qualifying purchases, at no extra cost to you. It doesn't change our recommendations.",
  es: "Esta guía tiene enlaces de afiliado: como asociado de Amazon, CS Games gana con las compras que cumplen los requisitos, sin costo extra para ti. Eso no cambia las recomendaciones.",
};

export function AffiliateDisclosure({ language }: { language: Language }) {
  return <p className="cs-cut-sm bg-cs-panel px-4 py-3 text-sm text-cs-text/60">{disclosure[language]}</p>;
}
