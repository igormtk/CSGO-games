import { useState, useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setPlayers } from "@/redux/slices/guessName";
import { getPlayers } from "@/services/public-api/players/getAllPlayers";
import { shuffleArray } from "@/utils/utils";

export const useGamePlayers = () => {
  const [players, setPlayersState] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchPlayers = async () => {
      // Fetch players from the API
      const playersData = await getPlayers();
      // Set the players in the Redux store
      dispatch(setPlayers(playersData));
      // Set the players in the local state
      setPlayersState(playersData);
    };
    fetchPlayers();
  }, [dispatch]);

  const selectPlayers = (players: any[]) => {
    const selectedPlayers = shuffleArray([...players]).slice(0, 4);
    return selectedPlayers;
  };

  return { players, selectPlayers };
};
