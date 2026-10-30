"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Lock, Search, Share2, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag, getCountryName } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { ArchiveBanner, ArchiveLink } from "@/components/daily/ArchiveBanner";
import { NextPuzzleCountdown } from "@/components/daily/NextPuzzleCountdown";
import Link from "@/components/LocalLink";
import { PartnerBreakModal } from "@/components/partners/PartnerBreakModal";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getPreviousDateKey, getPuzzleNumber, hashDate, seededShuffle } from "@/lib/daily";
import { getShareUrl, useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useDailyDate } from "@/lib/useDailyDate";
import { useHydrated } from "@/lib/useHydrated";

const MAX_GUESSES = 6;
// Times revelados de início; cada erro revela mais um, depois o país e por fim a função.
const START_REVEALED = 2;
const MIN_TEAMS = 4;
const MAX_SUGGESTIONS = 6;
const GAME_KEY_PREFIX = "cs-career-daily-v1";
const STATS_KEY = "cs-career-stats";
// Semente própria: a ordem dos alvos não coincide com a do jogador misterioso.
const ORDER_SEED = 9137;

type PlayerStats = { played: number; wins: number; currentStreak: number; maxStreak: number; lastPlayedDate?: string };
const emptyStats: PlayerStats = { played: 0, wins: 0, currentStreak: 0, maxStreak: 0 };

const careerCopy = {
  pt: {
    eyebrow: "Caminho de carreira",
    title: "De quem é essa carreira?",
    intro: `Os times de um pro player, em ordem. Começam ${START_REVEALED} revelados e cada erro mostra mais um; depois vêm o país e a função. São ${MAX_GUESSES} palpites e um desafio por dia.`,
    placeholder: (guess: number) => `Palpite ${guess} de ${MAX_GUESSES}: digite um nick`,
    inputLabel: "Nick do jogador",
    noResults: "Nenhum jogador encontrado.",
    country: "País",
    role: "Função",
    hiddenTeam: "Time escondido",
    wonIn: (guesses: number) => `Acertou em ${guesses}/${MAX_GUESSES}`,
    lost: "Não foi dessa vez",
    played: "Jogos",
    wins: "Vitórias",
    streak: "Sequência",
    share: "Compartilhar resultado",
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    nextChallenge: "Próximo desafio em",
    guesses: "Palpites",
    partnerLabel: "Publicidade",
    revealIn: (seconds: number) => `Resposta em ${seconds}s`,
    revealLabel: "Ver resposta",
  },
  en: {
    eyebrow: "Career path",
    title: "Whose career is this?",
    intro: `A pro player's teams, in order. ${START_REVEALED} start revealed and each miss shows one more; then come the country and the role. ${MAX_GUESSES} guesses and one challenge per day.`,
    placeholder: (guess: number) => `Guess ${guess} of ${MAX_GUESSES}: type a nickname`,
    inputLabel: "Player nickname",
    noResults: "No player found.",
    country: "Country",
    role: "Role",
    hiddenTeam: "Hidden team",
    wonIn: (guesses: number) => `Solved in ${guesses}/${MAX_GUESSES}`,
    lost: "Not this time",
    played: "Played",
    wins: "Wins",
    streak: "Streak",
    share: "Share result",
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    nextChallenge: "Next challenge in",
    guesses: "Guesses",
    partnerLabel: "Advertisement",
    revealIn: (seconds: number) => `Answer in ${seconds}s`,
    revealLabel: "See the answer",
  },
  es: {
    eyebrow: "Camino de carrera",
    title: "¿De quién es esta carrera?",
    intro: `Los equipos de un pro player, en orden. Empiezan ${START_REVEALED} revelados y cada error muestra uno más; después vienen el país y el rol. ${MAX_GUESSES} intentos y un desafío por día.`,
    placeholder: (guess: number) => `Intento ${guess} de ${MAX_GUESSES}: escribe un nick`,
    inputLabel: "Nick del jugador",
    noResults: "No se encontró ningún jugador.",
    country: "País",
    role: "Rol",
    hiddenTeam: "Equipo oculto",
    wonIn: (guesses: number) => `Acertaste en ${guesses}/${MAX_GUESSES}`,
    lost: "No fue esta vez",
    played: "Partidas",
    wins: "Victorias",
    streak: "Racha",
    share: "Compartir resultado",
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    nextChallenge: "Próximo desafío en",
    guesses: "Intentos",
    partnerLabel: "Publicidad",
    revealIn: (seconds: number) => `Respuesta en ${seconds}s`,
    revealLabel: "Ver la respuesta",
  },
} satisfies Record<Language, unknown>;

type CareerCopy = (typeof careerCopy)["pt"];

// Alvos conhecidos (Top 20 da HLTV ou campeão de Major) com carreira de pelo menos 4 times.
const careerTargets = csPlayers.filter(
  (player) => (player.hltvTop20Years.length > 0 || player.majorsWon > 0) && player.teams.length >= MIN_TEAMS
);
const targetOrder = seededShuffle(careerTargets, ORDER_SEED);

const getCareerTarget = (dateKey: string) => {
  const puzzle = getPuzzleNumber(dateKey);
  return targetOrder[(((puzzle - 1) % targetOrder.length) + targetOrder.length) % targetOrder.length];
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

export default function CareerPathPage() {
  const language = useLanguage();
  const copy = careerCopy[language];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();
  const { dateKey, archived } = useDailyDate();

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
  return <CareerGame key={dateKey} copy={copy} language={language} dateKey={dateKey} archived={archived} />;
}

function CareerGame({
  copy,
  language,
  dateKey,
  archived,
}: {
  copy: CareerCopy;
  language: Language;
  dateKey: string;
  archived: boolean;
}) {
  const gameKey = `${GAME_KEY_PREFIX}-${dateKey}`;
  const target = useMemo(() => getCareerTarget(dateKey), [dateKey]);
  const [guessIds, setGuessIds] = useState<string[]>(() => readJson<{ guessIds: string[] }>(gameKey, { guessIds: [] }).guessIds);
  const [stats, setStats] = useState<PlayerStats>(() => readJson(STATS_KEY, emptyStats));
  const [search, setSearch] = useState("");
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  // A resposta só aparece depois do anúncio de fim de jogo (igual ao bingo); fica salvo que já foi vista.
  const revealKey = `${gameKey}-revealed`;
  const [revealed, setRevealed] = useState(() => readJson<{ revealed: boolean }>(revealKey, { revealed: false }).revealed);

  const won = guessIds.includes(target.id);
  const misses = guessIds.length - (won ? 1 : 0);
  const isOver = won || guessIds.length >= MAX_GUESSES;
  // Depois do anúncio mostra tudo; antes, 2 times mais um por erro, depois país e função.
  const revealSteps = isOver && revealed ? Infinity : START_REVEALED + misses;
  const revealedTeams = Math.min(target.teams.length, revealSteps);
  const showCountry = revealSteps > target.teams.length;
  const showRole = revealSteps > target.teams.length + 1;
  const partner = useMemo(() => getPartnerFor("post-game", dateKey, hashDate(dateKey)), [dateKey]);

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
    const nextWon = player.id === target.id;
    if (!archived && (nextWon || nextGuessIds.length >= MAX_GUESSES)) {
      const nextStats = recordGame(stats, dateKey, nextWon);
      setStats(nextStats);
      writeJson(STATS_KEY, nextStats);
    }
  };

  const handleShare = async () => {
    const squares = guessIds.map((id) => (id === target.id ? "🟩" : "⬛")).join("");
    const shareText = [
      `CS Games · ${copy.eyebrow} #${getPuzzleNumber(dateKey)}`,
      `${won ? guessIds.length : "X"}/${MAX_GUESSES} · 🔥 ${stats.currentStreak}`,
      squares,
      getShareUrl(`/career-path${archived ? `?date=${dateKey}` : ""}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  const guessedPlayers = guessIds
    .map((id) => csPlayers.find((player) => player.id === id))
    .filter((player): player is CsPlayer => Boolean(player));

  return (
    <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-3 px-4 py-4 sm:gap-4">
      {archived ? <ArchiveBanner dateKey={dateKey} path="/career-path" /> : null}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
          {copy.eyebrow} · #{getPuzzleNumber(dateKey)}
        </p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{copy.title}</h1>
      </div>

      <ol className="cs-cut flex flex-wrap items-center gap-2 bg-cs-surface p-4" aria-label={copy.eyebrow}>
        {target.teams.map((teamId, index) => (
          <li key={teamId} className="flex items-center gap-2">
            {index < revealedTeams ? (
              <span className="cs-cut-sm flex flex-col items-center gap-1 bg-cs-raised px-3 py-2" title={getTeamName(teamId)}>
                <TeamBadge teamId={teamId} className="h-10 w-12" size={96} />
                <span className="max-w-24 truncate text-[11px] font-bold uppercase tracking-wide text-cs-text/70">
                  {getTeamName(teamId)}
                </span>
              </span>
            ) : (
              <span
                className="cs-cut-sm grid h-[74px] w-[72px] place-items-center bg-cs-bg text-cs-text/30"
                aria-label={copy.hiddenTeam}
              >
                <Lock className="h-5 w-5" />
              </span>
            )}
            {index < target.teams.length - 1 ? <ArrowRight className="h-4 w-4 shrink-0 text-cs-text/30" /> : null}
          </li>
        ))}
      </ol>

      {showCountry || showRole ? (
        <div className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-wide">
          {showCountry ? (
            <span className="cs-cut-sm border-l-4 border-cs-gold bg-cs-surface px-3 py-2">
              {copy.country}: {getCountryFlag(target.nationality)} {getCountryName(target.nationality, language)}
            </span>
          ) : null}
          {showRole ? (
            <span className="cs-cut-sm border-l-4 border-cs-gold bg-cs-surface px-3 py-2">
              {copy.role}: {target.roles.join(", ")}
            </span>
          ) : null}
        </div>
      ) : null}

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
              placeholder={copy.placeholder(guessIds.length + 1)}
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
      ) : !revealed ? (
        <PartnerBreakModal
          partner={partner}
          revealIn={copy.revealIn}
          revealLabel={copy.revealLabel}
          onDone={() => {
            setRevealed(true);
            writeJson(revealKey, { revealed: true });
          }}
        />
      ) : (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-4 text-center">
            {won ? <Trophy className="mx-auto h-8 w-8 text-cs-orange" /> : <X className="mx-auto h-8 w-8 text-cs-red" />}
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cs-text/60">{won ? copy.wonIn(guessIds.length) : copy.lost}</p>
            <h2 className="text-4xl font-bold uppercase leading-none tracking-wide">
              <Link href={`/players/${target.id}`} className="transition hover:text-cs-orange">
                {target.nickname}
              </Link>
            </h2>
            <p className="text-sm font-semibold text-cs-text/60">
              {getCountryFlag(target.nationality)} {target.fullName}
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
              <ArchiveLink path="/career-path" />
            </div>
          </div>
        </div>
      )}

      {guessedPlayers.length ? (
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cs-text/45">{copy.guesses}</p>
          <ul className="flex flex-wrap gap-2">
            {guessedPlayers.map((player) => (
              <li
                key={player.id}
                className={`cs-cut-sm inline-flex items-center gap-1.5 border-l-4 bg-cs-surface px-3 py-1.5 text-sm font-bold uppercase ${
                  player.id === target.id ? "border-cs-green text-cs-green" : "border-cs-red text-cs-text/70"
                }`}
              >
                {player.id === target.id ? <Check className="h-4 w-4" /> : <X className="h-4 w-4 text-cs-red" />}
                {player.nickname}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {isOver && revealed ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
    </main>
  );
}
