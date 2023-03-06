import { test, expect, describe } from "vitest";
import { createPureStore } from "../store";
import { openGameSuccess } from "../actions/game";
import * as s from "./game";
import * as Loadable from "@/utils/loadable";
import * as Game from "@/domains/game";
import * as UserHand from "@/domains/user-hand";
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
