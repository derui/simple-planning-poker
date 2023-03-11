import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import {
  giveUp,
  giveUpSuccess,
  handCardSuccess,
  leaveGameSuccess,
  notifyGameChanges,
  openGameSuccess,
  handCard,
  leaveGame,
  joinGame,
  openGame,
  changeUserMode,
  changeUserModeSuccess,
  showDownSuccess,
  newRoundSuccess,
  createGame,
  createGameSuccess,
  createGameFailure,
  initializeCreatingGame,
} from "../actions/game";
import * as Game from "@/domains/game";

interface GameState {
  currentGame: Game.T | null;
  loading: boolean;
  status: {
    creating: "prepared" | "creating" | "created" | "failed";
  };
}

const initialState = {
  currentGame: null,
  loading: false,
  status: {
    creating: "prepared",
  },
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
    builder.addCase(showDownSuccess, updateCurrentGame);
    builder.addCase(newRoundSuccess, updateCurrentGame);
    builder.addCase(openGameSuccess, (draft, { payload }) => {
      draft.currentGame = payload.game;
      draft.loading = false;
    });

    builder.addCase(leaveGameSuccess, (state) => {
      state.currentGame = null;
      state.loading = false;
    });

    builder.addCase(createGame, (draft) => {
      draft.status.creating = "creating";
    });
    builder.addCase(createGameFailure, (draft) => {
      draft.status.creating = "failed";
    });
    builder.addCase(createGameSuccess, (draft) => {
      draft.status.creating = "created";
    });
    builder.addCase(initializeCreatingGame, (draft) => {
      draft.status.creating = "prepared";
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
