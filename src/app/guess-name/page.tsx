"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { Check, Heart, Play, Share2, Timer, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryName } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { ArchiveBanner, ArchiveLink } from "@/components/daily/ArchiveBanner";
import { NextPuzzleCountdown } from "@/components/daily/NextPuzzleCountdown";
import { PartnerBreakModal, useBreakSeen } from "@/components/partners/PartnerBreakModal";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getPreviousDateKey, getPuzzleNumber, hashDate, seededShuffle } from "@/lib/daily";
import { getShareUrl, useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useDailyDate } from "@/lib/useDailyDate";
import { useHydrated } from "@/lib/useHydrated";

// Desafio diário: os mesmos nomes, na mesma ordem e com as mesmas opções para todo mundo.
const DAILY_NAMES = 20;
const MAX_LIVES = 3;
const OPTIONS_PER_QUESTION = 4;
// Tempo curto o bastante para não dar tempo de pesquisar o nome.
const SECONDS_PER_NAME = 10;
const NEXT_QUESTION_DELAY_MS = 1200;
const GAME_KEY_PREFIX = "cs-guess-name-daily-v1";
const STATS_KEY = "cs-guess-name-stats";
const TIMEOUT = "__timeout__";

type Outcome = "hit" | "miss" | "timeout";

// pending: índice do nome que estava na tela sem resposta. Recarregar a página com um nome na
// tela conta como tempo esgotado, para ninguém recarregar e ganhar tempo para pesquisar.
type StoredGame = { outcomes: Outcome[]; pending?: number };

type PlayerStats = {
  played: number;
  bestScore: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate?: string;
};

const emptyStats: PlayerStats = { played: 0, bestScore: 0, currentStreak: 0, maxStreak: 0 };

const guessNameCopy = {
  pt: {
    lives: "Vidas",
    hits: "Acertos",
    best: "Melhor",
    question: "Qual é o nome real de",
    timeUp: "Tempo esgotado!",
    gameOver: "Fim do desafio",
    result: (score: number) => `Você acertou ${score} de ${DAILY_NAMES} nomes hoje.`,
    eyebrow: "Adivinhe o jogador",
    title: "Qual é o nome real?",
    intro: `Desafio diário: ${DAILY_NAMES} pro players, os mesmos para todo mundo. Escolha o nome verdadeiro entre ${OPTIONS_PER_QUESTION} opções em até ${SECONDS_PER_NAME} segundos por nome. São ${MAX_LIVES} vidas e uma tentativa por dia.`,
    start: "Começar",
    resume: (index: number) => `Continuar · ${index + 1}/${DAILY_NAMES}`,
    resumeNote: "O nome que estava na tela quando você saiu contou como tempo esgotado.",
    nextChallenge: "Próximo desafio em",
    share: "Compartilhar resultado",
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    played: "Jogos",
    streak: "Sequência",
    secondsLeft: (seconds: number) => `${seconds}s`,
    partnerLabel: "Publicidade",
  },
  en: {
    lives: "Lives",
    hits: "Correct",
    best: "Best",
    question: "What is the real name of",
    timeUp: "Time's up!",
    gameOver: "Challenge over",
    result: (score: number) => `You got ${score} of ${DAILY_NAMES} names right today.`,
    eyebrow: "Guess the player",
    title: "What's the real name?",
    intro: `Daily challenge: ${DAILY_NAMES} pro players, the same for everyone. Pick the real name from ${OPTIONS_PER_QUESTION} options within ${SECONDS_PER_NAME} seconds per name. ${MAX_LIVES} lives and one attempt per day.`,
    start: "Start",
    resume: (index: number) => `Continue · ${index + 1}/${DAILY_NAMES}`,
    resumeNote: "The name on screen when you left counted as time's up.",
    nextChallenge: "Next challenge in",
    share: "Share result",
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    played: "Played",
    streak: "Streak",
    secondsLeft: (seconds: number) => `${seconds}s`,
    partnerLabel: "Advertisement",
  },
  es: {
    lives: "Vidas",
    hits: "Aciertos",
    best: "Mejor",
    question: "Adivina el nombre real de",
    timeUp: "¡Se acabó el tiempo!",
    gameOver: "Fin del desafío",
    result: (score: number) => `Acertaste ${score} de ${DAILY_NAMES} nombres hoy.`,
    eyebrow: "Adivina el jugador",
    title: "¿Cuál es el nombre real?",
    intro: `Desafío diario: ${DAILY_NAMES} pro players, los mismos para todos. Elige el nombre verdadero entre ${OPTIONS_PER_QUESTION} opciones en hasta ${SECONDS_PER_NAME} segundos por nombre. ${MAX_LIVES} vidas y un intento por día.`,
    start: "Empezar",
    resume: (index: number) => `Continuar · ${index + 1}/${DAILY_NAMES}`,
    resumeNote: "El nombre que estaba en pantalla cuando saliste contó como tiempo agotado.",
    nextChallenge: "Próximo desafío en",
    share: "Compartir resultado",
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    played: "Partidas",
    streak: "Racha",
    secondsLeft: (seconds: number) => `${seconds}s`,
    partnerLabel: "Publicidad",
  },
} satisfies Record<Language, unknown>;

type GuessNameCopy = (typeof guessNameCopy)["pt"];

const outcomeEmoji: Record<Outcome, string> = { hit: "🟩", miss: "🟥", timeout: "⏱️" };

const createDailyQueue = (dateKey: string) => seededShuffle(csPlayers, hashDate(dateKey) * 31).slice(0, DAILY_NAMES);

// Distratores da mesma nacionalidade primeiro (nomes parecidos dificultam), sorteados pela data
// para todo mundo ver as mesmas opções.
const createQuestion = (player: CsPlayer, dateKey: string) => {
  const seed = hashDate(`${dateKey}-${player.id}`);
  const others = csPlayers.filter((candidate) => candidate.id !== player.id && candidate.fullName !== player.fullName);
  const sameNationality = seededShuffle(
    others.filter((candidate) => candidate.nationality === player.nationality),
    seed
  );
  const rest = seededShuffle(
    others.filter((candidate) => candidate.nationality !== player.nationality),
    seed * 7
  );
  const distractors = [...sameNationality, ...rest].slice(0, OPTIONS_PER_QUESTION - 1).map((candidate) => candidate.fullName);
  return { player, options: seededShuffle([player.fullName, ...distractors], seed * 13) };
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

const recordGame = (stats: PlayerStats, dateKey: string, score: number): PlayerStats => {
  const currentStreak = stats.lastPlayedDate === getPreviousDateKey(dateKey) ? stats.currentStreak + 1 : 1;
  return {
    played: stats.played + 1,
    bestScore: Math.max(stats.bestScore, score),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    lastPlayedDate: dateKey,
  };
};

const countMisses = (outcomes: Outcome[]) => outcomes.filter((outcome) => outcome !== "hit").length;
const isFinished = (outcomes: Outcome[]) => countMisses(outcomes) >= MAX_LIVES || outcomes.length >= DAILY_NAMES;

export default function GuessNamePage() {
  const language = useLanguage();
  const copy = guessNameCopy[language];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();
  const { dateKey, archived } = useDailyDate();

  // A data e o progresso salvo só existem no navegador: o servidor manda só o título (que
  // buscadores e IAs leem) e o jogo monta no cliente, já com tudo carregado.
  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-3 px-4 py-4">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
        <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </main>
    );
  }

  // A chave troca o jogo inteiro ao navegar entre hoje e um dia do arquivo.
  return <GuessNameGame key={dateKey} copy={copy} language={language} dateKey={dateKey} archived={archived} />;
}

function GuessNameGame({
  copy,
  language,
  dateKey,
  archived,
}: {
  copy: GuessNameCopy;
  language: Language;
  dateKey: string;
  archived: boolean;
}) {
  const gameKey = `${GAME_KEY_PREFIX}-${dateKey}`;
  const queue = useMemo(() => createDailyQueue(dateKey), [dateKey]);

  // Ao carregar, um nome que estava na tela sem resposta vira tempo esgotado (e fica salvo assim).
  const [initial] = useState(() => {
    const stored = readJson<StoredGame>(gameKey, { outcomes: [] });
    const abandoned = stored.pending !== undefined && stored.pending === stored.outcomes.length;
    const outcomes: Outcome[] = abandoned ? [...stored.outcomes, "timeout"] : stored.outcomes;
    if (abandoned) writeJson(gameKey, { outcomes });
    return { outcomes, abandoned };
  });
  const [outcomes, setOutcomes] = useState<Outcome[]>(initial.outcomes);
  const [stats, setStats] = useState<PlayerStats>(() => readJson(STATS_KEY, emptyStats));
  const [answer, setAnswer] = useState<string>();
  const [deadline, setDeadline] = useState<number>();
  const [now, setNow] = useState(() => Date.now());
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();

  const index = outcomes.length;
  const score = outcomes.filter((outcome) => outcome === "hit").length;
  const lives = MAX_LIVES - countMisses(outcomes);
  const isOver = isFinished(outcomes);
  const playing = deadline !== undefined || answer !== undefined;
  // Enquanto a resposta aparece, o resultado já entrou na lista: o nome na tela é o anterior.
  const questionIndex = answer !== undefined ? index - 1 : index;
  const question = useMemo(
    () => (questionIndex < queue.length ? createQuestion(queue[questionIndex], dateKey) : undefined),
    [queue, questionIndex, dateKey]
  );
  const partner = useMemo(() => getPartnerFor("post-game", dateKey, hashDate(dateKey)), [dateKey]);
  const [breakSeen, markBreakSeen] = useBreakSeen(`${gameKey}-break`);
  const secondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : SECONDS_PER_NAME;
  const timeShare = deadline ? Math.max(0, (deadline - now) / (SECONDS_PER_NAME * 1000)) : 1;

  const startQuestion = (questionIndex: number) => {
    // O prazo segue o relógio: trocar de aba para pesquisar não pausa o cronômetro.
    setDeadline(Date.now() + SECONDS_PER_NAME * 1000);
    setNow(Date.now());
    writeJson(gameKey, { outcomes, pending: questionIndex });
  };

  const resolve = (choice: string) => {
    if (!question || answer !== undefined) return;

    const outcome: Outcome = choice === TIMEOUT ? "timeout" : choice === question.player.fullName ? "hit" : "miss";
    const nextOutcomes = [...outcomes, outcome];
    setAnswer(choice);
    setDeadline(undefined);
    setOutcomes(nextOutcomes);
    writeJson(gameKey, { outcomes: nextOutcomes });

    const finished = isFinished(nextOutcomes);
    if (finished && !archived && stats.lastPlayedDate !== dateKey) {
      const nextStats = recordGame(stats, dateKey, nextOutcomes.filter((entry) => entry === "hit").length);
      setStats(nextStats);
      writeJson(STATS_KEY, nextStats);
    }

    // Mostra a resposta certa por um instante antes do próximo nome.
    window.setTimeout(() => {
      setAnswer(undefined);
      if (finished) return;
      setDeadline(Date.now() + SECONDS_PER_NAME * 1000);
      setNow(Date.now());
      writeJson(gameKey, { outcomes: nextOutcomes, pending: nextOutcomes.length });
    }, NEXT_QUESTION_DELAY_MS);
  };

  const onTimeUp = useEffectEvent(() => resolve(TIMEOUT));

  useEffect(() => {
    if (deadline === undefined) return;
    const interval = window.setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= deadline) {
        window.clearInterval(interval);
        onTimeUp();
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [deadline]);

  const handleShare = async () => {
    const shareText = [
      `CS Games · ${copy.eyebrow} #${getPuzzleNumber(dateKey)}`,
      `${score}/${DAILY_NAMES} · 🔥 ${stats.currentStreak}`,
      outcomes.map((outcome) => outcomeEmoji[outcome]).join(""),
      getShareUrl(`/guess-name${archived ? `?date=${dateKey}` : ""}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  const topStats = [
    { label: copy.hits, value: score, color: "text-cs-green" },
    { label: copy.best, value: stats.bestScore, color: "text-cs-orange" },
  ];

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-3 px-4 py-4 sm:gap-4">
      {archived ? <ArchiveBanner dateKey={dateKey} path="/guess-name" /> : null}
      <div className="grid grid-cols-3 gap-2">
        <div className="cs-cut-sm bg-cs-surface p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{copy.lives}</p>
          <div className="mt-1 flex gap-1" aria-label={`${copy.lives}: ${lives}/${MAX_LIVES}`}>
            {Array.from({ length: MAX_LIVES }, (_, heart) => (
              <Heart key={heart} className={`h-5 w-5 ${heart < lives ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
            ))}
          </div>
        </div>
        {topStats.map((stat) => (
          <div key={stat.label} className="cs-cut-sm bg-cs-surface p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{stat.label}</p>
            <p className={`mt-0.5 text-3xl font-bold leading-none ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {playing && question ? (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut bg-cs-surface">
            <div className="border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
                  {copy.question} · {questionIndex + 1}/{DAILY_NAMES}
                </p>
                <span
                  className={`inline-flex items-center gap-1 text-sm font-bold tabular-nums ${secondsLeft <= 3 ? "text-cs-red" : "text-cs-text/70"}`}
                  aria-live="polite"
                >
                  <Timer className="h-4 w-4" /> {copy.secondsLeft(secondsLeft)}
                </span>
              </div>
              <h1 className="truncate text-4xl font-bold uppercase leading-none tracking-wide">{question.player.nickname}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cs-text/45">
                {getCountryName(question.player.nationality, language)}
                {question.player.currentTeam ? (
                  <>
                    <span>·</span>
                    <TeamBadge teamId={question.player.currentTeam} className="h-4 w-4" size={32} />
                    {getTeamName(question.player.currentTeam)}
                  </>
                ) : null}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden bg-cs-bg" aria-hidden="true">
                <div
                  className={`h-full transition-[width] duration-100 ease-linear ${timeShare <= 0.3 ? "bg-cs-red" : "bg-cs-orange"}`}
                  style={{ width: `${timeShare * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2 p-3">
              {answer === TIMEOUT ? (
                <p className="text-center text-sm font-bold uppercase tracking-wider text-cs-red">{copy.timeUp}</p>
              ) : null}
              {question.options.map((option) => {
                const isCorrect = option === question.player.fullName;
                const tone =
                  answer === undefined
                    ? "border-cs-line bg-cs-raised hover:border-cs-orange hover:bg-cs-line hover:text-cs-orange"
                    : isCorrect
                      ? "border-cs-green bg-[#203047] text-[#d7f0c8]"
                      : option === answer
                        ? "border-cs-red bg-[#3a1f22] text-[#f6c9ca]"
                        : "border-cs-line bg-cs-raised opacity-50";

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => resolve(option)}
                    disabled={answer !== undefined}
                    className={`cs-cut-sm flex w-full items-center justify-between gap-2 border-l-4 px-4 py-3 text-left text-lg font-bold uppercase tracking-wide transition ${tone}`}
                  >
                    <span className="min-w-0 truncate">{option}</span>
                    {answer !== undefined && isCorrect ? <Check className="h-5 w-5 shrink-0 text-cs-green" /> : null}
                    {answer === option && !isCorrect ? <X className="h-5 w-5 shrink-0 text-cs-red" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-5 text-center">
            {isOver ? (
              <>
                <Trophy className="mx-auto h-8 w-8 text-cs-orange" />
                <h1 className="text-3xl font-bold uppercase tracking-wider">{copy.gameOver}</h1>
                <p className="font-semibold text-cs-text/70">{copy.result(score)}</p>
                <p className="text-2xl leading-none tracking-wide" aria-hidden="true">
                  {outcomes.map((outcome) => outcomeEmoji[outcome]).join("")}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: copy.played, value: stats.played },
                    { label: copy.best, value: stats.bestScore },
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
                  <ArchiveLink path="/guess-name" />
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
                  {copy.eyebrow} · #{getPuzzleNumber(dateKey)}
                </p>
                <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
                <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
                {index > 0 && initial.abandoned ? (
                  <p className="text-sm font-semibold text-cs-gold">{copy.resumeNote}</p>
                ) : null}
                <button
                  type="button"
                  onClick={() => startQuestion(index)}
                  className="cs-cut-sm inline-flex items-center gap-2 bg-cs-orange px-6 py-2.5 text-xl font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
                >
                  <Play className="h-5 w-5 fill-current" />
                  {index > 0 ? copy.resume(index) : copy.start}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {isOver && breakSeen ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
      {isOver && !breakSeen ? <PartnerBreakModal partner={partner} onDone={markBreakSeen} /> : null}
    </main>
  );
}
