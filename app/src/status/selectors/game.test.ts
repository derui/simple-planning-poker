import { test, expect, describe } from "vitest";
import { createPureStore } from "../store";
import { openGameSuccess } from "../actions/game";
import { notifyRoundUpdated } from "../actions/round";
import { notifyOtherUserChanged } from "../actions/user";
import { tryAuthenticateSuccess } from "../actions/signin";
import * as s from "./game";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as UserEstimation from "@/domains/user-estimation";
import * as Cards from "@/domains/selectable-cards";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import * as StoryPoint from "@/domains/story-point";
import { randomGame, randomRound } from "@/test-lib";
import { UserMode } from "@/domains/game-player";

describe("select current game name", () => {
  test("should return loading when game not set", () => {
    const store = createPureStore();

    const ret = s.selectCurrentGameName(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("should return finished with game when any game opened", () => {
    const store = createPureStore();
    const game = randomGame({});
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCurrentGameName(store.getState());

    expect(ret).toEqual(Loadable.finished(game.name));
  });
});

describe("select current game invitation", () => {
  test("should return loading when game not set", () => {
    const store = createPureStore();

    const ret = s.selectCurrentGameInvitationToken(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("should return finished with game when any game opened", () => {
    const store = createPureStore();
    const game = randomGame({});
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCurrentGameInvitationToken(store.getState());

    expect(ret).toEqual(Loadable.finished(Game.makeInvitation(game)));
  });
});

describe("select flag to be able to hold new round", () => {
  test("should return false when game not set", () => {
    const store = createPureStore();

    const ret = s.selectCanShowDown(store.getState());

    expect(ret).toBe(false);
  });

  test("should return false if no one estimated", () => {
    const store = createPureStore();
    const game = randomGame({});
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCanShowDown(store.getState());

    expect(ret).toBe(false);
  });

  test("should return false if the round can show down", () => {
    const store = createPureStore();
    const game = randomGame({});
    let round: Round.T = randomRound({ id: game.round });
    round = Round.takePlayerEstimation(round, game.owner, UserEstimation.giveUp());
    store.dispatch(notifyRoundUpdated(round));

    const ret = s.selectCanShowDown(store.getState());

    expect(ret).toBe(true);
  });

  test("should return false if the round is finished", () => {
    const store = createPureStore();
    const game = randomGame({});
    let round: Round.T = randomRound({ id: game.round });
    round = Round.takePlayerEstimation(round, game.owner, UserEstimation.giveUp());
    round = Round.showDown(round as any, new Date())[0];
    store.dispatch(notifyRoundUpdated(round));

    const ret = s.selectCanShowDown(store.getState());

    expect(ret).toBe(false);
  });
});

describe("select cards", () => {
  test("return loading if game not opened", () => {
    const store = createPureStore();

    const ret = s.selectCards(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("return cards", () => {
    const store = createPureStore();
    const game = randomGame({ cards: Cards.create([1, 2, 3, 5].map(StoryPoint.create)) });
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCards(store.getState());

    expect(ret).toEqual(
      Loadable.finished([
        { display: "1", index: 0 },
        { display: "2", index: 1 },
        { display: "3", index: 2 },
        { display: "5", index: 3 },
      ])
    );
  });
});

describe("select round result", () => {
  test("return loading if game not opened", () => {
    const store = createPureStore();

    const ret = s.selectRoundResult(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("return error if game is not round finished", () => {
    const store = createPureStore();
    const game = randomGame({ cards: Cards.create([1, 2, 3, 5].map(StoryPoint.create)) });
    const round: Round.T = randomRound({ id: game.round });

    store.dispatch(openGameSuccess({ game, players: [] }));
    store.dispatch(notifyRoundUpdated(round));

    const ret = s.selectRoundResult(store.getState());

    expect(ret).toEqual(Loadable.error());
  });

  test("return error if game is not round finished", () => {
    const store = createPureStore();
    let game = randomGame({
      cards: Cards.create([1, 2, 3, 5].map(StoryPoint.create)),
    });
    let round = randomRound({ cards: game.cards, id: game.round });
    game = Game.joinUserAsPlayer(game, User.createId(), Game.makeInvitation(game))[0];
    game = Game.joinUserAsPlayer(game, User.createId(), Game.makeInvitation(game))[0];
    game = Game.joinUserAsPlayer(game, User.createId(), Game.makeInvitation(game))[0];
    store.dispatch(openGameSuccess({ game, players: [] }));

    round = Round.takePlayerEstimation(
      round as any,
      game.joinedPlayers[0].user,
      UserEstimation.estimated(game.cards[1])
    );
    round = Round.takePlayerEstimation(
      round as any,
      game.joinedPlayers[1].user,
      UserEstimation.estimated(game.cards[3])
    );
    round = Round.takePlayerEstimation(
      round as any,
      game.joinedPlayers[2].user,
      UserEstimation.estimated(game.cards[3])
    );
    round = Round.showDown(round as any, new Date())[0];
    store.dispatch(notifyRoundUpdated(round));

    const ret = s.selectRoundResult(store.getState());

    expect(ret).toEqual(
      Loadable.finished({
        average: 4,
        cardAndCounts: [
          { point: 2, count: 1 },
          { point: 5, count: 2 },
        ],
      })
    );
  });
});

describe("joined players", () => {
  test("return loading if game is not opened", () => {
    const store = createPureStore();

    const ret = s.selectJoinedPlayers(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("return joined players in game", () => {
    const store = createPureStore();

    let game = randomGame({ owner: User.createId("owner") });
    game = Game.joinUserAsPlayer(game, User.createId("player1"), Game.makeInvitation(game))[0];

    store.dispatch(openGameSuccess({ game, players: [] }));
    store.dispatch(notifyOtherUserChanged(User.create({ id: User.createId("player1"), name: "name" })));
    store.dispatch(tryAuthenticateSuccess({ user: User.create({ id: User.createId("owner"), name: "name2" }) }));

    const ret = s.selectJoinedPlayers(store.getState());

    expect(ret[0]).toHaveLength(2);
    expect(ret[0]).toEqual(
      expect.arrayContaining([
        {
          id: User.createId("owner"),
          name: "name2",
          mode: UserMode.normal,
        },
        {
          id: User.createId("player1"),
          name: "name",
          mode: UserMode.normal,
        },
      ])
    );
  });

  test("do not return player if user information did not notify", () => {
    const store = createPureStore();

    let game = randomGame({ owner: User.createId("owner") });
    game = Game.joinUserAsPlayer(game, User.createId("player1"), Game.makeInvitation(game))[0];

    store.dispatch(openGameSuccess({ game, players: [] }));
    store.dispatch(tryAuthenticateSuccess({ user: User.create({ id: User.createId("owner"), name: "name2" }) }));

    const ret = s.selectJoinedPlayers(store.getState());

    expect(ret[0]).toHaveLength(1);
    expect(ret[0]).toEqual(
      expect.arrayContaining([
        {
          id: User.createId("owner"),
          name: "name2",
          mode: UserMode.normal,
        },
      ])
    );
  });
});
