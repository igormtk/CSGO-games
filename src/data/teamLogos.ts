// Logos (só o símbolo) em public/teams, baixadas do Liquipedia por scripts/fetch-team-logos.mjs.
// São marcas dos times e aparecem só para identificá-los (ver /termos).
import { teamLogoFiles } from "./generated/teamLogos";

export const getTeamLogo = (teamId: string) => (teamLogoFiles[teamId] ? `/teams/${teamLogoFiles[teamId]}` : undefined);
