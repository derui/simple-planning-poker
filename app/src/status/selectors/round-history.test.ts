import { describe, expect, test } from "vitest";
import { nextPageOfRoundHistoriesSuccess, openRoundHistoriesSuccess, openRoundHistorySuccess } from "../actions/round";
import { createPureStore } from "../store";
import { tryAuthenticateSuccess } from "../actions/signin";
import { openGameSuccess } from "../actions/game";
import { fromFinishedRound } from "../query-models/round-history";
import * as s from "./round-history";
import { randomFinishedRound, randomGame } from "@/test-lib";
import { isLoading } from "@/utils/loadable";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { estimated } from "@/domains/user-estimation";
import { UserMode } from "@/domains/game-player";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";

describe("round histories", () => {
  test("should be loading when rounds is fetching", () => {
    const store = createPureStore();

    const ret = s.selectRoundHistories(store.getState());

    expect(isLoading(ret)).toBe(true);
  });

  test("return list of finished rounds", () => {
    const store = createPureStore();
    const rounds = [
      randomFinishedRound({ finishedAt: "2023-01-01T00:00:00" }),
      randomFinishedRound({ finishedAt: "2023-01-02T00:00:00" }),
    ].map(fromFinishedRound);
    store.dispatch(openRoundHistoriesSuccess({ rounds, lastKey: "key" }));

    const ret = s.selectRoundHistories(store.getState());

    expect(isLoading(ret)).toBe(false);
    expect(ret[0]).toEqual({
      histories: [
        { id: rounds[1].id, theme: "", finishedAt: rounds[1].finishedAt, averagePoint: 0 },
        { id: rounds[0].id, theme: "", finishedAt: rounds[0].finishedAt, averagePoint: 0 },
      ],
    });
  });
});

describe("round history information", () => {
  test("return estimations with estimated user", () => {
    // Arrange
    const store = createPureStore();
    const user = User.create({ id: User.createId(), name: "owner" });
    const otherUser = User.create({ id: User.createId(), name: "other" });
    const otherUser2 = User.create({ id: User.createId(), name: "other2" });

    const cards = SelectableCards.create([1, 2, 3].map(StoryPoint.create));
    let game = randomGame({ owner: user.id, cards });
    game = Game.joinUserAsPlayer(game, otherUser.id, Game.makeInvitation(game))[0];
    game = Game.joinUserAsPlayer(game, otherUser2.id, Game.makeInvitation(game))[0];

    const round = randomFinishedRound({
      cards: game.cards,
      id: game.round,
      estimations: [
        { user: user.id, estimation: estimated(game.cards[0]) },
        { user: otherUser.id, estimation: estimated(game.cards[1]) },
        { user: otherUser2.id, estimation: estimated(game.cards[1]) },
      ],
    });

    store.dispatch(tryAuthenticateSuccess({ user }));
    store.dispatch(openGameSuccess({ game, players: [user, otherUser, otherUser2] }));
    store.dispatch(openRoundHistorySuccess(round));

    // Act
    const [ret] = s.selectOpenedRoundHistory(store.getState());

    // Assert
    expect(ret).toEqual({
      id: round.id,
      theme: "",
      finishedAt: round.finishedAt,
      results: {
        averagePoint: 1.67,
        cardCounts: [
          { point: game.cards[0], count: 1 },
          { point: game.cards[1], count: 2 },
        ],
      },
      estimations: [
        {
          displayValue: game.cards[0].toString(),
          state: "result",
          userMode: UserMode.normal,
          userName: "owner",
        },
        {
          displayValue: game.cards[1].toString(),
          state: "result",
          userMode: UserMode.normal,
          userName: "other",
        },
        {
          displayValue: game.cards[1].toString(),
          state: "result",
          userMode: UserMode.normal,
          userName: "other2",
        },
      ],
    });
  });

  test("make anonymous if user is not joined", () => {
    // Arrange
    const store = createPureStore();
    const user = User.create({ id: User.createId(), name: "owner" });
    const otherUser = User.create({ id: User.createId(), name: "other" });
    const game = randomGame({ owner: user.id });
    const round = randomFinishedRound({
      cards: game.cards,
      id: game.round,
      estimations: [{ user: otherUser.id, estimation: estimated(game.cards[0]) }],
    });

    store.dispatch(tryAuthenticateSuccess({ user }));
    store.dispatch(openGameSuccess({ game, players: [user] }));
    store.dispatch(openRoundHistorySuccess(round));

    // Act
    const [ret] = s.selectOpenedRoundHistory(store.getState());

    // Assert
    expect(ret).toEqual({
      id: round.id,
      theme: "",
      finishedAt: round.finishedAt,
      results: {
        averagePoint: game.cards[0],
        cardCounts: [{ point: game.cards[0], count: 1 }],
      },
      estimations: [
        {
          displayValue: game.cards[0].toString(),
          state: "result",
          userMode: UserMode.normal,
          userName: "unknown",
        },
      ],
    });
  });
});

describe("page of rounds", () => {
  test("return 1 when default", () => {
    // Arrange
    const store = createPureStore();

    // Act
    const ret = s.selectTopPage(store.getState());

    // Assert
    expect(ret).toBe(true);
  });

  test("make anonymous if user is not joined", () => {
    // Arrange
    const store = createPureStore();
    const user = User.create({ id: User.createId(), name: "owner" });
    const otherUser = User.create({ id: User.createId(), name: "other" });
    const game = randomGame({ owner: user.id });
    const round = randomFinishedRound({
      cards: game.cards,
      id: game.round,
      estimations: [{ user: otherUser.id, estimation: estimated(game.cards[0]) }],
    });

    store.dispatch(nextPageOfRoundHistoriesSuccess({ lastKey: "key", rounds: [fromFinishedRound(round)] }));

    // Act
    const ret = s.selectTopPage(store.getState());

    // Assert
    expect(ret).toBe(false);
  });
});
