// Agrupe os 16: quatro grupos de quatro pro players, cada grupo com uma característica em comum.
// Imports relativos com extensão: os testes em scripts/ rodam este arquivo direto no Node.
import { csPlayers, csTeams } from "../data/csBingoDatabase.ts";
import type { CsPlayer } from "../data/csBingoDatabase.ts";
import { hashDate, seededShuffle } from "./daily.ts";

export const GROUP_COUNT = 4;
export const GROUP_SIZE = 4;
// Critério só entra no sorteio se tiver gente o bastante para sobrar 4 jogadores exclusivos.
const MIN_CRITERION_PLAYERS = 6;
const MIN_TEAM_PLAYERS = 8;
const ATTEMPTS = 500;

export type GroupCriterion =
  | { kind: "team"; value: string }
  | { kind: "country"; value: string }
  | { kind: "role"; value: string }
  | { kind: "mvp" }
  | { kind: "majors" }
  | { kind: "top20" };

export type PuzzleGroup = { criterion: GroupCriterion; playerIds: string[] };

export type GroupsPuzzle = { groups: PuzzleGroup[]; tiles: string[] };

// Limites dos critérios numéricos (aparecem nos textos do jogo).
export const MIN_MAJORS = 2;
export const MIN_TOP20_YEARS = 5;

export const matchesCriterion = (player: CsPlayer, criterion: GroupCriterion) => {
  switch (criterion.kind) {
    case "team":
      return player.teams.includes(criterion.value);
    case "country":
      return player.nationality === criterion.value;
    case "role":
      return player.roles.includes(criterion.value);
    case "mvp":
      return player.majorMvp;
    case "majors":
      return player.majorsWon >= MIN_MAJORS;
    case "top20":
      return player.hltvTop20Years.length >= MIN_TOP20_YEARS;
  }
};

export const countMatches = (criterion: GroupCriterion) => csPlayers.filter((player) => matchesCriterion(player, criterion)).length;

// Critérios conhecidos o bastante para virar tema (também usados pelo 60 segundos).
export const candidateCriteria: GroupCriterion[] = [
  // Times de base (academy/NXT) e times com poucos nomes na base ficam de fora: ninguém conhece.
  ...csTeams
    .filter((team) => !/academy|nxt/i.test(team.id) && countMatches({ kind: "team", value: team.id }) >= MIN_TEAM_PLAYERS)
    .map((team): GroupCriterion => ({ kind: "team", value: team.id })),
  ...[...new Set(csPlayers.map((player) => player.nationality))].map((country): GroupCriterion => ({ kind: "country", value: country })),
  { kind: "role", value: "AWPer" },
  { kind: "role", value: "IGL" },
  { kind: "mvp" },
  { kind: "majors" },
  { kind: "top20" },
];

const criteriaPool = candidateCriteria.filter((criterion) => countMatches(criterion) >= MIN_CRITERION_PLAYERS);

const isTeam = (criterion: GroupCriterion) => criterion.kind === "team";
const isStat = (criterion: GroupCriterion) => criterion.kind === "mvp" || criterion.kind === "majors" || criterion.kind === "top20";

// Mesmo dia, mesmo quebra-cabeça para todo mundo. Cada jogador do grupo cumpre só o critério do
// próprio grupo entre os quatro sorteados, então a solução é única. Os grupos voltam do mais
// fácil (mais jogadores possíveis, normalmente os mais conhecidos) para o mais difícil.
export const createGroupsPuzzle = (dateKey: string): GroupsPuzzle => {
  const seed = hashDate(`groups-${dateKey}`);

  for (let attempt = 0; attempt < ATTEMPTS; attempt += 1) {
    const shuffled = seededShuffle(criteriaPool, seed + attempt * 7919);
    const chosen: GroupCriterion[] = [];
    for (const criterion of shuffled) {
      if (chosen.length === GROUP_COUNT) break;
      // Variedade: pelo menos um time, no máximo dois times e no máximo um critério de títulos.
      if (isTeam(criterion) && chosen.filter(isTeam).length >= 2) continue;
      if (isStat(criterion) && chosen.some(isStat)) continue;
      if (criterion.kind === "country" && chosen.some((entry) => entry.kind === "country")) continue;
      chosen.push(criterion);
    }
    if (chosen.length < GROUP_COUNT || !chosen.some(isTeam)) continue;

    const exclusive = chosen.map((criterion) =>
      csPlayers.filter(
        (player) => matchesCriterion(player, criterion) && chosen.every((other) => other === criterion || !matchesCriterion(player, other))
      )
    );
    if (exclusive.some((players) => players.length < GROUP_SIZE)) continue;

    const groups = chosen
      .map((criterion, index) => ({
        criterion,
        options: exclusive[index].length,
        playerIds: seededShuffle(exclusive[index], seed + index * 131 + attempt).slice(0, GROUP_SIZE).map((player) => player.id),
      }))
      .sort((a, b) => b.options - a.options)
      .map(({ criterion, playerIds }) => ({ criterion, playerIds }));
    const tiles = seededShuffle(
      groups.flatMap((group) => group.playerIds),
      seed * 3 + attempt
    );
    return { groups, tiles };
  }

  throw new Error(`Não foi possível montar os grupos de ${dateKey}`);
};
