import { createSlice } from "@reduxjs/toolkit";
import * as Round from "@/domains/round";
import * as RoundAction from "@/status/actions/round";

type State = "initial" | "fetching" | "fetched" | { kind: "pendingPage"; page: number };

interface FinishedRoundState {
  readonly id: Round.Id;
  readonly theme: string | null;
  readonly finishedAt: Date;
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

const slice = createSlice({
  name: "finishedRounds",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // use builder to add reducer
    builder.addCase(RoundAction.openFinishedRounds, (draft) => {
      draft.state = "fetching";
    });

    builder.addCase(RoundAction.openFinishedRoundsSuccess, (draft, action) => {
      draft.rounds = {};
      draft.page = 1;
      draft.state = "fetched";

      for (let round of action.payload) {
        draft.rounds[round.id] = { id: round.id, theme: round.theme, finishedAt: new Date(round.finishedAt) };
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
        draft.rounds[round.id] = { id: round.id, theme: round.theme, finishedAt: new Date(round.finishedAt) };
      }
    });
  },
});

export const getInitialState = slice.getInitialState;
export const reducer = slice.reducer;
