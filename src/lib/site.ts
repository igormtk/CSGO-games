// Endereço público do site, usado em links canônicos, sitemap, robots e dados estruturados.
// NEXT_PUBLIC_SITE_URL sobrepõe; sem ela, produção usa o domínio oficial (inclusive nos previews
// da Vercel, para os buscadores sempre apontarem para csgo-games.com).
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "production" ? "https://csgo-games.com" : "http://localhost:3000");

export const siteName = "CS Games";
export const siteDescription =
  "Jogos diários de Counter-Strike: encaixe pro players na cartela do CS Bingo, descubra o jogador misterioso do dia e adivinhe o nome real dos jogadores.";
