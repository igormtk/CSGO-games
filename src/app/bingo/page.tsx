"use client";

import { Fragment, useMemo, useState } from "react";
import { Check, RotateCcw, Search, Trophy, X } from "lucide-react";
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

type CellPick = {
  player: CsPlayer;
  correct: boolean;
};

type GameBoard = {
  rows: BingoCriterion[];
  columns: BingoCriterion[];
};

type SelectedCell = {
  rowIndex: number;
  columnIndex: number;
} | null;

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

const getStoredPicks = (dateKey: string) => {
  if (typeof window === "undefined") return {};

  const rawPicks = window.localStorage.getItem(`${GAME_KEY_PREFIX}-${dateKey}`);
  if (!rawPicks) return {};

  try {
    const parsedPicks = JSON.parse(rawPicks) as Record<string, string>;
    return Object.entries(parsedPicks).reduce<Record<string, CellPick>>((acc, [cellKey, playerId]) => {
      const player = csPlayers.find((candidate) => candidate.id === playerId);
      if (player) {
        acc[cellKey] = { player, correct: true };
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const savePicks = (dateKey: string, picks: Record<string, CellPick>) => {
  const storablePicks = Object.entries(picks).reduce<Record<string, string>>((acc, [cellKey, pick]) => {
    if (pick.correct) {
      acc[cellKey] = pick.player.id;
    }
    return acc;
  }, {});

  window.localStorage.setItem(`${GAME_KEY_PREFIX}-${dateKey}`, JSON.stringify(storablePicks));
};

const formatPlayerMeta = (player: CsPlayer) => {
  const teams = player.teams.map(getTeamName).join(", ");
  return `${player.fullName} • ${player.nationality} • ${teams}`;
};

export default function BingoPage() {
  const dateKey = useMemo(() => getUtcDateKey(), []);
  const board = useMemo(() => createDailyBoard(dateKey), [dateKey]);
  const [selectedCell, setSelectedCell] = useState<SelectedCell>(null);
  const [search, setSearch] = useState("");
  const [picks, setPicks] = useState<Record<string, CellPick>>(() => getStoredPicks(dateKey));
  const [message, setMessage] = useState("Escolha uma casa e selecione um jogador que combine com linha + coluna.");

  const completedCells = Object.values(picks).filter((pick) => pick.correct).length;
  const isCompleted = completedCells === GRID_SIZE * GRID_SIZE;

  const selectedRow = selectedCell ? board.rows[selectedCell.rowIndex] : null;
  const selectedColumn = selectedCell ? board.columns[selectedCell.columnIndex] : null;

  const filteredPlayers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return csPlayers;

    return csPlayers.filter((player) => {
      const searchableText = [
        player.nickname,
        player.fullName,
        player.nationality,
        player.region,
        ...player.roles,
        ...player.teams.map(getTeamName),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [search]);

  const handleCellClick = (rowIndex: number, columnIndex: number) => {
    setSelectedCell({ rowIndex, columnIndex });
    setSearch("");
    setMessage("Agora escolha o pro player que satisfaz os dois critérios.");
  };

  const handlePlayerPick = (player: CsPlayer) => {
    if (!selectedCell || !selectedRow || !selectedColumn) return;

    const cellKey = getCellKey(selectedCell.rowIndex, selectedCell.columnIndex);
    const correct = playerMatchesCell(player, selectedRow, selectedColumn);

    if (!correct) {
      setPicks((currentPicks) => ({
        ...currentPicks,
        [cellKey]: { player, correct: false },
      }));
      setMessage(`${player.nickname} não combina com ${selectedRow.label} + ${selectedColumn.label}. Tente outro nome.`);
      return;
    }

    setPicks((currentPicks) => {
      const nextPicks = {
        ...currentPicks,
        [cellKey]: { player, correct: true },
      };
      savePicks(dateKey, nextPicks);
      return nextPicks;
    });
    setMessage(`Boa! ${player.nickname} preenche ${selectedRow.label} + ${selectedColumn.label}.`);
    setSelectedCell(null);
    setSearch("");
  };

  const handleReset = () => {
    window.localStorage.removeItem(`${GAME_KEY_PREFIX}-${dateKey}`);
    setPicks({});
    setSelectedCell(null);
    setSearch("");
    setMessage("Cartela reiniciada. Escolha uma casa para começar de novo.");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#090b10] text-slate-100">
      <section className="relative mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.25),_transparent_60%)]" />

        <header className="relative z-10 grid gap-6 rounded-3xl border border-orange-500/20 bg-slate-950/80 p-6 shadow-2xl shadow-orange-950/30 backdrop-blur md:grid-cols-[1.4fr_0.6fr] md:p-8">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-3 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-orange-300">
              CS Bingo Daily
            </div>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl">
                Complete a cartela com lendas do Counter-Strike
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                Inspirado no bingo diário de futebol: cada casa cruza um critério da linha com um da coluna. Acerte um jogador que satisfaça os dois e tente fechar as 9 casas do dia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="rounded-full bg-slate-900 px-4 py-2 ring-1 ring-white/10">Puzzle UTC: {dateKey}</span>
              <span className="rounded-full bg-slate-900 px-4 py-2 ring-1 ring-white/10">Jogadores no banco: {csPlayers.length}</span>
              <span className="rounded-full bg-slate-900 px-4 py-2 ring-1 ring-white/10">Times no banco: {csTeams.length}</span>
            </div>
          </div>

          <aside className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Progresso</p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-5xl font-black text-orange-300">{completedCells}</span>
                <span className="pb-2 text-slate-400">/ 9 casas</span>
              </div>
            </div>
            {isCompleted ? (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-emerald-200">
                <Trophy className="mb-2 h-6 w-6" />
                Bingo completo! Amanhã tem uma nova cartela.
              </div>
            ) : (
              <Button onClick={handleReset} variant="outline" className="border-orange-300/40 bg-transparent text-orange-100 hover:bg-orange-500/20">
                <RotateCcw className="h-4 w-4" /> Reiniciar tentativa
              </Button>
            )}
          </aside>
        </header>

        <section className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-3 shadow-2xl shadow-black/30 sm:p-5">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500 sm:p-4">
                Linha x Coluna
              </div>
              {board.columns.map((criterion) => (
                <CriterionHeader key={criterion.id} criterion={criterion} axis="coluna" />
              ))}

              {board.rows.map((row, rowIndex) => (
                <Fragment key={row.id}>
                  <CriterionHeader criterion={row} axis="linha" />
                  {board.columns.map((column, columnIndex) => {
                    const cellKey = getCellKey(rowIndex, columnIndex);
                    const pick = picks[cellKey];
                    const isActive = selectedCell?.rowIndex === rowIndex && selectedCell?.columnIndex === columnIndex;

                    return (
                      <button
                        key={cellKey}
                        type="button"
                        onClick={() => handleCellClick(rowIndex, columnIndex)}
                        className={`group min-h-32 rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-orange-300/70 hover:bg-orange-500/10 sm:min-h-40 sm:p-4 ${
                          pick?.correct
                            ? "border-emerald-400/40 bg-emerald-500/10"
                            : pick && !pick.correct
                              ? "border-red-400/40 bg-red-500/10"
                              : isActive
                                ? "border-orange-300 bg-orange-500/15"
                                : "border-slate-800 bg-slate-900/70"
                        }`}
                      >
                        <div className="flex h-full flex-col justify-between gap-3">
                          <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                            <span>{row.label}</span>
                            <span>+</span>
                            <span>{column.label}</span>
                          </div>

                          {pick ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {pick.correct ? (
                                  <Check className="h-5 w-5 text-emerald-300" />
                                ) : (
                                  <X className="h-5 w-5 text-red-300" />
                                )}
                                <span className="text-xl font-black text-white">{pick.player.nickname}</span>
                              </div>
                              <p className="text-xs leading-5 text-slate-300">{pick.player.fullName}</p>
                            </div>
                          ) : (
                            <div>
                              <p className="text-lg font-bold text-white">Selecionar jogador</p>
                              <p className="mt-1 text-xs leading-5 text-slate-400">Clique para buscar no banco de jogadores.</p>
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
                <p className="text-sm uppercase tracking-[0.25em] text-orange-300">Banco de dados</p>
                <h2 className="mt-2 text-2xl font-black text-white">Jogadores e times</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  A base local guarda nacionalidade, funções, histórico de times e conquistas para validar automaticamente cada resposta.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-200">
                {selectedRow && selectedColumn ? (
                  <>
                    <p className="font-bold text-white">Casa selecionada</p>
                    <p className="mt-2 text-slate-300">{selectedRow.helper}</p>
                    <p className="text-slate-300">{selectedColumn.helper}</p>
                  </>
                ) : (
                  <p>Selecione uma casa para filtrar mentalmente por linha + coluna.</p>
                )}
              </div>

              <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar jogador, país, role ou time"
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                />
              </div>

              <p className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${message.includes("não combina") ? "border-red-400/30 bg-red-500/10 text-red-100" : "border-orange-400/20 bg-orange-500/10 text-orange-100"}`}>
                {message}
              </p>

              <div className="max-h-[560px] space-y-2 overflow-y-auto pr-2">
                {filteredPlayers.map((player) => (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => handlePlayerPick(player)}
                    disabled={!selectedCell}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-left transition hover:border-orange-300/60 hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-black text-white">{player.nickname}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-400">{formatPlayerMeta(player)}</p>
                      </div>
                      <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-300">
                        {player.active ? "Ativo" : "Lenda"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}

function CriterionHeader({ criterion, axis }: { criterion: BingoCriterion; axis: "linha" | "coluna" }) {
  return (
    <div className="rounded-2xl border border-orange-400/20 bg-gradient-to-br from-slate-900 to-slate-950 p-3 text-center shadow-inner shadow-orange-950/20 sm:p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-300">{axis}</p>
      <h3 className="mt-2 text-base font-black text-white sm:text-xl">{criterion.label}</h3>
      <p className="mt-2 hidden text-xs leading-5 text-slate-400 sm:block">{criterion.helper}</p>
    </div>
  );
}
