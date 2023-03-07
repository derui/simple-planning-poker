import { test, expect, describe } from "vitest";
import { createPureStore } from "../store";
import { openGameSuccess } from "../actions/game";
import * as s from "./game";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as UserHand from "@/domains/user-hand";
import * as Cards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import { randomGame } from "@/test-lib";

describe("select current game name", () => {
  test("should return loading when game not set", () => {
    const store = createPureStore();

    const ret = s.selectCurrentGameName()(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("should return finished with game when any game opened", () => {
    const store = createPureStore();
    const game = randomGame({});
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCurrentGameName()(store.getState());

    expect(ret).toEqual(Loadable.finished(game.name));
  });
});

describe("select current game invitation", () => {
  test("should return loading when game not set", () => {
    const store = createPureStore();

    const ret = s.selectCurrentGameInvitationLink()(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("should return finished with game when any game opened", () => {
    const store = createPureStore();
    const game = randomGame({});
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCurrentGameInvitationLink()(store.getState());

    expect(ret).toEqual(Loadable.finished(`/invitation/${Game.makeInvitation(game)}`));
  });
});

describe("select flag to be able to hold new round", () => {
  test("should return false when game not set", () => {
    const store = createPureStore();

    const ret = s.selectCanShowDown()(store.getState());

    expect(ret).toBe(false);
  });

  test("should return false if no one handed", () => {
    const store = createPureStore();
    const game = randomGame({});
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCanShowDown()(store.getState());

    expect(ret).toBe(false);
  });

  test("should return false if the round can show down", () => {
    const store = createPureStore();
    let game = randomGame({});
    game = Game.acceptPlayerHand(game, game.owner, UserHand.giveUp());
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCanShowDown()(store.getState());

    expect(ret).toBe(true);
  });

  test("should return false if the round is finished", () => {
    const store = createPureStore();
    let game = randomGame({});
    game = Game.acceptPlayerHand(game, game.owner, UserHand.giveUp());
    store.dispatch(openGameSuccess({ game: Game.showDown(game, new Date())[0], players: [] }));

    const ret = s.selectCanShowDown()(store.getState());

    expect(ret).toBe(false);
  });
});

describe("select cards", () => {
  test("return loading if game not opened", () => {
    const store = createPureStore();

    const ret = s.selectCards()(store.getState());

    expect(ret).toEqual(Loadable.loading());
  });

  test("return cards", () => {
    const store = createPureStore();
    const game = randomGame({ cards: Cards.create([1, 2, 3, 5].map(StoryPoint.create)) });
    store.dispatch(openGameSuccess({ game, players: [] }));

    const ret = s.selectCards()(store.getState());

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
