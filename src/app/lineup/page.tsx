"use client";

import { useMemo, useState } from "react";
import { Heart, Search, Share2, Trophy, UserRound, X } from "lucide-react";
import { csPlayers, csTeams } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { ArchiveBanner, ArchiveLink } from "@/components/daily/ArchiveBanner";
import { NextPuzzleCountdown } from "@/components/daily/NextPuzzleCountdown";
import { PartnerBreakModal, useBreakSeen } from "@/components/partners/PartnerBreakModal";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getPreviousDateKey, getPuzzleNumber, hashDate, seededShuffle } from "@/lib/daily";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import { useDailyDate } from "@/lib/useDailyDate";
import { useHydrated } from "@/lib/useHydrated";

// Desafio diário: o time do dia é o mesmo para todo mundo; vale qualquer jogador da base que já
// tenha passado por ele.
const LINEUP_SIZE = 5;
const MAX_MISSES = 3;
// Só times com elenco grande na base: com poucos nomes possíveis o desafio vira adivinhação.
const MIN_PLAYERS = 8;
const MAX_SUGGESTIONS = 6;
const GAME_KEY_PREFIX = "cs-lineup-daily-v1";
const STATS_KEY = "cs-lineup-stats";
// Semente própria: a ordem dos times não segue a de nenhum outro jogo.
const ORDER_SEED = 4721;

type PlayerStats = { played: number; wins: number; currentStreak: number; maxStreak: number; lastPlayedDate?: string };
const emptyStats: PlayerStats = { played: 0, wins: 0, currentStreak: 0, maxStreak: 0 };

const lineupCopy = {
  pt: {
    eyebrow: "Escalação",
    title: "Monte a escalação",
    intro: `Um time por dia. Cite ${LINEUP_SIZE} pro players que já jogaram por ele, em qualquer época. Você pode errar ${MAX_MISSES} vezes.`,
    task: (team: string) => `Cite ${LINEUP_SIZE} jogadores que já passaram por ${team}`,
    placeholder: "Digite um nick",
    inputLabel: "Nick do jogador",
    noResults: "Nenhum jogador encontrado.",
    misses: "Erros",
    emptySlot: "Vaga aberta",
    won: "Escalação completa!",
    lost: "Faltou gente",
    allPlayers: (count: number) => `Os ${count} jogadores da nossa base que passaram pelo time:`,
    played: "Jogos",
    wins: "Vitórias",
    streak: "Sequência",
    share: "Compartilhar resultado",
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    nextChallenge: "Próximo desafio em",
    partnerLabel: "Publicidade",
  },
  en: {
    eyebrow: "Lineup",
    title: "Build the lineup",
    intro: `One team a day. Name ${LINEUP_SIZE} pro players who have played for it, from any era. You can miss ${MAX_MISSES} times.`,
    task: (team: string) => `Name ${LINEUP_SIZE} players who have played for ${team}`,
    placeholder: "Type a nickname",
    inputLabel: "Player nickname",
    noResults: "No player found.",
    misses: "Misses",
    emptySlot: "Open slot",
    won: "Lineup complete!",
    lost: "Not enough players",
    allPlayers: (count: number) => `The ${count} players in our database who played for the team:`,
    played: "Played",
    wins: "Wins",
    streak: "Streak",
    share: "Share result",
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    nextChallenge: "Next challenge in",
    partnerLabel: "Advertisement",
  },
  es: {
    eyebrow: "Alineación",
    title: "Arma la alineación",
    intro: `Un equipo por día. Nombra ${LINEUP_SIZE} pro players que hayan jugado en él, de cualquier época. Puedes fallar ${MAX_MISSES} veces.`,
    task: (team: string) => `Nombra ${LINEUP_SIZE} jugadores que hayan jugado en ${team}`,
    placeholder: "Escribe un nick",
    inputLabel: "Nick del jugador",
    noResults: "No se encontró ningún jugador.",
    misses: "Errores",
    emptySlot: "Puesto libre",
    won: "¡Alineación completa!",
    lost: "Faltaron jugadores",
    allPlayers: (count: number) => `Los ${count} jugadores de nuestra base que pasaron por el equipo:`,
    played: "Partidas",
    wins: "Victorias",
    streak: "Racha",
    share: "Compartir resultado",
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    nextChallenge: "Próximo desafío en",
    partnerLabel: "Publicidad",
  },
};

type LineupCopy = (typeof lineupCopy)["pt"];

const lineupTeams = csTeams.filter((team) => csPlayers.filter((player) => player.teams.includes(team.id)).length >= MIN_PLAYERS);
const teamOrder = seededShuffle(lineupTeams, ORDER_SEED);

const getLineupTeam = (dateKey: string) => {
  const puzzle = getPuzzleNumber(dateKey);
  return teamOrder[(((puzzle - 1) % teamOrder.length) + teamOrder.length) % teamOrder.length];
};

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Sem armazenamento (aba anônima): o jogo segue, só não salva.
  }
};

const recordGame = (stats: PlayerStats, dateKey: string, won: boolean): PlayerStats => {
  const currentStreak = won ? (stats.lastPlayedDate === getPreviousDateKey(dateKey) ? stats.currentStreak + 1 : 1) : 0;
  return {
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    lastPlayedDate: won ? dateKey : stats.lastPlayedDate,
  };
};

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

export default function LineupPage() {
  const copy = lineupCopy[useLanguage()];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();
  const { dateKey, archived } = useDailyDate();

  // A data e o progresso salvo só existem no navegador: o servidor manda o título e a explicação.
  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{copy.title}</h1>
        <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </main>
    );
  }

  // A chave troca o jogo inteiro ao navegar entre hoje e um dia do arquivo.
  return <LineupGame key={dateKey} copy={copy} dateKey={dateKey} archived={archived} />;
}

function LineupGame({ copy, dateKey, archived }: { copy: LineupCopy; dateKey: string; archived: boolean }) {
  const gameKey = `${GAME_KEY_PREFIX}-${dateKey}`;
  const team = useMemo(() => getLineupTeam(dateKey), [dateKey]);
  const roster = useMemo(() => csPlayers.filter((player) => player.teams.includes(team.id)), [team]);
  const [guessIds, setGuessIds] = useState<string[]>(() => readJson<{ guessIds: string[] }>(gameKey, { guessIds: [] }).guessIds);
  const [stats, setStats] = useState<PlayerStats>(() => readJson(STATS_KEY, emptyStats));
  const [search, setSearch] = useState("");
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();

  const isHit = (id: string) => roster.some((player) => player.id === id);
  const hits = guessIds.filter(isHit);
  const misses = guessIds.length - hits.length;
  const won = hits.length >= LINEUP_SIZE;
  const isOver = won || misses >= MAX_MISSES;
  const partner = useMemo(() => getPartnerFor("post-game", dateKey, hashDate(dateKey)), [dateKey]);
  const [breakSeen, markBreakSeen] = useBreakSeen(`${gameKey}-break`);
  const findPlayer = (id: string) => csPlayers.find((player) => player.id === id);

  const suggestions = useMemo(() => {
    const query = normalize(search.trim());
    if (!query) return [];
    return csPlayers
      .filter((player) => !guessIds.includes(player.id))
      .filter((player) => normalize(player.nickname).includes(query) || normalize(player.fullName).includes(query))
      .sort((a, b) => Number(normalize(b.nickname).startsWith(query)) - Number(normalize(a.nickname).startsWith(query)))
      .slice(0, MAX_SUGGESTIONS);
  }, [search, guessIds]);

  const handleGuess = (player: CsPlayer) => {
    if (isOver) return;
    const nextGuessIds = [...guessIds, player.id];
    setGuessIds(nextGuessIds);
    setSearch("");
    writeJson(gameKey, { guessIds: nextGuessIds });
    const nextHits = nextGuessIds.filter(isHit).length;
    const nextWon = nextHits >= LINEUP_SIZE;
    if (!archived && (nextWon || nextGuessIds.length - nextHits >= MAX_MISSES)) {
      const nextStats = recordGame(stats, dateKey, nextWon);
      setStats(nextStats);
      writeJson(STATS_KEY, nextStats);
    }
  };

  const handleShare = async () => {
    const shareText = [
      `CS Games · ${copy.eyebrow} #${getPuzzleNumber(dateKey)}`,
      `${team.name} · ${hits.length}/${LINEUP_SIZE} · 🔥 ${stats.currentStreak}`,
      guessIds.map((id) => (isHit(id) ? "🟩" : "🟥")).join(""),
      `${window.location.origin}/lineup${archived ? `?date=${dateKey}` : ""}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-3 px-4 py-4 sm:gap-4">
      {archived ? <ArchiveBanner dateKey={dateKey} path="/lineup" /> : null}
      <div className="flex items-center gap-3">
        <span className="cs-cut-sm grid h-16 w-16 shrink-0 place-items-center bg-cs-surface">
          <TeamBadge teamId={team.id} className="h-12 w-12" size={96} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
            {copy.eyebrow} · #{getPuzzleNumber(dateKey)}
          </p>
          <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{team.name}</h1>
          <p className="text-sm font-semibold text-cs-text/60">{copy.task(team.name)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <ol className="grid flex-1 grid-cols-5 gap-1.5" aria-label={copy.eyebrow}>
          {Array.from({ length: LINEUP_SIZE }, (_, slot) => {
            const player = hits[slot] ? findPlayer(hits[slot]) : undefined;
            return (
              <li
                key={slot}
                className={`cs-cut-sm flex h-20 flex-col items-center justify-center gap-1 px-1 text-center ${
                  player ? "border-b-4 border-cs-green bg-cs-surface" : "bg-cs-bg text-cs-text/30"
                }`}
                aria-label={player ? player.nickname : copy.emptySlot}
              >
                {player ? (
                  <>
                    <span className="text-lg leading-none">{getCountryFlag(player.nationality)}</span>
                    <span className="w-full truncate text-xs font-bold uppercase tracking-wide sm:text-sm">{player.nickname}</span>
                  </>
                ) : (
                  <UserRound className="h-6 w-6" />
                )}
              </li>
            );
          })}
        </ol>
        <div className="shrink-0 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{copy.misses}</p>
          <div className="mt-1 flex gap-0.5" aria-label={`${copy.misses}: ${misses}/${MAX_MISSES}`}>
            {Array.from({ length: MAX_MISSES }, (_, heart) => (
              <Heart key={heart} className={`h-5 w-5 ${heart < MAX_MISSES - misses ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
            ))}
          </div>
        </div>
      </div>

      {!isOver ? (
        <div className="relative">
          <div className="cs-cut-sm flex items-center gap-2 border-2 border-cs-line bg-cs-surface px-3 focus-within:border-cs-orange">
            <Search className="h-5 w-5 shrink-0 text-cs-text/40" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && suggestions[0]) handleGuess(suggestions[0]);
              }}
              placeholder={copy.placeholder}
              aria-label={copy.inputLabel}
              autoComplete="off"
              className="w-full bg-transparent py-3 text-lg font-bold uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-cs-text/35"
            />
          </div>
          {suggestions.length ? (
            <ul className="absolute inset-x-0 top-full z-20 mt-1 border-2 border-cs-line bg-cs-panel shadow-2xl shadow-black/60">
              {suggestions.map((player) => (
                <li key={player.id}>
                  <button
                    type="button"
                    onClick={() => handleGuess(player)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left transition hover:bg-cs-raised"
                  >
                    <span className="text-lg font-bold uppercase tracking-wide">{player.nickname}</span>
                    <span className="ml-auto text-lg leading-none">{getCountryFlag(player.nationality)}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : search.trim() ? (
            <p className="absolute inset-x-0 top-full z-20 mt-1 border-2 border-cs-line bg-cs-panel px-3 py-2 text-sm font-semibold text-cs-text/60">
              {copy.noResults}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-4 text-center">
            {won ? <Trophy className="mx-auto h-8 w-8 text-cs-orange" /> : <X className="mx-auto h-8 w-8 text-cs-red" />}
            <h2 className="text-3xl font-bold uppercase tracking-wider">{won ? copy.won : copy.lost}</h2>
            <p className="text-sm font-semibold text-cs-text/60">{copy.allPlayers(roster.length)}</p>
            <ul className="flex flex-wrap justify-center gap-1.5">
              {roster.map((player) => (
                <li
                  key={player.id}
                  className={`cs-cut-sm px-2 py-1 text-xs font-bold uppercase tracking-wide ${
                    guessIds.includes(player.id) ? "bg-[#203047] text-[#d7f0c8]" : "bg-cs-raised text-cs-text/70"
                  }`}
                >
                  {player.nickname}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: copy.played, value: stats.played },
                { label: copy.wins, value: stats.played ? `${Math.round((stats.wins / stats.played) * 100)}%` : "0%" },
                { label: copy.streak, value: stats.currentStreak },
              ].map((item) => (
                <div key={item.label} className="cs-cut-sm bg-cs-raised p-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{item.label}</p>
                  <p className="text-2xl font-bold leading-none">{item.value}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="cs-cut-sm inline-flex items-center justify-center gap-2 bg-cs-orange px-4 py-2.5 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
            >
              <Share2 className="h-4 w-4" /> {copy.share}
            </button>
            {shareStatus ? (
              <p className="text-sm font-semibold text-cs-text/70">{shareStatus === "copied" ? copy.copied : copy.copyFailed}</p>
            ) : null}
            <div className="space-y-2 border-t border-cs-line pt-3">
              {archived ? null : (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-text/45">{copy.nextChallenge}</p>
                  <NextPuzzleCountdown />
                </>
              )}
              <ArchiveLink path="/lineup" />
            </div>
          </div>
        </div>
      )}

      {guessIds.some((id) => !isHit(id)) ? (
        <ul className="flex flex-wrap gap-2">
          {guessIds
            .filter((id) => !isHit(id))
            .map((id) => (
              <li
                key={id}
                className="cs-cut-sm inline-flex items-center gap-1.5 border-l-4 border-cs-red bg-cs-surface px-3 py-1.5 text-sm font-bold uppercase text-cs-text/70"
              >
                <X className="h-4 w-4 text-cs-red" /> {findPlayer(id)?.nickname}
              </li>
            ))}
        </ul>
      ) : null}

      {isOver && breakSeen ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
      {isOver && !breakSeen ? <PartnerBreakModal partner={partner} onDone={markBreakSeen} /> : null}
    </main>
  );
}
