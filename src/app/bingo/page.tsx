"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  BarChart3,
  Check,
  Crosshair,
  Flame,
  Globe2,
  Heart,
  HelpCircle,
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
  playerMatchesCriterion,
} from "@/data/csBingoDatabase";
import type { BingoCriterion, CsPlayer } from "@/data/csBingoDatabase";

const GRID_SIZE = 4;
// Prefixo novo: partidas salvas da cartela 3x3 antiga não são compatíveis com a 4x4.
const GAME_KEY_PREFIX = "cs-bingo-daily-4x4";
const LANGUAGE_KEY = "cs-bingo-language";
const STATS_KEY = "cs-bingo-stats";
const POINTS_PER_HIT = 100;
const PERFECT_BONUS = 300;
const REVEALED_ANSWERS = 3;
const MAX_LIVES = 2;

type CellPick = {
  player: CsPlayer;
  wildcard: boolean;
};

// Cada casa é independente e tem o próprio critério.
type GameBoard = BingoCriterion[];

type GameStatus = "playing" | "completed" | "out-of-names" | "out-of-lives";
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
  lives: string;
  currentPlayerEyebrow: string;
  noCurrentPlayerTitle: string;
  namesLeft: string;
  skippedLabel: string;
  skip: string;
  selectLanguage: string;
  wildcard: string;
  wildcardSpent: string;
  cancelWildcard: string;
  wildcardArmedMessage: string;
  wildcardMessage: (player: string, criterion: string) => string;
  initialMessage: string;
  resetMessage: string;
  completedMessage: string;
  outOfNamesMessage: string;
  outOfLivesMessage: string;
  wrongMessage: (player: string, livesLeft: number) => string;
  correctMessage: (player: string, criterion: string) => string;
  alreadyPickedMessage: string;
  gameOverCompleted: string;
  gameOverOutOfNames: string;
  gameOverOutOfLives: string;
  result: string;
  viewBoard: string;
  hitsLabel: string;
  perfectBonus: string;
  share: string;
  shareCopied: string;
  shareFailed: string;
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
    lives: "Vidas",
    currentPlayerEyebrow: "Nome da vez",
    noCurrentPlayerTitle: "Nenhum nome restante",
    namesLeft: "Nomes restantes",
    skippedLabel: "Nome perdido",
    skip: "Pular",
    selectLanguage: "Idioma",
    wildcard: "Coringa",
    wildcardSpent: "Coringa usado",
    cancelWildcard: "Cancelar",
    wildcardArmedMessage: "Coringa ativado: clique em qualquer casa livre para colocar o nome da vez.",
    wildcardMessage: (player, criterion) => `Coringa! ${player} ocupa a casa ${criterion} (sem pontos).`,
    initialMessage: "Um nome aparece por vez. Clique numa casa cujo critério esse jogador cumpra.",
    resetMessage: "Cartela reiniciada. O primeiro nome já está na tela.",
    completedMessage: "Bingo completo! Todas as casas foram preenchidas.",
    outOfNamesMessage: "Você ficou sem nomes. Veja na cartela quem poderia ocupar as casas vazias.",
    outOfLivesMessage: "Suas vidas acabaram. Veja na cartela quem poderia ocupar as casas vazias.",
    wrongMessage: (player, livesLeft) =>
      `${player} não combina com essa casa. -1 vida${livesLeft === 1 ? ": resta só uma!" : "."}`,
    correctMessage: (player, criterion) => `Boa! ${player} preenche a casa ${criterion}.`,
    alreadyPickedMessage: "Essa casa já está marcada. Escolha uma casa livre.",
    gameOverCompleted: "Bingo!",
    gameOverOutOfNames: "Fim de jogo",
    gameOverOutOfLives: "Sem vidas",
    result: "Resultado",
    viewBoard: "Ver cartela",
    hitsLabel: "Acertos",
    perfectBonus: "Bônus de cartela perfeita",
    share: "Compartilhar resultado",
    shareCopied: "Resultado copiado!",
    shareFailed: "Não foi possível copiar o resultado.",
    statsTitle: "Estatísticas",
    played: "Jogos",
    finished: "Bingos",
    currentStreak: "Sequência",
    bestStreak: "Melhor sequência",
    rulesTitle: "Como jogar",
    rules: [
      `Os ${csPlayers.length} jogadores da base aparecem um por vez, em ordem aleatória. Cada uma das ${GRID_SIZE * GRID_SIZE} casas tem um critério próprio: coloque o nome da vez numa casa cujo critério ele cumpra.`,
      "Se o nome não serve em nenhuma casa livre, pule. Pular não custa vida, mas o nome não volta.",
      `Errou a casa? Você perde uma vida e o nome continua na tela para tentar outra casa. São ${MAX_LIVES} vidas por partida.`,
      `Cada acerto vale ${POINTS_PER_HIT} pontos. Completar a cartela sem errar dá +${PERFECT_BONUS} de bônus.`,
      "Uma vez por partida, use o Coringa para colocar o nome da vez em qualquer casa livre, sem ganhar pontos.",
      "A partida termina quando a cartela fica completa, quando acabam os nomes ou quando acabam as vidas. No fim, veja quem poderia ocupar as casas vazias e compartilhe seu resultado.",
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
    lives: "Lives",
    currentPlayerEyebrow: "Current name",
    noCurrentPlayerTitle: "No names remaining",
    namesLeft: "Names left",
    skippedLabel: "Lost name",
    skip: "Skip",
    selectLanguage: "Language",
    wildcard: "Wildcard",
    wildcardSpent: "Wildcard used",
    cancelWildcard: "Cancel",
    wildcardArmedMessage: "Wildcard on: click any open cell to place the current name.",
    wildcardMessage: (player, criterion) => `Wildcard! ${player} takes the ${criterion} cell (no points).`,
    initialMessage: "One name appears at a time. Click a cell whose criterion that player meets.",
    resetMessage: "Board reset. The first name is already on screen.",
    completedMessage: "Bingo complete! Every cell is filled.",
    outOfNamesMessage: "You ran out of names. Check the board to see who could fill the empty cells.",
    outOfLivesMessage: "You are out of lives. Check the board to see who could fill the empty cells.",
    wrongMessage: (player, livesLeft) =>
      `${player} does not match that cell. -1 life${livesLeft === 1 ? ": only one left!" : "."}`,
    correctMessage: (player, criterion) => `Nice! ${player} fills the ${criterion} cell.`,
    alreadyPickedMessage: "That cell is already marked. Choose an open cell.",
    gameOverCompleted: "Bingo!",
    gameOverOutOfNames: "Game over",
    gameOverOutOfLives: "Out of lives",
    result: "Result",
    viewBoard: "View board",
    hitsLabel: "Hits",
    perfectBonus: "Perfect board bonus",
    share: "Share result",
    shareCopied: "Result copied!",
    shareFailed: "Could not copy the result.",
    statsTitle: "Statistics",
    played: "Played",
    finished: "Bingos",
    currentStreak: "Streak",
    bestStreak: "Best streak",
    rulesTitle: "How to play",
    rules: [
      `All ${csPlayers.length} players in the database appear one at a time, in random order. Each of the ${GRID_SIZE * GRID_SIZE} cells has its own criterion: place the current name in a cell whose criterion they meet.`,
      "If the name fits no open cell, skip it. Skipping costs no life, but the name does not come back.",
      `Wrong cell? You lose a life and the name stays on screen so you can try another cell. You have ${MAX_LIVES} lives per game.`,
      `Each hit is worth ${POINTS_PER_HIT} points. Completing the board without misses earns a +${PERFECT_BONUS} bonus.`,
      "Once per game, use the Wildcard to place the current name in any open cell, for no points.",
      "The game ends when the board is full, when you run out of names or when you run out of lives. At the end, see who could fill the empty cells and share your result.",
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
    lives: "Vidas",
    currentPlayerEyebrow: "Nombre actual",
    noCurrentPlayerTitle: "No quedan nombres",
    namesLeft: "Nombres restantes",
    skippedLabel: "Nombre perdido",
    skip: "Saltar",
    selectLanguage: "Idioma",
    wildcard: "Comodín",
    wildcardSpent: "Comodín usado",
    cancelWildcard: "Cancelar",
    wildcardArmedMessage: "Comodín activado: haz clic en cualquier casilla libre para colocar el nombre actual.",
    wildcardMessage: (player, criterion) => `¡Comodín! ${player} ocupa la casilla ${criterion} (sin puntos).`,
    initialMessage: "Aparece un nombre por vez. Haz clic en una casilla cuyo criterio cumpla ese jugador.",
    resetMessage: "Cartela reiniciada. El primer nombre ya está en pantalla.",
    completedMessage: "¡Bingo completo! Todas las casillas están llenas.",
    outOfNamesMessage: "Te quedaste sin nombres. Mira en la cartela quién podría ocupar las casillas vacías.",
    outOfLivesMessage: "Te quedaste sin vidas. Mira en la cartela quién podría ocupar las casillas vacías.",
    wrongMessage: (player, livesLeft) =>
      `${player} no combina con esa casilla. -1 vida${livesLeft === 1 ? ": ¡solo queda una!" : "."}`,
    correctMessage: (player, criterion) => `¡Bien! ${player} llena la casilla ${criterion}.`,
    alreadyPickedMessage: "Esa casilla ya está marcada. Elige una casilla libre.",
    gameOverCompleted: "¡Bingo!",
    gameOverOutOfNames: "Fin del juego",
    gameOverOutOfLives: "Sin vidas",
    result: "Resultado",
    viewBoard: "Ver cartela",
    hitsLabel: "Aciertos",
    perfectBonus: "Bono de cartela perfecta",
    share: "Compartir resultado",
    shareCopied: "¡Resultado copiado!",
    shareFailed: "No se pudo copiar el resultado.",
    statsTitle: "Estadísticas",
    played: "Partidas",
    finished: "Bingos",
    currentStreak: "Racha",
    bestStreak: "Mejor racha",
    rulesTitle: "Cómo jugar",
    rules: [
      `Los ${csPlayers.length} jugadores de la base aparecen uno por vez, en orden aleatorio. Cada una de las ${GRID_SIZE * GRID_SIZE} casillas tiene su propio criterio: coloca el nombre actual en una casilla cuyo criterio cumpla.`,
      "Si el nombre no sirve en ninguna casilla libre, sáltalo. Saltar no cuesta vida, pero el nombre no vuelve.",
      `¿Casilla equivocada? Pierdes una vida y el nombre sigue en pantalla para probar otra casilla. Tienes ${MAX_LIVES} vidas por partida.`,
      `Cada acierto vale ${POINTS_PER_HIT} puntos. Completar la cartela sin fallar da un bono de +${PERFECT_BONUS}.`,
      "Una vez por partida, usa el Comodín para colocar el nombre actual en cualquier casilla libre, sin sumar puntos.",
      "La partida termina cuando la cartela está completa, cuando se acaban los nombres o cuando se acaban las vidas. Al final, mira quién podría ocupar las casillas vacías y comparte tu resultado.",
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

// Hash djb2 limitado ao período do gerador: somar os códigos dos caracteres repetia a mesma
// cartela em dezenas de dias diferentes.
const hashDate = (dateKey: string) =>
  dateKey.split("").reduce((hash, char) => (hash * 33 + char.charCodeAt(0)) % 233280, 5381) || 1;

const FIRST_PUZZLE_DATE = "2026-01-01";

const getPuzzleNumber = (dateKey: string) =>
  Math.floor((Date.parse(dateKey) - Date.parse(FIRST_PUZZLE_DATE)) / (24 * 60 * 60 * 1000)) + 1;

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
const boardHasAnswers = (cells: BingoCriterion[]) => {
  const cellCandidates = cells.map((criterion) =>
    csPlayers.filter((player) => playerMatchesCriterion(player, criterion)).map((player) => player.id)
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

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const cells = seededShuffle(bingoCriteria, seed + attempt * 7919).slice(0, GRID_SIZE * GRID_SIZE);
    if (boardHasAnswers(cells)) return cells;
  }

  return bingoCriteria.slice(0, GRID_SIZE * GRID_SIZE);
};

// O baralho tem todos os jogadores da base, inclusive os que não servem em nenhuma casa:
// reconhecer esses nomes e pulá-los faz parte do desafio.
const createPlayerQueue = (dateKey: string) => seededShuffle(csPlayers, hashDate(dateKey) * 17);

const getPossibleAnswers = (criterion: BingoCriterion, usedPlayerIds: Set<string>) =>
  csPlayers
    .filter((player) => !usedPlayerIds.has(player.id) && playerMatchesCriterion(player, criterion))
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
  const playerQueue = useMemo(() => createPlayerQueue(dateKey), [dateKey]);
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
  const [openPanel, setOpenPanel] = useState<"rules" | "stats" | "result">();
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  // O jogo salvo, o idioma e as estatísticas vêm do localStorage; esperar a montagem evita
  // divergência entre o HTML do servidor e o do navegador (erro de hidratação).
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalCells = GRID_SIZE * GRID_SIZE;
  const filledCells = Object.keys(picks).length;
  const hits = Object.values(picks).filter((pick) => !pick.wildcard).length;
  const livesLeft = Math.max(MAX_LIVES - mistakes, 0);
  const isCompleted = filledCells === totalCells;
  const isPerfect = isCompleted && mistakes === 0;
  const score = hits * POINTS_PER_HIT + (isPerfect ? PERFECT_BONUS : 0);
  const gameStatus: GameStatus = isCompleted
    ? "completed"
    : livesLeft === 0
      ? "out-of-lives"
      : playerIndex < playerQueue.length
        ? "playing"
        : "out-of-names";
  const currentPlayer = gameStatus === "playing" ? playerQueue[playerIndex] : undefined;
  const namesLeft = Math.max(playerQueue.length - playerIndex, 0);
  const usedPlayerIds = new Set(Object.values(picks).map((pick) => pick.player.id));
  const isGameOver = gameStatus !== "playing";
  const gameOverTitle = {
    playing: "",
    completed: copy.gameOverCompleted,
    "out-of-names": copy.gameOverOutOfNames,
    "out-of-lives": copy.gameOverOutOfLives,
  }[gameStatus];
  const gameOverMessage = {
    playing: message,
    completed: copy.completedMessage,
    "out-of-names": copy.outOfNamesMessage,
    "out-of-lives": copy.outOfLivesMessage,
  }[gameStatus];

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

    const endsGame =
      Object.keys(nextPicks).length === totalCells ||
      nextMistakes >= MAX_LIVES ||
      nextPlayerIndex >= playerQueue.length;
    if (endsGame) setOpenPanel("result");
  };

  const handleCellClick = (cellIndex: number) => {
    if (!currentPlayer) return;

    const cellKey = String(cellIndex);
    if (picks[cellKey]) {
      showMessage(copy.alreadyPickedMessage, "neutral");
      return;
    }

    const criterion = board[cellIndex];
    const criterionLabel = getCriterionCopy(criterion, language).label;
    const fillsBoard = filledCells + 1 === totalCells;

    if (wildcardArmed) {
      const nextPicks = { ...picks, [cellKey]: { player: currentPlayer, wildcard: true } };
      setWildcardArmed(false);
      setLastHitKey(cellKey);
      advanceGame(nextPicks, playerIndex + 1, skippedPlayerIds, mistakes, cellKey);
      showMessage(
        fillsBoard ? copy.completedMessage : copy.wildcardMessage(currentPlayer.nickname, criterionLabel),
        "wildcard"
      );
      return;
    }

    // Errar custa uma vida, mas o nome continua na tela para tentar outra casa.
    if (!playerMatchesCriterion(currentPlayer, criterion)) {
      setFlashKey((currentFlashKey) => currentFlashKey + 1);
      advanceGame(picks, playerIndex, skippedPlayerIds, mistakes + 1);
      showMessage(copy.wrongMessage(currentPlayer.nickname, livesLeft - 1), "error");
      return;
    }

    const nextPicks = { ...picks, [cellKey]: { player: currentPlayer, wildcard: false } };
    setLastHitKey(cellKey);
    advanceGame(nextPicks, playerIndex + 1);
    showMessage(
      fillsBoard ? copy.completedMessage : copy.correctMessage(currentPlayer.nickname, criterionLabel),
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
    setOpenPanel(undefined);
    showMessage(copy.resetMessage, "neutral");
    setFlashKey(0);
  };

  const handleSkip = () => {
    if (!currentPlayer) return;

    setWildcardArmed(false);
    advanceGame(picks, playerIndex + 1, [...skippedPlayerIds, currentPlayer.id]);
    showMessage(`${copy.skippedLabel}: ${currentPlayer.nickname}.`, "neutral");
  };

  const handleWildcardToggle = () => {
    if (wildcardCell || !currentPlayer) return;

    const nextArmed = !wildcardArmed;
    setWildcardArmed(nextArmed);
    showMessage(nextArmed ? copy.wildcardArmedMessage : copy.initialMessage, nextArmed ? "wildcard" : "neutral");
  };

  const handleShare = async () => {
    const grid = Array.from({ length: GRID_SIZE }, (_, rowIndex) =>
      board
        .slice(rowIndex * GRID_SIZE, (rowIndex + 1) * GRID_SIZE)
        .map((__, columnIndex) => {
          const pick = picks[String(rowIndex * GRID_SIZE + columnIndex)];
          if (!pick) return "⬛";
          return pick.wildcard ? "🟨" : "🟩";
        })
        .join("")
    ).join("\n");
    const shareText = [
      `CS Bingo #${getPuzzleNumber(dateKey)} · ${dateKey}`,
      `🎯 ${score} ${copy.points} · ${"❤️".repeat(livesLeft)}${"🖤".repeat(MAX_LIVES - livesLeft)} · 🔥 ${stats.currentStreak}`,
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
    neutral: "border-cs-orange text-cs-text",
    success: "border-cs-green text-[#d7f0c8]",
    error: "border-cs-red text-[#f6c9ca]",
    wildcard: "border-cs-gold text-[#f5e3b5]",
  };
  const statusTone: MessageTone = gameStatus === "playing" ? messageTone : isCompleted ? "success" : "error";

  if (!mounted) return <main className="h-full" />;

  return (
    <main className="flex h-full flex-col">
      <div className="shrink-0 border-b border-cs-line bg-cs-panel/80">
        <div className="mx-auto flex h-10 max-w-[560px] items-center justify-between gap-2 px-3 short:h-9 short:max-w-5xl">
          <p className="min-w-0 truncate text-xs font-semibold uppercase tracking-wide text-cs-text/55 sm:text-sm sm:tracking-[0.12em]">
            <span className="font-bold text-cs-orange">#{getPuzzleNumber(dateKey)}</span>
            <span className="mx-1.5 text-cs-line sm:mx-2">|</span>
            <span className="sr-only">{copy.puzzleDate} </span>
            {dateKey}
          </p>
          <div className="flex shrink-0 items-center gap-1">
            <ToolbarButton label={copy.rulesTitle} onClick={() => setOpenPanel("rules")}>
              <HelpCircle className="h-5 w-5" />
            </ToolbarButton>
            <ToolbarButton label={copy.statsTitle} onClick={() => setOpenPanel("stats")}>
              <Flame className="h-5 w-5 text-cs-orange" />
              <span className="text-base font-bold">{stats.currentStreak}</span>
              <BarChart3 className="h-5 w-5" />
            </ToolbarButton>
            <ToolbarButton label={copy.reset} onClick={handleReset}>
              <RotateCcw className="h-5 w-5" />
            </ToolbarButton>
            <label className="cs-cut-sm ml-1 inline-flex items-center gap-1 bg-cs-raised px-2 py-1 text-cs-text/80">
              <Globe2 className="h-4 w-4" />
              <select
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value as Language)}
                className="bg-transparent text-xs font-bold uppercase outline-none"
                aria-label={copy.selectLanguage}
              >
                {Object.entries(translations).map(([key, value]) => (
                  <option key={key} value={key} className="bg-cs-panel text-cs-text" title={value.languageName}>
                    {key.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      <section className="mx-auto flex min-h-0 w-full max-w-[560px] flex-1 flex-col gap-2 px-3 py-2 sm:gap-3 sm:py-4 short:max-w-5xl short:flex-row short:gap-4 short:py-2">
        {/* Em pé: painel, mensagem e cartela empilhados. Deitado: painel e mensagem ao lado da cartela. */}
        <div className="contents short:flex short:w-[min(24rem,48%)] short:shrink-0 short:flex-col short:justify-center short:gap-2">
        <div className="cs-cut shrink-0 bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut bg-cs-surface">
            <div className="flex items-center gap-3 border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-3 py-2 sm:px-4">
              <div className="cs-cut-sm flex h-12 w-12 shrink-0 flex-col items-center justify-center bg-cs-bg text-cs-orange sm:h-14 sm:w-14">
                <span className="text-xl font-bold leading-none sm:text-2xl">{namesLeft}</span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-cs-text/50">/ {playerQueue.length}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cs-orange sm:text-xs">
                  {currentPlayer ? copy.currentPlayerEyebrow : copy.result}
                </p>
                {currentPlayer ? (
                  <>
                    <h1 className="truncate text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">
                      {currentPlayer.nickname}
                    </h1>
                    <p className="truncate text-xs font-semibold uppercase tracking-wider text-cs-text/45">
                      {currentPlayer.fullName}
                    </p>
                  </>
                ) : (
                  <h1 className="truncate text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{gameOverTitle}</h1>
                )}
              </div>

              {currentPlayer ? (
                <div className="flex shrink-0 flex-col items-stretch gap-1.5">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="cs-cut-sm inline-flex items-center justify-center gap-1 bg-cs-orange px-3 py-1 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
                  >
                    {copy.skip} <SkipForward className="h-4 w-4 fill-current" />
                  </button>
                  <button
                    type="button"
                    onClick={handleWildcardToggle}
                    disabled={Boolean(wildcardCell)}
                    className={`cs-cut-sm inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      wildcardArmed ? "bg-cs-gold text-cs-bg" : "bg-cs-bg text-cs-gold hover:bg-cs-gold/15"
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {wildcardCell ? copy.wildcardSpent : wildcardArmed ? copy.cancelWildcard : copy.wildcard}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setOpenPanel("result")}
                  aria-label={copy.result}
                  className="cs-cut-sm inline-flex shrink-0 items-center gap-1.5 bg-cs-orange px-3 py-2 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
                >
                  <Trophy className="h-4 w-4" /> <span className="hidden sm:inline">{copy.result}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 divide-x divide-cs-line py-1.5 text-center">
              <div className="flex items-center justify-center gap-1.5" aria-label={`${copy.lives}: ${livesLeft}/${MAX_LIVES}`}>
                {Array.from({ length: MAX_LIVES }, (_, index) => (
                  <Heart
                    key={index}
                    className={`h-5 w-5 transition ${
                      index < livesLeft ? "fill-cs-red text-cs-red" : "text-cs-text/20"
                    }`}
                  />
                ))}
              </div>
              <p className="text-lg font-bold leading-6">
                {filledCells}
                <span className="text-sm text-cs-text/40"> / {totalCells}</span>
                <span className="sr-only"> {copy.progress}</span>
              </p>
              <p className="text-lg font-bold leading-6 text-cs-green">
                {score}
                <span className="text-sm text-cs-text/40"> {copy.points}</span>
              </p>
            </div>
          </div>
        </div>

        <p
          className={`line-clamp-2 min-h-[2.75rem] shrink-0 border-l-4 bg-cs-panel/90 px-3 py-1.5 text-sm font-semibold leading-5 sm:text-base sm:leading-6 ${messageToneClass[statusTone]}`}
          aria-live="polite"
        >
          {gameOverMessage}
        </p>
        </div>

        <div className="cs-board-fit flex min-h-0 flex-1 items-start justify-center short:items-center">
          <div
            key={flashKey}
            className={`cs-board cs-cut grid grid-cols-4 grid-rows-4 gap-[2px] bg-cs-line p-[2px] shadow-2xl shadow-black/50 ${
              flashKey > 0 ? "animate-bingo-error" : ""
            }`}
          >
            {board.map((criterion, cellIndex) => {
              const cellKey = String(cellIndex);
              const pick = picks[cellKey];
              const criterionCopy = getCriterionCopy(criterion, language);
              const cellColor = pick
                ? pick.wildcard
                  ? "bg-[#352f22] shadow-[inset_0_-3px_0_#e0b04a]"
                  : "bg-[#203047] shadow-[inset_0_-3px_0_#7fc35b]"
                : wildcardArmed
                  ? "bg-cs-raised shadow-[inset_0_0_0_2px_rgba(224,176,74,0.7)] hover:bg-[#352f22]"
                  : "bg-cs-raised hover:bg-[#2e363e] hover:shadow-[inset_0_0_0_2px_rgba(242,163,58,0.6)]";

              return (
                <button
                  key={criterion.id}
                  type="button"
                  onClick={() => handleCellClick(cellIndex)}
                  disabled={isGameOver || Boolean(pick)}
                  aria-label={criterionCopy.label}
                  title={criterionCopy.helper}
                  className={`group relative grid min-w-0 place-items-center overflow-hidden p-1 text-center transition disabled:cursor-not-allowed ${cellColor} ${
                    lastHitKey === cellKey ? "animate-bingo-hit" : ""
                  }`}
                >
                  {pick ? (
                    <div className="min-w-0 space-y-[4%]">
                      <p className="truncate text-[length:clamp(8px,2.2cqmin,12px)] font-bold uppercase tracking-wider text-cs-text/50">
                        {criterionCopy.label}
                      </p>
                      {pick.wildcard ? (
                        <Sparkles className="mx-auto h-[clamp(12px,3.6cqmin,20px)] w-[clamp(12px,3.6cqmin,20px)] text-cs-gold" />
                      ) : (
                        <Check className="mx-auto h-[clamp(12px,3.6cqmin,20px)] w-[clamp(12px,3.6cqmin,20px)] text-cs-green" />
                      )}
                      <p className="break-all text-[length:clamp(10px,3.2cqmin,19px)] font-bold uppercase leading-none tracking-wide">
                        {pick.player.nickname}
                      </p>
                    </div>
                  ) : (
                    <div className="min-w-0 space-y-[3%]">
                      <CriterionIcon criterion={criterion} />
                      <p className="break-words text-[length:clamp(10px,3cqmin,17px)] font-bold uppercase leading-tight tracking-wide">
                        {criterionCopy.label}
                      </p>
                      {isGameOver ? (
                        <p className="break-words text-[length:clamp(8px,2.4cqmin,13px)] font-semibold leading-tight text-cs-orange/80">
                          {getPossibleAnswers(criterion, usedPlayerIds).join(", ")}
                        </p>
                      ) : (
                        <p className="cs-board-helper text-[11px] font-semibold leading-tight text-cs-text/40">{criterionCopy.helper}</p>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </section>

      {openPanel === "result" ? (
        <Modal title={gameOverTitle} closeLabel={copy.close} onClose={() => setOpenPanel(undefined)}>
          <div className="flex items-center gap-2 text-cs-text/70">
            {isCompleted ? <Trophy className="h-5 w-5 text-cs-orange" /> : <X className="h-5 w-5 text-cs-red" />}
            <span className="font-semibold">{gameOverMessage}</span>
          </div>
          <dl className="mt-4 space-y-1 text-cs-text/75">
            <div className="flex justify-between gap-2">
              <dt>{copy.hitsLabel}</dt>
              <dd className="font-bold text-cs-text">
                {hits} × {POINTS_PER_HIT} = {hits * POINTS_PER_HIT} {copy.points}
              </dd>
            </div>
            {isPerfect ? (
              <div className="flex justify-between gap-2">
                <dt>{copy.perfectBonus}</dt>
                <dd className="font-bold text-cs-green">+{PERFECT_BONUS} {copy.points}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-2">
              <dt>{copy.lives}</dt>
              <dd className="inline-flex items-center gap-1">
                {Array.from({ length: MAX_LIVES }, (_, index) => (
                  <Heart key={index} className={`h-4 w-4 ${index < livesLeft ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
                ))}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt>{copy.currentStreak}</dt>
              <dd className="inline-flex items-center gap-1 font-bold text-cs-text">
                <Flame className="h-4 w-4 text-cs-orange" /> {stats.currentStreak}
              </dd>
            </div>
            <div className="flex justify-between gap-2 border-t border-cs-line pt-1">
              <dt className="font-bold uppercase tracking-wider">{copy.score}</dt>
              <dd className="text-xl font-bold text-cs-green">{score} {copy.points}</dd>
            </div>
          </dl>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOpenPanel(undefined)}
              className="cs-cut-sm bg-cs-raised px-3 py-2.5 text-base font-bold uppercase tracking-wider transition hover:text-cs-orange"
            >
              {copy.viewBoard}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="cs-cut-sm inline-flex items-center justify-center gap-2 bg-cs-orange px-3 py-2.5 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
            >
              <Share2 className="h-4 w-4" /> {copy.share}
            </button>
          </div>
          {shareStatus ? (
            <p className="mt-2 text-center text-sm font-semibold text-cs-text/70">
              {shareStatus === "copied" ? copy.shareCopied : copy.shareFailed}
            </p>
          ) : null}
        </Modal>
      ) : null}

      {openPanel === "rules" ? (
        <Modal title={copy.rulesTitle} closeLabel={copy.close} onClose={() => setOpenPanel(undefined)}>
          <ol className="space-y-2 leading-6 text-cs-text/80">
            {copy.rules.map((rule, index) => (
              <li key={rule} className="flex gap-3">
                <span className="font-bold text-cs-orange">{String(index + 1).padStart(2, "0")}</span>
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

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 items-center gap-1 px-1.5 text-cs-text/75 transition hover:text-cs-orange"
    >
      {children}
    </button>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="cs-cut-sm bg-cs-panel p-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{label}</p>
      <p className="mt-0.5 text-3xl font-bold leading-none text-cs-orange">{value}</p>
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
      className="fixed inset-0 z-50 grid place-items-center bg-black/75 px-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="cs-cut max-h-[90dvh] w-full max-w-md overflow-y-auto border-t-2 border-cs-orange bg-cs-surface p-5 text-base text-cs-text shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold uppercase tracking-wider">{title}</h2>
          <button type="button" onClick={onClose} aria-label={closeLabel} className="text-cs-text/60 transition hover:text-cs-orange">
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
    return (
      <span className="block text-[length:clamp(14px,4.5cqmin,26px)] leading-none">
        {countryFlags[String(criterion.value)] ?? "🏳️"}
      </span>
    );
  }

  const iconClass = "mx-auto h-[clamp(14px,4cqmin,22px)] w-[clamp(14px,4cqmin,22px)]";
  switch (criterion.type) {
    case "team":
      return <Shield className={`${iconClass} text-cs-blue`} />;
    case "region":
      return <Globe2 className={`${iconClass} text-cs-blue`} />;
    case "role":
      return <Crosshair className={`${iconClass} text-cs-red`} />;
    case "achievement":
      return <Trophy className={`${iconClass} text-cs-gold`} />;
    default:
      return <Activity className={`${iconClass} text-cs-green`} />;
  }
}
