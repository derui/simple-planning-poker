import { createSlice } from "@reduxjs/toolkit";
import { openGameSuccess } from "../actions/game";
import { handCardSuccess } from "../actions/round";
import * as Round from "@/domains/round";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import * as UserHand from "@/domains/user-hand";
import { UserMode } from "@/domains/game-player";

interface RoundState {
  // current round that opened game
  instance?: {
    id: Round.Id;
    cards: Record<number, { card: Card.T; order: number }>;
    count: number;
    hands: Record<User.Id, UserHand.T>;
    joinedPlayers: Record<User.Id, UserMode>;
    finished: boolean;
  };
}

const initialState = {} as RoundState satisfies RoundState;

const slice = createSlice({
  name: "round",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(openGameSuccess, (draft, { payload }) => {
      draft.instance = {
        id: payload.game.round.id,
        cards: payload.game.cards.reduce<Record<number, { card: Card.T; order: number }>>((accum, card, index) => {
          accum[index] = { card, order: index };
          return accum;
        }, {}),
        count: payload.game.round.count,
        hands: payload.game.round.hands,
        joinedPlayers: payload.game.joinedPlayers.reduce<Record<User.Id, UserMode>>((accum, obj) => {
          accum[obj.user] = obj.mode;
          return accum;
        }, {}),
        finished: Round.isFinishedRound(payload.game.round),
      };
    });

    builder.addCase(handCardSuccess, (draft, { payload }) => {
      if (!draft.instance) {
        return;
      }

      draft.instance.hands = payload.hands;
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
