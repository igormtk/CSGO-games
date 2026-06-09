"use client";

import { Fragment, useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  Globe2,
  HelpCircle,
  Menu,
  RotateCcw,
  SkipForward,
  Trophy,
  X,
} from "lucide-react";
import {
  bingoCriteria,
  csPlayers,
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
  skip: string;
  remaining: string;
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
    skip: "Pular",
    remaining: "restantes",
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
    skip: "Skip",
    remaining: "remaining",
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
    skip: "Saltar",
    remaining: "restantes",
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

  const handleSkip = () => {
    if (!currentPlayer || gameStatus !== "playing") return;

    const nextSkippedPlayerIds = [...skippedPlayerIds, currentPlayer.id];
    advanceGame(picks, playerIndex + 1, nextSkippedPlayerIds);
    setMessage(`${copy.skippedLabel}: ${currentPlayer.nickname}.`);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#1a082a] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(78,70,229,0.28),_transparent_34rem)]">
        <nav className="border-b border-white/10 bg-[#1b0734]/95">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
            <div className="flex items-center gap-4 text-white">
              <Menu className="h-6 w-6" />
              <HelpCircle className="h-5 w-5" />
            </div>
            <div className="text-center text-2xl font-black uppercase tracking-tight text-white">CS BINGO</div>
            <div className="flex items-center gap-3 text-white">
              <label className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-xs text-white/80 ring-1 ring-white/10">
                <Globe2 className="h-4 w-4" />
                <span className="sr-only">{copy.selectLanguage}</span>
                <select
                  value={language}
                  onChange={(event) => handleLanguageChange(event.target.value as Language)}
                  className="bg-transparent text-xs font-bold outline-none"
                  aria-label={copy.selectLanguage}
                >
                  {Object.entries(translations).map(([key, value]) => (
                    <option key={key} value={key} className="bg-[#1b0734] text-white">
                      {value.languageName}
                    </option>
                  ))}
                </select>
              </label>
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
        </nav>

        <div className="bg-[#3f37a8] px-4 py-2 text-center text-sm text-white/90">
          Counter-Strike bingo • {copy.puzzleDate}: <span className="font-bold text-lime-300">{dateKey}</span>
        </div>

        <section className="mx-auto flex w-full max-w-[520px] flex-col px-4 py-6 sm:py-8">
          <div className="overflow-hidden rounded-lg bg-[#3d37a8] shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-4">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-2xl font-black text-[#1a082a]">
                  {namesLeft}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black uppercase leading-none text-white/85">{copy.currentPlayerEyebrow}</p>
                  {currentPlayer ? (
                    <>
                      <h1 className="truncate text-3xl font-black uppercase leading-none tracking-tight text-white">{currentPlayer.nickname}</h1>
                      <p className="mt-1 truncate text-xs font-bold uppercase text-white/55">{currentPlayer.fullName}</p>
                    </>
                  ) : (
                    <h1 className="text-2xl font-black uppercase leading-none tracking-tight text-white">{copy.noCurrentPlayerTitle}</h1>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <button
                  type="button"
                  onClick={handleSkip}
                  disabled={gameStatus !== "playing"}
                  className="inline-flex items-center gap-1 text-xl font-black uppercase text-white transition hover:text-lime-300 disabled:cursor-not-allowed disabled:text-white/30"
                >
                  {copy.skip} <SkipForward className="h-5 w-5 fill-current" />
                </button>
                <span className="text-xs font-bold uppercase text-white/45">{Math.max(namesLeft - 1, 0)} {copy.remaining}</span>
              </div>
            </div>

            <div
              key={flashKey}
              className={`grid grid-cols-4 bg-[#30233e] ${flashKey > 0 ? "animate-bingo-error" : ""}`}
            >
              <div className="grid min-h-[84px] place-items-center border-b border-r border-[#4b3a5c] bg-[#3a2d48] p-2 text-center text-[10px] font-black uppercase leading-tight text-white/45 sm:min-h-[98px]">
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

                    return (
                      <button
                        key={cellKey}
                        type="button"
                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                        disabled={gameStatus !== "playing" || Boolean(pick?.correct)}
                        aria-label={`${rowCopy.label} + ${columnCopy.label}`}
                        className={`group grid min-h-[84px] place-items-center border-b border-r border-[#4b3a5c] p-2 text-center transition hover:bg-[#5a4869] disabled:cursor-not-allowed sm:min-h-[98px] ${
                          pick?.correct ? "bg-emerald-500/30" : "bg-[#453752]"
                        }`}
                      >
                        {pick ? (
                          <div className="space-y-1">
                            <Check className="mx-auto h-5 w-5 text-lime-300" />
                            <p className="break-words text-sm font-black uppercase leading-none text-white sm:text-base">{pick.player.nickname}</p>
                            <p className="hidden text-[10px] font-bold uppercase leading-tight text-white/50 sm:block">{copy.matchedBy}</p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <p className="break-words text-sm font-black uppercase leading-tight text-white sm:text-base">{rowCopy.label}</p>
                            <p className="text-[10px] font-black uppercase text-lime-300/90">+ {columnCopy.label}</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm font-black uppercase text-white/80">
            <button type="button" onClick={handleReset} className="inline-flex items-center gap-2 transition hover:text-lime-300">
              <RotateCcw className="h-4 w-4" /> {copy.reset}
            </button>
            <span className="text-white/45">#{hashDate(dateKey)}</span>
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs font-black uppercase text-white/45">{copy.progress}</p>
                <p className="mt-1 text-3xl font-black text-lime-300">{completedCells}<span className="text-base text-white/45"> / 9</span></p>
              </div>
              <div className="rounded-lg bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs font-black uppercase text-white/45">{copy.namesLeft}</p>
                <p className="mt-1 text-3xl font-black text-lime-300">{namesLeft}</p>
              </div>
            </div>

            {isCompleted ? (
              <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-100">
                <Trophy className="mb-2 h-5 w-5" />
                {copy.completed}
              </div>
            ) : gameStatus === "out-of-names" ? (
              <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-red-100">
                <X className="mb-2 h-5 w-5" />
                {copy.outOfNames}
              </div>
            ) : null}

            <p
              className={`rounded-lg px-4 py-3 leading-6 ring-1 ${
                message.includes("não combina") || message.includes("does not match") || message.includes("no combina") || gameStatus === "out-of-names"
                  ? "bg-red-500/10 text-red-100 ring-red-400/30"
                  : "bg-[#3f37a8]/50 text-white ring-white/10"
              }`}
            >
              {gameStatus === "out-of-names" && !isCompleted ? copy.outOfNamesMessage : message}
            </p>

            {latestSkippedPlayer ? (
              <p className="rounded-lg bg-white/5 px-4 py-3 text-white/70 ring-1 ring-white/10">
                {copy.skippedLabel}: <strong className="text-white">{latestSkippedPlayer.nickname}</strong>
              </p>
            ) : null}

            <div className="rounded-lg bg-white/5 p-4 text-white/70 ring-1 ring-white/10">
              <p className="font-black uppercase text-white">Technical area</p>
              <p className="mt-2 leading-6">{copy.currentPlayerInstructions}</p>
              <p className="mt-2 leading-6">{copy.wrongPenalty}.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function CriterionHeader({ criterion, axis, language }: { criterion: BingoCriterion; axis: string; language: Language }) {
  const criterionCopy = getCriterionCopy(criterion, language);

  return (
    <div className="grid min-h-[84px] place-items-center border-b border-r border-[#4b3a5c] bg-[#3f314d] p-2 text-center sm:min-h-[98px]">
      <div className="space-y-1">
        <p className="text-[9px] font-black uppercase tracking-wide text-lime-300/80">{axis}</p>
        <h3 className="break-words text-sm font-black uppercase leading-tight text-white sm:text-base">{criterionCopy.label}</h3>
        <p className="hidden text-[10px] font-bold uppercase leading-tight text-white/45 sm:block">{criterionCopy.helper}</p>
      </div>
    </div>
  );
}
