"use client";

import Link from "@/components/LocalLink";
import { CalendarDays } from "lucide-react";
import { getPuzzleNumber } from "@/lib/daily";
import { useLanguage } from "@/lib/language";
import type { Language } from "@/lib/language";

const archiveCopy: Record<Language, { archive: string; note: string; today: string; more: string; playPast: string; locale: string }> = {
  pt: {
    archive: "Arquivo",
    note: "Desafio de um dia anterior: não conta para a sequência.",
    today: "Desafio de hoje",
    more: "Outros dias",
    playPast: "Jogar desafios anteriores",
    locale: "pt-BR",
  },
  en: {
    archive: "Archive",
    note: "A past day's challenge: it doesn't count toward your streak.",
    today: "Today's challenge",
    more: "Other days",
    playPast: "Play past challenges",
    locale: "en-US",
  },
  es: {
    archive: "Archivo",
    note: "Desafío de un día anterior: no cuenta para la racha.",
    today: "Desafío de hoy",
    more: "Otros días",
    playPast: "Jugar desafíos anteriores",
    locale: "es-ES",
  },
};

export const formatArchiveDate = (dateKey: string, language: Language) =>
  new Intl.DateTimeFormat(archiveCopy[language].locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(dateKey));

// Faixa no topo de um jogo diário aberto pelo arquivo (?date=...).
export function ArchiveBanner({ dateKey, path }: { dateKey: string; path: string }) {
  const language = useLanguage();
  const copy = archiveCopy[language];
  return (
    <div className="cs-cut-sm flex flex-wrap items-center gap-x-3 gap-y-1 border-l-4 border-cs-gold bg-cs-surface px-3 py-2 text-sm font-semibold">
      <span className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-cs-gold">
        <CalendarDays className="h-4 w-4" /> {copy.archive} · #{getPuzzleNumber(dateKey)} · {formatArchiveDate(dateKey, language)}
      </span>
      <span className="text-cs-text/55">{copy.note}</span>
      <span className="ml-auto flex gap-3 text-cs-orange">
        <Link href={path} className="underline">
          {copy.today}
        </Link>
        <Link href={`/archive?game=${encodeURIComponent(path)}`} className="underline">
          {copy.more}
        </Link>
      </span>
    </div>
  );
}

// Versão compacta da faixa, para barras de topo sem espaço (bingo).
export function ArchiveTag({ path }: { path: string }) {
  const copy = archiveCopy[useLanguage()];
  return (
    <Link
      href={`/archive?game=${encodeURIComponent(path)}`}
      title={copy.note}
      className="inline-flex items-center gap-1 font-bold text-cs-gold underline-offset-2 hover:underline"
    >
      <CalendarDays className="h-3.5 w-3.5" /> {copy.archive}
    </Link>
  );
}

// Convite no fim de um desafio para continuar jogando os dias anteriores.
export function ArchiveLink({ path }: { path: string }) {
  const copy = archiveCopy[useLanguage()];
  return (
    <Link
      href={`/archive?game=${encodeURIComponent(path)}`}
      className="cs-cut-sm inline-flex items-center justify-center gap-2 bg-cs-raised px-4 py-2.5 text-base font-bold uppercase tracking-wider text-cs-text transition hover:text-cs-orange"
    >
      <CalendarDays className="h-4 w-4" /> {copy.playPast}
    </Link>
  );
}
