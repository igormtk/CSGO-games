"use client";

import { Fragment, useMemo, useState } from "react";
import { Check, Globe2, RotateCcw, Trophy, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  bingoCriteria,
  csPlayers,
  csTeams,
  getTeamName,
  playerMatchesCell,
} from "@/data/csBingoDatabase";
import type { BingoCriterion, CsPlayer } from "@/data/csBingoDatabase";

const GRID_SIZE = 3;
const GAME_KEY_PREFIX = "cs-bingo-daily";
const LANGUAGE_KEY = "cs-bingo-language";

type CellPick = {
  player: CsPlayer;
  correct: boolean;
};

type GameBoard = {
  rows: BingoCriterion[];
  columns: BingoCriterion[];
};

type GameStatus = "playing" | "completed" | "out-of-names";
type Language = "pt" | "en" | "es";

type StoredGame = {
  picks?: Record<string, string>;
  playerIndex?: number;
  skippedPlayerIds?: string[];
};

type CriterionCopy = {
  label: string;
  helper: string;
};

type TranslationCopy = {
  languageName: string;
  title: string;
  subtitle: string;
  dailyBadge: string;
  puzzleDate: string;
  playersInDb: string;
  teamsInDb: string;
  progress: string;
  cells: string;
  completed: string;
  outOfNames: string;
  reset: string;
  currentPlayerEyebrow: string;
  currentPlayerTitle: string;
  currentPlayerInstructions: string;
  noCurrentPlayerTitle: string;
  noCurrentPlayerInstructions: string;
  namesLeft: string;
  wrongPenalty: string;
  skippedLabel: string;
  boardCorner: string;
  rowAxis: string;
  columnAxis: string;
  chooseCell: string;
  chooseCellHelper: string;
  matchedBy: string;
  openCell: string;
  statusActive: string;
  statusLegend: string;
  selectLanguage: string;
  initialMessage: string;
  resetMessage: string;
  completedMessage: string;
  outOfNamesMessage: string;
  wrongMessage: (player: string, skippedPlayer?: string) => string;
  correctMessage: (player: string, row: string, column: string) => string;
  alreadyPickedMessage: string;
};

const translations: Record<Language, TranslationCopy> = {
  pt: {
    languageName: "Português",
    title: "Encaixe cada pro player na cartela de Counter-Strike",
    subtitle:
      "Um nome aparece por vez. Clique em uma casa que satisfaça a linha e a coluna para marcá-la em verde. Se errar, o grid pisca em vermelho e você perde também o próximo nome da fila.",
    dailyBadge: "CS Bingo Daily",
    puzzleDate: "Puzzle UTC",
    playersInDb: "Jogadores no banco",
    teamsInDb: "Times no banco",
    progress: "Progresso",
    cells: "casas",
    completed: "Bingo completo! Amanhã tem uma nova cartela.",
    outOfNames: "Fim dos nomes. Reinicie para tentar outra vez.",
    reset: "Reiniciar tentativa",
    currentPlayerEyebrow: "Nome da vez",
    currentPlayerTitle: "Clique na casa certa para",
    currentPlayerInstructions: "Use o histórico, país, função e conquistas do jogador para cruzar linha + coluna.",
    noCurrentPlayerTitle: "Nenhum nome restante",
    noCurrentPlayerInstructions: "Você ficou sem nomes disponíveis nesta tentativa.",
    namesLeft: "Nomes restantes",
    wrongPenalty: "Erro: perde o nome atual + o próximo",
    skippedLabel: "Nome perdido",
    boardCorner: "Linha x Coluna",
    rowAxis: "linha",
    columnAxis: "coluna",
    chooseCell: "Escolher esta casa",
    chooseCellHelper: "Clique se o nome da vez cumprir os dois critérios.",
    matchedBy: "Marcada por",
    openCell: "Casa aberta",
    statusActive: "Ativo",
    statusLegend: "Lenda",
    selectLanguage: "Idioma",
    initialMessage: "Um nome aparece por vez. Clique na casa que combina com esse jogador.",
    resetMessage: "Cartela reiniciada. O primeiro nome já está na tela.",
    completedMessage: "Bingo completo! Todas as casas foram marcadas em verde.",
    outOfNamesMessage: "Você ficou sem nomes. Reinicie para tentar novamente.",
    wrongMessage: (player, skippedPlayer) =>
      skippedPlayer
        ? `${player} não combina com essa casa. O grid piscou em vermelho e você perdeu também ${skippedPlayer}.`
        : `${player} não combina com essa casa. O grid piscou em vermelho.`,
    correctMessage: (player, row, column) => `Boa! ${player} preenche ${row} + ${column}.`,
    alreadyPickedMessage: "Essa casa já está marcada. Escolha uma casa aberta para o nome da vez.",
  },
  en: {
    languageName: "English",
    title: "Fit each Counter-Strike pro into the bingo board",
    subtitle:
      "One name appears at a time. Click a cell that matches both its row and column to mark it green. If you miss, the grid flashes red and you also lose the next name in the queue.",
    dailyBadge: "CS Bingo Daily",
    puzzleDate: "UTC puzzle",
    playersInDb: "Players in database",
    teamsInDb: "Teams in database",
    progress: "Progress",
    cells: "cells",
    completed: "Bingo complete! A new board arrives tomorrow.",
    outOfNames: "No names left. Reset to try again.",
    reset: "Reset attempt",
    currentPlayerEyebrow: "Current name",
    currentPlayerTitle: "Click the right cell for",
    currentPlayerInstructions: "Use the player's teams, country, role, and achievements to cross row + column.",
    noCurrentPlayerTitle: "No names remaining",
    noCurrentPlayerInstructions: "You ran out of available names for this attempt.",
    namesLeft: "Names left",
    wrongPenalty: "Miss: lose current name + next name",
    skippedLabel: "Lost name",
    boardCorner: "Row x Column",
    rowAxis: "row",
    columnAxis: "column",
    chooseCell: "Choose this cell",
    chooseCellHelper: "Click if the current name satisfies both criteria.",
    matchedBy: "Marked by",
    openCell: "Open cell",
    statusActive: "Active",
    statusLegend: "Legend",
    selectLanguage: "Language",
    initialMessage: "One name appears at a time. Click the cell that matches that player.",
    resetMessage: "Board reset. The first name is already on screen.",
    completedMessage: "Bingo complete! Every cell is marked green.",
    outOfNamesMessage: "You ran out of names. Reset to try again.",
    wrongMessage: (player, skippedPlayer) =>
      skippedPlayer
        ? `${player} does not match that cell. The grid flashed red and you also lost ${skippedPlayer}.`
        : `${player} does not match that cell. The grid flashed red.`,
    correctMessage: (player, row, column) => `Nice! ${player} matches ${row} + ${column}.`,
    alreadyPickedMessage: "That cell is already marked. Choose an open cell for the current name.",
  },
  es: {
    languageName: "Español",
    title: "Encaja cada pro player en el bingo de Counter-Strike",
    subtitle:
      "Aparece un nombre por vez. Haz clic en una casilla que cumpla fila y columna para marcarla en verde. Si fallas, el grid parpadea en rojo y también pierdes el siguiente nombre de la fila.",
    dailyBadge: "CS Bingo Daily",
    puzzleDate: "Puzzle UTC",
    playersInDb: "Jugadores en la base",
    teamsInDb: "Equipos en la base",
    progress: "Progreso",
    cells: "casillas",
    completed: "¡Bingo completo! Mañana hay una nueva cartela.",
    outOfNames: "No quedan nombres. Reinicia para intentarlo de nuevo.",
    reset: "Reiniciar intento",
    currentPlayerEyebrow: "Nombre actual",
    currentPlayerTitle: "Haz clic en la casilla correcta para",
    currentPlayerInstructions: "Usa equipos, país, rol y logros del jugador para cruzar fila + columna.",
    noCurrentPlayerTitle: "No quedan nombres",
    noCurrentPlayerInstructions: "Te quedaste sin nombres disponibles en este intento.",
    namesLeft: "Nombres restantes",
    wrongPenalty: "Error: pierdes el nombre actual + el próximo",
    skippedLabel: "Nombre perdido",
    boardCorner: "Fila x Columna",
    rowAxis: "fila",
    columnAxis: "columna",
    chooseCell: "Elegir esta casilla",
    chooseCellHelper: "Haz clic si el nombre actual cumple ambos criterios.",
    matchedBy: "Marcada por",
    openCell: "Casilla abierta",
    statusActive: "Activo",
    statusLegend: "Leyenda",
    selectLanguage: "Idioma",
    initialMessage: "Aparece un nombre por vez. Haz clic en la casilla que combina con ese jugador.",
    resetMessage: "Cartela reiniciada. El primer nombre ya está en pantalla.",
    completedMessage: "¡Bingo completo! Todas las casillas están marcadas en verde.",
    outOfNamesMessage: "Te quedaste sin nombres. Reinicia para intentarlo de nuevo.",
    wrongMessage: (player, skippedPlayer) =>
      skippedPlayer
        ? `${player} no combina con esa casilla. El grid parpadeó en rojo y también perdiste ${skippedPlayer}.`
        : `${player} no combina con esa casilla. El grid parpadeó en rojo.`,
    correctMessage: (player, row, column) => `¡Bien! ${player} cumple ${row} + ${column}.`,
    alreadyPickedMessage: "Esa casilla ya está marcada. Elige una casilla abierta para el nombre actual.",
  },
};

const criterionTranslations: Record<Language, Record<string, CriterionCopy>> = {
  pt: {},
  en: {
    "nat-brazil": { label: "Brazil", helper: "Brazilian player" },
    "nat-denmark": { label: "Denmark", helper: "Danish player" },
    "nat-france": { label: "France", helper: "French player" },
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

const getUtcDateKey = () => new Date().toISOString().slice(0, 10);

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

const boardHasAnswers = (rows: BingoCriterion[], columns: BingoCriterion[]) =>
  rows.every((row) =>
    columns.every((column) =>
      csPlayers.some((player) => playerMatchesCell(player, row, column))
    )
  );

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

const hydratePicks = (storedPicks?: Record<string, string>) => {
  if (!storedPicks) return {};

  return Object.entries(storedPicks).reduce<Record<string, CellPick>>((acc, [cellKey, playerId]) => {
    const player = csPlayers.find((candidate) => candidate.id === playerId);
    if (player) {
      acc[cellKey] = { player, correct: true };
    }
    return acc;
  }, {});
};

const serializePicks = (picks: Record<string, CellPick>) =>
  Object.entries(picks).reduce<Record<string, string>>((acc, [cellKey, pick]) => {
    if (pick.correct) {
      acc[cellKey] = pick.player.id;
    }
    return acc;
  }, {});

const saveGame = (
  dateKey: string,
  picks: Record<string, CellPick>,
  playerIndex: number,
  skippedPlayerIds: string[]
) => {
  window.localStorage.setItem(
    `${GAME_KEY_PREFIX}-${dateKey}`,
    JSON.stringify({ picks: serializePicks(picks), playerIndex, skippedPlayerIds })
  );
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

const formatPlayerMeta = (player: CsPlayer, copy: TranslationCopy) => {
  const teams = player.teams.map(getTeamName).join(", ");
  return `${player.fullName} • ${player.nationality} • ${teams} • ${player.active ? copy.statusActive : copy.statusLegend}`;
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
  const [picks, setPicks] = useState<Record<string, CellPick>>(() => hydratePicks(storedGame.picks));
  const [playerIndex, setPlayerIndex] = useState(storedGame.playerIndex ?? 0);
  const [skippedPlayerIds, setSkippedPlayerIds] = useState<string[]>(storedGame.skippedPlayerIds ?? []);
  const [message, setMessage] = useState(copy.initialMessage);
  const [flashKey, setFlashKey] = useState(0);

  const completedCells = Object.values(picks).filter((pick) => pick.correct).length;
  const isCompleted = completedCells === GRID_SIZE * GRID_SIZE;
  const currentPlayer = isCompleted ? undefined : playerQueue[playerIndex];
  const namesLeft = Math.max(playerQueue.length - playerIndex, 0);
  const gameStatus: GameStatus = isCompleted ? "completed" : currentPlayer ? "playing" : "out-of-names";
  const latestSkippedPlayer = skippedPlayerIds.length
    ? csPlayers.find((player) => player.id === skippedPlayerIds[skippedPlayerIds.length - 1])
    : undefined;

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_KEY, nextLanguage);
  };

  const advanceGame = (
    nextPicks: Record<string, CellPick>,
    nextPlayerIndex: number,
    nextSkippedPlayerIds = skippedPlayerIds
  ) => {
    setPicks(nextPicks);
    setPlayerIndex(nextPlayerIndex);
    setSkippedPlayerIds(nextSkippedPlayerIds);
    saveGame(dateKey, nextPicks, nextPlayerIndex, nextSkippedPlayerIds);
  };

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    if (!currentPlayer || gameStatus !== "playing") return;

    const cellKey = getCellKey(rowIndex, columnIndex);
    if (picks[cellKey]?.correct) {
      setMessage(copy.alreadyPickedMessage);
      return;
    }

    const row = board.rows[rowIndex];
    const column = board.columns[columnIndex];
    const correct = playerMatchesCell(currentPlayer, row, column);

    if (!correct) {
      const skippedPlayer = playerQueue[playerIndex + 1];
      const nextPlayerIndex = playerIndex + (skippedPlayer ? 2 : 1);
      const nextSkippedPlayerIds = skippedPlayer
        ? [...skippedPlayerIds, skippedPlayer.id]
        : skippedPlayerIds;

      setFlashKey((currentFlashKey) => currentFlashKey + 1);
      advanceGame(picks, nextPlayerIndex, nextSkippedPlayerIds);
      setMessage(copy.wrongMessage(currentPlayer.nickname, skippedPlayer?.nickname));
      return;
    }

    const nextPicks = {
      ...picks,
      [cellKey]: { player: currentPlayer, correct: true },
    };
    const nextPlayerIndex = playerIndex + 1;
    advanceGame(nextPicks, nextPlayerIndex);
    setMessage(
      completedCells + 1 === GRID_SIZE * GRID_SIZE
        ? copy.completedMessage
        : copy.correctMessage(currentPlayer.nickname, getCriterionCopy(row, language).label, getCriterionCopy(column, language).label)
    );
  };

  const handleReset = () => {
    window.localStorage.removeItem(`${GAME_KEY_PREFIX}-${dateKey}`);
    setPicks({});
    setPlayerIndex(0);
    setSkippedPlayerIds([]);
    setMessage(copy.resetMessage);
    setFlashKey(0);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#090b10] text-slate-100">
      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.25),_transparent_60%)]" />

        <header className="relative z-10 grid gap-6 rounded-3xl border border-orange-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-orange-950/30 backdrop-blur md:grid-cols-[1.4fr_0.6fr] md:p-8">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
                {copy.dailyBadge}
              </div>
              <label className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-200">
                <Globe2 className="h-4 w-4 text-orange-300" />
                <span className="sr-only">{copy.selectLanguage}</span>
                <select
                  value={language}
                  onChange={(event) => handleLanguageChange(event.target.value as Language)}
                  className="bg-transparent text-sm font-semibold outline-none"
                  aria-label={copy.selectLanguage}
                >
                  {Object.entries(translations).map(([key, value]) => (
                    <option key={key} value={key} className="bg-slate-950 text-slate-100">
                      {value.languageName}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">{copy.title}</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">{copy.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-slate-900 px-4 py-2 ring-1 ring-white/10">
                {copy.puzzleDate}: {dateKey}
              </span>
              <span className="rounded-full bg-slate-900 px-4 py-2 ring-1 ring-white/10">
                {copy.playersInDb}: {csPlayers.length}
              </span>
              <span className="rounded-full bg-slate-900 px-4 py-2 ring-1 ring-white/10">
                {copy.teamsInDb}: {csTeams.length}
              </span>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{copy.progress}</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-black text-orange-300">{completedCells}</span>
                <span className="pb-2 text-slate-400">/ 9 {copy.cells}</span>
              </div>
            </div>
            {isCompleted ? (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
                <Trophy className="mb-2 h-6 w-6" />
                {copy.completed}
              </div>
            ) : gameStatus === "out-of-names" ? (
              <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-100">
                <X className="mb-2 h-6 w-6" />
                {copy.outOfNames}
              </div>
            ) : null}
            <Button onClick={handleReset} variant="outline" className="border-orange-300/40 bg-transparent text-orange-100 hover:bg-orange-500/20">
              <RotateCcw className="h-4 w-4" /> {copy.reset}
            </Button>
          </aside>
        </header>

        <section className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div
            key={flashKey}
            className={`rounded-3xl border border-slate-800 bg-slate-950/80 p-3 shadow-2xl shadow-black/30 sm:p-5 ${flashKey > 0 ? "animate-bingo-error" : ""}`}
          >
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500 sm:p-4">
                {copy.boardCorner}
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
                    const currentFits = currentPlayer ? playerMatchesCell(currentPlayer, row, column) : false;

                    return (
                      <button
                        key={cellKey}
                        type="button"
                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                        disabled={gameStatus !== "playing" || Boolean(pick?.correct)}
                        className={`group min-h-32 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:hover:translate-y-0 sm:min-h-40 sm:p-4 ${
                          pick?.correct
                            ? "border-emerald-400/40 bg-emerald-500/15"
                            : currentFits
                              ? "border-slate-700 bg-slate-900/70"
                              : "border-slate-800 bg-slate-900/70"
                        }`}
                      >
                        <div className="flex h-full flex-col justify-between gap-3">
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                            <span>{rowCopy.label}</span>
                            <span>+</span>
                            <span>{columnCopy.label}</span>
                          </div>

                          {pick ? (
                            <div className="space-y-2">
                              <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">{copy.matchedBy}</p>
                              <div className="flex items-center gap-2">
                                <Check className="h-5 w-5 text-emerald-300" />
                                <span className="text-xl font-black text-white">{pick.player.nickname}</span>
                              </div>
                              <p className="text-xs leading-5 text-slate-300">{pick.player.fullName}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg font-bold text-white">{copy.chooseCell}</p>
                              <p className="mt-1 text-xs leading-5 text-slate-400">{copy.chooseCellHelper}</p>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <aside className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5 shadow-2xl shadow-black/30">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-orange-300">{copy.currentPlayerEyebrow}</p>
                {currentPlayer ? (
                  <>
                    <h2 className="mt-2 text-2xl font-black text-white">{copy.currentPlayerTitle}</h2>
                    <div className="mt-4 rounded-3xl border border-orange-400/30 bg-orange-500/10 p-5">
                      <p className="text-4xl font-black text-white">{currentPlayer.nickname}</p>
                      <p className="mt-2 text-sm leading-6 text-orange-100">{formatPlayerMeta(currentPlayer, copy)}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{copy.currentPlayerInstructions}</p>
                  </>
                ) : (
                  <>
                    <h2 className="mt-2 text-2xl font-black text-white">{copy.noCurrentPlayerTitle}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{copy.noCurrentPlayerInstructions}</p>
                  </>
                )}
              </div>

              <div className="grid gap-3 text-sm text-slate-200 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{copy.namesLeft}</p>
                  <p className="mt-2 text-3xl font-black text-orange-300">{namesLeft}</p>
                </div>
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-red-100">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-200">{copy.wrongPenalty}</p>
                  {latestSkippedPlayer ? (
                    <p className="mt-2 text-sm">
                      {copy.skippedLabel}: <strong>{latestSkippedPlayer.nickname}</strong>
                    </p>
                  ) : null}
                </div>
              </div>

              <p
                className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${
                  message.includes("não combina") || message.includes("does not match") || message.includes("no combina") || gameStatus === "out-of-names"
                    ? "border-red-400/30 bg-red-500/10 text-red-100"
                    : "border-orange-400/20 bg-orange-500/10 text-orange-100"
                }`}
              >
                {gameStatus === "out-of-names" && !isCompleted ? copy.outOfNamesMessage : message}
              </p>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
                <p className="font-bold text-white">{copy.openCell}</p>
                <p className="mt-2 leading-6">
                  {board.rows.map((row) => getCriterionCopy(row, language).label).join(" • ")} / {board.columns.map((column) => getCriterionCopy(column, language).label).join(" • ")}
                </p>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function CriterionHeader({ criterion, axis, language }: { criterion: BingoCriterion; axis: string; language: Language }) {
  const criterionCopy = getCriterionCopy(criterion, language);

  return (
    <div className="rounded-2xl border border-orange-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-3 text-center shadow-inner shadow-orange-950/20 sm:p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">{axis}</p>
      <h3 className="mt-2 text-base font-black text-white sm:text-xl">{criterionCopy.label}</h3>
      <p className="mt-2 hidden text-xs leading-5 text-slate-400 sm:block">{criterionCopy.helper}</p>
    </div>
  );
}
