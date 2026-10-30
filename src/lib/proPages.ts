// Páginas de cada pro player (/players/s1mple) e de cada time (/teams/navi), montadas a partir da
// base do Liquipedia. Respondem a buscas como "times do s1mple" ou "jogadores que passaram pela FURIA".
import { csPlayers, csTeams, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer, CsTeam } from "@/data/csBingoDatabase";
import { getCountryName } from "@/data/countryFlags";
import type { PageSeo } from "@/data/pageSeo";
import type { Language } from "./i18n";

// Time com menos jogadores na base vira página rala demais: fica sem página (e sem link).
export const MIN_TEAM_PAGE_PLAYERS = 3;
const TEAMMATES_LIMIT = 12;

export const getPlayer = (id: string) => csPlayers.find((player) => player.id === id);

export const getTeam = (id: string) => csTeams.find((team) => team.id === id);

// Peso para ordenar listas: quem tem mais títulos e mais anos no Top 20 aparece primeiro.
export const fame = (player: CsPlayer) => player.majorsWon * 3 + player.hltvTop20Years.length + (player.majorMvp ? 2 : 0);

const byFame = (a: CsPlayer, b: CsPlayer) => fame(b) - fame(a) || a.nickname.localeCompare(b.nickname);

export const getTeamPlayers = (teamId: string) => csPlayers.filter((player) => player.teams.includes(teamId)).sort(byFame);

export const teamsWithPages: CsTeam[] = csTeams.filter((team) => getTeamPlayers(team.id).length >= MIN_TEAM_PAGE_PLAYERS);

const teamPageIds = new Set(teamsWithPages.map((team) => team.id));

export const hasTeamPage = (teamId: string) => teamPageIds.has(teamId);

export const playersByName: CsPlayer[] = [...csPlayers].sort((a, b) => a.nickname.localeCompare(b.nickname, "en", { sensitivity: "base" }));

// Companheiros de time: quem dividiu mais times primeiro, depois os mais conhecidos.
export const getTeammates = (player: CsPlayer) =>
  csPlayers
    .filter((other) => other.id !== player.id)
    .map((other) => ({ player: other, shared: other.teams.filter((team) => player.teams.includes(team)) }))
    .filter((entry) => entry.shared.length > 0)
    .sort((a, b) => b.shared.length - a.shared.length || byFame(a.player, b.player))
    .slice(0, TEAMMATES_LIMIT);

const list = (items: string[], language: Language) =>
  new Intl.ListFormat({ pt: "pt-BR", en: "en", es: "es" }[language], { style: "long", type: "conjunction" }).format(items);

const moreTeams = { en: (count: number) => `${count} more`, pt: (count: number) => `mais ${count}`, es: (count: number) => `${count} más` };

// Até 4 times pelo nome; o resto vira "e mais 3" (a descrição não pode ficar longa demais).
const firstTeams = (player: CsPlayer, language: Language) => {
  const names = player.teams.map(getTeamName);
  return list(names.length > 4 ? [...names.slice(0, 4), moreTeams[language](names.length - 4)] : names, language);
};

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export const playerSeo = (player: CsPlayer): PageSeo => {
  const top20 = player.hltvTop20Years.length;
  const country = (language: Language) => getCountryName(player.nationality, language);
  return {
    path: `/players/${player.id}`,
    title: {
      en: `${player.nickname}: teams, Majors and career`,
      pt: `${player.nickname}: times, Majors e carreira`,
      es: `${player.nickname}: equipos, Majors y carrera`,
    },
    description: {
      en: `${player.fullName} (${player.nickname}), ${player.roles.join(" and ")} from ${country("en")}. Career teams: ${firstTeams(player, "en")}. ${plural(player.majorsWon, "Major title", "Major titles")}${top20 ? `, ${plural(top20, "year", "years")} in the HLTV Top 20` : ""}.`,
      // "de Brasil" não serve (seria "do Brasil", "da Ucrânia"): o país vai depois da vírgula.
      pt: `${player.fullName} (${player.nickname}): ${player.roles.join(" e ")}, ${country("pt")}. Times na carreira: ${firstTeams(player, "pt")}. ${plural(player.majorsWon, "título de Major", "títulos de Major")}${top20 ? `, ${plural(top20, "ano", "anos")} no Top 20 da HLTV` : ""}.`,
      es: `${player.fullName} (${player.nickname}), ${player.roles.join(" y ")} de ${country("es")}. Equipos en su carrera: ${firstTeams(player, "es")}. ${plural(player.majorsWon, "título de Major", "títulos de Major")}${top20 ? `, ${plural(top20, "año", "años")} en el Top 20 de HLTV` : ""}.`,
    },
    keywords: [player.nickname, player.fullName, `${player.nickname} teams`, `${player.nickname} CS2`, `times do ${player.nickname}`],
  };
};

export const teamSeo = (team: CsTeam): PageSeo => {
  const players = getTeamPlayers(team.id);
  const names = players.slice(0, 5).map((player) => player.nickname);
  return {
    path: `/teams/${team.id}`,
    title: {
      en: `${team.name}: every player in the team's history`,
      pt: `${team.name}: todos os jogadores da história do time`,
      es: `${team.name}: todos los jugadores de la historia del equipo`,
    },
    description: {
      en: `${players.length} Counter-Strike pro players who have played for ${team.name}, including ${list(names, "en")}. Current roster, Majors and HLTV Top 20 of each player.`,
      pt: `${players.length} pro players de Counter-Strike que já jogaram no time ${team.name}, entre eles ${list(names, "pt")}. Elenco atual, Majors e Top 20 da HLTV de cada jogador.`,
      es: `${players.length} pro players de Counter-Strike que jugaron en ${team.name}, entre ellos ${list(names, "es")}. Plantilla actual, Majors y Top 20 de HLTV de cada jugador.`,
    },
    keywords: [team.name, `${team.name} players`, `${team.name} roster`, `jogadores da ${team.name}`, `${team.name} CS2`],
  };
};

export const playersIndexSeo: PageSeo = {
  path: "/players",
  title: { en: "Counter-Strike pro players", pt: "Pro players de Counter-Strike", es: "Pro players de Counter-Strike" },
  description: {
    en: `Career teams, Majors and HLTV Top 20 years of ${csPlayers.length} Counter-Strike pro players, from the CS:GO era to CS2.`,
    pt: `Times na carreira, Majors e anos no Top 20 da HLTV de ${csPlayers.length} pro players de Counter-Strike, da era do CS:GO ao CS2.`,
    es: `Equipos en su carrera, Majors y años en el Top 20 de HLTV de ${csPlayers.length} pro players de Counter-Strike, de la era de CS:GO a CS2.`,
  },
};

export const teamsIndexSeo: PageSeo = {
  path: "/teams",
  title: { en: "Counter-Strike teams", pt: "Times de Counter-Strike", es: "Equipos de Counter-Strike" },
  description: {
    en: `${teamsWithPages.length} Counter-Strike teams and every pro player in our database who has played for each one.`,
    pt: `${teamsWithPages.length} times de Counter-Strike e todos os pro players da nossa base que já jogaram em cada um.`,
    es: `${teamsWithPages.length} equipos de Counter-Strike y todos los pro players de nuestra base que jugaron en cada uno.`,
  },
};
