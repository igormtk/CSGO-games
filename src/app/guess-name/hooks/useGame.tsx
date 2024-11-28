import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGameRecord } from "./useGameRecord";
import { useGamePlayers } from "./useGamePlayers";
import { useGameQuestion } from "./useGameQuestion";
import { useGameStatus } from "./useGameStatus";
import { startGame } from "@/redux/slices/guessName";

// Custom hook that manages the game logic and state
export const useGame = () => {
  const dispatch = useAppDispatch(); // Accessing the dispatch function from Redux
  const { players, question, score, start, modal } = useAppSelector((state) => state.game); // Accessing game data from Redux store
  const { record, createRecord } = useGameRecord(score); // Using the custom hook for managing game record
  const { selectPlayers } = useGamePlayers(); // Using the custom hook to handle players selection
  const { generateQuestion } = useGameQuestion(); // Using the custom hook to generate new game questions
  const { handleAnswer } = useGameStatus(players); // Using the custom hook for handling answers and game status

  // Function to handle starting the game
  const handleStartGame = useCallback(() => {
    if (players.length === 0) return; // Prevent starting the game if there are no players
    dispatch(startGame()); // Dispatching action to start the game
    const selectedPlayers = selectPlayers(players); // Selecting players to participate in the game
    generateQuestion(selectedPlayers); // Generating a question based on selected players
  }, [players, dispatch, selectPlayers, generateQuestion]);

  return {
    start,
    score,
    question,
    record,
    modal,
    createRecord,
    handleStartGame,
    handleAnswer,
  };
};
