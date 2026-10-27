"use client";

import Link from "next/link";
import { Rajdhani } from "next/font/google";
import { Fragment, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Check,
  Crosshair,
  Flame,
  Globe2,
  HelpCircle,
  Menu,
  RotateCcw,
  Share2,
  Shield,
  SkipForward,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import {
  bingoCriteria,
  csPlayers,
  playerMatchesCell,
} from "@/data/csBingoDatabase";
import type { BingoCriterion, CsPlayer } from "@/data/csBingoDatabase";

const csFont = Rajdhani({ subsets: ["latin"], weight: ["500", "600", "700"] });

const GRID_SIZE = 3;
const GAME_KEY_PREFIX = "cs-bingo-daily";
const LANGUAGE_KEY = "cs-bingo-language";
const STATS_KEY = "cs-bingo-stats";
const POINTS_PER_HIT = 100;
const PERFECT_BONUS = 300;
const REVEALED_ANSWERS = 3;

type CellPick = {
  player: CsPlayer;
  wildcard: boolean;
};

type GameBoard = {
  rows: BingoCriterion[];
  columns: BingoCriterion[];
};

type GameStatus = "playing" | "completed" | "out-of-names";
type Language = "pt" | "en" | "es";
type MessageTone = "neutral" | "success" | "error" | "wildcard";

type StoredGame = {
  picks?: Record<string, string>;
  playerIndex?: number;
  skippedPlayerIds?: string[];
  mistakes?: number;
  wildcardCell?: string;
};

type PlayerStats = {
  played: number;
  finished: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate?: string;
};

type CriterionCopy = {
  label: string;
  helper: string;
};

type TranslationCopy = {
  languageName: string;
  puzzleDate: string;
  progress: string;
  score: string;
  points: string;
  reset: string;
  home: string;
  currentPlayerEyebrow: string;
  noCurrentPlayerTitle: string;
  namesLeft: string;
  skippedLabel: string;
  skip: string;
  boardCorner: string;
  rowAxis: string;
  columnAxis: string;
  selectLanguage: string;
  wildcard: string;
  wildcardSpent: string;
  cancelWildcard: string;
  wildcardArmedMessage: string;
  wildcardMessage: (player: string, row: string, column: string) => string;
  initialMessage: string;
  resetMessage: string;
  completedMessage: string;
  outOfNamesMessage: string;
  wrongMessage: (player: string, skippedPlayer?: string) => string;
  correctMessage: (player: string, row: string, column: string) => string;
  alreadyPickedMessage: string;
  gameOverCompleted: string;
  gameOverOutOfNames: string;
  hitsLabel: string;
  perfectBonus: string;
  share: string;
  shareCopied: string;
  shareFailed: string;
  possibleAnswers: string;
  statsTitle: string;
  played: string;
  finished: string;
  currentStreak: string;
  bestStreak: string;
  rulesTitle: string;
  rules: string[];
  close: string;
};

const translations: Record<Language, TranslationCopy> = {
  pt: {
    languageName: "Português",
    puzzleDate: "Puzzle UTC",
    progress: "Progresso",
    score: "Pontos",
    points: "pts",
    reset: "Reiniciar tentativa",
    home: "Início",
    currentPlayerEyebrow: "Nome da vez",
    noCurrentPlayerTitle: "Nenhum nome restante",
    namesLeft: "Nomes restantes",
    skippedLabel: "Nome perdido",
    skip: "Pular",
    boardCorner: "Linha x Coluna",
    rowAxis: "linha",
    columnAxis: "coluna",
    selectLanguage: "Idioma",
    wildcard: "Coringa",
    wildcardSpent: "Coringa usado",
    cancelWildcard: "Cancelar",
    wildcardArmedMessage: "Coringa ativado: clique em qualquer casa livre para colocar o nome da vez.",
    wildcardMessage: (player, row, column) => `Coringa! ${player} ocupa ${row} + ${column} (sem pontos).`,
    initialMessage: "Um nome aparece por vez. Clique na casa que combina com esse jogador.",
    resetMessage: "Cartela reiniciada. O primeiro nome já está na tela.",
    completedMessage: "Bingo completo! Todas as casas foram preenchidas.",
    outOfNamesMessage: "Você ficou sem nomes. Veja na cartela quem poderia ocupar as casas vazias.",
    wrongMessage: (player, skippedPlayer) =>
      skippedPlayer
        ? `${player} não combina com essa casa. Você perdeu também ${skippedPlayer}.`
        : `${player} não combina com essa casa.`,
    correctMessage: (player, row, column) => `Boa! ${player} preenche ${row} + ${column}.`,
    alreadyPickedMessage: "Essa casa já está marcada. Escolha uma casa livre.",
    gameOverCompleted: "Bingo!",
    gameOverOutOfNames: "Fim de jogo",
    hitsLabel: "Acertos",
    perfectBonus: "Bônus de cartela perfeita",
    share: "Compartilhar resultado",
    shareCopied: "Resultado copiado!",
    shareFailed: "Não foi possível copiar o resultado.",
    possibleAnswers: "Possíveis",
    statsTitle: "Estatísticas",
    played: "Jogos",
    finished: "Bingos",
    currentStreak: "Sequência",
    bestStreak: "Melhor sequência",
    rulesTitle: "Como jogar",
    rules: [
      "Um jogador aparece por vez. Coloque-o numa casa em que ele cumpra o critério da linha e o da coluna.",
      `Cada acerto vale ${POINTS_PER_HIT} pontos. Completar a cartela sem errar nem pular nenhum nome dá +${PERFECT_BONUS} de bônus.`,
      "Se errar, a cartela pisca em vermelho e você perde o nome atual e o próximo da fila.",
      "Uma vez por partida, use o Coringa para colocar o nome da vez em qualquer casa livre, sem ganhar pontos.",
      "A partida termina quando a cartela fica completa ou quando acabam os nomes. No fim, veja quem poderia ocupar as casas vazias e compartilhe seu resultado.",
      "Uma cartela nova sai todo dia (UTC). Jogue diariamente para manter sua sequência.",
    ],
    close: "Fechar",
  },
  en: {
    languageName: "English",
    puzzleDate: "UTC puzzle",
    progress: "Progress",
    score: "Score",
    points: "pts",
    reset: "Reset attempt",
    home: "Home",
    currentPlayerEyebrow: "Current name",
    noCurrentPlayerTitle: "No names remaining",
    namesLeft: "Names left",
    skippedLabel: "Lost name",
    skip: "Skip",
    boardCorner: "Row x Column",
    rowAxis: "row",
    columnAxis: "column",
    selectLanguage: "Language",
    wildcard: "Wildcard",
    wildcardSpent: "Wildcard used",
    cancelWildcard: "Cancel",
    wildcardArmedMessage: "Wildcard on: click any open cell to place the current name.",
    wildcardMessage: (player, row, column) => `Wildcard! ${player} takes ${row} + ${column} (no points).`,
    initialMessage: "One name appears at a time. Click the cell that matches that player.",
    resetMessage: "Board reset. The first name is already on screen.",
    completedMessage: "Bingo complete! Every cell is filled.",
    outOfNamesMessage: "You ran out of names. Check the board to see who could fill the empty cells.",
    wrongMessage: (player, skippedPlayer) =>
      skippedPlayer
        ? `${player} does not match that cell. You also lost ${skippedPlayer}.`
        : `${player} does not match that cell.`,
    correctMessage: (player, row, column) => `Nice! ${player} matches ${row} + ${column}.`,
    alreadyPickedMessage: "That cell is already marked. Choose an open cell.",
    gameOverCompleted: "Bingo!",
    gameOverOutOfNames: "Game over",
    hitsLabel: "Hits",
    perfectBonus: "Perfect board bonus",
    share: "Share result",
    shareCopied: "Result copied!",
    shareFailed: "Could not copy the result.",
    possibleAnswers: "Possible",
    statsTitle: "Statistics",
    played: "Played",
    finished: "Bingos",
    currentStreak: "Streak",
    bestStreak: "Best streak",
    rulesTitle: "How to play",
    rules: [
      "One player appears at a time. Place them in a cell where they match both the row and the column.",
      `Each hit is worth ${POINTS_PER_HIT} points. Completing the board without misses or skips earns a +${PERFECT_BONUS} bonus.`,
      "If you miss, the board flashes red and you lose the current name and the next one in the queue.",
      "Once per game, use the Wildcard to place the current name in any open cell, for no points.",
      "The game ends when the board is full or you run out of names. At the end, see who could fill the empty cells and share your result.",
      "A new board arrives every day (UTC). Play daily to keep your streak.",
    ],
    close: "Close",
  },
  es: {
    languageName: "Español",
    puzzleDate: "Puzzle UTC",
    progress: "Progreso",
    score: "Puntos",
    points: "pts",
    reset: "Reiniciar intento",
    home: "Inicio",
    currentPlayerEyebrow: "Nombre actual",
    noCurrentPlayerTitle: "No quedan nombres",
    namesLeft: "Nombres restantes",
    skippedLabel: "Nombre perdido",
    skip: "Saltar",
    boardCorner: "Fila x Columna",
    rowAxis: "fila",
    columnAxis: "columna",
    selectLanguage: "Idioma",
    wildcard: "Comodín",
    wildcardSpent: "Comodín usado",
    cancelWildcard: "Cancelar",
    wildcardArmedMessage: "Comodín activado: haz clic en cualquier casilla libre para colocar el nombre actual.",
    wildcardMessage: (player, row, column) => `¡Comodín! ${player} ocupa ${row} + ${column} (sin puntos).`,
    initialMessage: "Aparece un nombre por vez. Haz clic en la casilla que combina con ese jugador.",
    resetMessage: "Cartela reiniciada. El primer nombre ya está en pantalla.",
    completedMessage: "¡Bingo completo! Todas las casillas están llenas.",
    outOfNamesMessage: "Te quedaste sin nombres. Mira en la cartela quién podría ocupar las casillas vacías.",
    wrongMessage: (player, skippedPlayer) =>
      skippedPlayer
        ? `${player} no combina con esa casilla. También perdiste ${skippedPlayer}.`
        : `${player} no combina con esa casilla.`,
    correctMessage: (player, row, column) => `¡Bien! ${player} cumple ${row} + ${column}.`,
    alreadyPickedMessage: "Esa casilla ya está marcada. Elige una casilla libre.",
    gameOverCompleted: "¡Bingo!",
    gameOverOutOfNames: "Fin del juego",
    hitsLabel: "Aciertos",
    perfectBonus: "Bono de cartela perfecta",
    share: "Compartir resultado",
    shareCopied: "¡Resultado copiado!",
    shareFailed: "No se pudo copiar el resultado.",
    possibleAnswers: "Posibles",
    statsTitle: "Estadísticas",
    played: "Partidas",
    finished: "Bingos",
    currentStreak: "Racha",
    bestStreak: "Mejor racha",
    rulesTitle: "Cómo jugar",
    rules: [
      "Aparece un jugador por vez. Colócalo en una casilla donde cumpla el criterio de la fila y el de la columna.",
      `Cada acierto vale ${POINTS_PER_HIT} puntos. Completar la cartela sin fallar ni saltar nombres da un bono de +${PERFECT_BONUS}.`,
      "Si fallas, la cartela parpadea en rojo y pierdes el nombre actual y el siguiente de la fila.",
      "Una vez por partida, usa el Comodín para colocar el nombre actual en cualquier casilla libre, sin sumar puntos.",
      "La partida termina cuando la cartela está completa o cuando se acaban los nombres. Al final, mira quién podría ocupar las casillas vacías y comparte tu resultado.",
      "Hay una cartela nueva cada día (UTC). Juega a diario para mantener tu racha.",
    ],
    close: "Cerrar",
  },
};

const criterionTranslations: Record<Language, Record<string, CriterionCopy>> = {
  pt: {},
  en: {
    "nat-brazil": { label: "Brazil", helper: "Brazilian player" },
    "nat-denmark": { label: "Denmark", helper: "Danish player" },
    "nat-france": { label: "France", helper: "French player" },
    "nat-russia": { label: "Russia", helper: "Russian player" },
    "nat-ukraine": { label: "Ukraine", helper: "Ukrainian player" },
    "region-na": { label: "NA", helper: "Represents North America" },
    "role-awper": { label: "AWPer", helper: "Plays or played as an AWPer" },
    "role-igl": { label: "IGL", helper: "Plays or played as an in-game leader" },
    "role-lurker": { label: "Lurker", helper: "Plays or played as a lurker" },
    "major-winner": { label: "Major winner", helper: "Won at least one Major" },
    "major-mvp": { label: "Major MVP", helper: "Was a Major MVP" },
    top20: { label: "HLTV Top 20", helper: "Appeared in HLTV's Top 20" },
    active: { label: "Active", helper: "Still active in the scene" },
  },
  es: {
    "nat-brazil": { label: "Brasil", helper: "Jugador brasileño" },
    "nat-denmark": { label: "Dinamarca", helper: "Jugador danés" },
    "nat-france": { label: "Francia", helper: "Jugador francés" },
    "nat-russia": { label: "Rusia", helper: "Jugador ruso" },
    "nat-ukraine": { label: "Ucrania", helper: "Jugador ucraniano" },
    "region-na": { label: "NA", helper: "Representa a Norteamérica" },
    "role-awper": { label: "AWPer", helper: "Juega o jugó como AWPer" },
    "role-igl": { label: "IGL", helper: "Juega o jugó como líder dentro del juego" },
    "role-lurker": { label: "Lurker", helper: "Juega o jugó como lurker" },
    "major-winner": { label: "Campeón de Major", helper: "Ganó al menos un Major" },
    "major-mvp": { label: "MVP de Major", helper: "Fue MVP de un Major" },
    top20: { label: "HLTV Top 20", helper: "Apareció en el Top 20 de HLTV" },
    active: { label: "Activo", helper: "Sigue activo en la escena" },
  },
};

const countryFlags: Record<string, string> = {
  Brazil: "🇧🇷",
  Denmark: "🇩🇰",
  France: "🇫🇷",
  Russia: "🇷🇺",
  Ukraine: "🇺🇦",
};

const getUtcDateKey = () => new Date().toISOString().slice(0, 10);

const getPreviousDateKey = (dateKey: string) =>
  new Date(Date.parse(dateKey) - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const hashDate = (dateKey: string) =>
  dateKey.split("").reduce((hash, char) => hash + char.charCodeAt(0), 0);

const seededShuffle = <T,>(items: T[], seed: number) => {
  const result = [...items];
  let state = seed || 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((state / 233280) * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
};

// Cada jogador ocupa uma casa só, então não basta toda casa ter uma resposta: precisa existir
// um jogador diferente para cada casa (emparelhamento bipartido com caminhos aumentantes).
const boardHasAnswers = (rows: BingoCriterion[], columns: BingoCriterion[]) => {
  const cellCandidates = rows.flatMap((row) =>
    columns.map((column) =>
      csPlayers.filter((player) => playerMatchesCell(player, row, column)).map((player) => player.id)
    )
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

const createDailyBoard = (dateKey: string): GameBoard => {
  const seed = hashDate(dateKey);
  const rowCandidates = seededShuffle(bingoCriteria, seed);
  const columnCandidates = seededShuffle(bingoCriteria, seed * 7);

  for (let rowStart = 0; rowStart <= rowCandidates.length - GRID_SIZE; rowStart += 1) {
    const rows = rowCandidates.slice(rowStart, rowStart + GRID_SIZE);

    for (let columnStart = 0; columnStart <= columnCandidates.length - GRID_SIZE; columnStart += 1) {
      const columns = columnCandidates
        .filter((criterion) => !rows.some((row) => row.id === criterion.id))
        .slice(columnStart, columnStart + GRID_SIZE);

      if (columns.length === GRID_SIZE && boardHasAnswers(rows, columns)) {
        return { rows, columns };
      }
    }
  }

  return {
    rows: bingoCriteria.filter((criterion) => ["team-faze", "team-liquid", "team-astralis"].includes(criterion.id)),
    columns: bingoCriteria.filter((criterion) => ["major-winner", "top20", "active"].includes(criterion.id)),
  };
};

const getCellKey = (rowIndex: number, columnIndex: number) => `${rowIndex}-${columnIndex}`;

const playerCanFitBoard = (player: CsPlayer, board: GameBoard) =>
  board.rows.some((row) => board.columns.some((column) => playerMatchesCell(player, row, column)));

const createPlayerQueue = (board: GameBoard, dateKey: string) =>
  seededShuffle(
    csPlayers.filter((player) => playerCanFitBoard(player, board)),
    hashDate(dateKey) * 17
  );

const getPossibleAnswers = (row: BingoCriterion, column: BingoCriterion) =>
  csPlayers
    .filter((player) => playerMatchesCell(player, row, column))
    .slice(0, REVEALED_ANSWERS)
    .map((player) => player.nickname);

const parseStoredGame = (dateKey: string): StoredGame => {
  if (typeof window === "undefined") return {};

  const rawGame = window.localStorage.getItem(`${GAME_KEY_PREFIX}-${dateKey}`);
  if (!rawGame) return {};

  try {
    const parsedGame = JSON.parse(rawGame) as StoredGame | Record<string, string>;
    if ("picks" in parsedGame || "playerIndex" in parsedGame || "skippedPlayerIds" in parsedGame) {
      return parsedGame as StoredGame;
    }

    return { picks: parsedGame as Record<string, string>, playerIndex: 0, skippedPlayerIds: [] };
  } catch {
    return {};
  }
};

const hydratePicks = (storedPicks?: Record<string, string>, wildcardCell?: string) => {
  if (!storedPicks) return {};

  return Object.entries(storedPicks).reduce<Record<string, CellPick>>((acc, [cellKey, playerId]) => {
    const player = csPlayers.find((candidate) => candidate.id === playerId);
    if (player) {
      acc[cellKey] = { player, wildcard: cellKey === wildcardCell };
    }
    return acc;
  }, {});
};

const serializePicks = (picks: Record<string, CellPick>) =>
  Object.entries(picks).reduce<Record<string, string>>((acc, [cellKey, pick]) => {
    acc[cellKey] = pick.player.id;
    return acc;
  }, {});

const saveGame = (
  dateKey: string,
  picks: Record<string, CellPick>,
  playerIndex: number,
  skippedPlayerIds: string[],
  mistakes: number,
  wildcardCell?: string
) => {
  window.localStorage.setItem(
    `${GAME_KEY_PREFIX}-${dateKey}`,
    JSON.stringify({ picks: serializePicks(picks), playerIndex, skippedPlayerIds, mistakes, wildcardCell })
  );
};

const emptyStats: PlayerStats = { played: 0, finished: 0, currentStreak: 0, bestStreak: 0 };

const readStats = (): PlayerStats => {
  if (typeof window === "undefined") return emptyStats;

  try {
    const rawStats = window.localStorage.getItem(STATS_KEY);
    return rawStats ? { ...emptyStats, ...(JSON.parse(rawStats) as PlayerStats) } : emptyStats;
  } catch {
    return emptyStats;
  }
};

// Só o primeiro fim de jogo de cada dia conta; reiniciar a tentativa não altera as estatísticas.
const recordGame = (stats: PlayerStats, dateKey: string, completed: boolean): PlayerStats => {
  const currentStreak =
    stats.lastPlayedDate === getPreviousDateKey(dateKey) ? stats.currentStreak + 1 : 1;

  return {
    played: stats.played + 1,
    finished: stats.finished + (completed ? 1 : 0),
    currentStreak,
    bestStreak: Math.max(stats.bestStreak, currentStreak),
    lastPlayedDate: dateKey,
  };
};

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "pt";

  const storedLanguage = window.localStorage.getItem(LANGUAGE_KEY) as Language | null;
  if (storedLanguage && storedLanguage in translations) return storedLanguage;

  const browserLanguage = window.navigator.language.toLowerCase();
  if (browserLanguage.startsWith("en")) return "en";
  if (browserLanguage.startsWith("es")) return "es";
  return "pt";
};

const getCriterionCopy = (criterion: BingoCriterion, language: Language) =>
  criterionTranslations[language][criterion.id] ?? {
    label: criterion.label,
    helper: criterion.helper,
  };

export default function BingoPage() {
  const dateKey = useMemo(() => getUtcDateKey(), []);
  const board = useMemo(() => createDailyBoard(dateKey), [dateKey]);
  const playerQueue = useMemo(() => createPlayerQueue(board, dateKey), [board, dateKey]);
  const [language, setLanguage] = useState<Language>(() => getStoredLanguage());
  const copy = translations[language];
  const [storedGame] = useState<StoredGame>(() => parseStoredGame(dateKey));
  const [picks, setPicks] = useState<Record<string, CellPick>>(() =>
    hydratePicks(storedGame.picks, storedGame.wildcardCell)
  );
  const [playerIndex, setPlayerIndex] = useState(storedGame.playerIndex ?? 0);
  const [skippedPlayerIds, setSkippedPlayerIds] = useState<string[]>(storedGame.skippedPlayerIds ?? []);
  const [mistakes, setMistakes] = useState(storedGame.mistakes ?? 0);
  const [wildcardCell, setWildcardCell] = useState<string | undefined>(storedGame.wildcardCell);
  const [wildcardArmed, setWildcardArmed] = useState(false);
  const [message, setMessage] = useState(copy.initialMessage);
  const [messageTone, setMessageTone] = useState<MessageTone>("neutral");
  const [flashKey, setFlashKey] = useState(0);
  const [lastHitKey, setLastHitKey] = useState<string>();
  const [stats, setStats] = useState<PlayerStats>(() => readStats());
  const [openPanel, setOpenPanel] = useState<"rules" | "stats">();
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  // O jogo salvo, o idioma e as estatísticas vêm do localStorage; esperar a montagem evita
  // divergência entre o HTML do servidor e o do navegador (erro de hidratação).
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filledCells = Object.keys(picks).length;
  const hits = Object.values(picks).filter((pick) => !pick.wildcard).length;
  const isCompleted = filledCells === GRID_SIZE * GRID_SIZE;
  const isPerfect = isCompleted && mistakes === 0 && skippedPlayerIds.length === 0;
  const score = hits * POINTS_PER_HIT + (isPerfect ? PERFECT_BONUS : 0);
  const currentPlayer = isCompleted ? undefined : playerQueue[playerIndex];
  const namesLeft = Math.max(playerQueue.length - playerIndex, 0);
  const gameStatus: GameStatus = isCompleted ? "completed" : currentPlayer ? "playing" : "out-of-names";
  const isGameOver = gameStatus !== "playing";
  const latestSkippedPlayer = skippedPlayerIds.length
    ? csPlayers.find((player) => player.id === skippedPlayerIds[skippedPlayerIds.length - 1])
    : undefined;

  useEffect(() => {
    if (!isGameOver || stats.lastPlayedDate === dateKey) return;

    const nextStats = recordGame(stats, dateKey, isCompleted);
    setStats(nextStats);
    window.localStorage.setItem(STATS_KEY, JSON.stringify(nextStats));
  }, [isGameOver, isCompleted, stats, dateKey]);

  const showMessage = (nextMessage: string, tone: MessageTone) => {
    setMessage(nextMessage);
    setMessageTone(tone);
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const advanceGame = (
    nextPicks: Record<string, CellPick>,
    nextPlayerIndex: number,
    nextSkippedPlayerIds = skippedPlayerIds,
    nextMistakes = mistakes,
    nextWildcardCell = wildcardCell
  ) => {
    setPicks(nextPicks);
    setPlayerIndex(nextPlayerIndex);
    setSkippedPlayerIds(nextSkippedPlayerIds);
    setMistakes(nextMistakes);
    setWildcardCell(nextWildcardCell);
    setShareStatus(undefined);
    saveGame(dateKey, nextPicks, nextPlayerIndex, nextSkippedPlayerIds, nextMistakes, nextWildcardCell);
  };

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    if (!currentPlayer || gameStatus !== "playing") return;

    const cellKey = getCellKey(rowIndex, columnIndex);
    if (picks[cellKey]) {
      showMessage(copy.alreadyPickedMessage, "neutral");
      return;
    }

    const row = board.rows[rowIndex];
    const column = board.columns[columnIndex];
    const rowLabel = getCriterionCopy(row, language).label;
    const columnLabel = getCriterionCopy(column, language).label;
    const fillsBoard = filledCells + 1 === GRID_SIZE * GRID_SIZE;

    if (wildcardArmed) {
      const nextPicks = { ...picks, [cellKey]: { player: currentPlayer, wildcard: true } };
      setWildcardArmed(false);
      setLastHitKey(cellKey);
      advanceGame(nextPicks, playerIndex + 1, skippedPlayerIds, mistakes, cellKey);
      showMessage(
        fillsBoard ? copy.completedMessage : copy.wildcardMessage(currentPlayer.nickname, rowLabel, columnLabel),
        "wildcard"
      );
      return;
    }

    if (!playerMatchesCell(currentPlayer, row, column)) {
      const skippedPlayer = playerQueue[playerIndex + 1];
      const nextPlayerIndex = playerIndex + (skippedPlayer ? 2 : 1);
      const nextSkippedPlayerIds = skippedPlayer
        ? [...skippedPlayerIds, skippedPlayer.id]
        : skippedPlayerIds;

      setFlashKey((currentFlashKey) => currentFlashKey + 1);
      advanceGame(picks, nextPlayerIndex, nextSkippedPlayerIds, mistakes + 1);
      showMessage(copy.wrongMessage(currentPlayer.nickname, skippedPlayer?.nickname), "error");
      return;
    }

    const nextPicks = { ...picks, [cellKey]: { player: currentPlayer, wildcard: false } };
    setLastHitKey(cellKey);
    advanceGame(nextPicks, playerIndex + 1);
    showMessage(
      fillsBoard ? copy.completedMessage : copy.correctMessage(currentPlayer.nickname, rowLabel, columnLabel),
      "success"
    );
  };

  const handleReset = () => {
    window.localStorage.removeItem(`${GAME_KEY_PREFIX}-${dateKey}`);
    setPicks({});
    setPlayerIndex(0);
    setSkippedPlayerIds([]);
    setMistakes(0);
    setWildcardCell(undefined);
    setWildcardArmed(false);
    setLastHitKey(undefined);
    setShareStatus(undefined);
    showMessage(copy.resetMessage, "neutral");
    setFlashKey(0);
  };

  const handleSkip = () => {
    if (!currentPlayer || gameStatus !== "playing") return;

    setWildcardArmed(false);
    advanceGame(picks, playerIndex + 1, [...skippedPlayerIds, currentPlayer.id]);
    showMessage(`${copy.skippedLabel}: ${currentPlayer.nickname}.`, "neutral");
  };

  const handleWildcardToggle = () => {
    if (wildcardCell || gameStatus !== "playing") return;

    const nextArmed = !wildcardArmed;
    setWildcardArmed(nextArmed);
    showMessage(nextArmed ? copy.wildcardArmedMessage : copy.initialMessage, nextArmed ? "wildcard" : "neutral");
  };

  const handleShare = async () => {
    const grid = board.rows
      .map((_, rowIndex) =>
        board.columns
          .map((__, columnIndex) => {
            const pick = picks[getCellKey(rowIndex, columnIndex)];
            if (!pick) return "⬛";
            return pick.wildcard ? "🟨" : "🟩";
          })
          .join("")
      )
      .join("\n");
    const shareText = [
      `CS Bingo #${hashDate(dateKey)} · ${dateKey}`,
      `🎯 ${score} ${copy.points} · 🔥 ${stats.currentStreak}`,
      grid,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  // Mensagens no estilo kill feed: faixa escura com borda colorida à esquerda.
  const messageToneClass: Record<MessageTone, string> = {
    neutral: "border-[#f2a33a] text-[#e8e4d8]",
    success: "border-[#7fc35b] text-[#d7f0c8]",
    error: "border-[#e5484d] text-[#f6c9ca]",
    wildcard: "border-[#e0b04a] text-[#f5e3b5]",
  };

  if (!mounted) return <main className="min-h-screen bg-[#0e1114]" />;

  return (
    <main className={`${csFont.className} min-h-screen overflow-x-hidden bg-[#0e1114] text-[#e8e4d8]`}>
      <div className="cs-grid-bg min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(242,163,58,0.12),_transparent_32rem)]">
        <nav className="border-b-2 border-[#f2a33a]/60 bg-[#14181c]">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-4 text-[#e8e4d8]">
              <Link href="/" aria-label={copy.home} className="transition hover:text-[#f2a33a]">
                <Menu className="h-6 w-6" />
              </Link>
              <button
                type="button"
                onClick={() => setOpenPanel("rules")}
                aria-label={copy.rulesTitle}
                className="transition hover:text-[#f2a33a]"
              >
                <HelpCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-xl font-bold uppercase tracking-[0.08em] sm:text-3xl sm:tracking-[0.12em]">
              <Crosshair className="hidden h-5 w-5 text-[#f2a33a] sm:block" />
              CS<span className="text-[#f2a33a]">Bingo</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="cs-cut-sm inline-flex items-center gap-1.5 bg-[#1f252b] px-2 py-1 text-xs text-[#e8e4d8]/80">
                <Globe2 className="h-4 w-4" />
                <span className="sr-only">{copy.selectLanguage}</span>
                <select
                  value={language}
                  onChange={(event) => handleLanguageChange(event.target.value as Language)}
                  className="bg-transparent text-xs font-bold uppercase outline-none"
                  aria-label={copy.selectLanguage}
                >
                  {Object.entries(translations).map(([key, value]) => (
                    <option key={key} value={key} className="bg-[#14181c] text-[#e8e4d8]">
                      {value.languageName}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => setOpenPanel("stats")}
                aria-label={copy.statsTitle}
                className="inline-flex items-center gap-1 transition hover:text-[#f2a33a]"
              >
                <Flame className="h-5 w-5 text-[#f2a33a]" />
                <span className="text-base font-bold">{stats.currentStreak}</span>
                <BarChart3 className="ml-1 h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>

        <div className="border-b border-[#2c343c] bg-[#14181c]/80 px-4 py-1.5 text-center text-sm font-semibold uppercase tracking-[0.15em] text-[#e8e4d8]/60">
          {copy.puzzleDate} <span className="font-bold text-[#f2a33a]">{dateKey}</span>
          <span className="mx-2 text-[#2c343c]">|</span>#{hashDate(dateKey)}
        </div>

        <section className="mx-auto flex w-full max-w-[520px] flex-col px-4 py-6 sm:py-8">
          <div className="cs-cut bg-[#2c343c] p-[2px] shadow-2xl shadow-black/50">
            <div className="cs-cut bg-[#1a1f24]">
              <div className="flex items-center justify-between gap-3 border-b-2 border-[#f2a33a] bg-gradient-to-r from-[#232a30] to-[#1a1f24] px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="cs-cut-sm flex h-14 w-14 shrink-0 flex-col items-center justify-center bg-[#0e1114] text-[#f2a33a]">
                    <span className="text-2xl font-bold leading-none">{namesLeft}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#e8e4d8]/50">{copy.namesLeft.split(" ")[0]}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#f2a33a]">{copy.currentPlayerEyebrow}</p>
                    {currentPlayer ? (
                      <>
                        <h1 className="truncate text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{currentPlayer.nickname}</h1>
                        <p className="mt-0.5 truncate text-xs font-semibold uppercase tracking-wider text-[#e8e4d8]/45">{currentPlayer.fullName}</p>
                      </>
                    ) : (
                      <h1 className="text-2xl font-bold uppercase leading-none tracking-wide">
                        {isCompleted ? copy.gameOverCompleted : copy.noCurrentPlayerTitle}
                      </h1>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-stretch gap-1.5">
                  <button
                    type="button"
                    onClick={handleSkip}
                    disabled={gameStatus !== "playing"}
                    className="cs-cut-sm inline-flex items-center justify-center gap-1 bg-[#f2a33a] px-3 py-1 text-base font-bold uppercase tracking-wider text-[#0e1114] transition hover:bg-[#ffb85a] disabled:cursor-not-allowed disabled:bg-[#2c343c] disabled:text-[#e8e4d8]/30"
                  >
                    {copy.skip} <SkipForward className="h-4 w-4 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={handleWildcardToggle}
                    disabled={Boolean(wildcardCell) || gameStatus !== "playing"}
                    className={`cs-cut-sm inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      wildcardArmed
                        ? "bg-[#e0b04a] text-[#0e1114]"
                        : "bg-[#0e1114] text-[#e0b04a] hover:bg-[#e0b04a]/15"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {wildcardCell ? copy.wildcardSpent : wildcardArmed ? copy.cancelWildcard : copy.wildcard}
                  </button>
                </div>
              </div>

              <div
                key={flashKey}
                className={`grid grid-cols-4 gap-[2px] bg-[#0e1114] p-[2px] ${flashKey > 0 ? "animate-bingo-error" : ""}`}
              >
                <div className="grid min-h-[84px] place-items-center bg-[#14181c] p-2 text-center sm:min-h-[98px]">
                  <Crosshair className="h-7 w-7 text-[#f2a33a]/40" />
                  <span className="sr-only">{copy.boardCorner}</span>
                </div>
                {board.columns.map((criterion) => (
                  <CriterionHeader key={criterion.id} criterion={criterion} axis={copy.columnAxis} language={language} />
                ))}

                {board.rows.map((row, rowIndex) => (
                  <Fragment key={row.id}>
                    <CriterionHeader criterion={row} axis={copy.rowAxis} language={language} />
                    {board.columns.map((column, columnIndex) => {
                      const cellKey = getCellKey(rowIndex, columnIndex);
                      const pick = picks[cellKey];
                      const rowCopy = getCriterionCopy(row, language);
                      const columnCopy = getCriterionCopy(column, language);
                      const cellColor = pick
                        ? pick.wildcard
                          ? "bg-[#e0b04a]/20 shadow-[inset_0_-3px_0_#e0b04a]"
                          : "bg-[#5b8bd6]/20 shadow-[inset_0_-3px_0_#7fc35b]"
                        : wildcardArmed
                          ? "bg-[#232a30] shadow-[inset_0_0_0_2px_rgba(224,176,74,0.7)] hover:bg-[#e0b04a]/15"
                          : "bg-[#232a30] hover:bg-[#2e363e] hover:shadow-[inset_0_0_0_2px_rgba(242,163,58,0.6)]";

                      return (
                        <button
                          key={cellKey}
                          type="button"
                          onClick={() => handleCellClick(rowIndex, columnIndex)}
                          disabled={gameStatus !== "playing" || Boolean(pick)}
                          aria-label={`${rowCopy.label} + ${columnCopy.label}`}
                          className={`group grid min-h-[84px] place-items-center p-2 text-center transition disabled:cursor-not-allowed sm:min-h-[98px] ${cellColor} ${
                            lastHitKey === cellKey ? "animate-bingo-hit" : ""
                          }`}
                        >
                          {pick ? (
                            <div className="space-y-1">
                              {pick.wildcard ? (
                                <Sparkles className="mx-auto h-5 w-5 text-[#e0b04a]" />
                              ) : (
                                <Check className="mx-auto h-5 w-5 text-[#7fc35b]" />
                              )}
                              <p className="break-all text-sm font-bold uppercase leading-none tracking-wide sm:text-lg">{pick.player.nickname}</p>
                            </div>
                          ) : isGameOver ? (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#f2a33a]/70">{copy.possibleAnswers}</p>
                              <p className="break-words text-xs font-semibold leading-tight text-[#e8e4d8]/75 sm:text-sm">
                                {getPossibleAnswers(row, column).join(", ")}
                              </p>
                            </div>
                          ) : (
                            <Crosshair className="h-6 w-6 text-[#e8e4d8]/10 transition group-hover:scale-110 group-hover:text-[#f2a33a]/70" />
                          )}
                        </button>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#e8e4d8]/60 transition hover:text-[#f2a33a]"
            >
              <RotateCcw className="h-4 w-4" /> {copy.reset}
            </button>
          </div>

          <div className="mt-5 space-y-3 text-base">
            <div className="grid grid-cols-3 gap-2">
              <StatTile label={copy.progress} value={filledCells} suffix={`/ ${GRID_SIZE * GRID_SIZE}`} />
              <StatTile label={copy.score} value={score} accent="money" />
              <StatTile label={copy.namesLeft} value={namesLeft} />
            </div>

            {isGameOver ? (
              <div className={`cs-cut border-l-4 bg-[#1a1f24] p-4 ${isCompleted ? "border-[#7fc35b]" : "border-[#e5484d]"}`}>
                <div className="flex items-center gap-2 text-2xl font-bold uppercase tracking-wider">
                  {isCompleted ? <Trophy className="h-6 w-6 text-[#f2a33a]" /> : <X className="h-6 w-6 text-[#e5484d]" />}
                  {isCompleted ? copy.gameOverCompleted : copy.gameOverOutOfNames}
                </div>
                <dl className="mt-3 space-y-1 text-[#e8e4d8]/75">
                  <div className="flex justify-between gap-2">
                    <dt>{copy.hitsLabel}</dt>
                    <dd className="font-bold text-[#e8e4d8]">
                      {hits} × {POINTS_PER_HIT} = {hits * POINTS_PER_HIT} {copy.points}
                    </dd>
                  </div>
                  {isPerfect ? (
                    <div className="flex justify-between gap-2">
                      <dt>{copy.perfectBonus}</dt>
                      <dd className="font-bold text-[#7fc35b]">+{PERFECT_BONUS} {copy.points}</dd>
                    </div>
                  ) : null}
                  <div className="flex justify-between gap-2 border-t border-[#2c343c] pt-1">
                    <dt className="font-bold uppercase tracking-wider">{copy.score}</dt>
                    <dd className="font-bold text-[#7fc35b]">{score} {copy.points}</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>{copy.currentStreak}</dt>
                    <dd className="inline-flex items-center gap-1 font-bold text-[#e8e4d8]">
                      <Flame className="h-4 w-4 text-[#f2a33a]" /> {stats.currentStreak}
                    </dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={handleShare}
                  className="cs-cut-sm mt-4 inline-flex w-full items-center justify-center gap-2 bg-[#f2a33a] px-4 py-2.5 text-lg font-bold uppercase tracking-wider text-[#0e1114] transition hover:bg-[#ffb85a]"
                >
                  <Share2 className="h-4 w-4" /> {copy.share}
                </button>
                {shareStatus ? (
                  <p className="mt-2 text-center text-sm font-semibold text-[#e8e4d8]/70">
                    {shareStatus === "copied" ? copy.shareCopied : copy.shareFailed}
                  </p>
                ) : null}
              </div>
            ) : null}

            <p
              className={`border-l-4 bg-[#14181c]/90 px-4 py-2.5 font-semibold leading-6 ${
                messageToneClass[isCompleted ? "success" : gameStatus === "out-of-names" ? "error" : messageTone]
              }`}
            >
              {isCompleted ? copy.completedMessage : gameStatus === "out-of-names" ? copy.outOfNamesMessage : message}
            </p>

            {latestSkippedPlayer ? (
              <p className="flex items-center gap-2 border-l-4 border-[#2c343c] bg-[#14181c]/90 px-4 py-2.5 text-[#e8e4d8]/60">
                <SkipForward className="h-4 w-4" />
                {copy.skippedLabel}: <strong className="text-[#e8e4d8]">{latestSkippedPlayer.nickname}</strong>
              </p>
            ) : null}
          </div>
        </section>
      </div>

      {openPanel === "rules" ? (
        <Modal title={copy.rulesTitle} closeLabel={copy.close} onClose={() => setOpenPanel(undefined)}>
          <ol className="space-y-2 leading-6 text-[#e8e4d8]/80">
            {copy.rules.map((rule, index) => (
              <li key={rule} className="flex gap-3">
                <span className="font-bold text-[#f2a33a]">{String(index + 1).padStart(2, "0")}</span>
                <span>{rule}</span>
              </li>
            ))}
          </ol>
        </Modal>
      ) : null}

      {openPanel === "stats" ? (
        <Modal title={copy.statsTitle} closeLabel={copy.close} onClose={() => setOpenPanel(undefined)}>
          <div className="grid grid-cols-2 gap-2">
            <StatTile label={copy.played} value={stats.played} />
            <StatTile label={copy.finished} value={stats.finished} />
            <StatTile label={copy.currentStreak} value={stats.currentStreak} />
            <StatTile label={copy.bestStreak} value={stats.bestStreak} />
          </div>
        </Modal>
      ) : null}
    </main>
  );
}

function StatTile({ label, value, suffix, accent }: { label: string; value: number; suffix?: string; accent?: "money" }) {
  return (
    <div className="cs-cut-sm bg-[#1a1f24] p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#e8e4d8]/45">{label}</p>
      <p className={`mt-0.5 text-3xl font-bold leading-none ${accent === "money" ? "text-[#7fc35b]" : "text-[#f2a33a]"}`}>
        {value}
        {suffix ? <span className="text-base text-[#e8e4d8]/40"> {suffix}</span> : null}
      </p>
    </div>
  );
}

function Modal({
  title,
  closeLabel,
  onClose,
  children,
}: {
  title: string;
  closeLabel: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`${csFont.className} fixed inset-0 z-50 grid place-items-center bg-black/75 px-4`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="cs-cut w-full max-w-md border-t-2 border-[#f2a33a] bg-[#1a1f24] p-5 text-base text-[#e8e4d8] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-wider">{title}</h2>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="text-[#e8e4d8]/60 transition hover:text-[#f2a33a]">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CriterionIcon({ criterion }: { criterion: BingoCriterion }) {
  if (criterion.type === "nationality") {
    return <span className="block text-2xl leading-none">{countryFlags[String(criterion.value)] ?? "🏳️"}</span>;
  }

  const iconClass = "mx-auto h-5 w-5";
  switch (criterion.type) {
    case "team":
      return <Shield className={`${iconClass} text-[#5b8bd6]`} />;
    case "region":
      return <Globe2 className={`${iconClass} text-[#5b8bd6]`} />;
    case "role":
      return <Crosshair className={`${iconClass} text-[#e5484d]`} />;
    case "achievement":
      return <Trophy className={`${iconClass} text-[#e0b04a]`} />;
    default:
      return <Activity className={`${iconClass} text-[#7fc35b]`} />;
  }
}

function CriterionHeader({ criterion, axis, language }: { criterion: BingoCriterion; axis: string; language: Language }) {
  const criterionCopy = getCriterionCopy(criterion, language);

  return (
    <div className="grid min-h-[84px] place-items-center bg-[#14181c] p-2 text-center sm:min-h-[98px]" title={criterionCopy.helper}>
      <div className="space-y-1">
        <CriterionIcon criterion={criterion} />
        <h3 className="break-words text-sm font-bold uppercase leading-tight tracking-wide sm:text-base">{criterionCopy.label}</h3>
        <p className="hidden text-[11px] font-semibold leading-tight text-[#e8e4d8]/40 sm:block">{criterionCopy.helper}</p>
        <p className="sr-only">{axis}</p>
      </div>
    </div>
  );
}
