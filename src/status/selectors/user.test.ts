import { test, expect } from "vitest";
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
    joinedPlayers: [],
    finishedRounds: [],
    cards: CARDS,
  });

  store.dispatch(signInSuccess(user));
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
    joinedPlayers: [],
    finishedRounds: [],
    cards: CARDS,
  });

  store.dispatch(signInSuccess(user));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserInfo()(store.getState());

  expect(isError(ret)).toBe(true);
});
