"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { Check, Play, Share2, Timer, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag, getCountryName } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { ArchiveBanner, ArchiveLink } from "@/components/daily/ArchiveBanner";
import { NextPuzzleCountdown } from "@/components/daily/NextPuzzleCountdown";
import { PartnerBreakModal, useBreakSeen } from "@/components/partners/PartnerBreakModal";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { getPreviousDateKey, getPuzzleNumber, hashDate, seededShuffle } from "@/lib/daily";
import { MIN_MAJORS, MIN_TOP20_YEARS, candidateCriteria, countMatches, matchesCriterion } from "@/lib/groups";
import type { GroupCriterion } from "@/lib/groups";
import { getShareUrl, useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useDailyDate } from "@/lib/useDailyDate";
import { useHydrated } from "@/lib/useHydrated";

// Desafio diário: um tema para todo mundo e 60 segundos para digitar o máximo de jogadores que
// se encaixam nele. As sugestões vêm da base inteira, não só do tema, para ajudar a escrever o
// nick sem entregar as respostas.
const ROUND_SECONDS = 60;
const MAX_SUGGESTIONS = 6;
// Tema só com bastante gente possível, para dar o que digitar durante o minuto inteiro.
const MIN_THEME_PLAYERS = 10;
const GAME_KEY_PREFIX = "cs-sixty-daily-v1";
const STATS_KEY = "cs-sixty-stats";
const ORDER_SEED = 6151;

// startedAt fica salvo: recarregar a página não devolve o tempo, o relógio segue de onde estava.
type StoredGame = { startedAt?: number; foundIds: string[]; misses: string[] };

type PlayerStats = { played: number; best: number; currentStreak: number; maxStreak: number; lastPlayedDate?: string };
const emptyStats: PlayerStats = { played: 0, best: 0, currentStreak: 0, maxStreak: 0 };

const themeLabel: Record<Language, (criterion: GroupCriterion, language: Language) => string> = {
  pt: (criterion, language) => {
    switch (criterion.kind) {
      case "team":
        return `que passaram por ${getTeamName(criterion.value)}`;
      case "country":
        return `de nacionalidade ${getCountryName(criterion.value, language)}`;
      case "role":
        return `com a função ${criterion.value}`;
      case "mvp":
        return "que foram MVP de Major";
      case "majors":
        return `com ${MIN_MAJORS} ou mais títulos de Major`;
      case "top20":
        return `com ${MIN_TOP20_YEARS} ou mais anos no Top 20 da HLTV`;
    }
  },
  en: (criterion, language) => {
    switch (criterion.kind) {
      case "team":
        return `who played for ${getTeamName(criterion.value)}`;
      case "country":
        return `from ${getCountryName(criterion.value, language)}`;
      case "role":
        return `with the ${criterion.value} role`;
      case "mvp":
        return "who were a Major MVP";
      case "majors":
        return `with ${MIN_MAJORS} or more Major titles`;
      case "top20":
        return `with ${MIN_TOP20_YEARS} or more years in the HLTV Top 20`;
    }
  },
  es: (criterion, language) => {
    switch (criterion.kind) {
      case "team":
        return `que pasaron por ${getTeamName(criterion.value)}`;
      case "country":
        return `de nacionalidad ${getCountryName(criterion.value, language)}`;
      case "role":
        return `con el rol de ${criterion.value}`;
      case "mvp":
        return "que fueron MVP de un Major";
      case "majors":
        return `con ${MIN_MAJORS} o más títulos de Major`;
      case "top20":
        return `con ${MIN_TOP20_YEARS} o más años en el Top 20 de HLTV`;
    }
  },
};

const sixtyCopy = {
  pt: {
    eyebrow: "60 segundos",
    title: "Quantos você lembra?",
    intro: `Um tema por dia, igual para todo mundo. Cite todos os pro players que você lembrar em ${ROUND_SECONDS} segundos: comece a digitar o nick e escolha na lista (ou aperte Enter). Uma tentativa por dia.`,
    theme: "Pro players",
    start: "Começar",
    inputLabel: "Nick do jogador",
    placeholder: "Digite um nick e escolha na lista",
    found: "Acertos",
    notInTheme: "Não entra no tema",
    unknown: "Não está na nossa base",
    already: "Já foi",
    timeUp: "Tempo esgotado!",
    result: (found: number, total: number) => `Você lembrou ${found} de ${total} jogadores da nossa base.`,
    missed: "Os que faltaram:",
    played: "Jogos",
    best: "Recorde",
    streak: "Sequência",
    share: "Compartilhar resultado",
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    nextChallenge: "Próximo desafio em",
    partnerLabel: "Publicidade",
  },
  en: {
    eyebrow: "60 seconds",
    title: "How many can you name?",
    intro: `One theme a day, the same for everyone. Name every pro player you can think of in ${ROUND_SECONDS} seconds: start typing the nickname and pick it from the list (or press Enter). One attempt per day.`,
    theme: "Pro players",
    start: "Start",
    inputLabel: "Player nickname",
    placeholder: "Type a nickname and pick it from the list",
    found: "Found",
    notInTheme: "Doesn't fit the theme",
    unknown: "Not in our database",
    already: "Already named",
    timeUp: "Time's up!",
    result: (found: number, total: number) => `You named ${found} of ${total} players in our database.`,
    missed: "The ones you missed:",
    played: "Played",
    best: "Best",
    streak: "Streak",
    share: "Share result",
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    nextChallenge: "Next challenge in",
    partnerLabel: "Advertisement",
  },
  es: {
    eyebrow: "60 segundos",
    title: "¿Cuántos recuerdas?",
    intro: `Un tema por día, el mismo para todos. Nombra a todos los pro players que recuerdes en ${ROUND_SECONDS} segundos: empieza a escribir el nick y elígelo de la lista (o pulsa Enter). Un intento por día.`,
    theme: "Pro players",
    start: "Empezar",
    inputLabel: "Nick del jugador",
    placeholder: "Escribe un nick y elígelo de la lista",
    found: "Aciertos",
    notInTheme: "No entra en el tema",
    unknown: "No está en nuestra base",
    already: "Ya lo dijiste",
    timeUp: "¡Se acabó el tiempo!",
    result: (found: number, total: number) => `Recordaste ${found} de ${total} jugadores de nuestra base.`,
    missed: "Los que faltaron:",
    played: "Partidas",
    best: "Récord",
    streak: "Racha",
    share: "Compartir resultado",
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    nextChallenge: "Próximo desafío en",
    partnerLabel: "Publicidad",
  },
};

type SixtyCopy = (typeof sixtyCopy)["pt"];

const themes = seededShuffle(
  candidateCriteria.filter((criterion) => countMatches(criterion) >= MIN_THEME_PLAYERS),
  ORDER_SEED
);

const getTheme = (dateKey: string) => {
  const puzzle = getPuzzleNumber(dateKey);
  return themes[(((puzzle - 1) % themes.length) + themes.length) % themes.length];
};

// Sem acento, maiúscula, espaço ou pontuação: "Dev1ce", "dev1ce" e "dev 1ce" valem igual.
const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const playersByNickname = new Map<string, CsPlayer>(csPlayers.map((player) => [normalize(player.nickname), player]));

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

// Jogar no dia mantém a sequência (não existe derrota: o resultado é a quantidade lembrada).
const recordGame = (stats: PlayerStats, dateKey: string, found: number): PlayerStats => {
  const currentStreak = stats.lastPlayedDate === getPreviousDateKey(dateKey) ? stats.currentStreak + 1 : 1;
  return {
    played: stats.played + 1,
    best: Math.max(stats.best, found),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    lastPlayedDate: dateKey,
  };
};

export default function SixtySecondsPage() {
  const language = useLanguage();
  const copy = sixtyCopy[language];
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
  return <SixtyGame key={dateKey} copy={copy} language={language} dateKey={dateKey} archived={archived} />;
}

function SixtyGame({
  copy,
  language,
  dateKey,
  archived,
}: {
  copy: SixtyCopy;
  language: Language;
  dateKey: string;
  archived: boolean;
}) {
  const gameKey = `${GAME_KEY_PREFIX}-${dateKey}`;
  const theme = useMemo(() => getTheme(dateKey), [dateKey]);
  const answers = useMemo(() => csPlayers.filter((player) => matchesCriterion(player, theme)), [theme]);
  const [game, setGame] = useState<StoredGame>(() => readJson<StoredGame>(gameKey, { foundIds: [], misses: [] }));
  const [stats, setStats] = useState<PlayerStats>(() => readJson(STATS_KEY, emptyStats));
  const [now, setNow] = useState(() => Date.now());
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<{ text: string; good: boolean }>();
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [breakSeen, markBreakSeen] = useBreakSeen(`${gameKey}-break`);

  // Nick exato primeiro, depois os que começam com o texto, depois os mais curtos.
  const suggestions = useMemo(() => {
    const query = normalize(input);
    if (!query) return [];
    const named = [...game.foundIds, ...game.misses];
    const rank = (player: CsPlayer) => {
      const key = normalize(player.nickname);
      return key === query ? 0 : key.startsWith(query) ? 1 : 2;
    };
    return csPlayers
      .filter((player) => !named.includes(player.id) && normalize(player.nickname).includes(query))
      .sort((a, b) => rank(a) - rank(b) || a.nickname.length - b.nickname.length)
      .slice(0, MAX_SUGGESTIONS);
  }, [input, game]);

  const deadline = game.startedAt !== undefined ? game.startedAt + ROUND_SECONDS * 1000 : undefined;
  const isOver = deadline !== undefined && now >= deadline;
  const playing = deadline !== undefined && !isOver;
  const secondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : ROUND_SECONDS;
  const partner = useMemo(() => getPartnerFor("post-game", dateKey, hashDate(dateKey)), [dateKey]);
  const label = `${copy.theme} ${themeLabel[language](theme, language)}`;

  const save = (next: StoredGame) => {
    setGame(next);
    writeJson(gameKey, next);
  };

  const finish = useEffectEvent(() => {
    if (archived || stats.lastPlayedDate === dateKey) return;
    const nextStats = recordGame(stats, dateKey, game.foundIds.length);
    setStats(nextStats);
    writeJson(STATS_KEY, nextStats);
  });

  useEffect(() => {
    if (deadline === undefined) return;
    // Também cobre quem volta depois do fim: o primeiro tique já encerra e registra a partida.
    const interval = window.setInterval(() => {
      setNow(Date.now());
      if (Date.now() >= deadline) {
        window.clearInterval(interval);
        finish();
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [deadline]);

  const start = () => {
    save({ ...game, startedAt: Date.now() });
    setNow(Date.now());
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const changeInput = (value: string) => {
    setInput(value);
    setHighlight(0);
  };

  // Enter escolhe a sugestão destacada; sem sugestão, tenta o nick exato (para avisar "já foi").
  const submit = (chosen?: CsPlayer) => {
    const key = normalize(input);
    if ((!key && !chosen) || !playing) return;
    changeInput("");
    inputRef.current?.focus();
    const player = chosen ?? suggestions[highlight] ?? playersByNickname.get(key);
    if (!player) {
      setFeedback({ text: `${input.trim()}: ${copy.unknown}`, good: false });
      return;
    }
    if (game.foundIds.includes(player.id) || game.misses.includes(player.id)) {
      setFeedback({ text: `${player.nickname}: ${copy.already}`, good: false });
      return;
    }
    const hit = matchesCriterion(player, theme);
    setFeedback({ text: hit ? player.nickname : `${player.nickname}: ${copy.notInTheme}`, good: hit });
    save(hit ? { ...game, foundIds: [...game.foundIds, player.id] } : { ...game, misses: [...game.misses, player.id] });
  };

  const handleShare = async () => {
    const shareText = [
      `CS Games · ${copy.eyebrow} #${getPuzzleNumber(dateKey)}`,
      label,
      `⏱️ ${game.foundIds.length}/${answers.length} · 🔥 ${stats.currentStreak}`,
      getShareUrl(`/60-seconds${archived ? `?date=${dateKey}` : ""}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
    } catch {
      setShareStatus("failed");
    }
  };

  const nickname = (id: string) => csPlayers.find((player) => player.id === id)?.nickname ?? id;

  return (
    <main className="mx-auto flex min-h-full w-full max-w-xl flex-col gap-3 px-4 py-4 sm:gap-4">
      {archived ? <ArchiveBanner dateKey={dateKey} path="/60-seconds" /> : null}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
          {copy.eyebrow} · #{getPuzzleNumber(dateKey)}
        </p>
        <h1 className="text-2xl font-bold uppercase leading-tight tracking-wide sm:text-3xl">{label}</h1>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="cs-cut-sm bg-cs-surface p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">{copy.found}</p>
          <p className="mt-0.5 text-3xl font-bold leading-none text-cs-green">{game.foundIds.length}</p>
        </div>
        <div className="cs-cut-sm bg-cs-surface p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">
            <Timer className="mr-1 inline h-3.5 w-3.5" />
            {ROUND_SECONDS}s
          </p>
          <p className={`mt-0.5 text-3xl font-bold leading-none tabular-nums ${secondsLeft <= 10 ? "text-cs-red" : "text-cs-orange"}`} aria-live="polite">
            {secondsLeft}
          </p>
        </div>
      </div>

      {deadline === undefined ? (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-5 text-center">
            <h2 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h2>
            <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
            <button
              type="button"
              onClick={start}
              className="cs-cut-sm inline-flex items-center gap-2 bg-cs-orange px-6 py-2.5 text-xl font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a]"
            >
              <Play className="h-5 w-5 fill-current" /> {copy.start}
            </button>
          </div>
        </div>
      ) : playing ? (
        <div className="space-y-2">
          <div className="h-1.5 overflow-hidden bg-cs-bg" aria-hidden="true">
            <div
              className={`h-full transition-[width] duration-200 ease-linear ${secondsLeft <= 10 ? "bg-cs-red" : "bg-cs-orange"}`}
              style={{ width: `${((deadline - now) / (ROUND_SECONDS * 1000)) * 100}%` }}
            />
          </div>
          <div className="relative">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
              className="cs-cut-sm flex items-center gap-2 border-2 border-cs-line bg-cs-surface px-3 focus-within:border-cs-orange"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => changeInput(event.target.value)}
                onKeyDown={(event) => {
                  if (!suggestions.length) return;
                  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                    event.preventDefault();
                    const step = event.key === "ArrowDown" ? 1 : -1;
                    setHighlight((highlight + step + suggestions.length) % suggestions.length);
                  }
                  if (event.key === "Escape") changeInput("");
                }}
                placeholder={copy.placeholder}
                aria-label={copy.inputLabel}
                aria-autocomplete="list"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                className="w-full bg-transparent py-3 text-lg font-bold uppercase tracking-wide outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-cs-text/35"
              />
            </form>
            {suggestions.length ? (
              <ul className="absolute inset-x-0 top-full z-20 mt-1 border-2 border-cs-line bg-cs-panel shadow-2xl shadow-black/60" role="listbox">
                {suggestions.map((player, index) => (
                  <li key={player.id} role="option" aria-selected={index === highlight}>
                    <button
                      type="button"
                      // mousedown sem foco: o teclado do celular não fecha entre um nome e outro.
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => submit(player)}
                      onMouseEnter={() => setHighlight(index)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition ${index === highlight ? "bg-cs-raised text-cs-orange" : ""}`}
                    >
                      <span className="text-lg font-bold uppercase tracking-wide">{player.nickname}</span>
                      <span className="ml-auto text-lg leading-none">{getCountryFlag(player.nationality)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {feedback ? (
            <p className={`inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider ${feedback.good ? "text-cs-green" : "text-cs-gold"}`}>
              {feedback.good ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />} {feedback.text}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-4 text-center">
            <Trophy className="mx-auto h-8 w-8 text-cs-orange" />
            <h2 className="text-3xl font-bold uppercase tracking-wider">{copy.timeUp}</h2>
            <p className="font-semibold text-cs-text/70">{copy.result(game.foundIds.length, answers.length)}</p>
            <p className="text-sm font-semibold text-cs-text/60">{copy.missed}</p>
            <ul className="flex flex-wrap justify-center gap-1.5">
              {answers
                .filter((player) => !game.foundIds.includes(player.id))
                .map((player) => (
                  <li key={player.id} className="cs-cut-sm bg-cs-raised px-2 py-1 text-xs font-bold uppercase tracking-wide text-cs-text/70">
                    {player.nickname}
                  </li>
                ))}
            </ul>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: copy.played, value: stats.played },
                { label: copy.best, value: stats.best },
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
              <ArchiveLink path="/60-seconds" />
            </div>
          </div>
        </div>
      )}

      {game.foundIds.length ? (
        <ul className="flex flex-wrap gap-1.5" aria-label={copy.found}>
          {game.foundIds.map((id) => (
            <li key={id} className="cs-cut-sm inline-flex items-center gap-1 border-l-4 border-cs-green bg-cs-surface px-2.5 py-1 text-sm font-bold uppercase">
              <Check className="h-3.5 w-3.5 text-cs-green" /> {nickname(id)}
            </li>
          ))}
        </ul>
      ) : null}

      {isOver && breakSeen ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
      {isOver && !breakSeen ? <PartnerBreakModal partner={partner} onDone={markBreakSeen} /> : null}
    </main>
  );
}
