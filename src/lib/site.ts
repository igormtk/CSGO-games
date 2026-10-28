// Endereço público do site. Defina NEXT_PUBLIC_SITE_URL quando o domínio estiver comprado;
// na Vercel, sem ela, usa o domínio de produção do projeto.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const siteName = "CS Games";
export const siteDescription =
  "Jogos diários de Counter-Strike: encaixe pro players na cartela do CS Bingo, descubra o jogador misterioso do dia e adivinhe o nome real dos jogadores.";
