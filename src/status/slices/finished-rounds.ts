import { createSlice } from "@reduxjs/toolkit";
import * as Round from "@/domains/round";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import * as UserEstimation from "@/domains/user-estimation";
import * as RoundAction from "@/status/actions/round";

type State = "initial" | "fetching" | "fetched" | { kind: "pendingPage"; page: number };

interface FinishedRoundState {
  readonly id: Round.Id;
  readonly cards: Record<Card.T, { card: Card.T; order: number }>;
  readonly estimations: Record<User.Id, UserEstimation.T>;
  readonly averagePoint: number;
  readonly theme: string | null;
  readonly finishedAt: string;
}

interface FinishedRoundsState {
  rounds: Record<Round.Id, FinishedRoundState>;
  page: number;
  state: State;
}

const initialState = {
  rounds: {},
  page: 1,
  state: "initial",
} as FinishedRoundsState satisfies FinishedRoundsState;

const normalize = function normalize(round: Round.FinishedRound): FinishedRoundState {
  return {
    id: round.id,
    cards:
      round.cards.reduce<Record<Card.T, { card: Card.T; order: number }>>((accum, card, index) => {
        accum[card] = { card, order: index };
        return accum;
      }, {}) ?? {},
    estimations: round.estimations,
    averagePoint: Round.calculateAverage(round),
    theme: round.theme,
    finishedAt: round.finishedAt,
  };
};

const slice = createSlice({
  name: "finishedRounds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer
    builder.addCase(RoundAction.openFinishedRounds, (draft) => {
      draft.state = "fetching";
    });

    builder.addCase(RoundAction.somethingFailure, (draft) => {
      draft.rounds = {};
      draft.page = 1;
      draft.state = "fetched";
    });

    builder.addCase(RoundAction.openFinishedRoundsSuccess, (draft, action) => {
      draft.rounds = {};
      draft.page = 1;
      draft.state = "fetched";

      for (let round of action.payload) {
        draft.rounds[round.id] = normalize(round);
      }
    });

    builder.addCase(RoundAction.changePageOfFinishedRounds, (draft, action) => {
      draft.state = { kind: "pendingPage", page: action.payload };
    });

    builder.addCase(RoundAction.changePageOfFinishedRoundsSuccess, (draft, action) => {
      draft.rounds = {};
      draft.page = action.payload.page;
      draft.state = "fetched";

      for (let round of action.payload.rounds) {
        draft.rounds[round.id] = normalize(round);
      }
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
