import { getSponsorFor } from "@/data/partners";
import { GearRail } from "./GearRail";
import { PartnerSpot } from "./PartnerSpot";

// Colunas de anúncio nas laterais, fixas ao rolar. Só em telas largas e altas (1536x740+), onde sobra
// espaço dos dois lados do conteúdo mais largo do site (1024px); no celular não aparecem.
// Campanha vendida tem prioridade; sem ela, cada coluna mostra dois produtos com link de afiliado
// (GearShowcase, que troca os produtos a cada página).
export function SideRails() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const seed = Number(dateKey.replace(/-/g, ""));

  const rail = (side: 0 | 1) => {
    const sponsor = getSponsorFor("sidebar", dateKey, seed + side);
    return sponsor ? <PartnerSpot partner={sponsor} variant="rail" /> : <GearRail side={side} />;
  };

  return (
    <>
      <aside className="fixed left-6 top-1/2 z-10 hidden -translate-y-1/2 pt-14 [@media(min-width:1536px)_and_(min-height:740px)]:block" aria-label="Publicidade">
        {rail(0)}
      </aside>
      <aside className="fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 pt-14 [@media(min-width:1536px)_and_(min-height:740px)]:block" aria-label="Publicidade">
        {rail(1)}
      </aside>
    </>
  );
}
