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

  store.dispatch(openGameSuccess(game));
  store.dispatch(signInSuccess(user));

  const ret = s.selectUserInfo()(store.getState());

  expect(ret).toEqual([{ userName: "foo", userMode: UserMode.normal }, "finished"]);
});

test("should loading with undefined when game or user is not provided", () => {
  const store = createPureStore();

  const ret = s.selectUserInfo()(store.getState());

  expect(ret).toEqual([undefined, "loading"]);
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

  store.dispatch(openGameSuccess(game));
  store.dispatch(signInSuccess(user));

  const ret = s.selectUserInfo()(store.getState());

  expect(ret).toEqual([undefined, "finished"]);
});
