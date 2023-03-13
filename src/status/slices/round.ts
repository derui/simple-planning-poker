import { createSlice } from "@reduxjs/toolkit";
import { WritableDraft } from "immer/dist/internal";
import { newRoundSuccess, openGameSuccess } from "../actions/game";
import * as RoundAction from "../actions/round";
import * as Round from "@/domains/round";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import * as UserHand from "@/domains/user-hand";
import * as SelectableCards from "@/domains/selectable-cards";
import { UserMode } from "@/domains/game-player";

type State = "NotPrepared" | "Finished" | "ShowDownPrepared";

interface RoundState {
  // current round that opened game
  instance?: {
    id: Round.Id;
    cards: Record<number, { card: Card.T; order: number }>;
    count: number;
    hands: Record<User.Id, UserHand.T>;
    joinedPlayers: Record<User.Id, UserMode>;
    state: State;
  };
}

const initialState = {} as RoundState satisfies RoundState;

const normalize = function normalize(draft: WritableDraft<RoundState>, round: Round.T) {
  let cards: SelectableCards.T | undefined = undefined;
  if (Round.isRound(round)) {
    cards = round.selectableCards;
  }

  if (!draft.instance) {
    draft.instance = {
      id: round.id,
      cards:
        cards?.reduce<Record<number, { card: Card.T; order: number }>>((accum, card, index) => {
          accum[index] = { card, order: index };
          return accum;
        }, {}) ?? {},
      count: round.count,
      hands: round.hands,
      joinedPlayers: round.joinedPlayers.reduce<Record<User.Id, UserMode>>((accum, obj) => {
        accum[obj.user] = obj.mode;
        return accum;
      }, {}),
      state: Round.isFinishedRound(round) ? "Finished" : Round.canShowDown(round) ? "ShowDownPrepared" : "NotPrepared",
    };
  } else {
    draft.instance.id = round.id;
    draft.instance.cards =
      cards?.reduce<Record<number, { card: Card.T; order: number }>>((accum, card, index) => {
        accum[index] = { card, order: index };
        return accum;
      }, {}) ?? {};
    draft.instance.count = round.count;
    draft.instance.hands = round.hands;
    draft.instance.joinedPlayers = round.joinedPlayers.reduce<Record<User.Id, UserMode>>((accum, obj) => {
      accum[obj.user] = obj.mode;
      return accum;
    }, {});

    draft.instance.state = Round.isFinishedRound(round)
      ? "Finished"
      : Round.canShowDown(round)
      ? "ShowDownPrepared"
      : "NotPrepared";
  }
};

const slice = createSlice({
  name: "round",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(openGameSuccess, (draft, { payload }) => {
      normalize(draft, payload.game.round);
    });

    builder.addCase(RoundAction.handCardSuccess, (draft, { payload }) => {
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

    builder.addCase(RoundAction.changeUserModeSuccess, (draft, { payload }) => {
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

    builder.addCase(newRoundSuccess, (draft, { payload }) => {
      normalize(draft, payload.round);
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;