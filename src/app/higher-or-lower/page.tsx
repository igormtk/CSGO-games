"use client";

import { useMemo, useState } from "react";
import { Check, Flame, Play, RotateCcw, Share2, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { PartnerBreakModal, useBreakSeen } from "@/components/partners/PartnerBreakModal";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getGameDateKey, hashDate } from "@/lib/daily";
import { getShareUrl, useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useHydrated } from "@/lib/useHydrated";

// Modo infinito: cada rodada pergunta quem tem mais entre dois pro players. O da esquerda mostra o
// número; toque em quem tem mais. Acertou, o da direita passa para a esquerda e um novo aparece;
// errou, acaba. Não é diário: dá para jogar quantas vezes quiser.
const STATS_KEY = "cs-higher-lower-stats";
const REVEAL_DELAY_MS = 1300;
// Jogadores que não voltam logo em seguida, para a partida não ficar repetitiva.
const RECENT_LIMIT = 12;

// Só números que a comunidade conhece; "times na carreira" saiu porque ninguém sabe contar.
type CategoryId = "majors" | "top20";
type Side = "left" | "right";

const categories: Record<CategoryId, (player: CsPlayer) => number> = {
  majors: (player) => player.majorsWon,
  top20: (player) => player.hltvTop20Years.length,
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
      "Dois pro players, uma pergunta: quem tem mais? Você vê o número de um deles; toque no jogador que você acha que tem mais. Cada acerto soma na sequência, e um erro encerra a partida. Sem limite diário.",
    start: "Começar",
    category: {
      majors: { question: "Quem tem mais títulos de Major?", unit: unit("Major", "Majors") },
      top20: { question: "Quem ficou mais anos no Top 20 da HLTV?", unit: unit("ano no Top 20", "anos no Top 20") },
    },
    hint: "Toque no jogador que tem mais",
    hasMore: (name: string) => `${name} tem mais`,
    streak: "Sequência",
    best: "Recorde",
    played: "Partidas",
    gameOver: "Fim de jogo",
    result: (score: number) => (score === 1 ? "Você acertou 1 seguida." : `Você acertou ${score} seguidas.`),
    lastRound: "A rodada que você errou:",
    newRecord: "Novo recorde!",
    again: "Jogar de novo",
    share: "Compartilhar resultado",
    shareLine: (score: number) => `🔥 ${score} acertos seguidos`,
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    noTeam: "Sem time",
    partnerLabel: "Publicidade",
  },
  en: {
    eyebrow: "Higher or lower",
    title: "Who has more?",
    intro:
      "Two pro players, one question: who has more? You see one player's number; tap the player you think has more. Each right answer adds to your streak, and one miss ends the run. No daily limit.",
    start: "Start",
    category: {
      majors: { question: "Who has more Major titles?", unit: unit("Major", "Majors") },
      top20: { question: "Who spent more years in the HLTV Top 20?", unit: unit("year in the Top 20", "years in the Top 20") },
    },
    hint: "Tap the player who has more",
    hasMore: (name: string) => `${name} has more`,
    streak: "Streak",
    best: "Best",
    played: "Played",
    gameOver: "Game over",
    result: (score: number) => (score === 1 ? "You got 1 in a row." : `You got ${score} in a row.`),
    lastRound: "The round you missed:",
    newRecord: "New record!",
    again: "Play again",
    share: "Share result",
    shareLine: (score: number) => `🔥 ${score} in a row`,
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    noTeam: "No team",
    partnerLabel: "Advertisement",
  },
  es: {
    eyebrow: "Más o menos",
    title: "¿Quién tiene más?",
    intro:
      "Dos pro players, una pregunta: ¿quién tiene más? Ves el número de uno de ellos; toca al jugador que crees que tiene más. Cada acierto suma a tu racha y un error termina la partida. Sin límite diario.",
    start: "Empezar",
    category: {
      majors: { question: "¿Quién tiene más títulos de Major?", unit: unit("Major", "Majors") },
      top20: { question: "¿Quién estuvo más años en el Top 20 de HLTV?", unit: unit("año en el Top 20", "años en el Top 20") },
    },
    hint: "Toca al jugador que tiene más",
    hasMore: (name: string) => `${name} tiene más`,
    streak: "Racha",
    best: "Récord",
    played: "Partidas",
    gameOver: "Fin del juego",
    result: (score: number) => (score === 1 ? "Acertaste 1 seguida." : `Acertaste ${score} seguidas.`),
    lastRound: "La ronda que fallaste:",
    newRecord: "¡Nuevo récord!",
    again: "Jugar de nuevo",
    share: "Compartir resultado",
    shareLine: (score: number) => `🔥 ${score} aciertos seguidos`,
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    noTeam: "Sin equipo",
    partnerLabel: "Publicidad",
  },
} satisfies Record<Language, unknown>;

type HigherLowerCopy = (typeof higherLowerCopy)["pt"];

const pick = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

// Sorteia a próxima comparação para o jogador da esquerda. Só entram categorias em que existe gente
// com mais e com menos que ele, e quem ganha é sorteado antes do adversário: assim cada lado ganha
// na mesma proporção e não há empate. Quem tem 0 Majors não vira "o outro sempre tem mais".
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
      <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
        <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </main>
    );
  }

  return <HigherOrLowerGame copy={copy} />;
}

function HigherOrLowerGame({ copy }: { copy: HigherLowerCopy }) {
  const [stats, setStats] = useState<PlayerStats>(readStats);
  const [phase, setPhase] = useState<"intro" | "playing" | "over">("intro");
  const [round, setRound] = useState<Round>(firstRound);
  const [recent, setRecent] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState<{ side: Side; correct: boolean }>();
  const [record, setRecord] = useState(false);
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  // Sem chave: o anúncio aparece a cada fim de partida, não fica salvo.
  const [breakSeen, markBreakSeen, resetBreak] = useBreakSeen();
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
    resetBreak();
    setPhase("playing");
  };

  const value = categories[round.category];
  const winner: Side = value(round.right) > value(round.left) ? "right" : "left";

  const answer = (side: Side) => {
    if (guess) return;
    const correct = side === winner;
    setGuess({ side, correct });

    // O número do jogador da direita aparece por um instante antes da próxima rodada (ou do fim).
    window.setTimeout(() => {
      if (correct) {
        const nextRecent = [...recent, round.right.id].slice(-RECENT_LIMIT);
        setGuess(undefined);
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
    const shareText = [`CS Games · ${copy.eyebrow}`, copy.shareLine(score), getShareUrl("/higher-or-lower")].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  const category = copy.category[round.category];
  const tone = (side: Side) => (!guess ? undefined : side === winner ? "win" : side === guess.side ? "loss" : undefined);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-3 px-4 py-4 sm:gap-4">
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
            <div className="border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-4 py-3 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
              <h1 className="text-2xl font-bold uppercase leading-tight tracking-wide sm:text-3xl">{category.question}</h1>
            </div>

            <div className="relative grid grid-cols-2 gap-2 p-3">
              <PlayerChoice
                player={round.left}
                copy={copy}
                tone={tone("left")}
                disabled={Boolean(guess)}
                onClick={() => answer("left")}
                value={value(round.left)}
                unit={category.unit}
              />
              <PlayerChoice
                player={round.right}
                copy={copy}
                tone={tone("right")}
                disabled={Boolean(guess)}
                onClick={() => answer("right")}
                value={guess ? value(round.right) : undefined}
                unit={category.unit}
              />
              <span
                className="pointer-events-none absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-cs-line bg-cs-bg text-sm font-bold uppercase text-cs-orange"
                aria-hidden="true"
              >
                vs
              </span>
            </div>

            <p className="px-3 pb-3 text-center text-sm font-bold uppercase tracking-wider text-cs-text/55" aria-live="polite">
              {guess ? (
                <span className={`inline-flex items-center gap-1.5 ${guess.correct ? "text-cs-green" : "text-cs-red"}`}>
                  {guess.correct ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  {copy.hasMore((winner === "left" ? round.left : round.right).nickname)}
                </span>
              ) : (
                copy.hint
              )}
            </p>
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
                <div className="cs-cut-sm space-y-1 bg-cs-raised p-3 text-left">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{copy.lastRound}</p>
                  <p className="text-sm font-bold uppercase tracking-wide text-cs-text/70">{category.question}</p>
                  {[round.left, round.right].map((player) => (
                    <p key={player.id} className="flex items-center justify-between gap-2 font-bold uppercase">
                      <span className={player.id === (winner === "left" ? round.left : round.right).id ? "text-cs-green" : "text-cs-text/70"}>
                        {getCountryFlag(player.nationality)} {player.nickname}
                      </span>
                      <span>
                        {value(player)} <span className="text-xs text-cs-text/55">{category.unit(value(player))}</span>
                      </span>
                    </p>
                  ))}
                </div>
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

      {phase === "over" && breakSeen ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
      {phase === "over" && !breakSeen ? <PartnerBreakModal partner={partner} onDone={markBreakSeen} /> : null}
    </main>
  );
}

function PlayerChoice({
  player,
  copy,
  tone,
  disabled,
  onClick,
  value,
  unit,
}: {
  player: CsPlayer;
  copy: HigherLowerCopy;
  tone?: "win" | "loss";
  disabled: boolean;
  onClick: () => void;
  // Sem valor, o número fica escondido ("?") até o palpite.
  value?: number;
  unit: (value: number) => string;
}) {
  const border =
    tone === "win" ? "border-cs-green bg-[#1d3020]" : tone === "loss" ? "border-cs-red bg-[#3a1f22]" : "border-cs-line bg-cs-raised";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`cs-cut-sm flex min-w-0 flex-col items-center gap-2 border-b-4 px-2 py-4 text-center transition enabled:hover:-translate-y-0.5 enabled:hover:border-cs-orange enabled:hover:bg-cs-line ${border}`}
    >
      <span className="grid h-16 w-16 place-items-center bg-cs-bg">
        {player.currentTeam ? (
          <TeamBadge teamId={player.currentTeam} className="h-12 w-12" size={96} />
        ) : (
          <span className="text-4xl" aria-hidden="true">
            {getCountryFlag(player.nationality)}
          </span>
        )}
      </span>
      <span className="w-full break-words text-xl font-bold uppercase leading-none tracking-wide sm:text-2xl">{player.nickname}</span>
      <span className="w-full truncate text-[11px] font-semibold uppercase tracking-wider text-cs-text/45">
        {getCountryFlag(player.nationality)} {player.currentTeam ? getTeamName(player.currentTeam) : copy.noTeam}
      </span>
      {value === undefined ? (
        <span className="text-4xl font-bold leading-none text-cs-orange">?</span>
      ) : (
        <span className="flex flex-col items-center">
          <span className="text-4xl font-bold leading-none text-cs-text">{value}</span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-cs-text/55">{unit(value)}</span>
        </span>
      )}
    </button>
  );
}
