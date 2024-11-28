import { configureStore } from '@reduxjs/toolkit';
import guessNameReducer from './slices/guessName';

export const makeStore = () => {
  return configureStore({
    reducer: {
      game: guessNameReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
