import { useCallback } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setQuestion } from "@/redux/slices/guessName";
import { shuffleArray } from "@/utils/utils";

export const useGameQuestion = () => {
  const dispatch = useAppDispatch();

  const generateQuestion = useCallback((players: any[]) => {
    if (!players || players.length === 0) return; // Verificação de segurança

    const correctPlayer = players[Math.floor(Math.random() * players.length)];
    let alternatives = shuffleArray(
      // Grants that the correct name is included
      Array.from(new Set([...players.map(player => player.CommonName), correctPlayer.CommonName]))
    );

    // get 4 random names (the correct name is included)
    alternatives = shuffleArray(alternatives).slice(0, 4);

    if (!alternatives.includes(correctPlayer.CommonName)) {
      // If the correct name is not included, add it on the 4th position
      alternatives[Math.floor(Math.random() * 4)] = correctPlayer.CommonName;
    }

    dispatch(
      setQuestion({
        correctPlayer,
        alternatives,
        matchName: correctPlayer.MatchName,
      })
    );
  }, [dispatch]);

  return { generateQuestion };
};
