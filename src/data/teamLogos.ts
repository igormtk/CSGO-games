// Logos (só o símbolo) em public/teams, baixadas do Liquipedia por scripts/fetch-team-logos.mjs.
// São marcas dos times e aparecem só para identificá-los (ver /termos).
const TEAMS_WITH_LOGO = new Set([
  "navi",
  "astralis",
  "faze",
  "g2",
  "vitality",
  "liquid",
  "furia",
  "fnatic",
  "mibr",
  "cloud9",
  "spirit",
  "mousesports",
  "falcons",
  "mongolz",
  "nip",
  "bcgame",
  "100thieves",
  "withoutaroof",
]);

export const getTeamLogo = (teamId: string) => (TEAMS_WITH_LOGO.has(teamId) ? `/teams/${teamId}.png` : undefined);
