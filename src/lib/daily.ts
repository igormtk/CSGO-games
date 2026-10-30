// Utilitários dos jogos diários: todos viram o dia juntos e sorteiam de forma determinística.

// O dia do jogo segue o horário de Brasília: o desafio vira à meia-noite para o público brasileiro.
export const GAME_TIME_ZONE = "America/Sao_Paulo";

export const getGameDateKey = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: GAME_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date()
  );

export const getPreviousDateKey = (dateKey: string) =>
  new Date(Date.parse(dateKey) - 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

// Hash djb2 limitado ao período do gerador: somar os códigos dos caracteres repetia a mesma
// cartela em dezenas de dias diferentes.
export const hashDate = (dateKey: string) =>
  dateKey.split("").reduce((hash, char) => (hash * 33 + char.charCodeAt(0)) % 233280, 5381) || 1;

export const FIRST_PUZZLE_DATE = "2026-01-01";

export const getPuzzleNumber = (dateKey: string) =>
  Math.floor((Date.parse(dateKey) - Date.parse(FIRST_PUZZLE_DATE)) / (24 * 60 * 60 * 1000)) + 1;

// Arquivo: qualquer dia entre o primeiro desafio e ontem. Hoje e o futuro ficam de fora (o de
// hoje é o desafio normal, e o futuro estragaria a surpresa).
export const isArchiveDate = (value: string | null | undefined, today: string): value is string =>
  Boolean(
    value &&
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(Date.parse(value)) &&
      new Date(Date.parse(value)).toISOString().slice(0, 10) === value &&
      value >= FIRST_PUZZLE_DATE &&
      value < today
  );

// Dias do arquivo, do mais recente (ontem) para o mais antigo.
export const getArchiveDates = (today: string) => {
  const dates: string[] = [];
  for (let date = getPreviousDateKey(today); date >= FIRST_PUZZLE_DATE; date = getPreviousDateKey(date)) dates.push(date);
  return dates;
};

export const seededShuffle = <T,>(items: T[], seed: number) => {
  const result = [...items];
  let state = seed || 1;

  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (state * 9301 + 49297) % 233280;
    const randomIndex = Math.floor((state / 233280) * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }

  return result;
};

const getGameClockSeconds = () => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: GAME_TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const part = (type: string) => Number(parts.find((entry) => entry.type === type)?.value ?? 0);
  return part("hour") * 3600 + part("minute") * 60 + part("second");
};

// "HH:MM:SS" até a meia-noite de Brasília, quando os desafios diários viram.
export const getTimeToNextPuzzle = () => {
  const totalSeconds = Math.max(24 * 60 * 60 - getGameClockSeconds(), 0);
  return [Math.floor(totalSeconds / 3600), Math.floor((totalSeconds % 3600) / 60), totalSeconds % 60]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");
};
