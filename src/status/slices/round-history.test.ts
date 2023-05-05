import { test, expect, describe } from "vitest";
import { getInitialState, reducer } from "./round-history";
import * as RoundAction from "@/status/actions/round";
import { randomFinishedRound } from "@/test-lib";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";

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
    const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
    const round = randomFinishedRound({ cards });
    let state = getInitialState();
    state = reducer(state, RoundAction.openFinishedRounds());
    state = reducer(state, RoundAction.openFinishedRoundsSuccess([round]));

    expect(state.rounds[round.id]).toEqual(
      expect.objectContaining({
        id: round.id,
        cards: {
          1: { card: cards[0], order: 0 },
          2: { card: cards[1], order: 1 },
        },
        estimations: {},
        averagePoint: 0,
        theme: round.theme,
      })
    );
  });
});

describe("change page", () => {
  test("start change page", () => {
    let state = getInitialState();
    state = reducer(state, RoundAction.changePageOfFinishedRounds(3));

    expect(state).toEqual({ rounds: {}, page: 1, state: { kind: "pendingPage", page: 3 } });
  });

  test("page changed", () => {
    const cards = SelectableCards.create([1].map(StoryPoint.create));
    const round = randomFinishedRound({ cards });
    const round2 = randomFinishedRound({ cards });
    let state = getInitialState();
    state = reducer(state, RoundAction.changePageOfFinishedRounds(3));
    state = reducer(state, RoundAction.changePageOfFinishedRoundsSuccess({ page: 3, rounds: [round, round2] }));

    expect(state).toEqual(
      expect.objectContaining({
        rounds: {
          [round.id]: {
            id: round.id,
            cards: {
              1: { card: cards[0], order: 0 },
            },
            estimations: {},
            averagePoint: 0,
            finishedAt: round.finishedAt,
            theme: round.theme,
          },
          [round2.id]: {
            id: round2.id,
            cards: {
              1: { card: cards[0], order: 0 },
            },
            estimations: {},
            finishedAt: round2.finishedAt,
            averagePoint: 0,
            theme: round2.theme,
          },
        },
        page: 3,
        state: "fetched",
      })
    );
  });
});

describe("current round", () => {
  test("change current round via id", () => {
    const cards = SelectableCards.create([1].map(StoryPoint.create));
    const round = randomFinishedRound({ cards });
    const round2 = randomFinishedRound({ cards });
    let state = getInitialState();
    state = reducer(state, RoundAction.changePageOfFinishedRounds(3));
    state = reducer(state, RoundAction.changePageOfFinishedRoundsSuccess({ page: 3, rounds: [round, round2] }));
    state = reducer(state, RoundAction.openRoundHistory(round2.id));

    expect(getInitialState().currentRound).toBeUndefined();
    expect(state.currentRound).toEqual({
      id: round2.id,
      cards: {
        1: { card: cards[0], order: 0 },
      },
      estimations: {},
      finishedAt: round2.finishedAt,
      averagePoint: 0,
      theme: round2.theme,
    });
  });
});
