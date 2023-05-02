import { describe, expect, test } from "vitest";
import { changePageOfFinishedRoundsSuccess, openFinishedRoundsSuccess, openRoundHistory } from "../actions/round";
import { createPureStore } from "../store";
import { tryAuthenticateSuccess } from "../actions/signin";
import { openGameSuccess } from "../actions/game";
import * as s from "./finished-rounds";
import { randomFinishedRound, randomGame } from "@/test-lib";
import { isLoading } from "@/utils/loadable";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import { estimated } from "@/domains/user-estimation";
import { UserMode } from "@/domains/game-player";

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
    ];
    store.dispatch(openFinishedRoundsSuccess(rounds));

    const ret = s.selectRoundHistories(store.getState());

    expect(isLoading(ret)).toBe(false);
    expect(ret[0]).toEqual({
      histories: [
        { id: rounds[1].id, theme: "", finishedAt: new Date(rounds[1].finishedAt), averagePoint: 0 },
        { id: rounds[0].id, theme: "", finishedAt: new Date(rounds[0].finishedAt), averagePoint: 0 },
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
    let game = randomGame({ owner: user.id });
    game = Game.joinUserAsPlayer(game, otherUser.id, Game.makeInvitation(game))[0];
    const round = randomFinishedRound({
      cards: game.cards,
      id: game.round,
      estimations: [{ user: user.id, estimation: estimated(game.cards[0]) }],
    });

    store.dispatch(tryAuthenticateSuccess({ user }));
    store.dispatch(openGameSuccess({ game, players: [user, otherUser] }));
    store.dispatch(openFinishedRoundsSuccess([round]));
    store.dispatch(openRoundHistory(round.id));

    // Act
    const [ret] = s.selectOpenedRoundHistory(store.getState());

    // Assert
    expect(ret).toEqual({
      id: round.id,
      theme: "",
      finishedAt: new Date(round.finishedAt),
      results: {
        averagePoint: game.cards[0],
        cardCounts: [{ point: game.cards[0], count: 1 }],
      },
      estimations: [
        {
          displayValue: game.cards[0].toString(),
          state: "result",
          userMode: UserMode.normal,
          userName: "owner",
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
    store.dispatch(openFinishedRoundsSuccess([round]));
    store.dispatch(openRoundHistory(round.id));

    // Act
    const [ret] = s.selectOpenedRoundHistory(store.getState());

    // Assert
    expect(ret).toEqual({
      id: round.id,
      theme: "",
      finishedAt: new Date(round.finishedAt),
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
    const ret = s.selectCurrentPage(store.getState());

    // Assert
    expect(ret).toEqual(1);
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

    store.dispatch(changePageOfFinishedRoundsSuccess({ page: 3, rounds: [round] }));

    // Act
    const ret = s.selectCurrentPage(store.getState());

    // Assert
    expect(ret).toEqual(3);
  });
});
