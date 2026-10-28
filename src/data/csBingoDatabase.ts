// Com extensão: os scripts em scripts/ importam este arquivo direto no Node.
import { generatedPlayers, generatedTeams } from "./generated/liquipedia.ts";

export type CsTeam = {
  id: string;
  name: string;
  country: string;
  region: string;
  founded: number;
  status: "active" | "inactive";
  notableAchievements: string[];
  liquipediaPage?: string;
};

export type CsPlayer = {
  id: string;
  nickname: string;
  fullName: string;
  nationality: string;
  region: string;
  roles: string[];
  currentTeam?: string;
  teams: string[];
  majorsWon: number;
  majorMvp: boolean;
  hltvTop20Years: number[];
  active: boolean;
  liquipediaPage?: string;
};

export type BingoCriterion = {
  id: string;
  label: string;
  helper: string;
  type: "team" | "nationality" | "region" | "role" | "achievement" | "status";
  value: string | number | boolean;
};

export type CsCoach = {
  id: string;
  nickname: string;
  fullName: string;
  nationality: string;
  currentTeam?: string;
  teamsCoached: string[];
};

// Times e jogadores vêm do Liquipedia (scripts/import-players.mjs). Dado errado: corrija no
// Liquipedia e rode o script de novo.
export const csTeams: CsTeam[] = generatedTeams;

export const csPlayers: CsPlayer[] = generatedPlayers;

export const csCoaches: CsCoach[] = [
  {
    id: "zonic",
    nickname: "zonic",
    fullName: "Danny Sørensen",
    nationality: "Denmark",
    currentTeam: "falcons",
    teamsCoached: ["astralis", "falcons"],
  },
  {
    id: "hally",
    nickname: "hally",
    fullName: "Sergey Shavaev",
    nationality: "Russia",
    currentTeam: "spirit",
    teamsCoached: ["spirit"],
  },
  {
    id: "xtqzzz",
    nickname: "XTQZZZ",
    fullName: "Rémy Quoniam",
    nationality: "France",
    currentTeam: "vitality",
    teamsCoached: ["vitality"],
  },
  {
    id: "sidde",
    nickname: "sidde",
    fullName: "Sidnei Macedo",
    nationality: "Brazil",
    currentTeam: "furia",
    teamsCoached: ["furia"],
  },
  {
    id: "sycrone",
    nickname: "sycrone",
    fullName: "Dennis Nielsen",
    nationality: "Denmark",
    currentTeam: "mousesports",
    teamsCoached: ["mousesports"],
  },
  {
    id: "saw",
    nickname: "sAw",
    fullName: "Eetu Saha",
    nationality: "Finland",
    currentTeam: "g2",
    teamsCoached: ["g2"],
  },
  {
    id: "flashie",
    nickname: "flashie",
    fullName: "Viktor Tamás Bea",
    nationality: "Hungary",
    currentTeam: "liquid",
    teamsCoached: ["liquid"],
  },
  {
    id: "maaraa",
    nickname: "maaRaa",
    fullName: "Erdenedalai Bayanbat",
    nationality: "Mongolia",
    currentTeam: "mongolz",
    teamsCoached: ["mongolz"],
  },
];

export const bingoCriteria: BingoCriterion[] = [
  { id: "team-navi", label: "NAVI", helper: "Jogou pela Natus Vincere", type: "team", value: "navi" },
  { id: "team-astralis", label: "Astralis", helper: "Jogou pela Astralis", type: "team", value: "astralis" },
  { id: "team-faze", label: "FaZe", helper: "Jogou pela FaZe Clan", type: "team", value: "faze" },
  { id: "team-g2", label: "G2", helper: "Jogou pela G2 Esports", type: "team", value: "g2" },
  { id: "team-vitality", label: "Vitality", helper: "Jogou pela Team Vitality", type: "team", value: "vitality" },
  { id: "team-liquid", label: "Liquid", helper: "Jogou pela Team Liquid", type: "team", value: "liquid" },
  { id: "team-furia", label: "FURIA", helper: "Jogou pela FURIA", type: "team", value: "furia" },
  { id: "team-fnatic", label: "Fnatic", helper: "Jogou pela Fnatic", type: "team", value: "fnatic" },
  { id: "team-spirit", label: "Spirit", helper: "Jogou pela Team Spirit", type: "team", value: "spirit" },
  { id: "team-mouz", label: "MOUZ", helper: "Jogou pela MOUZ", type: "team", value: "mousesports" },
  { id: "team-falcons", label: "Falcons", helper: "Jogou pela Team Falcons", type: "team", value: "falcons" },
  { id: "team-cloud9", label: "Cloud9", helper: "Jogou pela Cloud9", type: "team", value: "cloud9" },
  { id: "team-nip", label: "NIP", helper: "Jogou pela Ninjas in Pyjamas", type: "team", value: "nip" },
  { id: "team-vp", label: "Virtus.pro", helper: "Jogou pela Virtus.pro", type: "team", value: "virtuspro" },
  { id: "team-sk", label: "SK Gaming", helper: "Jogou pela SK Gaming", type: "team", value: "skgaming" },
  { id: "team-complexity", label: "Complexity", helper: "Jogou pela Complexity", type: "team", value: "complexity" },
  { id: "team-heroic", label: "HEROIC", helper: "Jogou pela HEROIC", type: "team", value: "heroic" },
  { id: "team-mibr", label: "MIBR", helper: "Jogou pela MIBR", type: "team", value: "mibr" },
  { id: "nat-brazil", label: "Brasil", helper: "Jogador brasileiro", type: "nationality", value: "Brazil" },
  { id: "nat-denmark", label: "Dinamarca", helper: "Jogador dinamarquês", type: "nationality", value: "Denmark" },
  { id: "nat-france", label: "França", helper: "Jogador francês", type: "nationality", value: "France" },
  { id: "nat-russia", label: "Rússia", helper: "Jogador russo", type: "nationality", value: "Russia" },
  { id: "nat-ukraine", label: "Ucrânia", helper: "Jogador ucraniano", type: "nationality", value: "Ukraine" },
  { id: "nat-israel", label: "Israel", helper: "Jogador israelense", type: "nationality", value: "Israel" },
  { id: "nat-sweden", label: "Suécia", helper: "Jogador sueco", type: "nationality", value: "Sweden" },
  { id: "nat-poland", label: "Polônia", helper: "Jogador polonês", type: "nationality", value: "Poland" },
  { id: "region-na", label: "NA", helper: "Representa a América do Norte", type: "region", value: "North America" },
  { id: "role-awper", label: "AWPer", helper: "Atua ou atuou como AWPer", type: "role", value: "AWPer" },
  { id: "role-igl", label: "IGL", helper: "Atua ou atuou como in-game leader", type: "role", value: "IGL" },
  { id: "role-lurker", label: "Lurker", helper: "Atua ou atuou como lurker", type: "role", value: "Lurker" },
  { id: "role-entry", label: "Entry fragger", helper: "Atua ou atuou como entry fragger", type: "role", value: "Entry fragger" },
  { id: "major-winner", label: "Major winner", helper: "Venceu pelo menos um Major", type: "achievement", value: "major-winner" },
  { id: "major-mvp", label: "Major MVP", helper: "Foi MVP de Major", type: "achievement", value: "major-mvp" },
  { id: "top20", label: "HLTV Top 20", helper: "Apareceu no Top 20 da HLTV", type: "achievement", value: "hltv-top20" },
  { id: "multi-major", label: "2+ Majors", helper: "Venceu dois Majors ou mais", type: "achievement", value: "multi-major" },
  { id: "no-major", label: "Sem Major", helper: "Nunca venceu um Major", type: "achievement", value: "no-major" },
  { id: "top20-5", label: "Top 20 5+ vezes", helper: "Entrou no Top 20 da HLTV em cinco anos ou mais", type: "achievement", value: "hltv-top20-5" },
  { id: "teams-3", label: "3+ times", helper: "Passou por três times ou mais", type: "achievement", value: "teams-3" },
  { id: "active", label: "Ativo", helper: "Ainda está ativo no cenário", type: "status", value: true },
  { id: "retired", label: "Aposentado", helper: "Não joga mais profissionalmente", type: "status", value: false },
];

export const teamNameById = csTeams.reduce<Record<string, string>>((acc, team) => {
  acc[team.id] = team.name;
  return acc;
}, {});

export const getTeamName = (teamId: string) => teamNameById[teamId] ?? teamId;

export const playerMatchesCriterion = (player: CsPlayer, criterion: BingoCriterion) => {
  switch (criterion.type) {
    case "team":
      return player.teams.includes(String(criterion.value));
    case "nationality":
      return player.nationality === criterion.value;
    case "region":
      return player.region === criterion.value;
    case "role":
      return player.roles.includes(String(criterion.value));
    case "achievement":
      if (criterion.value === "major-winner") return player.majorsWon > 0;
      if (criterion.value === "major-mvp") return player.majorMvp;
      if (criterion.value === "hltv-top20") return player.hltvTop20Years.length > 0;
      if (criterion.value === "multi-major") return player.majorsWon >= 2;
      if (criterion.value === "no-major") return player.majorsWon === 0;
      if (criterion.value === "hltv-top20-5") return player.hltvTop20Years.length >= 5;
      if (criterion.value === "teams-3") return player.teams.length >= 3;
      return false;
    case "status":
      return player.active === criterion.value;
    default:
      return false;
  }
};

export const playerMatchesCell = (
  player: CsPlayer,
  rowCriterion: BingoCriterion,
  columnCriterion: BingoCriterion
) => playerMatchesCriterion(player, rowCriterion) && playerMatchesCriterion(player, columnCriterion);
