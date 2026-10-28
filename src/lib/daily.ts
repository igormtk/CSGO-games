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

const FIRST_PUZZLE_DATE = "2026-01-01";

export const getPuzzleNumber = (dateKey: string) =>
  Math.floor((Date.parse(dateKey) - Date.parse(FIRST_PUZZLE_DATE)) / (24 * 60 * 60 * 1000)) + 1;

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
