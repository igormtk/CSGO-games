import { headers } from "next/headers";
import { gearForDay } from "@/data/gear";
import { getSponsorFor } from "@/data/partners";
import { amazonStoreFor } from "@/lib/amazon";
import { GearRail } from "./GearRail";
import { PartnerSpot } from "./PartnerSpot";

// Colunas de anúncio nas laterais, fixas ao rolar. Só em telas largas e altas (1536x740+), onde sobra
// espaço dos dois lados do conteúdo mais largo do site (1024px); no celular não aparecem.
// Campanha vendida tem prioridade; sem ela, cada coluna mostra dois produtos com link de afiliado,
// com a foto do modelo vendido na loja Amazon do país do visitante.
export async function SideRails() {
  const dateKey = new Date().toISOString().slice(0, 10);
  const seed = Number(dateKey.replace(/-/g, ""));
  const gear = gearForDay(seed);
  const store = amazonStoreFor((await headers()).get("x-vercel-ip-country")).key;

  const rail = (offset: number, products: typeof gear) => {
    const sponsor = getSponsorFor("sidebar", dateKey, seed + offset);
    return sponsor ? <PartnerSpot partner={sponsor} variant="rail" /> : <GearRail products={products} store={store} />;
  };

  return (
    <>
      <aside className="fixed left-6 top-1/2 z-10 hidden -translate-y-1/2 pt-14 [@media(min-width:1536px)_and_(min-height:740px)]:block" aria-label="Publicidade">
        {rail(0, gear.slice(0, 2))}
      </aside>
      <aside className="fixed right-6 top-1/2 z-10 hidden -translate-y-1/2 pt-14 [@media(min-width:1536px)_and_(min-height:740px)]:block" aria-label="Publicidade">
        {rail(1, gear.slice(2, 4))}
      </aside>
    </>
  );
}
