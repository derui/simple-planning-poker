import { test, expect } from "vitest";
import { createPureStore } from "../store";
import { handCardSuccess, openGameSuccess } from "../actions/game";
import { tryAuthenticateSuccess } from "../actions/signin";
import * as s from "./user-hand";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as UserHand from "@/domains/user-hand";
import { randomGame } from "@/test-lib";
import { UserMode } from "@/domains/game-player";
import { isLoading } from "@/utils/loadable";

test("return undefined if game not opened", () => {
  const store = createPureStore();

  const ret = s.selectUserHandInfos()(store.getState());

  expect(isLoading(ret)).toBe(true);
});

test("return one hand from the game contains only owner", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "owner" });
  const game = randomGame({ owner: user.id, joinedPlayers: [] });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserHandInfos()(store.getState());

  expect(ret[0]).toEqual([
    {
      userName: "owner",
      userMode: UserMode.normal,
      displayValue: "?",
      selected: false,
    },
  ]);
});

test("return hands with handed user", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "owner" });
  const otherUser = User.create({ id: User.createId(), name: "other" });
  const game = randomGame({ owner: user.id, joinedPlayers: [{ user: otherUser.id, mode: UserMode.normal }] });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user, otherUser] }));
  store.dispatch(handCardSuccess(Game.acceptPlayerHand(game, otherUser.id, UserHand.handed(game.cards[0]))));

  const [ret] = s.selectUserHandInfos()(store.getState());

  expect(ret).toHaveLength(2);
  expect(ret).toContainEqual({
    userName: "owner",
    userMode: UserMode.normal,
    displayValue: "?",
    selected: false,
  });
  expect(ret).toContainEqual({
    userName: "other",
    userMode: UserMode.normal,
    displayValue: `${game.cards[0]}`,
    selected: true,
  });
});

test("give up hand", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "owner" });
  const otherUser = User.create({ id: User.createId(), name: "other" });
  const game = randomGame({ owner: user.id, joinedPlayers: [{ user: otherUser.id, mode: UserMode.normal }] });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user, otherUser] }));
  store.dispatch(handCardSuccess(Game.acceptPlayerHand(game, otherUser.id, UserHand.giveUp())));

  const [ret] = s.selectUserHandInfos()(store.getState());

  expect(ret).toHaveLength(2);
  expect(ret).toContainEqual({
    userName: "owner",
    userMode: UserMode.normal,
    displayValue: "?",
    selected: false,
  });
  expect(ret).toContainEqual({
    userName: "other",
    userMode: UserMode.normal,
    displayValue: "?",
    selected: true,
  });
});
