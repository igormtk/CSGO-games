"use client";

import { useState, useSyncExternalStore } from "react";
import { Check, Heart, Play, RotateCcw, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { getCountryName } from "@/data/countryFlags";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { shuffleArray } from "@/utils/utils";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const MAX_LIVES = 3;
const OPTIONS_PER_QUESTION = 4;
const RECORD_KEY = "cs-guess-name-record";
// Recorde salvo pela versão antiga do jogo
const LEGACY_RECORD_KEY = "record";
const NEXT_QUESTION_DELAY_MS = 900;

const guessNameCopy = {
  pt: {
    lives: "Vidas",
    points: "Pontos",
    record: "Recorde",
    question: "Qual é o nome real de",
    gameOver: "Fim de jogo",
    result: (total: number) => ["Você acertou", `de ${total} nomes.`],
    newRecord: " Novo recorde!",
    eyebrow: "Adivinhe o jogador",
    title: "Qual é o nome real?",
    intro: (total: number) =>
      `Aparece o nick de um pro player e você escolhe o nome verdadeiro entre ${OPTIONS_PER_QUESTION} opções. São ${total} jogadores e ${MAX_LIVES} vidas.`,
    playAgain: "Jogar de novo",
    start: "Começar",
  },
  en: {
    lives: "Lives",
    points: "Points",
    record: "Record",
    question: "What is the real name of",
    gameOver: "Game over",
    result: (total: number) => ["You got", `of ${total} names right.`],
    newRecord: " New record!",
    eyebrow: "Guess the player",
    title: "What's the real name?",
    intro: (total: number) =>
      `You see a pro player's nickname and pick their real name from ${OPTIONS_PER_QUESTION} options. ${total} players, ${MAX_LIVES} lives.`,
    playAgain: "Play again",
    start: "Start",
  },
  es: {
    lives: "Vidas",
    points: "Puntos",
    record: "Récord",
    question: "Adivina el nombre real de",
    gameOver: "Fin del juego",
    result: (total: number) => ["Acertaste", `de ${total} nombres.`],
    newRecord: " ¡Nuevo récord!",
    eyebrow: "Adivina el jugador",
    title: "¿Cuál es el nombre real?",
    intro: (total: number) =>
      `Aparece el nick de un pro player y eliges su nombre verdadero entre ${OPTIONS_PER_QUESTION} opciones. Son ${total} jugadores y ${MAX_LIVES} vidas.`,
    playAgain: "Jugar de nuevo",
    start: "Empezar",
  },
} satisfies Record<Language, unknown>;

type Question = {
  player: CsPlayer;
  options: string[];
};

// Distratores da mesma nacionalidade primeiro: nomes parecidos deixam a escolha mais difícil.
const createQuestion = (player: CsPlayer): Question => {
  const others = csPlayers.filter((candidate) => candidate.id !== player.id && candidate.fullName !== player.fullName);
  const sameNationality = shuffleArray(others.filter((candidate) => candidate.nationality === player.nationality));
  const rest = shuffleArray(others.filter((candidate) => candidate.nationality !== player.nationality));
  const distractors = [...sameNationality, ...rest].slice(0, OPTIONS_PER_QUESTION - 1).map((candidate) => candidate.fullName);

  return { player, options: shuffleArray([player.fullName, ...distractors]) };
};

const RECORD_EVENT = "cs-guess-name-record-change";

const readRecord = () => {
  try {
    return Number(window.localStorage.getItem(RECORD_KEY) ?? window.localStorage.getItem(LEGACY_RECORD_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
};

const saveRecord = (record: number) => {
  try {
    window.localStorage.setItem(RECORD_KEY, String(record));
  } catch {
    // Sem armazenamento (aba anônima): o recorde vale só nesta visita.
  }
  window.dispatchEvent(new Event(RECORD_EVENT));
};

const subscribeToRecord = (onChange: () => void) => {
  window.addEventListener(RECORD_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(RECORD_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};

export default function GuessNamePage() {
  const [queue, setQueue] = useState<CsPlayer[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [question, setQuestion] = useState<Question>();
  const [answer, setAnswer] = useState<string>();
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [status, setStatus] = useState<"idle" | "playing" | "over">("idle");

  const language = useLanguage();
  const copy = guessNameCopy[language];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);

  // O recorde vem do localStorage: 0 no HTML do servidor, o salvo depois da hidratação.
  const record = useSyncExternalStore(subscribeToRecord, readRecord, () => 0);

  const finishGame = (finalScore: number) => {
    setStatus("over");
    if (finalScore > record) saveRecord(finalScore);
  };

  const handleStart = () => {
    const nextQueue = shuffleArray(csPlayers);
    setQueue(nextQueue);
    setQuestionIndex(0);
    setQuestion(createQuestion(nextQueue[0]));
    setAnswer(undefined);
    setScore(0);
    setLives(MAX_LIVES);
    setStatus("playing");
  };

  const handleAnswer = (option: string) => {
    if (!question || answer) return;

    const correct = option === question.player.fullName;
    const nextScore = correct ? score + 1 : score;
    const nextLives = correct ? lives : lives - 1;
    setAnswer(option);
    setScore(nextScore);
    setLives(nextLives);

    // Mostra a resposta certa por um instante antes de seguir.
    window.setTimeout(() => {
      const nextIndex = questionIndex + 1;
      if (nextLives === 0 || nextIndex >= queue.length) {
        finishGame(nextScore);
        return;
      }
      setQuestionIndex(nextIndex);
      setQuestion(createQuestion(queue[nextIndex]));
      setAnswer(undefined);
    }, NEXT_QUESTION_DELAY_MS);
  };

  const stats = [
    { label: copy.points, value: score, color: "text-cs-green" },
    { label: copy.record, value: record, color: "text-cs-orange" },
  ];

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-3 px-4 py-4 sm:gap-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="cs-cut-sm bg-cs-surface p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{copy.lives}</p>
          <div className="mt-1 flex gap-1" aria-label={`${copy.lives}: ${lives}/${MAX_LIVES}`}>
            {Array.from({ length: MAX_LIVES }, (_, index) => (
              <Heart key={index} className={`h-5 w-5 ${index < lives ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
            ))}
          </div>
        </div>
        {stats.map((stat) => (
          <div key={stat.label} className="cs-cut-sm bg-cs-surface p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{stat.label}</p>
            <p className={`mt-0.5 text-3xl font-bold leading-none ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {status === "playing" && question ? (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut bg-cs-surface">
            <div className="border-b-2 border-cs-orange bg-gradient-to-r from-cs-raised to-cs-surface px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
                {copy.question} · {questionIndex + 1}/{queue.length}
              </p>
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
            </div>
            <div className="space-y-2 p-3">
              {question.options.map((option) => {
                const isCorrect = option === question.player.fullName;
                const tone = !answer
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
                    onClick={() => handleAnswer(option)}
                    disabled={Boolean(answer)}
                    className={`cs-cut-sm flex w-full items-center justify-between gap-2 border-l-4 px-4 py-3 text-left text-lg font-bold uppercase tracking-wide transition ${tone}`}
                  >
                    <span className="min-w-0 truncate">{option}</span>
                    {answer && isCorrect ? <Check className="h-5 w-5 shrink-0 text-cs-green" /> : null}
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
            {status === "over" ? (
              <>
                <Trophy className="mx-auto h-8 w-8 text-cs-orange" />
                <h1 className="text-3xl font-bold uppercase tracking-wider">{copy.gameOver}</h1>
                <p className="font-semibold text-cs-text/70">
                  {copy.result(queue.length)[0]} <strong className="text-cs-green">{score}</strong> {copy.result(queue.length)[1]}
                  {score > 0 && score === record ? copy.newRecord : ""}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
                <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
                <p className="font-semibold leading-6 text-cs-text/70">
                  {copy.intro(csPlayers.length)}
                </p>
              </>
            )}
            <button
              type="button"
              onClick={handleStart}
              className="cs-cut-sm inline-flex items-center gap-2 bg-cs-orange px-6 py-2.5 text-xl font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
            >
              {status === "over" ? <RotateCcw className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              {status === "over" ? copy.playAgain : copy.start}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
