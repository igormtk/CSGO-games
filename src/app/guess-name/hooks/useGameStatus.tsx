import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { incrementScore, finishGame, openModal } from "@/redux/slices/guessName";
import { useGameQuestion } from "./useGameQuestion";

export const useGameStatus = (players: any[]) => {
  const { generateQuestion } = useGameQuestion();
  const { score } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  const handleAnswer = useCallback(
    (answer: string, correctAnswer: string) => {
      if (answer === correctAnswer) {
        dispatch(incrementScore());
        generateQuestion(players); // Passing correct players

         // Checking if all questions are answered correctly (score == players.length)
         if (score + 1 === players.length) {
          dispatch(finishGame()); // Finishes the game
          dispatch(openModal(true)); // Opens the game over modal
        }
      } else {
        dispatch(openModal(true));
      }
    },
    [dispatch, generateQuestion, players, score]
  );

  return { handleAnswer };
};
