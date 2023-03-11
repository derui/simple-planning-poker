import { test, expect, describe } from "vitest";
import { getInitialState, reducer } from "./game";
import * as GameAction from "@/status/actions/game";

import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as User from "@/domains/user";
import { UserMode } from "@/domains/game-player";
import { randomGame } from "@/test-lib";

const [GAME] = Game.create({
  id: Game.createId(),
  name: "name",
  joinedPlayers: [],
  cards: SelectableCards.create([1, 2].map(StoryPoint.create)),
  owner: User.createId(),
  finishedRounds: [],
});

test("initial state", () => {
  expect(getInitialState()).toEqual({ currentGame: null, loading: false, status: { creating: "prepared" } });
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
  const ret = reducer(getInitialState(), GameAction.changeUserModeSuccess(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

test("update game with action notifying game changes", () => {
  const ret = reducer(getInitialState(), GameAction.notifyGameChanges(GAME));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});
test("update game with action opening game", () => {
  let ret = reducer(getInitialState(), GameAction.openGame(GAME.id));
  ret = reducer(ret, GameAction.openGameSuccess({ game: GAME, players: [] }));

  expect(ret.currentGame).toBe(GAME);
  expect(ret.loading).toBe(false);
});

describe("loading", () => {
  [
    GameAction.changeUserMode(UserMode.inspector),
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

describe("states creating", () => {
  test("should set creating while game creating", () => {
    const ret = reducer(getInitialState(), GameAction.createGame({ name: "name", points: [] }));

    expect(ret.status.creating).toBe("creating");
  });
  test("should not set creating after game creating failed", () => {
    let ret = reducer(getInitialState(), GameAction.createGame({ name: "name", points: [] }));
    ret = reducer(ret, GameAction.createGameFailure({ reason: "reason" }));

    expect(ret.status.creating).toBe("failed");
  });
  test("should not set creating after game creating succeeded", () => {
    let ret = reducer(getInitialState(), GameAction.createGame({ name: "name", points: [] }));
    ret = reducer(ret, GameAction.createGameSuccess(randomGame({})));

    expect(ret.status.creating).toBe("created");
  });

  test("should return prepared when initialize action given", () => {
    let ret = reducer(getInitialState(), GameAction.createGame({ name: "name", points: [] }));
    ret = reducer(ret, GameAction.initializeCreatingGame());

    expect(ret.status.creating).toBe("prepared");
  });
});
