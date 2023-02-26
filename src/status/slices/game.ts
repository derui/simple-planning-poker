import { createSlice } from "@reduxjs/toolkit";
import * as Game from "@/domains/game";
import {
  giveUp,
  giveUpSuccess,
  handCardSuccess,
  joinGameSuccess,
  leaveGameSuccess,
  notifyGameChanges,
  openGameSuccess,
  handCard,
  leaveGame,
  joinGame,
  openGame,
  changeUserMode,
  changeUserModeSuccess,
} from "../actions/game";
import { WritableDraft } from "immer/dist/internal";

interface GameState {
  currentGame: Game.T | null;
  loading: boolean;
}

const initialState = {
  currentGame: null,
  loading: false,
} as GameState satisfies GameState;

const updateCurrentGame = function updateCurrentGame(state: WritableDraft<GameState>, action: { payload: Game.T }) {
  state.currentGame = action.payload;
  state.loading = false;
};

const loading = function updateCurrentGame(state: WritableDraft<GameState>) {
  state.loading = true;
};

const slice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(giveUp, loading);
    builder.addCase(handCard, loading);
    builder.addCase(changeUserMode, loading);
    builder.addCase(leaveGame, loading);
    builder.addCase(joinGame, loading);
    builder.addCase(openGame, loading);

    builder.addCase(giveUpSuccess, updateCurrentGame);
    builder.addCase(handCardSuccess, updateCurrentGame);
    builder.addCase(changeUserModeSuccess, updateCurrentGame);
    builder.addCase(notifyGameChanges, updateCurrentGame);
    builder.addCase(joinGameSuccess, updateCurrentGame);
    builder.addCase(openGameSuccess, updateCurrentGame);

    builder.addCase(leaveGameSuccess, (state) => {
      state.currentGame = null;
      state.loading = false;
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
