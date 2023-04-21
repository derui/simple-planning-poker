import { test, expect, describe } from "vitest";
import { getInitialState, reducer } from "./finished-rounds";
import * as RoundAction from "@/status/actions/round";
import { randomFinishedRound } from "@/test-lib";

test("initial state", () => {
  expect(getInitialState()).toEqual({ rounds: {}, page: 1, state: "initial" });
});

describe("open rounds", () => {
  test("change state when opening", () => {
    let state = getInitialState();
    state = reducer(state, RoundAction.openFinishedRounds());

    expect(state).toEqual({ rounds: {}, page: 1, state: "fetching" });
  });

  test("update rounds", () => {
    const round = randomFinishedRound();
    let state = getInitialState();
    state = reducer(state, RoundAction.openFinishedRounds());
    state = reducer(state, RoundAction.openFinishedRoundsSuccess([round]));

    expect(state).toEqual({
      rounds: { [round.id]: { id: round.id, theme: round.theme, finishedAt: new Date(round.finishedAt) } },
      page: 1,
      state: "fetched",
    });
  });
});

describe("change page", () => {
  test("start change page", () => {
    let state = getInitialState();
    state = reducer(state, RoundAction.changePageOfFinishedRounds(3));

    expect(state).toEqual({ rounds: {}, page: 1, state: { kind: "pendingPage", page: 3 } });
  });

  test("page changed", () => {
    const round = randomFinishedRound();
    const round2 = randomFinishedRound();
    let state = getInitialState();
    state = reducer(state, RoundAction.changePageOfFinishedRounds(3));
    state = reducer(state, RoundAction.changePageOfFinishedRoundsSuccess({ page: 3, rounds: [round, round2] }));

    expect(state).toEqual({
      rounds: {
        [round.id]: { id: round.id, theme: round.theme, finishedAt: new Date(round.finishedAt) },
        [round2.id]: { id: round2.id, theme: round2.theme, finishedAt: new Date(round2.finishedAt) },
      },
      page: 3,
      state: "fetched",
    });
  });
});
