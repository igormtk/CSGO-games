"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Flame, HelpCircle, Search, Share2, Trophy, X } from "lucide-react";
import { csPlayers, getTeamName } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { getCountryFlag } from "@/data/countryFlags";
import { getPartnerFor } from "@/data/partners";
import { PartnerSpot } from "@/components/partners/PartnerSpot";
import { TeamBadge } from "@/components/teams/TeamBadge";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import { useHydrated } from "@/lib/useHydrated";
import type { Language } from "@/lib/language";
import { getGameDateKey, getPreviousDateKey, getPuzzleNumber, hashDate, seededShuffle } from "@/lib/daily";

const MAX_GUESSES = 6;
// Depois desses erros, mostramos um time antigo do jogador como dica.
const HINT_AFTER_MISSES = 3;
const MAX_SUGGESTIONS = 6;
// Prefixo novo a cada mudança na ordem dos jogadores: palpites salvos apontariam para outro alvo.
const GAME_KEY_PREFIX = "cs-mystery-daily-v2";
const STATS_KEY = "cs-mystery-stats";
// Semente fixa da ordem dos jogadores: cada um aparece uma vez antes de qualquer repetição.
const ORDER_SEED = 4242;

type Tone = "hit" | "near" | "miss";

type Clue = {
  label: string;
  tone: Tone;
  content: React.ReactNode;
  // Para números: o jogador misterioso tem mais (up) ou menos (down)
  direction?: "up" | "down";
};

type PlayerStats = {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate?: string;
};

const emptyStats: PlayerStats = { played: 0, wins: 0, currentStreak: 0, maxStreak: 0 };

const mysteryCopy = {
  pt: {
    eyebrow: "Jogador misterioso",
    title: "Quem é o pro player?",
    streak: "Sequência de vitórias",
    howToPlay: "Como jogar",
    rulesIntro: `Um pro player novo por dia e ${MAX_GUESSES} palpites. Cada palpite mostra o quanto ele se parece com o jogador misterioso:`,
    green: "Verde",
    greenText: ": igual.",
    yellow: "Amarelo",
    yellowText:
      ": perto (o misterioso já jogou nesse time, é da mesma região, divide alguma função ou está a 1 de distância). As setas dizem se o número dele é maior ou menor.",
    rulesEnd: `Depois de ${HINT_AFTER_MISSES} erros aparece uma dica. O desafio vira à meia-noite (horário de Brasília).`,
    placeholder: (guess: number) => `Palpite ${guess} de ${MAX_GUESSES}: digite um nick`,
    inputLabel: "Nick do jogador",
    noResults: "Nenhum jogador encontrado.",
    hint: "Dica",
    playedFor: (team: string) => `Já jogou pela ${team}`,
    wonIn: (guesses: number) => `Acertou em ${guesses}/${MAX_GUESSES}`,
    lost: "Não foi dessa vez",
    careerTeams: "Times da carreira",
    played: "Jogos",
    wins: "Vitórias",
    bestStreak: "Melhor seq.",
    share: "Compartilhar resultado",
    copied: "Resultado copiado!",
    copyFailed: "Não foi possível copiar o resultado.",
    nextPlayer: "Novo jogador à meia-noite",
    more: "Mais",
    less: "Menos",
    empty: "Comece com qualquer jogador. Cada palpite revela pistas sobre o misterioso.",
    partnerLabel: "Publicidade",
    noTeam: "Sem time",
    clues: { team: "Time", country: "País", region: "Região", role: "Função", majors: "Majors", top20: "Top 20" },
    regions: { "Europe/CIS": "Europa/CEI", Europe: "Europa", International: "Internacional", "North America": "América do Norte", "South America": "América do Sul", "Middle East": "Oriente Médio", Asia: "Ásia", Oceania: "Oceania", Africa: "África" } as Record<string, string>,
  },
  en: {
    eyebrow: "Mystery player",
    title: "Who's the pro player?",
    streak: "Win streak",
    howToPlay: "How to play",
    rulesIntro: `A new pro player every day and ${MAX_GUESSES} guesses. Each guess shows how close it is to the mystery player:`,
    green: "Green",
    greenText: ": same.",
    yellow: "Yellow",
    yellowText:
      ": close (the mystery player has played for that team, is from the same region, shares a role or is 1 away). Arrows tell you whether their number is higher or lower.",
    rulesEnd: `After ${HINT_AFTER_MISSES} misses you get a hint. A new challenge arrives at midnight Brasília time (UTC−3).`,
    placeholder: (guess: number) => `Guess ${guess} of ${MAX_GUESSES}: type a nickname`,
    inputLabel: "Player nickname",
    noResults: "No player found.",
    hint: "Hint",
    playedFor: (team: string) => `Has played for ${team}`,
    wonIn: (guesses: number) => `Solved in ${guesses}/${MAX_GUESSES}`,
    lost: "Not this time",
    careerTeams: "Career teams",
    played: "Played",
    wins: "Wins",
    bestStreak: "Best streak",
    share: "Share result",
    copied: "Result copied!",
    copyFailed: "Could not copy the result.",
    nextPlayer: "New player at midnight",
    more: "Higher",
    less: "Lower",
    empty: "Start with any player. Each guess reveals clues about the mystery player.",
    partnerLabel: "Advertisement",
    noTeam: "No team",
    clues: { team: "Team", country: "Country", region: "Region", role: "Role", majors: "Majors", top20: "Top 20" },
    regions: { "Europe/CIS": "Europe/CIS", Europe: "Europe", International: "International", "North America": "North America", "South America": "South America", "Middle East": "Middle East", Asia: "Asia", Oceania: "Oceania", Africa: "Africa" } as Record<string, string>,
  },
  es: {
    eyebrow: "Jugador misterioso",
    title: "¿Quién es el pro player?",
    streak: "Racha de victorias",
    howToPlay: "Cómo jugar",
    rulesIntro: `Un pro player nuevo cada día y ${MAX_GUESSES} intentos. Cada intento muestra cuánto se parece al jugador misterioso:`,
    green: "Verde",
    greenText: ": igual.",
    yellow: "Amarillo",
    yellowText:
      ": cerca (el misterioso ya jugó en ese equipo, es de la misma región, comparte algún rol o está a 1 de distancia). Las flechas indican si su número es mayor o menor.",
    rulesEnd: `Después de ${HINT_AFTER_MISSES} errores aparece una pista. El desafío cambia a medianoche, hora de Brasilia (UTC−3).`,
    placeholder: (guess: number) => `Intento ${guess} de ${MAX_GUESSES}: escribe un nick`,
    inputLabel: "Nick del jugador",
    noResults: "No se encontró ningún jugador.",
    hint: "Pista",
    playedFor: (team: string) => `Ya jugó en ${team}`,
    wonIn: (guesses: number) => `Acertaste en ${guesses}/${MAX_GUESSES}`,
    lost: "No fue esta vez",
    careerTeams: "Equipos de su carrera",
    played: "Partidas",
    wins: "Victorias",
    bestStreak: "Mejor racha",
    share: "Compartir resultado",
    copied: "¡Resultado copiado!",
    copyFailed: "No se pudo copiar el resultado.",
    nextPlayer: "Nuevo jugador a medianoche",
    more: "Mayor",
    less: "Menor",
    empty: "Empieza con cualquier jugador. Cada intento revela pistas sobre el misterioso.",
    partnerLabel: "Publicidad",
    noTeam: "Sin equipo",
    clues: { team: "Equipo", country: "País", region: "Región", role: "Rol", majors: "Majors", top20: "Top 20" },
    regions: { "Europe/CIS": "Europa/CEI", Europe: "Europa", International: "Internacional", "North America": "Norteamérica", "South America": "Sudamérica", "Middle East": "Oriente Medio", Asia: "Asia", Oceania: "Oceanía", Africa: "África" } as Record<string, string>,
  },
} satisfies Record<Language, unknown>;

type MysteryCopy = (typeof mysteryCopy)["pt"];

// O alvo do dia é sempre um nome conhecido (Top 20 da HLTV ou campeão de Major); os palpites
// aceitam qualquer jogador da base.
const mysteryCandidates = csPlayers.filter((player) => player.hltvTop20Years.length > 0 || player.majorsWon > 0);
const playerOrder = seededShuffle(mysteryCandidates, ORDER_SEED);

const getMysteryPlayer = (dateKey: string) => {
  const puzzle = getPuzzleNumber(dateKey);
  return playerOrder[(((puzzle - 1) % playerOrder.length) + playerOrder.length) % playerOrder.length];
};

const compareNumbers = (guess: number, target: number) => ({
  tone: (guess === target ? "hit" : Math.abs(guess - target) <= 1 ? "near" : "miss") as Tone,
  direction: guess === target ? undefined : target > guess ? ("up" as const) : ("down" as const),
});

const getClues = (guess: CsPlayer, target: CsPlayer, copy: MysteryCopy): Clue[] => {
  const sameRoles =
    guess.roles.length === target.roles.length && guess.roles.every((role) => target.roles.includes(role));
  const sharesRole = guess.roles.some((role) => target.roles.includes(role));
  const majors = compareNumbers(guess.majorsWon, target.majorsWon);
  const top20 = compareNumbers(guess.hltvTop20Years.length, target.hltvTop20Years.length);

  return [
    {
      label: copy.clues.team,
      // Amarelo: o misterioso já jogou pelo time atual do palpite.
      tone:
        guess.currentTeam === target.currentTeam
          ? "hit"
          : guess.currentTeam && target.teams.includes(guess.currentTeam)
            ? "near"
            : "miss",
      content: guess.currentTeam ? (
        <TeamBadge teamId={guess.currentTeam} className="h-8 w-9 sm:h-11 sm:w-12" size={96} />
      ) : (
        <span className="text-[10px] font-bold uppercase">{copy.noTeam}</span>
      ),
    },
    {
      label: copy.clues.country,
      tone: guess.nationality === target.nationality ? "hit" : guess.region === target.region ? "near" : "miss",
      content: <span className="text-2xl leading-none">{getCountryFlag(guess.nationality)}</span>,
    },
    {
      label: copy.clues.region,
      tone: guess.region === target.region ? "hit" : "miss",
      content: <span className="break-words text-[10px] font-bold uppercase leading-tight">{copy.regions[guess.region] ?? guess.region}</span>,
    },
    {
      label: copy.clues.role,
      tone: sameRoles ? "hit" : sharesRole ? "near" : "miss",
      content: (
        <span className="break-words text-[10px] font-bold uppercase leading-tight">
          {guess.roles.map((role) => (role === "Entry fragger" ? "Entry" : role)).join(" ")}
        </span>
      ),
    },
    { label: copy.clues.majors, ...majors, content: <span className="text-xl font-bold">{guess.majorsWon}</span> },
    { label: copy.clues.top20, ...top20, content: <span className="text-xl font-bold">{guess.hltvTop20Years.length}</span> },
  ];
};

const toneClass: Record<Tone, string> = {
  hit: "border-cs-green bg-cs-green/25 text-[#e3f5d8]",
  near: "border-cs-gold bg-cs-gold/20 text-[#f5e3b5]",
  miss: "border-cs-line bg-cs-raised text-cs-text/70",
};

const toneEmoji: Record<Tone, string> = { hit: "🟩", near: "🟨", miss: "⬛" };

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

export default function MysteryPlayerPage() {
  const copy = mysteryCopy[useLanguage()];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();

  // A data e o progresso salvo só existem no navegador: o servidor manda só o título (que
  // buscadores e IAs leem) e o jogo monta no cliente, já com tudo carregado.
  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-2xl flex-col gap-3 px-4 py-4 sm:gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
          <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{copy.title}</h1>
        </div>
      </main>
    );
  }

  return <MysteryGame copy={copy} />;
}

function MysteryGame({ copy }: { copy: MysteryCopy }) {
  const [dateKey] = useState(getGameDateKey);
  const [guessIds, setGuessIds] = useState<string[]>(
    () => readJson<{ guessIds: string[] }>(`${GAME_KEY_PREFIX}-${dateKey}`, { guessIds: [] }).guessIds
  );
  const [stats, setStats] = useState<PlayerStats>(() => readJson(STATS_KEY, emptyStats));
  const [search, setSearch] = useState("");
  const [shareStatus, setShareStatus] = useState<"copied" | "failed">();
  const [showRules, setShowRules] = useState(false);

  const target = useMemo(() => getMysteryPlayer(dateKey), [dateKey]);
  const guesses = useMemo(
    () => guessIds.map((id) => csPlayers.find((player) => player.id === id)).filter((player): player is CsPlayer => Boolean(player)),
    [guessIds]
  );
  const won = Boolean(target && guessIds.includes(target.id));
  const isOver = won || guesses.length >= MAX_GUESSES;
  const misses = guesses.length - (won ? 1 : 0);
  const hintTeam = target?.teams.find((teamId) => teamId !== target.currentTeam);

  const suggestions = useMemo(() => {
    const query = normalize(search.trim());
    if (!query) return [];
    return csPlayers
      .filter((player) => !guessIds.includes(player.id))
      .filter((player) => normalize(player.nickname).includes(query) || normalize(player.fullName).includes(query))
      .sort((a, b) => Number(normalize(b.nickname).startsWith(query)) - Number(normalize(a.nickname).startsWith(query)))
      .slice(0, MAX_SUGGESTIONS);
  }, [search, guessIds]);

  const partner = useMemo(
    () => getPartnerFor("post-game", dateKey, hashDate(dateKey)),
    [dateKey]
  );

  const handleGuess = (player: CsPlayer) => {
    if (isOver) return;
    const nextGuessIds = [...guessIds, player.id];
    setGuessIds(nextGuessIds);
    setSearch("");
    writeJson(`${GAME_KEY_PREFIX}-${dateKey}`, { guessIds: nextGuessIds });

    const nextWon = player.id === target.id;
    if (nextWon || nextGuessIds.length >= MAX_GUESSES) {
      const nextStats = recordGame(stats, dateKey, nextWon);
      setStats(nextStats);
      writeJson(STATS_KEY, nextStats);
    }
  };

  const handleShare = async () => {
    const rows = guesses.map((guess) => getClues(guess, target, copy).map((clue) => toneEmoji[clue.tone]).join("")).join("\n");
    const shareText = [
      `CS Games · ${copy.eyebrow} #${getPuzzleNumber(dateKey)}`,
      `${won ? guesses.length : "X"}/${MAX_GUESSES} · 🔥 ${stats.currentStreak}`,
      rows,
      `${window.location.origin}/jogador-misterioso`,
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
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
            {copy.eyebrow} · #{getPuzzleNumber(dateKey)}
          </p>
          <h1 className="text-3xl font-bold uppercase leading-none tracking-wide sm:text-4xl">{copy.title}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="cs-cut-sm inline-flex items-center gap-1 bg-cs-surface px-2.5 py-1.5 text-sm font-bold" title={copy.streak}>
            <Flame className="h-4 w-4 text-cs-orange" /> {stats.currentStreak}
          </span>
          <button
            type="button"
            onClick={() => setShowRules((value) => !value)}
            aria-expanded={showRules}
            aria-label={copy.howToPlay}
            className="cs-cut-sm bg-cs-surface p-1.5 text-cs-text/70 transition hover:text-cs-orange"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showRules ? (
        <div className="cs-cut-sm space-y-1 border-l-4 border-cs-orange bg-cs-surface p-3 text-sm font-semibold leading-6 text-cs-text/75">
          <p>{copy.rulesIntro}</p>
          <p>
            <span className="text-cs-green">{copy.green}</span>
            {copy.greenText} <span className="text-cs-gold">{copy.yellow}</span>
            {copy.yellowText}
          </p>
          <p>{copy.rulesEnd}</p>
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
              placeholder={copy.placeholder(guesses.length + 1)}
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
                    {player.currentTeam ? (
                      <TeamBadge teamId={player.currentTeam} className="h-6 w-6" size={48} />
                    ) : (
                      <span className="h-6 w-6" />
                    )}
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
      ) : null}

      {!isOver && misses >= HINT_AFTER_MISSES && hintTeam ? (
        <div className="cs-cut-sm flex items-center gap-3 border-l-4 border-cs-gold bg-cs-surface px-3 py-2 text-sm font-bold uppercase tracking-wide">
          <span className="text-cs-gold">{copy.hint}</span>
          <TeamBadge teamId={hintTeam} className="h-6 w-7" size={56} />
          <span>{copy.playedFor(getTeamName(hintTeam))}</span>
        </div>
      ) : null}

      {isOver ? (
        <div className="cs-cut w-full bg-cs-line p-[2px] shadow-2xl shadow-black/50">
          <div className="cs-cut space-y-3 bg-cs-surface p-4 text-center">
            {won ? <Trophy className="mx-auto h-8 w-8 text-cs-orange" /> : <X className="mx-auto h-8 w-8 text-cs-red" />}
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cs-text/60">
              {won ? copy.wonIn(guesses.length) : copy.lost}
            </p>
            <div className="flex items-center justify-center gap-3">
              {target.currentTeam ? <TeamBadge teamId={target.currentTeam} className="h-12 w-12" size={96} /> : null}
              <div className="text-left">
                <h2 className="text-4xl font-bold uppercase leading-none tracking-wide">{target.nickname}</h2>
                <p className="text-sm font-semibold text-cs-text/60">
                  {getCountryFlag(target.nationality)} {target.fullName}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2" aria-label={copy.careerTeams}>
              {target.teams.map((teamId) => (
                <TeamBadge key={teamId} teamId={teamId} className="h-7 w-7" size={56} />
              ))}
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: copy.played, value: stats.played },
                { label: copy.wins, value: stats.played ? `${Math.round((stats.wins / stats.played) * 100)}%` : "0%" },
                { label: copy.bestStreak, value: stats.maxStreak },
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
              <p className="text-sm font-semibold text-cs-text/70">
                {shareStatus === "copied" ? copy.copied : copy.copyFailed}
              </p>
            ) : null}
            <p className="text-xs font-semibold uppercase tracking-wider text-cs-text/45">{copy.nextPlayer}</p>
          </div>
        </div>
      ) : null}

      {guesses.length ? (
        <div className="space-y-2">
          <div className="grid grid-cols-6 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-cs-text/45 sm:gap-1.5">
            {getClues(guesses[0], target, copy).map((clue) => (
              <span key={clue.label}>{clue.label}</span>
            ))}
          </div>
          {[...guesses].reverse().map((guess) => (
            <div key={guess.id}>
              <p className="mb-0.5 text-sm font-bold uppercase tracking-wide">{guess.nickname}</p>
              <div className="grid grid-cols-6 gap-1 sm:gap-1.5">
                {getClues(guess, target, copy).map((clue) => (
                  <div
                    key={clue.label}
                    title={clue.label}
                    className={`relative grid aspect-square min-w-0 place-items-center overflow-hidden border-2 p-1 text-center ${toneClass[clue.tone]}`}
                  >
                    {clue.content}
                    {clue.direction ? (
                      <span className="absolute bottom-0.5 right-0.5" aria-label={clue.direction === "up" ? copy.more : copy.less}>
                        {clue.direction === "up" ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
                      </span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-sm font-semibold text-cs-text/50">
          {copy.empty}
        </p>
      )}

      {isOver && partner ? <PartnerSpot partner={partner} label={copy.partnerLabel} variant="card" /> : null}
    </main>
  );
}
