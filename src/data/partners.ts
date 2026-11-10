// Campanhas de patrocinadores exibidas no site. Os anúncios são vendidos direto e hospedados
// aqui (imagens em public/partners/). Espaço sem campanha fica com o Google AdSense, se configurado
// (src/lib/adsense.ts), ou com o "Anuncie aqui".
// Nomes de arquivos e classes evitam "ad"/"ads": bloqueadores escondem esses elementos.

import { gearProducts } from "@/data/gear";
import type { GearCategory } from "@/data/gear";
import type { Language } from "@/lib/language";

// sidebar: colunas laterais (160x600) que aparecem só em telas largas.
export type PartnerPlacement = "post-game" | "home" | "sidebar";

type PartnerCopy = { headline: string; description?: string; cta: string };

export type Partner = {
  id: string;
  // Quem pagou pela campanha
  sponsor: string;
  headline: string;
  description?: string;
  // Caminho dentro de public/, ex.: "/partners/marca.png" (proporção 16:9 no pós-jogo)
  imageSrc?: string;
  // Imagem vertical para as colunas laterais (160x600); sem ela, a coluna mostra o texto.
  railImageSrc?: string;
  href: string;
  cta: string;
  // Período da campanha em datas UTC (YYYY-MM-DD), inclusive
  startsOn?: string;
  endsOn?: string;
  placements: PartnerPlacement[];
  // Textos em outros idiomas; sem tradução, aparece o texto principal.
  translations?: Partial<Record<Language, PartnerCopy>>;
  // Rótulo no lugar de "Publicidade" (ex.: links de afiliado) e aviso curto no rodapé da caixa.
  label?: Record<Language, string>;
  note?: Record<Language, string>;
  // Ilustração do tipo de equipamento, quando não há imagem.
  gearCategory?: GearCategory;
};

// Adicione aqui cada campanha vendida. Exemplo:
// {
//   id: "marca-2026-11",
//   sponsor: "Marca",
//   headline: "Mousepad oficial do campeonato",
//   description: "10% de desconto com o cupom BINGO",
//   imageSrc: "/partners/marca.png",
//   href: "https://marca.example/?utm_source=csgames&utm_medium=post-game",
//   cta: "Comprar",
//   startsOn: "2026-11-01",
//   endsOn: "2026-11-30",
//   railImageSrc: "/partners/marca-lateral.png",
//   placements: ["post-game", "home", "sidebar"],
// },
export const partners: Partner[] = [];

// Sem campanha ativa, o espaço anuncia a si mesmo.
const advertiseContact = process.env.NEXT_PUBLIC_ADVERTISE_CONTACT;

export const housePartner: Partner = {
  id: "house",
  sponsor: "CS Games",
  headline: "Sua marca aqui",
  description: "Anuncie para quem joga CS todo dia.",
  href: advertiseContact ?? "",
  cta: "Anuncie aqui",
  placements: ["post-game", "home", "sidebar"],
  translations: {
    en: { headline: "Your brand here", description: "Advertise to people who play CS every day.", cta: "Advertise here" },
    es: { headline: "Tu marca aquí", description: "Anúnciate para quienes juegan CS todos los días.", cta: "Anúnciate aquí" },
  },
};

// Colunas laterais sem campanha vendida mostram equipamento com link de afiliado da Amazon
// (src/data/gear.ts). O aviso "como associado da Amazon..." é exigido perto do link.
const gearPartners: Partner[] = gearProducts.map((product) => ({
  id: `amazon-${product.id}`,
  sponsor: "Amazon",
  headline: product.name,
  description: product.pitch.pt,
  href: `/go/amazon/${product.id}`,
  cta: "Ver na Amazon",
  placements: ["sidebar"],
  gearCategory: product.category,
  translations: {
    en: { headline: product.name, description: product.pitch.en, cta: "See on Amazon" },
    es: { headline: product.name, description: product.pitch.es, cta: "Ver en Amazon" },
  },
  label: { pt: "Link de afiliado", en: "Affiliate link", es: "Enlace de afiliado" },
  note: {
    pt: "Como associado da Amazon, ganhamos com compras qualificadas.",
    en: "As an Amazon Associate we earn from qualifying purchases.",
    es: "Como asociado de Amazon, ganamos con compras que cumplen los requisitos.",
  },
}));

const isRunning = (partner: Partner, dateKey: string) =>
  (!partner.startsOn || partner.startsOn <= dateKey) && (!partner.endsOn || dateKey <= partner.endsOn);

// Escolhe uma campanha ativa para o espaço; com várias, alterna por dia.
export const getPartnerFor = (placement: PartnerPlacement, dateKey: string, seed: number): Partner => {
  const running = partners.filter((partner) => partner.placements.includes(placement) && isRunning(partner, dateKey));
  if (running.length) return running[seed % running.length];
  if (placement === "sidebar") return gearPartners[seed % gearPartners.length];
  return housePartner;
};
