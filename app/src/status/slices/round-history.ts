import { createSlice } from "@reduxjs/toolkit";
import * as Round from "@/domains/round";
import * as Card from "@/domains/card";
import * as User from "@/domains/user";
import * as UserEstimation from "@/domains/user-estimation";
import * as RoundAction from "@/status/actions/round";
import * as RoundHistory from "@/status/query-models/round-history";

type State = "initial" | "fetching" | "fetched" | "pendingPage";

interface OpenedRoundHistoryState {
  readonly id: Round.Id;
  readonly cards: Record<Card.T, { card: Card.T; order: number }>;
  readonly estimations: Record<User.Id, UserEstimation.T>;
  readonly averagePoint: number;
  readonly theme: string | null;
  readonly finishedAt: string;
}

type RoundHistoryState = RoundHistory.T;

interface FinishedRoundsState {
  rounds: Record<Round.Id, RoundHistoryState>;
  currentRound: OpenedRoundHistoryState | undefined;
  lastKey?: string;
  page: number;
  state: State;
}

const initialState = {
  rounds: {},
  currentRound: undefined,
  page: 1,
  state: "initial",
} as FinishedRoundsState satisfies FinishedRoundsState;

const normalize = function normalize(round: Round.FinishedRound): OpenedRoundHistoryState {
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
    builder.addCase(RoundAction.openRoundHistories, (draft) => {
      draft.state = "fetching";
    });

    builder.addCase(RoundAction.somethingFailure, (draft) => {
      draft.rounds = {};
      delete draft.lastKey;
      draft.state = "fetched";
    });

    builder.addCase(RoundAction.openRoundHistoriesSuccess, (draft, action) => {
      draft.rounds = {};
      draft.page = 1;
      draft.state = "fetched";
      draft.lastKey = action.payload.lastKey;

      for (const round of action.payload.rounds) {
        draft.rounds[Round.createId(round.id)] = round;
      }
    });

    builder.addCase(RoundAction.nextPageOfRoundHistories, (draft) => {
      draft.state = "pendingPage";
    });

    builder.addCase(RoundAction.openRoundHistory, (draft) => {
      draft.state = "fetching";
    });

    builder.addCase(RoundAction.openRoundHistorySuccess, (draft, action) => {
      draft.state = "fetched";
      draft.currentRound = normalize(action.payload);
    });

    builder.addCase(RoundAction.nextPageOfRoundHistoriesSuccess, (draft, action) => {
      draft.rounds = {};
      draft.page = draft.page + 1;
      draft.lastKey = action.payload.lastKey;
      draft.state = "fetched";

      for (const round of action.payload.rounds) {
        draft.rounds[Round.createId(round.id)] = round;
      }
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
