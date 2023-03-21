import { test, expect } from "vitest";
import { createPureStore } from "../store";
import { openGameSuccess } from "../actions/game";
import { tryAuthenticateSuccess } from "../actions/signin";
import { estimateSuccess } from "../actions/round";
import * as s from "./user-estimation";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as UserEstimation from "@/domains/user-estimation";
import { randomGame } from "@/test-lib";
import { UserMode } from "@/domains/game-player";
import { isLoading } from "@/utils/loadable";

test("return undefined if game not opened", () => {
  const store = createPureStore();

  const ret = s.selectUserEstimationInfos(store.getState());

  expect(isLoading(ret)).toBe(true);
});

test("return one estimation from the game contains only owner", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "owner" });
  const game = randomGame({ owner: user.id });

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user] }));

  const ret = s.selectUserEstimationInfos(store.getState());

  expect(ret[0]).toEqual([
    {
      userName: "owner",
      userMode: UserMode.normal,
      displayValue: "?",
      state: "notSelected",
    },
  ]);
});

test("return estimations with estimated user", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "owner" });
  const otherUser = User.create({ id: User.createId(), name: "other" });
  let game = randomGame({ owner: user.id });
  game = Game.joinUserAsPlayer(game, otherUser.id, Game.makeInvitation(game))[0];

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user, otherUser] }));
  store.dispatch(
    estimateSuccess(Game.acceptPlayerEstimation(game, otherUser.id, UserEstimation.estimated(game.cards[0])).round)
  );

  const [ret] = s.selectUserEstimationInfos(store.getState());

  expect(ret).toHaveLength(2);
  expect(ret).toContainEqual({
    userName: "owner",
    userMode: UserMode.normal,
    displayValue: "?",
    state: "notSelected",
  });
  expect(ret).toContainEqual({
    userName: "other",
    userMode: UserMode.normal,
    displayValue: `${game.cards[0]}`,
    state: "estimated",
  });
});

test("give up estimation", () => {
  const store = createPureStore();
  const user = User.create({ id: User.createId(), name: "owner" });
  const otherUser = User.create({ id: User.createId(), name: "other" });
  let game = randomGame({ owner: user.id });
  game = Game.joinUserAsPlayer(game, otherUser.id, Game.makeInvitation(game))[0];

  store.dispatch(tryAuthenticateSuccess({ user }));
  store.dispatch(openGameSuccess({ game, players: [user, otherUser] }));
  store.dispatch(estimateSuccess(Game.acceptPlayerEstimation(game, otherUser.id, UserEstimation.giveUp()).round));

  const [ret] = s.selectUserEstimationInfos(store.getState());

  expect(ret).toHaveLength(2);
  expect(ret).toEqual(
    expect.arrayContaining([
      {
        userName: "other",
        userMode: UserMode.normal,
        displayValue: "?",
        state: "estimated",
      },
      {
        userName: "owner",
        userMode: UserMode.normal,
        displayValue: "?",
        state: "notSelected",
      },
    ])
  );
});
