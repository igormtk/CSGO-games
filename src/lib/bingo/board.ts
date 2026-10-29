// Cartela e baralho do CS Bingo, compartilhados pelo desafio diário e pelo multiplayer.
// A mesma chave (data do dia ou código da sala) sempre gera a mesma cartela e o mesmo baralho.
import { bingoCriteria, csPlayers, playerMatchesCriterion } from "@/data/csBingoDatabase";
import type { BingoCriterion, CsPlayer } from "@/data/csBingoDatabase";
import { hashDate, seededShuffle } from "@/lib/daily";

export const GRID_SIZE = 4;
// Quantos possíveis jogadores aparecem em cada casa vazia no fim da partida.
export const REVEALED_ANSWERS = 3;
// Dificuldade: casas simples só com critérios restritos (no máximo 8 jogadores), mais 6 casas que
// combinam dois critérios (de 2 a 6 jogadores). Com isso, mesmo quem conhece a base inteira
// raramente completa a cartela, mas toda cartela sorteada tem pelo menos uma solução.
const MAX_SINGLE_CANDIDATES = 8;
const MIN_COMBO_CANDIDATES = 2;
const MAX_COMBO_CANDIDATES = 6;
const COMBO_CELLS = 6;
const BOARD_ATTEMPTS = 300;
// Jogadores sorteados da base para o baralho do dia. A cartela é calibrada para esse tamanho.
export const DECK_SIZE = 42;

export type BoardCell = BingoCriterion[];
export type GameBoard = BoardCell[];

export const playerFitsCell = (player: CsPlayer, cell: BoardCell) =>
  cell.every((criterion) => playerMatchesCriterion(player, criterion));

const countCandidates = (cell: BoardCell, deck: CsPlayer[]) => deck.filter((player) => playerFitsCell(player, cell)).length;

// Pares sem sentido juntos: "Vitality + 3+ times" lê como se fossem três times da Vitality.
const isConfusingPair = (first: BingoCriterion, second: BingoCriterion) =>
  [first, second].some((criterion) => criterion.id === "teams-3") &&
  [first, second].some((criterion) => criterion.type === "team");

// Casas possíveis para o baralho do dia. Simples: critérios com poucos candidatos. Combinadas: pares
// que restringem de verdade (nenhum dos dois implica o outro). Dois critérios do mesmo tipo
// ("2+ Majors + Top 20 5+ vezes") ficam de fora: confundem mais do que desafiam.
const buildCandidateCells = (deck: CsPlayer[]) => {
  const singleCells: BoardCell[] = bingoCriteria
    .filter((criterion) => {
      const candidates = countCandidates([criterion], deck);
      return candidates > 0 && candidates <= MAX_SINGLE_CANDIDATES;
    })
    .map((criterion) => [criterion]);

  const comboCells: BoardCell[] = bingoCriteria.flatMap((first, firstIndex) =>
    bingoCriteria.slice(firstIndex + 1).flatMap((second) => {
      if (first.type === second.type || isConfusingPair(first, second)) return [];
      const candidates = countCandidates([first, second], deck);
      const narrowsBoth = candidates < Math.min(countCandidates([first], deck), countCandidates([second], deck));
      return candidates >= MIN_COMBO_CANDIDATES && candidates <= MAX_COMBO_CANDIDATES && narrowsBoth ? [[first, second]] : [];
    })
  );

  return { singleCells, comboCells };
};

// Cada jogador ocupa uma casa só, então não basta toda casa ter uma resposta: precisa existir
// um jogador diferente para cada casa (emparelhamento bipartido com caminhos aumentantes).
const boardHasAnswers = (cells: GameBoard, deck: CsPlayer[]) => {
  const cellCandidates = cells.map((cell) =>
    deck.filter((player) => playerFitsCell(player, cell)).map((player) => player.id)
  );
  const cellByPlayer: Record<string, number> = {};

  const assignCell = (cellIndex: number, visited: Set<string>): boolean =>
    cellCandidates[cellIndex].some((playerId) => {
      if (visited.has(playerId)) return false;
      visited.add(playerId);

      const occupiedCell = cellByPlayer[playerId];
      if (occupiedCell === undefined || assignCell(occupiedCell, visited)) {
        cellByPlayer[playerId] = cellIndex;
        return true;
      }
      return false;
    });

  return cellCandidates.every((_, cellIndex) => assignCell(cellIndex, new Set()));
};

// Simula quantas casas um jogador preenche jogando o baralho do dia. O ingênuo usa a primeira
// casa livre compatível; o experiente conhece a base e usa a casa com menos candidatos.
const simulateFill = (cells: GameBoard, queue: CsPlayer[], strategy: "naive" | "expert") => {
  const filled = new Set<number>();
  const candidates = cells.map((cell) => countCandidates(cell, queue));

  queue.forEach((player) => {
    const options = cells
      .map((_, index) => index)
      .filter((index) => !filled.has(index) && playerFitsCell(player, cells[index]));
    if (!options.length) return;
    filled.add(strategy === "naive" ? options[0] : options.sort((a, b) => candidates[a] - candidates[b])[0]);
  });

  return filled.size;
};

const countUsefulPlayers = (cells: GameBoard, deck: CsPlayer[]) =>
  deck.filter((player) => cells.some((cell) => playerFitsCell(player, cell))).length;

// Entre várias cartelas sorteadas com solução, fica a que mais derrota o jogador experiente,
// depois o ingênuo, e que tem mais nomes que não servem em casa nenhuma.
export const createBoard = (seedKey: string, queue: CsPlayer[]): GameBoard => {
  const seed = hashDate(seedKey);
  const { singleCells, comboCells } = buildCandidateCells(queue);
  let bestBoard: GameBoard | undefined;
  let bestScore = Infinity;

  for (let attempt = 0; attempt < BOARD_ATTEMPTS; attempt += 1) {
    // Cada critério aparece no máximo uma vez na cartela, para variar as casas.
    const usedIds = new Set<string>();
    const takeUnused = (cells: BoardCell[], limit: number) => {
      const taken: BoardCell[] = [];
      for (const cell of cells) {
        if (taken.length === limit) break;
        if (cell.some((criterion) => usedIds.has(criterion.id))) continue;
        cell.forEach((criterion) => usedIds.add(criterion.id));
        taken.push(cell);
      }
      return taken;
    };
    const combos = takeUnused(seededShuffle(comboCells, seed + attempt * 7919), COMBO_CELLS);
    const singles = takeUnused(
      seededShuffle(singleCells, seed * 3 + attempt * 104729),
      GRID_SIZE * GRID_SIZE - combos.length
    );
    const cells = seededShuffle([...combos, ...singles], seed + attempt);
    if (cells.length < GRID_SIZE * GRID_SIZE || !boardHasAnswers(cells, queue)) continue;

    const score =
      simulateFill(cells, queue, "expert") * 100 + simulateFill(cells, queue, "naive") * 10 + countUsefulPlayers(cells, queue) / 10;
    if (score < bestScore) {
      bestBoard = cells;
      bestScore = score;
    }
  }

  return bestBoard ?? bingoCriteria.slice(0, GRID_SIZE * GRID_SIZE).map((criterion) => [criterion]);
};

// O baralho do dia sorteia DECK_SIZE jogadores da base, inclusive os que não servem em nenhuma casa:
// reconhecer esses nomes e pulá-los faz parte do desafio.
export const createPlayerQueue = (seedKey: string) => seededShuffle(csPlayers, hashDate(seedKey) * 17).slice(0, DECK_SIZE);

export const getPossibleAnswers = (cell: BoardCell, usedPlayerIds: Set<string>, deck: CsPlayer[]) =>
  deck
    .filter((player) => !usedPlayerIds.has(player.id) && playerFitsCell(player, cell))
    .slice(0, REVEALED_ANSWERS)
    .map((player) => player.nickname);
