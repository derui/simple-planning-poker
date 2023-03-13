import { test, expect } from "vitest";
import { newRoundSuccess, openGameSuccess } from "../actions/game";
import { getInitialState, reducer } from "./round";
import { randomGame } from "@/test-lib";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as Game from "@/domains/game";
import { UserMode } from "@/domains/game-player";
import { handed } from "@/domains/user-hand";

test("initial state", () => {
  expect(getInitialState()).toEqual({});
});

test("get round as open game", () => {
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const game = randomGame({ cards });

  const ret = reducer(getInitialState(), openGameSuccess({ game, players: [] }));

  expect(ret.instance).toEqual({
    id: game.round.id,
    hands: {},
    cards: {
      [0]: { card: cards[0], order: 0 },
      [1]: { card: cards[1], order: 1 },
    },
    count: 1,
    joinedPlayers: {
      [game.owner]: UserMode.normal,
    },
    state: "NotPrepared",
  });
});

test("get round after new round", () => {
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  const game = randomGame({ cards });

  const ret = reducer(getInitialState(), newRoundSuccess(game));

  expect(ret.instance).toEqual({
    id: game.round.id,
    hands: {},
    cards: {
      [0]: { card: cards[0], order: 0 },
      [1]: { card: cards[1], order: 1 },
    },
    count: 1,
    joinedPlayers: {
      [game.owner]: UserMode.normal,
    },
    state: "NotPrepared",
  });
});

test("should finished with finished", () => {
  const cards = SelectableCards.create([1, 2].map(StoryPoint.create));
  let game = randomGame({ cards });
  game = Game.acceptPlayerHand(game, game.owner, handed(cards[0]));

  const ret = reducer(getInitialState(), openGameSuccess({ game, players: [] }));

  expect(ret.instance).toEqual({
    id: game.round.id,
    hands: {
      [game.owner]: handed(cards[0]),
    },
    cards: {
      [0]: { card: cards[0], order: 0 },
      [1]: { card: cards[1], order: 1 },
    },
    count: 1,
    joinedPlayers: {
      [game.owner]: UserMode.normal,
    },
    state: "ShowDownPrepared",
  });
});
