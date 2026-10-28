// Campanhas de patrocinadores exibidas no site. Os anúncios são vendidos direto e hospedados
// aqui (imagens em public/partners/), sem rede de anúncios.
// Nomes de arquivos e classes evitam "ad"/"ads": bloqueadores escondem esses elementos.

export type PartnerPlacement = "post-game" | "home";

export type Partner = {
  id: string;
  // Quem pagou pela campanha
  sponsor: string;
  headline: string;
  description?: string;
  // Caminho dentro de public/, ex.: "/partners/marca.png" (proporção 16:9 no pós-jogo)
  imageSrc?: string;
  href: string;
  cta: string;
  // Período da campanha em datas UTC (YYYY-MM-DD), inclusive
  startsOn?: string;
  endsOn?: string;
  placements: PartnerPlacement[];
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
//   placements: ["post-game", "home"],
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
  placements: ["post-game", "home"],
};

const isRunning = (partner: Partner, dateKey: string) =>
  (!partner.startsOn || partner.startsOn <= dateKey) && (!partner.endsOn || dateKey <= partner.endsOn);

// Escolhe uma campanha ativa para o espaço; com várias, alterna por dia.
export const getPartnerFor = (placement: PartnerPlacement, dateKey: string, seed: number): Partner => {
  const running = partners.filter((partner) => partner.placements.includes(placement) && isRunning(partner, dateKey));
  return running.length ? running[seed % running.length] : housePartner;
};
