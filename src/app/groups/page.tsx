"use client";

import { useMemo, useState } from "react";
import { Heart, Shuffle, Share2, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import { getCountryName } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { ArchiveBanner, ArchiveLink } from "@/components/daily/ArchiveBanner";
import { NextPuzzleCountdown } from "@/components/daily/NextPuzzleCountdown";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { getPreviousDateKey, getPuzzleNumber, hashDate } from "@/lib/daily";
import { GROUP_COUNT, GROUP_SIZE, MIN_MAJORS, MIN_TOP20_YEARS, createGroupsPuzzle } from "@/lib/groups";
import type { GroupCriterion, PuzzleGroup } from "@/lib/groups";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useDailyDate } from "@/lib/useDailyDate";
import { useHydrated } from "@/lib/useHydrated";

const MAX_MISTAKES = 4;
const GAME_KEY_PREFIX = "cs-groups-daily-v1";
const STATS_KEY = "cs-groups-stats";

type PlayerStats = { played: number; wins: number; currentStreak: number; maxStreak: number; lastPlayedDate?: string };
const emptyStats: PlayerStats = { played: 0, wins: 0, currentStreak: 0, maxStreak: 0 };

// Cores por dificuldade, do grupo mais fácil ao mais difícil (a mesma ordem do sorteio).
const groupTones = [
  "bg-[#6b5a1e] text-[#fbe9a8]",
  "bg-[#2f5a2a] text-[#d7f0c8]",
  "bg-[#24476b] text-[#cfe4fb]",
  "bg-[#4f2f6b] text-[#e8d4fb]",
];
const groupEmoji = ["🟨", "🟩", "🟦", "🟪"];

const groupsCopy = {
  pt: {
    eyebrow: "Agrupe os 16",
    title: "Agrupe os 16",
    intro: `16 pro players escondem ${GROUP_COUNT} grupos de ${GROUP_SIZE} com algo em comum: um time, um país, uma função ou um feito. Selecione ${GROUP_SIZE} e envie. São ${MAX_MISTAKES} erros e um desafio por dia.`,
    pick: (count: number) => `Selecione ${GROUP_SIZE} jogadores (${count}/${GROUP_SIZE})`,
    submit: "Enviar",
    shuffle: "Embaralhar",
    clear: "Limpar",
    mistakes: "Erros restantes",
    oneAway: "Quase! 3 de 4 estão no mesmo grupo.",
    wrong: "Não é um grupo.",
    repeated: "Você já tentou esse grupo.",
    won: "Todos os grupos!",
    lost: "Acabaram as tentativas",
    criterion: (criterion: GroupCriterion, language: Language) => {
      switch (criterion.kind) {
        case "team":
          return `Passaram por ${getTeamName(criterion.value)}`;
        case "country":
          return `Nacionalidade: ${getCountryName(criterion.value, language)}`;
        case "role":
          return `Função: ${criterion.value}`;
        case "mvp":
          return "MVPs de Major";
        case "majors":
          return `${MIN_MAJORS}+ títulos de Major`;
        case "top20":
          return `${MIN_TOP20_YEARS}+ anos no Top 20 da HLTV`;
      }
    },
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
    eyebrow: "Sort the 16",
    title: "Sort the 16",
    intro: `16 pro players hide ${GROUP_COUNT} groups of ${GROUP_SIZE} with something in common: a team, a country, a role or an achievement. Select ${GROUP_SIZE} and submit. ${MAX_MISTAKES} mistakes and one challenge per day.`,
    pick: (count: number) => `Select ${GROUP_SIZE} players (${count}/${GROUP_SIZE})`,
    submit: "Submit",
    shuffle: "Shuffle",
    clear: "Clear",
    mistakes: "Mistakes left",
    oneAway: "So close! 3 of 4 are in the same group.",
    wrong: "Not a group.",
    repeated: "You already tried that group.",
    won: "All groups found!",
    lost: "Out of tries",
    criterion: (criterion: GroupCriterion, language: Language) => {
      switch (criterion.kind) {
        case "team":
          return `Played for ${getTeamName(criterion.value)}`;
        case "country":
          return `Nationality: ${getCountryName(criterion.value, language)}`;
        case "role":
          return `Role: ${criterion.value}`;
        case "mvp":
          return "Major MVPs";
        case "majors":
          return `${MIN_MAJORS}+ Major titles`;
        case "top20":
          return `${MIN_TOP20_YEARS}+ years in the HLTV Top 20`;
      }
    },
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
    eyebrow: "Agrupa los 16",
    title: "Agrupa los 16",
    intro: `16 pro players esconden ${GROUP_COUNT} grupos de ${GROUP_SIZE} con algo en común: un equipo, un país, un rol o un logro. Selecciona ${GROUP_SIZE} y envía. ${MAX_MISTAKES} errores y un desafío por día.`,
    pick: (count: number) => `Selecciona ${GROUP_SIZE} jugadores (${count}/${GROUP_SIZE})`,
    submit: "Enviar",
    shuffle: "Mezclar",
    clear: "Limpiar",
    mistakes: "Errores restantes",
    oneAway: "¡Casi! 3 de 4 están en el mismo grupo.",
    wrong: "No es un grupo.",
    repeated: "Ya probaste ese grupo.",
    won: "¡Todos los grupos!",
    lost: "Se acabaron los intentos",
    criterion: (criterion: GroupCriterion, language: Language) => {
      switch (criterion.kind) {
        case "team":
          return `Pasaron por ${getTeamName(criterion.value)}`;
        case "country":
          return `Nacionalidad: ${getCountryName(criterion.value, language)}`;
        case "role":
          return `Rol: ${criterion.value}`;
        case "mvp":
          return "MVPs de Major";
        case "majors":
          return `${MIN_MAJORS}+ títulos de Major`;
        case "top20":
          return `${MIN_TOP20_YEARS}+ años en el Top 20 de HLTV`;
      }
    },
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

type GroupsCopy = (typeof groupsCopy)["pt"];

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

const nicknameOf = (id: string) => csPlayers.find((player) => player.id === id)?.nickname ?? id;
const sameSet = (a: string[], b: string[]) => a.length === b.length && a.every((id) => b.includes(id));
// Índice do grupo que a tentativa acertou em cheio, ou -1.
const solvedGroupOf = (groups: PuzzleGroup[], attempt: string[]) => groups.findIndex((group) => sameSet(group.playerIds, attempt));

export default function GroupsPage() {
  const language = useLanguage();
  const copy = groupsCopy[language];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();
  const { dateKey, archived } = useDailyDate();

  // A data e o progresso salvo só existem no navegador: o servidor manda o título e a explicação.
  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-xl flex-col gap-3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{copy.title}</h1>
        <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </main>
    );
  }

  // A chave troca o jogo inteiro ao navegar entre hoje e um dia do arquivo.
  return <GroupsGame key={dateKey} copy={copy} language={language} dateKey={dateKey} archived={archived} />;
}

function GroupsGame({
  copy,
  language,
  dateKey,
  archived,
}: {
  copy: GroupsCopy;
  language: Language;
  dateKey: string;
  archived: boolean;
}) {
  const gameKey = `${GAME_KEY_PREFIX}-${dateKey}`;
  const puzzle = useMemo(() => createGroupsPuzzle(dateKey), [dateKey]);
  const [attempts, setAttempts] = useState<string[][]>(() => readJson<{ attempts: string[][] }>(gameKey, { attempts: [] }).attempts);
  const [stats, setStats] = useState<PlayerStats>(() => readJson(STATS_KEY, emptyStats));
  const [order, setOrder] = useState(puzzle.tiles);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string>();
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();

  const solved = attempts.map((attempt) => solvedGroupOf(puzzle.groups, attempt)).filter((index) => index >= 0);
  const mistakes = attempts.length - solved.length;
  const won = solved.length === GROUP_COUNT;
  const isOver = won || mistakes >= MAX_MISTAKES;
  // No fim, os grupos que faltaram aparecem na ordem de dificuldade.
  const shownGroups = isOver ? [...solved, ...puzzle.groups.map((_, index) => index).filter((index) => !solved.includes(index))] : solved;
  const solvedIds = new Set(shownGroups.flatMap((index) => puzzle.groups[index].playerIds));
  const remaining = order.filter((id) => !solvedIds.has(id));
  const partner = useMemo(() => getPartnerFor("post-game", dateKey, hashDate(dateKey)), [dateKey]);

  const toggle = (id: string) => {
    setFeedback(undefined);
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : current.length < GROUP_SIZE ? [...current, id] : current
    );
  };

  const submit = () => {
    if (selected.length !== GROUP_SIZE || isOver) return;
    if (attempts.some((attempt) => sameSet(attempt, selected))) {
      setFeedback(copy.repeated);
      return;
    }
    const nextAttempts = [...attempts, selected];
    setAttempts(nextAttempts);
    writeJson(gameKey, { attempts: nextAttempts });
    const hit = solvedGroupOf(puzzle.groups, selected) >= 0;
    const closest = Math.max(...puzzle.groups.map((group) => selected.filter((id) => group.playerIds.includes(id)).length));
    setFeedback(hit ? undefined : closest === GROUP_SIZE - 1 ? copy.oneAway : copy.wrong);
    if (hit) setSelected([]);

    const nextSolved = nextAttempts.filter((attempt) => solvedGroupOf(puzzle.groups, attempt) >= 0).length;
    const nextWon = nextSolved === GROUP_COUNT;
    if (!archived && (nextWon || nextAttempts.length - nextSolved >= MAX_MISTAKES)) {
      const nextStats = recordGame(stats, dateKey, nextWon);
      setStats(nextStats);
      writeJson(STATS_KEY, nextStats);
    }
  };

  const groupIndexOf = (id: string) => puzzle.groups.findIndex((group) => group.playerIds.includes(id));

  const handleShare = async () => {
    const shareText = [
      `CS Games · ${copy.eyebrow} #${getPuzzleNumber(dateKey)}`,
      `${solved.length}/${GROUP_COUNT} · 🔥 ${stats.currentStreak}`,
      ...attempts.map((attempt) => attempt.map((id) => groupEmoji[groupIndexOf(id)]).join("")),
      `${window.location.origin}/groups${archived ? `?date=${dateKey}` : ""}`,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  return (
    <main className="mx-auto flex min-h-full w-full max-w-xl flex-col gap-3 px-4 py-4 sm:gap-4">
      {archived ? <ArchiveBanner dateKey={dateKey} path="/groups" /> : null}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
          {copy.eyebrow} · #{getPuzzleNumber(dateKey)}
        </p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{copy.title}</h1>
      </div>

      <div className="space-y-1.5">
        {shownGroups.map((index) => {
          const group = puzzle.groups[index];
          return (
            <div key={index} className={`cs-cut-sm px-3 py-2 text-center ${groupTones[index]}`}>
              <p className="text-sm font-bold uppercase tracking-wider">{copy.criterion(group.criterion, language)}</p>
              <p className="text-xs font-semibold uppercase tracking-wide opacity-80">{group.playerIds.map(nicknameOf).join(" · ")}</p>
            </div>
          );
        })}

        {remaining.length ? (
          <ul className="grid grid-cols-4 gap-1.5">
            {remaining.map((id) => {
              const active = selected.includes(id);
              return (
                <li key={id}>
                  <button
                    type="button"
                    onClick={() => toggle(id)}
                    aria-pressed={active}
                    className={`cs-cut-sm flex h-16 w-full items-center justify-center break-all px-1 text-center text-xs font-bold uppercase leading-tight tracking-wide transition sm:h-20 sm:text-base ${
                      active ? "bg-cs-orange text-cs-bg" : "bg-cs-raised text-cs-text hover:bg-cs-line"
                    }`}
                  >
                    {nicknameOf(id)}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {!isOver ? (
        <>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-cs-text/60">{copy.pick(selected.length)}</p>
            <div className="flex items-center gap-1.5" aria-label={`${copy.mistakes}: ${MAX_MISTAKES - mistakes}`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{copy.mistakes}</span>
              {Array.from({ length: MAX_MISTAKES }, (_, heart) => (
                <Heart key={heart} className={`h-4 w-4 ${heart < MAX_MISTAKES - mistakes ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
              ))}
            </div>
          </div>
          {feedback ? <p className="text-center text-sm font-bold uppercase tracking-wider text-cs-gold">{feedback}</p> : null}
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setOrder((current) => [...current].sort(() => Math.random() - 0.5))}
              className="cs-cut-sm inline-flex items-center justify-center gap-1.5 bg-cs-surface px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-cs-text/80 transition hover:text-cs-orange"
            >
              <Shuffle className="h-4 w-4" /> {copy.shuffle}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelected([]);
                setFeedback(undefined);
              }}
              disabled={!selected.length}
              className="cs-cut-sm inline-flex items-center justify-center gap-1.5 bg-cs-surface px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-cs-text/80 transition hover:text-cs-orange disabled:opacity-40"
            >
              <X className="h-4 w-4" /> {copy.clear}
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={selected.length !== GROUP_SIZE}
              className="cs-cut-sm bg-cs-orange px-3 py-2.5 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a] disabled:opacity-40"
            >
              {copy.submit}
            </button>
          </div>
        </>
      ) : (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-4 text-center">
            {won ? <Trophy className="mx-auto h-8 w-8 text-cs-orange" /> : <X className="mx-auto h-8 w-8 text-cs-red" />}
            <h2 className="text-3xl font-bold uppercase tracking-wider">{won ? copy.won : copy.lost}</h2>
            <p className="text-xl leading-tight tracking-wide" aria-hidden="true">
              {attempts.map((attempt, row) => (
                <span key={row} className="block">
                  {attempt.map((id) => groupEmoji[groupIndexOf(id)]).join("")}
                </span>
              ))}
            </p>
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
              <ArchiveLink path="/groups" />
            </div>
          </div>
        </div>
      )}

      {isOver ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
    </main>
  );
}
