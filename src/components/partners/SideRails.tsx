import { getPartnerFor } from "@/data/partners";
import { PartnerSpot } from "./PartnerSpot";

// Colunas de anúncio nas laterais, fixas ao rolar. Só em telas largas e altas (1536x740+), onde sobra
// espaço dos dois lados do conteúdo mais largo do site (1024px); no celular não aparecem.
export function SideRails() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const seed = Number(dateKey.replace(/-/g, ""));

  return (
    <>
      <aside className="fixed left-6 top-1/2 z-10 hidden -translate-y-1/2 pt-14 [@media(min-width:1536px)_and_(min-height:740px)]:block" aria-label="Publicidade">
        <PartnerSpot partner={getPartnerFor("sidebar", dateKey, seed)} variant="rail" />
      </aside>
      <aside className="fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 pt-14 [@media(min-width:1536px)_and_(min-height:740px)]:block" aria-label="Publicidade">
        <PartnerSpot partner={getPartnerFor("sidebar", dateKey, seed + 1)} variant="rail" />
      </aside>
    </>
  );
}
