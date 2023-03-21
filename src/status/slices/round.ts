import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import * as RoundAction from "../actions/round";
import * as Round from "@/domains/round";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import * as UserEstimation from "@/domains/user-estimation";

type State = "NotPrepared" | "Finished" | "ShowDownPrepared";

interface RoundState {
  // current round that opened game
  instance?: {
    id: Round.Id;
    cards: Record<Card.T, { card: Card.T; order: number }>;
    estimations: Record<User.Id, UserEstimation.T>;
    state: State;
    averagePoint: number;
  };
}

const initialState = {} as RoundState satisfies RoundState;

const normalize = function normalize(draft: WritableDraft<RoundState>, round: Round.T) {
  if (!draft.instance) {
    draft.instance = {
      id: round.id,
      cards:
        round.cards.reduce<Record<Card.T, { card: Card.T; order: number }>>((accum, card, index) => {
          accum[card] = { card, order: index };
          return accum;
        }, {}) ?? {},
      estimations: round.estimations,
      state: Round.isFinishedRound(round) ? "Finished" : Round.canShowDown(round) ? "ShowDownPrepared" : "NotPrepared",
      averagePoint: Round.isFinishedRound(round) ? Round.calculateAverage(round) : 0,
    };
  } else {
    draft.instance.id = round.id;
    draft.instance.cards =
      round.cards.reduce<Record<Card.T, { card: Card.T; order: number }>>((accum, card, index) => {
        accum[card] = { card, order: index };
        return accum;
      }, {}) ?? {};
    draft.instance.estimations = round.estimations;

    draft.instance.state = Round.isFinishedRound(round)
      ? "Finished"
      : Round.canShowDown(round)
      ? "ShowDownPrepared"
      : "NotPrepared";
  }

  draft.instance.averagePoint = Round.isFinishedRound(round) ? Round.calculateAverage(round) : 0;
};

const slice = createSlice({
  name: "round",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(RoundAction.estimateSuccess, (draft, { payload }) => {
      if (!draft.instance) {
        return;
      }

      normalize(draft, payload);
    });

    builder.addCase(RoundAction.giveUpSuccess, (draft, { payload }) => {
      if (!draft.instance) {
        return;
      }

      normalize(draft, payload);
    });

    builder.addCase(RoundAction.showDownSuccess, (draft, { payload }) => {
      if (!draft.instance) {
        return;
      }

      normalize(draft, payload);
    });

    builder.addCase(RoundAction.notifyRoundUpdated, (draft, { payload }) => {
      normalize(draft, payload);
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
