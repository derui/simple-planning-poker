import { createSlice } from "@reduxjs/toolkit";
import * as GamePlayer from "@/domains/game-player";
import {
  changeToInspectorSuccess,
  changeToNormalPlayerSuccess,
  giveUpSuccess,
  handCardSuccess,
  leaveGameSuccess,
  openGameSuccess,
} from "../actions/game-player";

interface GamePlayerState {
  currentPlayer: GamePlayer.T | null;
  otherPlayers: { [k: GamePlayer.Id]: GamePlayer.T };
}

const initialState = {
  currentPlayer: null,
  otherPlayers: {},
} as GamePlayerState satisfies GamePlayerState;

const slice = createSlice({
  name: "gamePlayer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer

    builder.addCase(giveUpSuccess, (draft, { payload }) => {
      if (!draft.currentPlayer) {
        return;
      }
      draft.currentPlayer = payload;
    });

    builder.addCase(handCardSuccess, (draft, { payload }) => {
      if (!draft.currentPlayer) {
        return;
      }
      draft.currentPlayer = payload;
    });

    builder.addCase(changeToInspectorSuccess, (draft, { payload }) => {
      if (!draft.currentPlayer) return;

      draft.currentPlayer = payload;
    });
    builder.addCase(changeToNormalPlayerSuccess, (draft, { payload }) => {
      if (!draft.currentPlayer) return;

      draft.currentPlayer = payload;
    });

    builder.addCase(leaveGameSuccess, (draft) => {
      draft.currentPlayer = null;
      draft.otherPlayers = {};
    });

    builder.addCase(openGameSuccess, (draft, { payload }) => {
      draft.currentPlayer = payload.player;
      draft.otherPlayers = payload.otherPlayers.reduce<{ [k: GamePlayer.Id]: GamePlayer.T }>((accum, player) => {
        accum[player.id] = player;
        return accum;
      }, {});
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
