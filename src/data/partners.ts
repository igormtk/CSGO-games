// Campanhas de patrocinadores exibidas no site. Os anúncios são vendidos direto e hospedados
// aqui (imagens em public/partners/), sem rede de anúncios.
// Nomes de arquivos e classes evitam "ad"/"ads": bloqueadores escondem esses elementos.

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

const isRunning = (partner: Partner, dateKey: string) =>
  (!partner.startsOn || partner.startsOn <= dateKey) && (!partner.endsOn || dateKey <= partner.endsOn);

// Escolhe uma campanha ativa para o espaço; com várias, alterna por dia.
export const getPartnerFor = (placement: PartnerPlacement, dateKey: string, seed: number): Partner => {
  const running = partners.filter((partner) => partner.placements.includes(placement) && isRunning(partner, dateKey));
  return running.length ? running[seed % running.length] : housePartner;
};
