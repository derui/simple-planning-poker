import { test, expect, describe } from "vitest";
import { createPureStore } from "../store";
import { openGameSuccess } from "../actions/game";
import { signInSuccess } from "../actions/signin";
import * as s from "./user";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";

import { UserMode } from "@/domains/game-player";
import { isError, isLoading } from "@/utils/loadable";

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
  });

  store.dispatch(signInSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserInfo()(store.getState());

  expect(ret[0]).toEqual({ userName: "foo", userMode: UserMode.normal });
});

test("should loading with undefined when game or user is not provided", () => {
  const store = createPureStore();

  const ret = s.selectUserInfo()(store.getState());

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
  });

  store.dispatch(signInSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserInfo()(store.getState());

  expect(isError(ret)).toBe(true);
});

describe("joined games", () => {
  test("return empty when user did not join any games before ", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(signInSuccess({ user }));

    const ret = s.selectJoinedGames()(store.getState());

    expect(ret).toEqual([]);
  });

  test("return games", () => {
    const store = createPureStore();
    const user = User.create({ id: User.createId("1"), name: "foo" });
    store.dispatch(
      signInSuccess({
        user,
        joinedGames: {
          [Game.createId("id1")]: "name1",
          [Game.createId("id2")]: "name2",
        },
      })
    );

    const ret = s.selectJoinedGames()(store.getState());

    expect(ret).toEqual([
      { gameId: Game.createId("id1"), name: "name1" },
      { gameId: Game.createId("id2"), name: "name2" },
    ]);
  });
});
