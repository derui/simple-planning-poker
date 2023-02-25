import { test, expect, describe } from "vitest";
import { getInitialState, reducer } from "./game";
import * as GameAction from "@/status/actions/game";

import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";

const [GAME] = Game.create({
  id: Game.createId(),
  name: "name",
  joinedPlayers: [],
  cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
  owner: User.createId(),
  finishedRounds: [],
});

test("initial state", () => {
  expect(getInitialState()).toEqual({ currentGame: null, loading: false });
});

test("update game with giveUpSuccess", () => {
  const ret = reducer(getInitialState(), GameAction.giveUpSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

test("update game with handCardSuccess", () => {
  const ret = reducer(getInitialState(), GameAction.handCardSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

test("update game with change to inspector success", () => {
  const ret = reducer(getInitialState(), GameAction.changeToInspectorSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

test("update game with action changing normal player success", () => {
  const ret = reducer(getInitialState(), GameAction.changeToNormalPlayerSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

test("update game with action notifying game changes", () => {
  const ret = reducer(getInitialState(), GameAction.notifyGameChanges(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});
test("update game with action joining game", () => {
  const ret = reducer(getInitialState(), GameAction.joinGameSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});
test("update game with action opening game", () => {
  let ret = reducer(getInitialState(), GameAction.openGame(GAME.id));
  ret = reducer(ret, GameAction.openGameSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

describe("loading", () => {
  [
    GameAction.changeToInspector(),
    GameAction.changeToNormalPlayer(),
    GameAction.giveUp(),
    GameAction.handCard({ cardIndex: 0 }),
    GameAction.leaveGame(),
    GameAction.joinGame(Game.makeInvitation(GAME)),
    GameAction.openGame(GAME.id),
  ].forEach((action) => {
    test(`should set loading with ${action.type}`, () => {
      const ret = reducer(getInitialState(), action);

      expect(ret.loading).toBe(true);
    });
  });
});
