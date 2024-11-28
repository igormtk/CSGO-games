import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "@/interfaces/Player";

interface GameState {
  players: Player[];
  question: Question | null;
  score: number;
  start: boolean;
  modal: boolean;
}

interface Question {
  correctPlayer: Player;
  alternatives: string[];
  matchName: string;
}

const initialState: GameState = {
  players: [],
  question: null,
  score: 0,
  start: false,
  modal: false,
};

const guessNameSlice = createSlice({
  name: "guessName",
  initialState,
  reducers: {
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    setQuestion: (state, action: PayloadAction<Question>) => {
      state.question = action.payload;
    },

    openModal: (state, action: PayloadAction<boolean>) => {
      state.modal = action.payload;
    },
    incrementScore: (state) => {
      state.score += 1;
    },
    resetGame: (state) => {
      state.score = 0;
      state.question = null;
    },
    startGame: (state) => {
      state.start = true;
    },
    finishGame: (state) => {
      state.start = false;
    },
  },
});

export const {
  setPlayers,
  setQuestion,
  openModal,
  incrementScore,
  resetGame,
  startGame,
  finishGame,
} = guessNameSlice.actions;

export default guessNameSlice.reducer;
