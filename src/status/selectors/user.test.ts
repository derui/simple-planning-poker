import { test, expect, describe } from "vitest";
import { createPureStore } from "../store";
import { openGameSuccess } from "../actions/game";
import { signInSuccess } from "../actions/signin";
import * as s from "./user";
import * as User from "@/domains/user";
import * as Round from "@/domains/round";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";

import { UserMode } from "@/domains/game-player";
import { isError, isLoading } from "@/utils/loadable";
import { JoinedGameState } from "@/domains/game-repository";

const CARDS = SelectableCards.create([1, 2].map(StoryPoint.create));

test("should return current user info ", () => {
  const store = createPureStore();

  const user = User.create({ id: User.createId(), name: "foo" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: user.id,
    finishedRounds: [],
    cards: CARDS,
    round: Round.createId(),
  });

  store.dispatch(signInSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserInfo(store.getState());

  expect(ret[0]).toEqual({ userName: "foo", userMode: UserMode.normal, owner: true });
});

test("should loading with undefined when game or user is not provided", () => {
  const store = createPureStore();

  const ret = s.selectUserInfo(store.getState());

  expect(isLoading(ret)).toBe(true);
});

test("should not return value when the user was not joined before", () => {
  const store = createPureStore();

  const user = User.create({ id: User.createId("1"), name: "foo" });
  const [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: User.createId("2"),
    finishedRounds: [],
    cards: CARDS,
    round: Round.createId(),
  });

  store.dispatch(signInSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserInfo(store.getState());

  expect(isError(ret)).toBe(true);
});

describe("joined games", () => {
  test("return empty when user did not join any games before ", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(signInSuccess({ user }));

    const ret = s.selectJoinedGames(store.getState());

    expect(ret).toEqual([]);
  });

  test("return games", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(
      signInSuccess({
        user,
        joinedGames: {
          [Game.createId("id1")]: { name: "name1", state: JoinedGameState.joined },
          [Game.createId("id2")]: { name: "name2", state: JoinedGameState.joined },
        },
      })
    );

    const ret = s.selectJoinedGames(store.getState());

    expect(ret).toEqual([
      { gameId: Game.createId("id1"), name: "name1" },
      { gameId: Game.createId("id2"), name: "name2" },
    ]);
  });

  test("do not include left game", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(
      signInSuccess({
        user,
        joinedGames: {
          [Game.createId("id1")]: { name: "name1", state: JoinedGameState.joined },
          [Game.createId("id2")]: { name: "name2", state: JoinedGameState.left },
        },
      })
    );

    const ret = s.selectJoinedGames(store.getState());

    expect(ret).toEqual([{ gameId: Game.createId("id1"), name: "name1" }]);
  });
});

test("return user info that not owner ", () => {
  const store = createPureStore();

  const user = User.create({ id: User.createId(), name: "foo" });
  const owner = User.createId("owner");
  let [game] = Game.create({
    id: Game.createId(),
    name: "test",
    owner: owner,
    finishedRounds: [],
    cards: CARDS,
    round: Round.createId(),
  });

  game = Game.joinUserAsPlayer(game, user.id, Game.makeInvitation(game))[0];

  store.dispatch(signInSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserInfo(store.getState());

  expect(ret[0]).toEqual({ userName: "foo", userMode: UserMode.normal, owner: false });
});

describe("all joined games", () => {
  test("return empty when user did not join any games before ", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(signInSuccess({ user }));

    const ret = s.selectAllJoinedGames(store.getState());

    expect(ret).toEqual([]);
  });

  test("return games", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(
      signInSuccess({
        user,
        joinedGames: {
          [Game.createId("id1")]: { name: "name1", state: JoinedGameState.joined },
          [Game.createId("id2")]: { name: "name2", state: JoinedGameState.left },
        },
      })
    );

    const ret = s.selectAllJoinedGames(store.getState());

    expect(ret).toEqual([
      { gameId: Game.createId("id1"), name: "name1", state: JoinedGameState.joined },
      { gameId: Game.createId("id2"), name: "name2", state: JoinedGameState.left },
    ]);
  });
});
