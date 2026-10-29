"use client";

import { useEffect, useState } from "react";
import { getTimeToNextPuzzle } from "@/lib/daily";

// Contagem regressiva até o próximo desafio diário (meia-noite de Brasília).
export function NextPuzzleCountdown() {
  const [timeLeft, setTimeLeft] = useState(getTimeToNextPuzzle);

  useEffect(() => {
    const interval = window.setInterval(() => setTimeLeft(getTimeToNextPuzzle()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return <p className="text-3xl font-bold tabular-nums text-cs-orange">{timeLeft}</p>;
}
