import { test, expect, describe } from "vitest";
import { fromFinishedRound } from "../query-models/round-history";
import { getInitialState, reducer } from "./round-history";
import * as RoundAction from "@/status/actions/round";
import { randomFinishedRound } from "@/test-lib";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as UserEstimation from "@/domains/user-estimation";
import * as User from "@/domains/user";

test("initial state", () => {
  expect(getInitialState()).toEqual({ rounds: {}, state: "initial", page: 1 });
});

describe("open rounds", () => {
  test("change state when opening", () => {
    let state = getInitialState();
    state = reducer(state, RoundAction.openRoundHistories());

    expect(state).toEqual({ rounds: {}, state: "fetching", page: 1 });
  });

  test("update rounds", () => {
    const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
    const round = randomFinishedRound({ cards });
    let state = getInitialState();
    state = reducer(state, RoundAction.openRoundHistories());
    state = reducer(
      state,
      RoundAction.openRoundHistoriesSuccess({ rounds: [round].map(fromFinishedRound), lastKey: "key" })
    );

    expect(state.rounds[round.id]).toEqual(fromFinishedRound(round));
    expect(state.lastKey).toBe("key");
    expect(state.page).toBe(1);
  });
});

describe("change page", () => {
  test("start change page", () => {
    let state = getInitialState();
    state = reducer(state, RoundAction.nextPageOfRoundHistories());

    expect(state).toEqual({ rounds: {}, page: 1, state: "pendingPage" });
  });

  test("page changed", () => {
    const cards = SelectableCards.create([1].map(StoryPoint.create));
    const round = randomFinishedRound({ cards });
    const round2 = randomFinishedRound({ cards });
    let state = getInitialState();
    state = reducer(state, RoundAction.nextPageOfRoundHistories());
    state = reducer(
      state,
      RoundAction.nextPageOfRoundHistoriesSuccess({ lastKey: "key", rounds: [round, round2].map(fromFinishedRound) })
    );

    expect(state).toEqual(
      expect.objectContaining({
        rounds: {
          [round.id]: fromFinishedRound(round),
          [round2.id]: fromFinishedRound(round2),
        },
        lastKey: "key",
        state: "fetched",
        page: 2,
      })
    );
  });
});

describe("current round", () => {
  test("change current round via id", () => {
    const cards = SelectableCards.create([1].map(StoryPoint.create));
    const round = randomFinishedRound({ cards });
    let state = getInitialState();
    state = reducer(state, RoundAction.openRoundHistory(round.id));
    state = reducer(state, RoundAction.openRoundHistorySuccess(round));

    expect(getInitialState().currentRound).toBeUndefined();
    expect(state.currentRound).toEqual({
      id: round.id,
      cards: {
        1: { card: cards[0], order: 0 },
      },
      estimations: {},
      finishedAt: round.finishedAt,
      averagePoint: 0,
      theme: round.theme,
    });
  });

  test("calculate average", () => {
    const cards = SelectableCards.create([1, 2, 3].map(StoryPoint.create));
    const round = randomFinishedRound({
      cards,
      estimations: [
        { user: User.createId("1"), estimation: UserEstimation.estimated(cards[0]) },
        { user: User.createId("2"), estimation: UserEstimation.estimated(cards[0]) },
        { user: User.createId("3"), estimation: UserEstimation.estimated(cards[2]) },
      ],
    });
    let state = getInitialState();
    state = reducer(state, RoundAction.openRoundHistory(round.id));
    state = reducer(state, RoundAction.openRoundHistorySuccess(round));

    expect(getInitialState().currentRound).toBeUndefined();
    expect(state.currentRound).toEqual({
      id: round.id,
      cards: {
        1: { card: cards[0], order: 0 },
        2: { card: cards[1], order: 1 },
        3: { card: cards[2], order: 2 },
      },
      estimations: {
        "1": UserEstimation.estimated(cards[0]),
        "2": UserEstimation.estimated(cards[0]),
        "3": UserEstimation.estimated(cards[2]),
      },
      finishedAt: round.finishedAt,
      averagePoint: 1.67,
      theme: round.theme,
    });
  });
});
