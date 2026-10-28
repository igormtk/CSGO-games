// Endereço público do site, usado em links canônicos, sitemap, robots e dados estruturados.
// NEXT_PUBLIC_SITE_URL sobrepõe; sem ela, produção usa o domínio oficial (inclusive nos previews
// da Vercel, para os buscadores sempre apontarem para csgo-games.com).
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "production" ? "https://csgo-games.com" : "http://localhost:3000");

export const siteName = "CS Games";
export const siteDescription =
  "Daily Counter-Strike games: fit pro players into the CS Bingo board, find the mystery player of the day and guess pro players' real names.";
