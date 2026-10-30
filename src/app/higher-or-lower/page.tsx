"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, Flame, Play, RotateCcw, Share2, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag, getCountryName } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getGameDateKey, hashDate } from "@/lib/daily";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useHydrated } from "@/lib/useHydrated";

// Modo infinito: cada rodada compara dois pro players num número da base. Acertou, o jogador de
// baixo sobe e um novo aparece; errou, acaba. Não é diário: dá para jogar quantas vezes quiser.
const STATS_KEY = "cs-higher-lower-stats";
const REVEAL_DELAY_MS = 1300;
// Jogadores que não voltam logo em seguida, para a partida não ficar repetitiva.
const RECENT_LIMIT = 12;

type CategoryId = "majors" | "top20" | "teams";
type Direction = "higher" | "lower";

const categories: Record<CategoryId, (player: CsPlayer) => number> = {
  majors: (player) => player.majorsWon,
  top20: (player) => player.hltvTop20Years.length,
  teams: (player) => player.teams.length,
};

type Round = { left: CsPlayer; right: CsPlayer; category: CategoryId };

type PlayerStats = { played: number; best: number };

const emptyStats: PlayerStats = { played: 0, best: 0 };

const unit = (one: string, many: string) => (value: number) => (value === 1 ? one : many);

const higherLowerCopy = {
  pt: {
    eyebrow: "Mais ou menos",
    title: "Quem tem mais?",
    intro:
      "Dois pro players lado a lado. O de cima mostra o número; diga se o de baixo tem mais ou menos. Cada acerto soma um na sequência, e um erro encerra a partida. Sem limite diário: jogue quantas vezes quiser.",
    start: "Começar",
    category: {
      majors: { label: "Títulos de Major", unit: unit("Major", "Majors") },
      top20: { label: "Anos no Top 20 da HLTV", unit: unit("ano", "anos") },
      teams: { label: "Times na carreira", unit: unit("time", "times") },
    },
    question: (name: string) => `${name} tem mais ou menos?`,
    higher: "Mais",
    lower: "Menos",
    streak: "Sequência",
    best: "Recorde",
    played: "Partidas",
    gameOver: "Fim de jogo",
    result: (score: number) => (score === 1 ? "Você acertou 1 seguida." : `Você acertou ${score} seguidas.`),
    newRecord: "Novo recorde!",
    again: "Jogar de novo",
    share: "Compartilhar resultado",
    shareLine: (score: number) => `🔥 ${score} acertos seguidos`,
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    noTeam: "Sem time",
    teamsNote: "Contamos os times principais da carreira, segundo o Liquipedia.",
    partnerLabel: "Publicidade",
  },
  en: {
    eyebrow: "Higher or lower",
    title: "Who has more?",
    intro:
      "Two pro players side by side. The top one shows the number; say whether the bottom one has more or less. Each right answer adds to your streak, and one miss ends the run. No daily limit: play as often as you like.",
    start: "Start",
    category: {
      majors: { label: "Major titles", unit: unit("Major", "Majors") },
      top20: { label: "Years in the HLTV Top 20", unit: unit("year", "years") },
      teams: { label: "Teams in career", unit: unit("team", "teams") },
    },
    question: (name: string) => `Does ${name} have more or less?`,
    higher: "Higher",
    lower: "Lower",
    streak: "Streak",
    best: "Best",
    played: "Played",
    gameOver: "Game over",
    result: (score: number) => (score === 1 ? "You got 1 in a row." : `You got ${score} in a row.`),
    newRecord: "New record!",
    again: "Play again",
    share: "Share result",
    shareLine: (score: number) => `🔥 ${score} in a row`,
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    noTeam: "No team",
    teamsNote: "We count the main teams of the career, according to Liquipedia.",
    partnerLabel: "Advertisement",
  },
  es: {
    eyebrow: "Más o menos",
    title: "¿Quién tiene más?",
    intro:
      "Dos pro players lado a lado. El de arriba muestra el número; di si el de abajo tiene más o menos. Cada acierto suma a tu racha y un error termina la partida. Sin límite diario: juega cuantas veces quieras.",
    start: "Empezar",
    category: {
      majors: { label: "Títulos de Major", unit: unit("Major", "Majors") },
      top20: { label: "Años en el Top 20 de HLTV", unit: unit("año", "años") },
      teams: { label: "Equipos en su carrera", unit: unit("equipo", "equipos") },
    },
    question: (name: string) => `¿${name} tiene más o menos?`,
    higher: "Más",
    lower: "Menos",
    streak: "Racha",
    best: "Récord",
    played: "Partidas",
    gameOver: "Fin del juego",
    result: (score: number) => (score === 1 ? "Acertaste 1 seguida." : `Acertaste ${score} seguidas.`),
    newRecord: "¡Nuevo récord!",
    again: "Jugar de nuevo",
    share: "Compartir resultado",
    shareLine: (score: number) => `🔥 ${score} aciertos seguidos`,
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    noTeam: "Sin equipo",
    teamsNote: "Contamos los equipos principales de la carrera, según Liquipedia.",
    partnerLabel: "Publicidad",
  },
} satisfies Record<Language, unknown>;

type HigherLowerCopy = (typeof higherLowerCopy)["pt"];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

// Sorteia a próxima comparação para o jogador de cima. Só entram categorias em que existe gente
// com mais e com menos que ele, e a direção é sorteada antes do adversário: assim "mais" e
// "menos" saem na mesma proporção e não há empate. Quem tem 0 Majors não vira "sempre mais".
const nextRound = (left: CsPlayer, recent: string[]): Round => {
  const pool = csPlayers.filter((player) => player.id !== left.id && !recent.includes(player.id));
  const options = (Object.keys(categories) as CategoryId[]).flatMap((category) => {
    const value = categories[category](left);
    const higher = pool.filter((player) => categories[category](player) > value);
    const lower = pool.filter((player) => categories[category](player) < value);
    return [
      ...(higher.length ? [{ category, candidates: higher, both: lower.length > 0 }] : []),
      ...(lower.length ? [{ category, candidates: lower, both: higher.length > 0 }] : []),
    ];
  });
  const balanced = options.filter((option) => option.both);
  const choice = pick(balanced.length ? balanced : options);
  return { left, right: pick(choice.candidates), category: choice.category };
};

const firstRound = () => nextRound(pick(csPlayers), []);

const readStats = (): PlayerStats => {
  try {
    const raw = window.localStorage.getItem(STATS_KEY);
    return raw ? { ...emptyStats, ...JSON.parse(raw) } : emptyStats;
  } catch {
    return emptyStats;
  }
};

const writeStats = (stats: PlayerStats) => {
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // Sem armazenamento (aba anônima): o jogo segue, só não guarda o recorde.
  }
};

export default function HigherOrLowerPage() {
  const language = useLanguage();
  const copy = higherLowerCopy[language];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();

  // O sorteio e o recorde só existem no navegador: o servidor manda o título e a explicação.
  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
        <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </main>
    );
  }

  return <HigherOrLowerGame copy={copy} language={language} />;
}

function HigherOrLowerGame({ copy, language }: { copy: HigherLowerCopy; language: Language }) {
  const [stats, setStats] = useState<PlayerStats>(readStats);
  const [phase, setPhase] = useState<"intro" | "playing" | "over">("intro");
  const [round, setRound] = useState<Round>(firstRound);
  const [recent, setRecent] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState<{ direction: Direction; correct: boolean }>();
  const [record, setRecord] = useState(false);
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  const partner = useMemo(() => {
    const dateKey = getGameDateKey();
    return getPartnerFor("post-game", dateKey, hashDate(dateKey));
  }, []);

  const start = () => {
    const opening = firstRound();
    setRound(opening);
    setRecent([opening.left.id]);
    setScore(0);
    setGuess(undefined);
    setRecord(false);
    setShareStatus(undefined);
    setPhase("playing");
  };

  const answer = (direction: Direction) => {
    if (guess) return;
    const value = categories[round.category];
    const correct = direction === "higher" ? value(round.right) > value(round.left) : value(round.right) < value(round.left);
    setGuess({ direction, correct });

    // O número do jogador de baixo aparece por um instante antes da próxima rodada (ou do fim).
    window.setTimeout(() => {
      setGuess(undefined);
      if (correct) {
        const nextRecent = [...recent, round.right.id].slice(-RECENT_LIMIT);
        setScore(score + 1);
        setRecent(nextRecent);
        setRound(nextRound(round.right, nextRecent));
        return;
      }
      const nextStats = { played: stats.played + 1, best: Math.max(stats.best, score) };
      setRecord(score > stats.best);
      setStats(nextStats);
      writeStats(nextStats);
      setPhase("over");
    }, REVEAL_DELAY_MS);
  };

  const handleShare = async () => {
    const shareText = [`CS Games · ${copy.eyebrow}`, copy.shareLine(score), `${window.location.origin}/higher-or-lower`].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  const category = copy.category[round.category];
  const leftValue = categories[round.category](round.left);
  const rightValue = categories[round.category](round.right);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-3 px-4 py-4 sm:gap-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: copy.streak, value: score, color: "text-cs-green" },
          { label: copy.best, value: Math.max(stats.best, phase === "over" ? 0 : score), color: "text-cs-orange" },
        ].map((stat) => (
          <div key={stat.label} className="cs-cut-sm bg-cs-surface p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{stat.label}</p>
            <p className={`mt-0.5 text-3xl font-bold leading-none ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {phase === "playing" ? (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut bg-cs-surface">
            <div className="border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-4 py-2.5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
              <h1 className="text-2xl font-bold uppercase leading-tight tracking-wide">{category.label}</h1>
              {round.category === "teams" ? <p className="text-xs font-semibold text-cs-text/45">{copy.teamsNote}</p> : null}
            </div>

            <div className="space-y-2 p-3">
              <PlayerCard player={round.left} language={language} copy={copy}>
                <p className="text-3xl font-bold leading-none text-cs-text">
                  {leftValue} <span className="text-base uppercase tracking-wider text-cs-text/55">{category.unit(leftValue)}</span>
                </p>
              </PlayerCard>

              <PlayerCard
                player={round.right}
                language={language}
                copy={copy}
                tone={guess ? (guess.correct ? "border-cs-green" : "border-cs-red") : "border-cs-orange"}
              >
                {guess ? (
                  <p className="flex items-center gap-2 text-3xl font-bold leading-none text-cs-text" aria-live="polite">
                    {rightValue} <span className="text-base uppercase tracking-wider text-cs-text/55">{category.unit(rightValue)}</span>
                    {guess.correct ? <Check className="h-7 w-7 text-cs-green" /> : <X className="h-7 w-7 text-cs-red" />}
                  </p>
                ) : (
                  <p className="text-sm font-bold uppercase tracking-wider text-cs-text/55">{copy.question(round.right.nickname)}</p>
                )}
              </PlayerCard>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {(
                  [
                    { direction: "higher", label: copy.higher, icon: ArrowUp },
                    { direction: "lower", label: copy.lower, icon: ArrowDown },
                  ] as const
                ).map((option) => {
                  const chosen = guess?.direction === option.direction;
                  const tone = !guess
                    ? "bg-cs-raised hover:bg-cs-line hover:text-cs-orange"
                    : chosen
                      ? guess.correct
                        ? "bg-[#203047] text-[#d7f0c8]"
                        : "bg-[#3a1f22] text-[#f6c9ca]"
                      : "bg-cs-raised opacity-50";
                  return (
                    <button
                      key={option.direction}
                      type="button"
                      onClick={() => answer(option.direction)}
                      disabled={Boolean(guess)}
                      className={`cs-cut-sm inline-flex items-center justify-center gap-2 px-4 py-3 text-xl font-bold uppercase tracking-wider transition ${tone}`}
                    >
                      <option.icon className="h-5 w-5" /> {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-5 text-center">
            {phase === "over" ? (
              <>
                <Trophy className="mx-auto h-8 w-8 text-cs-orange" />
                <h1 className="text-3xl font-bold uppercase tracking-wider">{copy.gameOver}</h1>
                <p className="font-semibold text-cs-text/70">{copy.result(score)}</p>
                {record ? (
                  <p className="inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wider text-cs-gold">
                    <Flame className="h-4 w-4" /> {copy.newRecord}
                  </p>
                ) : null}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: copy.played, value: stats.played },
                    { label: copy.best, value: stats.best },
                  ].map((item) => (
                    <div key={item.label} className="cs-cut-sm bg-cs-raised p-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{item.label}</p>
                      <p className="text-2xl font-bold leading-none">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={start}
                    className="cs-cut-sm inline-flex items-center justify-center gap-2 bg-cs-orange px-4 py-2.5 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
                  >
                    <RotateCcw className="h-4 w-4" /> {copy.again}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="cs-cut-sm inline-flex items-center justify-center gap-2 bg-cs-raised px-4 py-2.5 text-base font-bold uppercase tracking-wider text-cs-text transition hover:text-cs-orange"
                  >
                    <Share2 className="h-4 w-4" /> {copy.share}
                  </button>
                </div>
                {shareStatus ? (
                  <p className="text-sm font-semibold text-cs-text/70">{shareStatus === "copied" ? copy.copied : copy.copyFailed}</p>
                ) : null}
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
                <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
                <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
                <button
                  type="button"
                  onClick={start}
                  className="cs-cut-sm inline-flex items-center gap-2 bg-cs-orange px-6 py-2.5 text-xl font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
                >
                  <Play className="h-5 w-5 fill-current" />
                  {copy.start}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {phase === "over" ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
    </main>
  );
}

function PlayerCard({
  player,
  language,
  copy,
  tone = "border-cs-line",
  children,
}: {
  player: CsPlayer;
  language: Language;
  copy: HigherLowerCopy;
  tone?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`cs-cut-sm flex items-center gap-3 border-l-4 bg-cs-raised px-3 py-3 transition-colors ${tone}`}>
      <span className="grid h-14 w-14 shrink-0 place-items-center bg-cs-bg">
        {player.currentTeam ? (
          <TeamBadge teamId={player.currentTeam} className="h-10 w-10" size={80} />
        ) : (
          <span className="text-3xl" aria-hidden="true">
            {getCountryFlag(player.nationality)}
          </span>
        )}
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <p className="truncate text-2xl font-bold uppercase leading-none tracking-wide">{player.nickname}</p>
        <p className="truncate text-xs font-semibold uppercase tracking-wider text-cs-text/45">
          {getCountryFlag(player.nationality)} {getCountryName(player.nationality, language)} ·{" "}
          {player.currentTeam ? getTeamName(player.currentTeam) : copy.noTeam}
        </p>
        {children}
      </div>
    </div>
  );
}
