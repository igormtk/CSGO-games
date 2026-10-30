"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, Grid3x3, Route, ScanFace, Shirt, UserSearch } from "lucide-react";
import { getArchiveDates, getGameDateKey, getPuzzleNumber } from "@/lib/daily";
import { cn } from "@/lib/utils";
import { useDocumentTitle, useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";
import { useHydrated } from "@/lib/useHydrated";

// Jogos diários com arquivo. storageKey é o prefixo do progresso salvo de cada jogo, usado só para
// marcar os dias já jogados.
const dailyGames = [
  { path: "/bingo", storageKey: "cs-bingo-daily-v4", icon: Grid3x3, title: { pt: "CS Bingo", en: "CS Bingo", es: "CS Bingo" } },
  {
    path: "/jogador-misterioso",
    storageKey: "cs-mystery-daily-v2",
    icon: ScanFace,
    title: { pt: "Jogador misterioso", en: "Mystery player", es: "Jugador misterioso" },
  },
  {
    path: "/career-path",
    storageKey: "cs-career-daily-v1",
    icon: Route,
    title: { pt: "Caminho de carreira", en: "Career path", es: "Camino de carrera" },
  },
  {
    path: "/guess-name",
    storageKey: "cs-guess-name-daily-v1",
    icon: UserSearch,
    title: { pt: "Adivinhe o jogador", en: "Guess the player", es: "Adivina el jugador" },
  },
  { path: "/lineup", storageKey: "cs-lineup-daily-v1", icon: Shirt, title: { pt: "Escalação", en: "Lineup", es: "Alineación" } },
];

const viewCopy: Record<Language, { title: string; intro: string; played: string; locale: string }> = {
  pt: {
    title: "Arquivo de desafios",
    intro: "Perdeu algum dia? Jogue os desafios diários anteriores de cada jogo. Eles não contam para a sequência.",
    played: "Jogado",
    locale: "pt-BR",
  },
  en: {
    title: "Challenge archive",
    intro: "Missed a day? Play the past daily challenges of each game. They don't count toward your streak.",
    played: "Played",
    locale: "en-US",
  },
  es: {
    title: "Archivo de desafíos",
    intro: "¿Te perdiste algún día? Juega los desafíos diarios anteriores de cada juego. No cuentan para la racha.",
    played: "Jugado",
    locale: "es-ES",
  },
};

const hasProgress = (key: string) => {
  try {
    return window.localStorage.getItem(key) !== null;
  } catch {
    return false;
  }
};

export function ArchiveView() {
  const language = useLanguage();
  const copy = viewCopy[language];
  useDocumentTitle(`${copy.title} · CS Games`);
  const hydrated = useHydrated();
  const requested = useSearchParams().get("game");
  const game = dailyGames.find((entry) => entry.path === requested) ?? dailyGames[0];

  return (
    <main className="mx-auto w-full max-w-4xl space-y-5 px-4 py-6 sm:py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold uppercase tracking-wide sm:text-4xl">{copy.title}</h1>
        <p className="text-lg font-semibold text-cs-text/65">{copy.intro}</p>
      </header>

      <nav className="flex flex-wrap gap-2" aria-label={copy.title}>
        {dailyGames.map((entry) => (
          <Link
            key={entry.path}
            href={`/archive?game=${encodeURIComponent(entry.path)}`}
            aria-current={entry === game ? "page" : undefined}
            className={cn(
              "cs-cut-sm inline-flex items-center gap-1.5 px-3 py-2 text-sm font-bold uppercase tracking-wider transition",
              entry === game ? "bg-cs-orange text-cs-bg" : "bg-cs-surface text-cs-text/70 hover:bg-cs-raised hover:text-cs-orange"
            )}
          >
            <entry.icon className="h-4 w-4" /> {entry.title[language]}
          </Link>
        ))}
      </nav>

      {/* As datas dependem do relógio e o "jogado" do navegador: só montam no cliente. */}
      {hydrated ? <ArchiveDays game={game} copy={copy} /> : null}
    </main>
  );
}

function ArchiveDays({ game, copy }: { game: (typeof dailyGames)[number]; copy: (typeof viewCopy)[Language] }) {
  const dates = getArchiveDates(getGameDateKey());
  const monthFormat = new Intl.DateTimeFormat(copy.locale, { month: "long", year: "numeric", timeZone: "UTC" });
  const months = new Map<string, string[]>();
  for (const date of dates) months.set(date.slice(0, 7), [...(months.get(date.slice(0, 7)) ?? []), date]);

  return (
    <div className="space-y-5">
      {[...months.entries()].map(([month, days]) => (
        <section key={month} className="space-y-2">
          <h2 className="text-lg font-bold uppercase tracking-wider text-cs-orange">{monthFormat.format(new Date(`${month}-01`))}</h2>
          <ul className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {days.map((date) => {
              const played = hasProgress(`${game.storageKey}-${date}`);
              return (
                <li key={date}>
                  <Link
                    href={`${game.path}?date=${date}`}
                    className={cn(
                      "cs-cut-sm flex h-full flex-col items-center px-2 py-2 text-center transition hover:bg-cs-raised",
                      played ? "bg-cs-panel text-cs-text/55" : "bg-cs-surface"
                    )}
                  >
                    <span className="text-xl font-bold leading-none">{Number(date.slice(8))}</span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cs-text/45">#{getPuzzleNumber(date)}</span>
                    {played ? (
                      <span className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] font-bold uppercase text-cs-green">
                        <Check className="h-3 w-3" /> {copy.played}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
