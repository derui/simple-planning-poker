import { test, expect } from "vitest";
import {
  changeToInspectorSuccess,
  changeToNormalPlayerSuccess,
  giveUpSuccess,
  handCardSuccess,
  leaveGameSuccess,
  openGameSuccess,
} from "../actions/game-player";
import { getInitialState, reducer } from "./game-player";
import * as GamePlayer from "@/domains/game-player";
import * as User from "@/domains/user";
import * as Game from "@/domains/game";
import * as SelectableCards from "@/domains/selectable-cards";
import * as StoryPoint from "@/domains/story-point";
import * as UserHand from "@/domains/user-hand";

const GAME = Game.create({
  id: Game.createId(),
  name: "",
  players: [GamePlayer.createId()],
  cards: SelectableCards.create([StoryPoint.create(1)]),
});

test("initial state", () => {
  expect(getInitialState()).toEqual({
    currentPlayer: null,
    otherPlayers: {},
  });
});

test("give up action does not affect state if current player not set-upped ", () => {
  const state = reducer(
    getInitialState(),
    giveUpSuccess(
      GamePlayer.createGamePlayer({
        id: GamePlayer.createId(),
        userId: User.createId(),
        gameId: Game.createId(),
      })
    )
  );

  expect(state.currentPlayer).toBeNull();
});

test("give up action affect state", () => {
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: GAME.id,
  });
  let state = reducer(
    getInitialState(),
    openGameSuccess({
      game: GAME,
      player,
      otherPlayers: [],
    })
  );
  state = reducer(state, giveUpSuccess(GamePlayer.giveUp(player)[0]));

  expect(state.currentPlayer?.hand).toEqual(UserHand.giveUp());
});

test("hand card action affect state", () => {
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: GAME.id,
  });
  let state = reducer(
    getInitialState(),
    openGameSuccess({
      game: GAME,
      player,
      otherPlayers: [],
    })
  );
  state = reducer(state, handCardSuccess(GamePlayer.giveUp(player)[0]));

  expect(state.currentPlayer?.hand).toEqual(UserHand.giveUp());
});

test("change to inspector action affect state", () => {
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: GAME.id,
  });
  let state = reducer(
    getInitialState(),
    openGameSuccess({
      game: GAME,
      player,
      otherPlayers: [],
    })
  );
  state = reducer(state, changeToInspectorSuccess(GamePlayer.changeUserMode(player, GamePlayer.UserMode.inspector)[0]));

  expect(state.currentPlayer?.mode).toEqual(GamePlayer.UserMode.inspector);
});

test("change to normal player action affect state", () => {
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: GAME.id,
  });
  let state = reducer(
    getInitialState(),
    openGameSuccess({
      game: GAME,
      player,
      otherPlayers: [],
    })
  );
  state = reducer(state, changeToInspectorSuccess(GamePlayer.changeUserMode(player, GamePlayer.UserMode.inspector)[0]));
  state = reducer(state, changeToNormalPlayerSuccess(GamePlayer.changeUserMode(player, GamePlayer.UserMode.normal)[0]));

  expect(state.currentPlayer?.mode).toEqual(GamePlayer.UserMode.normal);
});

test("leave game", () => {
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId(),
    userId: User.createId(),
    gameId: GAME.id,
  });
  let state = reducer(
    getInitialState(),
    openGameSuccess({
      game: GAME,
      player,
      otherPlayers: [],
    })
  );
  state = reducer(state, leaveGameSuccess());

  expect(state.currentPlayer).toBeNull();
  expect(state.otherPlayers).toEqual({});
});

test("select game", () => {
  const player = GamePlayer.createGamePlayer({
    id: GamePlayer.createId("0"),
    userId: User.createId("id1"),
    gameId: GAME.id,
  });
  const otherPlayer = GamePlayer.createGamePlayer({
    id: GamePlayer.createId("1"),
    userId: User.createId("id2"),
    gameId: GAME.id,
  });
  const state = reducer(
    getInitialState(),
    openGameSuccess({
      game: GAME,
      player,
      otherPlayers: [otherPlayer],
    })
  );

  expect(state.currentPlayer).toEqual(player);
  expect(state.otherPlayers).toEqual({ [otherPlayer.id]: otherPlayer });
});
