"use client";

import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { Check, Copy, Crown, Heart, Play, RotateCcw, SkipForward, Sparkles, Timer, Users } from "lucide-react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { csPlayers } from "@/data/csBingoDatabase";
import type { CsPlayer } from "@/data/csBingoDatabase";
import { CriterionIcon } from "@/components/bingo/CriterionIcon";
import { GRID_SIZE, createBoard, createPlayerQueue, playerFitsCell } from "@/lib/bingo/board";
import { comboJoiners, getCellCopy, getCriterionCopy } from "@/lib/bingo/copy";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { getSupabase } from "@/lib/supabase";
import { useHydrated } from "@/lib/useHydrated";

// Mesmas regras do desafio diário; a cartela e o baralho saem do código da sala e da rodada.
const MAX_LIVES = 2;
const POINTS_PER_HIT = 100;
const PERFECT_BONUS = 300;
const NAME_KEY = "cs-player-name";
const MAX_NAME_LENGTH = 16;
// Sem letras e números parecidos (0/O, 1/I) para o código ser fácil de ditar.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 5;
// Modo contra o relógio: decidido na criação da sala e igual para todas as rodadas dela.
const SECONDS_PER_NAME = 10;

type RoomMode = "classic" | "timed";

// O que cada jogador publica no canal da sala (Supabase Realtime Presence).
type PlayerState = {
  id: string;
  name: string;
  joinedAt: number;
  round: number;
  filled: number;
  points: number;
  lives: number;
  done: boolean;
  finishedAt?: number;
  // Modo da sala que este jogador conhece; quem entra adota o do anfitrião.
  mode?: RoomMode;
};

const multiplayerCopy = {
  pt: {
    eyebrow: "CS Bingo · Multiplayer",
    title: "Jogue contra os amigos",
    intro: "Todos da sala recebem a mesma cartela e os mesmos nomes. Ganha quem fizer mais pontos; no empate, quem terminar primeiro.",
    nameLabel: "Seu apelido",
    namePlaceholder: "ex.: fallen_fan",
    create: "Criar sala",
    codeLabel: "Código da sala",
    join: "Entrar",
    or: "ou",
    room: "Sala",
    copyLink: "Copiar convite",
    linkCopied: "Link copiado!",
    players: "Jogadores",
    host: "anfitrião",
    you: "você",
    waitingHost: "Esperando o anfitrião começar a partida...",
    start: "Começar partida",
    newRound: "Nova rodada",
    round: "Rodada",
    currentName: "Nome da vez",
    skip: "Pular",
    wildcard: "Coringa",
    lives: "Vidas",
    points: "pts",
    youFinished: "Você terminou! Esperando os outros...",
    winner: (name: string) => `${name} venceu!`,
    final: "Resultado da rodada",
    connecting: "Conectando à sala...",
    connectionError: "Não foi possível conectar à sala. Verifique a internet e recarregue a página.",
    invalidCode: "O código tem 5 letras ou números.",
    leave: "Sair da sala",
    modeLabel: "Modo da sala",
    classicMode: "Clássico",
    classicHint: "Sem tempo por nome.",
    timedMode: "Contra o relógio",
    timedHint: `${SECONDS_PER_NAME} s por nome; quando acaba, o nome passa.`,
    timeUp: (player: string) => `Tempo esgotado: ${player} passou.`,
    hit: (player: string, cell: string) => `Boa! ${player} preenche ${cell}.`,
    miss: (player: string) => `${player} não cumpre essa casa. Você perdeu uma vida.`,
  },
  en: {
    eyebrow: "CS Bingo · Multiplayer",
    title: "Play against your friends",
    intro: "Everyone in the room gets the same board and the same names. Most points wins; on a tie, whoever finishes first.",
    nameLabel: "Your nickname",
    namePlaceholder: "e.g. fallen_fan",
    create: "Create room",
    codeLabel: "Room code",
    join: "Join",
    or: "or",
    room: "Room",
    copyLink: "Copy invite",
    linkCopied: "Link copied!",
    players: "Players",
    host: "host",
    you: "you",
    waitingHost: "Waiting for the host to start the game...",
    start: "Start game",
    newRound: "New round",
    round: "Round",
    currentName: "Current name",
    skip: "Skip",
    wildcard: "Wildcard",
    lives: "Lives",
    points: "pts",
    youFinished: "You're done! Waiting for the others...",
    winner: (name: string) => `${name} wins!`,
    final: "Round result",
    connecting: "Connecting to the room...",
    connectionError: "Couldn't connect to the room. Check your connection and reload the page.",
    invalidCode: "The code has 5 letters or numbers.",
    leave: "Leave room",
    modeLabel: "Room mode",
    classicMode: "Classic",
    classicHint: "No timer per name.",
    timedMode: "Against the clock",
    timedHint: `${SECONDS_PER_NAME} s per name; when it runs out, the name passes.`,
    timeUp: (player: string) => `Time's up: ${player} passed.`,
    hit: (player: string, cell: string) => `Nice! ${player} fills ${cell}.`,
    miss: (player: string) => `${player} doesn't fit that cell. You lost a life.`,
  },
  es: {
    eyebrow: "CS Bingo · Multijugador",
    title: "Juega contra tus amigos",
    intro: "Todos en la sala reciben el mismo cartón y los mismos nombres. Gana quien haga más puntos; en empate, quien termine primero.",
    nameLabel: "Tu apodo",
    namePlaceholder: "ej.: fallen_fan",
    create: "Crear sala",
    codeLabel: "Código de la sala",
    join: "Entrar",
    or: "o",
    room: "Sala",
    copyLink: "Copiar invitación",
    linkCopied: "¡Enlace copiado!",
    players: "Jugadores",
    host: "anfitrión",
    you: "tú",
    waitingHost: "Esperando a que el anfitrión empiece la partida...",
    start: "Empezar partida",
    newRound: "Nueva ronda",
    round: "Ronda",
    currentName: "Nombre actual",
    skip: "Saltar",
    wildcard: "Comodín",
    lives: "Vidas",
    points: "pts",
    youFinished: "¡Terminaste! Esperando a los demás...",
    winner: (name: string) => `¡${name} gana!`,
    final: "Resultado de la ronda",
    connecting: "Conectando a la sala...",
    connectionError: "No se pudo conectar a la sala. Revisa tu conexión y recarga la página.",
    invalidCode: "El código tiene 5 letras o números.",
    leave: "Salir de la sala",
    modeLabel: "Modo de la sala",
    classicMode: "Clásico",
    classicHint: "Sin tiempo por nombre.",
    timedMode: "Contrarreloj",
    timedHint: `${SECONDS_PER_NAME} s por nombre; cuando se acaba, el nombre pasa.`,
    timeUp: (player: string) => `Se acabó el tiempo: ${player} pasó.`,
    hit: (player: string, cell: string) => `¡Bien! ${player} llena ${cell}.`,
    miss: (player: string) => `${player} no cumple esa casilla. Perdiste una vida.`,
  },
} satisfies Record<Language, unknown>;

type MultiplayerCopy = (typeof multiplayerCopy)["pt"];

const randomCode = () =>
  Array.from(crypto.getRandomValues(new Uint32Array(CODE_LENGTH)), (value) => CODE_ALPHABET[value % CODE_ALPHABET.length]).join("");

const normalizeCode = (value: string) =>
  value
    .toUpperCase()
    .split("")
    .filter((char) => CODE_ALPHABET.includes(char))
    .join("")
    .slice(0, CODE_LENGTH);

const readName = () => {
  try {
    return window.localStorage.getItem(NAME_KEY) ?? "";
  } catch {
    return "";
  }
};

const saveName = (name: string) => {
  try {
    window.localStorage.setItem(NAME_KEY, name);
  } catch {
    // Sem armazenamento: o apelido vale só nesta visita.
  }
};

// Horário de fim da partida, chamado só nas jogadas (fora da renderização).
const timestamp = () => Date.now();

const readRoomFromUrl = () => normalizeCode(new URLSearchParams(window.location.search).get("sala") ?? "");

// O link de convite leva o modo da sala (?modo=timed); quem digita só o código recebe pelo canal.
const readModeFromUrl = (): RoomMode | undefined => {
  const value = new URLSearchParams(window.location.search).get("modo");
  return value === "timed" || value === "classic" ? value : undefined;
};

const roomUrl = (code: string, mode?: RoomMode) => `/bingo/multiplayer?sala=${code}${mode ? `&modo=${mode}` : ""}`;

// Mais pontos primeiro; no empate, quem terminou antes.
const rankPlayers = (players: PlayerState[]) =>
  [...players].sort((a, b) => b.points - a.points || (a.finishedAt ?? Infinity) - (b.finishedAt ?? Infinity));

export default function BingoMultiplayerPage() {
  const language = useLanguage();
  const copy = multiplayerCopy[language];
  useDocumentTitle(`${copy.eyebrow} · CS Games`);
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-3 px-4 py-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
        <p className="font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </main>
    );
  }

  return <Multiplayer copy={copy} language={language} />;
}

function Multiplayer({ copy, language }: { copy: MultiplayerCopy; language: Language }) {
  const [name, setName] = useState(readName);
  const [room, setRoom] = useState(readRoomFromUrl);
  const [joined, setJoined] = useState(() => Boolean(readRoomFromUrl() && readName().trim()));
  const [roomMode, setRoomMode] = useState<RoomMode | undefined>(readModeFromUrl);
  const [createMode, setCreateMode] = useState<RoomMode>("classic");

  // Criar sala leva o modo escolhido; entrar por código deixa o modo vir da sala.
  const enterRoom = (code: string, mode?: RoomMode) => {
    const cleanName = name.trim().slice(0, MAX_NAME_LENGTH);
    if (!cleanName || code.length !== CODE_LENGTH) return;
    saveName(cleanName);
    setName(cleanName);
    setRoom(code);
    setRoomMode(mode);
    setJoined(true);
    window.history.replaceState(null, "", roomUrl(code, mode));
  };

  const leaveRoom = () => {
    setJoined(false);
    setRoom("");
    window.history.replaceState(null, "", "/bingo/multiplayer");
  };

  if (joined && room) {
    return (
      <Room key={room} code={room} name={name} initialMode={roomMode} copy={copy} language={language} onLeave={leaveRoom} />
    );
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-4 px-4 py-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">{copy.eyebrow}</p>
        <h1 className="text-3xl font-bold uppercase leading-none tracking-wide">{copy.title}</h1>
        <p className="mt-2 font-semibold leading-6 text-cs-text/70">{copy.intro}</p>
      </div>
      <div className="cs-cut space-y-4 bg-cs-surface p-5">
        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-cs-text/60">{copy.nameLabel}</span>
          <input
            value={name}
            onChange={(event) => setName(event.target.value.slice(0, MAX_NAME_LENGTH))}
            placeholder={copy.namePlaceholder}
            maxLength={MAX_NAME_LENGTH}
            className="cs-cut-sm w-full border-2 border-cs-line bg-cs-bg px-3 py-2.5 text-lg font-bold outline-none focus:border-cs-orange"
          />
        </label>
        <fieldset className="space-y-1">
          <legend className="text-xs font-bold uppercase tracking-wider text-cs-text/60">{copy.modeLabel}</legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["classic", copy.classicMode, copy.classicHint],
                ["timed", copy.timedMode, copy.timedHint],
              ] as const
            ).map(([value, label, hint]) => (
              <button
                key={value}
                type="button"
                onClick={() => setCreateMode(value)}
                aria-pressed={createMode === value}
                className={`cs-cut-sm flex flex-col items-start gap-0.5 border-l-4 px-3 py-2 text-left transition ${
                  createMode === value ? "border-cs-orange bg-cs-raised" : "border-cs-line bg-cs-bg hover:bg-cs-raised"
                }`}
              >
                <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide">
                  {value === "timed" ? <Timer className="h-4 w-4 text-cs-orange" /> : <Play className="h-4 w-4 text-cs-orange" />}
                  {label}
                </span>
                <span className="text-xs font-semibold leading-4 text-cs-text/55">{hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          disabled={!name.trim()}
          onClick={() => enterRoom(randomCode(), createMode)}
          className="cs-cut-sm flex w-full items-center justify-center gap-2 bg-cs-orange px-4 py-3 text-lg font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a] disabled:opacity-40"
        >
          <Users className="h-5 w-5" /> {copy.create}
        </button>
        <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-cs-text/40">{copy.or}</p>
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            enterRoom(room);
          }}
        >
          <input
            value={room}
            onChange={(event) => setRoom(normalizeCode(event.target.value))}
            placeholder={copy.codeLabel}
            aria-label={copy.codeLabel}
            className="cs-cut-sm min-w-0 flex-1 border-2 border-cs-line bg-cs-bg px-3 py-2.5 text-lg font-bold uppercase tracking-[0.3em] outline-none focus:border-cs-orange"
          />
          <button
            type="submit"
            disabled={!name.trim() || room.length !== CODE_LENGTH}
            className="cs-cut-sm bg-cs-raised px-4 text-base font-bold uppercase tracking-wider transition hover:text-cs-orange disabled:opacity-40"
          >
            {copy.join}
          </button>
        </form>
        {room && room.length !== CODE_LENGTH ? <p className="text-sm font-semibold text-cs-text/50">{copy.invalidCode}</p> : null}
      </div>
    </main>
  );
}

type Move = { picks: Record<number, string>; playerIndex: number; mistakes: number; wildcardUsed: boolean };
const emptyMove: Move = { picks: {}, playerIndex: 0, mistakes: 0, wildcardUsed: false };

function Room({
  code,
  name,
  initialMode,
  copy,
  language,
  onLeave,
}: {
  code: string;
  name: string;
  initialMode?: RoomMode;
  copy: MultiplayerCopy;
  language: Language;
  onLeave: () => void;
}) {
  const [playerId] = useState(() => crypto.randomUUID());
  const [joinedAt] = useState(timestamp);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [status, setStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [round, setRound] = useState(0);
  const [move, setMove] = useState<Move>(emptyMove);
  const [finishedAt, setFinishedAt] = useState<number>();
  const [message, setMessage] = useState<{ text: string; tone: "success" | "error" }>();
  const [linkCopied, setLinkCopied] = useState(false);
  const [knownMode, setKnownMode] = useState<RoomMode | undefined>(initialMode);
  // Prazo do nome da vez no contra o relógio (segue o relógio: trocar de aba não pausa).
  const [deadline, setDeadline] = useState<number>();
  const [now, setNow] = useState(timestamp);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const roundRef = useRef(0);

  const seedKey = `${code}:${round}`;
  const queue = useMemo(() => (round ? createPlayerQueue(seedKey) : []), [round, seedKey]);
  const board = useMemo(() => (round ? createBoard(seedKey, queue) : []), [round, seedKey, queue]);

  const filled = Object.keys(move.picks).length;
  const lives = MAX_LIVES - move.mistakes;
  const done = round > 0 && (filled === board.length || lives <= 0 || move.playerIndex >= queue.length);
  const points = filled * POINTS_PER_HIT + (filled === board.length && move.mistakes === 0 ? PERFECT_BONUS : 0);
  const currentPlayer: CsPlayer | undefined = done ? undefined : queue[move.playerIndex];

  // Anfitrião: quem está na sala há mais tempo (se ele sair, o próximo assume).
  const host = [...players].sort((a, b) => a.joinedAt - b.joinedAt)[0];
  // O modo da sala é o do anfitrião; até a presença chegar, vale o que veio do link ou da criação.
  const mode: RoomMode = host?.mode ?? knownMode ?? "classic";
  const me: PlayerState = {
    id: playerId,
    name,
    joinedAt,
    round,
    filled,
    points,
    lives,
    done,
    finishedAt,
    mode: host?.mode ?? knownMode,
  };
  const secondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : SECONDS_PER_NAME;
  const timeShare = deadline ? Math.max(0, (deadline - now) / (SECONDS_PER_NAME * 1000)) : 1;
  const isHost = host?.id === playerId;
  const roundPlayers = players.filter((player) => player.round === round);
  const everyoneDone = round > 0 && roundPlayers.length > 0 && roundPlayers.every((player) => player.done);
  const ranking = rankPlayers(roundPlayers);

  // Entra no canal da sala: presença (quem está e como vai) e aviso de início de rodada.
  useEffect(() => {
    const channel = getSupabase().channel(`bingo-room:${code}`, {
      config: { presence: { key: playerId }, broadcast: { self: true } },
    });
    channelRef.current = channel;

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PlayerState>();
        const list = Object.values(state).map((entries) => entries[0]);
        setPlayers(list);
        // Quem chega no meio de uma rodada entra nela (a do anfitrião), já com o relógio correndo.
        const currentHost = [...list].sort((a, b) => a.joinedAt - b.joinedAt)[0];
        if (roundRef.current === 0 && currentHost && currentHost.round > 0) {
          roundRef.current = currentHost.round;
          setRound(currentHost.round);
          if (currentHost.mode === "timed") setDeadline(timestamp() + SECONDS_PER_NAME * 1000);
        }
      })
      .on("broadcast", { event: "start" }, ({ payload }) => {
        const nextMode = payload.mode as RoomMode;
        roundRef.current = payload.round as number;
        setRound(payload.round as number);
        setKnownMode(nextMode);
        setMove(emptyMove);
        setFinishedAt(undefined);
        setMessage(undefined);
        setDeadline(nextMode === "timed" ? timestamp() + SECONDS_PER_NAME * 1000 : undefined);
        setNow(timestamp());
      })
      .subscribe((subscription) => {
        if (subscription === "SUBSCRIBED") setStatus("connected");
        if (subscription === "CHANNEL_ERROR" || subscription === "TIMED_OUT") setStatus("error");
      });

    return () => {
      channelRef.current = null;
      void getSupabase().removeChannel(channel);
    };
  }, [code, playerId]);

  // Publica o próprio estado sempre que ele muda (entrada, jogada, nova rodada).
  const meKey = JSON.stringify(me);
  useEffect(() => {
    if (status !== "connected") return;
    void channelRef.current?.track(JSON.parse(meKey) as PlayerState);
  }, [meKey, status]);

  const startRound = () => {
    void channelRef.current?.send({ type: "broadcast", event: "start", payload: { round: round + 1, mode } });
  };

  const applyMove = (next: Move) => {
    setMove(next);
    const nextFilled = Object.keys(next.picks).length;
    const ended = nextFilled === board.length || next.mistakes >= MAX_LIVES || next.playerIndex >= queue.length;
    if (ended && !finishedAt) setFinishedAt(timestamp());
    // Nome novo na tela: o relógio recomeça. Erro de casa mantém o mesmo nome e o mesmo prazo.
    if (mode === "timed") {
      if (ended) setDeadline(undefined);
      else if (next.playerIndex !== move.playerIndex) {
        setDeadline(timestamp() + SECONDS_PER_NAME * 1000);
        setNow(timestamp());
      }
    }
  };

  const onTimeUp = useEffectEvent(() => {
    if (!currentPlayer) return;
    setMessage({ text: copy.timeUp(currentPlayer.nickname), tone: "error" });
    applyMove({ ...move, playerIndex: move.playerIndex + 1 });
  });

  useEffect(() => {
    if (deadline === undefined) return;
    const interval = window.setInterval(() => {
      setNow(timestamp());
      if (timestamp() >= deadline) {
        window.clearInterval(interval);
        onTimeUp();
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [deadline]);

  const handleCellClick = (cellIndex: number) => {
    if (!currentPlayer || move.picks[cellIndex]) return;
    const cell = board[cellIndex];
    if (playerFitsCell(currentPlayer, cell)) {
      setMessage({ text: copy.hit(currentPlayer.nickname, getCellCopy(cell, language).label), tone: "success" });
      applyMove({ ...move, picks: { ...move.picks, [cellIndex]: currentPlayer.id }, playerIndex: move.playerIndex + 1 });
    } else {
      setMessage({ text: copy.miss(currentPlayer.nickname), tone: "error" });
      applyMove({ ...move, mistakes: move.mistakes + 1 });
    }
  };

  const handleSkip = () => {
    if (!currentPlayer) return;
    setMessage(undefined);
    applyMove({ ...move, playerIndex: move.playerIndex + 1 });
  };

  // Coringa: o nome entra em todas as casas livres que ele cumpre (uma vez por partida).
  const handleWildcard = () => {
    if (!currentPlayer || move.wildcardUsed) return;
    const picks = { ...move.picks };
    board.forEach((cell, index) => {
      if (!picks[index] && playerFitsCell(currentPlayer, cell)) picks[index] = currentPlayer.id;
    });
    setMessage(undefined);
    applyMove({ ...move, picks, playerIndex: move.playerIndex + 1, wildcardUsed: true });
  };

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${roomUrl(code, mode)}`);
      setLinkCopied(true);
    } catch {
      setLinkCopied(false);
    }
  };

  const nicknameById = (id: string) => csPlayers.find((player) => player.id === id)?.nickname ?? "";

  return (
    <main className="mx-auto flex min-h-full w-full max-w-5xl flex-col gap-3 px-3 py-3 lg:flex-row lg:items-start">
      <aside className="cs-cut w-full shrink-0 space-y-3 bg-cs-surface p-4 lg:w-72">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-cs-text/45">{copy.room}</p>
            <p className="text-3xl font-bold tracking-[0.25em] text-cs-orange">{code}</p>
          </div>
          <button
            type="button"
            onClick={copyInvite}
            className="cs-cut-sm inline-flex items-center gap-1.5 bg-cs-raised px-3 py-2 text-xs font-bold uppercase tracking-wider transition hover:text-cs-orange"
          >
            {linkCopied ? <Check className="h-4 w-4 text-cs-green" /> : <Copy className="h-4 w-4" />}
            {linkCopied ? copy.linkCopied : copy.copyLink}
          </button>
        </div>
        <p className="cs-cut-sm inline-flex items-center gap-1.5 bg-cs-bg px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-cs-text/70">
          {mode === "timed" ? <Timer className="h-3.5 w-3.5 text-cs-orange" /> : <Play className="h-3.5 w-3.5 text-cs-orange" />}
          {copy.modeLabel}: {mode === "timed" ? `${copy.timedMode} · ${SECONDS_PER_NAME}s` : copy.classicMode}
        </p>
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-cs-text/45">
            {copy.players} · {players.length}
            {round ? ` · ${copy.round} ${round}` : ""}
          </p>
          <ul className="space-y-1.5">
            {(round ? rankPlayers(players) : players).map((player) => (
              <li key={player.id} className="cs-cut-sm flex items-center gap-2 bg-cs-raised px-2.5 py-2">
                {round && everyoneDone && ranking[0]?.id === player.id ? <Crown className="h-4 w-4 shrink-0 text-cs-gold" /> : null}
                <span className="min-w-0 flex-1 truncate font-bold">
                  {player.name}
                  {player.id === playerId ? <span className="ml-1 text-xs text-cs-text/45">({copy.you})</span> : null}
                  {player.id === host?.id ? <span className="ml-1 text-xs text-cs-orange">· {copy.host}</span> : null}
                </span>
                {round && player.round === round ? (
                  <span className="flex shrink-0 items-center gap-2 text-sm font-bold tabular-nums">
                    <span className="text-cs-text/60">{player.filled}/{GRID_SIZE * GRID_SIZE}</span>
                    <span className="text-cs-green">{player.points}</span>
                    <span className="flex">
                      {Array.from({ length: MAX_LIVES }, (_, heart) => (
                        <Heart key={heart} className={`h-3.5 w-3.5 ${heart < player.lives ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
                      ))}
                    </span>
                    {player.done ? <Check className="h-4 w-4 text-cs-green" /> : null}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        {isHost && (round === 0 || everyoneDone) ? (
          <button
            type="button"
            onClick={startRound}
            disabled={status !== "connected"}
            className="cs-cut-sm flex w-full items-center justify-center gap-2 bg-cs-orange px-4 py-2.5 text-base font-bold uppercase tracking-wider text-cs-bg transition hover:bg-[#ffb85a] disabled:opacity-40"
          >
            {round === 0 ? <Play className="h-4 w-4 fill-current" /> : <RotateCcw className="h-4 w-4" />}
            {round === 0 ? copy.start : copy.newRound}
          </button>
        ) : null}
        <button type="button" onClick={onLeave} className="w-full text-xs font-bold uppercase tracking-wider text-cs-text/40 hover:text-cs-red">
          {copy.leave}
        </button>
      </aside>

      <section className="min-w-0 flex-1 space-y-3">
        {status === "connecting" ? <p className="cs-cut-sm bg-cs-surface p-4 font-semibold text-cs-text/70">{copy.connecting}</p> : null}
        {status === "error" ? <p className="cs-cut-sm border-l-4 border-cs-red bg-cs-surface p-4 font-semibold">{copy.connectionError}</p> : null}
        {status === "connected" && round === 0 ? (
          <div className="cs-cut space-y-2 bg-cs-surface p-5">
            <h1 className="text-2xl font-bold uppercase tracking-wide">{copy.title}</h1>
            <p className="font-semibold leading-6 text-cs-text/70">{isHost ? copy.intro : copy.waitingHost}</p>
          </div>
        ) : null}

        {round > 0 ? (
          <>
            {everyoneDone ? (
              <div className="cs-cut border-t-2 border-cs-gold bg-cs-surface p-4 text-center">
                <Crown className="mx-auto h-8 w-8 text-cs-gold" />
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-cs-text/45">{copy.final}</p>
                <h1 className="text-3xl font-bold uppercase tracking-wide">{ranking[0] ? copy.winner(ranking[0].name) : ""}</h1>
              </div>
            ) : done ? (
              <p className="cs-cut-sm border-l-4 border-cs-green bg-cs-surface p-4 font-bold">{copy.youFinished}</p>
            ) : currentPlayer ? (
              <div className="cs-cut flex items-center gap-3 border-b-2 border-cs-orange bg-cs-surface px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-cs-orange">
                    {copy.currentName} · {move.playerIndex + 1}/{queue.length}
                    {mode === "timed" ? (
                      <span
                        className={`inline-flex items-center gap-1 tracking-normal tabular-nums ${secondsLeft <= 3 ? "text-cs-red" : "text-cs-text/70"}`}
                        aria-live="polite"
                      >
                        <Timer className="h-3.5 w-3.5" /> {secondsLeft}s
                      </span>
                    ) : null}
                  </p>
                  <h1 className="truncate text-3xl font-bold uppercase leading-none tracking-wide">{currentPlayer.nickname}</h1>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-lg font-bold text-cs-green">
                    {points} <span className="text-xs text-cs-text/45">{copy.points}</span>
                  </span>
                  <span className="flex" aria-label={`${copy.lives}: ${lives}/${MAX_LIVES}`}>
                    {Array.from({ length: MAX_LIVES }, (_, heart) => (
                      <Heart key={heart} className={`h-4 w-4 ${heart < lives ? "fill-cs-red text-cs-red" : "text-cs-text/20"}`} />
                    ))}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col gap-1">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="cs-cut-sm inline-flex items-center gap-1 bg-cs-orange px-3 py-1.5 text-sm font-bold uppercase text-cs-bg hover:bg-[#ffb85a]"
                  >
                    {copy.skip} <SkipForward className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleWildcard}
                    disabled={move.wildcardUsed}
                    className="cs-cut-sm inline-flex items-center gap-1 bg-cs-bg px-3 py-1.5 text-xs font-bold uppercase text-cs-gold disabled:opacity-30"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> {copy.wildcard}
                  </button>
                </div>
              </div>
            ) : null}

            {mode === "timed" && currentPlayer ? (
              <div className="h-1 bg-cs-bg" aria-hidden="true">
                <div
                  className={`h-full transition-[width] duration-100 ease-linear ${timeShare <= 0.3 ? "bg-cs-red" : "bg-cs-orange"}`}
                  style={{ width: `${timeShare * 100}%` }}
                />
              </div>
            ) : null}

            {message && !done ? (
              <p
                className={`cs-cut-sm border-l-4 bg-cs-surface px-4 py-2 text-sm font-semibold ${message.tone === "success" ? "border-cs-green" : "border-cs-red"}`}
              >
                {message.text}
              </p>
            ) : null}

            <div className="grid grid-cols-4 gap-px bg-cs-line p-px [container-type:inline-size]">
              {board.map((cell, cellIndex) => {
                const pick = move.picks[cellIndex];
                return (
                  <button
                    key={cellIndex}
                    type="button"
                    onClick={() => handleCellClick(cellIndex)}
                    disabled={done || Boolean(pick)}
                    aria-label={getCellCopy(cell, language).label}
                    className={`grid aspect-square min-w-0 place-items-center p-1 text-center transition ${
                      pick ? "bg-[#203047]" : "bg-cs-surface hover:bg-cs-raised"
                    }`}
                  >
                    {pick ? (
                      <span className="space-y-1">
                        <Check className="mx-auto h-5 w-5 text-cs-green" />
                        <span className="block break-all text-[length:clamp(10px,3cqi,16px)] font-bold uppercase">{nicknameById(pick)}</span>
                      </span>
                    ) : (
                      <span className="min-w-0 space-y-1">
                        <span className="flex items-center justify-center gap-1">
                          {cell.map((criterion) => (
                            <CriterionIcon key={criterion.id} criterion={criterion} />
                          ))}
                        </span>
                        <span className="block break-words text-[length:clamp(9px,2.6cqi,15px)] font-bold uppercase leading-tight">
                          {getCriterionCopy(cell[0], language).label}
                          {cell[1] ? (
                            <span className="block text-cs-orange">
                              <span className="lowercase text-cs-text/45">{comboJoiners[language]}</span>{" "}
                              {getCriterionCopy(cell[1], language).label}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </section>
    </main>
  );
}
