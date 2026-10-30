"use client";

import { useSearchParams } from "next/navigation";
import { getGameDateKey, isArchiveDate } from "@/lib/daily";

// Data do desafio diário: a de hoje ou, com ?date=AAAA-MM-DD, um dia do arquivo. Partidas do
// arquivo ficam salvas por data, mas não contam para a sequência diária.
export const useDailyDate = () => {
  const requested = useSearchParams().get("date");
  const today = getGameDateKey();
  return isArchiveDate(requested, today) ? { dateKey: requested, archived: true } : { dateKey: today, archived: false };
};
